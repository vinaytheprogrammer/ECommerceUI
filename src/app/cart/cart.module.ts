import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderComponent } from './order/order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { CartBaseComponent } from './cart-base.component'; // Uncomment if you have a base component

@NgModule({
  declarations: [
    CartComponent,
    CheckoutComponent,
    OrderComponent,
    OrderHistoryComponent,
    CartBaseComponent // Uncomment if you have a base component
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CartModule { }
