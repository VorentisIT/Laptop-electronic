import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';

interface TechComponentSpec {
  id: string;
  name: string;
  category: string;
  badge: string;
  icon: string;
  whatItDoes: string;
  whyItMatters: string;
  perfImpact: string;
  recommendedFor: string;
  technicalMetrics: { key: string; val: string }[];
}

@Component({
  selector: 'app-tech-lab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="tech-lab-page container-custom">
      <!-- Lab Header -->
      <div class="lab-header">
        <span class="tech-badge emerald">VORENTIS HARDWARE LABORATORY</span>
        <h1 class="lab-title font-display mt-2">TECHNICAL RESEARCH LAB</h1>
        <p class="lab-sub font-heading">
          Explore the internal physical innovations powering our silicon architectures, thermodynamic dissipation chambers, and next-generation battery chemistries.
        </p>
      </div>

      <!-- Component Navigation Ribbon -->
      <div class="components-nav-ribbon tech-box font-mono text-xs">
        @for (item of labSpecs; track item.id) {
          <button 
            class="nav-tab-btn" 
            [class.is-active]="selectedComponent().id === item.id"
            (click)="selectComponent(item)">
            <span>{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </button>
        }
      </div>

      <!-- Active Component Deep Dive Stage -->
      <div class="component-deep-dive tech-box mt-8">
        <div class="deep-dive-grid">
          <!-- Left: 3D Holographic Diagram Plate -->
          <div class="diagram-plate">
            <div class="diagram-hud font-mono text-xs text-cyan-400">
              <span>SCAN // {{ selectedComponent().id.toUpperCase() }}</span>
              <span class="text-emerald-400">STATUS: LAB VALIDATED</span>
            </div>

            <!-- Visual Hologram Graphic -->
            <div class="hologram-visual">
              <div class="holo-core">
                <span class="holo-icon">{{ selectedComponent().icon }}</span>
              </div>
              <div class="holo-ring outer"></div>
              <div class="holo-ring inner"></div>
            </div>

            <!-- Live Metric Chips -->
            <div class="metric-chips-grid font-mono text-xs">
              @for (m of selectedComponent().technicalMetrics; track m.key) {
                <div class="metric-chip tech-box">
                  <span class="m-key text-slate-400">{{ m.key }}</span>
                  <span class="m-val text-cyan-400 font-bold">{{ m.val }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Right: 4-Pillar Architectural Breakdown -->
          <div class="breakdown-details">
            <div class="detail-header">
              <span class="tech-badge">{{ selectedComponent().badge }}</span>
              <span class="font-mono text-xs text-slate-400">{{ selectedComponent().category }}</span>
            </div>

            <h2 class="component-name font-display">{{ selectedComponent().name }}</h2>

            <!-- 4 Structured Pillars Required by Spec -->
            <div class="four-pillars-list">
              <!-- Pillar 1: WHAT IT DOES -->
              <div class="pillar-block tech-box">
                <div class="pillar-tag font-mono text-xs text-cyan-400">01. WHAT IT DOES</div>
                <p class="pillar-text">{{ selectedComponent().whatItDoes }}</p>
              </div>

              <!-- Pillar 2: WHY IT MATTERS -->
              <div class="pillar-block tech-box">
                <div class="pillar-tag font-mono text-xs text-emerald-400">02. WHY IT MATTERS</div>
                <p class="pillar-text">{{ selectedComponent().whyItMatters }}</p>
              </div>

              <!-- Pillar 3: PERFORMANCE IMPACT -->
              <div class="pillar-block tech-box">
                <div class="pillar-tag font-mono text-xs text-amber-400">03. PERFORMANCE IMPACT</div>
                <p class="pillar-text">{{ selectedComponent().perfImpact }}</p>
              </div>

              <!-- Pillar 4: RECOMMENDED FOR -->
              <div class="pillar-block tech-box">
                <div class="pillar-tag font-mono text-xs text-purple-400">04. RECOMMENDED FOR</div>
                <p class="pillar-text font-bold text-white">{{ selectedComponent().recommendedFor }}</p>
              </div>
            </div>

            <!-- Direct Hardware CTA -->
            <div class="lab-cta-row mt-6">
              <a routerLink="/products" class="btn-vorentis-primary text-xs">
                VIEW HARDWARE WITH THIS TECHNOLOGY ➔
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tech-lab-page {
      padding-top: 8rem;
      padding-bottom: 8rem;
    }

    .lab-header {
      margin-bottom: 2.5rem;
    }

    .lab-title {
      font-size: clamp(2.4rem, 4.5vw, 4.5rem);
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.03em;
    }

    .lab-sub {
      font-size: 1.05rem;
      color: #94a3b8;
      max-width: 650px;
    }

    .components-nav-ribbon {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 6px;
      overflow-x: auto;
      background: #080e1a;
    }

    .nav-tab-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      color: #94a3b8;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .nav-tab-btn:hover, .nav-tab-btn.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    .component-deep-dive {
      padding: 3rem;
      border-radius: 8px;
      background: #080e1a;
    }

    .deep-dive-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 3.5rem;
      align-items: center;
    }

    .diagram-plate {
      padding: 2.5rem;
      background: radial-gradient(circle at center, #0f1c36 0%, #050a14 85%);
      border: 1px solid rgba(0, 242, 255, 0.25);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .diagram-hud {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .hologram-visual {
      position: relative;
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 1.5rem 0;
    }

    .holo-core {
      width: 90px;
      height: 90px;
      background: rgba(0, 242, 255, 0.12);
      border: 2px solid #00f2ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 35px rgba(0, 242, 255, 0.4);
      z-index: 10;
    }

    .holo-icon {
      font-size: 2.5rem;
    }

    .holo-ring {
      position: absolute;
      border: 1px dashed rgba(0, 242, 255, 0.4);
      border-radius: 50%;
      animation: spin 20s linear infinite;
    }

    .holo-ring.outer {
      width: 190px;
      height: 190px;
    }

    .holo-ring.inner {
      width: 140px;
      height: 140px;
      animation-direction: reverse;
      animation-duration: 12s;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .metric-chips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      width: 100%;
      margin-top: 1.5rem;
    }

    .metric-chip {
      padding: 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      border-radius: 4px;
    }

    .breakdown-details {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .component-name {
      font-size: clamp(2rem, 3vw, 2.8rem);
      font-weight: 800;
      color: #f8fafc;
      line-height: 1.1;
    }

    .four-pillars-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .pillar-block {
      padding: 1.25rem;
      border-radius: 4px;
      background: rgba(15, 23, 42, 0.6);
    }

    .pillar-tag {
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 0.35rem;
    }

    .pillar-text {
      font-size: 0.875rem;
      color: #cbd5e1;
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .deep-dive-grid {
        grid-template-columns: 1fr;
      }
      .component-deep-dive {
        padding: 1.5rem;
      }
    }
  `]
})
export class TechLabComponent {
  private sound = inject(SoundService);

  readonly labSpecs: TechComponentSpec[] = [
    {
      id: 'vapor-chamber',
      name: 'Dual Cryo-Vapor Chamber',
      category: 'Thermodynamics & Cooling',
      badge: '250W CONTINUOUS TDP',
      icon: '❄️',
      whatItDoes: 'Distributes thermal energy from CPU/GPU dies via phase-change evaporation across sintered copper capillary micro-structures.',
      whyItMatters: 'Eliminates hot-spot throttling entirely, enabling maximum boost clocks without spinning loud acoustic fans over 34 dBA.',
      perfImpact: '+38% sustained rendering throughput over traditional heatpipes.',
      recommendedFor: '3D VFX Artists, 8K Video Rendering, Continuous Simulation',
      technicalMetrics: [
        { key: 'PEAK CAPACITY', val: '275 Watts TDP' },
        { key: 'PHASE VELOCITY', val: '820 m/s Evaporation' },
        { key: 'ACOUSTICS', val: '< 32 dBA Whisper' },
        { key: 'INTERFACE', val: 'Pure Liquid Metal TIM' }
      ]
    },
    {
      id: 'tandem-oled',
      name: '4K 240Hz Tandem Mini-LED',
      category: 'Display & Visual Calibration',
      badge: '2,500 NITS LUMINANCE',
      icon: '👁️',
      whatItDoes: 'Layers dual emitter stacks with quantum dot polarization to produce pure inky blacks and blinding 2500 nits HDR specular highlights.',
      whyItMatters: 'Delivers zero image retention with Calman-verified Delta-E < 0.8 color accuracy for reference grading suites.',
      perfImpact: '0.03ms pixel response eliminates all ghosting and motion blur.',
      recommendedFor: 'Colorists, Directors, Unreal Engine Master Developers',
      technicalMetrics: [
        { key: 'PEAK BRIGHTNESS', val: '2,500 Nits' },
        { key: 'REFRESH RATE', val: '240Hz Variable' },
        { key: 'COLOR ACCURACY', val: 'Delta-E < 0.8' },
        { key: 'GAMUT COVERAGE', val: '100% DCI-P3' }
      ]
    },
    {
      id: 'solid-battery',
      name: 'Si-C Solid-State Battery Cell',
      category: 'Electrochemical Energy Reserve',
      badge: '99.9WH MAXIMUM FAA',
      icon: '🔋',
      whatItDoes: 'Utilizes silicon-carbon composite anodes to double volumetric energy density compared to legacy lithium-ion polymer pouch cells.',
      whyItMatters: 'Enables 14+ hours of genuine high-intensity creative work without carrying heavy AC power bricks.',
      perfImpact: '0-80% ultra-fast recharge in 34 minutes via 140W GaN PD.',
      recommendedFor: 'Mobile Developers, Field Producers, Travelers',
      technicalMetrics: [
        { key: 'CAPACITY', val: '99.9 Watt-Hours' },
        { key: 'ENERGY DENSITY', val: '780 Wh/L' },
        { key: 'CHARGE RATE', val: '140W GaN Ultra-PD' },
        { key: 'CYCLE HEALTH', val: '1,500 Cycles to 85%' }
      ]
    },
    {
      id: 'gpu-silicon',
      name: 'RTX 5090 Liquid Core Silicon',
      category: 'Neural & Graphics Architecture',
      badge: '32GB GDDR7 512-BIT',
      icon: '🚀',
      whatItDoes: '3nm GPU silicon containing 24,576 CUDA cores and dedicated 5th Gen Tensor neural accelerators.',
      whyItMatters: 'Enables loading 70B parameter LLM models completely into local ultra-fast GDDR7 memory.',
      perfImpact: '1,792 GB/s memory bandwidth delivers 4K 180+ FPS ray traced rasterization.',
      recommendedFor: 'Local AI Research, LLM Inference, Realtime VFX',
      technicalMetrics: [
        { key: 'VRAM CAPACITY', val: '32GB GDDR7' },
        { key: 'BUS WIDTH', val: '512-bit Interconnect' },
        { key: 'BOOST CLOCK', val: '3.15 GHz Sustained' },
        { key: 'TENSOR TOPS', val: '3,200 AI FP8 TOPS' }
      ]
    }
  ];

  selectedComponent = signal<TechComponentSpec>(this.labSpecs[0]);

  selectComponent(comp: TechComponentSpec) {
    this.selectedComponent.set(comp);
    this.sound.playClick();
  }
}
