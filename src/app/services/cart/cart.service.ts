import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.model'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3023/carts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.baseUrl);
  }

  getById(id: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${id}`);
  }

  create(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl, cart);
  }

  update(id: string, cart: Partial<Cart>): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, cart);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3021/products/${productId}`);
  }
}
