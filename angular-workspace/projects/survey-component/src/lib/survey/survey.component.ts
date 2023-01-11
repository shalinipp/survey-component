import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SubcatsComponent } from '../subcats/subcats.component';
import { SurveyService } from '../services/survey/survey.service';

@Component({
  selector: 'lib-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  @Input() categories: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void { console.log(this.categories)}

  async createSubsModal(category: Record<string, any>) {
    const modal = await this.modalCtrl.create({
      component: SubcatsComponent,
      componentProps: {
        parent_cat_id: category['category_id'],
        parent_cat_name: category['category_name'],
        subcats: category['sub_categories']
      },
    });
    await modal.present();
  }
}
