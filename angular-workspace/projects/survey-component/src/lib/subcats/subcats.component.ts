import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemPageComponent } from '../item-page/item-page.component';

@Component({
  selector: 'lib-subcats',
  templateUrl: './subcats.component.html',
  styleUrls: ['./subcats.component.scss']
})

export class SubcatsComponent implements OnInit {

  @Input() subcats!: any[];
  @Input() parent_cat_id: string | undefined;
  @Input() parent_cat_name: string | undefined;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit(): void {
    console.log( 'efdf',this.subcats);
  }

  async itemModal(subcat: Record<string, any>) {
    const modal = await this.modalCtrl.create({
      component: ItemPageComponent,
      backdropDismiss: true,
      componentProps: {
        subcat_id: subcat['category_id'],
        subcat_name: subcat['category_name'],
        items: subcat['items']
      }
    });
    await modal.present();
  }

}
