export interface Product {
  id: string ;
  name: string;
  description: string;
  price: number;
  discount: number;
  images: string[];
  categoryId: string;
  brandId: string;
  stock: number;
}


export interface CartItem extends Product {
  quantity: number;
}
