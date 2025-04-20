import { Component, OnInit } from '@angular/core';
import { User } from '../../../home/models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  currentUser: User = this.getEmptyUser();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  editUser(user: User): void {
    this.currentUser = { ...user };
    this.showModal();
  }

  deleteUser(username: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(username).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  handleUserSubmit(): void {
    this.userService.updateUser(this.currentUser).subscribe(() => {
      this.loadUsers();
      this.hideModal();
    });
  }

  private getEmptyUser(): User {
    return {
      username: '',
      email: '',
      role: 'customer'
    };
  }

  private showModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
  }

  private hideModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('userModal'));
    modal.hide();
  }
}