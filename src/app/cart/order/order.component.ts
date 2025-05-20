import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order/order.service';
import { CartManagerService } from 'src/app/services/cart/cart.manager.service';
import { CartItem } from 'src/app/models/cart.model';
import { forkJoin } from 'rxjs';
import { AuthManagerService } from 'src/app/services/auth/auth.manager.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isLoading = true;
  error: string | null = null;
  currentUserOrder: Order = {} as Order;

  constructor(
    private orderService: OrderService,
    private cartManagerService: CartManagerService,
    private authManagerService: AuthManagerService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      orders: this.orderService.getAll(),
      products: this.cartManagerService.getAllProducts(),
    }).subscribe({
      next: ({ orders, products }) => {
        this.orders = orders;
        this.cartItems = products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.images[0],
        }));
        this.totalPrice = this.getTotalPrice();
        this.isLoading = false;

        this.currentUserOrder =
          this.orders.find(
            (order) =>
              order.user_id == this.authManagerService.getCurrentUserId()
          ) || ({} as Order);

        console.log('Orders:', this.orders);
        console.log('Cart items:', this.cartItems);
        console.log('Current User Info:', this.currentUserOrder);
      },
      error: (err) => {
        this.error = 'Failed to load orders or cart items';
        this.isLoading = false;
        console.error('Data loading error:', err);
      },
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}