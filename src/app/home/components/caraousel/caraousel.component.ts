// import { Component } from '@angular/core';

// @Component({
//     selector: 'app-carousel',
//     templateUrl:'./caraousel.component.html'
// })

// export class CarouselComponent{

// } 


import { Component } from '@angular/core';

interface Product {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  discount: number;
}

@Component({
    selector: 'app-carousel',
        templateUrl:'./caraousel.component.html'
})
export class CarouselComponent {

  products: Product[] = [
    {
      imageUrl: "https://images.samsung.com/is/image/samsung/assets/in/smartphones/galaxy-s25-ultra/buy/S25_Titanium_PDP_1600x864.jpg?imbypass=true",
      title: 'Samsung Smart Phones Series ',
      description: 'Make your impression with Samsung',
      price: 19900,
      discount: 20,
    },
    {
      imageUrl: 'https://blaupunktaudio.in/cdn/shop/files/Group_1_3.jpg?v=1730279162',
      title: 'Wireless Headphones',
      description: 'Immersive sound with noise cancellation.',
      price: 2999,
      discount: 15,
    },
    {
      imageUrl: 'https://rukminim2.flixcart.com/fk-p-image/850/400/cf-chitrakaar-prod/b05e2c24db6921f16c56b221e2ddc338.jpeg?q=90',
      title: '4K Ultra HD Smart TV',
      description: 'Cinematic experience with built-in streaming apps.',
      price: 8999,
      discount: 25,
    },
  ];

  currentIndex = 0;

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.products.length) % this.products.length;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }
}
