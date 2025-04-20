import { Injectable } from '@angular/core';
import { Product, CartItem } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];

  constructor() {
    this.loadCartFromStorage();
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  private loadCartFromStorage(): void {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }
  }

  addToCart(product: Product, quantity: number): void {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ ...product, quantity });
    }
    this.saveCartToStorage();
    console.log(`${quantity} of ${product.name} added to cart.`);
  }

  updateCartItem(productId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeCartItem(productId);
      } else {
        this.saveCartToStorage();
      }
    }
  }

  removeCartItem(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.saveCartToStorage();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cartItems');
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}