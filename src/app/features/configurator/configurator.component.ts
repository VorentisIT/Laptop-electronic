import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfiguratorService } from '../../core/services/configurator.service';
import { CartService } from '../../core/services/cart.service';
import { ProductSegment } from '../../core/models/product.model';
import { ConfigPriority } from '../../core/models/configurator.model';

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="configurator-page container-custom">
      <!-- Wizard Header -->
      <div class="wizard-header text-center">
        <span class="tech-badge amber">NEURAL HARDWARE CONSULTATION</span>
        <h1 class="wizard-title font-display mt-2">FIND MY DEVICE</h1>
        <p class="wizard-sub font-heading">
          Answer a few quick questions regarding your primary workloads and priorities to let our recommendation engine allocate the optimal hardware rig.
        </p>

        <!-- Step Indicator -->
        <div class="step-tracker font-mono text-xs mt-6">
          <div class="step-pill" [class.is-active]="configService.state().currentStep >= 1">01. WORKFLOW</div>
          <div class="step-line"></div>
          <div class="step-pill" [class.is-active]="configService.state().currentStep >= 2">02. PRIORITIES</div>
          <div class="step-line"></div>
          <div class="step-pill" [class.is-active]="configService.state().currentStep >= 3">03. BUDGET</div>
          <div class="step-line"></div>
          <div class="step-pill" [class.is-active]="configService.isCompleted()">04. MATCHES</div>
        </div>
      </div>

      <!-- Step 1: Workload Selection -->
      @if (configService.state().currentStep === 1 && !configService.isCompleted()) {
        <div class="wizard-step-body animate-fadeIn">
          <h2 class="step-question font-heading">What are you building or creating for?</h2>
          <div class="options-grid">
            <button class="choice-card tech-box" (click)="selectUseCase('creative')">
              <span class="choice-icon">🎨</span>
              <h3 class="choice-title font-heading">CREATIVE &amp; 3D VFX</h3>
              <p class="choice-desc">Video editing, Blender rendering, Unreal Engine, Color grading.</p>
            </button>
            <button class="choice-card tech-box" (click)="selectUseCase('developer')">
              <span class="choice-icon">⚡</span>
              <h3 class="choice-title font-heading">AI &amp; DEVELOPMENT</h3>
              <p class="choice-desc">Local LLM inference, compilation, Docker, Data engineering.</p>
            </button>
            <button class="choice-card tech-box" (click)="selectUseCase('gaming')">
              <span class="choice-icon">🕹️</span>
              <h3 class="choice-title font-heading">GAMING &amp; ESPORTS</h3>
              <p class="choice-desc">High refresh 240Hz 4K gaming, Ray tracing, Low latency.</p>
            </button>
            <button class="choice-card tech-box" (click)="selectUseCase('business')">
              <span class="choice-icon">💼</span>
              <h3 class="choice-title font-heading">STUDIO &amp; EXECUTIVE</h3>
              <p class="choice-desc">Ultra-long battery, lightweight chassis, quiet acoustics.</p>
            </button>
          </div>
        </div>
      }

      <!-- Step 2: Key Priorities Multi-select -->
      @if (configService.state().currentStep === 2 && !configService.isCompleted()) {
        <div class="wizard-step-body animate-fadeIn">
          <h2 class="step-question font-heading">What specifications matter most to you?</h2>
          <p class="text-xs text-slate-400 font-mono mb-4 text-center">SELECT ALL APPLICABLE CRITERIA</p>

          <div class="options-grid">
            <button 
              class="choice-card tech-box" 
              [class.is-selected]="isPrioritySelected('performance')"
              (click)="togglePriority('performance')">
              <span class="choice-icon">🚀</span>
              <h3 class="choice-title font-heading">EXTREME MULTI-CORE SILICON</h3>
              <p class="choice-desc">Maximum 24+ core throughput and sustained desktop clock speeds.</p>
            </button>

            <button 
              class="choice-card tech-box" 
              [class.is-selected]="isPrioritySelected('gpu')"
              (click)="togglePriority('gpu')">
              <span class="choice-icon">🧠</span>
              <h3 class="choice-title font-heading">NEXT-GEN HIGH VRAM GPU</h3>
              <p class="choice-desc">RTX 50-Series with 16GB-32GB GDDR7 video memory.</p>
            </button>

            <button 
              class="choice-card tech-box" 
              [class.is-selected]="isPrioritySelected('battery')"
              (click)="togglePriority('battery')">
              <span class="choice-icon">🔋</span>
              <h3 class="choice-title font-heading">ALL-DAY SOLID-STATE BATTERY</h3>
              <p class="choice-desc">12+ hours real world productivity on a single charge.</p>
            </button>

            <button 
              class="choice-card tech-box" 
              [class.is-selected]="isPrioritySelected('portability')"
              (click)="togglePriority('portability')">
              <span class="choice-icon">🪶</span>
              <h3 class="choice-title font-heading">FEATHERWEIGHT PORTABILITY</h3>
              <p class="choice-desc">Slim profiles under 1.5 kg crafted from carbon fiber and titanium.</p>
            </button>

            <button 
              class="choice-card tech-box" 
              [class.is-selected]="isPrioritySelected('display')"
              (click)="togglePriority('display')">
              <span class="choice-icon">👁️</span>
              <h3 class="choice-title font-heading">TANDEM OLED DISPLAY</h3>
              <p class="choice-desc">2,500 nits peak HDR with 100% DCI-P3 calibrated color fidelity.</p>
            </button>

            <button 
              class="choice-card tech-box" 
              [class.is-selected]="isPrioritySelected('price')"
              (click)="togglePriority('price')">
              <span class="choice-icon">💎</span>
              <h3 class="choice-title font-heading">PRICE-TO-PERFORMANCE VALUE</h3>
              <p class="choice-desc">Maximum compute power per dollar invested.</p>
            </button>
          </div>

          <div class="wizard-nav-btns mt-8">
            <button class="btn-vorentis-secondary" (click)="configService.prevStep()">BACK</button>
            <button class="btn-vorentis-primary" (click)="configService.nextStep()">CONTINUE TO BUDGET ➔</button>
          </div>
        </div>
      }

      <!-- Step 3: Budget Tier Selection -->
      @if (configService.state().currentStep === 3 && !configService.isCompleted()) {
        <div class="wizard-step-body animate-fadeIn">
          <h2 class="step-question font-heading">What is your targeted budget allocation?</h2>
          <div class="options-grid">
            <button class="choice-card tech-box" (click)="selectBudget('entry')">
              <span class="choice-icon">🌱</span>
              <h3 class="choice-title font-heading">ENTRY LEVEL</h3>
              <p class="choice-desc">Up to \$1,800 · High value essentials</p>
            </button>

            <button class="choice-card tech-box" (click)="selectBudget('mid')">
              <span class="choice-icon">⚡</span>
              <h3 class="choice-title font-heading">PERFORMANCE TIER</h3>
              <p class="choice-desc">\$1,800 - \$3,000 · High-spec portable rigs</p>
            </button>

            <button class="choice-card tech-box" (click)="selectBudget('high')">
              <span class="choice-icon">🔥</span>
              <h3 class="choice-title font-heading">FLAGSHIP WORKSTATION</h3>
              <p class="choice-desc">\$3,000 - \$5,000 · Apex tier silicon</p>
            </button>

            <button class="choice-card tech-box" (click)="selectBudget('ultra')">
              <span class="choice-icon">👑</span>
              <h3 class="choice-title font-heading">UNCONSTRAINED PRO STUDIO</h3>
              <p class="choice-desc">\$5,000+ · 64 Cores, Dual RTX 5090</p>
            </button>
          </div>

          <div class="wizard-nav-btns mt-8">
            <button class="btn-vorentis-secondary" (click)="configService.prevStep()">BACK</button>
          </div>
        </div>
      }

      <!-- Step 4: Final Match Recommendations -->
      @if (configService.isCompleted()) {
        <div class="wizard-results-body animate-fadeIn">
          <div class="results-header">
            <span class="tech-badge emerald">ALLOCATION COMPLETE</span>
            <h2 class="font-display text-3xl md:text-4xl font-extrabold text-white mt-2">
              YOUR MATCHED COMPUTING HARDWARE
            </h2>
            <p class="text-slate-400 font-heading mt-1">
              Based on your specific workflow telemetry, here are your top hardware configurations.
            </p>
            <button class="btn-vorentis-secondary mt-4 text-xs" (click)="configService.reset()">
              RE-RUN CONSULTATION ↺
            </button>
          </div>

          <div class="recommendations-list mt-8">
            @for (rec of configService.recommendations(); track rec.product.id; let idx = $index) {
              <div class="rec-card tech-box" [class.is-top-match]="idx === 0">
                <div class="rec-score-col">
                  <div class="score-circle">
                    <span class="score-num font-display">{{ rec.matchScore }}%</span>
                    <span class="score-lbl font-mono">MATCH</span>
                  </div>
                  @if (idx === 0) {
                    <span class="top-pick-tag font-mono">#1 OPTIMAL MATCH</span>
                  }
                </div>

                <div class="rec-visual">
                  <img [src]="rec.product.heroImage" [alt]="rec.product.name" />
                </div>

                <div class="rec-info">
                  <span class="tech-badge">{{ rec.product.category }}</span>
                  <h3 class="font-heading text-xl font-bold text-white mt-1">{{ rec.product.name }}</h3>
                  <p class="text-xs text-slate-300 font-mono mt-1">{{ rec.keySpecSummary }}</p>

                  <div class="match-reasons-list mt-3">
                    @for (r of rec.matchReasons; track r) {
                      <span class="reason-tag font-mono">✓ {{ r }}</span>
                    }
                  </div>
                </div>

                <div class="rec-action-col">
                  <div class="rec-price font-heading">\${{ rec.product.price | number }}</div>
                  <button class="btn-vorentis-primary text-xs w-full mt-2" (click)="addToCart(rec.product, $event)">
                    ADD TO MANIFEST
                  </button>
                  <a [routerLink]="['/products', rec.product.slug]" class="view-spec-link font-mono text-xs mt-2 text-center block">
                    INSPECT SPECS ➔
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .configurator-page {
      padding-top: 8rem;
      padding-bottom: 8rem;
    }

    .wizard-header {
      margin-bottom: 4rem;
    }

    .wizard-title {
      font-size: clamp(2.4rem, 4.5vw, 4.5rem);
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.03em;
    }

    .wizard-sub {
      font-size: 1.05rem;
      color: #94a3b8;
      max-width: 620px;
      margin: 0.5rem auto 0;
    }

    .step-tracker {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .step-pill {
      padding: 0.35rem 0.75rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #64748b;
    }

    .step-pill.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .step-line {
      width: 20px;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .step-question {
      font-size: clamp(1.6rem, 2.5vw, 2.2rem);
      font-weight: 700;
      text-align: center;
      color: #f8fafc;
      margin-bottom: 2.5rem;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .choice-card {
      padding: 2.5rem 1.5rem;
      background: #080e1a;
      border-radius: 6px;
      text-align: center;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.25s ease;
    }

    .choice-card:hover, .choice-card.is-selected {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.06);
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0, 242, 255, 0.15);
    }

    .choice-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .choice-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.5rem;
    }

    .choice-desc {
      font-size: 0.85rem;
      color: #94a3b8;
      line-height: 1.5;
    }

    .wizard-nav-btns {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .recommendations-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    .rec-card {
      display: grid;
      grid-template-columns: 140px 180px 1fr 200px;
      gap: 1.5rem;
      align-items: center;
      padding: 1.5rem;
      background: #080e1a;
      border-radius: 8px;
    }

    .rec-card.is-top-match {
      border-color: #00f2ff;
      box-shadow: 0 0 35px rgba(0, 242, 255, 0.2);
    }

    .score-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: rgba(0, 242, 255, 0.08);
      border: 2px solid #00f2ff;
      margin: 0 auto;
    }

    .score-num {
      font-size: 1.5rem;
      font-weight: 800;
      color: #00f2ff;
      line-height: 1;
    }

    .score-lbl {
      font-size: 0.6rem;
      color: #94a3b8;
      letter-spacing: 0.1em;
    }

    .top-pick-tag {
      font-size: 0.6rem;
      color: #00f2ff;
      display: block;
      text-align: center;
      margin-top: 0.5rem;
    }

    .rec-visual {
      width: 100%;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #030712;
      border-radius: 4px;
      overflow: hidden;
    }

    .rec-visual img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
    }

    .match-reasons-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .reason-tag {
      font-size: 0.65rem;
      padding: 0.2rem 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
      border-radius: 2px;
    }

    .rec-price {
      font-size: 1.4rem;
      font-weight: 800;
      color: #00f2ff;
      text-align: center;
    }

    .view-spec-link {
      color: #94a3b8;
      text-decoration: none;
    }

    .view-spec-link:hover {
      color: #00f2ff;
    }

    @media (max-width: 900px) {
      .rec-card {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .score-circle {
        margin: 0 auto;
      }
    }
  `]
})
export class ConfiguratorComponent {
  configService = inject(ConfiguratorService);
  private cartService = inject(CartService);

  selectUseCase(useCase: ProductSegment) {
    this.configService.setUseCase(useCase);
  }

  togglePriority(priority: ConfigPriority) {
    this.configService.togglePriority(priority);
  }

  isPrioritySelected(priority: ConfigPriority): boolean {
    return this.configService.state().priorities.includes(priority);
  }

  selectBudget(tier: 'entry' | 'mid' | 'high' | 'ultra') {
    this.configService.setBudgetTier(tier);
  }

  addToCart(product: any, e: MouseEvent) {
    this.cartService.addToCart(product, undefined, { startEvent: e });
  }
}
