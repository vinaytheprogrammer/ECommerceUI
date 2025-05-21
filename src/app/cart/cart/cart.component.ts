import { Component, OnInit } from '@angular/core';
import { CartManagerService } from '../../services/cart/cart.manager.service';
import { AuthManagerService } from '../../services/auth/auth.manager.service'; // Adjust the path as needed
import { CartItem } from '../../models/cart.model'; // Adjust the path as needed
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  @Output() cartCompleted = new EventEmitter<void>();

  cartId = '';
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(private cartManagerService: CartManagerService,
      private authManagerService: AuthManagerService) {}

  ngOnInit(): void {
    
   this.cartId = `cart-${this.authManagerService.getCurrentUserId()}`; // Adjust this to get the actual cart ID
    this.cartManagerService.getAllProducts().subscribe(products => {
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
     this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
     return this.totalPrice;
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
      this.cartManagerService.update(this.cartId, { productsId: updatedProductIds }).subscribe();
    }
  }

  checkout(): void {
    alert(`Proceeding to checkout! Total price: ${this.totalPrice}`);
  }

  clearCart(): void {
    this.cartManagerService.clearCart(this.authManagerService.getCurrentUserId());
    this.cartItems = [];
    this.totalPrice = 0;
    alert('Cart cleared');
  }
 
  // for switching between components
  completeCart() {
    this.cartCompleted.emit(); // This triggers parent.onCartCompleted()
  }
}
