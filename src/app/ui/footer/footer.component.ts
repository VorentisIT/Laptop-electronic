import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-grid container-custom">
        <!-- Brand & Vision -->
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <span class="logo-symbol">⬢</span>
            <span class="logo-text font-display">VORENTIS</span>
          </div>
          <p class="brand-manifesto">
            Forging high-performance computing hardware, liquid-silicon architectures, and neural workstations without thermal or aesthetic compromise.
          </p>
          
          <div class="live-status-pill tech-box">
            <span class="status-dot"></span>
            <span class="font-mono text-xs text-slate-300">SYSTEM STATUS: NOMINAL (240Hz)</span>
          </div>

          <div class="telemetry-time font-mono text-xs text-slate-400 mt-3">
            UTC TIME: {{ currentTime() }}
          </div>
        </div>

        <!-- Architecture Links -->
        <div class="footer-col">
          <h4 class="col-title font-mono">ECOSYSTEM</h4>
          <ul class="footer-links font-heading">
            <li><a routerLink="/products">All Flagship Hardware</a></li>
            <li><a routerLink="/categories/laptops">Mobile Workstations</a></li>
            <li><a routerLink="/categories/workstations">Monolith Neural Desktops</a></li>
            <li><a routerLink="/categories/components">Liquid GPU Silicon</a></li>
            <li><a routerLink="/categories/displays">Reference OLED Panels</a></li>
            <li><a routerLink="/configurator">Interactive Device Configurator</a></li>
          </ul>
        </div>

        <!-- Tech Lab & Research -->
        <div class="footer-col">
          <h4 class="col-title font-mono">LABORATORY</h4>
          <ul class="footer-links font-heading">
            <li><a routerLink="/tech-lab">Vapor-Chamber Acoustics</a></li>
            <li><a routerLink="/tech-lab">Tandem Mini-LED Calibrations</a></li>
            <li><a routerLink="/tech-lab">Silicon-Carbon Solid Cells</a></li>
            <li><a routerLink="/compare">Hardware Benchmark Matrix</a></li>
            <li><a href="#thermal" (click)="$event.preventDefault()">Liquid Metal TIM Whitepaper</a></li>
          </ul>
        </div>

        <!-- Newsletter & Concierge -->
        <div class="footer-col newsletter-col">
          <h4 class="col-title font-mono">NEURAL DISPATCH</h4>
          <p class="text-xs text-slate-400 mb-4">
            Receive exclusive technical drops, silicon benchmarks, and priority allocation tokens.
          </p>
          <div class="dispatch-form">
            <input type="email" placeholder="ENTER YOUR EMAIL..." class="dispatch-input font-mono" />
            <button class="dispatch-btn font-mono" (click)="subscribe()">TRANSMIT</button>
          </div>
          @if (subscribed()) {
            <div class="dispatch-success font-mono text-xs text-cyan-400 mt-2">
              ✓ SECURE TOKEN GENERATED. WELCOME TO VORENTIS LABS.
            </div>
          }
          
          <div class="currency-selector mt-6">
            <span class="font-mono text-xs text-slate-400">REGION / CURRENCY:</span>
            <span class="font-mono text-xs text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded bg-cyan-500/10">USD ($) · GLOBAL FEDEX</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="container-custom bottom-content font-mono text-xs text-slate-400">
          <div class="copyright">
            © 2026 VORENTIS CORP. ALL RIGHTS RESERVED. FORGED WITH AEROSPACE PRECISION.
          </div>
          <div class="legal-links">
            <a href="#privacy" (click)="$event.preventDefault()">PRIVACY PROTOCOL</a>
            <span>·</span>
            <a href="#terms" (click)="$event.preventDefault()">HARDWARE WARRANTY</a>
            <span>·</span>
            <a href="#security" (click)="$event.preventDefault()">SECURITY AUDIT</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: #040711;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      overflow: hidden;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
      gap: 3rem;
      padding-top: 5rem;
      padding-bottom: 4rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .logo-symbol {
      color: #00f2ff;
      font-size: 1.4rem;
      filter: drop-shadow(0 0 10px #00f2ff);
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #ffffff;
    }

    .brand-manifesto {
      font-size: 0.85rem;
      color: #94a3b8;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      max-width: 320px;
    }

    .live-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 2s infinite;
    }

    .col-title {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #00f2ff;
      margin-bottom: 1.5rem;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .footer-links a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .footer-links a:hover {
      color: #00f2ff;
      transform: translateX(4px);
      display: inline-block;
    }

    .dispatch-form {
      display: flex;
      gap: 0.5rem;
    }

    .dispatch-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 4px;
      padding: 0.65rem 0.85rem;
      color: #ffffff;
      font-size: 0.75rem;
      outline: none;
    }

    .dispatch-input:focus {
      border-color: #00f2ff;
    }

    .dispatch-btn {
      background: #00f2ff;
      color: #030712;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0 1.25rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dispatch-btn:hover {
      background: #ffffff;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding: 1.5rem 0;
      background: #02050c;
    }

    .bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .legal-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .legal-links a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .legal-links a:hover {
      color: #00f2ff;
    }

    @media (max-width: 1024px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 640px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
      .bottom-content {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class FooterComponent implements OnInit, OnDestroy {
  currentTime = signal<string>('');
  subscribed = signal<boolean>(false);
  private timer: number | null = null;

  ngOnInit() {
    this.updateClock();
    this.timer = window.setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateClock() {
    const now = new Date();
    this.currentTime.set(now.toUTCString().replace('GMT', 'UTC'));
  }

  subscribe() {
    this.subscribed.set(true);
  }
}
