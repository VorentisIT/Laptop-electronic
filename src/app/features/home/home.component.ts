import { Component, inject, signal, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroStageComponent } from '../../shared/components/hero-stage/hero-stage.component';
import { Product3dViewerComponent } from '../../shared/components/product-3d-viewer/product-3d-viewer.component';
import { ExplodedViewComponent } from '../../shared/components/exploded-view/exploded-view.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    HeroStageComponent, 
    Product3dViewerComponent, 
    ExplodedViewComponent, 
    ProductCardComponent
  ],
  template: `
    <div class="home-page">
      <!-- 1. Hero Stage (Pinned 40-Frame Video Scroller) -->
      <app-hero-stage></app-hero-stage>

      <!-- 2. Architectural Manifesto Section -->
      <section #manifestoSec class="manifesto-section container-custom">
        <div class="manifesto-grid">
          <div class="manifesto-left">
            <span class="tech-badge violet">VORENTIS ARCHITECTURAL MANIFESTO</span>
            <h2 class="editorial-huge-title font-display">
              <span class="manifesto-line block">THIS ISN'T A STORE.</span>
              <span class="manifesto-line block">THIS IS WHERE</span>
              <span class="manifesto-line block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">TECHNOLOGY IS</span>
              <span class="manifesto-line block">EXPERIENCED.</span>
            </h2>
          </div>
          <div class="manifesto-right">
            <p class="manifesto-body font-heading">
              We reject the sea of generic plastic chassis, thermal throttling compromises, and uncalibrated displays. 
              Vorentis engineers silicon hardware at the absolute physical frontier of thermodynamics, materials science, and human interface ergonomics.
            </p>
            <div class="stats-row font-mono">
              <div class="stat-box tech-box">
                <div class="stat-icon">⚡</div>
                <span class="stat-val text-cyan-400"><span #statTdp>275</span>W</span>
                <span class="stat-lbl">Continuous TDP Sustained</span>
              </div>
              <div class="stat-box tech-box">
                <div class="stat-icon">💎</div>
                <span class="stat-val text-emerald-400">0.03ms</span>
                <span class="stat-lbl">OLED Response Speed</span>
              </div>
              <div class="stat-box tech-box">
                <div class="stat-icon">🎯</div>
                <span class="stat-val text-amber-400"><span #statHz>8000</span>Hz</span>
                <span class="stat-lbl">Optical Input Polling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Interactive 4K Hardware Turntable Bay -->
      <section #labSec class="lab-viewer-section container-custom">
        <div class="section-intro">
          <div class="intro-badge">
            <span class="tech-badge emerald">INTERACTIVE 4K HARDWARE STUDIO</span>
          </div>
          <h2 class="section-title font-display">360° PRECISION TURNTABLE</h2>
          <p class="section-desc font-heading">
            Drag to rotate across all 40 camera angles. Inspect finish variants, trigger 360° auto-spins, and jump directly to key architectural components.
          </p>
        </div>

        <app-product-3d-viewer [colors]="flagshipProduct.colors"></app-product-3d-viewer>
      </section>

      <!-- 4. Layered Hardware Blueprint Story Section -->
      <section #explodedSec class="exploded-story-section container-custom">
        <app-exploded-view [layers]="flagshipProduct.explodedLayers || []"></app-exploded-view>
      </section>

      <!-- 5. Editorial Discovery & Asymmetric Product Rail -->
      <section #discoverySec class="discovery-section container-custom">
        <div class="discovery-header">
          <div>
            <span class="tech-badge">HARDWARE DISCOVERY // 2026</span>
            <h2 class="section-title font-display mt-2">THE 2026 SILICON LINEUP</h2>
          </div>
          
          <div class="category-filter-pills font-mono">
            <button 
              class="filter-pill" 
              [class.is-active]="activeCategory() === 'all'"
              (click)="activeCategory.set('all')">
              ALL HARDWARE ({{ products().length }})
            </button>
            <button 
              class="filter-pill" 
              [class.is-active]="activeCategory() === 'laptops'"
              (click)="activeCategory.set('laptops')">
              COMPUTERS
            </button>
            <button 
              class="filter-pill" 
              [class.is-active]="activeCategory() === 'components'"
              (click)="activeCategory.set('components')">
              SILICON &amp; GPU
            </button>
            <button 
              class="filter-pill" 
              [class.is-active]="activeCategory() === 'displays'"
              (click)="activeCategory.set('displays')">
              DISPLAYS
            </button>
          </div>
        </div>

        <!-- Asymmetric Editorial Grid -->
        <div #productsGrid class="products-editorial-grid">
          @for (prod of displayedProducts(); track prod.id; let idx = $index) {
            <div class="product-item-wrap" [class.featured-span]="idx === 0">
              <app-product-card [product]="prod"></app-product-card>
            </div>
          }
        </div>
      </section>

      <!-- 6. "Find My Device" Neural Configurator Teaser Console -->
      <section #configuratorSec class="configurator-teaser container-custom">
        <div class="teaser-card tech-box">
          <div class="teaser-content">
            <span class="tech-badge amber">AI-GUIDED CONSULTATION</span>
            <h2 class="teaser-heading font-display">FIND YOUR PERFECT RIG</h2>
            <p class="teaser-desc font-heading">
              Don't browse hundreds of specs manually. Answer 3 quick workflow questions and let our neural allocator match your workload with 99% accuracy.
            </p>
            <div class="teaser-cta-group mt-6">
              <a routerLink="/configurator" class="btn-vorentis-primary" data-cursor="EXPLORE">
                <span>LAUNCH FIND MY DEVICE ➔</span>
              </a>
              <a routerLink="/compare" class="btn-vorentis-secondary" data-cursor="VIEW">
                COMPARE MATRIX
              </a>
            </div>
          </div>

          <div class="teaser-preview font-mono text-xs">
            <div class="preview-step-pill tech-box">
              <div class="step-badge text-cyan-400">01</div>
              <div class="step-body">
                <strong class="text-white">Workflow Allocation</strong>
                <span class="text-slate-400 text-xs block">AI / 3D Graphics / Gaming / Code</span>
              </div>
            </div>
            <div class="preview-step-pill tech-box">
              <div class="step-badge text-cyan-400">02</div>
              <div class="step-body">
                <strong class="text-white">Hardware Priority Matrix</strong>
                <span class="text-slate-400 text-xs block">Max VRAM vs Battery vs 240Hz Display</span>
              </div>
            </div>
            <div class="preview-step-pill tech-box">
              <div class="step-badge text-emerald-400">03</div>
              <div class="step-body">
                <strong class="text-emerald-400">99.4% Scored Match</strong>
                <span class="text-slate-400 text-xs block">Instant Direct Checkout Configuration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Tech Lab Interactive Research Pillars -->
      <section #techLabSec class="tech-lab-teaser container-custom section-spacing">
        <div class="tech-lab-banner tech-box">
          <div class="lab-info">
            <span class="tech-badge violet">VORENTIS RESEARCH LAB</span>
            <h2 class="font-display text-3xl md:text-5xl font-extrabold mt-3 text-white">
              WHAT IT DOES.<br/>WHY IT MATTERS.
            </h2>
            <p class="text-slate-300 font-heading mt-4 max-w-md">
              Demystify NPU tops, 12-layer PCB dielectric losses, and vacuum vapor-chamber capillary dynamics in our interactive laboratory.
            </p>
            <a routerLink="/tech-lab" class="btn-vorentis-secondary mt-6" data-cursor="EXPLORE">
              ENTER TECH LAB ➔
            </a>
          </div>
          <div class="lab-specs-grid font-mono text-xs">
            <div class="spec-tile tech-box">
              <span class="text-cyan-400 font-bold text-2xl">5090</span>
              <strong class="text-white font-heading">Liquid GPU Core</strong>
              <span class="text-slate-400 text-xs">24GB GDDR7 · 175W Boost</span>
            </div>
            <div class="spec-tile tech-box">
              <span class="text-emerald-400 font-bold text-2xl">Si-C</span>
              <strong class="text-white font-heading">Solid-State Battery</strong>
              <span class="text-slate-400 text-xs">99.9Wh FAA Maximum · 140W GaN</span>
            </div>
            <div class="spec-tile tech-box">
              <span class="text-amber-400 font-bold text-2xl">240Hz</span>
              <strong class="text-white font-heading">Tandem Mini-LED</strong>
              <span class="text-slate-400 text-xs">2,500 Nits · Delta-E &lt; 0.8</span>
            </div>
            <div class="spec-tile tech-box">
              <span class="text-purple-400 font-bold text-2xl">CAMM2</span>
              <strong class="text-white font-heading">DDR5-7500 MT/s</strong>
              <span class="text-slate-400 text-xs">Low-Loss Dielectric Substrate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      position: relative;
      overflow-x: hidden;
      background: #020610;
    }

    .manifesto-section {
      padding-top: 6rem;
      padding-bottom: 6rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      z-index: 5;
    }

    .manifesto-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .editorial-huge-title {
      font-size: clamp(2.4rem, 4.5vw, 4.8rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-top: 1rem;
      color: #f8fafc;
    }

    .manifesto-body {
      font-size: 1.15rem;
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 2.5rem;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat-box {
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      border-radius: 6px;
      background: #060b17;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.3s ease;
    }

    .stat-box:hover {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.05);
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 242, 255, 0.15);
    }

    .stat-icon {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .stat-val {
      font-size: 1.8rem;
      font-weight: 800;
    }

    .stat-lbl {
      font-size: 0.65rem;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 0.35rem;
      letter-spacing: 0.05em;
    }

    .lab-viewer-section {
      padding-top: 6rem;
      padding-bottom: 4rem;
      position: relative;
      z-index: 5;
    }

    .section-intro {
      margin-bottom: 2.5rem;
    }

    .section-title {
      font-size: clamp(2rem, 3.2vw, 3.2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-top: 0.5rem;
      color: #f8fafc;
    }

    .section-desc {
      font-size: 1rem;
      color: #94a3b8;
      max-width: 600px;
      margin-top: 0.5rem;
    }

    .exploded-story-section {
      position: relative;
      z-index: 5;
    }

    .discovery-section {
      padding-top: 6rem;
      padding-bottom: 6rem;
      position: relative;
      z-index: 5;
    }

    .discovery-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .category-filter-pills {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-pill {
      padding: 0.55rem 1.15rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #94a3b8;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-pill:hover, .filter-pill.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
      box-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
    }

    .products-editorial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
    }

    .featured-span {
      grid-column: span 1;
    }

    .configurator-teaser {
      margin: 5rem auto;
      position: relative;
      z-index: 5;
    }

    .teaser-card {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 3.5rem;
      padding: 4rem;
      background: radial-gradient(circle at 80% 50%, #0f1c36 0%, #060b17 80%);
      border-radius: 8px;
      border: 1px solid rgba(0, 242, 255, 0.35);
      box-shadow: 0 0 45px rgba(0, 242, 255, 0.15);
      align-items: center;
    }

    .teaser-heading {
      font-size: clamp(2rem, 3.5vw, 3.5rem);
      font-weight: 800;
      color: #f8fafc;
      margin: 0.75rem 0 1rem;
    }

    .teaser-desc {
      font-size: 1.05rem;
      color: #cbd5e1;
      line-height: 1.6;
    }

    .teaser-cta-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .teaser-preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preview-step-pill {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.5rem;
      background: rgba(11, 19, 36, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .preview-step-pill:hover {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.06);
      transform: translateX(4px);
    }

    .step-badge {
      font-weight: 800;
      font-size: 1.2rem;
    }

    .tech-lab-teaser {
      position: relative;
      z-index: 5;
    }

    .tech-lab-banner {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3.5rem;
      padding: 4rem;
      background: #060b17;
      border-radius: 8px;
      border: 1px solid rgba(139, 92, 246, 0.3);
      box-shadow: 0 0 45px rgba(139, 92, 246, 0.15);
      align-items: center;
    }

    .lab-specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    .spec-tile {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      border-radius: 6px;
      background: #0b1324;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.3s ease;
    }

    .spec-tile:hover {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.08);
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2);
    }

    @media (max-width: 1024px) {
      .manifesto-grid, .teaser-card, .tech-lab-banner {
        grid-template-columns: 1fr;
        padding: 2.5rem 1.5rem;
        gap: 2rem;
      }
      .stats-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('manifestoSec') manifestoSec!: ElementRef<HTMLElement>;
  @ViewChild('statTdp') statTdp!: ElementRef<HTMLElement>;
  @ViewChild('statHz') statHz!: ElementRef<HTMLElement>;

  private productService = inject(ProductService);

  readonly products = this.productService.products;
  readonly flagshipProduct = this.productService.flagshipProduct();
  activeCategory = signal<string>('all');

  displayedProducts() {
    const cat = this.activeCategory();
    if (cat === 'all') return this.products();
    return this.products().filter(p => p.category === cat);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initStatsAnimation();
      ScrollTrigger.refresh();
    }, 200);
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  private initStatsAnimation() {
    if (!this.manifestoSec) return;

    const tdpObj = { val: 0 };
    if (this.statTdp) {
      gsap.to(tdpObj, {
        val: 275,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.manifestoSec.nativeElement,
          start: 'top 85%'
        },
        onUpdate: () => {
          if (this.statTdp) {
            this.statTdp.nativeElement.textContent = Math.round(tdpObj.val).toString();
          }
        }
      });
    }

    const hzObj = { val: 0 };
    if (this.statHz) {
      gsap.to(hzObj, {
        val: 8000,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.manifestoSec.nativeElement,
          start: 'top 85%'
        },
        onUpdate: () => {
          if (this.statHz) {
            this.statHz.nativeElement.textContent = Math.round(hzObj.val).toString();
          }
        }
      });
    }
  }
}
