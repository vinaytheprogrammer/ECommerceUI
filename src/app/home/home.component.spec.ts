import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { CategoryService } from '../services/category/category.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Category } from '../models/category.model';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  const mockCategories: Category[] = [
    { id: '1', name: 'Electronics', imageUrl: 'electronics.jpg', description: 'Electronic items' },
    { id: '2', name: 'Clothing', imageUrl: 'clothing.jpg', description: 'Apparel and clothing' }
  ];

  beforeEach(async () => {
    const categorySpy = jasmine.createSpyObj('CategoryService', ['getCategories', 'getCategoryCount']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: CategoryService, useValue: categorySpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ code: 'oauth123' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockCategoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should call loadCategories() and getCategoryCount() on init', () => {
    mockCategoryService.getCategories.and.returnValue(of(mockCategories));
    mockCategoryService.getCategoryCount.and.returnValue(of(2));

    fixture.detectChanges();

    expect(mockCategoryService.getCategories).toHaveBeenCalled();
    expect(mockCategoryService.getCategoryCount).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
    expect(component.categoryCount).toBe(2);
  });
});
