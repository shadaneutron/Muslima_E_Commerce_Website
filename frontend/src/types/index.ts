
export interface Product {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  price: number;
  category: string;
  image: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'bank' | 'visa' | 'cod';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export type Language = 'ar' | 'en';
