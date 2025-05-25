import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CategoryManagementComponent } from '../../admin/components/manage-category/manage-category.component';
import  { ManageProductsComponent } from '../../admin/components/manage-products/manage-products.component';
import { ManageUsersComponent } from '../../admin/components/manage-users/manage-users.component';
import { RegisterComponent } from '../../auth/components/register/register.component';
import { ManageOrdersComponent } from '../../admin/components/manage-orders/manage-orders.component';


@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<
  CategoryManagementComponent | ManageProductsComponent | ManageUsersComponent | RegisterComponent | ManageOrdersComponent
> {
  canDeactivate(
    component: CategoryManagementComponent | ManageProductsComponent | ManageUsersComponent | RegisterComponent | ManageOrdersComponent
  ): boolean {
    return (component as any).canExit ? (component as any).canExit() : true;
  }
}
