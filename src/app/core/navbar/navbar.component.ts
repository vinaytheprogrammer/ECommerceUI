import { Component } from '@angular/core';
import { AuthManagerService } from '../../services/auth/auth.manager.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  constructor(public authManagerService: AuthManagerService) {}

  logout(): void {
    this.authManagerService.logout();
  }

}
