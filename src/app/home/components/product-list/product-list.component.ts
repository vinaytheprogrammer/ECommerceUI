import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product/product.service'; // Adjust path as needed
import { Product } from '../../../models/product.model'; // Adjust path as needed
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  id!: string;
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log('Extracted ID from route:', this.id);
      this.fetchProductsByCategoryId(this.id);
    });
  }

  fetchProductsByCategoryId(categoryId: string): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data.filter(product => product.categoryId === categoryId);
        console.log(`Filtered products for category ${categoryId}:`, this.products);
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.products = [];
      }
    });
  }
}
