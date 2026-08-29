import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
export class AppComponent implements OnInit {
  cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit() {
    this.listenToRouteChanges();
  }

  private listenToRouteChanges() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    });
  }
}

