import { Component, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { BudgetItemService } from '../services/budget-item-service.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private alertController: AlertController, private dataService: BudgetItemService) {}

  loadItems() {
    return this.dataService.getItems()
  }

  calcItems() {
    return this.dataService.calculateTotal()
  }

  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  budgetItem = {
    itemName: '',
    date: Date,
    amount: Number,
    type: ''
  }
  

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if(!this.budgetItem) {
      this.presentAlert()
      return
    }

    this.dataService.addItem(this.budgetItem);

    this.modal.dismiss(this.budgetItem, 'confirm');
    
    
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
