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
          <span class="logo-symbol">⬢</span>
          <span class="logo-text font-display">VORENTIS</span>
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

          <!-- Audio FX Toggle -->
          <button 
            class="action-btn audio-btn" 
            (click)="soundService.toggleSound()" 
            [title]="soundService.isMuted() ? 'Enable Sound FX' : 'Mute Sound FX'">
            @if (soundService.isMuted()) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            }
          </button>

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
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      padding: 1.25rem 2rem;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav-header.is-scrolled {
      padding: 0.75rem 2rem;
      background: rgba(8, 14, 26, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .nav-header.is-hidden {
      transform: translateY(-100%);
    }

    .nav-container {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #f8fafc;
    }

    .logo-symbol {
      color: #00f2ff;
      font-size: 1.3rem;
      line-height: 1;
      filter: drop-shadow(0 0 8px #00f2ff);
    }

    .logo-text {
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #ffffff;
    }

    .logo-sub {
      font-size: 0.65rem;
      color: #00f2ff;
      letter-spacing: 0.2em;
      margin-top: 2px;
      padding: 0.1rem 0.3rem;
      background: rgba(0, 242, 255, 0.1);
      border: 1px solid rgba(0, 242, 255, 0.2);
      border-radius: 2px;
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
      gap: 1rem;
      padding: 1.5rem;
      background: #080e1a;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 0.75rem;
    }

    .mobile-nav-panel a {
      color: #cbd5e1;
      text-decoration: none;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
    }

    @media (max-width: 1024px) {
      .nav-links {
        display: none;
      }
      .mobile-toggle {
        display: block;
      }
      .search-btn .cmd-k {
        display: none;
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
