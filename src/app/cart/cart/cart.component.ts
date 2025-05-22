import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CartManagerService } from '../../services/cart/cart.manager.service';
import { AuthManagerService } from '../../services/auth/auth.manager.service';
import { CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  @Output() cartCompleted = new EventEmitter<void>();

  cartId = '';
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(
    private cartManagerService: CartManagerService,
    private authManagerService: AuthManagerService
  ) {}

  ngOnInit(): void {
    const userId = this.authManagerService.getCurrentUserId();
    this.cartId = `cart-${userId}`;
    this.loadCart();
  }

  loadCart(): void {

    //to restructure the cart items
    this.cartManagerService.wrapCartProductsToItems().subscribe({
      next: (cartItems) => {
        this.cartItems = cartItems;
        this.updateTotalPrice();
        console.log('Cart Items:', this.cartItems);
      },
      error: (err) => {
        console.error('Failed to load cart items:', err);
        this.cartItems = [];
      },
    });
  }

  updateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  removeItem(productId: string): void {
    const index = this.cartItems.findIndex((item) => item.id === productId);
    if (index !== -1) {
      const item = this.cartItems[index];
      item.quantity > 1 ? item.quantity-- : this.cartItems.splice(index, 1);
      this.persistCart();
    }
  }

  incrementQuantity(productId: string): void {
    const item = this.cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity++;
      this.persistCart();
    }
  }

  decrementQuantity(productId: string): void {
    const item = this.cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity > 1 ? item.quantity-- : this.removeItem(productId);
      this.persistCart();
    }
  }

  persistCart(): void {
    const productIds = this.cartItems.flatMap((item) =>
      Array(item.quantity).fill(item.id)
    );
    this.cartManagerService
      .update(this.cartId, { productsId: productIds })
      .subscribe({
        next: () => this.updateTotalPrice(),
        error: (err) => console.error('Failed to update cart:', err),
      });
  }

  clearCart(): void {
    this.cartManagerService.clearCart(
      this.authManagerService.getCurrentUserId()
    );
    this.cartItems = [];
    this.updateTotalPrice();
    alert('Cart cleared');
  }

  checkout(): void {
    this.persistCart(); // Ensure latest changes are saved
    alert(
      `Proceeding to checkout! Total price: ₹${this.totalPrice.toFixed(2)}`
    );
  }

  // this is for switching to the checkout page
  completeCart(): void {
    this.cartCompleted.emit();
  }

  // private mapProductsToCartItems(productIds: string[], products: Product[]): CartItem[] {
  //   const countMap = productIds.reduce<Record<string, number>>((acc, id) => {
  //     acc[id] = (acc[id] || 0) + 1;
  //     return acc;
  //   }, {});

  //   const uniqueProducts = Array.from(
  //     new Map(products.map(p => [p.id, p])).values()
  //   );

  //   return uniqueProducts
  //     .filter(p => countMap[p.id])
  //     .map(p => ({
  //       id: p.id,
  //       name: p.name,
  //       price: p.price,
  //       quantity: countMap[p.id],
  //       imageUrl: p.images[0] || ''
  //     }));
  // }
}
