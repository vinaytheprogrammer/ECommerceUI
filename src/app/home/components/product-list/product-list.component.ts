import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  id!: string; // Added definite assignment assertion to avoid initialization error
  products: Product[] = []; // Initialize products to an empty array
  constructor(private route: ActivatedRoute) { }

 // Call the function in ngOnInit
 ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.id = params['id'];
    console.log('Extracted ID from route:', this.id);
    this.updateProductsById();
  });
}

  updateProductsById(): void {
    switch (this.id) {
      case '1':
        this.products = this.cameras;
        break;
      case '2':
        this.products = this.watches;
        break;
      case '3':
        this.products = this.shoes;
        break;
      default:
        this.products = [];
        console.warn('Invalid ID, no products to display.');
    }
  }

  
  cameras: Product[] = [
    {
      id: 1,
      name: 'Camera',
      description: 'High-quality DSLR camera with advanced features.',
      price: 500,
      imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-madebymath-90946.jpg&fm=jpg'
    },
    {
      id: 2,
      name: 'Camera Lens',
      description: 'Wide-angle lens for capturing stunning landscapes.',
      price: 300,
      imageUrl: 'https://images.pexels.com/photos/274973/pexels-photo-274973.jpeg?cs=srgb&dl=pexels-pixabay-274973.jpg&fm=jpg'
    },
    {
      id: 3,
      name: 'Camera Tripod',
      description: 'Lightweight and durable tripod for stable shots.',
      price: 150,
      imageUrl: 'https://i.natgeofe.com/n/cae95353-dd17-41f9-85f3-9699745e7ce9/MM10326_20241009_0001.jpg'
    }
  ];


  watches: Product[] = [
    {
      id: 4,
      name: 'Smart Watch',
      description: 'Feature-packed smartwatch with fitness tracking.',
      price: 200,
      imageUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-pixabay-190819.jpg&fm=jpg'
    },
    {
      id: 5,
      name: 'Analog Watch',
      description: 'Classic analog watch with leather strap.',
      price: 100,
      imageUrl: 'https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?cs=srgb&dl=pexels-pixabay-277319.jpg&fm=jpg'
    },
    {
      id: 6,
      name: 'Digital Watch',
      description: 'Durable digital watch with multiple features.',
      price: 80,
      imageUrl: 'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?cs=srgb&dl=pexels-pixabay-125779.jpg&fm=jpg'
    }
  ];

  shoes: Product[] = [
    {
      id: 7,
      name: 'Running Shoes',
      description: 'Comfortable running shoes for daily workouts.',
      price: 120,
      imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?cs=srgb&dl=pexels-daniel-reche-2529148.jpg&fm=jpg'
    },
    {
      id: 8,
      name: 'Formal Shoes',
      description: 'Elegant formal shoes for office and events.',
      price: 150,
      imageUrl: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?cs=srgb&dl=pexels-pixabay-298863.jpg&fm=jpg'
    },
    {
      id: 9,
      name: 'Sneakers',
      description: 'Stylish sneakers for casual wear.',
      price: 90,
      imageUrl: 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?cs=srgb&dl=pexels-daniel-reche-2529147.jpg&fm=jpg'
    }
  ];
}