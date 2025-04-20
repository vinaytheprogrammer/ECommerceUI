import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // In a real app, you'd call an API to register the user
    // For now, we'll just log them in directly
    this.authService.signup(this.username, this.email, this.password, this.role ).then((success) => {
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