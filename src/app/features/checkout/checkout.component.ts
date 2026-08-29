import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import { CartService, SHIPPING_METHODS } from '../../core/services/cart.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SoundService } from '../../core/services/sound.service';
import { Order, CheckoutCustomer, ShippingMethod } from '../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-page container-custom">
      <!-- Minimal Trust Header -->
      <div class="checkout-minimal-header">
        <a routerLink="/" class="checkout-logo font-display">
          <img src="images/vorentis-logo.png" alt="Vorentis" class="checkout-logo-img" />
          <span class="checkout-badge font-mono text-xs text-cyan-400">CHECKOUT</span>
        </a>
        <div class="trust-badge font-mono text-xs text-emerald-400">
          🔒 256-BIT TLS ENCRYPTION · SOC-2 VERIFIED
        </div>
      </div>

      @if (!confirmedOrder()) {
        <!-- Main Checkout Flow Grid (2-Column) -->
        <div class="checkout-grid">
          <!-- Left: Customer Information & Steps -->
          <div class="checkout-form-col">
            <!-- Step 1: Customer Details -->
            <div class="form-card tech-box">
              <div class="step-header">
                <span class="step-num font-mono">01</span>
                <h2 class="step-title font-heading">CONTACT &amp; RECIPIENT</h2>
              </div>

              <div class="input-grid">
                <div class="input-group span-2">
                  <label class="font-mono text-xs">EMAIL ADDRESS (FOR SECURE TELEMETRY &amp; TRACKING)</label>
                  <input type="email" [(ngModel)]="customer.email" placeholder="alex@vor-labs.com" class="checkout-input" />
                </div>

                <div class="input-group">
                  <label class="font-mono text-xs">FIRST NAME</label>
                  <input type="text" [(ngModel)]="customer.firstName" placeholder="Alex" class="checkout-input" />
                </div>

                <div class="input-group">
                  <label class="font-mono text-xs">LAST NAME</label>
                  <input type="text" [(ngModel)]="customer.lastName" placeholder="Vance" class="checkout-input" />
                </div>

                <div class="input-group span-2">
                  <label class="font-mono text-xs">COMPANY / LAB NAME (OPTIONAL)</label>
                  <input type="text" [(ngModel)]="customer.company" placeholder="Neural Architectures Inc." class="checkout-input" />
                </div>
              </div>
            </div>

            <!-- Step 2: Shipping Destination -->
            <div class="form-card tech-box mt-6">
              <div class="step-header">
                <span class="step-num font-mono">02</span>
                <h2 class="step-title font-heading">SHIPPING DESTINATION</h2>
              </div>

              <div class="input-grid">
                <div class="input-group span-2">
                  <label class="font-mono text-xs">STREET ADDRESS</label>
                  <input type="text" [(ngModel)]="customer.address1" placeholder="400 Broad Street, Suite 800" class="checkout-input" />
                </div>

                <div class="input-group">
                  <label class="font-mono text-xs">CITY</label>
                  <input type="text" [(ngModel)]="customer.city" placeholder="Seattle" class="checkout-input" />
                </div>

                <div class="input-group">
                  <label class="font-mono text-xs">STATE / PROVINCE</label>
                  <input type="text" [(ngModel)]="customer.state" placeholder="WA" class="checkout-input" />
                </div>

                <div class="input-group">
                  <label class="font-mono text-xs">POSTAL CODE</label>
                  <input type="text" [(ngModel)]="customer.postalCode" placeholder="98109" class="checkout-input" />
                </div>

                <div class="input-group">
                  <label class="font-mono text-xs">PHONE NUMBER</label>
                  <input type="tel" [(ngModel)]="customer.phone" placeholder="+1 (555) 019-2834" class="checkout-input" />
                </div>
              </div>
            </div>

            <!-- Step 3: Courier Delivery Method -->
            <div class="form-card tech-box mt-6">
              <div class="step-header">
                <span class="step-num font-mono">03</span>
                <h2 class="step-title font-heading">COURIER DISPATCH METHOD</h2>
              </div>

              <div class="shipping-options-list">
                @for (sm of shippingMethods; track sm.id) {
                  <label 
                    class="shipping-option-card tech-box" 
                    [class.is-selected]="selectedShipping().id === sm.id">
                    <input 
                      type="radio" 
                      name="shipping" 
                      [value]="sm" 
                      [(ngModel)]="selectedShipping" 
                      class="hidden-radio" 
                    />
                    <div class="sm-info">
                      <span class="sm-name font-heading">{{ sm.name }}</span>
                      <span class="sm-time font-mono text-xs text-slate-400">{{ sm.transitTime }} · Carbon Neutral</span>
                    </div>
                    <div class="sm-price font-heading text-cyan-400">
                      {{ sm.price === 0 ? 'FREE' : ('$' + sm.price) }}
                    </div>
                  </label>
                }
              </div>
            </div>

            <!-- Step 4: Secure Payment -->
            <div class="form-card tech-box mt-6">
              <div class="step-header">
                <span class="step-num font-mono">04</span>
                <h2 class="step-title font-heading">SECURE PAYMENT METHOD</h2>
              </div>

              <div class="payment-tabs font-mono text-xs">
                <button 
                  class="pay-tab" 
                  [class.is-active]="paymentMethod() === 'card'"
                  (click)="paymentMethod.set('card')">
                  💳 CREDIT CARD
                </button>
                <button 
                  class="pay-tab" 
                  [class.is-active]="paymentMethod() === 'apple_pay'"
                  (click)="paymentMethod.set('apple_pay')">
                   APPLE PAY / GOOGLE PAY
                </button>
                <button 
                  class="pay-tab" 
                  [class.is-active]="paymentMethod() === 'crypto'"
                  (click)="paymentMethod.set('crypto')">
                  🪙 CRYPTO (USDC / ETH)
                </button>
              </div>

              @if (paymentMethod() === 'card') {
                <div class="input-grid mt-4">
                  <div class="input-group span-2">
                    <label class="font-mono text-xs">CARD NUMBER</label>
                    <input type="text" [(ngModel)]="cardNumber" placeholder="•••• •••• •••• 4242" class="checkout-input font-mono" />
                  </div>
                  <div class="input-group">
                    <label class="font-mono text-xs">EXPIRATION (MM/YY)</label>
                    <input type="text" [(ngModel)]="cardExp" placeholder="12/28" class="checkout-input font-mono" />
                  </div>
                  <div class="input-group">
                    <label class="font-mono text-xs">SECURITY CVC</label>
                    <input type="password" [(ngModel)]="cardCvc" placeholder="•••" class="checkout-input font-mono" />
                  </div>
                </div>
              } @else if (paymentMethod() === 'apple_pay') {
                <div class="express-wallet-box text-center py-6">
                  <p class="text-slate-300 font-heading text-sm mb-3">Biometric authorization ready on supported devices.</p>
                  <div class="text-xs font-mono text-emerald-400">✓ Apple TouchID / FaceID Sync Active</div>
                </div>
              } @else {
                <div class="crypto-box text-center py-6 font-mono text-xs">
                  <p class="text-cyan-400 mb-2">USDC ON ETHEREUM / SOLANA NETWORK</p>
                  <p class="text-slate-400">Escrow address generated automatically upon order placement.</p>
                </div>
              }

              <!-- Submit Payment CTA -->
              <button class="btn-vorentis-primary place-order-btn mt-6" (click)="placeOrder()">
                <span>AUTHORIZE TRANSACTION — \${{ cartService.grandTotal() | number:'1.2-2' }}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          </div>

          <!-- Right: Order Manifest Summary -->
          <div class="checkout-summary-col">
            <div class="summary-card tech-box">
              <h3 class="font-heading text-lg font-bold text-white mb-4">ORDER MANIFEST</h3>

              <!-- Items in cart -->
              <div class="summary-items-list">
                @for (item of cartService.items(); track item.id) {
                  <div class="summary-item-row">
                    <div class="s-thumb">
                      <img [src]="item.product.heroImage" [alt]="item.product.name" />
                    </div>
                    <div class="s-info">
                      <div class="s-name font-heading text-sm font-bold text-white">{{ item.product.name }}</div>
                      <div class="s-meta font-mono text-xs text-slate-400">
                        {{ item.selectedColor.name }} · Qty: {{ item.quantity }}
                      </div>
                      @if (item.customRam) {
                        <div class="s-spec font-mono text-xs text-cyan-400">{{ item.customRam }} · {{ item.customStorage }}</div>
                      }
                    </div>
                    <div class="s-price font-heading font-bold text-white">
                      \${{ (item.product.price * item.quantity) | number }}
                    </div>
                  </div>
                }
              </div>

              <!-- Price Breakdown -->
              <div class="summary-totals font-mono text-xs mt-6">
                <div class="tot-row">
                  <span class="text-slate-400">SUBTOTAL</span>
                  <span class="text-white">\${{ cartService.subtotal() | number:'1.2-2' }}</span>
                </div>
                @if (cartService.discountAmount() > 0) {
                  <div class="tot-row text-cyan-400">
                    <span>DISCOUNT APPLIED</span>
                    <span>-\${{ cartService.discountAmount() | number:'1.2-2' }}</span>
                  </div>
                }
                <div class="tot-row">
                  <span class="text-slate-400">ESTIMATED TAX</span>
                  <span class="text-white">\${{ cartService.tax() | number:'1.2-2' }}</span>
                </div>
                <div class="tot-row">
                  <span class="text-slate-400">ARMORED AIR SHIPPING</span>
                  <span class="text-emerald-400">
                    {{ cartService.shippingCost() === 0 ? 'COMPLIMENTARY' : ('$' + cartService.shippingCost()) }}
                  </span>
                </div>
                <div class="tot-row grand-total">
                  <span class="font-heading text-base font-bold text-white">TOTAL DUE</span>
                  <span class="font-heading text-xl font-bold text-cyan-400">\${{ cartService.grandTotal() | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Order Confirmation Screen with Confetti -->
        <div class="confirmation-stage tech-box text-center">
          <div class="conf-icon font-display text-5xl text-emerald-400 mb-3">✓</div>
          <span class="tech-badge emerald">TRANSACTION EXECUTED SUCCESSFULLY</span>
          <h1 class="font-display text-3xl md:text-5xl font-extrabold text-white mt-3">
            HARDWARE MANIFEST CONFIRMED
          </h1>
          <p class="font-mono text-cyan-400 text-sm mt-2">
            ORDER IDENTIFIER: {{ confirmedOrder()?.orderId }}
          </p>
          <p class="text-slate-300 font-heading text-sm max-w-lg mx-auto mt-4">
            Your customized hardware has entered the precision cleanroom assembly sequence. 
            Telemetry updates and FedEx armored air tracking have been dispatched to <strong>{{ confirmedOrder()?.customer?.email }}</strong>.
          </p>

          <div class="est-box tech-box mt-6 inline-block font-mono text-xs text-slate-300 py-3 px-6">
            <span>ESTIMATED DELIVERY: </span>
            <span class="text-emerald-400 font-bold">2 BUSINESS DAYS (WHITE-GLOVE AIR)</span>
          </div>

          <div class="conf-actions mt-8">
            <a routerLink="/" class="btn-vorentis-primary">
              RETURN TO VORENTIS SHOWROOM ➔
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-page {
      padding-top: 7rem;
      padding-bottom: 6rem;
    }

    .checkout-minimal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .checkout-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.85rem;
      text-decoration: none;
    }

    .checkout-logo-img {
      height: 32px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 12px rgba(0, 242, 255, 0.45));
    }

    .checkout-badge {
      border: 1px solid rgba(0, 242, 255, 0.3);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      background: rgba(0, 242, 255, 0.08);
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 3rem;
      align-items: flex-start;
    }

    .form-card {
      padding: 2rem;
      background: #080e1a;
      border-radius: 6px;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .step-num {
      width: 28px;
      height: 28px;
      background: rgba(0, 242, 255, 0.1);
      border: 1px solid #00f2ff;
      color: #00f2ff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .step-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .input-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .input-group.span-2 {
      grid-column: span 2;
    }

    .checkout-input {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 4px;
      padding: 0.65rem 0.85rem;
      color: #f8fafc;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .checkout-input:focus {
      border-color: #00f2ff;
    }

    .shipping-options-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .shipping-option-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .shipping-option-card.is-selected {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.06);
    }

    .hidden-radio {
      display: none;
    }

    .payment-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .pay-tab {
      padding: 0.5rem 0.85rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      color: #94a3b8;
      cursor: pointer;
    }

    .pay-tab.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .place-order-btn {
      width: 100%;
      padding: 1.1rem;
      font-size: 0.95rem;
    }

    .summary-card {
      padding: 2rem;
      background: #080e1a;
      border-radius: 6px;
      position: sticky;
      top: 6rem;
    }

    .summary-items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 1.5rem;
    }

    .summary-item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .s-thumb {
      width: 48px;
      height: 48px;
      background: #030712;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .s-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .s-info {
      flex: 1;
      min-width: 0;
    }

    .summary-totals {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .tot-row {
      display: flex;
      justify-content: space-between;
    }

    .grand-total {
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 0.5rem;
    }

    .confirmation-stage {
      padding: 5rem 2rem;
      max-width: 800px;
      margin: 2rem auto;
      background: #080e1a;
      border-radius: 8px;
    }

    @media (max-width: 900px) {
      .checkout-grid {
        grid-template-columns: 1fr;
      }
      .input-grid {
        grid-template-columns: 1fr;
      }
      .input-group.span-2 {
        grid-column: span 1;
      }
    }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  private analytics = inject(AnalyticsService);
  private sound = inject(SoundService);
  private router = inject(Router);

  shippingMethods = SHIPPING_METHODS;
  selectedShipping = signal<ShippingMethod>(this.shippingMethods[0]);
  paymentMethod = signal<'card' | 'apple_pay' | 'crypto'>('card');

  customer: CheckoutCustomer = {
    email: 'alex.vance@quantum-lab.io',
    firstName: 'Alex',
    lastName: 'Vance',
    company: 'Quantum Dynamics Lab',
    address1: '400 Broad Street, Tech Tower 800',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98109',
    country: 'United States',
    phone: '+1 (206) 555-0199'
  };

  cardNumber = '4242 •••• •••• 9800';
  cardExp = '10/28';
  cardCvc = '892';

  confirmedOrder = signal<Order | null>(null);

  placeOrder() {
    const orderId = `VOR-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: Order = {
      orderId,
      customer: this.customer,
      items: this.cartService.items(),
      subtotal: this.cartService.subtotal(),
      tax: this.cartService.tax(),
      shippingPrice: this.cartService.shippingCost(),
      discount: this.cartService.discountAmount(),
      total: this.cartService.grandTotal(),
      shippingMethod: this.selectedShipping(),
      paymentMethod: this.paymentMethod(),
      status: 'confirmed',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    };

    this.confirmedOrder.set(order);
    this.sound.playChime();
    this.cartService.clearCart();

    this.analytics.track('purchase', {
      orderId,
      total: order.total,
      itemCount: order.items.length
    });

    // Fire celebration confetti!
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00f2ff', '#3b82f6', '#10b981', '#ffffff']
    });
  }
}
