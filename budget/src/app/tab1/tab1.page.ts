import { Component, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private alertController: AlertController) {}

  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  date!: Date;
  amount!: Number;
  type!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if(!this.name || !this.amount || !this.date || !this.type) {
      this.presentAlert()
      return
    }

    this.modal.dismiss(this.name, 'confirm');
    
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error!',
      subHeader: 'You did not complete all fields on the form!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }



  

}
