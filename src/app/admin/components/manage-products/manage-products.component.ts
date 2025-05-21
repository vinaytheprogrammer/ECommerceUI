import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html'
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentProduct: Product = this.getEmptyProduct();
  isEditing = false;
  imageUrl = '';
  searchText = '';
  showProductModal= false;


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.applySearch();
    });
  }

  openAddProductModal(): void {
    this.currentProduct = this.getEmptyProduct();
    this.imageUrl = '';
    this.isEditing = false;
    this.showProductModal = true;
  }

  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    this.imageUrl = product.images[0] || '';
    this.isEditing = true;
    this.showProductModal = true;
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  handleProductSubmit(form: any): void {
    if (!form.valid) {
      alert('Please complete all fields before saving the product.');
      return;
    }

    this.currentProduct.images = [this.imageUrl];

    if (this.isEditing) {
      this.productService.updateProduct(String(this.currentProduct.id), this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.hideModal();
      });
    } else {
      console.log('Creating product:', this.currentProduct);
      this.productService.createProduct(this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.hideModal();
      });
    }
  }

  applySearch(): void {
    const lower = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(lower)
    );
  }

  private getEmptyProduct(): Product {
    return {
      id: this.generateUUID(),
      name: '',
      price: 0,
      description: '',
      images: [],
      discount: 0,
      categoryId: '',
      brandId: '',
      stock: 0
    };
  }

  private generateUUID(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }



  private hideModal(): void {
    this.showProductModal = false;
  }
}
