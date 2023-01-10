import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemPageComponent } from '../item-page/item-page.component';
import { SubcatsComponent } from '../subcats/subcats.component';
import { SurveyService } from '../survey.service';

@Component({
  selector: 'lib-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  @Input() parent_cat_id: string | undefined;
  @Input() parent_cat_name: string | undefined;
  @Input() unique: any;

  constructor(
    private modalCtrl: ModalController,
    private surveyor: SurveyService
  ) { }

  ngOnInit(): void {}

  async createSubsModal(category: Record<string, any>) {
    const modal = await this.modalCtrl.create({
      backdropDismiss:false,
      component: SubcatsComponent,
      componentProps: {
        parent_cat_id: category['category_id'],
        parent_cat_name: category['category_name'],
        subcats: this.surveyor.getSubCats(category)
      },
    });
    await modal.present();
    modal.onDidDismiss().then((res) => {
      const ret = JSON.parse(res.data.data);
      this.unique.find((cat:any)=>cat.category_id===ret.parent_cat_id).category_badge = ret.subnum;
    });
  }
}
