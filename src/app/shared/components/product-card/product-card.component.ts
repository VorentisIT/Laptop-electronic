import { Component, Input, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { SoundService } from '../../../core/services/sound.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div 
      class="product-card-2 tech-box spotlight-card" 
      [class.is-hovered]="isHovered()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (mousemove)="onMouseMove($event)"
      data-cursor="VIEW">
      
      <!-- Top Ribbon / Badges -->
      <div class="card-top-bar">
        @if (product.badge) {
          <span class="tech-badge" [class.emerald]="product.isFlagship">{{ product.badge }}</span>
        } @else {
          <span class="category-tag font-mono">{{ product.category }}</span>
        }

        <!-- Compare Action Button -->
        <button 
          class="compare-toggle-btn font-mono" 
          [class.is-compared]="isCompared()"
          (click)="toggleCompare($event)"
          title="Toggle Compare Matrix">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span>{{ isCompared() ? 'COMPARED' : '+ COMPARE' }}</span>
        </button>
      </div>

      <!-- Interactive Visual Bay with Parallax Displacement -->
      <a [routerLink]="['/products', product.slug]" class="image-stage-link">
        <div class="image-stage">
          <!-- Primary Image -->
          <img 
            [src]="product.heroImage" 
            [alt]="product.name"
            class="product-img primary-img"
            [style.transform]="'translate3d(' + imgShiftX + 'px, ' + imgShiftY + 'px, 0) scale(' + (isHovered() ? 1.05 : 1) + ')'"
          />

          <!-- Alternate Gallery Frame on Hover (if available) -->
          @if (product.galleryImages.length > 1) {
            <img 
              [src]="product.galleryImages[1]" 
              [alt]="product.name"
              class="product-img alt-img"
              [class.is-visible]="isHovered()"
            />
          }

          <!-- Micro-spec overlay peek on hover -->
          <div class="spec-overlay-peek font-mono text-xs" [class.is-visible]="isHovered()">
            <div class="peek-item">
              <span class="peek-key">CPU:</span>
              <span class="peek-val">{{ product.specs.processor }}</span>
            </div>
            <div class="peek-item">
              <span class="peek-key">GPU:</span>
              <span class="peek-val text-cyan-400">{{ product.specs.graphics }}</span>
            </div>
          </div>
        </div>
      </a>

      <!-- Bottom Card Information -->
      <div class="card-info">
        <!-- Color variant indicators -->
        <div class="color-chips">
          @for (color of product.colors; track color.name) {
            <span 
              class="color-chip" 
              [style.background-color]="color.hex"
              [title]="color.name">
            </span>
          }
        </div>

        <h3 class="product-title font-heading">
          <a [routerLink]="['/products', product.slug]">{{ product.name }}</a>
        </h3>
        
        <p class="product-tagline">{{ product.tagline }}</p>

        <!-- Price & Quick CTA -->
        <div class="card-footer">
          <div class="price-block">
            <span class="current-price font-heading">\${{ product.price | number }}</span>
            @if (product.originalPrice) {
              <span class="orig-price font-mono">\${{ product.originalPrice | number }}</span>
            }
          </div>

          <button 
            class="quick-add-btn shimmer-btn" 
            (click)="quickAdd($event)"
            data-cursor="ADD"
            title="Add to Cart Manifest">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="font-mono text-xs">ADD</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card-2 {
      position: relative;
      background: #080e1a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
    }

    .product-card-2:hover {
      border-color: rgba(0, 242, 255, 0.4);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 255, 0.12);
      transform: translateY(-4px);
    }

    .card-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem 0.5rem;
      z-index: 10;
    }

    .category-tag {
      font-size: 0.65rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .compare-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      font-size: 0.65rem;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .compare-toggle-btn:hover, .compare-toggle-btn.is-compared {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .image-stage-link {
      text-decoration: none;
      display: block;
    }

    .image-stage {
      position: relative;
      width: 100%;
      height: 240px;
      background: radial-gradient(circle at center, #0f1a30 0%, #080e1a 80%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 1.5rem;
    }

    .product-img {
      max-width: 85%;
      max-height: 85%;
      object-fit: contain;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
      will-change: transform;
    }

    .alt-img {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .alt-img.is-visible {
      opacity: 1;
    }

    .spec-overlay-peek {
      position: absolute;
      bottom: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      background: rgba(8, 14, 26, 0.9);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 0.4rem 0.6rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      pointer-events: none;
      z-index: 5;
    }

    .spec-overlay-peek.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .peek-item {
      display: flex;
      gap: 0.4rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .peek-key {
      color: #64748b;
    }

    .peek-val {
      color: #cbd5e1;
    }

    .card-info {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
      z-index: 2;
    }

    .color-chips {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 0.5rem;
    }

    .color-chip {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .product-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }

    .product-title a {
      color: #f8fafc;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .product-title a:hover {
      color: #00f2ff;
    }

    .product-tagline {
      font-size: 0.8rem;
      color: #94a3b8;
      line-height: 1.4;
      margin-bottom: 1.25rem;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 0.85rem;
    }

    .price-block {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .current-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #00f2ff;
    }

    .orig-price {
      font-size: 0.75rem;
      color: #64748b;
      text-decoration: line-through;
    }

    .quick-add-btn {
      padding: 0.35rem 0.75rem;
      font-size: 0.7rem;
    }

    @media (max-width: 640px) {
      .image-stage {
        height: 200px;
        padding: 1rem;
      }
      .card-info {
        padding: 1rem;
      }
      .product-title {
        font-size: 1rem;
      }
      .product-tagline {
        font-size: 0.78rem;
        margin-bottom: 0.85rem;
      }
      .current-price {
        font-size: 1.1rem;
      }
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);
  private comparisonService = inject(ComparisonService);
  private sound = inject(SoundService);
  private el = inject(ElementRef);

  isHovered = signal<boolean>(false);
  imgShiftX = 0;
  imgShiftY = 0;

  onMouseEnter() {
    this.isHovered.set(true);
    this.sound.playHover();
  }

  onMouseLeave() {
    this.isHovered.set(false);
    this.imgShiftX = 0;
    this.imgShiftY = 0;
  }

  onMouseMove(e: MouseEvent) {
    const rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set 21st.dev mouse coordinate CSS custom properties for radial spotlight
    const cardEl = (this.el.nativeElement as HTMLElement).querySelector('.spotlight-card') as HTMLElement;
    if (cardEl) {
      cardEl.style.setProperty('--mouse-x', `${x}px`);
      cardEl.style.setProperty('--mouse-y', `${y}px`);
    }

    const centerX = x - rect.width / 2;
    const centerY = y - rect.height / 2;
    this.imgShiftX = (centerX / rect.width) * 14;
    this.imgShiftY = (centerY / rect.height) * 14;
  }

  isCompared(): boolean {
    return this.comparisonService.isCompared(this.product.id);
  }

  toggleCompare(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.comparisonService.toggleProduct(this.product);
  }

  quickAdd(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.cartService.addToCart(this.product, undefined, { startEvent: e });
  }
}
