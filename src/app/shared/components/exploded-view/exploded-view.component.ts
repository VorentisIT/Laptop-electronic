import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplodedLayer } from '../../../core/models/product.model';
import { SoundService } from '../../../core/services/sound.service';

@Component({
  selector: 'app-exploded-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="exploded-section tech-box">
      <!-- Section Header -->
      <div class="exploded-header">
        <div>
          <span class="tech-badge emerald">LAYERED HARDWARE BLUEPRINT</span>
          <h2 class="section-heading font-display mt-2">INTERNAL THERMAL &amp; SILICON ARCHITECTURE</h2>
          <p class="section-sub font-heading">
            Inspect the precision aerospace layers and thermal dissipation components engineered inside the Vorentis Apex 18 Neo.
          </p>
        </div>
      </div>

      <!-- Clean 2D Layer Blueprint Stack -->
      <div class="blueprint-stack-grid">
        <!-- Left: Layer Selector List -->
        <div class="layers-selector-list">
          @for (layer of layers; track layer.id; let idx = $index) {
            <div 
              class="layer-item-row tech-box" 
              [class.is-selected]="selectedLayer()?.id === layer.id"
              (click)="selectLayer(layer)"
              (mouseenter)="selectLayer(layer)">
              <div class="layer-num font-mono">0{{ idx + 1 }}</div>
              <div class="layer-info">
                <span class="layer-role font-mono text-xs">{{ layer.role }}</span>
                <h4 class="layer-title font-heading">{{ layer.name }}</h4>
              </div>
              <span class="layer-arrow font-mono">➔</span>
            </div>
          }
        </div>

        <!-- Right: Active Layer Inspector Card -->
        @if (selectedLayer()) {
          <div class="layer-detail-card tech-box animate-fadeIn">
            <div class="card-top font-mono text-xs">
              <span class="text-cyan-400">BLUEPRINT LAYER // {{ selectedLayer()?.id }}</span>
              <span class="text-slate-400">{{ selectedLayer()?.role }}</span>
            </div>

            <h3 class="card-name font-display">{{ selectedLayer()?.name }}</h3>
            <p class="card-description font-heading">{{ selectedLayer()?.description }}</p>

            <div class="metrics-matrix font-mono text-xs">
              <div class="matrix-row">
                <span class="text-slate-400">MATERIAL SPECIFICATION:</span>
                <span class="text-white font-bold">{{ selectedLayer()?.material }}</span>
              </div>
              <div class="matrix-row">
                <span class="text-slate-400">PERFORMANCE RATING:</span>
                <span class="text-emerald-400 font-bold">{{ selectedLayer()?.techSpec }}</span>
              </div>
            </div>

            <div class="blueprint-seal font-mono text-xs">
              🔒 VERIFIED FOR SUSTAINED 275W THERMAL DISSIPATION
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .exploded-section {
      padding: 3.5rem;
      border-radius: 8px;
      background: #060b17;
      margin: 4rem 0;
      position: relative;
    }

    .exploded-header {
      margin-bottom: 2.5rem;
    }

    .section-heading {
      font-size: clamp(1.8rem, 3vw, 2.6rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #f8fafc;
    }

    .section-sub {
      font-size: 0.95rem;
      color: #94a3b8;
      max-width: 580px;
      margin-top: 0.5rem;
    }

    .blueprint-stack-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 2.5rem;
      align-items: flex-start;
    }

    .layers-selector-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .layer-item-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.15rem 1.5rem;
      background: #0b1324;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .layer-item-row:hover, .layer-item-row.is-selected {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
      transform: translateX(6px);
      box-shadow: 0 0 20px rgba(0, 242, 255, 0.15);
    }

    .layer-num {
      font-size: 0.9rem;
      font-weight: 700;
      color: #00f2ff;
    }

    .layer-info {
      flex: 1;
    }

    .layer-role {
      color: #64748b;
      letter-spacing: 0.08em;
    }

    .layer-title {
      font-size: 1rem;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 0.15rem;
    }

    .layer-arrow {
      color: #64748b;
      transition: transform 0.2s ease;
    }

    .layer-item-row.is-selected .layer-arrow {
      color: #00f2ff;
      transform: translateX(4px);
    }

    .layer-detail-card {
      padding: 2.5rem;
      background: #080e1a;
      border-radius: 8px;
      border: 1px solid rgba(0, 242, 255, 0.3);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 242, 255, 0.15);
      position: sticky;
      top: 6rem;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .card-name {
      font-size: 1.8rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.75rem;
      line-height: 1.15;
    }

    .card-description {
      font-size: 0.95rem;
      color: #cbd5e1;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .metrics-matrix {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .matrix-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .blueprint-seal {
      color: #10b981;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 0.5rem 0.85rem;
      border-radius: 4px;
      text-align: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.25s ease; }

    @media (max-width: 900px) {
      .blueprint-stack-grid {
        grid-template-columns: 1fr;
      }
      .layer-detail-card {
        position: static;
      }
    }
  `]
})
export class ExplodedViewComponent {
  private sound = inject(SoundService);

  @Input() layers: ExplodedLayer[] = [
    {
      id: 'layer-display',
      name: '4K Tandem Mini-LED Panel',
      description: '2,500 nits peak brightness with 100% DCI-P3 color gamut and 240Hz refresh rate.',
      material: 'Gorilla Armor Glass + Quantum Dot Matrix',
      role: 'Visual Calibration Studio',
      depthZ: 140,
      yOffset: 90,
      highlightColor: '#00f2ff',
      techSpec: '3840 x 2400 · 240Hz · 2500 nits'
    },
    {
      id: 'layer-keyboard',
      name: 'Per-Key Haptic Mech Matrix',
      description: 'Low-profile optical switches with 1.2mm actuation and zero ghosting RGB backlight.',
      material: 'PBT Double-shot Keycaps & Stainless Stabilizers',
      role: 'Tactile Input Engine',
      depthZ: 95,
      yOffset: 40,
      highlightColor: '#3b82f6',
      techSpec: 'Optical 45g actuation · 0.1ms debounce'
    },
    {
      id: 'layer-chassis-top',
      name: 'Titanium-Magnesium Unibody Top',
      description: 'CNC machined unibody shell with integrated acoustic waveguides and thermal venting channels.',
      material: 'Grade 5 Aerospace Titanium Alloy',
      role: 'Structural Rigidity & Passive Dissipation',
      depthZ: 60,
      yOffset: 20,
      highlightColor: '#94a3b8',
      techSpec: '1.2mm wall thickness · 380% rigidity'
    },
    {
      id: 'layer-motherboard',
      name: '12-Layer Micro-Via PCB',
      description: 'High-density interconnect PCB with dedicated neural accelerator and 16-phase digital VRM.',
      material: 'TG-170 Low-Loss Dielectric & 2oz Copper Traces',
      role: 'Central Processing & Power Distribution',
      depthZ: 10,
      yOffset: -10,
      highlightColor: '#10b981',
      techSpec: '24 Cores / 32 Threads · 5.8 GHz Turbo'
    },
    {
      id: 'layer-cooling',
      name: 'Dual Cryo-Vapor Phase Chamber',
      description: '3D curved vacuum vapor chamber filled with deionized liquid and sintering copper wick capillaries.',
      material: 'Pure Deoxygenated Electrolytic Copper',
      role: '250W Sustained Thermal Dissipation',
      depthZ: -35,
      yOffset: -30,
      highlightColor: '#00f2ff',
      techSpec: '250W sustained TDP · Liquid Metal TIM'
    },
    {
      id: 'layer-battery',
      name: '99.9Wh Solid-State Battery Block',
      description: 'Silicon-carbon composite cell matrix with ultra-fast 140W gallium nitride PD charging.',
      material: 'High-Energy-Density Si-C Anode Cells',
      role: 'All-Day Power Reserve',
      depthZ: -75,
      yOffset: -50,
      highlightColor: '#f59e0b',
      techSpec: '99.9Wh FAA Maximum · 0-80% in 34 mins'
    }
  ];

  selectedLayer = signal<ExplodedLayer | null>(this.layers[0]);

  selectLayer(layer: ExplodedLayer) {
    this.selectedLayer.set(layer);
    this.sound.playClick();
  }
}
