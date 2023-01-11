import { Injectable } from '@angular/core';
import { AlertController, AlertOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
    ) { }

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

  async presentError(error: any, loc?: string) {
    let message = 'Error';
    if(typeof error === 'string') message = error;
    else if(error.message) message = error.message;
    if(loc) message = loc+' - '+message;
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom',
      color: 'danger',
      cssClass: 'defaultToastAtBottom'
    });
    toast.present();
  }

  presentAlert = async (alertOptions: AlertOptions) => (await this.alertCtrl.create(alertOptions)).present();

}
