import { Component, Input } from '@angular/core';
import { Product } from '../../model/product.model.js';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  quantity: number = 0; // Default quantity
  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  addToCart(): void {
    if (this.authService.isLoggedIn()) {
      if(this.quantity <= 0) {
        alert('Please select a valid quantity.');
        return;
      }
      this.cartService.addToCart(this.product, this.quantity);
      alert('Product successfully added to the cart!');
    } else {
      // Redirect to login
      // In a real app, you might want to show a modal or something
      this.authService.navigateToLogin();
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }
  increaseQuantity(): void {
    this.quantity++;
  }
}