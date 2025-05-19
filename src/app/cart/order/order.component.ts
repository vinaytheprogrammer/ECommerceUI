import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true; // Add loading state
  error: string | null = null; // Add error handling

  constructor(private orderService: OrderService) {
    // Don't call ngOnInit here - it will be called automatically by Angular
    console.log('Constructor - orders:', this.orders); // Will be empty
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;
    
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
        console.log('Data loaded - orders:', this.orders);
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.isLoading = false;
        console.error('Error fetching orders:', err);
      },
    });
  }
}