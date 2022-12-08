import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BudgetItemService {

  items: any[] = []


  constructor() { }

  addItem(item: any) {
    this.items.push(item)
  }

  removeItem(index: number) {
    this.items.splice(index, 1)
  }

  getItems() {
    return this.items;
  }

  calculateTotal() {
    let expenseTotal = 0
    let incomeTotal = 0
    let balance = 0
    let finalObject = {
      expenseTotal,
      incomeTotal,
      balance
    }
    this.items.forEach((item) => {
      if(item.type === "expense") {
        expenseTotal = expenseTotal + item.amount
      } else {
        incomeTotal = incomeTotal + item.amount
      }
    })

    finalObject.expenseTotal = expenseTotal
    finalObject.incomeTotal = incomeTotal
    const calcTotal = incomeTotal - expenseTotal
    finalObject.balance = (calcTotal * 100) / 100

    return finalObject
  }
}
