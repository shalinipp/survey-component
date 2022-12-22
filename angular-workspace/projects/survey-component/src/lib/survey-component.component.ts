import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { lastValueFrom } from 'rxjs';
import {  AlertOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'lib-survey-component',
  templateUrl: './survey-component.component.html',
  styleUrls: ['./survey-component.component.scss']
})
export class SurveyComponentComponent implements OnInit  {
  @Output() testDataEvent =new EventEmitter<string>();
  @Input() categories: any;
  @Input() itemCollection: any;
  catwall:any;

  @Input() survey_item_collection: any;
  
   @Input() openCats: any;
  // openCats: Record<string, any> = {};
  amove: any;
  wholeCats: any;
  listRoomId = 1;
  listRoomOrder = 2;
  // activityIndex: number;
 searchit='' ;
  @Input() seedDataSubject: any;
  moveCats: Record<string, any> = {};


 
  constructor(private toastCtrl: ToastController,
    private alertCtrl: AlertController
    ) {
     
    }


  // @Input() wholeItemsClient: any;
  // clientItems: any;
  // openCats = [];
  // @Input() silcatsClient : any;
  // silsurvey: Record<string, any>= {};
  // silcats: any;
  // @Input() silSurveyClient: any;

 

// constructor(){

// }

ngOnInit(): void {
  this.testDataEvent.emit(this.survey_item_collection);
  console.log('shdg',this.testDataEvent)
  this.categories.subscribe((res: any)=>{
    this.wholeCats=res;
  });
  this.survey_item_collection.map((sitem: Record<string, any>)=>this.addCatItem(sitem));
this.itemCollection.subscribe((res:any)=>{
  this.catwall=res;
})
  //   this.wholeItemsClient.subscribe((res: any)=>{
  //     this.clientItems= res;
  //     console.log('jshjdb',this.clientItems);
  //   });

   
  // this.populateBadges(this.silcats,this.silsurvey);
  // this.expandCategory(this.silcats[0].category_id,);
   
  }
  objectValues = (obj: Record<string, any>) => Object.values(obj);

  expandCategory = (catId: number) => this.openCats.push(('category'+catId));

  addCatItem(item: Record<string, any>) { 
    if(!this.moveCats[item['item_category_id']]) this.moveCats[item['item_category_id']] = {
      ...this.wholeCats.find((cat: Record<string, any>)=>item['item_category_id']===cat['category_id']),
      items: {}
    };
    const fcat = this.moveCats[item['item_category_id']];
    if(!fcat.items[item['list_item_id']]) fcat.items[item['list_item_id']] = item;
  }

  removeCatItem(item: Record<string, any>, remove?: boolean) {
    if(remove) delete this.moveCats[item['item_category_id']].items[item['list_item_id']];
    Object.keys(this.moveCats).map(
      (key)=>(!Object.values(this.moveCats[key].items).length)?delete this.moveCats[key]:null
    );
  }
  arrOfItems = (listItemId: any) => this.survey_item_collection?.filter((sitem: { list_item_id: any; })=>sitem.list_item_id===listItemId);

  countOfItems = (listItemId: any) => this.survey_item_collection?.filter((sitem: { list_item_id: any; list_status: any; })=>sitem.list_item_id===listItemId && sitem.list_status).length;

  addItem(item: Record<string, any>) {
    try {
      if(item['list_status']) {
        const ritems = this.survey_item_collection.filter((sitem: Record<string, any>, index: number)=> {
          if (sitem['list_item_id']===item['list_item_id'] && !sitem['list_status']) { sitem['sindex'] = index; return true; }
          else return false;
        });
        if(ritems.length) this.survey_item_collection[ritems[0].sindex].list_status = true;
        else {
          const newItem = {...item};
          delete newItem['list_id'];
          delete newItem['list_item_pin'];
          delete newItem['vendor_list_id'];
          delete newItem['sindex'];
          this.survey_item_collection.push(newItem);
        }
      } else item['list_status'] = true;
      item['list_item_qty']++;
      this.testDataEvent.emit(this.survey_item_collection);
      this.addCatItem(item);
    } catch (e) {
    }
  }

