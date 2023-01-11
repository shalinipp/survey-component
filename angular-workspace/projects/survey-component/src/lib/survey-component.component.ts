import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SubcatsComponent } from './subcats/subcats.component';
import { SurveyService } from './services/survey/survey.service';
import { SurveyComponent } from './survey/survey.component';

@Component({
  selector: 'lib-survey-component',
  templateUrl: './survey-component.component.html',
  styleUrls: ['./survey-component.component.scss']
})
export class SurveyComponentComponent implements OnInit {

  @Output() updatedItemCollectionEmitter: EventEmitter<Record<string, any>> = this.surveyor.updatedItemCollectionEmitter;

  silSurvey: any;
  openCats = [];
  searchit='' ;
  silcats: any;
  silitems: any;
  modelData: any;
  newEmit: any;
  
  constructor(
    private modalCtrl: ModalController,
    public surveyor: SurveyService
  ) { }

  ngOnInit(): void {
    this.surveyor.config.itemCollection.map((sitem: Record<string, any>)=>this.surveyor.addCatItem(sitem));
    this.expandCategory(Object.values(this.surveyor.moveCats)[0]);
  }
 
  arrOfItems = (listItemId: any) => this.surveyor.config.itemCollection?.filter((sitem: { list_item_id: any; }) => sitem.list_item_id === listItemId);

  expandCategory = (catid: number) => this.openCats.push('category' + catid as never);
  
  objectValues = (obj: Record<string, any>) => Object.values(obj);
  
  countOfItems = (listItemId: any) => this.surveyor.config.itemCollection?.filter((sitem: { list_item_id: any; list_status: any; }) => sitem.list_item_id === listItemId && sitem.list_status).length;
  
  openItem(openItemId: string) {
    const items = this.arrOfItems(openItemId);
    if (items?.length) {
      let body = `<div>`;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < items.length; i++) {
        const litem = items[i];
        body += `
          <div class="itails-inner ${(litem.list_id || litem.vendor_list_id) ? (!litem.list_status ? 'inil' : '') : 'iadded'}">
            <div>
              <img class="silitem_icon" src="assets/icons/item_${litem.item_code}.png">
            </div>
            <div class="itxt">
              <span><strong>${litem.item_description}</strong></span>
            </div>
          </div>
        `;
      }
      body += `</div>`;
      this.surveyor.alert.presentAlert({
        message: body,
        cssClass: 'sub-item-content',
        mode: 'ios',
        buttons: [
          {
            text: 'Close',
            role: 'cancel'
          }
        ]
      });
    }
  }

  async exploreCategories() {
    const modal = await this.modalCtrl.create({
      component: SurveyComponent,
      componentProps: {
        categories: this.surveyor.config.categories
      }
    });
   return await modal.present();
  }

  searchIncludes(item: Record<string, any>, search: string | null | undefined) {
    return (
      item['item_description'].toLowerCase().includes(search?.toLowerCase()) ||
      item['item_alias']?.toLowerCase().includes(search?.toLowerCase())
    )
  }

  async openSubcat(category: Record<string, any>) {
    const modal = await this.modalCtrl.create({
      backdropDismiss:true,
      component: SubcatsComponent,
      componentProps: {
        parent_cat_id: category['category_id'],
        parent_cat_name: category['category_name'],
        subcats: category['sub_categories']
      },
    });
    return await modal.present();
  }

}