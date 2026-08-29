import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductCategory, Product } from '../../core/models/product.model';

interface CategoryWorldInfo {
  title: string;
  subtitle: string;
  tagline: string;
  accent: string;
  ambientClass: string;
  features: string[];
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="category-world-page" [ngClass]="currentWorld().ambientClass">
      <!-- Category Cinematic Hero -->
      <section class="category-hero container-custom">
        <span class="tech-badge" [style.border-color]="currentWorld().accent" [style.color]="currentWorld().accent">
          WORLD // {{ categorySlug().toUpperCase() }}
        </span>
        <h1 class="cat-world-title font-display">{{ currentWorld().title }}</h1>
        <p class="cat-world-tagline font-heading text-slate-300">{{ currentWorld().tagline }}</p>
        <p class="cat-world-sub font-sans text-slate-400 max-w-2xl mt-2">{{ currentWorld().subtitle }}</p>

        <!-- World Specialty Pillars -->
        <div class="world-pillars-row font-mono text-xs mt-8">
          @for (f of currentWorld().features; track f) {
            <div class="pillar-pill tech-box">
              <span class="pillar-dot" [style.background-color]="currentWorld().accent"></span>
              <span>{{ f }}</span>
            </div>
          }
        </div>
      </section>

      <!-- Category Products Grid -->
      <section class="container-custom category-products-section">
        <div class="section-top-bar">
          <h2 class="font-display text-2xl font-bold text-white">HARDWARE ALLOCATIONS ({{ categoryProducts().length }})</h2>
          <div class="category-switchers font-mono text-xs">
            <a routerLink="/categories/laptops" class="cat-link" [class.is-active]="categorySlug() === 'laptops'">COMPUTERS</a>
            <a routerLink="/categories/workstations" class="cat-link" [class.is-active]="categorySlug() === 'workstations'">WORKSTATIONS</a>
            <a routerLink="/categories/components" class="cat-link" [class.is-active]="categorySlug() === 'components'">SILICON &amp; GPU</a>
            <a routerLink="/categories/displays" class="cat-link" [class.is-active]="categorySlug() === 'displays'">DISPLAYS</a>
          </div>
        </div>

        <div class="cat-products-grid mt-8">
          @for (product of categoryProducts(); track product.id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .category-world-page {
      padding-top: 8rem;
      padding-bottom: 8rem;
      position: relative;
      transition: background 0.5s ease;
    }

    .ambient-gaming {
      background: radial-gradient(circle at 50% 10%, #150a24 0%, #030712 60%);
    }

    .ambient-creative {
      background: radial-gradient(circle at 50% 10%, #071c26 0%, #030712 60%);
    }

    .ambient-components {
      background: radial-gradient(circle at 50% 10%, #1f1406 0%, #030712 60%);
    }

    .ambient-default {
      background: radial-gradient(circle at 50% 10%, #0a1429 0%, #030712 60%);
    }

    .category-hero {
      margin-bottom: 4rem;
    }

    .cat-world-title {
      font-size: clamp(2.8rem, 5vw, 5rem);
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.03em;
      line-height: 1.05;
      margin: 0.5rem 0;
    }

    .cat-world-tagline {
      font-size: 1.3rem;
      font-weight: 600;
    }

    .cat-world-sub {
      font-size: 1rem;
      line-height: 1.6;
    }

    .world-pillars-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .pillar-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.9rem;
      background: rgba(8, 14, 26, 0.8);
      border-radius: 4px;
    }

    .pillar-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .section-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 1.25rem;
    }

    .category-switchers {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .cat-link {
      padding: 0.4rem 0.8rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .cat-link:hover, .cat-link.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .cat-products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  categorySlug = signal<string>('laptops');
  categoryProducts = signal<Product[]>([]);

  readonly worldConfigs: Record<string, CategoryWorldInfo> = {
    laptops: {
      title: 'PRECISION COMPUTING',
      subtitle: 'Engineered for developers, creators, and mobile workstations with 24-core desktop silicon and unibody titanium-magnesium chassis.',
      tagline: 'Ultralight Monoliths. Tandem Mini-LED. Zero Acoustic Compromise.',
      accent: '#00f2ff',
      ambientClass: 'ambient-default',
      features: ['24-Core Silicon', 'Dual Vapor Chamber', '240Hz 4K Tandem', 'FAA Max 99.9Wh']
    },
    workstations: {
      title: 'NEURAL WORKSTATIONS',
      subtitle: 'Architectural compute stations built for AI neural inference, VFX rendering, and continuous simulation workflows.',
      tagline: '64-Core Threadripper. Dual RTX 5090. Closed-Loop Liquid Immersion.',
      accent: '#3b82f6',
      ambientClass: 'ambient-creative',
      features: ['64-Core Architecture', '64GB GDDR7 VRAM', 'Triple 420mm Liquid Loop', 'ECC Quad-Rank RAM']
    },
    components: {
      title: 'SILICON & LIQUID GPU',
      subtitle: 'Liquid-cooled graphics cards, sintered copper vapor chambers, and extreme PCIe Gen 5 solid state storage arrays.',
      tagline: 'Sub-48°C Under 600W Continuous Load.',
      accent: '#f59e0b',
      ambientClass: 'ambient-components',
      features: ['Integrated 360mm AIO', '3.15 GHz Boost Clock', '32GB GDDR7 on 512-bit', 'Billet Aluminum Chassis']
    },
    displays: {
      title: 'REFERENCE OLED PANELS',
      subtitle: 'Color grading, cinematic mastering, and ultra-high-speed competitive esports displays with 0.03ms pixel response.',
      tagline: '4K 240Hz Quantum Dot OLED Reference Monitors.',
      accent: '#10b981',
      ambientClass: 'ambient-gaming',
      features: ['0.03ms Pixel Response', 'True 10-Bit Color', '140W USB-C Single Cable', '3-Yr Zero Burn-In']
    }
  };

  currentWorld = signal<CategoryWorldInfo>(this.worldConfigs['laptops']);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('category') || 'laptops';
      this.categorySlug.set(slug);

      const world = this.worldConfigs[slug] || this.worldConfigs['laptops'];
      this.currentWorld.set(world);

      const items = this.productService.getProductsByCategory(slug as ProductCategory);
      this.categoryProducts.set(items.length > 0 ? items : this.productService.products());
    });
  }
}
