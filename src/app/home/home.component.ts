import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryCount: number = 0;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.getCategoryCount();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log('Categories loaded:', this.categories);
    });
  }

  getCategoryCount(): void {
    this.categoryService.getCategoryCount().subscribe((count) => {
      this.categoryCount = count;
    });
  }

  addCategory(): void {
    const newCategory: Category = {
      id: '4',
      name: 'New Category',
      imageUrl: 'https://example.com/image.jpg',
      description: 'A new category description',
    };
    this.categoryService.createCategory(newCategory).subscribe(() => {
      this.loadCategories();
    });
  }

  updateCategory(): void {
    const updatedCategory: Category = {
      id: '3',
      name: 'Updated 4K Ultra HD Monitor',
      imageUrl: 'https://example.com/updated-image.jpg',
      description: 'Updated description for 4K Monitor',
    };
    this.categoryService.updateCategory('3', updatedCategory).subscribe(() => {
      this.loadCategories();
    });
  }


  visit(category: Category) {
    console.log('Category visited:', category);
  }
}
