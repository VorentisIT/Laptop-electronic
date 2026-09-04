import { Component, HostListener, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../../core/services/search.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (searchService.isSearchOpen()) {
      <div class="search-backdrop" (click)="onBackdropClick($event)">
        <div class="search-palette tech-box">
          <!-- Search Header Bar -->
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            
            <input 
              #searchInput
              type="text" 
              class="search-input" 
              placeholder="Search products, specs, silicon, or 'gaming laptop under 3000'..."
              [ngModel]="searchService.query()"
              (ngModelChange)="onQueryChange($event)"
              (keydown.escape)="searchService.closeSearch()"
              (keydown.arrowdown)="navigateResults(1)"
              (keydown.arrowup)="navigateResults(-1)"
              (keydown.enter)="selectActiveResult()"
              autofocus
            />

            <span class="esc-badge" (click)="searchService.closeSearch()">ESC</span>
          </div>

          <!-- Search Body -->
          <div class="search-body">
            @if (searchService.query().trim() === '') {
              <!-- Recent Searches & Quick Filters -->
              <div class="quick-section">
                <div class="section-title">SUGGESTED QUERIES</div>
                <div class="pill-group">
                  @for (term of searchService.recentSearches(); track term) {
                    <button class="query-pill" (click)="setQuery(term)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                      {{ term }}
                    </button>
                  }
                </div>

                <div class="section-title mt-6">QUICK CATEGORIES</div>
                <div class="cat-grid">
                  <button class="cat-card" (click)="jumpToCategory('laptops')">
                    <span class="cat-code">01</span>
                    <span class="cat-name">Laptops &amp; Portables</span>
                  </button>
                  <button class="cat-card" (click)="jumpToCategory('workstations')">
                    <span class="cat-code">02</span>
                    <span class="cat-name">Neural Workstations</span>
                  </button>
                  <button class="cat-card" (click)="jumpToCategory('components')">
                    <span class="cat-code">03</span>
                    <span class="cat-name">GPU &amp; Silicon</span>
                  </button>
                  <button class="cat-card" (click)="jumpToCategory('displays')">
                    <span class="cat-code">04</span>
                    <span class="cat-name">Tandem OLED Displays</span>
                  </button>
                </div>
              </div>
            } @else {
              <!-- Results List -->
              @if (searchService.searchResults().length === 0) {
                <div class="no-results">
                  <div class="no-results-code font-mono text-cyan-400">STATUS 404: ZERO SIGNALS DETECTED</div>
                  <p class="text-sm text-slate-400 mt-2">No hardware matches "{{ searchService.query() }}". Try searching for "Apex", "RTX", "Workstation", or "Under 4000".</p>
                </div>
              } @else {
                <div class="results-list">
                  <div class="section-title">MATCHING HARDWARE ({{ searchService.searchResults().length }})</div>
                  @for (product of searchService.searchResults(); track product.id; let idx = $index) {
                    <div 
                      class="result-item" 
                      [class.is-selected]="selectedIndex === idx"
                      (click)="goToProduct(product)"
                      (mouseenter)="selectedIndex = idx">
                      <div class="product-thumb">
                        <img [src]="product.heroImage" [alt]="product.name" />
                      </div>
                      <div class="product-meta">
                        <div class="product-header">
                          <span class="product-name">{{ product.name }}</span>
                          <span class="product-badge">{{ product.badge || product.category }}</span>
                        </div>
                        <div class="product-spec-line">{{ product.specs.processor }} · {{ product.specs.graphics }}</div>
                      </div>
                      <div class="product-price">
                        <span class="price-val">\${{ product.price | number }}</span>
                        <span class="view-hint">ENTER ↵</span>
                      </div>
                    </div>
                  }
                </div>
              }
            }
          </div>

          <!-- Search Footer -->
          <div class="search-footer">
            <div class="shortcut-tip"><kbd>↑</kbd><kbd>↓</kbd> to navigate</div>
            <div class="shortcut-tip"><kbd>↵</kbd> to select</div>
            <div class="shortcut-tip"><kbd>ESC</kbd> to close</div>
            <div class="brand-sign font-mono">VORENTIS NEURAL SEARCH v2.6</div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .search-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(16px);
      z-index: 10000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }

    .search-palette {
      width: 100%;
      max-width: 680px;
      max-height: 80vh;
      background: #080e1a;
      border: 1px solid rgba(0, 242, 255, 0.25);
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(0, 242, 255, 0.15);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      gap: 1rem;
    }

    .search-icon {
      width: 22px;
      height: 22px;
      color: #00f2ff;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #f8fafc;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.15rem;
      outline: none;
    }

    .search-input::placeholder {
      color: #475569;
    }

    .esc-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      color: #94a3b8;
      cursor: pointer;
    }

    .search-body {
      padding: 1.5rem;
      overflow-y: auto;
      max-height: calc(80vh - 140px);
    }

    .section-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #64748b;
      margin-bottom: 0.75rem;
    }

    .mt-6 { margin-top: 1.5rem; }

    .pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .query-pill {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.85rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      color: #cbd5e1;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .query-pill:hover {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.05);
    }

    .cat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .cat-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .cat-card:hover {
      border-color: rgba(0, 242, 255, 0.4);
      background: rgba(0, 242, 255, 0.05);
    }

    .cat-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: #00f2ff;
    }

    .cat-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.875rem;
      color: #f1f5f9;
      font-weight: 500;
    }

    .results-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .result-item:hover, .result-item.is-selected {
      background: rgba(0, 242, 255, 0.08);
      border-color: rgba(0, 242, 255, 0.3);
      transform: translateX(4px);
    }

    .product-thumb {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      background: #0f172a;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .product-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-meta {
      flex: 1;
      min-width: 0;
    }

    .product-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .product-name {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .product-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem;
      padding: 0.15rem 0.4rem;
      background: rgba(0, 242, 255, 0.1);
      color: #00f2ff;
      border-radius: 2px;
      text-transform: uppercase;
    }

    .product-spec-line {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 0.2rem;
    }

    .product-price {
      text-align: right;
      flex-shrink: 0;
    }

    .price-val {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      color: #00f2ff;
      display: block;
    }

    .view-hint {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem;
      color: #64748b;
    }

    .no-results {
      padding: 3rem 1rem;
      text-align: center;
    }

    .search-footer {
      display: flex;
      align-items: center;
      padding: 0.85rem 1.5rem;
      background: #050811;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      gap: 1rem;
    }

    .shortcut-tip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    kbd {
      padding: 0.1rem 0.35rem;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
      color: #94a3b8;
    }

    .brand-sign {
      margin-left: auto;
      font-size: 0.65rem;
      color: #475569;
    }

    @media (max-width: 640px) {
      .search-backdrop {
        padding-top: 1rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }

      .search-palette {
        max-height: 92vh;
      }

      .search-input-wrapper {
        padding: 1rem;
      }

      .search-input {
        font-size: 1rem;
      }

      .search-body {
        padding: 1rem;
        max-height: calc(92vh - 120px);
      }

      .cat-grid {
        grid-template-columns: 1fr;
      }

      .search-footer {
        padding: 0.65rem 1rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .shortcut-tip {
        display: none;
      }
    }
  `]
})
export class SearchModalComponent implements AfterViewInit {
  searchService = inject(SearchService);
  private router = inject(Router);
  selectedIndex = 0;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 50);
  }

  @HostListener('window:keydown', ['$event'])
  onGlobalKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.searchService.toggleSearch();
    }
  }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('search-backdrop')) {
      this.searchService.closeSearch();
    }
  }

  onQueryChange(val: string) {
    this.searchService.setQuery(val);
    this.selectedIndex = 0;
  }

  setQuery(term: string) {
    this.searchService.setQuery(term);
    this.selectedIndex = 0;
  }

  navigateResults(dir: number) {
    const list = this.searchService.searchResults();
    if (!list.length) return;
    this.selectedIndex = (this.selectedIndex + dir + list.length) % list.length;
  }

  selectActiveResult() {
    const list = this.searchService.searchResults();
    if (list.length > 0 && list[this.selectedIndex]) {
      this.goToProduct(list[this.selectedIndex]);
    }
  }

  goToProduct(product: Product) {
    this.searchService.addRecentSearch(this.searchService.query() || product.name);
    this.searchService.closeSearch();
    this.router.navigate(['/products', product.slug]);
  }

  jumpToCategory(cat: string) {
    this.searchService.closeSearch();
    this.router.navigate(['/categories', cat]);
  }
}
