import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-base',
  templateUrl: './cart-base.component.html',
})
export class CartBaseComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  // Add this property to fix the error
  public currentComponent: string = 'A';

  onCartCompleted() {
    this.goToCheckout();
  }

  goToCheckout() {
    this.currentComponent = 'B';
  }

  onCheckoutCompleted() {
    this.goToOrder();
  }
  goToOrder() {
    this.currentComponent = 'C';
  }
}
