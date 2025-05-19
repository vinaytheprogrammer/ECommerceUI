import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthManagerService } from '../../services/auth/auth.manager.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authManagerService: AuthManagerService, private router: Router) {}

  canActivate(): boolean {
    if (this.authManagerService.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}