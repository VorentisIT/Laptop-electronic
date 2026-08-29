import { Product, ProductColor } from './product.model';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
  customRam?: string;
  customStorage?: string;
  addedAt: Date;
}

export interface ShippingMethod {
  id: string;
  name: string;
  transitTime: string;
  price: number;
  isCarbonNeutral: boolean;
}

export interface CheckoutCustomer {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  orderId: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingPrice: number;
  discount: number;
  total: number;
  shippingMethod: ShippingMethod;
  paymentMethod: 'card' | 'apple_pay' | 'crypto' | 'wire';
  status: 'confirmed' | 'processing' | 'shipped';
  createdAt: Date;
  estimatedDelivery: Date;
}
