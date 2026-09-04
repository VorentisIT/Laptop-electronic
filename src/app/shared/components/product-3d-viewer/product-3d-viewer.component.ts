import { 
  Component, 
  ElementRef, 
  ViewChild, 
  AfterViewInit, 
  OnDestroy, 
  HostListener, 
  Input, 
  signal,
  inject,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductColor } from '../../../core/models/product.model';
import { APEX_HERO_FRAMES } from '../../../core/data/products.data';
import { SoundService } from '../../../core/services/sound.service';

interface FrameHotspot {
  id: string;
  targetFrame: number;
  badge: string;
  title: string;
  detail: string;
  spec: string;
  pinX: number; // percentage X position (0-100)
  pinY: number; // percentage Y position (0-100)
  label: string;
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

      <!-- Viewer Top HUD -->
      <div class="viewer-top-hud">
        <div class="hud-left">
          <div class="status-indicator">
            <span class="pulse-dot"></span>
            <span class="font-mono text-xs text-white font-bold">4K ORBITAL TURNTABLE</span>
          </div>
        </div>
      </div>

      <!-- 5 Interactive Hotspot (+) Buttons across the laptop -->
      @for (spot of hotspots; track spot.id) {
        <div 
          class="interactive-hotspot-pin"
          [class.is-active]="selectedHotspot()?.id === spot.id"
          [style.left.%]="spot.pinX"
          [style.top.%]="spot.pinY"
          (click)="selectHotspot(spot, $event)">
          <div class="hotspot-pulse"></div>
          <div class="hotspot-core">
            <span>+</span>
          </div>
          <span class="hotspot-tag font-mono">{{ spot.label }}</span>
        </div>
      }

