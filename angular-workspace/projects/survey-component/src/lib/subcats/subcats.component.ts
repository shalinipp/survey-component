import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ItemPageComponent } from '../item-page/item-page.component';

import { SurveyService } from '../survey.service';

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
    private modalCtrl: ModalController,
    private surveyor: SurveyService
  ) { }

  ngOnInit(): void {}

  showItems(subcat: Record<string, any>) {
    const subcat_id: number = subcat['category_id'];
    const subcat_name: string = subcat['category_name'];
    let cats1 = this.surveyor.config.items.filter((item: any) => item.item_status)
    let cats2 = cats1.filter((item: any) => {
      if (item.item_sub_category_id && item.item_sub_category_id === subcat_id) { return item; }
      else if (item.item_category_id == subcat_id) { return item; }
    })
    let cats3 = cats2.map((item: any) => {
      let qty: number;
      const sicin = this.surveyor.config.survey_item_collection.findIndex((sit: any) => sit.list_item_id === item.item_id);
      if (sicin >= 0) { qty = this.surveyor.config.survey_item_collection[sicin].list_item_qty; }
      else { qty = 0; }
      item.item_category_id = this.parent_cat_id;
      item.item_sub_category_id = subcat_id;
      item.list_item_id = item.item_id;
      item.list_room_id = 1;
      item.list_room_order = 2;
      item.list_room_label = null;
      item.list_item_qty = 0;
      return item;
    })
    const send_items = JSON.parse(
      JSON.stringify(cats3
      ))
    // this.ItemModal(subcat_id, subcat_name, send_items);
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
    modal.onDidDismiss().then((res) => {
      const ret = JSON.parse(res.data.data);
      this.subcats.find((subcat) => subcat.category_id === ret.subcat_id).category_badge = ret.itnum;
    });
  }

}
