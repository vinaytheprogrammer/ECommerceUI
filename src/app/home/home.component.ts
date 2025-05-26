import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category/category.service';
import { Category } from '../models/category.model';
import { ActivatedRoute } from '@angular/router';
import { AuthManagerService } from '../services/auth/auth.manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private authManagerService: AuthManagerService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this.exchangeCodeForToken(code);
      }
    });
    this.loadCategories();
    this.getCategoryCount();
  }

  private async exchangeCodeForToken(code: string): Promise<void> {
    // Prevent duplicate calls
    const alreadyProcessed = sessionStorage.getItem('codeProcessed');
    if (alreadyProcessed === code) {
      return;
    }

    sessionStorage.setItem('codeProcessed', code);

    try {
      await this.authManagerService.getAccessToken(code);

      const authState = localStorage.getItem('authState');
      if (authState) {
        const parsedState = JSON.parse(authState);
        if (parsedState?.user) {
          await this.authManagerService.signup(
            parsedState.user.username,
            parsedState.user.email,
            '123',
            parsedState.user.role || 'user',
            parsedState.user.id
          );
        }
      }

      sessionStorage.removeItem('authCode');
      this.router.navigate([], { queryParams: {} }); // Clear ?code= from URL
    } catch (error) {
      console.error('Error exchanging code:', error);
    }
  }

  // ngOnInit(): void {
  //   this.loadCategories();
  //   this.getCategoryCount();
  // }

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
