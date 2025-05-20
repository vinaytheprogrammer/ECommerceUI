import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { Order } from '../../models/order.model';

fdescribe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3020/orders';

const mockOrder: Order = {
    id: '123',
    user_id: '456',
    status: 'pending',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    subtotal: 200,
    taxAmount: 20,
    shippingAmount: 10,
    discountAmount: 5,
    grandTotal: 225,
    user_email: 'user@example.com',
    shippingMethod: 'Standard',
    shippingStatus: 'In Transit',
    trackingNumber: 'TRACK123',
    shippedAt: '2023-01-03T00:00:00Z',
    deliverAt: '2023-01-05T00:00:00Z',
    shippingAddress: '123 Main St, City, Country',
    name: 'John Doe',
    phone: '1234567890'
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should retrieve all orders', () => {
    const orders: Order[] = [mockOrder];

    service.getAll().subscribe(res => {
      expect(res).toEqual(orders);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(orders);
  });

  it('should retrieve order by ID', () => {
    service.getById('123').subscribe(res => {
      expect(res).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${baseUrl}/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should create a new order', () => {
    service.create(mockOrder).subscribe(res => {
      expect(res).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockOrder);
    req.flush(mockOrder);
  });

  it('should get order count', () => {
    service.count().subscribe(res => {
      expect(res.count).toBe(5);
    });

    const req = httpMock.expectOne(`${baseUrl}/count`);
    expect(req.request.method).toBe('GET');
    req.flush({ count: 5 });
  });
});
