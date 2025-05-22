import { Component, OnInit } from '@angular/core';
import { CartManagerService } from '../../services/cart/cart.manager.service';
import { AuthManagerService } from '../../services/auth/auth.manager.service'; // Adjust the path as needed
import { CartItem } from '../../models/cart.model'; // Adjust the path as needed
import { EventEmitter, Output } from '@angular/core';
import { Product } from '../../models/product.model'; // Adjust the path as needed

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
    this.cartId = `cart-${this.authManagerService.getCurrentUserId()}`; // Adjust this to get the actual cart ID
    this.cartManagerService.getAllProducts().subscribe((products) => {
      const productIds = products.map((product) => product.id);
      this.cartItems = this.mapProductsToCartItems(productIds, products);
      this.totalPrice = this.getTotalPrice();
    });
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0); 
  }

  getTotalPrice(): number {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return this.totalPrice;
  }

  removeItem(productId: string): void {
    const itemIndex = this.cartItems.findIndex((item) => item.id === productId);
    if (itemIndex !== -1) {
      if (this.cartItems[itemIndex].quantity > 1) {
        this.cartItems[itemIndex].quantity -= 1;
      } else {
        this.cartItems.splice(itemIndex, 1);
      }
      const updatedProductIds = this.cartItems.map((item) => item.id);
      this.cartManagerService
        .update(this.cartId, { productsId: updatedProductIds })
        .subscribe();
    }
  }

  checkout(): void {
    alert(`Proceeding to checkout! Total price: ${this.totalPrice}`);
  }

  clearCart(): void {
    this.cartManagerService.clearCart(
      this.authManagerService.getCurrentUserId()
    );
    this.cartItems = [];
    this.totalPrice = 0;
    alert('Cart cleared');
  }

  // for switching between components
  completeCart() {
    this.cartCompleted.emit(); // This triggers parent.onCartCompleted()
  }


  mapProductsToCartItems(
    productIds: string[],
    products: Product[]
  ): CartItem[] {
    const productIdCount: Record<string, number> = {};

    // Count how many times each product ID appears
    for (const id of productIds) {
      productIdCount[id] = (productIdCount[id] || 0) + 1;
    }

    // Filter products to only include unique product IDs
    const uniqueProducts = products.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

    // Build CartItem array based on counted product IDs
    const cartItems: CartItem[] = [];

    for (const product of uniqueProducts) {
      const quantity = productIdCount[product.id];
      if (quantity) {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.images[0] || '',
        });
      }
    }

    return cartItems;
  }

  decrementQuantity(productId: string): void {
    const itemIndex = this.cartItems.findIndex((item) => item.id === productId);
    if (itemIndex !== -1) {
      if (this.cartItems[itemIndex].quantity > 1) {
        this.cartItems[itemIndex].quantity -= 1;
      } else {
        this.cartItems.splice(itemIndex, 1);
      }
      const updatedProductIds = this.cartItems.map((item) => item.id);
      this.cartManagerService
        .update(this.cartId, { productsId: updatedProductIds })
        .subscribe();
    }
  }

  incrementQuantity(productId: string): void {
    const itemIndex = this.cartItems.findIndex((item) => item.id === productId);
    if (itemIndex !== -1) {
      this.cartItems[itemIndex].quantity += 1;
      const updatedProductIds = this.cartItems.map((item) => item.id);
      this.cartManagerService
        .update(this.cartId, { productsId: updatedProductIds })
        .subscribe();
    }
  }
}
