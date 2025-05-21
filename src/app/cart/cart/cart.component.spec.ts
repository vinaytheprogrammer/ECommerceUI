import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartManagerService } from '../../services/cart/cart.manager.service';
import { AuthManagerService } from '../../services/auth/auth.manager.service';
import { of } from 'rxjs';

fdescribe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartManagerService: jasmine.SpyObj<CartManagerService>;
  let mockAuthManagerService: jasmine.SpyObj<AuthManagerService>;

  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Product 1',
      price: 100,
      images: ['img1.jpg']
    },
    {
      id: 'prod-2',
      name: 'Product 2',
      price: 200,
      images: ['img2.jpg']
    }
  ];

  beforeEach(async () => {
    mockCartManagerService = jasmine.createSpyObj('CartManagerService', ['getAllProducts', 'update']);
    mockAuthManagerService = jasmine.createSpyObj('AuthManagerService', ['getCurrentUserId']);

    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      providers: [
        { provide: CartManagerService, useValue: mockCartManagerService },
        { provide: AuthManagerService, useValue: mockAuthManagerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockAuthManagerService.getCurrentUserId.and.returnValue('user-1');
    mockCartManagerService.getAllProducts.and.returnValue(of(mockProducts));
    mockCartManagerService.update.and.returnValue(of(undefined));

    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cartId and load cart items', () => {
    expect(component.cartId).toBe('cart-user-1');
    expect(component.cartItems.length).toBe(2);
    expect(component.cartItems[0].quantity).toBe(1);
  });

  it('should calculate total items correctly', () => {
    expect(component.getTotalItems()).toBe(2);
  });

  it('should calculate total price correctly', () => {
    expect(component.getTotalPrice()).toBe(300);
  });

  it('should reduce item quantity or remove item when removeItem is called', () => {
    component.cartItems[0].quantity = 2;
    component.removeItem('prod-1');
    expect(component.cartItems[0].quantity).toBe(1);
    expect(mockCartManagerService.update).toHaveBeenCalled();

    component.removeItem('prod-1');
    expect(component.cartItems.find(i => i.id === 'prod-1')).toBeUndefined();
  });

  it('should clear cart items and call update', () => {
    component.clearCart();
    expect(component.cartItems.length).toBe(0);
    expect(mockCartManagerService.update).toHaveBeenCalledWith('cart-user-1', { productsId: [] });
  });

  it('should trigger checkout alert with correct total', () => {
    spyOn(window, 'alert');
    component.getTotalPrice();
    component.checkout();
    expect(window.alert).toHaveBeenCalledWith('Proceeding to checkout! Total price: 300');
  });
});
