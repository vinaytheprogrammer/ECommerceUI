import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order.model';
import { AuthManagerService } from 'src/app/services/auth/auth.manager.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CartManagerService } from 'src/app/services/cart/cart.manager.service';
import { NotificationService } from 'src/app/services/notifications/notification.service';

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
    private authManagerService: AuthManagerService,
    private orderService: OrderService,
    private cartManagerService: CartManagerService,
    private notificationService: NotificationService
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
    this.user_id = this.authManagerService.getCurrentUserId();
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
    this.sendNotification();
  }

  continueShopping() {
    console.log('Continue shopping clicked');
  }
  
  getTotalPrice(): number {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return this.totalPrice;
 }


 sendNotification() {
  const payload = {
    subject: 'Order Notification',
    body: 'Your order has been successfully placed.',
    receiver: {
      to: [
        {
          // id: this.authManagerService.getCurrentUserEmail()
          id: 'vinay.gupta@sourcefuse.com',
        },
      ],
    },
    type: 1,
    options: {
      // to: this.authManagerService.getCurrentUserEmail(),
      id: 'vinay.gupta@sourcefuse.com',
      from: 'abhisheksingh55568@gmail.com',
      subject: 'Order Confirmation',
    },
    isCritical: true,
  };

  let accessToken = '';
  // Retrieve the authState from localStorage
  const authState = localStorage.getItem('authState');

  if (authState) {
    // Parse the JSON string into an object
    const parsedAuthState = JSON.parse(authState);

    // Access the accessToken
    let accessToken = parsedAuthState.accessToken;

    console.log('Access Token:', accessToken);
  } else {
    console.error('authState not found in localStorage');
  }
  this.notificationService.sendNotification(accessToken, payload).subscribe({
    next: () => {
      console.log('Notification sent successfully');
    },
    error: (err) => {
      console.error('Failed to send notification:', err);
    },
  });
}

}