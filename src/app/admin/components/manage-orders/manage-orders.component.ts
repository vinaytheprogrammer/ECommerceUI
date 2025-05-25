import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  currentOrder: Partial<Order> = {};
  editingOrder = false;
  showOrderForm = false;


  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getAll().subscribe((data) => {
      this.orders = data;
    });
  }

  editOrder(order: Order): void {
    this.currentOrder = { ...order };
    this.editingOrder = true;
    this.showOrderForm = true;
  }

  updateOrder(): void {
    if (this.currentOrder.id) {
      const updatedOrder: Partial<Order> = {
        status: this.currentOrder.status,
        shippingStatus: this.currentOrder.shippingStatus,
        // Add more editable fields here as needed
      };

      this.orderService.update(this.currentOrder.id, updatedOrder).subscribe({
        next: () => {
          this.fetchOrders();
          this.cancelForm();
          alert('Order updated successfully');
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Update failed: ' + (err.error?.message || 'Unknown error'));
        },
      });
    }
  }

  cancelForm(): void {
    this.showOrderForm = false;
    this.editingOrder = false;
    this.currentOrder = {};
  }

  canExit(): boolean {
    // Check if the form is dirty (has unsaved changes)
    const isDirty =
      this.currentOrder.user_id ||
      this.currentOrder.status ||
      this.currentOrder.grandTotal;
    return (
      !isDirty ||
      confirm(
        'Are you sure you want to leave this page? Any unsaved changes will be lost.'
      )
    );
  }
}
