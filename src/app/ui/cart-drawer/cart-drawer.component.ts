import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (cartService.isCartOpen()) {
      <div class="cart-backdrop" (click)="cartService.closeCart()"></div>
    }

    <aside class="cart-drawer" [class.is-open]="cartService.isCartOpen()">
      <!-- Cart Header -->
      <div class="cart-header">
        <div class="header-left">
          <span class="font-mono text-cyan-400 text-xs tracking-widest uppercase">HARDWARE MANIFEST</span>
          <h2 class="cart-title font-heading">YOUR CART ({{ cartService.itemCount() }})</h2>
        </div>
        <button class="close-btn" (click)="cartService.closeCart()" aria-label="Close cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Free Shipping Meter -->
      <div class="shipping-meter">
        @if (cartService.subtotal() >= 2000) {
          <div class="meter-text font-mono text-emerald-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            COMPLIMENTARY ARMORED AIR DELIVERY UNLOCKED
          </div>
          <div class="meter-bar-bg">
            <div class="meter-bar-fill emerald" style="width: 100%"></div>
          </div>
        } @else {
          <div class="meter-text font-mono text-slate-300">
            ADD <strong>\${{ (2000 - cartService.subtotal()) | number }}</strong> MORE FOR FREE ARMORED COURIER
          </div>
          <div class="meter-bar-bg">
            <div class="meter-bar-fill" [style.width.%]="(cartService.subtotal() / 2000) * 100"></div>
          </div>
        }
      </div>

      <!-- Items List -->
      <div class="cart-items-container">
        @if (cartService.items().length === 0) {
          <div class="empty-cart">
            <div class="empty-icon font-mono text-cyan-400/40 text-4xl mb-3">[ EMPTY_BAY ]</div>
            <p class="font-heading text-lg font-bold text-slate-200">NO HARDWARE CONFIGURED</p>
            <p class="text-xs text-slate-400 mt-1 max-w-xs text-center">Explore our flagship silicon lineup, custom neural rigs, or OLED workstations.</p>
            <button class="btn-vorentis-primary mt-6" (click)="exploreProducts()">
              EXPLORE CATALOG ➔
            </button>
          </div>
        } @else {
          <div class="items-list">
            @for (item of cartService.items(); track item.id) {
              <div class="cart-item-card tech-box">
                <div class="item-thumb">
                  <img [src]="item.product.heroImage" [alt]="item.product.name" />
                </div>
                <div class="item-info">
                  <div class="item-top">
                    <span class="item-name font-heading">{{ item.product.name }}</span>
                    <button class="item-delete" (click)="cartService.removeFromCart(item.id)" title="Remove item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>

                  <div class="item-meta">
                    <span class="color-indicator">
                      <span class="color-dot" [style.background-color]="item.selectedColor.hex"></span>
                      {{ item.selectedColor.name }}
                    </span>
                    @if (item.customRam) {
                      <span class="spec-pill font-mono">{{ item.customRam }}</span>
                    }
                  </div>

                  <div class="item-bottom">
                    <div class="qty-control">
                      <button class="qty-btn" (click)="cartService.updateQuantity(item.id, -1)">-</button>
                      <span class="qty-val font-mono">{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="cartService.updateQuantity(item.id, 1)">+</button>
                    </div>
                    <div class="item-price font-heading">
                      \${{ (item.product.price * item.quantity) | number }}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Cart Footer -->
      @if (cartService.items().length > 0) {
        <div class="cart-footer">
          <!-- Discount Code -->
          <div class="discount-wrapper">
            @if (cartService.discountCode()) {
              <div class="active-discount">
                <span class="font-mono text-xs text-cyan-400">APPLIED: {{ cartService.discountCode() }}</span>
                <button class="text-xs text-rose-400 underline cursor-pointer" (click)="cartService.removeDiscount()">Remove</button>
              </div>
            } @else {
              <div class="discount-input-row">
                <input 
                  type="text" 
                  [(ngModel)]="couponInput" 
                  placeholder="PROMO CODE (e.g. VORENTIS10)" 
                  class="discount-input font-mono"
                  (keyup.enter)="applyCoupon()"
                />
                <button class="apply-btn" (click)="applyCoupon()">APPLY</button>
              </div>
            }
            @if (couponMessage) {
              <div class="coupon-feedback" [class.is-error]="couponError">{{ couponMessage }}</div>
            }
          </div>

          <!-- Price Summary Breakdown -->
          <div class="summary-breakdown font-mono text-xs">
            <div class="summary-row">
              <span class="text-slate-400">SUBTOTAL</span>
              <span class="text-slate-200">\${{ cartService.subtotal() | number:'1.2-2' }}</span>
            </div>
            @if (cartService.discountAmount() > 0) {
              <div class="summary-row text-cyan-400">
                <span>DISCOUNT</span>
                <span>-\${{ cartService.discountAmount() | number:'1.2-2' }}</span>
              </div>
            }
            <div class="summary-row">
              <span class="text-slate-400">ESTIMATED TAX</span>
              <span class="text-slate-200">\${{ cartService.tax() | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span class="text-slate-400">DELIVERY (ARMORED)</span>
              <span class="text-emerald-400">
                {{ cartService.shippingCost() === 0 ? 'FREE' : ('$' + cartService.shippingCost()) }}
              </span>
            </div>
            <div class="summary-row total-row">
              <span class="font-heading text-sm font-bold text-white">TOTAL</span>
              <span class="font-heading text-lg font-bold text-cyan-400">\${{ cartService.grandTotal() | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Direct Checkout CTA -->
          <button class="checkout-btn" (click)="goToCheckout()">
            <span>PROCEED TO SECURE CHECKOUT</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
          <div class="guarantee-text font-mono text-center">
            🔒 256-BIT ENCRYPTED · 3-YEAR WARRANTY · 30-DAY ZERO RISK RETURN
          </div>
        </div>
      }
    </aside>
  `,
  styles: [`
    .cart-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(3, 7, 18, 0.7);
      backdrop-filter: blur(8px);
      z-index: 12000;
      animation: fadeIn 0.3s ease;
    }

    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      max-width: 480px;
      height: 100vh;
      background: #080e1a;
      border-left: 1px solid rgba(0, 242, 255, 0.2);
      box-shadow: -15px 0 50px rgba(0, 0, 0, 0.9);
      z-index: 12001;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cart-drawer.is-open {
      transform: translateX(0);
    }

    .cart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .cart-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }

    .close-btn {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      border-color: #00f2ff;
      color: #00f2ff;
    }

    .shipping-meter {
      padding: 1rem 1.5rem;
      background: rgba(15, 23, 42, 0.6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .meter-text {
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .meter-bar-bg {
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    .meter-bar-fill {
      height: 100%;
      background: #00f2ff;
      box-shadow: 0 0 10px #00f2ff;
      transition: width 0.4s ease;
    }

    .meter-bar-fill.emerald {
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }

    .cart-items-container {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .empty-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: 2rem 1rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item-card {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #0b1120;
      border-radius: 6px;
    }

    .item-thumb {
      width: 70px;
      height: 70px;
      border-radius: 4px;
      background: #030712;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .item-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .item-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #f8fafc;
      line-height: 1.3;
    }

    .item-delete {
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 2px;
      transition: color 0.2s ease;
    }

    .item-delete:hover {
      color: #f43f5e;
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0.4rem 0;
    }

    .color-indicator {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .color-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .spec-pill {
      font-size: 0.65rem;
      padding: 0.1rem 0.4rem;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 2px;
      color: #cbd5e1;
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .qty-control {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .qty-btn {
      width: 26px;
      height: 26px;
      background: transparent;
      border: none;
      color: #cbd5e1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .qty-btn:hover {
      color: #00f2ff;
    }

    .qty-val {
      padding: 0 0.5rem;
      font-size: 0.75rem;
      color: #f8fafc;
    }

    .item-price {
      font-weight: 700;
      font-size: 0.95rem;
      color: #00f2ff;
    }

    .cart-footer {
      padding: 1.5rem;
      background: #050811;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .discount-input-row {
      display: flex;
      gap: 0.5rem;
    }

    .discount-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      color: #f8fafc;
      font-size: 0.75rem;
      text-transform: uppercase;
      outline: none;
    }

    .discount-input:focus {
      border-color: #00f2ff;
    }

    .apply-btn {
      background: rgba(0, 242, 255, 0.1);
      border: 1px solid rgba(0, 242, 255, 0.3);
      color: #00f2ff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0 1rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .active-discount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.75rem;
      background: rgba(0, 242, 255, 0.06);
      border: 1px dashed rgba(0, 242, 255, 0.3);
      border-radius: 4px;
    }

    .coupon-feedback {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: #10b981;
      margin-top: 0.35rem;
    }

    .coupon-feedback.is-error {
      color: #f43f5e;
    }

    .summary-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-row {
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 0.25rem;
    }

    .checkout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #00f2ff;
      color: #030712;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 0 25px rgba(0, 242, 255, 0.35);
    }

    .checkout-btn:hover {
      background: #ffffff;
      box-shadow: 0 0 35px rgba(0, 242, 255, 0.6);
      transform: translateY(-2px);
    }

    .guarantee-text {
      font-size: 0.6rem;
      color: #64748b;
      letter-spacing: 0.05em;
    }
  `]
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  couponInput = '';
  couponMessage = '';
  couponError = false;

  applyCoupon() {
    if (!this.couponInput.trim()) return;
    const res = this.cartService.applyDiscount(this.couponInput);
    this.couponMessage = res.message;
    this.couponError = !res.success;
    if (res.success) {
      this.couponInput = '';
    }
  }

  exploreProducts() {
    this.cartService.closeCart();
    this.router.navigate(['/products']);
  }

  goToCheckout() {
    this.cartService.closeCart();
    this.router.navigate(['/checkout']);
  }
}
