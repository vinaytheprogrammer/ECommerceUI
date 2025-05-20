import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryCount: number = 0;
  
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute

  ) {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        window.sessionStorage.setItem('authCode', code);
      }
    });
  }

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
}
