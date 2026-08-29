import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomCursorComponent } from './ui/custom-cursor/custom-cursor.component';
import { NavHeaderComponent } from './ui/nav-header/nav-header.component';
import { FooterComponent } from './ui/footer/footer.component';
import { CartDrawerComponent } from './ui/cart-drawer/cart-drawer.component';
import { SearchModalComponent } from './ui/search-modal/search-modal.component';
import { CartService } from './core/services/cart.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CustomCursorComponent,
    NavHeaderComponent,
    FooterComponent,
    CartDrawerComponent,
    SearchModalComponent
  ],
  templateUrl: './app.component.html',
  styles: [`
    .main-content {
      min-height: 100vh;
      position: relative;
    }

    .flying-product-item {
      position: fixed;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #00f2ff;
      box-shadow: 0 0 25px #00f2ff;
      border: 2px solid #ffffff;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: flyToCart 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .flying-product-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @keyframes flyToCart {
      0% {
        transform: scale(1.2);
        opacity: 1;
      }
      80% {
        opacity: 0.9;
      }
      100% {
        left: calc(100vw - 60px) !important;
        top: 25px !important;
        transform: scale(0.2);
        opacity: 0;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  cartService = inject(CartService);
  private lenis: Lenis | null = null;
  private tickerCallback: ((time: number) => void) | null = null;

  ngOnInit() {
    this.initSmoothScroll();
  }

  ngOnDestroy() {
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
    }
    this.lenis?.destroy();
  }

  private initSmoothScroll() {
    if (typeof window !== 'undefined') {
      try {
        this.lenis = new Lenis({
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true
        });

        this.lenis.on('scroll', () => {
          ScrollTrigger.update();
        });

        this.tickerCallback = (time: number) => {
          this.lenis?.raf(time * 1000);
        };
        gsap.ticker.add(this.tickerCallback);
        gsap.ticker.lagSmoothing(0);
      } catch {}
    }
  }
}
