import { Injectable, Input } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  seedData: any;
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl:AlertController
    ) { }

  organiseItemCategories(item: Record<string, any>, wholeCats: any[]) {
    if(!item['sub_category_id']) {
      if(!wholeCats) wholeCats = this.seedData.value.Categories.data.filter((cat: Record<string, any>)=>cat['status']);
      const fcat = wholeCats.find((cat: Record<string, any>)=>cat['category_id']===item['item_category_id']);
      if(fcat) {
        item['sub_category_id'] = fcat.category_id;
        if (fcat.parent_category_id) item['item_category_id'] = fcat.parent_category_id;
      }
    }
    return item;
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
}
