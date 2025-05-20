import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../models/order.model'; // Adjust the path as needed


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:3020/orders'; // Update if your backend URL/port differs

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  update(id: string, order: Partial<Order>): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, order);
  }

  replace(id: string, order: Order): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, order);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  count(): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.baseUrl}/count`);
  }
}
