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

        <!-- Ultra-High Fidelity 4K Frame Sequence Canvas -->
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
      background: radial-gradient(circle, rgba(0, 242, 255, 0.09) 0%, rgba(139, 92, 246, 0.05) 45%, transparent 75%);
      filter: blur(100px);
      pointer-events: none;
      z-index: 1;
    }

    .cinema-canvas {
      width: 100%;
      height: 100%;
      object-fit: contain;
      z-index: 2;
      position: relative;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      filter: contrast(1.08) brightness(1.02) saturate(1.06) drop-shadow(0 25px 60px rgba(0, 0, 0, 0.9));
      transform: translateZ(0);
      backface-visibility: hidden;
      will-change: transform;
    }

    .canvas-vignette {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at center, transparent 65%, rgba(2, 6, 16, 0.75) 100%);
      z-index: 3;
    }

    /* Minimalist Elegant Floating Text Layers */
    .cinema-text-layer {
      position: absolute;
      top: 6.5rem;
      left: 3rem;
      max-width: 600px;
      z-index: 5;
      pointer-events: none;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
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

    /* Bottom Bar */
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

    /* Whisper-thin Progress Bar */
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
      transition: width 0.04s linear;
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

  private images: HTMLImageElement[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private scrollTriggerInstance: ScrollTrigger | null = null;

  ngOnInit() {
    this.preloadFrames();
  }

  ngAfterViewInit() {
    this.setupCanvas();
    setTimeout(() => {
      this.initScrollScrubber();
    }, 100);
  }

  ngOnDestroy() {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
  }

  private preloadFrames() {
    let loaded = 0;
    this.frames.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (idx === 0) {
          this.renderFrame(0);
        }
        if (loaded === this.frames.length) {
          ScrollTrigger.refresh();
        }
      };
      this.images.push(img);
    });
  }

  private setupCanvas() {
    const canvas = this.stageCanvas.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: true });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
    this.resizeCanvas();
  }

  @HostListener('window:resize')
  resizeCanvas() {
    if (!this.stageCanvas || !this.stageContainer) return;
    const canvas = this.stageCanvas.nativeElement;
    const container = this.stageContainer.nativeElement;
    
    // Super-sampled backing store (2.5x - 3x device pixel ratio for 4K crispness)
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
    if (!this.ctx || !this.stageCanvas) return;
    const canvas = this.stageCanvas.nativeElement;
    const img = this.images[frameIdx];

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (img && img.complete && img.naturalWidth > 0) {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio) * 0.94; // Maximize canvas coverage with crisp margins

      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;

      this.ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
      );
    }
  }

  private initScrollScrubber() {
    const container = this.stageContainer.nativeElement;

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=180%',
      pin: true,
      pinSpacing: true,
      scrub: 0.25,
      onUpdate: (self) => {
        const progress = self.progress;
        this.scrollProgress.set(progress);

        const frameIndex = Math.min(
          this.frames.length - 1,
          Math.floor(progress * this.frames.length)
        );

        if (frameIndex !== this.currentFrameIndex()) {
          this.currentFrameIndex.set(frameIndex);
          this.renderFrame(frameIndex);
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

    ScrollTrigger.refresh();
  }

  addFlagshipToCart(e: MouseEvent) {
    this.cartService.addToCart(this.flagshipProduct, undefined, { startEvent: e });
  }
}
