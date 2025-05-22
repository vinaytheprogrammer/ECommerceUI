import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthManagerService } from '../../../services/auth/auth.manager.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = '';
  secretKey = '';

  constructor(
    private authManagerService: AuthManagerService,
    private router: Router,
  ) {}

  onSubmit(registerForm : any): void {
    if (!registerForm.valid) {
      alert('Please complete all fields before registering.');
      return;
    } 

    // Check if the secret key is correct
    if (this.role == 'admin' && this.secretKey !== '1234') {
      alert('Invalid secret key.');
      return;
    }
    
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

  canExit(): boolean {
    // Check if the form is dirty (has unsaved changes)
    const isDirty = this.username || this.email || this.password || this.role || this.secretKey;
    return !isDirty || confirm('Are you sure you want to leave this page? Any unsaved changes will be lost.');
  }
}