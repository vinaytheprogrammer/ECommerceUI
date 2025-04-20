import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../home/models/user.model'; // Adjusted the import path

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'api/users'; // In a real app, this would be your API endpoint

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // Mock implementation - replace with actual HTTP call
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]') || [
      { username: 'admin', email: 'admin@example.com', role: 'admin' },
      { username: 'user1', email: 'user1@example.com', role: 'customer' }
    ];
    return of(users);
  }

  updateUser(user: User): Observable<User> {
    // Mock implementation
    return this.getUsers().pipe(
      map((users: User[]): User => {
      const index: number = users.findIndex((u: User) => u.username === user.username);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem('users', JSON.stringify(users));
      }
      return user;
      })
    );
  }

    deleteUser(username: string): Observable<void> {
      return this.getUsers().pipe(
        map(users => {
          const filtered = users.filter(u => u.username !== username);
          localStorage.setItem('users', JSON.stringify(filtered));
          return;
        })
      );
    }
  
    addUser(user: User): Observable<User> {
      return this.getUsers().pipe(
        map(users => {
          users.push(user);
          localStorage.setItem('users', JSON.stringify(users));
          return user;
        })
      );
  }
}