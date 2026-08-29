import { 
  Component, 
  ElementRef, 
  ViewChild, 
  OnInit, 
  AfterViewInit, 
  OnDestroy, 
  HostListener, 
  inject, 
  signal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { APEX_HERO_FRAMES } from '../../../core/data/products.data';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-hero-stage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section #stageContainer class="hero-cinema-stage">
      <!-- Full Viewport Canvas Bay -->
      <div class="cinema-viewport">
        <!-- Ambient Studio 4K Glow -->
        <div class="ambient-glow"></div>

        <!-- Zero-Copy High-Speed GPU Canvas -->
        <canvas #stageCanvas class="cinema-canvas"></canvas>

        <!-- Subtle Gradient Vignette around Canvas -->
        <div class="canvas-vignette"></div>

        <!-- Minimalist Headline Layer 1 (Opening) -->
        <div class="cinema-text-layer text-layer-1" [class.is-active]="currentPhase() === 1">
          <div class="eyebrow-tag font-mono">4K ULTRA-FIDELITY // 2026 WORKSTATION</div>
          <h1 class="cinema-title font-display">
            VORENTIS APEX 18
          </h1>
          <p class="cinema-subtitle font-heading">
            Liquid-Phase Silicon. 4K 240Hz Tandem Mini-LED. Grade 5 Titanium Unibody.
          </p>
        </div>

        <!-- Minimalist Headline Layer 2 (Middle) -->
        <div class="cinema-text-layer text-layer-2" [class.is-active]="currentPhase() === 2">
          <div class="eyebrow-tag font-mono">THERMODYNAMIC MASTERY</div>
          <h2 class="cinema-title font-display">
            275W SUSTAINED TDP
          </h2>
          <p class="cinema-subtitle font-heading">
            Dual vacuum vapor-chambers with liquid metal TIM.
          </p>
        </div>

        <!-- Minimalist Headline Layer 3 (Exploded Teardown) -->
        <div class="cinema-text-layer text-layer-3" [class.is-active]="currentPhase() === 3">
          <div class="eyebrow-tag font-mono">ENGINEERED DISASSEMBLY</div>
          <h2 class="cinema-title font-display">
            PRECISION SILICON
          </h2>
          <p class="cinema-subtitle font-heading">
            NVIDIA RTX 5090 · 24-Core Desktop Architecture · 99.9Wh Power.
          </p>
        </div>

        <!-- Minimalist Bottom Bar: Scroll Indicator & Clean Order Link -->
        <div class="cinema-bottom-bar">
          <div class="scroll-status font-mono">
            <span class="pulse-dot"></span>
            <span class="text-slate-300">SCROLL TO DIRECT 4K ANIMATION</span>
          </div>

          <div class="action-links font-heading">
            <button class="order-link-btn" (click)="addFlagshipToCart($event)">
              PRE-ORDER — \${{ flagshipProduct.price | number }} ➔
            </button>
          </div>
        </div>

        <!-- Whisper-thin Progress Line at Very Bottom -->
        <div class="progress-line-track">
          <div class="progress-line-fill" [style.width.%]="scrollProgress() * 100"></div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-cinema-stage {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: #020610;
      overflow: hidden;
      contain: paint layout;
    }

    .cinema-viewport {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .ambient-glow {
      position: absolute;
      width: 70vw;
      height: 70vh;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 242, 255, 0.08) 0%, rgba(139, 92, 246, 0.04) 45%, transparent 75%);
      filter: blur(90px);
      pointer-events: none;
      z-index: 1;
      transform: translateZ(0);
    }

    .cinema-canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      z-index: 2;
      position: relative;
      transform: translateZ(0);
      will-change: transform;
    }

    .canvas-vignette {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at center, transparent 65%, rgba(2, 6, 16, 0.75) 100%);
      z-index: 3;
    }

    .cinema-text-layer {
      position: absolute;
      top: 6.5rem;
      left: 3rem;
      max-width: 600px;
      z-index: 5;
      pointer-events: none;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    .cinema-text-layer.is-active {
      opacity: 1;
      transform: translateY(0);
    }

    .eyebrow-tag {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      color: #00f2ff;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .cinema-title {
      font-size: clamp(2.4rem, 5vw, 4.5rem);
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 0.65rem;
      text-shadow: 0 4px 25px rgba(0, 0, 0, 0.8);
    }

    .cinema-subtitle {
      font-size: 1rem;
      color: #cbd5e1;
      line-height: 1.5;
      max-width: 480px;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
    }

    .cinema-bottom-bar {
      position: absolute;
      bottom: 2rem;
      left: 3rem;
      right: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      pointer-events: auto;
    }

    .scroll-status {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      background: rgba(6, 11, 23, 0.85);
      backdrop-filter: blur(12px);
      padding: 0.45rem 0.95rem;
      border-radius: 999px;
      border: 1px solid rgba(0, 242, 255, 0.25);
      box-shadow: 0 0 15px rgba(0, 242, 255, 0.15);
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #00f2ff;
      border-radius: 50%;
      box-shadow: 0 0 10px #00f2ff;
      animation: pulse 1.8s infinite;
    }

    .order-link-btn {
      background: #ffffff;
      color: #020610;
      border: none;
      font-family: inherit;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.06em;
      padding: 0.7rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.6);
    }

    .order-link-btn:hover {
      background: #00f2ff;
      box-shadow: 0 0 30px rgba(0, 242, 255, 0.6);
      transform: translateY(-2px);
    }

    .progress-line-track {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2.5px;
      background: rgba(255, 255, 255, 0.05);
      z-index: 15;
    }

    .progress-line-fill {
      height: 100%;
      background: #00f2ff;
      box-shadow: 0 0 12px #00f2ff;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    @media (max-width: 768px) {
      .cinema-text-layer {
        top: 5rem;
        left: 1.5rem;
        right: 1.5rem;
      }
      .cinema-bottom-bar {
        left: 1.5rem;
        right: 1.5rem;
        bottom: 1.25rem;
      }
      .cinema-title {
        font-size: 2.2rem;
      }
    }
  `]
})
export class HeroStageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stageContainer') stageContainer!: ElementRef<HTMLElement>;
  @ViewChild('stageCanvas') stageCanvas!: ElementRef<HTMLCanvasElement>;

  private productService = inject(ProductService);
  private cartService = inject(CartService);

  readonly flagshipProduct = this.productService.flagshipProduct();
  readonly frames = APEX_HERO_FRAMES;

  scrollProgress = signal<number>(0);
  currentFrameIndex = signal<number>(0);
  currentPhase = signal<number>(1);

  // Cached GPU ImageBitmaps for 0ms render latency
  private bitmaps: (ImageBitmap | HTMLImageElement)[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private isRendering = false;
  private requestedFrame = 0;

  ngOnInit() {
    this.preloadBitmaps();
  }

  ngAfterViewInit() {
    this.setupCanvas();
    setTimeout(() => {
      this.initScrollScrubber();
    }, 50);
  }

  ngOnDestroy() {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
    // Clean up bitmaps
    this.bitmaps.forEach(b => {
      if ('close' in b && typeof b.close === 'function') {
        b.close();
      }
    });
  }

  private async preloadBitmaps() {
    for (let i = 0; i < this.frames.length; i++) {
      const src = this.frames[i];
      try {
        if ('createImageBitmap' in window) {
          const response = await fetch(src);
          const blob = await response.blob();
          const bitmap = await createImageBitmap(blob);
          this.bitmaps[i] = bitmap;
        } else {
          const img = new Image();
          img.src = src;
          this.bitmaps[i] = img;
        }
      } catch {
        const img = new Image();
        img.src = src;
        this.bitmaps[i] = img;
      }

      if (i === 0) {
        this.scheduleRender(0);
      }
    }
    ScrollTrigger.refresh();
  }

  private setupCanvas() {
    const canvas = this.stageCanvas.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.resizeCanvas();
  }

  @HostListener('window:resize')
  resizeCanvas() {
    if (!this.stageCanvas || !this.stageContainer) return;
    const canvas = this.stageCanvas.nativeElement;
    const container = this.stageContainer.nativeElement;
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
    if (!this.ctx || !this.stageCanvas) return;
    const canvas = this.stageCanvas.nativeElement;
    const asset = this.bitmaps[frameIdx];

    if (asset) {
      const width = 'width' in asset ? asset.width : (asset as HTMLImageElement).naturalWidth;
      const height = 'height' in asset ? asset.height : (asset as HTMLImageElement).naturalHeight;

      if (width > 0 && height > 0) {
        const hRatio = canvas.width / width;
        const vRatio = canvas.height / height;
        const ratio = Math.min(hRatio, vRatio) * 0.94;

        const centerShiftX = (canvas.width - width * ratio) / 2;
        const centerShiftY = (canvas.height - height * ratio) / 2;

        // Fast zero-copy draw
        this.ctx.drawImage(
          asset,
          0, 0, width, height,
          centerShiftX, centerShiftY, width * ratio, height * ratio
        );
      }
    }
  }

  private initScrollScrubber() {
    const container = this.stageContainer.nativeElement;

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=150%',
      pin: true,
      pinSpacing: true,
      scrub: 0.15, // Blisteringly snappy 0.15s scrub
      onUpdate: (self) => {
        const progress = self.progress;
        this.scrollProgress.set(progress);

        const frameIndex = Math.min(
          this.frames.length - 1,
          Math.floor(progress * this.frames.length)
        );

        if (frameIndex !== this.currentFrameIndex()) {
          this.currentFrameIndex.set(frameIndex);
          this.scheduleRender(frameIndex);
        }

        if (progress < 0.35) {
          this.currentPhase.set(1);
        } else if (progress < 0.72) {
          this.currentPhase.set(2);
        } else {
          this.currentPhase.set(3);
        }
      }
    });
  }

  addFlagshipToCart(e: MouseEvent) {
    this.cartService.addToCart(this.flagshipProduct, undefined, { startEvent: e });
  }
}
