import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    try {
      const isAuthenticated = await this.authService.login(this.username, this.password);
      if (isAuthenticated) {
        this.router.navigate(['/home']);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('An error occurred during login.');
    }
  }
}