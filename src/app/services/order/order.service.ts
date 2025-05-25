import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model'; // Adjust the path as needed
import { environment } from '../../../environments/environment'; // Import environment for API URL

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`; // Use environment variable for API URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  update(id: string, order: Partial<Order>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${String(id)}`, order);
  }

  replace(id: string, order: Order): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, order);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  count(): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.apiUrl}/count`);
  }
}
