import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageProductsComponent } from './manage-products.component';
import { ProductService } from '../../../services/product/product.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product.model';


fdescribe('ManageProductsComponent', () => {
  let component: ManageProductsComponent;
  let fixture: ComponentFixture<ManageProductsComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product A',
      description: 'Desc A',
      price: 100,
      discount: 10,
      images: ['image1.jpg'],
      categoryId: 'cat1',
      brandId: 'brand1',
      stock: 5
    },
    {
      id: '2',
      name: 'Product B',
      description: 'Desc B',
      price: 200,
      discount: 0,
      images: ['image2.jpg'],
      categoryId: 'cat2',
      brandId: 'brand2',
      stock: 10
    }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts', 'createProduct', 'updateProduct', 'deleteProduct'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ManageProductsComponent],
      imports: [FormsModule],
      providers: [{ provide: ProductService, useValue: productServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProductsComponent);
    component = fixture.componentInstance;
    mockProductService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    mockProductService.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
  });

  it('should load products on init', () => {
    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should filter products by name', () => {
    component.searchText = 'Product A';
    component.applySearch();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product A');
  });

  it('should open modal to add a new product', () => {
    component.openAddProductModal();
    expect(component.showProductModal).toBeTrue();
    expect(component.isEditing).toBeFalse();
  });

  it('should open modal to edit a product', () => {
    component.editProduct(mockProducts[0]);
    expect(component.showProductModal).toBeTrue();
    expect(component.isEditing).toBeTrue();
    expect(component.currentProduct.name).toBe('Product A');
  });

  it('should delete a product with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockProductService.deleteProduct.and.returnValue(of());

    component.deleteProduct('1');

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith('1');
  });

  it('should handle product submission for create', () => {
    component.showProductModal = true;
    component.isEditing = false;
    component.currentProduct = {
      ...component['getEmptyProduct'](),
      name: 'New Product',
      price: 100,
      description: 'Test',
      categoryId: 'cat',
      brandId: 'brand',
      stock: 5,
      images: []
    };
    component.imageUrl = 'new-image.jpg';
    mockProductService.createProduct.and.returnValue(of(mockProducts[0]));

    component.handleProductSubmit();

    expect(mockProductService.createProduct).toHaveBeenCalled();
    expect(component.showProductModal).toBeFalse();
  });

  it('should handle product submission for update', () => {
    component.showProductModal = true;
    component.isEditing = true;
    component.currentProduct = mockProducts[0];
    component.imageUrl = 'updated-image.jpg';
    mockProductService.updateProduct.and.returnValue(of(mockProducts[0]));

    component.handleProductSubmit();

    expect(mockProductService.updateProduct).toHaveBeenCalled();
    expect(component.showProductModal).toBeFalse();
  });
});
