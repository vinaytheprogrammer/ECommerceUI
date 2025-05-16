import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
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
    const queryParams = this.route.snapshot.queryParams;
    this.totalPrice = Number(queryParams['totalPrice']) || 0;
    this.calculateGrandTotal();
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

    const orderData = {
      ...this.checkoutForm.value,
      paymentMethod: this.paymentMethod,
      totalPrice: this.totalPrice,
      discount: this.discountAmount,
      grandTotal: this.grandTotal
    };

    console.log('Order submitted:', orderData);
    // Here you would typically send the order data to your backend
    alert('Order placed successfully!');
  }

  continueShopping() {
    // Navigate back to products page or wherever appropriate
    console.log('Continue shopping clicked');
  }
}