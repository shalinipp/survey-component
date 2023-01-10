import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AlertController, ToastController, AlertOptions, ModalController, NavController } from '@ionic/angular';
import { SubcatsComponent } from './subcats/subcats.component';
import { SurveyService, SurveyComponentConfig } from './survey.service'
import { SurveyComponent } from './survey/survey.component';

@Component({
  selector: 'lib-survey-component',
  templateUrl: './survey-component.component.html',
  styleUrls: ['./survey-component.component.scss']
})
export class SurveyComponentComponent implements OnInit {

  @Input() config!: SurveyComponentConfig;
  @Output() updatedItemCollectionEmitter: EventEmitter<Record<string, any>> = this.surveyor.updatedItemCollectionEmitter;

  moveCats: Record<string, any> = {};
  listRoomId = 1;
  listRoomOrder = 2;
  silSurvey: any;
  openCats = [];
  searchit='' ;
  silcats: any;
  silitems: any;
  modelData: any;
  newEmit: any;
  
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public nav: NavController,
    public surveyor: SurveyService
  ) { }

  ngOnInit(): void {
    this.surveyor.config = this.config;
    this.config.survey_item_collection.map((sitem: Record<string, any>)=>this.addCatItem(sitem));
    this.expandCategory(Object.values(this.moveCats)[0]);
  }
 
  arrOfItems = (listItemId: any) => this.config.survey_item_collection?.filter((sitem: { list_item_id: any; }) => sitem.list_item_id === listItemId);

  expandCategory = (catid: number) => this.openCats.push('category' + catid as never);
  
  objectValues = (obj: Record<string, any>) => Object.values(obj);
  
  countOfItems = (listItemId: any) => this.config.survey_item_collection?.filter((sitem: { list_item_id: any; list_status: any; }) => sitem.list_item_id === listItemId && sitem.list_status).length;
  
  searchItems(event: any) {
    const ssel: any = document.getElementById('searchSelect');
    const list:any = document.getElementById('searchList');
    list.innerHTML = '';
    this.config.items
    .map((item: Record<string, any>) => {
      if (
        item['item_status'] &&
        item['item_parent_id'] &&
        (
          item['item_description'].toLowerCase().includes(event.target.value.toLowerCase()) ||
          ( item['item_alias'] && item['item_alias'].toLowerCase().includes(event.target.value.toLowerCase()) )
        )
      ) {
        const li = document.createElement('li');
        li.value = item['item_id'];
        li.innerHTML = item['item_description'];
        li.style.margin = '2px 0';
        li.classList.add('nowrap');
        li.onclick = () => {
          try {
            const sfitem = this.config.survey_item_collection.find((fitem: Record<string, any>)=>fitem['list_item_id']===item['item_id']);
            if(sfitem) {
              if(!sfitem.list_status) this.surveyor.addItem(sfitem);
              else this.presentToast('Item already added', 'bottom');
            } else {
              item = this.organiseItemCategories(item, this.config.categories);
              item['list_item_id'] = item['item_id'];
              item['list_room_id'] = this.listRoomId;
              item['list_room_order'] = this.listRoomOrder;
              // item['list_status'] = true;
              item['list_item_qty'] = 1;
              this.surveyor.addItem(item);
              this.presentToast(item['item_description']+' added', 'bottom');
              this.expandCategory(item['item_category_id']);
            }
          } catch (error) {
            this.presentToast( 'bottom');
          }
        };
        list.appendChild(li);
      }
    });
    if(event.target.value) ssel.style.display = 'block';
    else ssel.style.display = 'none';
  }

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
      this.presentAlert({
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

  presentAlert = async (alertOptions: AlertOptions) => (await this.alertCtrl.create(alertOptions)).present();

  async presentToast(msg: string, position: 'top' | 'bottom' | 'middle' = 'top', color = 'dark') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position,
      color,
    });
    if(position==='bottom') toast.cssClass = 'defaultToastAtBottom';
    toast.present();
  }

  organiseItemCategories(item: Record<string, any>, wholeCats: any[]) {
    if(!item['sub_category_id']) {
      if(!wholeCats) wholeCats = this.config.categories.filter((cat: Record<string, any>)=>cat['status']);
      const fcat = wholeCats.find((cat: Record<string, any>)=>cat['category_id']===item['item_category_id']);
      if(fcat) {
        item['sub_category_id'] = fcat.category_id;
        if (fcat.parent_category_id) item['item_category_id'] = fcat.parent_category_id;
      }
    }
    return item;
  }

  addCatItem(item: Record<string, any>) {
    if (!this.moveCats[item['item_category_id']]) this.moveCats[item['item_category_id']] = {
      ...this.config.categories.find((cat: Record<string, any>) => item['item_category_id'] === cat['category_id']),
      items: {}
    };
    const fcat = this.moveCats[item['item_category_id']];
    if (!fcat.items[item['list_item_id']]) fcat.items[item['list_item_id']] = item;
  }
  removeCatItem(item: Record<string, any>, remove?: boolean) {
    if (remove) delete this.moveCats[item['item_category_id']].items[item['list_item_id']];
    Object.keys(this.moveCats).map(
      (key) => (!Object.values(this.moveCats[key].items).length) ? delete this.moveCats[key] : null
    );
  }

  showSelSubcats1() {
    const unique = this.config.categories.filter((a: Record<string, any>) => a['parent_category_id'] === null);
    this.createNewExploModal(unique)
  }

  async createNewExploModal(unique: any){
    const modal = await this.modalCtrl.create({
      component: SurveyComponent,
      componentProps: {
        unique
      }
    });
   return await modal.present();
  }
  
  async createSelSubsModal(category: Record<string, any>) {
    const modal = await this.modalCtrl.create({
      backdropDismiss:true,
      component: SubcatsComponent,
      componentProps: {
        parent_cat_id: category['category_id'],
        parent_cat_name: category['category_name'],
        subcats: this.surveyor.getSubCats(category)
      },
    });
    return await modal.present();
  }

}