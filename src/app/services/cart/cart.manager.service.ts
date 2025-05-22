// cart.manager.service.ts
import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { AuthManagerService } from '../auth/auth.manager.service';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Cart, CartItem } from '../../models/cart.model'; // Adjust the import path as needed
import { Product } from '../../models/product.model'; // Adjust the import path as needed
// import { ProductService } from '../product/product.service'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root',
})
export class CartManagerService {
  constructor(
    private cartService: CartService,
    private authManagerService: AuthManagerService,
    // private productService: ProductService
  ) {}

  getAllCartProductsOfCurrentUser(): Observable<any[]> {
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
          userId: String(userId),
          productsId: Array(quantity).fill(productId),
        };
        return this.cartService.create(newCart);
      })
    );
  }

  update(cartId: string, cart: Partial<Cart>): Observable<void> {
    return this.cartService.update(cartId, cart);
  }

  clearCart(userId: string): void {
    const cartId = `cart-${userId}`;
    this.update(cartId, { productsId: [] }).subscribe(() => {
      console.log('Cart cleared');
    });
  }

  calculateGrandTotal(totalPrice: number, discountAmount: number): number {
    const shipping = 6.0;
    const tax = 4.0;
    return totalPrice + shipping + tax - discountAmount;
  }

  //restructure the cart items to reduce the length of the cart items by increasing the quantity of the same product
  private mapProductsToCartItems(productIds: string[], products: Product[]): CartItem[] {
    const countMap = productIds.reduce<Record<string, number>>((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const uniqueProducts = Array.from(
      new Map(products.map(p => [p.id, p])).values()
    );

    return uniqueProducts
      .filter(p => countMap[p.id])
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: countMap[p.id],
        imageUrl: p.images[0] || ''
      }));
  }

  wrapCartProductsToItems(): Observable<CartItem[]> {
    return this.getAllCartProductsOfCurrentUser().pipe(
      map((products: Product[]) => {
        const productIds = products.map((product) => product.id);
        return this.mapProductsToCartItems(productIds, products);
      }),
      catchError((err) => {
        console.error('Failed to load cart products:', err);
        return of([]);
      })
    );
  }
  
}
