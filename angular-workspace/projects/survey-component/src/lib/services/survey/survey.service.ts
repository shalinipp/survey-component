import { Injectable, EventEmitter } from '@angular/core';
import { AlertService } from '../alert/alert.service';

export interface SurveyComponentConfig {
  categories: any[];
  items: any[];
  itemCollection: any[];
  esurv: 'client' | 'operations';
}

export function setConfig(configOptions: SurveyComponentConfig) {
  configurations = configOptions;
};

let configurations!: SurveyComponentConfig;

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  updatedItemCollectionEmitter: EventEmitter<Record<string, any>> = new EventEmitter();
  moveCats: Record<string, any> = {};
  listRoomId = 1;
  listRoomOrder = 2;

  constructor(
    public alert: AlertService,
  ) { }

  get config() {
    return configurations;
  }

  ngOnInit(): void { }
  
  organiseItemCategories(item: Record<string, any>, wholeCats?: any[]) {
    if(!item['sub_category_id']) {
      if(!wholeCats) wholeCats = this.config.categories.filter((cat: Record<string, any>)=>cat['status']);
      const fcat = wholeCats.find((cat: Record<string, any>)=>cat['category_id']===item['item_category_id']);
      if(fcat) {
        item['sub_category_id'] = fcat.category_id;
        if(fcat.parent_category_id) item['item_category_id'] = fcat.parent_category_id;
      }
    }
    return item;
  }
  searchItems(event: any, ssel: HTMLIonListElement) {
    if(event.target.value) ssel.style.display = 'block';
    else ssel.style.display = 'none';
  }

  addItem(item: Record<string, any>, subCategory? : Record<string, any>, category?: Record<string, any>) {
    try {
      let message;
      const aritems: any[] = [];
      const sfitem = this.config.itemCollection.find((fitem: Record<string, any>)=>fitem['list_item_id']===item['item_id']);
      if(!sfitem) {
        item['list_room_id'] = this.listRoomId;
        item['list_room_order'] = this.listRoomOrder;
        item['list_item_id'] = item['item_id'];
        item['list_status'] = true;
        item['list_item_qty'] = 0;
        message = item['item_description']+' added';
        if(subCategory) item['item_sub_category_id'] = subCategory['category_id'];
        if(category) item['item_category_id'] = category['category_id'];
      }
      if(item['list_status']) {
        const ritems: any[] = [];
        this.config.itemCollection.map((sitem: Record<string, any>, index: number) => {
          if (sitem['list_item_id'] === item['list_item_id']) {
            sitem['sindex'] = index;
            aritems.push(sitem);
            if (!sitem['list_status']) ritems.push(sitem);
          }
        });
        if(ritems.length) this.config.itemCollection[ritems[0].sindex].list_status = true;
        else {
          const newItem = { ...item };
          delete newItem['list_id'];
          delete newItem['list_item_pin'];
          delete newItem['vendor_list_id'];
          delete newItem['sindex'];
          this.config.itemCollection.push(newItem);
        }
      } else item['list_status'] = true;
      item['list_item_qty']++;
      aritems.map(aritem=>this.config.itemCollection[aritem.sindex].list_item_qty=item['list_item_qty']);
      this.addCatItem(item);
      console.log('dd', this.config.itemCollection);
      // this.expandCategory(item['item_category_id']);
      this.updatedItemCollectionEmitter.emit(this.config.itemCollection);
      if(message) this.alert.presentToast(message, 'bottom')
    }
    catch (e) {
      this.alert.presentError(e, 'bottom');
      throw e;
    }
  }
  addCatItem(item: Record<string, any>) {
    if (!this.moveCats[item['item_category_id']]) this.moveCats[item['item_category_id']] = {
      ...this.config.categories.find((cat: Record<string, any>) => item['item_category_id'] === cat['category_id']),
      items: {}
    };
    const fcat = this.moveCats[item['item_category_id']];
    if (!fcat.items[item['list_item_id']]) fcat.items[item['list_item_id']] = item;
  }

  reduceItem(item: any) {
    try {
      let iCount = 0;
      const ritems: Record<string, any> = { superior: [], inferior: [] };
      this.config.itemCollection.map((sitem: Record<string, any>, index: number) => {
        if (sitem['list_item_id'] === item['list_item_id']) {
          iCount++;
          if (sitem['list_status']) {
            sitem['sindex'] = index;
            if (sitem['list_id'] || sitem['vendor_list_id']) ritems['superior'].push(sitem);
            else ritems['inferior'].push(sitem);
          }
        }
      });
      if (ritems['inferior'].length) {
        this.config.itemCollection.splice(ritems['inferior'][ritems['inferior'].length - 1].sindex, 1);
        iCount--;
      } else if (ritems['superior'].length) {
        this.config.itemCollection[ritems['superior'][ritems['superior'].length - 1].sindex].list_status = false;
      }
      item['list_item_qty']--;
      this.updatedItemCollectionEmitter.emit(this.config.itemCollection);
      this.removeCatItem(item);
      return !iCount;
    }
    catch (e) {
      this.alert.presentError(e, 'bottom');
      throw e;
    }
  }
  removeCatItem(item: Record<string, any>, remove?: boolean) {
    if (remove) delete this.moveCats[item['item_category_id']].items[item['list_item_id']];
    Object.keys(this.moveCats).map(
      (key) => (!Object.values(this.moveCats[key].items).length) ? delete this.moveCats[key] : null
    );
  }

}





