import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

    orders: Order[] = [];

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

}
