import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.model.js';
import { CartManagerService } from '../../../services/cart/cart.manager.service';
import { AuthManagerService } from '../../../services/auth/auth.manager.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: Product;
  quantity: number = 1;

  constructor(
    private cartManagerService: CartManagerService,
    private authManagerService: AuthManagerService
  ) {}

  addToCart() {
    const userId = this.authManagerService.getCurrentUserId(); 
    this.cartManagerService.addToCart(this.product.id, this.quantity, userId).subscribe({
      next: () => alert(`${this.quantity}x ${this.product.name} added to cart.`),
      error: (err) => console.error('Error adding to cart', err)
    });
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow() {
    this.addToCart();
  }
}
