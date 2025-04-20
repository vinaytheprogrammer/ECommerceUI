import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  products = [
    {
      id: 1,
      name: 'Camera',
      description: 'Description for Camera',
      imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-madebymath-90946.jpg&fm=jpg'
    },
    {
      id: 2,
      name: 'Watches',
      description: 'Description for Watches',
      imageUrl: 'https://titanworld.com/cdn/shop/files/2648WM04_1_acea2af1-a8c4-4d06-83a3-b43381097683.jpg?v=1730812321&width=2000'
    },
    {
      id: 3,
      name: 'Shoes',
      description: 'Description for Shoes',
      imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg'
    }
  ];
  visit(product: any) {
    console.log('Product visited to cart:', product);
    window.location.href = `/home/product/${product.id}`;
  }
  removeFromCart(product: any) {
    console.log('Product removed from cart:', product);
  }
  viewProductDetails(product: any) {
    console.log('Product details:', product);
  }
}
