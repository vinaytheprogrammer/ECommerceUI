import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service'; // Adjust the path as needed
import { Observable } from 'rxjs';

export interface Cart {
  id: string;
  userId: string;
  productsId: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3023/carts'; // adjust if needed
  constructor(private http: HttpClient, private authService: AuthService) {}
 

  getAll(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.baseUrl);
  } 

  getAllProducts(): Observable<any[]> {

    const userId = this.authService.getCurrentUserId(); 
    console.log('userId', userId);
    return this.getCartProducts(userId);
  }
  
  getCartProducts(userId: string): Observable<any[]> {
    const cartId = `cart-${userId}`;
    return new Observable<any[]>(observer => {
      this.getById(cartId).subscribe({
        next: (cart) => {
          const productRequests = cart.productsId.map(productId =>
            this.http.get<any>(`http://localhost:3021/products/${productId}`)
          );

          Promise.all(productRequests.map(req => req.toPromise()))
            .then(products => {
              observer.next(products);
              observer.complete();
            })
            .catch(err => observer.error(err));
        },
        error: err => observer.error(err)
      });
    });
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

  addToCart(productId: string, quantity: number, userId: string ): Observable<Cart> {
    const cartId = `cart-${userId}`; // Generate cart ID or fetch from AuthService
    return new Observable<Cart>(observer => {
      this.getById(cartId).subscribe({
        next: (cart) => {
          const updatedCart: Cart = {
            ...cart,
            productsId: [...cart.productsId, ...Array(quantity).fill(productId)]
          };
          this.update(cartId, updatedCart).subscribe({
            next: () => observer.next(updatedCart),
            error: err => observer.error(err),
            complete: () => observer.complete()
          });
        },
        error: (err) => {
          // If cart doesn't exist, create a new one
          const newCart: Cart = {
            id: cartId,
            userId,
            productsId: Array(quantity).fill(productId)
          };
          this.create(newCart).subscribe({
            next: (created) => observer.next(created),
            error: error => observer.error(error),
            complete: () => observer.complete()
          });
        }
      });
    });
  }
}
