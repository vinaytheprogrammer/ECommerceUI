import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { FormsModule } from '@angular/forms';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { CategoryManagementComponent } from './components/manage-category/manage-category.component';
import { UnsavedChangesGuard } from '../core/guards/unsaved-changes.guard';
import { ManageOrdersComponent } from './components/manage-orders/manage-orders.component'; // Adjust the path as necessary

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    ManageProductsComponent,
    ManageUsersComponent,
    AdminProfileComponent,
    CategoryManagementComponent,
    ManageOrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
  ],
  providers: [UnsavedChangesGuard],
})

export class AdminModule { }
