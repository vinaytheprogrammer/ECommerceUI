import { Component, OnInit } from '@angular/core';
import { AuthUser, User } from 'src/app/models/user.model';
import { AuthManagerService } from 'src/app/services/auth/auth.manager.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {

  currentUser : AuthUser ={
      username: '',
      email: '',
      role: 'user',
      id: ''
  };

  isEditing = false;
  constructor(private userService : UserService,
      private authManagerService : AuthManagerService,
  ) { }

  ngOnInit(): void {
    const userId = this.authManagerService.getCurrentUserId();
    this.userService.getUserById(Number(userId)).subscribe(
      (user: User) => {
        this.currentUser = {
          username: user.name,
          email: user.email,
          role: user.role,
          id: userId.toString()
        };
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
    
  }


  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    // Save changes logic here
    this.userService.updateUserById(Number(this.currentUser.id), this.mapToServiceUser(this.currentUser)).subscribe(
      response => {
        console.log('User updated successfully:', response);
      },
      error => {
        console.error('Error updating user:', error);
      }
    );
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  mapToServiceUser(authUser: AuthUser): User {
    return {
      name: authUser.username,
      email: authUser.email,
      role: authUser.role
    };
  }
}
