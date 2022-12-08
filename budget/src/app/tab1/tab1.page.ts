import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { BudgetItemService } from '../services/budget-item-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild( BaseChartDirective ) chart?: BaseChartDirective;

  loadItems() {
    return this.dataService.getItems()
  }

  // doughnut chart setup 
  public doughnutChartLabels: string[] = [ 'Income', 'Expenses' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [ this.calcItems().incomeTotal, this.calcItems().expenseTotal ] },
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  // when called, the chart data will update with the newest values from the data service 
  updateChart(){
    this.doughnutChartData.datasets[0].data[0] = this.calcItems().incomeTotal;
    this.doughnutChartData.datasets[0].data[1] = this.calcItems().expenseTotal;
    this.chart!.ngOnChanges({});

}

// modal form setup 
  ionicForm!: FormGroup;
  isSubmitted = false;

  constructor(private alertController: AlertController, private dataService: BudgetItemService, public formBuilder: FormBuilder, public share: SocialSharing) {}

  // allows us to have validators on the form to ensure it is completed
  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      itemName: ['', [Validators.required]],
      date: [Date, [Validators.required]],
      amount: ['', Validators.required],
      type: ['', [Validators.required]]
    });
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  calcItems() {
    return this.dataService.calculateTotal()
  }

  @ViewChild(IonModal) modal!: IonModal;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.isSubmitted = true;
    // if the form is not filled out the app will show a pop up 
    if(!this.ionicForm.valid) {
      this.presentAlert()
      return
    }
    this.dataService.addItem(this.ionicForm.value);
    this.ionicForm.reset()
    this.modal.dismiss(); 

    setTimeout(() => {
      this.updateChart()
    }, 100)
    
  }

  deleteItem(index: number) {
    this.dataService.removeItem(index)
    this.updateChart()
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error!',
      subHeader: 'You did not complete all fields on the form!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  shareItem(item: any) {
    console.log('fire', item)
    const message = 'Transaction Name: ' + item.itemName + ' - Amount: $' + item.amount + ' from ' + item.date
    const subject = 'Shared Budget Transaction'

    this.share.share(message, subject)
  }
}
