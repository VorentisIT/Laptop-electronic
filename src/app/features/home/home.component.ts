import {
  Component,
  inject,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';

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

      <!-- =====================================================
           HERO
           DO NOT TOUCH
           ===================================================== -->

      <app-hero-stage></app-hero-stage>


      <!-- =====================================================
           01 — MANIFESTO
           ===================================================== -->

      <section
        #manifestoSec
        class="manifesto-section"
      >
        <div class="section-grid">

          <div class="manifesto-copy">

            <div class="eyebrow">
              <span class="eyebrow-dot"></span>
              VORENTIS / ARCHITECTURE 01
            </div>

            <h2 class="manifesto-title">

              <span class="manifesto-line">
                NOT JUST
              </span>

              <span class="manifesto-line">
                HARDWARE.
              </span>

              <span class="manifesto-line accent-line">
                AN EXPERIENCE.
              </span>

            </h2>

          </div>


          <div class="manifesto-content">

            <p class="manifesto-description">
              We don't believe technology should disappear behind
              specifications. Every component, surface and interaction
              is engineered to be experienced.
            </p>


            <div class="manifesto-rule"></div>


            <div class="stats-grid">

              <div class="stat-card">

                <span class="stat-index">01</span>

                <strong class="stat-number">
                  <span #statTdp>0</span>W
                </strong>

                <span class="stat-label">
                  Sustained Performance
                </span>

              </div>


              <div class="stat-card">

                <span class="stat-index">02</span>

                <strong class="stat-number">
                  0.03ms
                </strong>

                <span class="stat-label">
                  OLED Response
                </span>

              </div>


              <div class="stat-card">

                <span class="stat-index">03</span>

                <strong class="stat-number">
                  <span #statHz>0</span>Hz
                </strong>

                <span class="stat-label">
                  Input Polling
                </span>

              </div>

            </div>

          </div>

        </div>


        <!-- decorative technical line -->

        <div class="manifesto-axis">
          <span>VOR-01</span>
          <span></span>
          <span>ENGINEERED / 2026</span>
        </div>

      </section>



      <!-- =====================================================
           02 — INTERACTIVE HARDWARE LAB
           ===================================================== -->

      <section
        #labSec
        class="hardware-section"
      >

        <div class="hardware-header">

          <div>

            <div class="eyebrow">
              <span class="eyebrow-dot cyan"></span>
              INTERACTIVE HARDWARE LAB
            </div>

            <h2 class="display-title">
              ROTATE.
              <br>
              INSPECT.
              <br>
              <span>UNDERSTAND.</span>
            </h2>

          </div>


          <div class="hardware-intro">

            <span class="section-number">
              02 / 07
            </span>

            <p>
              Explore every surface of the flagship architecture.
              Drag to rotate and inspect the engineering behind it.
            </p>

          </div>

        </div>


        <div class="viewer-shell">
          <app-product-3d-viewer
            [colors]="flagshipProduct.colors">
          </app-product-3d-viewer>
        </div>

      </section>



      <!-- =====================================================
           03 — EXPLODED STORY
           ===================================================== -->

      <section
        #explodedSec
        class="exploded-section"
      >

        <div class="exploded-intro">

          <div class="eyebrow">
            <span class="eyebrow-dot violet"></span>
            INTERNAL ARCHITECTURE
          </div>

          <h2 class="display-title">
            NOTHING
            <br>
            <span>HIDDEN.</span>
          </h2>

          <p>
            Scroll through the architecture and discover what makes
            the system perform.
          </p>

        </div>


        <div class="exploded-wrapper">

          <app-exploded-view
            [layers]="flagshipProduct.explodedLayers || []">
          </app-exploded-view>

        </div>

      </section>



      <!-- =====================================================
           04 — HORIZONTAL PRODUCT RAIL
           ===================================================== -->

      <section
        #discoverySec
        class="products-section"
      >

        <div class="products-header">

          <div>

            <div class="eyebrow">
              <span class="eyebrow-dot amber"></span>
              HARDWARE COLLECTION / 2026
            </div>

            <h2 class="display-title">
              CHOOSE YOUR
              <br>
              <span>MACHINE.</span>
            </h2>

          </div>


          <div class="product-counter">
            <span>AVAILABLE SYSTEMS</span>
            <strong>
              {{ displayedProducts().length | number:'2.0-0' }}
            </strong>
          </div>

        </div>


        <!-- FILTERS & NAVIGATION CONTROLS -->
        <div class="filter-and-nav-bar">
          <div class="filter-bar">
            <button
              type="button"
              class="filter-button"
              [class.active]="activeCategory() === 'all'"
              (click)="changeCategory('all')"
            >
              ALL
            </button>

            <button
              type="button"
              class="filter-button"
              [class.active]="activeCategory() === 'laptops'"
              (click)="changeCategory('laptops')"
            >
              COMPUTERS
            </button>

            <button
              type="button"
              class="filter-button"
              [class.active]="activeCategory() === 'components'"
              (click)="changeCategory('components')"
            >
              COMPONENTS
            </button>

            <button
              type="button"
              class="filter-button"
              [class.active]="activeCategory() === 'displays'"
              (click)="changeCategory('displays')"
            >
              DISPLAYS
            </button>
          </div>

          <div class="rail-nav-controls">
            <button
              type="button"
              class="rail-nav-btn prev-btn"
              (click)="scrollRail('prev')"
              title="Previous Products"
              aria-label="Previous Products"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              type="button"
              class="rail-nav-btn next-btn"
              (click)="scrollRail('next')"
              title="Next Products"
              aria-label="Next Products"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>


        <!-- PRODUCT RAIL -->
        <div class="rail-viewport-wrapper">
          <button
            type="button"
            class="floating-rail-arrow left-arrow"
            (click)="scrollRail('prev')"
            title="Previous"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div
            #productsRail
            class="products-rail"
          >
            @for (
              prod of displayedProducts();
              track prod.id;
              let idx = $index
            ) {
              <article
                class="product-rail-item"
                [attr.data-index]="idx"
              >
                <div class="product-index">
                  0{{ idx + 1 }}
                </div>

                <app-product-card
                  [product]="prod">
                </app-product-card>
              </article>
            }
          </div>

          <button
            type="button"
            class="floating-rail-arrow right-arrow"
            (click)="scrollRail('next')"
            title="Next"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

      </section>



      <!-- =====================================================
           05 — WORKFLOW CONFIGURATOR
           ===================================================== -->

      <section
        #configuratorSec
        class="workflow-section"
      >

        <div class="workflow-container">

          <div class="workflow-copy">

            <div class="eyebrow">
              <span class="eyebrow-dot emerald"></span>
              CONFIGURATION ENGINE
            </div>

            <h2 class="display-title">
              WHAT ARE
              <br>
              YOU
              <br>
              <span>BUILDING?</span>
            </h2>

            <p>
              Tell us how you work. We'll translate your workflow
              into the hardware architecture you actually need.
            </p>

          </div>


          <div class="workflow-console">

            <div class="console-top">

              <span>
                SELECT WORKLOAD
              </span>

              <span>
                STEP 01 / 03
              </span>

            </div>


            <div class="workflow-options">

              @for (
                workflow of workflows;
                track workflow.id
              ) {

                <button
                  type="button"
                  class="workflow-option spotlight-card"
                  [class.selected]="selectedWorkflow() === workflow.id"
                  (click)="selectWorkflow(workflow.id)"
                >

                  <div class="workflow-thumb">
                    <img [src]="workflow.image" [alt]="workflow.name" class="workflow-img" />
                  </div>

                  <div class="workflow-info">
                    <span class="workflow-name">
                      {{ workflow.name }}
                    </span>

                    <span class="workflow-description">
                      {{ workflow.description }}
                    </span>
                  </div>

                  <span class="workflow-arrow">
                    ↗
                  </span>

                </button>

              }

            </div>


            <div class="workflow-result">

              <div>

                <span class="result-label">
                  RECOMMENDED ARCHITECTURE
                </span>

                <strong>
                  {{ selectedWorkflowData().name }}
                </strong>

              </div>

              <a
                routerLink="/configurator"
                class="magnetic-button"
                data-cursor="EXPLORE"
              >
                CONFIGURE
                <span>→</span>
              </a>

            </div>

          </div>

        </div>

      </section>



      <!-- =====================================================
           06 — TECH LAB
           ===================================================== -->

      <section
        #techLabSec
        class="tech-section"
      >

        <div class="tech-grid-background"></div>


        <div class="tech-header">

          <div>

            <div class="eyebrow">
              <span class="eyebrow-dot violet"></span>
              VORENTIS RESEARCH LAB
            </div>

            <h2 class="display-title">
              SEE WHAT
              <br>
              MAKES IT
              <br>
              <span>MOVE.</span>
            </h2>

          </div>


          <a
            routerLink="/tech-lab"
            class="outline-button"
          >
            ENTER LAB
            <span>↗</span>
          </a>

        </div>


        <div class="technical-grid">

          <div class="technical-card">

            <span class="technical-number">
              01
            </span>

            <span class="technical-value">
              5090
            </span>

            <strong>
              LIQUID GPU CORE
            </strong>

            <p>
              24GB GDDR7 · 175W BOOST
            </p>

            <div class="technical-line"></div>

          </div>


          <div class="technical-card">

            <span class="technical-number">
              02
            </span>

            <span class="technical-value">
              Si-C
            </span>

            <strong>
              SOLID STATE BATTERY
            </strong>

            <p>
              99.9Wh · 140W GaN
            </p>

            <div class="technical-line"></div>

          </div>


          <div class="technical-card">

            <span class="technical-number">
              03
            </span>

            <span class="technical-value">
              240Hz
            </span>

            <strong>
              TANDEM DISPLAY
            </strong>

            <p>
              2500 NITS · ΔE &lt; 0.8
            </p>

            <div class="technical-line"></div>

          </div>


          <div class="technical-card">

            <span class="technical-number">
              04
            </span>

            <span class="technical-value">
              CAMM2
            </span>

            <strong>
              DDR5 ARCHITECTURE
            </strong>

            <p>
              7500 MT/s · LOW LOSS
            </p>

            <div class="technical-line"></div>

          </div>

        </div>

      </section>



      <!-- =====================================================
           07 — FINAL CTA
           ===================================================== -->

      <section class="final-section">

        <div class="final-grid-lines"></div>

        <div class="final-content">

          <div class="eyebrow">
            <span class="eyebrow-dot"></span>
            VORENTIS / FINAL SEQUENCE
          </div>

          <h2 class="final-title">

            ENGINEERED
            <br>

            TO BE
            <br>

            <span>EXPERIENCED.</span>

          </h2>


          <div class="final-actions">

            <a
              routerLink="/products"
              class="magnetic-button large"
              data-cursor="SHOP"
            >
              EXPLORE COLLECTION
              <span>→</span>
            </a>

            <a
              routerLink="/configurator"
              class="text-button"
            >
              FIND MY DEVICE
              <span>↗</span>
            </a>

          </div>

        </div>


        <div class="final-coordinate">
          VOR / 2026 / 07
        </div>

      </section>

    </div>
  `,

  styles: [`

    /* =========================================================
       GLOBAL
       ========================================================= */

    :host {
      display: block;
    }

    .home-page {
      position: relative;
      overflow: hidden;
      background: #02050b;
      color: #f8fafc;
    }

    .manifesto-section,
    .hardware-section,
    .exploded-section,
    .products-section,
    .workflow-section,
    .tech-section,
    .final-section {
      position: relative;
      z-index: 2;
    }


    /* =========================================================
       EYEBROW
       ========================================================= */

    .eyebrow {
      display: flex;
      align-items: center;
      gap: 0.65rem;

      font-family: monospace;
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      color: #718096;
    }

    .eyebrow-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #f8fafc;
      box-shadow: 0 0 12px rgba(255,255,255,.5);
    }

    .eyebrow-dot.cyan {
      background: #00e5ff;
      box-shadow: 0 0 14px #00e5ff;
    }

    .eyebrow-dot.violet {
      background: #a78bfa;
      box-shadow: 0 0 14px #a78bfa;
    }

    .eyebrow-dot.amber {
      background: #fbbf24;
      box-shadow: 0 0 14px #fbbf24;
    }

    .eyebrow-dot.emerald {
      background: #34d399;
      box-shadow: 0 0 14px #34d399;
    }


    /* =========================================================
       MANIFESTO
       ========================================================= */

    .manifesto-section {
      padding: 4.5rem 6vw 3rem;
      background:
        radial-gradient(
          circle at 15% 40%,
          rgba(0, 242, 255, 0.055),
          transparent 35%
        );
    }

    .section-grid {
      display: grid;
      grid-template-columns: 1.2fr .8fr;
      gap: 8vw;
      max-width: 1500px;
      margin: auto;
    }

    .manifesto-title {
      margin: 1.5rem 0 0;
      font-size: clamp(3.5rem, 7vw, 8.5rem);
      line-height: .86;
      letter-spacing: -.065em;
      font-weight: 800;
    }

    .manifesto-line {
      display: block;
      overflow: hidden;
    }

    .accent-line {
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,.45);
    }

    .manifesto-content {
      align-self: end;
      padding-bottom: 1rem;
    }

    .manifesto-description {
      max-width: 530px;
      font-size: clamp(1rem, 1.3vw, 1.25rem);
      line-height: 1.7;
      color: #9aa6b8;
    }

    .manifesto-rule {
      height: 1px;
      width: 100%;
      margin: 2rem 0 1.25rem;
      background: rgba(255,255,255,.1);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: .75rem;
    }

    .stat-card {
      min-height: 120px;
      padding: 1rem;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.025);

      transition:
        transform .4s ease,
        border-color .4s ease,
        background .4s ease;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      border-color: rgba(0,229,255,.45);
      background: rgba(0,229,255,.035);
    }

    .stat-index {
      font: .65rem monospace;
      color: #526071;
    }

    .stat-number {
      font-size: 1.7rem;
      letter-spacing: -.04em;
    }

    .stat-label {
      font: .58rem monospace;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: #64748b;
    }

    .manifesto-axis {
      max-width: 1500px;
      margin: 3.5rem auto 0;

      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1rem;
      align-items: center;

      font: .58rem monospace;
      color: #465163;
    }

    .manifesto-axis span:nth-child(2) {
      height: 1px;
      background: rgba(255,255,255,.08);
    }


    /* =========================================================
       HARDWARE
       ========================================================= */

    .hardware-section {
      padding: 4.5rem 5vw 4rem;
    }

    .hardware-header {
      max-width: 1500px;
      margin: auto;

      display: grid;
      grid-template-columns: 1fr .45fr;
      gap: 5vw;
      align-items: end;
    }

    .display-title {
      margin: 1rem 0 0;

      font-size: clamp(3.5rem, 7vw, 8rem);
      line-height: .83;
      letter-spacing: -.065em;
      font-weight: 800;
    }

    .display-title span {
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,.38);
    }

    .hardware-intro {
      padding-bottom: .5rem;
    }

    .section-number {
      display: block;
      margin-bottom: 1.5rem;

      font: .65rem monospace;
      color: #64748b;
    }

    .hardware-intro p,
    .exploded-intro p,
    .workflow-copy p {
      max-width: 450px;
      margin: 0;

      font-size: 1rem;
      line-height: 1.7;
      color: #8290a5;
    }

    .viewer-shell {
      max-width: 1500px;
      margin: 2.5rem auto 0;

      position: relative;

      border: 1px solid rgba(255,255,255,.09);
      background:
        radial-gradient(
          circle at center,
          rgba(0,229,255,.045),
          transparent 55%
        ),
        #030812;

      min-height: 520px;
    }

    .viewer-shell::before,
    .viewer-shell::after {
      content: '';
      position: absolute;
      pointer-events: none;
      z-index: 5;
    }

    .viewer-shell::before {
      inset: 18px;
      border: 1px solid rgba(255,255,255,.035);
    }


    /* =========================================================
       EXPLODED
       ========================================================= */

    .exploded-section {
      padding: 4.5rem 5vw 4rem;
      background:
        linear-gradient(
          180deg,
          #02050b,
          #050812,
          #02050b
        );
    }

    .exploded-intro {
      max-width: 1500px;
      margin: auto;
      display: grid;
      grid-template-columns: 1fr .5fr;
      gap: 6vw;
      align-items: end;
    }

    .exploded-wrapper {
      max-width: 1500px;
      margin: 2rem auto 0;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }


    /* =========================================================
       PRODUCTS
       ========================================================= */

    .products-section {
      padding: 4.5rem 5vw 4rem;
      overflow: hidden;
    }

    .products-header {
      max-width: 1500px;
      margin: auto;

      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 3rem;
    }

    .product-counter {
      display: flex;
      align-items: center;
      gap: 1rem;

      font: .6rem monospace;
      color: #526071;
    }

    .product-counter strong {
      font-size: 2rem;
      color: #f8fafc;
    }

    .filter-and-nav-bar {
      max-width: 1500px;
      margin: 2rem auto 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .filter-bar {
      display: flex;
      gap: .5rem;
      flex-wrap: wrap;
    }

    .filter-button {
      min-height: 42px;
      padding: 0 1.2rem;

      border: 1px solid rgba(255,255,255,.1);
      background: rgba(255,255,255,.025);

      color: #718096;

      font: .65rem monospace;
      letter-spacing: .08em;

      cursor: pointer;

      transition:
        border-color .25s ease,
        color .25s ease,
        background .25s ease;
    }

    .filter-button:hover,
    .filter-button.active {
      border-color: #00e5ff;
      color: #00e5ff;
      background: rgba(0,229,255,.06);
    }

    .rail-nav-controls {
      display: flex;
      gap: 0.6rem;
      align-items: center;
    }

    .rail-nav-btn {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 4px;
      color: #cbd5e1;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .rail-nav-btn:hover {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.1);
      box-shadow: 0 0 15px rgba(0, 242, 255, 0.3);
      transform: scale(1.05);
    }

    .rail-viewport-wrapper {
      position: relative;
      max-width: 1500px;
      margin: auto;
    }

    .floating-rail-arrow {
      position: absolute;
      top: 45%;
      transform: translateY(-50%);
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: rgba(6, 11, 23, 0.88);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(0, 242, 255, 0.35);
      color: #00f2ff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 20;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 242, 255, 0.25);
      transition: all 0.25s ease;
    }

    .floating-rail-arrow:hover {
      background: rgba(0, 242, 255, 0.2);
      transform: translateY(-50%) scale(1.15);
      box-shadow: 0 0 25px rgba(0, 242, 255, 0.5);
    }

    .floating-rail-arrow.left-arrow {
      left: -20px;
    }

    .floating-rail-arrow.right-arrow {
      right: -20px;
    }

    @media (max-width: 768px) {
      .floating-rail-arrow {
        display: none;
      }
    }

    .products-rail {
      width: 100%;
      display: flex;
      gap: 2rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: 1rem 0 2.5rem;
      scrollbar-width: thin;
      scrollbar-color: #334155 transparent;
    }

    .product-rail-item {
      flex: 0 0 min(430px, 82vw);
      position: relative;
    }

    .product-index {
      margin-bottom: .7rem;

      font: .65rem monospace;
      color: #4b5563;
    }


    /* =========================================================
       WORKFLOW
       ========================================================= */

    .workflow-section {
      padding: 9rem 5vw;

      background:
        radial-gradient(
          circle at 80% 50%,
          rgba(139,92,246,.09),
          transparent 35%
        );
    }

    .workflow-container {
      max-width: 1500px;
      margin: auto;

      display: grid;
      grid-template-columns: .8fr 1.2fr;
      gap: 7vw;
      align-items: center;
    }

    .workflow-console {
      border: 1px solid rgba(255,255,255,.1);
      background: #050914;
    }

    .console-top {
      display: flex;
      justify-content: space-between;

      padding: 1rem 1.2rem;

      border-bottom: 1px solid rgba(255,255,255,.08);

      font: .6rem monospace;
      color: #64748b;
    }

    .workflow-options {
      display: grid;
    }

    .workflow-option {
      position: relative;

      min-height: 90px;
      padding: 1rem 1.2rem;

      display: grid;
      grid-template-columns: 45px 1fr auto;
      grid-template-rows: auto auto;
      column-gap: 1rem;

      text-align: left;

      border: 0;
      border-bottom: 1px solid rgba(255,255,255,.07);
      background: transparent;

      color: white;
      cursor: pointer;

      transition:
        background .3s ease,
        padding-left .3s ease;
    }

    .workflow-option:hover,
    .workflow-option.selected {
      background: rgba(0,229,255,.045);
      padding-left: 1.7rem;
    }

    .workflow-icon {
      grid-row: span 2;

      width: 38px;
      height: 38px;

      display: grid;
      place-items: center;

      border: 1px solid rgba(255,255,255,.1);
    }

    .workflow-name {
      font-weight: 700;
      font-size: .95rem;
    }

    .workflow-description {
      margin-top: .25rem;

      font: .65rem monospace;
      color: #64748b;
    }

    .workflow-arrow {
      grid-column: 3;
      grid-row: span 2;
      align-self: center;

      color: #475569;
    }

    .workflow-option.selected .workflow-arrow {
      color: #00e5ff;
    }

    .workflow-result {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;

      padding: 1.5rem;

      background: rgba(255,255,255,.025);
    }

    .result-label {
      display: block;
      margin-bottom: .4rem;

      font: .58rem monospace;
      color: #64748b;
    }

    .result-label + strong {
      font-size: 1.3rem;
    }


    /* =========================================================
       BUTTONS
       ========================================================= */

    .magnetic-button,
    .outline-button {
      min-height: 48px;
      padding: 0 1.4rem;

      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 1.2rem;

      border: 1px solid #00e5ff;
      background: #00e5ff;
      color: #021016;

      font: .68rem monospace;
      font-weight: 800;
      letter-spacing: .08em;

      text-decoration: none;

      transition:
        transform .3s ease,
        background .3s ease;
    }

    .magnetic-button:hover {
      transform: translateY(-3px);
    }

    .magnetic-button.large {
      min-height: 60px;
      padding: 0 2rem;
    }

    .outline-button {
      background: transparent;
      color: #f8fafc;
      border-color: rgba(255,255,255,.25);
    }

    .outline-button:hover {
      border-color: #00e5ff;
      color: #00e5ff;
    }

    .text-button {
      display: inline-flex;
      gap: .8rem;

      color: #8996aa;

      font: .68rem monospace;
      text-decoration: none;
    }

    .text-button:hover {
      color: #fff;
    }

    /* =========================================================
       WORKFLOW SECTION
       ========================================================= */

    .workflow-section {
      padding: 4.5rem 5vw 4rem;
      background: #040812;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .workflow-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 5vw;
      align-items: center;
    }

    .workflow-console {
      background: #080e1a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 2rem;
    }

    .console-top {
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font: 0.7rem monospace;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 0.8rem;
    }

    .workflow-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .workflow-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      transition: all 0.25s ease;
    }

    .workflow-option:hover, .workflow-option.selected {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.06);
      transform: translateY(-2px);
    }

    .workflow-thumb {
      width: 54px;
      height: 54px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
      background: #020610;
    }

    .workflow-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .workflow-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .workflow-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: 0.05em;
    }

    .workflow-description {
      font-size: 0.72rem;
      color: #94a3b8;
      line-height: 1.3;
    }

    .workflow-arrow {
      color: #64748b;
      font-size: 0.9rem;
      transition: transform 0.2s ease, color 0.2s ease;
    }

    .workflow-option:hover .workflow-arrow, .workflow-option.selected .workflow-arrow {
      color: #00f2ff;
      transform: translate(2px, -2px);
    }

    .workflow-result {
      margin-top: 1.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .result-label {
      display: block;
      font: 0.65rem monospace;
      color: #64748b;
      letter-spacing: 0.1em;
      margin-bottom: 0.25rem;
    }

    .workflow-result strong {
      font-size: 1.15rem;
      color: #00f2ff;
    }

    @media (max-width: 900px) {
      .workflow-container {
        grid-template-columns: 1fr;
      }
      .workflow-options {
        grid-template-columns: 1fr;
      }
    }

    /* =========================================================
       TECH LAB
       ========================================================= */

    .tech-section {
      position: relative;
      padding: 4.5rem 5vw 4rem;
      overflow: hidden;
    }

    .tech-grid-background {
      position: absolute;
      inset: 0;
      pointer-events: none;

      opacity: .3;

      background-image:
        linear-gradient(
          rgba(255,255,255,.035) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          rgba(255,255,255,.035) 1px,
          transparent 1px
        );

      background-size: 60px 60px;
    }

    .tech-header,
    .technical-grid {
      position: relative;
      max-width: 1500px;
      width: 100%;
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
    }

    .tech-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 3rem;
    }

    .technical-grid {
      margin-top: 2.5rem;
      width: 100%;
      box-sizing: border-box;

      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;

      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.08);
    }

    .technical-card {
      min-height: 240px;
      padding: 1.5rem;
      width: 100%;
      box-sizing: border-box;

      position: relative;

      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      background: #030711;

      transition:
        background .4s ease,
        transform .4s ease;
    }

    .technical-card:hover {
      background: #07101d;
      transform: translateY(-8px);
      z-index: 2;
    }

    .technical-number {
      position: absolute;
      top: 1.2rem;
      left: 1.2rem;

      font: .6rem monospace;
      color: #465164;
    }

    .technical-value {
      font-size: clamp(2.2rem, 3.5vw, 3.8rem);
      font-weight: 800;
      letter-spacing: -.07em;
    }

    .technical-card strong {
      margin-top: .8rem;
      font-size: .75rem;
      letter-spacing: .05em;
    }

    .technical-card p {
      margin: .4rem 0 0;

      font: .6rem monospace;
      color: #64748b;
    }

    .technical-line {
      height: 1px;
      width: 35%;

      margin-top: 1.5rem;

      background: #334155;

      transition:
        width .5s ease,
        background .5s ease;
    }

    .technical-card:hover .technical-line {
      width: 100%;
      background: #00e5ff;
    }


    /* =========================================================
       FINAL
       ========================================================= */

    .final-section {
      min-height: 480px;
      padding: 5rem 6vw 4.5rem;

      display: flex;
      align-items: center;

      overflow: hidden;

      background:
        radial-gradient(
          circle at 50% 45%,
          rgba(0,229,255,.08),
          transparent 35%
        );
    }

    .final-grid-lines {
      position: absolute;
      inset: 0;

      opacity: .2;

      background-image:
        linear-gradient(
          90deg,
          transparent 49.9%,
          rgba(255,255,255,.08) 50%,
          transparent 50.1%
        );
    }

    .final-content {
      position: relative;
      max-width: 1500px;
      width: 100%;
      margin: auto;
    }

    .final-title {
      margin: 1.5rem 0 3rem;

      font-size: clamp(4rem, 9vw, 11rem);
      line-height: .78;
      letter-spacing: -.08em;
      font-weight: 800;
    }

    .final-title span {
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,.4);
    }

    .final-actions {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .final-coordinate {
      position: absolute;
      right: 5vw;
      bottom: 3rem;

      font: .6rem monospace;
      color: #3f4b5c;
    }


    /* =========================================================
       RESPONSIVE
       ========================================================= */

    @media (max-width: 1100px) {

      .section-grid,
      .hardware-header,
      .exploded-intro,
      .workflow-container {
        grid-template-columns: 1fr;
      }

      .technical-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .hardware-intro {
        max-width: 600px;
      }

    }


    @media (max-width: 700px) {

      .manifesto-section,
      .hardware-section,
      .exploded-section,
      .products-section,
      .workflow-section,
      .tech-section {
        padding-left: 1.2rem;
        padding-right: 1.2rem;
        padding-top: 1.75rem;
        padding-bottom: 1.75rem;
      }

      .manifesto-section {
        padding-top: 2rem;
        padding-bottom: 1.25rem;
      }

      .manifesto-axis {
        margin: 1.25rem auto 0;
      }

      .manifesto-title,
      .display-title {
        font-size: clamp(2.4rem, 12vw, 4.2rem);
        margin: 0.5rem 0 0;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .stat-card {
        min-height: 90px;
        padding: 0.75rem;
      }

      .hardware-section {
        padding-top: 1.25rem;
        padding-bottom: 1.5rem;
      }

      .hardware-intro,
      .exploded-intro,
      .workflow-copy {
        margin-top: 0.5rem;
      }

      .section-number {
        margin-bottom: 0.5rem;
      }

      .viewer-shell {
        margin: 0.75rem auto 0;
        min-height: auto;
      }

      .viewer-corner {
        font-size: .48rem;
      }

      .exploded-section {
        padding-top: 1.25rem;
        padding-bottom: 1.5rem;
      }

      .exploded-wrapper {
        margin: 0.75rem auto 0;
      }

      .products-section {
        padding-top: 1.25rem;
        padding-bottom: 1.5rem;
      }

      .filter-and-nav-bar {
        margin: 1rem auto 0.75rem;
      }

      .workflow-section {
        padding-top: 1.25rem;
        padding-bottom: 1.5rem;
      }

      .tech-section {
        padding-top: 1.25rem;
        padding-bottom: 1.5rem;
      }

      .products-header,
      .tech-header {
        align-items: flex-start;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        gap: 0.5rem;
      }

      .technical-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.65rem;
        background: transparent;
        border: none;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin: 1rem auto 0;
      }

      .technical-card {
        min-height: 145px;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        padding: 1rem 0.85rem;
        background: #080f1e;
        border: 1px solid rgba(0, 242, 255, 0.2);
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      }

      .technical-card .technical-number {
        top: 0.65rem;
        left: 0.75rem;
        font-size: 0.55rem;
        color: #00f2ff;
        font-weight: 700;
      }

      .technical-card .technical-value {
        font-size: 1.55rem;
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1;
        color: #ffffff;
      }

      .technical-card strong {
        margin-top: 0.35rem;
        font-size: 0.63rem;
        letter-spacing: 0.03em;
        line-height: 1.2;
        color: #f1f5f9;
      }

      .technical-card p {
        margin: 0.2rem 0 0;
        font-size: 0.53rem;
        color: #94a3b8;
        line-height: 1.2;
      }

      .technical-card .technical-line {
        margin-top: 0.5rem;
        height: 2px;
        width: 100%;
        background: linear-gradient(90deg, #00f2ff, transparent);
      }

      .workflow-option {
        grid-template-columns: 38px 1fr auto;
      }

      .workflow-description {
        max-width: 180px;
      }

      .workflow-result {
        align-items: flex-start;
        flex-direction: column;
        margin-top: 1rem;
      }

      .final-section {
        min-height: auto;
        padding: 2.25rem 1.2rem 2.5rem;
      }

      .final-title {
        font-size: clamp(2.6rem, 12vw, 4.5rem);
        margin: 0.75rem 0 1.5rem;
      }

    }


    @media (prefers-reduced-motion: reduce) {

      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
        animation-duration: .01ms !important;
      }

    }

  `]
})

export class HomeComponent implements AfterViewInit, OnDestroy {

  /*
   * ============================================================
   * HERO IS COMPLETELY INDEPENDENT.
   *
   * Nothing below modifies HeroStageComponent.
   * ============================================================
   */

  @ViewChild('manifestoSec')
  manifestoSec!: ElementRef<HTMLElement>;

  @ViewChild('statTdp')
  statTdp!: ElementRef<HTMLElement>;

  @ViewChild('statHz')
  statHz!: ElementRef<HTMLElement>;

  @ViewChild('productsRail')
  productsRail!: ElementRef<HTMLElement>;

  @ViewChild('labSec')
  labSec!: ElementRef<HTMLElement>;

  @ViewChild('explodedSec')
  explodedSec!: ElementRef<HTMLElement>;

  @ViewChild('discoverySec')
  discoverySec!: ElementRef<HTMLElement>;

  @ViewChild('configuratorSec')
  configuratorSec!: ElementRef<HTMLElement>;

  @ViewChild('techLabSec')
  techLabSec!: ElementRef<HTMLElement>;


  private productService = inject(ProductService);

  readonly products = this.productService.products;

  readonly flagshipProduct =
    this.productService.flagshipProduct();


  activeCategory =
    signal<string>('all');


  selectedWorkflow =
    signal<string>('gaming');


  readonly workflows = [

    {
      id: 'gaming',
      icon: '◈',
      name: 'GAMING',
      description: 'High FPS / GPU intensive workloads',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
    },

    {
      id: 'creative',
      icon: '✦',
      name: 'CREATIVE',
      description: '3D / video / photography',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
    },

    {
      id: 'ai',
      icon: '◎',
      name: 'AI / ML',
      description: 'Local models / inference / research',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
    },

    {
      id: 'development',
      icon: '</>',
      name: 'DEVELOPMENT',
      description: 'Code / containers / compilers',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
    }

  ];


  displayedProducts() {

    const category =
      this.activeCategory();

    if (category === 'all') {
      return this.products();
    }

    return this.products()
      .filter(product =>
        product.category === category
      );
  }


  selectedWorkflowData() {

    return this.workflows.find(
      workflow =>
        workflow.id === this.selectedWorkflow()
    ) || this.workflows[0];

  }


  changeCategory(category: string) {

    this.activeCategory.set(category);

    /*
     * Animate the product rail after Angular updates
     * the @for block.
     */
    requestAnimationFrame(() => {

      if (!this.productsRail) return;

      const items =
        this.productsRail.nativeElement
          .querySelectorAll('.product-rail-item');

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 35
        },
        {
          opacity: 1,
          y: 0,
          duration: .55,
          stagger: .07,
          ease: 'power3.out'
        }
      );

    });

  }

  scrollRail(direction: 'prev' | 'next') {
    if (!this.productsRail) return;
    const rail = this.productsRail.nativeElement;
    const scrollAmount = Math.min(rail.clientWidth * 0.75, 450);
    rail.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }

  selectWorkflow(id: string) {

    this.selectedWorkflow.set(id);

  }


  ngAfterViewInit() {

    /*
     * IMPORTANT:
     *
     * HeroStageComponent is intentionally NOT included
     * in any GSAP selector or ScrollTrigger.
     *
     * This prevents the redesigned homepage animations
     * from interfering with the existing hero.
     */

    requestAnimationFrame(() => {

      this.initManifestoAnimations();

      this.initSectionAnimations();

      this.initProductAnimations();

      this.initMagneticButtons();

      ScrollTrigger.refresh();

    });

  }


  private initManifestoAnimations() {
    if (!this.manifestoSec) return;

    // 1. Left Column Title Entrance
    const lines =
      this.manifestoSec.nativeElement
        .querySelectorAll('.manifesto-line');

    gsap.fromTo(
      lines,
      {
        yPercent: 120,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: .12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: this.manifestoSec.nativeElement,
          start: 'top 75%',
          once: true
        }
      }
    );

    // 2. Right Column Content & Stats Cards Entrance
    const rightContent = this.manifestoSec.nativeElement.querySelector('.manifesto-content');
    if (rightContent) {
      gsap.fromTo(
        rightContent,
        {
          opacity: 0,
          x: 40
        },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: this.manifestoSec.nativeElement,
            start: 'top 75%',
            once: true
          }
        }
      );
    }


    const tdp = { value: 0 };

    gsap.to(
      tdp,
      {
        value: 275,
        duration: 1.8,
        ease: 'power2.out',

        scrollTrigger: {
          trigger: this.manifestoSec.nativeElement,
          start: 'top 70%',
          once: true
        },

        onUpdate: () => {

          if (this.statTdp) {

            this.statTdp.nativeElement.textContent =
              Math.round(tdp.value).toString();

          }

        }

      }
    );


    const hz = { value: 0 };

    gsap.to(
      hz,
      {
        value: 8000,
        duration: 2.2,
        ease: 'power2.out',

        scrollTrigger: {
          trigger: this.manifestoSec.nativeElement,
          start: 'top 70%',
          once: true
        },

        onUpdate: () => {

          if (this.statHz) {

            this.statHz.nativeElement.textContent =
              Math.round(hz.value).toString();

          }

        }

      }
    );

  }


  private initSectionAnimations() {

    const sections = [
      this.labSec,
      this.explodedSec,
      this.discoverySec,
      this.configuratorSec,
      this.techLabSec
    ];


    sections.forEach(section => {

      if (!section) return;


      const children =
        section.nativeElement
          .querySelectorAll(
            '.eyebrow, .display-title, .hardware-intro, .exploded-intro p, .technical-card'
          );


      gsap.fromTo(
        children,
        {
          opacity: 0,
          y: 45
        },
        {
          opacity: 1,
          y: 0,
          duration: .8,
          stagger: .08,
          ease: 'power3.out',

          scrollTrigger: {
            trigger: section.nativeElement,
            start: 'top 80%',
            once: true
          }

        }
      );

    });

  }


  private initProductAnimations() {

    if (!this.productsRail) return;

    const items =
      this.productsRail.nativeElement
        .querySelectorAll('.product-rail-item');


    gsap.fromTo(
      items,
      {
        opacity: 0,
        x: 70
      },
      {
        opacity: 1,
        x: 0,
        duration: .8,
        stagger: .1,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: this.discoverySec.nativeElement,
          start: 'top 70%',
          once: true
        }

      }
    );

  }


  private initMagneticButtons() {

    const buttons =
      document.querySelectorAll(
        '.home-page .magnetic-button'
      );


    buttons.forEach(button => {

      const element =
        button as HTMLElement;


      element.addEventListener(
        'mousemove',
        (event: MouseEvent) => {

          if (window.innerWidth < 800) return;

          const rect =
            element.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left -
            rect.width / 2;

          const y =
            event.clientY -
            rect.top -
            rect.height / 2;


          gsap.to(
            element,
            {
              x: x * .15,
              y: y * .15,
              duration: .35,
              ease: 'power3.out'
            }
          );

        }
      );


      element.addEventListener(
        'mouseleave',
        () => {

          gsap.to(
            element,
            {
              x: 0,
              y: 0,
              duration: .6,
              ease: 'elastic.out(1, .4)'
            }
          );

        }
      );

    });

  }


  ngOnDestroy() {

    /*
     * Kill only this component's ScrollTriggers.
     *
     * The hero has its own component lifecycle.
     */

    ScrollTrigger
      .getAll()
      .forEach(trigger => trigger.kill());

  }

}