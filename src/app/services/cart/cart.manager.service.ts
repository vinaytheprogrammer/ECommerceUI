// cart.manager.service.ts
import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { AuthManagerService } from '../auth/auth.manager.service';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Cart } from '../../models/cart.model'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root',
})
export class CartManagerService {
  constructor(
    private cartService: CartService,
    private authManagerService: AuthManagerService
  ) {}

  getAllProducts(): Observable<any[]> {
    const userId = this.authManagerService.getCurrentUserId();
    return this.getCartProducts(userId);
  }

  getCartProducts(userId: string): Observable<any[]> {
    const cartId = `cart-${userId}`;
    return this.cartService.getById(cartId).pipe(
      switchMap((cart) => {
        const productRequests = cart.productsId.map((id) =>
          this.cartService.getProductById(id).toPromise()
        );
        return from(Promise.all(productRequests));
      }),
      catchError((err) => {
        console.error('Failed to fetch cart or products', err);
        return of([]);
      })
    );
  }

  addToCart(
    productId: string,
    quantity: number,
    userId: string
  ): Observable<Cart> {
    const cartId = `cart-${userId}`;
    return this.cartService.getById(cartId).pipe(
      switchMap((cart) => {
        const updatedCart: Cart = {
          ...cart,
          productsId: [...cart.productsId, ...Array(quantity).fill(productId)],
        };
        return this.cartService
          .update(cartId, updatedCart)
          .pipe(map(() => updatedCart));
      }),
      catchError(() => {
        // If cart doesn't exist, create it
        const newCart: Cart = {
          id: cartId,
          userId,
          productsId: Array(quantity).fill(productId),
        };
        return this.cartService.create(newCart);
      })
    );
  }

  update(cartId: string, cart: Partial<Cart>): Observable<void> {
    return this.cartService.update(cartId, cart);
  }
}
