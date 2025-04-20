import { Component, OnInit } from '@angular/core';
import { Product } from '../../../home/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Product = this.getEmptyProduct();
  isEditing = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  openAddProductModal(): void {
    this.currentProduct = this.getEmptyProduct();
    this.isEditing = false;
    this.showModal();
  }

  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    this.isEditing = true;
    this.showModal();
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  handleProductSubmit(): void {
    if (this.isEditing) {
      this.productService.updateProduct(this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.hideModal();
      });
    } else {
      this.productService.addProduct(this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.hideModal();
      });
    }
  }

  private getEmptyProduct(): Product {
    return {
      id: 0,
      name: '',
      price: 0,
      description: '',
      imageUrl: 'https://via.placeholder.com/150'
    };
  }

  private showModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
  }

  private hideModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('productModal'));
    modal.hide();
  }
  
}