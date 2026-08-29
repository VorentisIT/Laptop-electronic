import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplodedLayer } from '../../../core/models/product.model';
import { SoundService } from '../../../core/services/sound.service';

@Component({
  selector: 'app-exploded-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exploded-container">
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
        <!-- Left: Layer Selector List with Image Thumbnails -->
        <div class="layers-selector-list">
          @for (layer of layers; track layer.id; let idx = $index) {
            <div 
              class="layer-item-row tech-box spotlight-card" 
              [class.is-selected]="selectedLayer()?.id === layer.id"
              (click)="selectLayer(layer)"
              (mouseenter)="selectLayer(layer)">
              
              <div class="layer-num font-mono">0{{ idx + 1 }}</div>

              @if (layer.image) {
                <div class="layer-thumb-bay">
                  <img [src]="layer.image" [alt]="layer.name" class="layer-thumb-img" />
                </div>
              }

              <div class="layer-info">
                <span class="layer-role font-mono text-xs">{{ layer.role }}</span>
                <h4 class="layer-title font-heading">{{ layer.name }}</h4>
              </div>
              
              <span class="layer-arrow font-mono">➔</span>
            </div>
          }
        </div>

        <!-- Right: Active Layer Inspector Card with High-Res Image Banner -->
        @if (selectedLayer()) {
          <div class="layer-detail-card tech-box animate-fadeIn">
            <!-- Visual Media Showcase for Selected Layer -->
            @if (selectedLayer()?.image) {
              <div class="layer-hero-visual">
                <img [src]="selectedLayer()?.image" [alt]="selectedLayer()?.name" class="layer-hero-img" />
                <div class="layer-visual-overlay"></div>
                <span class="layer-visual-chip font-mono text-xs">{{ selectedLayer()?.role }}</span>
              </div>
            }

            <div class="layer-detail-content">
              <div class="card-top font-mono text-xs">
                <span class="layer-id-chip text-cyan-400">BLUEPRINT LAYER // {{ getLayerNumber(selectedLayer()?.id) }}</span>
                <span class="layer-spec-chip text-slate-400">{{ selectedLayer()?.techSpec }}</span>
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
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .exploded-container {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      position: relative;
    }

    .exploded-header {
      margin-bottom: 2rem;
    }

    .section-heading {
      font-size: clamp(1.6rem, 3vw, 2.4rem);
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
      grid-template-columns: 1.15fr 1fr;
      gap: 2rem;
      align-items: flex-start;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    .layers-selector-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    .layer-item-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 0.9rem 1.25rem;
      background: #0b1324;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      cursor: pointer;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    }

    .layer-item-row:hover, .layer-item-row.is-selected {
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
      box-shadow: 0 0 20px rgba(0, 242, 255, 0.15);
    }

    .layer-num {
      font-size: 0.9rem;
      font-weight: 700;
      color: #00f2ff;
      min-width: 24px;
    }

    .layer-thumb-bay {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
      background: #020610;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .layer-thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .layer-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }

    .layer-role {
      color: #64748b;
      letter-spacing: 0.08em;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .layer-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 0.15rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
      padding: 0;
      background: #080e1a;
      border-radius: 8px;
      border: 1px solid rgba(0, 242, 255, 0.3);
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 242, 255, 0.15);
      position: sticky;
      top: 6rem;
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }

    .layer-hero-visual {
      position: relative;
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: #020610;
    }

    .layer-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .layer-detail-card:hover .layer-hero-img {
      transform: scale(1.05);
    }

    .layer-visual-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 30%, #080e1a 100%);
    }

    .layer-visual-chip {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(8, 14, 26, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 242, 255, 0.3);
      color: #00f2ff;
      padding: 0.3rem 0.65rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }

    .layer-detail-content {
      padding: 1.75rem 2rem 2rem;
      width: 100%;
      box-sizing: border-box;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 0.85rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 0.6rem;
      width: 100%;
      box-sizing: border-box;
    }

    .layer-id-chip {
      color: #00f2ff;
      font-weight: 700;
      letter-spacing: 0.08em;
    }

    .layer-spec-chip {
      color: #94a3b8;
      font-size: 0.72rem;
      word-break: break-word;
    }

    .card-name {
      font-size: clamp(1.15rem, 3.5vw, 1.6rem);
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 0.5rem;
      line-height: 1.2;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .card-description {
      font-size: 0.88rem;
      color: #cbd5e1;
      line-height: 1.55;
      margin-bottom: 1.25rem;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .metrics-matrix {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1.25rem;
      margin-bottom: 1.25rem;
      width: 100%;
      box-sizing: border-box;
    }

    .matrix-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      box-sizing: border-box;
    }

    .matrix-row span {
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .blueprint-seal {
      color: #10b981;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 0.5rem 0.85rem;
      border-radius: 4px;
      text-align: center;
      font-size: 0.7rem;
      white-space: normal;
      line-height: 1.35;
      word-break: break-word;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.25s ease; }

    @media (max-width: 900px) {
      .blueprint-stack-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      .layer-detail-card {
        position: static;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
    }

    @media (max-width: 640px) {
      .exploded-container {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      .blueprint-stack-grid {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        gap: 1rem;
      }
      .layers-selector-list {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        gap: 0.5rem;
      }
      .layer-item-row {
        padding: 0.65rem 0.85rem;
        gap: 0.65rem;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      .layer-role {
        display: none;
      }
      .layer-title {
        font-size: 0.85rem;
        margin-top: 0;
        white-space: normal;
        line-height: 1.25;
      }
      .layer-item-row.is-selected {
        border-left: 3px solid #00f2ff;
      }
      .layer-thumb-bay {
        width: 36px;
        height: 36px;
      }
      .layer-hero-visual {
        height: 140px;
        width: 100%;
      }
      .layer-detail-card {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      .layer-detail-content {
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
      }
      .card-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
      .card-name {
        font-size: 1.2rem;
        line-height: 1.2;
      }
      .matrix-row {
        flex-direction: column;
        gap: 0.2rem;
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
      techSpec: '3840 x 2400 · 240Hz · 2500 nits',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
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
      techSpec: 'Optical 45g actuation · 0.1ms debounce',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
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
      techSpec: '1.2mm wall thickness · 380% rigidity',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
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
      techSpec: '24 Cores / 32 Threads · 5.8 GHz Turbo',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
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
      techSpec: '250W sustained TDP · Liquid Metal TIM',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80'
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
      techSpec: '99.9Wh FAA Maximum · 0-80% in 34 mins',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'layer-chassis-bottom',
      name: 'Graphene-Coated Base Shell',
      description: 'Bottom intake cowl with integrated anti-dust magnetic filtration and composite thermal shielding.',
      material: 'Graphene Composite + Rubber Isolators',
      role: 'Acoustic Insulation & Intake Aerodynamics',
      depthZ: -110,
      yOffset: -70,
      highlightColor: '#64748b',
      techSpec: 'Direct Air Induction · <28 dBA Whisper Mode',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  selectedLayer = signal<ExplodedLayer | null>(this.layers[0]);

  selectLayer(layer: ExplodedLayer) {
    this.selectedLayer.set(layer);
    this.sound.playClick();
  }

  getLayerNumber(id?: string): string {
    if (!id) return '01';
    const index = this.layers.findIndex(l => l.id === id);
    return index >= 0 ? `0${index + 1}` : '01';
  }
}
