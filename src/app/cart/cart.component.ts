import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { AuthService } from '../services/auth/auth.service'; // Adjust the path as needed
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartId = ''; // You should load this dynamically based on the user
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService,
      private authService: AuthService) {}

  ngOnInit(): void {
    
   this.cartId = `cart-${this.authService.getCurrentUserId()}`; // Adjust this to get the actual cart ID
    this.cartService.getAllProducts().subscribe(products => {
      console.log(products);
      this.cartItems = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1, // default quantity
        imageUrl: product.images[0]
      }));
    } );
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  removeItem(productId: string): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
      if (this.cartItems[itemIndex].quantity > 1) {
      this.cartItems[itemIndex].quantity -= 1;
      } else {
      this.cartItems.splice(itemIndex, 1);
      }
      const updatedProductIds = this.cartItems.map(item => item.id);
      this.cartService.update(this.cartId, { productsId: updatedProductIds }).subscribe();
    }
  }

  checkout(): void {
    alert('Proceeding to checkout!');
    // implement real checkout logic here
  }

  clearCart(): void {
    this.cartItems = [];
    
  }
}
