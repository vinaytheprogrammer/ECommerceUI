import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-management',
  templateUrl: './manage-category.component.html'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchText = '';

  showCategoryModal = false;
  isEditing = false;
  currentCategory: Category = { id: '', name: '', description: '', imageUrl: '' };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  applySearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredCategories = this.categories.filter(c => c.name.toLowerCase().includes(text));
  }

  openAddCategoryModal(): void {
    this.isEditing = false;
    this.currentCategory = { id: '', name: '', description: '', imageUrl: '' };
    this.showCategoryModal = true;
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategory = { ...category };
    this.showCategoryModal = true;
  }

  handleCategorySubmit(): void {
    if (this.isEditing) {
      this.categoryService.updateCategory(this.currentCategory.id, this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.showCategoryModal = false;
      });
    } else {
      console.log('Creating new category:', this.currentCategory);
      this.categoryService.createCategory(this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.showCategoryModal = false;
      });
    }
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}
