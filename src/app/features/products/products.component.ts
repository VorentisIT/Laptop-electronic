import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductCategory, ProductSegment } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent],
  template: `
    <div class="products-page container-custom">
      <!-- Page Header -->
      <div class="catalog-header">
        <span class="tech-badge">VORENTIS HARDWARE MANIFEST</span>
        <h1 class="catalog-title font-display">THE SILICON VAULT</h1>
        <p class="catalog-sub font-heading">
          Explore our complete lineup of unlocked laptops, liquid-cooled neural workstations, and reference grade components.
        </p>
      </div>

      <!-- Filter Controls & Utility Toolbar -->
      <div class="toolbar-wrapper tech-box">
        <!-- Categories Tabs -->
        <div class="category-tabs font-heading">
          <button 
            class="tab-btn" 
            [class.is-active]="filterState().category === 'all'"
            (click)="setCategory('all')">
            ALL ({{ productService.products().length }})
          </button>
          <button 
            class="tab-btn" 
            [class.is-active]="filterState().category === 'laptops'"
            (click)="setCategory('laptops')">
            COMPUTERS
          </button>
          <button 
            class="tab-btn" 
            [class.is-active]="filterState().category === 'workstations'"
            (click)="setCategory('workstations')">
            WORKSTATIONS
          </button>
          <button 
            class="tab-btn" 
            [class.is-active]="filterState().category === 'components'"
            (click)="setCategory('components')">
            SILICON
          </button>
          <button 
            class="tab-btn" 
            [class.is-active]="filterState().category === 'displays'"
            (click)="setCategory('displays')">
            DISPLAYS
          </button>
          <button 
            class="tab-btn" 
            [class.is-active]="filterState().category === 'accessories'"
            (click)="setCategory('accessories')">
            ACCESSORIES
          </button>
        </div>

        <!-- Right Side: Sort & View Layout Toggle -->
        <div class="toolbar-actions">
          <div class="sort-selector font-mono text-xs">
            <span class="text-slate-400">SORT:</span>
            <select 
              [ngModel]="filterState().sortBy" 
              (ngModelChange)="productService.setSortBy($event)"
              class="sort-dropdown font-mono">
              <option value="featured">FEATURED &amp; FLAGSHIP</option>
              <option value="performance">HIGHEST BENCHMARK</option>
              <option value="price_low">PRICE: LOW TO HIGH</option>
              <option value="price_high">PRICE: HIGH TO LOW</option>
              <option value="rating">HIGHEST RATING</option>
            </select>
          </div>

          <div class="layout-toggle font-mono text-xs">
            <button 
              class="layout-btn" 
              [class.is-active]="layoutMode() === 'grid'"
              (click)="layoutMode.set('grid')" 
              title="Grid View">
              GRID
            </button>
            <button 
              class="layout-btn" 
              [class.is-active]="layoutMode() === 'spec'"
              (click)="layoutMode.set('spec')" 
              title="Technical Matrix View">
              SPECS MATRIX
            </button>
          </div>
        </div>
      </div>

      <!-- Segment Filter Pills -->
      <div class="segment-filter-row font-mono text-xs">
        <span class="text-slate-500">WORKFLOW OPTIMIZATION:</span>
        <button 
          class="segment-pill" 
          [class.is-active]="filterState().segment === 'all'"
          (click)="setSegment('all')">
          ANY
        </button>
        <button 
          class="segment-pill" 
          [class.is-active]="filterState().segment === 'gaming'"
          (click)="setSegment('gaming')">
          GAMING &amp; ESPORTS
        </button>
        <button 
          class="segment-pill" 
          [class.is-active]="filterState().segment === 'creative'"
          (click)="setSegment('creative')">
          CREATIVE &amp; 3D VFX
        </button>
        <button 
          class="segment-pill" 
          [class.is-active]="filterState().segment === 'developer'"
          (click)="setSegment('developer')">
          DEVELOPMENT &amp; AI
        </button>
        <button 
          class="segment-pill" 
          [class.is-active]="filterState().segment === 'business'"
          (click)="setSegment('business')">
          STUDIO / PRO
        </button>
      </div>

      <!-- Catalog Main Grid or Specs Matrix -->
      @if (productService.filteredProducts().length === 0) {
        <div class="empty-state tech-box">
          <span class="font-mono text-cyan-400 text-sm">STATUS: NO MATCHING SIGNALS</span>
          <h3 class="font-heading text-xl font-bold mt-2">NO HARDWARE CONFIGURATIONS FOUND</h3>
          <p class="text-slate-400 text-sm mt-1">Try resetting your active category or workflow filter.</p>
          <button class="btn-vorentis-primary mt-6" (click)="productService.resetFilters()">
            RESET FILTERS
          </button>
        </div>
      } @else {
        @if (layoutMode() === 'grid') {
          <div class="catalog-grid">
            @for (product of productService.filteredProducts(); track product.id) {
              <app-product-card [product]="product"></app-product-card>
            }
          </div>
        } @else {
          <!-- Technical Matrix Layout -->
          <div class="spec-matrix-table tech-box font-mono text-xs">
            <div class="matrix-header">
              <div class="col-name">DEVICE &amp; MODEL</div>
              <div class="col-proc">PROCESSOR</div>
              <div class="col-gpu">GRAPHICS</div>
              <div class="col-mem">MEMORY / STORAGE</div>
              <div class="col-disp">DISPLAY</div>
              <div class="col-bench">GEEKBENCH</div>
              <div class="col-price">PRICE</div>
              <div class="col-action"></div>
            </div>

            @for (prod of productService.filteredProducts(); track prod.id) {
              <div class="matrix-row">
                <div class="col-name">
                  <span class="font-bold text-white block">{{ prod.name }}</span>
                  <span class="text-slate-500">{{ prod.modelCode }}</span>
                </div>
                <div class="col-proc text-slate-300">{{ prod.specs.processor }}</div>
                <div class="col-gpu text-cyan-400">{{ prod.specs.graphics }}</div>
                <div class="col-mem text-slate-300">{{ prod.specs.memory }} / {{ prod.specs.storage }}</div>
                <div class="col-disp text-slate-300">{{ prod.specs.display }}</div>
                <div class="col-bench text-emerald-400">{{ prod.benchmarks.geekbenchMultiCore || 'N/A' }}</div>
                <div class="col-price font-bold text-cyan-400">\${{ prod.price | number }}</div>
                <div class="col-action">
                  <a [routerLink]="['/products', prod.slug]" class="matrix-link">INSPECT ➔</a>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .products-page {
      padding-top: 8rem;
      padding-bottom: 8rem;
    }

    .catalog-header {
      margin-bottom: 2.5rem;
    }

    .catalog-title {
      font-size: clamp(2.4rem, 4.5vw, 4.5rem);
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.03em;
      margin: 0.5rem 0;
    }

    .catalog-sub {
      font-size: 1.1rem;
      color: #94a3b8;
      max-width: 600px;
    }

    .toolbar-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      background: #080e1a;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }

    .category-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 0.5rem 0.9rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn:hover, .tab-btn.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sort-dropdown {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f8fafc;
      padding: 0.4rem 0.6rem;
      border-radius: 4px;
      margin-left: 0.4rem;
      outline: none;
    }

    .layout-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .layout-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
    }

    .layout-btn.is-active {
      background: #00f2ff;
      color: #030712;
      font-weight: 700;
    }

    .segment-filter-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }

    .segment-pill {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .segment-pill:hover, .segment-pill.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.06);
    }

    .catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
    }

    .empty-state {
      padding: 4rem;
      text-align: center;
      border-radius: 6px;
      background: #080e1a;
    }

    .spec-matrix-table {
      overflow-x: auto;
      background: #080e1a;
      border-radius: 6px;
    }

    .matrix-header, .matrix-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr;
      gap: 1rem;
      padding: 1rem 1.5rem;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .matrix-header {
      background: rgba(15, 23, 42, 0.6);
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .matrix-row:hover {
      background: rgba(0, 242, 255, 0.04);
    }

    .matrix-link {
      color: #00f2ff;
      text-decoration: none;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .toolbar-wrapper {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class ProductsComponent {
  productService = inject(ProductService);

  readonly filterState = this.productService.filterState;
  layoutMode = signal<'grid' | 'spec'>('grid');

  setCategory(category: ProductCategory | 'all') {
    this.productService.setCategory(category);
  }

  setSegment(segment: ProductSegment | 'all') {
    this.productService.setSegment(segment);
  }
}
