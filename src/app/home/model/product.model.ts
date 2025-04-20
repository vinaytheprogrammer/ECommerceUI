export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
  }

export interface CartItem extends Product {
    quantity: number;
  }