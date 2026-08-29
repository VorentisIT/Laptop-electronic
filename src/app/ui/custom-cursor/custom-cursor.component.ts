import { 
  Component, 
  signal, 
  OnInit, 
  OnDestroy, 
  ElementRef, 
  ViewChild, 
  NgZone, 
  inject 
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      #cursorContainer 
      class="custom-cursor-container" 
      [class.is-active]="isVisible()" 
      [class.is-pointer]="isPointer()">
      
      <!-- Main small dot -->
      <div #cursorDot class="cursor-dot"></div>
      
      <!-- Follower outer circle with mode badge -->
      <div #cursorFollower class="cursor-follower" [class.has-badge]="cursorMode() !== ''">
        @if (cursorMode()) {
          <span class="cursor-label">{{ cursorMode() }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-cursor-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.3s ease;
      mix-blend-mode: difference;
    }

    .custom-cursor-container.is-active {
      opacity: 1;
    }

    .cursor-dot {
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 6px;
      margin-top: -3px;
      margin-left: -3px;
      background-color: #00f2ff;
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      transform: translate3d(-100px, -100px, 0);
      box-shadow: 0 0 10px #00f2ff;
    }

    .cursor-follower {
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      margin-top: -20px;
      margin-left: -20px;
      border: 1px solid rgba(0, 242, 255, 0.45);
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      transform: translate3d(-100px, -100px, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                  height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                  margin 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.25s ease,
                  border-color 0.25s ease;
    }

    .is-pointer .cursor-follower {
      width: 52px;
      height: 52px;
      margin-top: -26px;
      margin-left: -26px;
      background: rgba(0, 242, 255, 0.12);
      border-color: rgba(0, 242, 255, 0.8);
    }

    .cursor-follower.has-badge {
      width: 72px;
      height: 72px;
      margin-top: -36px;
      margin-left: -36px;
      background: rgba(8, 14, 26, 0.9);
      border-color: #00f2ff;
      box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);
    }

    .cursor-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #00f2ff;
      text-transform: uppercase;
    }

    @media (hover: none) and (pointer: coarse) {
      .custom-cursor-container {
        display: none !important;
      }
    }
  `]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  @ViewChild('cursorDot') cursorDot?: ElementRef<HTMLElement>;
  @ViewChild('cursorFollower') cursorFollower?: ElementRef<HTMLElement>;

  private ngZone = inject(NgZone);

  isVisible = signal<boolean>(false);
  isPointer = signal<boolean>(false);
  cursorMode = signal<string>(''); // 'VIEW' | 'DRAG' | 'EXPLORE' | 'ADD' | ''

  private targetX = -100;
  private targetY = -100;
  private currentX = -100;
  private currentY = -100;
  private animFrameId: number | null = null;
  private mouseMoveListener?: (e: MouseEvent) => void;
  private mouseLeaveListener?: () => void;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.mouseMoveListener = (e: MouseEvent) => this.handleMouseMove(e);
      this.mouseLeaveListener = () => {
        this.ngZone.run(() => this.isVisible.set(false));
      };

      window.addEventListener('mousemove', this.mouseMoveListener, { passive: true });
      window.addEventListener('mouseleave', this.mouseLeaveListener, { passive: true });
      this.startFollowerLoop();
    });
  }

  ngOnDestroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.mouseMoveListener) {
      window.removeEventListener('mousemove', this.mouseMoveListener);
    }
    if (this.mouseLeaveListener) {
      window.removeEventListener('mouseleave', this.mouseLeaveListener);
    }
  }

  private handleMouseMove(e: MouseEvent) {
    this.targetX = e.clientX;
    this.targetY = e.clientY;

    if (!this.isVisible()) {
      this.ngZone.run(() => this.isVisible.set(true));
    }

    if (this.cursorDot?.nativeElement) {
      this.cursorDot.nativeElement.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }

    const target = e.target as HTMLElement | null;
    if (target) {
      const mode = target.closest('[data-cursor]')?.getAttribute('data-cursor') || '';
      const isClickable = !!target.closest('button, a, input, select, textarea, [role="button"]') || mode !== '';

      if (this.cursorMode() !== mode || this.isPointer() !== isClickable) {
        this.ngZone.run(() => {
          this.cursorMode.set(mode);
          this.isPointer.set(isClickable);
        });
      }
    }
  }

  private startFollowerLoop() {
    const render = () => {
      const ease = 0.22;
      this.currentX += (this.targetX - this.currentX) * ease;
      this.currentY += (this.targetY - this.currentY) * ease;

      if (this.cursorFollower?.nativeElement) {
        this.cursorFollower.nativeElement.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
      }

      this.animFrameId = requestAnimationFrame(render);
    };
    render();
  }
}
