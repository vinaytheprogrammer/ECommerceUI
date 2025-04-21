import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

 cartItems: any[] = []; // Initialize cartItems to an empty array
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    console.log('Fetching cart items...', this.cartService.getCartItems());
  }

  getCartItems() {
  }
 
  // Method to calculate total price
  calculateTotal() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  // Method to remove item from cart
  removeItem(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.cartService.removeCartItem(itemId);
    console.log(`Item with id ${itemId} removed from the cart and local storage.`);
  }
  // Method to update item quantity
  updateQuantity(itemId: number, quantity: number) {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity = quantity;
    }
  }
  // Method to proceed to checkout
  proceedToCheckout() {
    // Logic to proceed to checkout
    console.log('Proceeding to checkout with items:', this.cartItems);
  }
  // Method to clear cart
  clearCart() {
    this.cartService.clearCart();
    this.cartItems = []; // Clear the cart items in the component
    console.log('Cart cleared');
  }
  // Method to apply discount code
  applyDiscount(code: string) {
    // Logic to apply discount code
    console.log('Applying discount code:', code);
    // Example: if code is 'DISCOUNT10', apply 10% discount
    if (code === 'DISCOUNT10') {
      const total = this.calculateTotal();
      const discount = total * 0.1;
      const newTotal = total - discount;
      console.log('New total after discount:', newTotal);
    } else {
      console.log('Invalid discount code');
      alert('The discount code you entered is invalid. Please try again.');
    }
  }

  // Method to get total number of items in the cart
  getTotalItems() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  // Method to get the total price of items in the cart
  getTotalPrice() {
    return this.calculateTotal();
  }


  checkout() {
    this.proceedToCheckout();
  }



}
