import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order/order.service';
import { OrderItemManagerService } from '../../services/orderitem/orderitem.manager.service';
import { CartItem } from 'src/app/models/cart.model';
import { forkJoin } from 'rxjs';
import { AuthManagerService } from 'src/app/services/auth/auth.manager.service';
import { ProductService } from 'src/app/services/product/product.service';
// import { CartManagerService } from 'src/app/services/cart/cart.manager.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
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
    private orderItemManagerService: OrderItemManagerService,
    private authManagerService: AuthManagerService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      orders: this.orderService.getAll(),
      products: this.orderItemManagerService.getAllProducts(), // having product id's
    }).subscribe({
      next: ({ orders, products }) => {
        this.orders = orders;
        console.log('Products:', products);
        console.log('Orders:', orders);

        const productObservables = (products ?? []).map((product: any) => {
          return this.productService.getProductById(String(product));
        });

        forkJoin(productObservables).subscribe({
          next: (productDetails) => {
            console.log('Resolved Product Details:', productDetails);
            // Build a count map for product IDs

            const productIds = (products ?? []).map((product: any) =>
              String(product)
            );

            // Create a count map to track the quantity of each product ID
            const countMap = productIds.reduce<Record<string, number>>(
              (acc, id) => {
                acc[id] = (acc[id] || 0) + 1;
                return acc;
              },
              {}
            );

            // Get unique products by ID
            const uniqueProducts = Array.from(
              new Map(
                productDetails.map((p: any) => [String(p.id), p])
              ).values()
            );

            // Build cartItems array in the desired format
            this.cartItems = uniqueProducts
              .filter((p: any) => countMap[String(p.id)])
              .map((p: any) => ({
                id: String(p.id),
                name: p.name ?? '',
                price: p.price,
                quantity: countMap[String(p.id)],
                imageUrl: p.images && p.images[0] ? p.images[0] : '',
              }));
            console.log('Cart Items:', this.cartItems);
            this.totalPrice = this.getTotalPrice();
          },
          error: (err) => {
            this.error = 'Failed to load product details';
            this.isLoading = false;
            console.error('Product loading error:', err);
          },
        });
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
