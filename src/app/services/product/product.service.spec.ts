import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

fdescribe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://127.0.0.1:3021/products';

  const mockProduct: Product = {
    id: '1',
    name: 'Sample Product',
    description: 'A test product',
    price: 100,
    discount: 10,
    images: ['img1.jpg', 'img2.jpg'],
    categoryId: 'cat123',
    brandId: 'brand123',
    stock: 50
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure all requests are completed
  });

  it('should retrieve all products', () => {
    const mockProducts: Product[] = [mockProduct];

    service.getProducts().subscribe(res => {
      expect(res).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should retrieve a product by ID', () => {
    service.getProductById('1').subscribe(res => {
      expect(res).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a new product', () => {
    service.createProduct(mockProduct).subscribe(res => {
      expect(res).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should update a product', () => {
    const updates = { price: 120 };

    service.updateProduct('1', updates).subscribe(res => {
      expect(res).toEqual({ ...mockProduct, ...updates });
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updates);
    req.flush({ ...mockProduct, ...updates });
  });

  it('should count the number of products', () => {
    service.countProducts().subscribe(res => {
      expect(res.count).toBe(42);
    });

    const req = httpMock.expectOne(`${baseUrl}/count`);
    expect(req.request.method).toBe('GET');
    req.flush({ count: 42 });
  });
});
