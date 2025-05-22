import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://127.0.0.1:3021/products';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // GET /products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // GET /products/{id}
  getProductById(id: string): Observable<Product> {
    console.log('Fetching product with ID:', id);
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // POST /products
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, { headers: this.headers });
  }

  // PATCH /products/{id}
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, product, { headers: this.headers });
  }

  // DELETE /products/{id}
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // GET /products/count
  countProducts(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/count`);
  }
}
