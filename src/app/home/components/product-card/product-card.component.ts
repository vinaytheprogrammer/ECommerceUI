import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.model.js';
import { CartService } from '../../../services/cart/cart.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  quantity: number = 1;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  addToCart() {
    const userId = this.authService.getCurrentUserId(); 

    this.cartService.addToCart(this.product.id, this.quantity, userId).subscribe({
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
}
