import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../home/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'api/products'; // In a real app, this would be your API endpoint

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // Mock implementation - replace with actual HTTP call
    const products: Product[] = JSON.parse(localStorage.getItem('products') || JSON.stringify([
      { id: 1, name: 'Product 1', price: 100, description: 'Description 1', imageUrl: 'https://via.placeholder.com/150' },
      { id: 2, name: 'Product 2', price: 200, description: 'Description 2', imageUrl: 'https://via.placeholder.com/150' }
    ]));
    return of(products);
  }

  addProduct(product: Product): Observable<Product> {
    // Mock implementation
    return this.getProducts().pipe(
      map(products => {
        product.id = Math.max(...products.map(p => p.id), 0) + 1;
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        return product;
      })
    );
  }

    updateProduct(product: Product): Observable<Product> {
      return this.getProducts().pipe(
        map(products => {
          const index = products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            products[index] = product;
            localStorage.setItem('products', JSON.stringify(products));
          }
          return product;
        })
      );
    }
  
    deleteProduct(id: number): Observable<void> {
      return this.getProducts().pipe(
        map(products => {
          const filtered = products.filter(p => p.id !== id);
          localStorage.setItem('products', JSON.stringify(filtered));
          return undefined;
        })
      );
  }
}