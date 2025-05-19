import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderComponent } from './order/order.component';

@NgModule({
  declarations: [
    CartComponent,
    CheckoutComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CartModule { }
