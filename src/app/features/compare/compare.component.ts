import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComparisonService } from '../../core/services/comparison.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="compare-page container-custom">
      <!-- Top Back Navigation Breadcrumb -->
      <div class="page-breadcrumb mb-6">
        <a routerLink="/products" class="back-btn font-mono text-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          PREVIOUS // STORE CATALOG
        </a>
      </div>

      <!-- Compare Header -->
      <div class="compare-header">
        <span class="tech-badge">SYNCHRONIZED BENCHMARK MATRIX</span>
        <h1 class="font-display text-4xl md:text-5xl font-extrabold mt-2 text-white">HARDWARE COMPARISON</h1>
        <p class="font-heading text-slate-400 mt-1 max-w-xl">
          Side-by-side performance telemetry, thermal envelopes, and display calibrations for up to 3 selected machines.
        </p>
      </div>

      <!-- Quick Add Hardware Selector if less than 3 -->
      @if (comparisonService.count() < 3) {
        <div class="quick-add-strip tech-box font-mono text-xs">
          <span class="text-cyan-400">ADD DEVICE TO MATRIX:</span>
          <div class="available-chips">
            @for (p of productService.products(); track p.id) {
              @if (!comparisonService.isCompared(p.id)) {
                <button class="chip-add-btn" (click)="comparisonService.addProduct(p)">
                  + {{ p.name }} (\${{ p.price }})
                </button>
              }
            }
          </div>
        </div>
      }

      @if (comparisonService.count() === 0) {
        <div class="empty-matrix tech-box">
          <span class="font-mono text-cyan-400 text-sm">NO DEVICES STAGED IN MATRIX</span>
          <h3 class="font-heading text-2xl font-bold mt-2 text-white">SELECT HARDWARE TO COMPARE</h3>
          <p class="text-slate-400 text-sm mt-1 max-w-md">
            Click the "+ COMPARE" button on any product card or choose from the available hardware lineup above.
          </p>
          <a routerLink="/products" class="btn-vorentis-primary mt-6">
            BROWSE HARDWARE CATALOG ➔
          </a>
        </div>
      } @else {
        <!-- The 3-Column Comparison Matrix -->
        <div class="matrix-grid">
          @for (product of comparisonService.comparedProducts(); track product.id) {
            <div class="matrix-card tech-box">
              <!-- Top Card Actions -->
              <div class="card-head">
                <span class="tech-badge">{{ product.category }}</span>
                <button class="remove-btn font-mono text-xs" (click)="comparisonService.removeProduct(product.id)">
                  ✕ REMOVE
                </button>
              </div>

              <!-- Winner Highlight Badge (if won) -->
              <div class="winner-trophies">
                @if (comparisonService.winners().bestPerformanceId === product.id) {
                  <span class="trophy-badge perf">👑 BEST PERFORMANCE</span>
                }
                @if (comparisonService.winners().bestValueId === product.id) {
                  <span class="trophy-badge val">⚡ BEST VALUE</span>
                }
                @if (comparisonService.winners().bestBatteryId === product.id) {
                  <span class="trophy-badge bat">🔋 BEST BATTERY</span>
                }
                @if (comparisonService.winners().bestDisplayId === product.id) {
                  <span class="trophy-badge disp">💎 BEST DISPLAY</span>
                }
              </div>

              <!-- Product Image & Name -->
              <div class="product-visual">
                <img [src]="product.heroImage" [alt]="product.name" />
              </div>

              <h3 class="product-title font-heading text-lg font-bold text-white mt-3">
                {{ product.name }}
              </h3>
              <div class="product-price font-heading text-xl font-extrabold text-cyan-400 mt-1">
                \${{ product.price | number }}
              </div>

              <!-- Add to Cart Directly -->
              <button class="btn-vorentis-primary w-full mt-4 text-xs" (click)="addToCart(product, $event)">
                ADD TO MANIFEST
              </button>

              <!-- Comparison Specs Rows -->
              <div class="specs-breakdown font-mono text-xs mt-6">
                <div class="spec-cell">
                  <span class="lbl">PROCESSOR</span>
                  <span class="val text-white font-bold">{{ product.specs.processor }}</span>
                </div>

                <div class="spec-cell">
                  <span class="lbl">GRAPHICS</span>
                  <span class="val text-cyan-400 font-bold">{{ product.specs.graphics }}</span>
                </div>

                <div class="spec-cell">
                  <span class="lbl">GEEKBENCH 6 SCORE</span>
                  <div class="metric-bar-group">
                    <span class="val font-bold">{{ product.benchmarks.geekbenchMultiCore | number }}</span>
                    <div class="mini-bar-track">
                      <div class="mini-bar-fill" [style.width.%]="(product.benchmarks.geekbenchMultiCore / 40000) * 100"></div>
                    </div>
                  </div>
                </div>

                <div class="spec-cell">
                  <span class="lbl">TIMESPY GPU SCORE</span>
                  <div class="metric-bar-group">
                    <span class="val font-bold text-emerald-400">{{ product.benchmarks.timespyGpuScore | number }}</span>
                    <div class="mini-bar-track">
                      <div class="mini-bar-fill emerald" [style.width.%]="(product.benchmarks.timespyGpuScore / 50000) * 100"></div>
                    </div>
                  </div>
                </div>

                <div class="spec-cell">
                  <span class="lbl">DISPLAY PANEL</span>
                  <span class="val text-white">{{ product.specs.display }}</span>
                </div>

                <div class="spec-cell">
                  <span class="lbl">PEAK LUMINANCE</span>
                  <span class="val text-amber-400 font-bold">{{ product.specs.displayNits }} NITS</span>
                </div>

                <div class="spec-cell">
                  <span class="lbl">BATTERY RUNTIME</span>
                  <span class="val text-white font-bold">{{ product.benchmarks.batteryLifeHours }} HOURS</span>
                </div>

                <div class="spec-cell">
                  <span class="lbl">CHASSIS WEIGHT</span>
                  <span class="val text-white">{{ product.specs.weight }}</span>
                </div>

                <div class="spec-cell">
                  <span class="lbl">COOLING SOLUTION</span>
                  <span class="val text-slate-300">{{ product.specs.cooling }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .compare-page {
      padding-top: 6.5rem;
      padding-bottom: 4.5rem;
    }

    .page-breadcrumb {
      display: flex;
      align-items: center;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.85rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 4px;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
      transform: translateX(-2px);
    }

    .compare-header {
      margin-bottom: 2rem;
    }

    .quick-add-strip {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #080e1a;
      border-radius: 6px;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }

    .available-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .chip-add-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .chip-add-btn:hover {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .empty-matrix {
      padding: 4rem;
      text-align: center;
      border-radius: 6px;
      background: #080e1a;
    }

    .matrix-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .compare-page {
        padding-top: 5rem;
      }

      .matrix-grid {
        gap: 1.25rem;
      }

      .matrix-card {
        padding: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .matrix-grid {
        grid-template-columns: 1fr;
      }

      .empty-matrix {
        padding: 2.5rem 1rem;
      }

      .quick-add-strip {
        padding: 0.85rem;
        flex-direction: column;
        align-items: flex-start;
      }
    }

    .matrix-card {
      padding: 2rem;
      background: #080e1a;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .remove-btn {
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
    }

    .remove-btn:hover {
      color: #f43f5e;
    }

    .winner-trophies {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.75rem;
      min-height: 24px;
    }

    .trophy-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
    }

    .trophy-badge.perf { background: rgba(0, 242, 255, 0.15); color: #00f2ff; border: 1px solid #00f2ff; }
    .trophy-badge.val { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; }
    .trophy-badge.bat { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid #f59e0b; }
    .trophy-badge.disp { background: rgba(168, 85, 247, 0.15); color: #a855f7; border: 1px solid #a855f7; }

    .product-visual {
      width: 100%;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, #111e38 0%, #080e1a 80%);
      border-radius: 6px;
      margin-top: 1rem;
      padding: 1rem;
    }

    .product-visual img {
      max-width: 85%;
      max-height: 85%;
      object-fit: contain;
    }

    .specs-breakdown {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1.5rem;
    }

    .spec-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .spec-cell .lbl {
      color: #64748b;
      font-size: 0.65rem;
    }

    .metric-bar-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .mini-bar-track {
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    .mini-bar-fill {
      height: 100%;
      background: #00f2ff;
    }

    .mini-bar-fill.emerald { background: #10b981; }
  `]
})
export class CompareComponent {
  comparisonService = inject(ComparisonService);
  productService = inject(ProductService);
  private cartService = inject(CartService);

  addToCart(product: any, e: MouseEvent) {
    this.cartService.addToCart(product, undefined, { startEvent: e });
  }
}
