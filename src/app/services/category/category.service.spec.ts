import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../../models/category.model';

fdescribe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategory: Category = {
    id: '1',
    name: 'Electronics',
    imageUrl: 'http://example.com/electronics.jpg',
    description: 'Electronic gadgets and devices',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService],
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests remain
  });

  it('should retrieve all categories', () => {
    const dummyCategories: Category[] = [mockCategory];

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(1);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne('http://127.0.0.1:3022/categories');
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  it('should retrieve a category by ID', () => {
    service.getCategoryById('1').subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne('http://127.0.0.1:3022/categories/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should create a category', () => {
    service.createCategory(mockCategory).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne('http://127.0.0.1:3022/categories');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCategory);
    req.flush(mockCategory);
  });

  it('should update a category with PUT', () => {
    service.updateCategory('1', mockCategory).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne('http://127.0.0.1:3022/categories/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockCategory);
  });

  it('should patch a category', () => {
    const partialCategory = { name: 'Updated Name' };

    service.patchCategory('1', partialCategory).subscribe(category => {
      expect(category.name).toBe('Updated Name');
    });

    const req = httpMock.expectOne('http://127.0.0.1:3022/categories/1');
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...mockCategory, ...partialCategory });
  });

  it('should get category count', () => {
    service.getCategoryCount().subscribe(count => {
      expect(count).toBe(5);
    });

    const req = httpMock.expectOne('http://127.0.0.1:3022/categories/count');
    expect(req.request.method).toBe('GET');
    req.flush({ count: 5 });
  });
});
