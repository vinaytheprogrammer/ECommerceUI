import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  { 
    path: '', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'products', component: ManageProductsComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }