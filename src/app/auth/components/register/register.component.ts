import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthManagerService } from '../../../services/auth/auth.manager.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = '';


  constructor(
    private authManagerService: AuthManagerService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.authManagerService.signup(this.username, this.email, this.password, this.role ).then((success) => {
      if (success) {
        this.router.navigate(['/home']);
      } else {
        console.error('Registration failed');
      }
    }).catch((error) => {
      console.error('An error occurred during registration:', error);
    });
  }
}