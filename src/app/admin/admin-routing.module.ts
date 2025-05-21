import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { CategoryManagementComponent } from './components/manage-category/manage-category.component';
import { UnsavedChangesGuard } from '../core/guards/unsaved-changes.guard';

const routes: Routes = [
  { 
    path: '', 
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'products', component: ManageProductsComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'users', component: ManageUsersComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'category', component: CategoryManagementComponent, canDeactivate: [UnsavedChangesGuard] },
      { path: 'profile', component: AdminProfileComponent},
      { path: '', redirectTo: 'products', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }