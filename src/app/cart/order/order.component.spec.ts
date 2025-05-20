import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { OrderService } from '../../services/order/order.service';
import { CartManagerService } from 'src/app/services/cart/cart.manager.service';
import { AuthManagerService } from 'src/app/services/auth/auth.manager.service';
import { of, throwError } from 'rxjs';
import { Order } from '../../models/order.model';

fdescribe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let mockOrderService: any;
  let mockCartManagerService: any;
  let mockAuthManagerService: any;

  beforeEach(async () => {
    mockOrderService = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of([
        { id: 'order1', user_id: '123' },
        { id: 'order2', user_id: '456' }
      ] as Order[]))
    };

    mockCartManagerService = {
      getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(of([
        { id: '1', name: 'Product A', price: 100, images: ['img1.jpg'] },
        { id: '2', name: 'Product B', price: 150, images: ['img2.jpg'] }
      ]))
    };

    mockAuthManagerService = {
      getCurrentUserId: jasmine.createSpy('getCurrentUserId').and.returnValue('123')
    };

    await TestBed.configureTestingModule({
      declarations: [OrderComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: CartManagerService, useValue: mockCartManagerService },
        { provide: AuthManagerService, useValue: mockAuthManagerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders and cart items on init', () => {
    expect(component.orders.length).toBe(2);
    expect(component.cartItems.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(component.totalPrice).toBe(250);
  });

  it('should find the current user’s order', () => {
    expect(component.currentUserOrder.id).toBe('order1');
  });

  it('should handle errors in data loading', () => {
    mockOrderService.getAll.and.returnValue(throwError(() => new Error('Order fetch failed')));
    component.ngOnInit();

    expect(component.error).toBe('Failed to load orders or cart items');
    expect(component.isLoading).toBeFalse();
  });

  it('should calculate total price correctly', () => {
    const total = component.getTotalPrice();
    expect(total).toBe(250);
  });
});
