import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit {

    orders: Order[] = [];
    filteredOrders: Order[] = [];
    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
      this.getAll();
    }

    getAll(): void {
      const authState = JSON.parse(localStorage.getItem('authState') || '{}');
      const userId = authState?.user?.id;
      if (userId) {
        this.orderService.getAll().subscribe(
          (orders: Order[]) => {
            console.log('Output of orderService.getAll():', orders);
            this.orders = orders.filter(order => order.user_id == userId);
            this.filteredOrders = this.orders;
            console.log('Filtered orders:', this.orders);
          },
          (error) => {
            console.error('Error fetching orders:', error);
          }
        );
      } else {
        console.error('User ID not found in authState');
      }
    }

    searchTerm: string = '';
    applySearch(): void {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(order =>
        order.id.toString().toLowerCase().includes(term) ||
        (order.status && order.status.toLowerCase().includes(term))
      );
    }


}