  removeItem(item: Record<string, any>) {
    try {
      let iCount = 0;
      const ritems: Record<string, any> = {superior:[], inferior:[]};
      this.survey_item_collection.map((sitem: Record<string, any>, index: number)=> {
        if (sitem['list_item_id']===item['list_item_id']) {
          iCount++;
          if(sitem['list_status']) {
            sitem['sindex'] = index;
            if(sitem['list_id'] || sitem['vendor_list_id']) ritems['superior'].push(sitem);
            else ritems['inferior'].push(sitem);
          }
        }
      });
      if(ritems['inferior'].length) {
        this.survey_item_collection.splice(ritems['inferior'][ritems['inferior'].length-1].sindex, 1);
        iCount--;
      } else if(ritems['superior'].length) {
        this.survey_item_collection[ritems['superior'][ritems['superior'].length-1].sindex].list_status = false;
      }
      item['list_item_qty']--;
      this.testDataEvent.emit(this.survey_item_collection);
      this.removeCatItem(item, !iCount);
    } catch (e) {
    }
  }

  

searchItems(event: any) {
    const ssel: any = document.getElementById('searchSelect');
    const list:any = document.getElementById('searchList');
    list.innerHTML = '';
    this.catwall
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
            const sfitem = this.survey_item_collection.find((fitem: Record<string, any>)=>fitem['list_item_id']===item['item_id']);
            if(sfitem) {
              if(!sfitem.list_status) this.addItem(sfitem);
              else this.presentToast('Item already added', 'bottom');
            } else {
              item = this.organiseItemCategories(item, this.wholeCats);
              item['list_room_id'] = this.listRoomId;
              item['list_room_order'] = this.listRoomOrder;
              item['list_item_id'] = item['item_id'];
              item['list_status'] = true;
              item['list_item_qty'] = 1;
              this.addItem(item);
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
    console.log('hit');
    const items = this.arrOfItems(openItemId);
    if(items?.length) {
      let body = `<div>`;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0 ; i<items.length ; i++) {
        const litem = items[i];
        body+= `
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
      if(!wholeCats) wholeCats = this.wholeCats.value.Categories.data.filter((cat: Record<string, any>)=>cat['status']);
      const fcat = wholeCats.find((cat: Record<string, any>)=>cat['category_id']===item['item_category_id']);
      if(fcat) {
        item['sub_category_id'] = fcat.category_id;
        if (fcat.parent_category_id) item['item_category_id'] = fcat.parent_category_id;
      }
    }
    return item;
  }
}

  //ngOnChanges(){
  //   this.silcatsClient.subscribe((res : any) =>  {
  //     this.silcats = res;
  //     console.log('hxsgsyfyw',this.silcats);
  //   });
  //   this.silSurveyClient.subscribe((res:any) =>{
  //     this.silsurvey =res;
  //     console.log('hxsvfvfffbfffffffffg',this.silsurvey);
    
  // });
  


 // }
  
  // arrOfcat = (catid: number) => this.silsurvey['item_collection'].filter((item: any)=> item.item_category_id===catid);

  //   populateBadges(cats:any,esurv: any) {
  //     console.log('hit');
  //     cats = cats.map((cat: Record<string, any>) =>{cat['category_badge']=0; return cat;});
  //     esurv.item_collection.map((item:any)=>{
  //       cats.find((cat:any)=>item.item_category_id===cat.category_id).category_badge += +item.list_item_qty;
  //     });
  //   }
  //   expandCategory = (catid: number) =>
  //      this.openCats.push(('category' + catid as never));

      //  showSelSubcats = (parent_cat_id: string,parent_cat_name: string) => this.createSelSubsModal(this.subCatsSendCtrl(parent_cat_id,parent_cat_name,this.silwcats,this.silsurvey,true)
      //  );
   
      //  async createSelSubsModal(input_obj: Record<string, any>) {
      //   const modal = await this.modalCtrl.create({
      //     backdropDismiss:false,
      //     component: SubcatsPage,
      //     componentProps: input_obj
      //   });
      //   await modal.present();
      //   modal.onDidDismiss().then((res) => {
      //     const ret = JSON.parse(res.data.data);
      //     const pid = ret.parent_cat_id;
      //     this.silcats.find((cat)=>cat.category_id===pid).category_badge = ret.subnum;
      //     this.expandCategory(pid);
      //   });
      // }
// <---------------------------------------------------------------vendor-------------------------------------------------------------------------------->
    


 


  