      <!-- Telemetry Floating Spec Card (Transparent Background) -->
      @if (selectedHotspot()) {
        <div class="hotspot-floating-card tech-box animate-fadeIn">
          <div class="card-tag font-mono text-xs">
            <span class="badge-text">{{ selectedHotspot()?.badge }}</span>
            <span class="spec-highlight font-mono">{{ selectedHotspot()?.spec }}</span>
          </div>
          <h4 class="card-title font-heading">{{ selectedHotspot()?.title }}</h4>
          <p class="card-desc font-sans">{{ selectedHotspot()?.detail }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .frame-viewer-container {
      position: relative;
      width: 100%;
      height: 580px;
      background: radial-gradient(circle at center, #0b1528 0%, #020610 85%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      cursor: grab;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      contain: paint layout;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 242, 255, 0.08);
    }

    .frame-viewer-container:active {
      cursor: grabbing;
    }

    .frame-canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: filter 0.2s ease;
      transform: translateZ(0);
      will-change: transform;
    }

    .viewer-top-hud {
      position: absolute;
      top: 1.25rem;
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
      gap: 0.85rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(8, 14, 26, 0.85);
      backdrop-filter: blur(12px);
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00f2ff;
      box-shadow: 0 0 8px #00f2ff;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.8); }
    }

    .hud-chip {
      background: rgba(0, 242, 255, 0.1);
      border: 1px solid rgba(0, 242, 255, 0.3);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }

    .hud-degrees {
      background: rgba(255, 255, 255, 0.04);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }

    .auto-spin-btn {
      background: rgba(8, 14, 26, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f8fafc;
      padding: 0.45rem 0.9rem;
      border-radius: 6px;
      cursor: pointer;
      pointer-events: auto;
      transition: all 0.2s ease;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .auto-spin-btn:hover, .auto-spin-btn.is-active {
      border-color: #00f2ff;
      color: #00f2ff;
      background: rgba(0, 242, 255, 0.12);
      box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);
    }

    /* Hotspot Interactive Pin */
    .interactive-hotspot-pin {
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: pointer;
      z-index: 12;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      transition: transform 0.2s ease;
    }

    .interactive-hotspot-pin:hover, .interactive-hotspot-pin.is-active {
      transform: translate(-50%, -50%) scale(1.15);
      z-index: 14;
    }

    .hotspot-pulse {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1.5px solid #00f2ff;
      animation: pinPulse 2s infinite;
      top: -4px;
      pointer-events: none;
    }

    @keyframes pinPulse {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .hotspot-core {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #00f2ff;
      color: #030712;
      font-size: 14px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px #00f2ff;
      transition: all 0.2s ease;
    }

    .interactive-hotspot-pin.is-active .hotspot-core {
      background: #ffffff;
      color: #030712;
      box-shadow: 0 0 22px #00f2ff, 0 0 10px #ffffff;
    }

    .hotspot-tag {
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #94a3b8;
      background: rgba(3, 7, 18, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      white-space: nowrap;
      pointer-events: none;
      transition: all 0.2s ease;
      backdrop-filter: blur(8px);
    }

    .interactive-hotspot-pin.is-active .hotspot-tag,
    .interactive-hotspot-pin:hover .hotspot-tag {
      color: #00f2ff;
      border-color: #00f2ff;
      background: rgba(0, 242, 255, 0.15);
      box-shadow: 0 0 10px rgba(0, 242, 255, 0.4);
    }

    .hotspot-floating-card {
      position: absolute;
      top: 4.5rem;
      left: 1.5rem;
      max-width: 320px;
      padding: 1rem 1.25rem;
      background: transparent;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 242, 255, 0.3);
      border-radius: 8px;
      z-index: 15;
      pointer-events: none;
    }

    .card-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
      gap: 0.5rem;
    }

    .badge-text {
      color: #00f2ff;
      font-weight: 700;
      letter-spacing: 0.08em;
    }

    .spec-highlight {
      color: #10b981;
      font-size: 0.68rem;
    }

    .card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.35rem;
      line-height: 1.25;
    }

    .card-desc {
      font-size: 0.8rem;
      color: #cbd5e1;
      line-height: 1.5;
    }

    .viewer-bottom-bar {
      position: absolute;
      bottom: 1.25rem;
      left: 1.5rem;
      right: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      pointer-events: auto;
    }

    .scrubber-track-wrapper {
      width: 100%;
      max-width: 580px;
    }

    .frame-range-slider {
      width: 100%;
      accent-color: #00f2ff;
      cursor: pointer;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn { animation: fadeIn 0.25s ease; }

    @media (max-width: 900px) {
      .frame-viewer-container {
        height: 500px;
      }
      .hotspot-floating-card {
        top: auto;
        bottom: 5.5rem;
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }

    @media (max-width: 768px) {
      .frame-viewer-container {
        height: 440px;
        border-radius: 8px;
      }
    }

    @media (max-width: 480px) {
      .frame-viewer-container {
        height: 360px;
      }
    }

    @media (max-width: 768px) {
      .viewer-top-hud {
        top: 0.75rem;
        left: 0.75rem;
        right: 0.75rem;
      }

      .status-indicator {
        padding: 0.25rem 0.6rem;
      }

      .hotspot-floating-card {
        top: auto;
        bottom: 0.75rem;
        left: 0.75rem;
        right: 0.75rem;
        max-width: none;
        padding: 0.75rem 0.85rem;
        background: rgba(4, 8, 18, 0.92);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 242, 255, 0.35);
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.85);
      }

      .card-tag {
        margin-bottom: 0.25rem;
      }

      .badge-text {
        font-size: 0.7rem;
      }

      .spec-highlight {
        font-size: 0.62rem;
      }

      .card-title {
        font-size: 0.9rem;
        margin-bottom: 0.2rem;
      }

      .card-desc {
        font-size: 0.72rem;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .hotspot-tag {
        display: none;
      }

      .interactive-hotspot-pin.is-active .hotspot-tag {
        display: block;
        font-size: 0.52rem;
        padding: 0.1rem 0.4rem;
      }

      .hotspot-core {
        width: 20px;
        height: 20px;
        font-size: 12px;
      }

      .hotspot-pulse {
        width: 28px;
        height: 28px;
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

  private sound = inject(SoundService);
  private ngZone = inject(NgZone);
  readonly Math = Math;

  selectedColor = signal<ProductColor>(this.colors[0]);
  currentFrameIndex = signal<number>(0);
  isAutoSpinning = signal<boolean>(false);

  private frames = APEX_HERO_FRAMES;
  private bitmaps: (ImageBitmap | HTMLImageElement)[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private isDragging = false;
  private startX = 0;
  private startFrame = 0;
  private isRendering = false;
  private requestedFrame = 0;
  private animFrameId: number | null = null;

  readonly hotspots: FrameHotspot[] = [
    {
      id: 'chassis',
      targetFrame: 0,
      badge: 'AEROSPACE CHASSIS',
      title: 'Grade 5 Titanium Magnesium Unibody',
      detail: 'Monolithic CNC unibody shell delivers 380% structural rigidity with integrated acoustic waveguides.',
      spec: '1.2mm Wall Thickness · 2.45 kg',
      pinX: 25,
      pinY: 48,
      label: '01. CHASSIS'
    },
    {
      id: 'keyboard',
      targetFrame: 10,
      badge: 'TACTILE INTERFACE',
      title: 'Per-Key Optical Mech Matrix',
      detail: '0.1mm adjustable actuation magnetic switches with zero-ghosting rapid trigger and per-key RGB.',
      spec: '8000Hz Polling · Optical Debounce',
      pinX: 45,
      pinY: 54,
      label: '02. KEYBOARD'
    },
    {
      id: 'display',
      targetFrame: 20,
      badge: 'VISUAL CALIBRATION',
      title: '4K 240Hz Tandem Mini-LED Display',
      detail: '2,500 nits peak HDR brightness with 100% DCI-P3 gamut and factory Calman Delta-E < 0.8 calibration.',
      spec: '3840 x 2400 · 240Hz · 2500 nits',
      pinX: 62,
      pinY: 34,
      label: '03. DISPLAY'
    },
    {
      id: 'cooling',
      targetFrame: 30,
      badge: 'THERMAL POWER',
      title: 'Dual Cryo-Vapor Phase Chamber',
      detail: 'Sustained 275W TDP cooling keeps the 24-core neural silicon running at 5.8 GHz without acoustic compromise.',
      spec: '275W Sustained TDP · Liquid Metal',
      pinX: 40,
      pinY: 38,
      label: '04. COOLING'
    },
    {
      id: 'silicon',
      targetFrame: 38,
      badge: 'NEURAL SILICON',
      title: 'RTX 5090 & NPU Liquid Core',
      detail: '3nm GPU silicon containing 24,576 CUDA cores and dedicated 5th Gen Tensor neural accelerators.',
      spec: '32GB GDDR7 · 3,200 AI TOPS',
      pinX: 52,
      pinY: 62,
      label: '05. SILICON'
    }
  ];

  selectedHotspot = signal<FrameHotspot | undefined>(this.hotspots[0]);

  ngAfterViewInit() {
    this.setupCanvas();
    this.preloadBitmaps();
    this.attachDragListeners();
  }

  ngOnDestroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.bitmaps.forEach(b => {
      if ('close' in b && typeof b.close === 'function') {
        b.close();
      }
    });
  }

  private setupCanvas() {
    const canvas = this.frameCanvas.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.resizeCanvas();
  }

  private async preloadBitmaps() {
    // Fast parallel preloading for instant responsiveness
    const loadPromises = this.frames.map(async (src, index) => {
      try {
        if ('createImageBitmap' in window) {
          const response = await fetch(src);
          const blob = await response.blob();
          const bitmap = await createImageBitmap(blob);
          this.bitmaps[index] = bitmap;
        } else {
          const img = new Image();
          img.src = src;
          this.bitmaps[index] = img;
        }
      } catch {
        const img = new Image();
        img.src = src;
        this.bitmaps[index] = img;
      }
      if (index === 0) {
        this.scheduleRender(0);
      }
    });

    await Promise.all(loadPromises);
    this.scheduleRender(this.currentFrameIndex());
  }

  @HostListener('window:resize')
  resizeCanvas() {
    if (!this.frameCanvas || !this.viewerContainer) return;
    const canvas = this.frameCanvas.nativeElement;
    const container = this.viewerContainer.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(container.clientWidth * dpr);
    canvas.height = Math.round(container.clientHeight * dpr);

    this.scheduleRender(this.currentFrameIndex());
  }

  private scheduleRender(frameIdx: number) {
    this.requestedFrame = frameIdx;
    if (!this.isRendering) {
      this.isRendering = true;
      requestAnimationFrame(() => {
        this.renderFrame(this.requestedFrame);
        this.isRendering = false;
      });
    }
  }

  private renderFrame(frameIdx: number) {
    if (!this.ctx || !this.frameCanvas) return;
    const canvas = this.frameCanvas.nativeElement;
    const asset = this.bitmaps[frameIdx];

    if (asset) {
      const width = 'width' in asset ? asset.width : (asset as HTMLImageElement).naturalWidth;
      const height = 'height' in asset ? asset.height : (asset as HTMLImageElement).naturalHeight;

      if (width > 0 && height > 0) {
        const hRatio = canvas.width / width;
        const vRatio = canvas.height / height;
        const ratio = Math.min(hRatio, vRatio) * 0.92;

        const centerShiftX = (canvas.width - width * ratio) / 2;
        const centerShiftY = (canvas.height - height * ratio) / 2;

        this.ctx.drawImage(
          asset,
          0, 0, width, height,
          centerShiftX, centerShiftY, width * ratio, height * ratio
        );
      }
    }
  }

  selectHotspot(spot: FrameHotspot, e?: Event) {
    e?.stopPropagation();
    this.selectedHotspot.set(spot);
    this.smoothTransitionToFrame(spot.targetFrame);
    this.sound.playClick();
  }

  private smoothTransitionToFrame(targetFrame: number) {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    const start = this.currentFrameIndex();
    const totalFrames = this.frames.length;
    let diff = targetFrame - start;
    
    if (diff > totalFrames / 2) diff -= totalFrames;
    if (diff < -totalFrames / 2) diff += totalFrames;

    const duration = 400; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quintic ease out for buttery liquid motion
      const eased = 1 - Math.pow(1 - progress, 5);
      const current = Math.round(start + diff * eased);
      const normalized = ((current % totalFrames) + totalFrames) % totalFrames;

      this.currentFrameIndex.set(normalized);
      this.scheduleRender(normalized);

      if (progress < 1) {
        this.animFrameId = requestAnimationFrame(animate);
      } else {
        this.animFrameId = null;
        this.currentFrameIndex.set(targetFrame);
        this.scheduleRender(targetFrame);
      }
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  setColor(col: ProductColor, e?: Event) {
    e?.stopPropagation();
    this.selectedColor.set(col);
    this.sound.playClick();
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
    return 'contrast(1.06) brightness(1.02) saturate(1.04)';
  }

  private attachDragListeners() {
    this.ngZone.runOutsideAngular(() => {
      const container = this.viewerContainer?.nativeElement;
      if (!container) return;

      container.addEventListener('mousedown', (e: MouseEvent) => {
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
          this.animFrameId = null;
        }
        this.isDragging = true;
        this.startX = e.clientX;
        this.startFrame = this.currentFrameIndex();
      }, { passive: true });

      window.addEventListener('mousemove', (e: MouseEvent) => {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.startX;
        const frameShift = Math.floor(deltaX / 12);
        const total = this.frames.length;
        let newFrame = (this.startFrame + frameShift) % total;
        if (newFrame < 0) newFrame += total;

        if (newFrame !== this.currentFrameIndex()) {
          this.currentFrameIndex.set(newFrame);
          this.scheduleRender(newFrame);

          let closest = this.hotspots[0];
          let minDiff = 999;
          for (const spot of this.hotspots) {
            const diff = Math.abs(spot.targetFrame - newFrame);
            if (diff < minDiff) {
              minDiff = diff;
              closest = spot;
            }
          }
          this.ngZone.run(() => this.selectedHotspot.set(closest));
        }
      }, { passive: true });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      }, { passive: true });

      container.addEventListener('touchstart', (e: TouchEvent) => {
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
          this.animFrameId = null;
        }
        if (e.touches.length > 0) {
          this.isDragging = true;
          this.startX = e.touches[0].clientX;
          this.startFrame = this.currentFrameIndex();
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e: TouchEvent) => {
        if (!this.isDragging || e.touches.length === 0) return;

        const deltaX = e.touches[0].clientX - this.startX;
        const frameShift = Math.floor(deltaX / 12);
        const total = this.frames.length;
        let newFrame = (this.startFrame + frameShift) % total;
        if (newFrame < 0) newFrame += total;

        if (newFrame !== this.currentFrameIndex()) {
          this.currentFrameIndex.set(newFrame);
          this.scheduleRender(newFrame);

          let closest = this.hotspots[0];
          let minDiff = 999;
          for (const spot of this.hotspots) {
            const diff = Math.abs(spot.targetFrame - newFrame);
            if (diff < minDiff) {
              minDiff = diff;
              closest = spot;
            }
          }
          this.ngZone.run(() => this.selectedHotspot.set(closest));
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.isDragging = false;
      }, { passive: true });
    });
  }

  onMouseDown(_e: MouseEvent) {}
  onTouchStart(_e: TouchEvent) {}
}
