import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category.model';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryCount: number = 0;
  token: string = '';
  
  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private route: ActivatedRoute

  ) {
    this.route.queryParams.subscribe((params) => {
      this.authService.getAccessToken(params['code']).subscribe((res) => {
        this.token = res.accessToken;
        window.sessionStorage.removeItem('accessToken');
        window.sessionStorage.removeItem('refreshToken');
        window.sessionStorage.setItem('accessToken', res.accessToken);
        window.sessionStorage.setItem('refreshToken', res.refreshToken);
      });
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
