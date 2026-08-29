import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { SoundService } from '../../core/services/sound.service';
import { Product, ProductColor } from '../../core/models/product.model';
import { Product3dViewerComponent } from '../../shared/components/product-3d-viewer/product-3d-viewer.component';
import { ExplodedViewComponent } from '../../shared/components/exploded-view/exploded-view.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Product3dViewerComponent, ExplodedViewComponent],
  template: `
    @if (product()) {
      <div class="product-detail-page">
        <!-- Top Breadcrumbs -->
        <div class="container-custom pt-24 pb-4">
          <nav class="breadcrumb font-mono text-xs text-slate-400">
            <a routerLink="/" class="hover:text-cyan-400">HOME</a>
            <span>/</span>
            <a routerLink="/products" class="hover:text-cyan-400">CATALOG</a>
            <span>/</span>
            <span class="text-cyan-400 uppercase">{{ product()?.category }}</span>
            <span>/</span>
            <span class="text-slate-200">{{ product()?.name }}</span>
          </nav>
        </div>

        <!-- Main Product Hero Section (2-Column Grid) -->
        <section class="container-custom product-hero-grid">
          <!-- Left Column: Interactive 3D Viewer & Gallery -->
          <div class="visual-column">
            <!-- View Mode Switcher -->
            <div class="view-mode-tabs font-mono text-xs">
              <button 
                class="mode-tab-btn" 
                [class.is-active]="viewMode() === '3d'"
                (click)="viewMode.set('3d')">
                <span>⬡</span> 3D LAB VIEWER
              </button>
              <button 
                class="mode-tab-btn" 
                [class.is-active]="viewMode() === 'gallery'"
                (click)="viewMode.set('gallery')">
                <span>📷</span> HIGH-RES GALLERY ({{ product()?.galleryImages?.length || 1 }})
              </button>
            </div>

            <!-- Visual Stage -->
            @if (viewMode() === '3d') {
              <app-product-3d-viewer [colors]="product()!.colors"></app-product-3d-viewer>
            } @else {
              <div class="gallery-stage tech-box">
                <img [src]="activeGalleryImage()" [alt]="product()?.name" class="main-gallery-img" />
                <div class="gallery-thumbs">
                  @for (img of product()?.galleryImages; track img) {
                    <button 
                      class="thumb-btn" 
                      [class.is-active]="activeGalleryImage() === img"
                      (click)="activeGalleryImage.set(img)">
                      <img [src]="img" [alt]="product()?.name" />
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Right Column: Product Spec Configurator & Order Bay -->
          <div class="config-column">
            <div class="product-header-badge">
              <span class="tech-badge" [class.emerald]="product()?.isFlagship">{{ product()?.badge || 'SERIES 2026' }}</span>
              <span class="font-mono text-xs text-slate-400">{{ product()?.modelCode }}</span>
            </div>

            <h1 class="product-title font-display">{{ product()?.name }}</h1>
            <p class="product-tagline font-heading">{{ product()?.tagline }}</p>

            <!-- Dynamic Configured Price -->
            <div class="price-manifest-row">
              <div class="price-large font-heading text-cyan-400">
                \${{ configuredPrice() | number }}
              </div>
              @if (product()?.originalPrice) {
                <div class="price-orig font-mono">\${{ product()!.originalPrice! + extraPrice() | number }}</div>
              }
              <div class="finance-pill font-mono text-xs">
                Or \${{ (configuredPrice() / 24).toFixed(0) }}/mo with 0% APR
              </div>
            </div>

            <!-- Color Finish Selector -->
            <div class="config-section">
              <div class="config-label font-mono text-xs">
                <span>FINISH:</span>
                <span class="text-cyan-400">{{ selectedColor().name }} ({{ selectedColor().finish }})</span>
              </div>
              <div class="color-options-row">
                @for (color of product()?.colors; track color.name) {
                  <button 
                    class="color-option-btn" 
                    [class.is-active]="selectedColor().name === color.name"
                    (click)="setColor(color)"
                    [title]="color.name">
                    <span class="color-swatch" [style.background-color]="color.hex"></span>
                    <span class="color-name font-mono text-xs">{{ color.name }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Memory Upgrade Modifier -->
            <div class="config-section">
              <div class="config-label font-mono text-xs">
                <span>UNIFIED MEMORY:</span>
                <span class="text-cyan-400">{{ selectedRam().label }}</span>
              </div>
              <div class="option-grid">
                @for (ram of ramOptions; track ram.id) {
                  <button 
                    class="spec-opt-btn" 
                    [class.is-active]="selectedRam().id === ram.id"
                    (click)="selectedRam.set(ram)">
                    <span class="opt-title font-heading">{{ ram.label }}</span>
                    <span class="opt-desc font-mono">{{ ram.spec }}</span>
                    <span class="opt-price font-mono">{{ ram.price === 0 ? 'INCLUDED' : '+\$' + ram.price }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Storage Upgrade Modifier -->
            <div class="config-section">
              <div class="config-label font-mono text-xs">
                <span>SOLID STATE STORAGE:</span>
                <span class="text-cyan-400">{{ selectedStorage().label }}</span>
              </div>
              <div class="option-grid">
                @for (ssd of storageOptions; track ssd.id) {
                  <button 
                    class="spec-opt-btn" 
                    [class.is-active]="selectedStorage().id === ssd.id"
                    (click)="selectedStorage.set(ssd)">
                    <span class="opt-title font-heading">{{ ssd.label }}</span>
                    <span class="opt-desc font-mono">{{ ssd.spec }}</span>
                    <span class="opt-price font-mono">{{ ssd.price === 0 ? 'INCLUDED' : '+\$' + ssd.price }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="order-actions-row">
              <button 
                class="btn-vorentis-primary add-cart-btn" 
                (click)="addToCart($event)" 
                data-cursor="ADD">
                <span>ADD TO HARDWARE MANIFEST</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <button 
                class="btn-vorentis-secondary compare-action-btn"
                [class.is-compared]="isCompared()"
                (click)="toggleCompare()">
                {{ isCompared() ? '✓ IN MATRIX' : '+ COMPARE' }}
              </button>
            </div>

            <!-- Guarantee Badges -->
            <div class="guarantee-list font-mono text-xs text-slate-400">
              <div class="g-item">✓ 3-YEAR VIP ADVANCED REPLACEMENT WARRANTY</div>
              <div class="g-item">✓ 30-DAY ZERO-PIXEL &amp; THERMAL DEFECT GUARANTEE</div>
              <div class="g-item">✓ COMPLIMENTARY ARMORED AIR COURIER</div>
            </div>
          </div>
        </section>

        <!-- Synthetic Benchmarks & Thermal Dynamics Section -->
        <section class="container-custom section-spacing">
          <div class="benchmarks-card tech-box">
            <span class="tech-badge emerald">SYNTHETIC BENCHMARK MATRIX</span>
            <h2 class="font-display text-2xl md:text-3xl font-bold mt-2">PERFORMANCE PROVEN IN SILICON</h2>
            <p class="font-heading text-sm text-slate-400 mt-1 max-w-xl">
              Zero thermal throttling. Liquid metal interfaces and vacuum vapor-chambers maintain peak boost clocks under sustained 24-hour render loads.
            </p>

            <div class="benchmark-meters-grid mt-6">
              <!-- Geekbench 6 -->
              <div class="bench-meter tech-box">
                <div class="bench-label font-mono text-xs">
                  <span>GEEKBENCH 6 MULTI-CORE</span>
                  <span class="text-cyan-400 font-bold">{{ product()?.benchmarks?.geekbenchMultiCore | number }}</span>
                </div>
                <div class="bench-bar-track">
                  <div class="bench-bar-fill" [style.width.%]="((product()?.benchmarks?.geekbenchMultiCore || 0) / 40000) * 100"></div>
                </div>
                <span class="bench-comparison font-mono text-xs text-slate-500">+42% faster than industry baseline</span>
              </div>

              <!-- TimeSpy GPU -->
              <div class="bench-meter tech-box">
                <div class="bench-label font-mono text-xs">
                  <span>3DMARK TIMESPY GRAPHICS</span>
                  <span class="text-emerald-400 font-bold">{{ product()?.benchmarks?.timespyGpuScore | number }}</span>
                </div>
                <div class="bench-bar-track">
                  <div class="bench-bar-fill emerald" [style.width.%]="((product()?.benchmarks?.timespyGpuScore || 0) / 50000) * 100"></div>
                </div>
                <span class="bench-comparison font-mono text-xs text-slate-500">Continuous 4K Ultra 144+ FPS</span>
              </div>

              <!-- Battery Endurance -->
              <div class="bench-meter tech-box">
                <div class="bench-label font-mono text-xs">
                  <span>BATTERY RUNTIME (PRODUCTIVITY)</span>
                  <span class="text-amber-400 font-bold">{{ product()?.benchmarks?.batteryLifeHours }} HOURS</span>
                </div>
                <div class="bench-bar-track">
                  <div class="bench-bar-fill amber" [style.width.%]="((product()?.benchmarks?.batteryLifeHours || 0) / 16) * 100"></div>
                </div>
                <span class="bench-comparison font-mono text-xs text-slate-500">Silicon-carbon solid cell chemistry</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Exploded View Section (if available) -->
        @if (product()?.explodedViewAvailable && product()?.explodedLayers) {
          <section class="container-custom">
            <app-exploded-view [layers]="product()!.explodedLayers!"></app-exploded-view>
          </section>
        }

        <!-- Complete Specifications Grid -->
        <section class="container-custom section-spacing">
          <h2 class="font-display text-2xl md:text-3xl font-bold mb-6">TECHNICAL SPECIFICATIONS</h2>
          <div class="spec-table-grid tech-box font-mono text-xs">
            <div class="spec-entry">
              <span class="spec-name text-slate-400">CENTRAL PROCESSOR</span>
              <span class="spec-val text-slate-100 font-bold">{{ product()?.specs?.processor }}</span>
            </div>
            <div class="spec-entry">
              <span class="spec-name text-slate-400">GRAPHICS ENGINE</span>
              <span class="spec-val text-cyan-400 font-bold">{{ product()?.specs?.graphics }}</span>
            </div>
            <div class="spec-entry">
              <span class="spec-name text-slate-400">DISPLAY PANEL</span>
              <span class="spec-val text-slate-100">{{ product()?.specs?.display }} ({{ product()?.specs?.displayNits }} nits peak)</span>
            </div>
            <div class="spec-entry">
              <span class="spec-name text-slate-400">COOLING SOLUTION</span>
              <span class="spec-val text-slate-100">{{ product()?.specs?.cooling }}</span>
            </div>
            <div class="spec-entry">
              <span class="spec-name text-slate-400">CHASSIS WEIGHT</span>
              <span class="spec-val text-slate-100">{{ product()?.specs?.weight }}</span>
            </div>
            <div class="spec-entry">
              <span class="spec-name text-slate-400">I/O PORTS</span>
              <span class="spec-val text-slate-100">{{ product()?.specs?.ports?.join(' · ') }}</span>
            </div>
            <div class="spec-entry">
              <span class="spec-name text-slate-400">OPERATING SYSTEM</span>
              <span class="spec-val text-slate-100">{{ product()?.specs?.os }}</span>
            </div>
            <div class="spec-entry">
              <span class="spec-name text-slate-400">WARRANTY SLA</span>
              <span class="spec-val text-emerald-400">{{ product()?.specs?.warranty }}</span>
            </div>
          </div>
        </section>

        <!-- Sticky Bottom Purchase Bar -->
        <div class="sticky-order-bar tech-box">
          <div class="container-custom bar-content">
            <div class="bar-left">
              <span class="font-heading font-bold text-white text-sm md:text-base">{{ product()?.name }}</span>
              <span class="font-mono text-xs text-slate-400 hidden sm:inline">
                {{ selectedColor().name }} · {{ selectedRam().label }} · {{ selectedStorage().label }}
              </span>
            </div>
            <div class="bar-right">
              <span class="font-heading font-bold text-cyan-400 text-lg md:text-xl">\${{ configuredPrice() | number }}</span>
              <button class="btn-vorentis-primary py-2 px-4 text-xs" (click)="addToCart($event)" data-cursor="ADD">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .product-detail-page {
      padding-bottom: 6rem;
    }

    .breadcrumb {
      display: flex;
      gap: 0.5rem;
    }

    .product-hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3.5rem;
      align-items: flex-start;
      margin-top: 1rem;
    }

    .visual-column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .view-mode-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .mode-tab-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mode-tab-btn:hover, .mode-tab-btn.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .gallery-stage {
      height: 540px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      border-radius: 8px;
    }

    .main-gallery-img {
      max-width: 80%;
      max-height: 380px;
      object-fit: contain;
    }

    .gallery-thumbs {
      display: flex;
      gap: 0.75rem;
    }

    .thumb-btn {
      width: 54px;
      height: 54px;
      background: #030712;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
    }

    .thumb-btn.is-active {
      border-color: #00f2ff;
    }

    .thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .config-column {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .product-header-badge {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .product-title {
      font-size: clamp(2.2rem, 3.5vw, 3.6rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #f8fafc;
      line-height: 1.05;
    }

    .product-tagline {
      font-size: 1.05rem;
      color: #94a3b8;
      line-height: 1.5;
    }

    .price-manifest-row {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
    }

    .price-large {
      font-size: 2.4rem;
      font-weight: 800;
    }

    .price-orig {
      font-size: 1.2rem;
      color: #64748b;
      text-decoration: line-through;
    }

    .finance-pill {
      background: rgba(0, 242, 255, 0.08);
      border: 1px solid rgba(0, 242, 255, 0.2);
      color: #00f2ff;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }

    .config-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .config-label {
      display: flex;
      justify-content: space-between;
    }

    .color-options-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .color-option-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.85rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      cursor: pointer;
      color: #cbd5e1;
      transition: all 0.2s ease;
    }

    .color-option-btn.is-active {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
      color: #00f2ff;
    }

    .color-swatch {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }

    .spec-opt-btn {
      display: flex;
      flex-direction: column;
      padding: 0.85rem;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .spec-opt-btn.is-active {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.06);
    }

    .opt-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .opt-desc {
      font-size: 0.65rem;
      color: #94a3b8;
      margin: 0.2rem 0 0.4rem;
    }

    .opt-price {
      font-size: 0.75rem;
      font-weight: 700;
      color: #00f2ff;
    }

    .order-actions-row {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .add-cart-btn {
      flex: 1;
    }

    .compare-action-btn {
      min-width: 120px;
    }

    .compare-action-btn.is-compared {
      border-color: #00f2ff;
      color: #00f2ff;
    }

    .guarantee-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .benchmarks-card {
      padding: 3rem;
      background: #080e1a;
      border-radius: 8px;
    }

    .benchmark-meters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .bench-meter {
      padding: 1.5rem;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 4px;
    }

    .bench-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.6rem;
    }

    .bench-bar-track {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .bench-bar-fill {
      height: 100%;
      background: #00f2ff;
      box-shadow: 0 0 10px #00f2ff;
      transition: width 0.6s ease;
    }

    .bench-bar-fill.emerald { background: #10b981; box-shadow: 0 0 10px #10b981; }
    .bench-bar-fill.amber { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; }

    .spec-table-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      overflow: hidden;
    }

    .spec-entry {
      background: #080e1a;
      padding: 1.25rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sticky-order-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(8, 14, 26, 0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(0, 242, 255, 0.2);
      z-index: 100;
      padding: 0.75rem 0;
    }

    .bar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .bar-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .product-hero-grid {
        grid-template-columns: 1fr;
      }
      .spec-table-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private comparisonService = inject(ComparisonService);
  private sound = inject(SoundService);

  product = signal<Product | undefined>(undefined);
  viewMode = signal<'3d' | 'gallery'>('3d');
  activeGalleryImage = signal<string>('');
  selectedColor = signal<ProductColor>({ name: 'Obsidian Void', hex: '#0B0F19', finish: 'Matte' });

  ramOptions = [
    { id: 'ram-32', label: '32GB LPDDR5X', spec: 'Quad-channel 7500 MT/s', price: 0 },
    { id: 'ram-64', label: '64GB CAMM2', spec: 'Next-gen low latency 6400 MT/s', price: 350 },
    { id: 'ram-128', label: '128GB Enterprise', spec: 'ECC Quad-rank High Capacity', price: 850 }
  ];
  selectedRam = signal(this.ramOptions[0]);

  storageOptions = [
    { id: 'ssd-2tb', label: '2TB NVMe Gen 4', spec: '7,400 MB/s Sequential', price: 0 },
    { id: 'ssd-4tb', label: '4TB NVMe Gen 5', spec: '14,000 MB/s Sequential', price: 400 },
    { id: 'ssd-8tb', label: '8TB Dual RAID 0', spec: '28,000 MB/s Extreme', price: 950 }
  ];
  selectedStorage = signal(this.storageOptions[0]);

  extraPrice = computed(() => {
    return this.selectedRam().price + this.selectedStorage().price;
  });

  configuredPrice = computed(() => {
    return (this.product()?.price || 0) + this.extraPrice();
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        const found = this.productService.getProductByIdOrSlug(slug);
        if (found) {
          this.product.set(found);
          this.activeGalleryImage.set(found.heroImage);
          this.selectedColor.set(found.colors[0]);
        }
      }
    });
  }

  setColor(color: ProductColor) {
    this.selectedColor.set(color);
    this.sound.playClick();
  }

  isCompared(): boolean {
    const p = this.product();
    return p ? this.comparisonService.isCompared(p.id) : false;
  }

  toggleCompare() {
    const p = this.product();
    if (p) {
      this.comparisonService.toggleProduct(p);
    }
  }

  addToCart(e: MouseEvent) {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.selectedColor(), {
        customRam: this.selectedRam().label,
        customStorage: this.selectedStorage().label,
        startEvent: e
      });
    }
  }
}
