import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../../models/order.model'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private baseUrl = 'http://localhost:3019/orderitems';

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.baseUrl);
  }

  getById(id: string): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.baseUrl}/${id}`);
  }

  create(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.baseUrl, orderItem);
  }

  update(id: string, orderItem: Partial<OrderItem>): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, orderItem);
  }

  replace(id: string, orderItem: OrderItem): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, orderItem);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  count(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/count`);
  }

  findByOrderId(orderId: string): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.baseUrl}?filter[where][id]=${orderId}`);
  }
}
