import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { SearchService } from '../../core/services/search.service';
import { SoundService } from '../../core/services/sound.service';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header 
      class="nav-header" 
      [class.is-scrolled]="isScrolled()"
      [class.is-hidden]="isHidden()">
      <div class="nav-container">
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-logo" data-cursor="VIEW">
          <img src="images/vorentis-logo.png" alt="Vorentis" class="brand-logo-img" />
          <span class="logo-sub font-mono">LABS</span>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links font-heading">
          <a routerLink="/products" routerLinkActive="is-active" [routerLinkActiveOptions]="{exact: true}">STORE</a>
          <a routerLink="/categories/laptops" routerLinkActive="is-active">COMPUTERS</a>
          <a routerLink="/categories/components" routerLinkActive="is-active">SILICON</a>
          <a routerLink="/tech-lab" routerLinkActive="is-active">TECH LAB</a>
          <a routerLink="/configurator" routerLinkActive="is-active" class="config-link">
            <span class="pulse-spark"></span>
            FIND MY DEVICE
          </a>
        </nav>

        <!-- Right Utilities -->
        <div class="nav-actions">
          <!-- Search trigger -->
          <button 
            class="action-btn search-btn" 
            (click)="searchService.openSearch()"
            data-cursor="EXPLORE"
            title="Open Command Search (Ctrl+K / Cmd+K)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span class="cmd-k font-mono">⌘K</span>
          </button>

          <!-- Compare Counter Badge -->
          <a 
            routerLink="/compare" 
            class="action-btn compare-btn" 
            [class.has-items]="comparisonService.count() > 0"
            data-cursor="VIEW"
            title="Hardware Comparison Matrix">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            @if (comparisonService.count() > 0) {
              <span class="action-badge font-mono">{{ comparisonService.count() }}</span>
            }
          </a>

          <!-- Cart Toggle -->
          <button 
            class="action-btn cart-btn" 
            (click)="cartService.toggleCart()" 
            data-cursor="ADD"
            title="View Cart Drawer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            @if (cartService.itemCount() > 0) {
              <span class="cart-badge font-mono">{{ cartService.itemCount() }}</span>
            }
          </button>

          <!-- Mobile Hamburger -->
          <button class="mobile-toggle" (click)="isMobileMenuOpen.set(!isMobileMenuOpen())">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen()) {
        <div class="mobile-nav-panel">
          <a routerLink="/products" (click)="isMobileMenuOpen.set(false)">STORE CATALOG</a>
          <a routerLink="/categories/laptops" (click)="isMobileMenuOpen.set(false)">COMPUTERS</a>
          <a routerLink="/categories/components" (click)="isMobileMenuOpen.set(false)">COMPONENTS &amp; SILICON</a>
          <a routerLink="/tech-lab" (click)="isMobileMenuOpen.set(false)">3D TECH LAB</a>
          <a routerLink="/configurator" (click)="isMobileMenuOpen.set(false)">FIND MY DEVICE</a>
          <a routerLink="/compare" (click)="isMobileMenuOpen.set(false)">HARDWARE MATRIX ({{ comparisonService.count() }})</a>
        </div>
      }
    </header>
  `,
  styles: [`
    .nav-header {
      position: fixed;
      top: 1rem;
      left: 0;
      width: 100%;
      z-index: 1000;
      padding: 0 1.5rem;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .nav-container {
      max-width: 1320px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 1.25rem;
      background: rgba(6, 11, 23, 0.78);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 242, 255, 0.08);
      pointer-events: auto;
      transition: all 0.3s ease;
    }

    .nav-header.is-scrolled .nav-container {
      background: rgba(4, 8, 18, 0.92);
      border-color: rgba(0, 242, 255, 0.25);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 242, 255, 0.15);
    }

    .nav-header.is-hidden {
      transform: translateY(-120%);
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
    }

    .brand-logo-img {
      height: 28px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.3));
      transition: transform 0.2s ease;
    }

    .brand-logo:hover .brand-logo-img {
      transform: scale(1.04);
    }

    .logo-sub {
      font-size: 0.62rem;
      color: #00f2ff;
      letter-spacing: 0.2em;
      padding: 0.1rem 0.35rem;
      background: rgba(0, 242, 255, 0.1);
      border: 1px solid rgba(0, 242, 255, 0.25);
      border-radius: 3px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-links a:hover, .nav-links a.is-active {
      color: #00f2ff;
    }

    .nav-links a.is-active::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #00f2ff;
      box-shadow: 0 0 8px #00f2ff;
    }

    .config-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.75rem;
      background: rgba(0, 242, 255, 0.08);
      border: 1px solid rgba(0, 242, 255, 0.25);
      border-radius: 999px;
      color: #00f2ff !important;
    }

    .pulse-spark {
      width: 6px;
      height: 6px;
      background: #00f2ff;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.8); }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      height: 38px;
      padding: 0 0.85rem;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      position: relative;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .search-btn {
      gap: 0.6rem;
    }

    .cmd-k {
      font-size: 0.65rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.1rem 0.3rem;
      border-radius: 3px;
      color: #94a3b8;
    }

    .action-badge, .cart-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #00f2ff;
      color: #030712;
      font-size: 0.65rem;
      font-weight: 800;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px #00f2ff;
    }

    .mobile-toggle {
      display: none;
      background: transparent;
      border: none;
      color: #f8fafc;
      cursor: pointer;
    }

    .mobile-nav-panel {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.25rem;
      background: rgba(4, 8, 18, 0.96);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border-radius: 16px;
      border: 1px solid rgba(0, 242, 255, 0.25);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 242, 255, 0.1);
      margin-top: 0.5rem;
      pointer-events: auto;
      animation: mobileMenuFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes mobileMenuFade {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .mobile-nav-panel a {
      color: #cbd5e1;
      text-decoration: none;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      padding: 0.6rem 0.85rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .mobile-nav-panel a:hover, .mobile-nav-panel a.is-active {
      color: #00f2ff;
      border-color: rgba(0, 242, 255, 0.3);
      background: rgba(0, 242, 255, 0.08);
    }

    @media (max-width: 1024px) {
      .nav-links {
        display: none;
      }
      .mobile-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .search-btn .cmd-k {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .nav-header {
        top: 0.5rem;
        padding: 0 0.75rem;
      }

      .nav-container {
        padding: 0.5rem 0.85rem;
      }

      .logo-text {
        font-size: 1.1rem;
        letter-spacing: 0.1em;
      }

      .logo-sub {
        display: none;
      }

      .action-btn {
        height: 34px;
        padding: 0 0.6rem;
      }

      .nav-actions {
        gap: 0.35rem;
      }
    }
  `]
})
export class NavHeaderComponent {
  cartService = inject(CartService);
  comparisonService = inject(ComparisonService);
  searchService = inject(SearchService);
  soundService = inject(SoundService);

  isScrolled = signal<boolean>(false);
  isHidden = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);

  private lastScrollY = 0;

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentY = window.scrollY;
    this.isScrolled.set(currentY > 30);

    if (currentY > 150 && currentY > this.lastScrollY && !this.isMobileMenuOpen()) {
      this.isHidden.set(true);
    } else {
      this.isHidden.set(false);
    }

    this.lastScrollY = currentY;
  }
}
