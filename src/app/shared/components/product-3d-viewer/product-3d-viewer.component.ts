import { 
  Component, 
  ElementRef, 
  ViewChild, 
  AfterViewInit, 
  OnDestroy, 
  HostListener, 
  Input, 
  signal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductColor } from '../../../core/models/product.model';
import { APEX_HERO_FRAMES } from '../../../core/data/products.data';

interface FrameHotspot {
  startFrame: number;
  endFrame: number;
  title: string;
  detail: string;
  spec: string;
  badge: string;
}

@Component({
  selector: 'app-product-3d-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      #viewerContainer 
      class="frame-viewer-container tech-box" 
      data-cursor="DRAG"
      (mousedown)="onMouseDown($event)"
      (touchstart)="onTouchStart($event)">
      
      <!-- Frame Canvas Render Bay -->
      <canvas #frameCanvas class="frame-canvas" [style.filter]="getColorFilter()"></canvas>

      <!-- Viewer Top HUD Overlay -->
      <div class="viewer-top-hud">
        <div class="hud-left">
          <span class="tech-badge emerald">4K INTERACTIVE TURNTABLE ENGINE</span>
          <span class="font-mono text-xs text-slate-400">DRAG HORIZONTALLY TO ROTATE</span>
        </div>

        <div class="hud-right font-mono text-xs">
          <button 
            class="auto-spin-btn" 
            [class.is-active]="isAutoSpinning()"
            (click)="toggleAutoSpin($event)">
            {{ isAutoSpinning() ? '⏸ PAUSE ROTATION' : '▶ 360° AUTO SPIN' }}
          </button>
        </div>
      </div>

      <!-- Live Dynamic Hotspot Box synced to Frame Index -->
      @if (currentHotspot()) {
        <div class="hotspot-floating-card tech-box animate-fadeIn">
          <div class="card-tag font-mono text-xs text-cyan-400">
            <span>{{ currentHotspot()?.badge }}</span>
            <span class="text-slate-500">FRAME {{ currentFrameIndex() + 1 }} / 40</span>
          </div>
          <h4 class="card-title font-heading">{{ currentHotspot()?.title }}</h4>
          <p class="card-desc">{{ currentHotspot()?.detail }}</p>
          <div class="card-spec font-mono text-xs text-emerald-400">{{ currentHotspot()?.spec }}</div>
        </div>
      }

      <!-- Bottom HUD Controls & Angle Jumpers -->
      <div class="viewer-bottom-bar">
        <!-- Finish Color Switcher -->
        <div class="finish-palette">
          <span class="font-mono text-xs text-slate-400">FINISH:</span>
          <div class="colors-list">
            @for (col of colors; track col.name) {
              <button 
                class="color-dot-btn" 
                [class.is-active]="selectedColor().name === col.name"
                [style.background-color]="col.hex"
                (click)="setColor(col, $event)"
                [title]="col.name">
              </button>
            }
          </div>
        </div>

        <!-- Frame Scrubber Bar -->
        <div class="scrubber-track-wrapper">
          <input 
            type="range" 
            min="0" 
            max="39" 
            [value]="currentFrameIndex()" 
            (input)="onScrubInput($event)"
            class="frame-range-slider"
          />
        </div>

        <!-- Angle Preset Jumpers -->
        <div class="angle-presets font-mono text-xs">
          <button class="preset-btn" (click)="jumpToFrame(0, $event)">01. CLOSED</button>
          <button class="preset-btn" (click)="jumpToFrame(12, $event)">02. UNIBODY</button>
          <button class="preset-btn" (click)="jumpToFrame(24, $event)">03. DISPLAY</button>
          <button class="preset-btn" (click)="jumpToFrame(38, $event)">04. SILICON</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .frame-viewer-container {
      position: relative;
      width: 100%;
      height: 560px;
      background: radial-gradient(circle at center, #0f1c36 0%, #030712 85%);
      border-radius: 8px;
      overflow: hidden;
      cursor: grab;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .frame-viewer-container:active {
      cursor: grabbing;
    }

    .frame-canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      transition: filter 0.3s ease;
      transform: translateZ(0);
      will-change: transform;
    }

    .viewer-top-hud {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      right: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
      z-index: 10;
    }

    .hud-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .auto-spin-btn {
      background: rgba(8, 14, 26, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      cursor: pointer;
      pointer-events: auto;
      transition: all 0.2s ease;
    }

    .auto-spin-btn:hover, .auto-spin-btn.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.1);
      box-shadow: 0 0 15px rgba(0, 242, 255, 0.25);
    }

    .hotspot-floating-card {
      position: absolute;
      top: 5rem;
      left: 1.5rem;
      max-width: 320px;
      padding: 1.25rem;
      background: rgba(8, 14, 26, 0.92);
      backdrop-filter: blur(16px);
      border: 1px solid #00f2ff;
      border-radius: 6px;
      z-index: 15;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 242, 255, 0.2);
      pointer-events: none;
    }

    .card-tag {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.35rem;
    }

    .card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.35rem;
    }

    .card-desc {
      font-size: 0.8rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 0.5rem;
    }

    .viewer-bottom-bar {
      position: absolute;
      bottom: 1.25rem;
      left: 1.5rem;
      right: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      z-index: 10;
      pointer-events: auto;
      flex-wrap: wrap;
    }

    .finish-palette {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(8, 14, 26, 0.85);
      backdrop-filter: blur(10px);
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .colors-list {
      display: flex;
      gap: 0.4rem;
    }

    .color-dot-btn {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .color-dot-btn:hover, .color-dot-btn.is-active {
      border-color: #00f2ff;
      transform: scale(1.2);
      box-shadow: 0 0 10px #00f2ff;
    }

    .scrubber-track-wrapper {
      flex: 1;
      min-width: 180px;
    }

    .frame-range-slider {
      width: 100%;
      accent-color: #00f2ff;
      cursor: pointer;
    }

    .angle-presets {
      display: flex;
      gap: 0.35rem;
      background: rgba(8, 14, 26, 0.85);
      backdrop-filter: blur(10px);
      padding: 0.35rem 0.6rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .preset-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 0.25rem 0.5rem;
      font-family: inherit;
      font-size: 0.7rem;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.15s ease;
    }

    .preset-btn:hover {
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.08);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.25s ease; }

    @media (max-width: 768px) {
      .frame-viewer-container {
        height: 440px;
      }
      .hotspot-floating-card {
        top: auto;
        bottom: 5.5rem;
        max-width: calc(100% - 3rem);
      }
      .viewer-bottom-bar {
        gap: 0.75rem;
      }
    }
  `]
})
export class Product3dViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewerContainer') viewerContainer!: ElementRef<HTMLElement>;
  @ViewChild('frameCanvas') frameCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() colors: ProductColor[] = [
    { name: 'Obsidian Void', hex: '#0B0F19', finish: 'Matte' },
    { name: 'Cyber Titanium', hex: '#64748B', finish: 'Titanium' },
    { name: 'Nebula Silver', hex: '#CBD5E1', finish: 'Anodized' },
    { name: 'Solar Amber Core', hex: '#F59E0B', finish: 'Cyber' }
  ];

  selectedColor = signal<ProductColor>(this.colors[0]);
  currentFrameIndex = signal<number>(0);
  isAutoSpinning = signal<boolean>(false);

  private frames = APEX_HERO_FRAMES;
  private images: HTMLImageElement[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private isDragging = false;
  private startX = 0;
  private startFrame = 0;
  private autoSpinTimer: number | null = null;

  readonly hotspots: FrameHotspot[] = [
    {
      startFrame: 0,
      endFrame: 9,
      badge: 'AEROSPACE CHASSIS',
      title: 'Grade 5 Titanium Magnesium Unibody',
      detail: 'Monolithic CNC unibody shell delivers 380% structural rigidity with integrated acoustic waveguides.',
      spec: '1.2mm Wall Thickness · 2.45 kg'
    },
    {
      startFrame: 10,
      endFrame: 22,
      badge: 'TACTILE INTERFACE',
      title: 'Per-Key Optical Mech Matrix',
      detail: '0.1mm adjustable actuation magnetic switches with zero-ghosting rapid trigger and per-key RGB.',
      spec: '8000Hz Polling · Optical Sensor'
    },
    {
      startFrame: 23,
      endFrame: 33,
      badge: 'VISUAL CALIBRATION',
      title: '4K 240Hz Tandem Mini-LED',
      detail: '2,500 nits peak HDR brightness with 100% DCI-P3 gamut and factory Calman Delta-E < 0.8 calibration.',
      spec: '3840 x 2400 · 240Hz · 0.2ms'
    },
    {
      startFrame: 34,
      endFrame: 39,
      badge: 'THERMODYNAMICS',
      title: 'Dual Cryo-Vapor Chamber & 24-Core Silicon',
      detail: 'Sustained 275W TDP cooling keeps the 24-core neural silicon running at 5.8 GHz without throttling.',
      spec: '275W Sustained TDP · Liquid Metal TIM'
    }
  ];

  currentHotspot = signal<FrameHotspot | undefined>(this.hotspots[0]);

  ngAfterViewInit() {
    this.setupCanvas();
    this.preloadFrames();
  }

  ngOnDestroy() {
    this.stopAutoSpin();
  }

  private setupCanvas() {
    const canvas = this.frameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: true });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
    this.resizeCanvas();
  }

  private preloadFrames() {
    this.frames.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (idx === 0) {
          this.renderFrame(0);
        }
      };
      this.images.push(img);
    });
  }

  @HostListener('window:resize')
  resizeCanvas() {
    if (!this.frameCanvas || !this.viewerContainer) return;
    const canvas = this.frameCanvas.nativeElement;
    const container = this.viewerContainer.nativeElement;
    const dpr = Math.max(window.devicePixelRatio || 1, 2.5);

    canvas.width = Math.round(container.clientWidth * dpr);
    canvas.height = Math.round(container.clientHeight * dpr);

    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }

    this.renderFrame(this.currentFrameIndex());
  }

  private renderFrame(frameIdx: number) {
    if (!this.ctx || !this.frameCanvas) return;
    const canvas = this.frameCanvas.nativeElement;
    const img = this.images[frameIdx];

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (img && img.complete && img.naturalWidth > 0) {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio) * 0.92;

      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;

      this.ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
      );
    }

    const active = this.hotspots.find(h => frameIdx >= h.startFrame && frameIdx <= h.endFrame);
    this.currentHotspot.set(active);
  }

  setColor(col: ProductColor, e?: Event) {
    e?.stopPropagation();
    this.selectedColor.set(col);
  }

  getColorFilter(): string {
    const name = this.selectedColor().name.toLowerCase();
    if (name.includes('titanium')) {
      return 'brightness(1.08) contrast(1.1) saturate(0.85)';
    } else if (name.includes('silver')) {
      return 'brightness(1.22) contrast(1.15) saturate(0.7)';
    } else if (name.includes('amber')) {
      return 'sepia(0.2) hue-rotate(15deg) contrast(1.05)';
    }
    return 'contrast(1.08) brightness(1.02) saturate(1.05)';
  }

  jumpToFrame(frameIndex: number, e?: Event) {
    e?.stopPropagation();
    this.stopAutoSpin();
    this.currentFrameIndex.set(frameIndex);
    this.renderFrame(frameIndex);
  }

  onScrubInput(e: Event) {
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    this.currentFrameIndex.set(val);
    this.renderFrame(val);
  }

  toggleAutoSpin(e: Event) {
    e.stopPropagation();
    if (this.isAutoSpinning()) {
      this.stopAutoSpin();
    } else {
      this.startAutoSpin();
    }
  }

  private startAutoSpin() {
    this.isAutoSpinning.set(true);
    this.autoSpinTimer = window.setInterval(() => {
      const next = (this.currentFrameIndex() + 1) % this.frames.length;
      this.currentFrameIndex.set(next);
      this.renderFrame(next);
    }, 65);
  }

  private stopAutoSpin() {
    this.isAutoSpinning.set(false);
    if (this.autoSpinTimer) {
      clearInterval(this.autoSpinTimer);
      this.autoSpinTimer = null;
    }
  }

  onMouseDown(e: MouseEvent) {
    this.stopAutoSpin();
    this.isDragging = true;
    this.startX = e.clientX;
    this.startFrame = this.currentFrameIndex();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.startX;
    const frameShift = Math.floor(deltaX / 8);
    const total = this.frames.length;
    let newFrame = (this.startFrame + frameShift) % total;
    if (newFrame < 0) newFrame += total;

    if (newFrame !== this.currentFrameIndex()) {
      this.currentFrameIndex.set(newFrame);
      this.renderFrame(newFrame);
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  onTouchStart(e: TouchEvent) {
    this.stopAutoSpin();
    if (e.touches.length > 0) {
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      this.startFrame = this.currentFrameIndex();
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    if (!this.isDragging || e.touches.length === 0) return;

    const deltaX = e.touches[0].clientX - this.startX;
    const frameShift = Math.floor(deltaX / 8);
    const total = this.frames.length;
    let newFrame = (this.startFrame + frameShift) % total;
    if (newFrame < 0) newFrame += total;

    if (newFrame !== this.currentFrameIndex()) {
      this.currentFrameIndex.set(newFrame);
      this.renderFrame(newFrame);
    }
  }

  @HostListener('window:touchend')
  onTouchEnd() {
    this.isDragging = false;
  }
}
