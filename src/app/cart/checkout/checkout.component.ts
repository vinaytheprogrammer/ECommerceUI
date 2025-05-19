import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  totalPrice: number = 0;
  grandTotal: number = 0;
  paymentMethod: string = 'card';
  promoCode: string = '';
  discountApplied: boolean = false;
  discountAmount: number = 0;
  user_id: string = '';
  cartItems: any[] = []; // Replace with your actual cart item type
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)]]
    });
  }

  ngOnInit(): void {
    
    this.calculateGrandTotal();
    this.user_id = this.authService.getCurrentUserId();
    this.cartService.getAllProducts().subscribe(products => {
      this.cartItems = products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1, // default quantity
        imageUrl: product.images[0]
      }));
    } );
  }

  calculateGrandTotal() {
    const shipping = 6.00;
    const tax = 4.00;
    this.grandTotal = this.totalPrice + shipping + tax - this.discountAmount;
  }

  applyPromoCode() {
    if (this.promoCode && !this.discountApplied) {
      // Here you would typically validate the promo code with your backend
      // For demo purposes, we'll apply a 10% discount
      this.discountAmount = this.totalPrice * 0.1;
      this.discountApplied = true;
      this.calculateGrandTotal();
    }
  }

  removePromoCode() {
    this.discountAmount = 0;
    this.discountApplied = false;
    this.promoCode = '';
    this.calculateGrandTotal();
  }

  setPaymentMethod(method: string) {
    this.paymentMethod = method;
  }

  completePurchase() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const orderData : Order= {
  
      id: Math.floor(100 + Math.random() * 900).toString(), // Generate a random 3-digit ID
      user_id: String(this.user_id), // Dummy user ID, replace with actual logic
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtotal: this.getTotalPrice(),
      taxAmount: 4.00,
      shippingAmount: 6.00,
      discountAmount: this.discountAmount,
      grandTotal: this.grandTotal,
      user_email: this.checkoutForm.value.email,
      shippingMethod: 'Standard',
      shippingStatus: 'Pending',
      trackingNumber: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      shippedAt: Date.now().toString() + '3',
      deliverAt: Date.now().toString(), 
      name: `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}`,
      phone: this.checkoutForm.value.phone,
      shippingAddress: `${this.checkoutForm.value.address}, ${this.checkoutForm.value.city}, ${this.checkoutForm.value.state}, ${this.checkoutForm.value.zipCode}`
    };

    this.orderService.create(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Failed to place the order. Please try again.');
      }
    });

    console.log('Order submitted:', orderData);
   
    alert('Order placed successfully!');
  }

  continueShopping() {
    console.log('Continue shopping clicked');
  }
  
  getTotalPrice(): number {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return this.totalPrice;
 }

}