import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../../models/order.model'; // Adjust the path as needed
import {environment} from '../../../environments/environment'; // Import environment for API URL

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private apiUrl = `${environment.apiBaseUrl}/orderitems`; // Use environment variable for API URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.apiUrl);
  }

  getById(id: string): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.apiUrl}/${id}`);
  }

  create(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.apiUrl, orderItem);
  }

  update(id: string, orderItem: Partial<OrderItem>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, orderItem);
  }

  replace(id: string, orderItem: OrderItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, orderItem);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  count(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`);
  }

  findByOrderId(orderId: string): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}?filter[where][id]=${orderId}`);
  }
}
