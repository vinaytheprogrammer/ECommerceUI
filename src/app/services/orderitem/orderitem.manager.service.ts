import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { OrderItemService } from './orderitem.service';
import { OrderItem } from '../../models/order.model'; // Adjust the path as needed
@Injectable({
  providedIn: 'root'
})
export class OrderItemManagerService {
    private orderitemId: string = '';
  constructor(private orderItemService: OrderItemService) {}

  /**
   * Creates an order item entry with multiple product IDs
   */
  putCartItemToOrderItem(orderId: string, productIds: string[]): Observable<OrderItem> {
    const orderItem: OrderItem = {
      id: orderId,
      productsId: productIds
    };
    this.orderitemId = orderId;
    return this.orderItemService.create(orderItem);
  }

  /**
   * Fetch an order item's products by its ID
   */
  getProductsByOrderId(orderId: string): Observable<string[]> {
    return this.orderItemService.getById(orderId).pipe(
      map(orderItem => orderItem.productsId)
    );
  }

  /**
   * Update the product list for an order
   */
  updateProductsForOrder(orderId: string, productIds: string[]): Observable<void> {
    return this.orderItemService.update(orderId, { productsId: productIds });
  }

  /**
   * Delete order item entry
   */
  deleteOrder(orderId: string): Observable<void> {
    return this.orderItemService.delete(orderId);
  }

  /**
   * Bulk create orders (optional convenience)
   */
  bulkCreateOrderItems(orderItems: { orderId: string; productIds: string[] }[]): Observable<OrderItem[]> {
    const requests = orderItems.map(item =>
      this.putCartItemToOrderItem(item.orderId, item.productIds)
    );
    return forkJoin(requests);
  }

  getAllProducts(): Observable<string[]> { 
    return this.getProductsByOrderId(this.orderitemId);
  }
  
}