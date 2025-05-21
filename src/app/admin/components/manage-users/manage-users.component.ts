import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user/user.service';
import { AuthManagerService } from '../../../services/auth/auth.manager.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent {
  users: User[] = [];
  showAddUserForm = false;
  editingUser = false;
  currentUser: User = {
    name: '',
    email: '',
    role: 'user',
  };

  constructor(
    private userService: UserService,
    private authManagerService: AuthManagerService
  ) {}

  ngOnInit(): void {
    // Get all users
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
      console.log('All users:', users);
    });
  }

  // Create a new user
  createUser(userForm: any) {
    if (!userForm.valid) {
      alert('Please complete all fields before saving the user.');
      return;
    }

    this.userService.createUser(this.currentUser).subscribe({
      next: (response) => {
        this.users.push(response);
        this.resetForm();
      },
      error: (err) => console.error('Error creating user:', err),
    });
  }

  editUser(user: User) {
    this.editingUser = true;
    this.currentUser = { ...user };
    this.showAddUserForm = true;
  }

  updateUser() {
    if (!this.currentUser.user_id) return; // Ensure user_id is present
    this.userService
      .updateUserById(this.currentUser.user_id, this.currentUser)
      .subscribe({
        next: () => {
          const index = this.users.findIndex(
            (u) => u.user_id === this.currentUser.user_id
          );
          if (index !== -1) {
            this.users[index] = { ...this.currentUser };
          }
          this.resetForm();
        },
        error: (err) => console.error('Error updating user:', err),
      });
  }

  deleteUser(id: number) {
    // user can not delete himself
    const currentUserId = this.authManagerService.getCurrentUserId();
    if (Number(currentUserId) === id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUserById(id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.user_id !== id);
        },
        error: (err) => console.error('Error deleting user:', err),
      });
    }
  }

  cancelForm() {
    this.resetForm();
  }

  private resetForm() {
    this.currentUser = {
      name: '',
      email: '',
      role: 'user',
    };
    this.editingUser = false;
    this.showAddUserForm = false;
  }

  canExit(): boolean {
    // Check if the form is dirty (has unsaved changes)
    const isDirty =
      this.currentUser.name ||
      this.currentUser.email ||
      this.currentUser.role;
    return (
      !isDirty ||
      confirm('Are you sure you want to leave this page? Any unsaved changes will be lost.')
    );
  }
}
