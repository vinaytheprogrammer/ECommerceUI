import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { CartManagerService } from './cart.manager.service';
import { AuthManagerService } from '../auth/auth.manager.service';
import { Cart } from '../../models/cart.model'; // Adjust the import path as needed

fdescribe('Cart Services', () => {
  let cartService: CartService;
  let cartManagerService: CartManagerService;
  let authManagerService: AuthManagerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        CartManagerService,
        {
          provide: AuthManagerService,
          useValue: {
            getCurrentUserId: jasmine.createSpy()
          }
        }
      ]
    });

    cartService = TestBed.inject(CartService);
    cartManagerService = TestBed.inject(CartManagerService);
    authManagerService = TestBed.inject(AuthManagerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


});

fdescribe('CartService', () => {
  let cartService: CartService;
  let httpMock: HttpTestingController;
  const mockCart: Cart = {
    id: 'cart-123',
    userId: '123',
    productsId: ['prod1', 'prod2']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });

    cartService = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(cartService).toBeTruthy();
  });

  it('should get all carts', () => {
    const mockCarts: Cart[] = [mockCart];

    cartService.getAll().subscribe(carts => {
      expect(carts).toEqual(mockCarts);
    });

    const req = httpMock.expectOne('http://localhost:3023/carts');
    expect(req.request.method).toBe('GET');
    req.flush(mockCarts);
  });

  it('should get cart by id', () => {
    cartService.getById('cart-123').subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne('http://localhost:3023/carts/cart-123');
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should create a cart', () => {
    cartService.create(mockCart).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne('http://localhost:3023/carts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCart);
    req.flush(mockCart);
  });

  it('should update a cart', () => {
    const updatedCart: Partial<Cart> = { productsId: ['prod1', 'prod2', 'prod3'] };

    cartService.update('cart-123', updatedCart).subscribe();

    const req = httpMock.expectOne('http://localhost:3023/carts/cart-123');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedCart);
    req.flush(null);
  });

  it('should delete a cart', () => {
    cartService.delete('cart-123').subscribe();

    const req = httpMock.expectOne('http://localhost:3023/carts/cart-123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get product by id', () => {
    const mockProduct = { id: 'prod1', name: 'Product 1' };

    cartService.getProductById('prod1').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:3021/products/prod1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });
});