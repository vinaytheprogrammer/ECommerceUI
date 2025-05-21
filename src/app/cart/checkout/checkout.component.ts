import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order.model';
import { AuthManagerService } from 'src/app/services/auth/auth.manager.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CartManagerService } from 'src/app/services/cart/cart.manager.service';
import { NotificationService } from 'src/app/services/notifications/notification.service';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  @Output() checkoutCompleted = new EventEmitter<void>();

  checkoutForm: FormGroup;
  totalPrice: number = 0;
  grandTotal: number = 0;
  paymentMethod: string = 'card';
  promoCode: string = '';
  discountApplied: boolean = false;
  discountAmount: number = 0;
  user_id: string = '';
  cartItems: any[] = []; // Replace with your actual cart item type
  orderData: Order | null = null; // Initialize orderData to null

  constructor(
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
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)]],
    });
  }

  ngOnInit(): void {
    this.grandTotal = this.cartManagerService.calculateGrandTotal(
      this.totalPrice,
      this.discountAmount
    );
    this.user_id = this.authManagerService.getCurrentUserId();
    this.cartManagerService.getAllProducts().subscribe((products) => {
      this.cartItems = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1, // default quantity
        imageUrl: product.images[0],
      }));
    });
  }

  applyPromoCode() {
    if (this.promoCode && !this.discountApplied) {
      // Here you would typically validate the promo code with your backend
      // For demo purposes, we'll apply a 10% discount
      this.discountAmount = this.totalPrice * 0.1;
      this.discountApplied = true;
      this.grandTotal = this.cartManagerService.calculateGrandTotal(
        this.totalPrice,
        this.discountAmount
      );
    }
  }

  removePromoCode() {
    this.discountAmount = 0;
    this.discountApplied = false;
    this.promoCode = '';
    this.grandTotal = this.cartManagerService.calculateGrandTotal(
      this.totalPrice,
      this.discountAmount
    );
  }

  setPaymentMethod(method: string) {
    this.paymentMethod = method;
  }

  completePurchase() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
      return;
    }

    let orderData: Order = {
      id: Math.floor(100 + Math.random() * 900).toString(), // Generate a random 3-digit ID
      user_id: String(this.user_id),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtotal: this.getTotalPrice(),
      taxAmount: 4.0,
      shippingAmount: 6.0,
      discountAmount: this.discountAmount,
      grandTotal: this.grandTotal,
      user_email: this.checkoutForm.value.email,
      shippingMethod: 'Standard',
      shippingStatus: 'Pending',
      trackingNumber: `PAY-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`,
      shippedAt: Date.now().toString() + '3',
      deliverAt: Date.now().toString(),
      name: `${this.checkoutForm.value.firstName} ${this.checkoutForm.value.lastName}`,
      phone: this.checkoutForm.value.phone,
      shippingAddress: `${this.checkoutForm.value.address}, ${this.checkoutForm.value.city}, ${this.checkoutForm.value.state}, ${this.checkoutForm.value.zipCode}`,
    };

    console.log('Order submitted:', orderData);

    this.cartManagerService.clearCart(String(this.user_id));
    this.cartItems = [];
    alert('Order placed successfully!');

    this.orderService.create(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        alert('Failed to place the order. Please try again.');
      },
    });

    this.completeCheckout();
    this.sendNotification();
  }

  continueShopping() {
    console.log('Continue shopping clicked');
  }

  getTotalPrice(): number {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return this.totalPrice;
  }

  sendNotification() {
    // Prepare a detailed HTML email body with order details
    const orderDetails = `
    <h2>Order Confirmation</h2>
    <p>Thank you for your purchase, <strong>${
      this.checkoutForm.value.firstName
    } ${this.checkoutForm.value.lastName}</strong>!</p>
    <p>Your order has been successfully placed. Here are your order details:</p>
    <ul>
      <li><strong>Order ID:</strong> ${this.orderData?.id || 'N/A'}</li>
      <li><strong>Status:</strong> ${this.orderData?.status || 'pending'}</li>
      <li><strong>Order Date:</strong> ${
        this.orderData?.createdAt
          ? new Date(this.orderData.createdAt).toLocaleString()
          : new Date().toLocaleString()
      }</li>
      <li><strong>Shipping Address:</strong> ${
        this.orderData?.shippingAddress || ''
      }</li>
      <li><strong>Phone:</strong> ${this.orderData?.phone || ''}</li>
      <li><strong>Email:</strong> ${
        this.orderData?.user_email || this.checkoutForm.value.email
      }</li>
      <li><strong>Subtotal:</strong> $${
        this.orderData?.subtotal?.toFixed(2) || this.getTotalPrice().toFixed(2)
      }</li>
      <li><strong>Tax:</strong> $${
        this.orderData?.taxAmount?.toFixed(2) || '4.00'
      }</li>
      <li><strong>Shipping:</strong> $${
        this.orderData?.shippingAmount?.toFixed(2) || '6.00'
      }</li>
      <li><strong>Discount:</strong> $${
        this.orderData?.discountAmount?.toFixed(2) || '0.00'
      }</li>
      <li><strong>Grand Total:</strong> $${
        this.orderData?.grandTotal?.toFixed(2) || this.grandTotal.toFixed(2)
      }</li>
      <li><strong>Tracking Number:</strong> ${
        this.orderData?.trackingNumber || ''
      }</li>
    </ul>
    <h3>Items:</h3>
    <ul>
      ${this.cartItems
        .map(
          (item) => `
        <li>
          <strong>${item.name}</strong> - $${item.price} x ${item.quantity}
        </li>
      `
        )
        .join('')}
    </ul>
    <p>If you have any questions, please contact our support team.</p>
    <p>Thank you for shopping with us!</p>
  `;

    const payload = {
      subject: 'Order Notification',
      body: orderDetails,
      receiver: {
        to: [
          {
            id: this.checkoutForm.value.email || 'vinay.gupta@sourcefuse.com',
          },
        ],
      },
      type: 1,
      options: {
        id: this.checkoutForm.value.email || 'vinay.gupta@sourcefuse.com',
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

  // for switching between components
  completeCheckout() {
    this.checkoutCompleted.emit();
  }
}
