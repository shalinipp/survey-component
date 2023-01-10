import { Injectable, EventEmitter } from '@angular/core';

export interface SurveyComponentConfig {
  categories: any[];
  items: any[];
  survey_item_collection: any[];
  esurv: 'client' | 'operations';
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  config!: SurveyComponentConfig;
  updatedItemCollectionEmitter: EventEmitter<Record<string, any>> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

  getSubCats(category: Record<string, any>) {
    // const subcats_send = this.config.categories
    // .filter((cat: Record<string, any>) => cat['parent_category_id']===category['category_id'])
    // .filter((cat: Record<string, any>) => cat['status'])
    // .map((cat: Record<string, any>) =>{
    //   cat['category_badge']=0;
    //   console.log('cat ', cat);
    //   return cat;
    // });
    // this.config.survey_item_collection
    // .filter((item: any)=>item.item_category_id===category['category_id'])
    // .map((item: any)=>{
    //   this.config.categories.find((cat: any)=>cat['category_id']===item.item_sub_category_id).category_badge += +item.list_item_qty;
    // });
    // return subcats_send;
    let c = 0;
    const subCats = [];
    while(c<this.config.categories.length) {
      const tracat = this.config.categories[c];
      if(tracat.parent_category_id===category['category_id']) {
        tracat.items = [];
        tracat.category_badge = 0;
        let i = 0;
        while(i<this.config.items.length) {
          const item = this.config.items[i];
          if(item.item_category_id===tracat['category_id']) {
            item.item_category_id = category['category_id'];
            item.item_sub_category_id = tracat['category_id'];
            const sitem = this.config.survey_item_collection.find(fit=>fit.item_id===item.list_item_id);
            if(sitem) {
              item.list_item_qty = sitem.list_item_qty;
              tracat.category_badge += sitem.list_item_qty;
            }
            tracat.items.push(item);
          }
          i++;
        }
        subCats.push(tracat);
      }
      c++;
    }
    return subCats;
  }
  
  addItem(item:  Record<string,any>) {
    try {
      if(item['list_status']) {
        const ritems = this.config.survey_item_collection.filter((sitem: Record<string, any>, index: number) => {
          if (sitem['list_item_id'] === item['list_item_id'] && !sitem['list_status']) { sitem['sindex'] = index; return true; }
          else return false;
        });
        if (ritems.length) this.config.survey_item_collection[ritems[0].sindex].list_status = true;
        else {
          const newItem = { ...item };
          delete newItem['list_id'];
          delete newItem['list_item_pin'];
          delete newItem['vendor_list_id'];
          delete newItem['sindex'];
          this.config.survey_item_collection.push(newItem);
        }
      } else item['list_status'] = true;
      item['list_item_qty']++;
      console.log(this.config.survey_item_collection);
      return true;
      // this.testDataEvent.emit(this.config.survey_item_collection);
    }  
    catch (e) {
      throw e;
    }
  }

  reduceItem(item: any) {
    try {
      let iCount = 0;
      const ritems: Record<string, any> = { superior: [], inferior: [] };
      this.config.survey_item_collection.map((sitem: Record<string, any>, index: number) => {
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
        this.config.survey_item_collection.splice(ritems['inferior'][ritems['inferior'].length - 1].sindex, 1);
        iCount--;
      } else if (ritems['superior'].length) {
        this.config.survey_item_collection[ritems['superior'][ritems['superior'].length - 1].sindex].list_status = false;
      }
      item['list_item_qty']--;
      // this.testDataEvent.emit(this.config.survey_item_collection);
      return !iCount;
    }
    catch (e) {
      throw e;
    }
  }
  
}





