import { Injectable, signal, computed } from '@angular/core';
import { CartItem, ShippingMethod } from '../models/cart.model';
import { Product, ProductColor } from '../models/product.model';
import { AnalyticsService } from './analytics.service';
import { SoundService } from './sound.service';

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'express_secure',
    name: 'Vorentis Quantum Express (Armored Air Courier)',
    transitTime: '1 - 2 Business Days',
    price: 0, // Free on high-end orders
    isCarbonNeutral: true
  },
  {
    id: 'priority_vault',
    name: 'White-Glove VIP Vault Delivery & Setup',
    transitTime: 'Next Day Morning',
    price: 99,
    isCarbonNeutral: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // State
  readonly items = signal<CartItem[]>([]);
  readonly isCartOpen = signal<boolean>(false);
  readonly discountCode = signal<string>('');
  readonly discountPercent = signal<number>(0);
  readonly discountAmountFixed = signal<number>(0);
  readonly selectedShipping = signal<ShippingMethod>(SHIPPING_METHODS[0]);
  
  // Animation coordinates for flying product to cart icon
  readonly flyingItem = signal<{ startX: number; startY: number; image: string } | null>(null);

  // Computeds
  readonly itemCount = computed(() => {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  });

  readonly subtotal = computed(() => {
    return this.items().reduce((total, item) => total + item.product.price * item.quantity, 0);
  });

  readonly discountAmount = computed(() => {
    const sub = this.subtotal();
    if (this.discountPercent() > 0) {
      return (sub * this.discountPercent()) / 100;
    }
    return Math.min(this.discountAmountFixed(), sub);
  });

  readonly tax = computed(() => {
    const discounted = Math.max(0, this.subtotal() - this.discountAmount());
    return discounted * 0.0825; // 8.25% standard tech rate
  });

  readonly shippingCost = computed(() => {
    return this.subtotal() > 2000 ? 0 : this.selectedShipping().price;
  });

  readonly grandTotal = computed(() => {
    const sub = this.subtotal();
    const disc = this.discountAmount();
    const tx = this.tax();
    const ship = this.shippingCost();
    return Math.max(0, sub - disc + tx + ship);
  });

  constructor(
    private analytics: AnalyticsService,
    private sound: SoundService
  ) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('vorentis_cart_items');
      if (saved) {
        this.items.set(JSON.parse(saved));
      }
    } catch {}
  }

  private saveToStorage() {
    try {
      localStorage.setItem('vorentis_cart_items', JSON.stringify(this.items()));
    } catch {}
  }

  openCart() {
    this.isCartOpen.set(true);
    this.sound.playClick();
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  toggleCart() {
    this.isCartOpen.update(v => !v);
    this.sound.playClick();
  }

  addToCart(
    product: Product,
    selectedColor?: ProductColor,
    options?: { customRam?: string; customStorage?: string; startEvent?: MouseEvent }
  ) {
    const color = selectedColor || product.colors[0];
    const itemId = `${product.id}-${color.name}-${options?.customRam || 'std'}-${options?.customStorage || 'std'}`;

    if (options?.startEvent) {
      this.flyingItem.set({
        startX: options.startEvent.clientX,
        startY: options.startEvent.clientY,
        image: product.heroImage
      });
      setTimeout(() => this.flyingItem.set(null), 900);
    }

    this.items.update(currentItems => {
      const existingIndex = currentItems.findIndex(i => i.id === itemId);
      if (existingIndex > -1) {
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemId,
          product,
          quantity: 1,
          selectedColor: color,
          customRam: options?.customRam,
          customStorage: options?.customStorage,
          addedAt: new Date()
        };
        return [...currentItems, newItem];
      }
    });

    this.saveToStorage();
    this.sound.playChime();
    this.analytics.track('add_to_cart', {
      productId: product.id,
      name: product.name,
      price: product.price,
      color: color.name
    });

    // Auto open drawer smoothly
    this.openCart();
  }

  removeFromCart(itemId: string) {
    const item = this.items().find(i => i.id === itemId);
    if (item) {
      this.analytics.track('remove_from_cart', {
        productId: item.product.id,
        name: item.product.name
      });
    }

    this.items.update(items => items.filter(i => i.id !== itemId));
    this.saveToStorage();
    this.sound.playClick();
  }

  updateQuantity(itemId: string, delta: number) {
    this.items.update(items => {
      return items.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });

    this.saveToStorage();
    this.sound.playClick();
  }

  applyDiscount(code: string): { success: boolean; message: string } {
    const clean = code.trim().toUpperCase();
    if (clean === 'VORENTIS10') {
      this.discountCode.set(clean);
      this.discountPercent.set(10);
      this.discountAmountFixed.set(0);
      this.sound.playChime();
      return { success: true, message: 'VIP 10% Discount Applied' };
    } else if (clean === 'APEX500') {
      this.discountCode.set(clean);
      this.discountPercent.set(0);
      this.discountAmountFixed.set(500);
      this.sound.playChime();
      return { success: true, message: '$500 Launch Voucher Applied' };
    } else if (clean === 'CYBER2026') {
      this.discountCode.set(clean);
      this.discountPercent.set(15);
      this.discountAmountFixed.set(0);
      this.sound.playChime();
      return { success: true, message: '15% Future Computing Credit Applied' };
    } else {
      return { success: false, message: 'Invalid or expired access token code.' };
    }
  }

  removeDiscount() {
    this.discountCode.set('');
    this.discountPercent.set(0);
    this.discountAmountFixed.set(0);
  }

  clearCart() {
    this.items.set([]);
    this.saveToStorage();
  }
}
