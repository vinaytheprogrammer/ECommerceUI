export interface Order {
  id: string;
  user_id: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  subtotal?: number;
  taxAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  grandTotal?: number;
  user_email?: string;
  shippingMethod?: string;
  shippingStatus?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliverAt?: string;
  shippingAddress?: string;
  name?: string;
  phone?: string;
}