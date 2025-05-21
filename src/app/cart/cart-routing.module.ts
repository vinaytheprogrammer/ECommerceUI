import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { CartBaseComponent } from './cart-base.component';

const routes: Routes = [
  { path: '', component: CartBaseComponent },
  { path: 'order-history', component: OrderHistoryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
