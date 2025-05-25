import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.model'; // Adjust the path as needed
import { ProductService } from '../product/product.service'; // Adjust the path as needed
import {environment} from '../../../environments/environment'; // Import environment for API URL

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/carts`;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  getAll(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.apiUrl);
  }

  getById(id: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${id}`);
  }

  create(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, cart);
  }

  update(id: string, cart: Partial<Cart>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, cart);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductById(productId: string): Observable<any> {
    return this.productService.getProductById(productId);
  }
}
