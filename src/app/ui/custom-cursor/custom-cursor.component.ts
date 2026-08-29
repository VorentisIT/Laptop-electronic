import { Component, HostListener, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-cursor-container" [class.is-active]="isVisible()" [class.is-pointer]="isPointer()">
      <!-- Main small dot -->
      <div 
        class="cursor-dot" 
        [style.transform]="'translate3d(' + dotX() + 'px, ' + dotY() + 'px, 0)'">
      </div>
      
      <!-- Follower outer circle with mode badge -->
      <div 
        class="cursor-follower" 
        [class.has-badge]="cursorMode() !== ''"
        [style.transform]="'translate3d(' + followerX() + 'px, ' + followerY() + 'px, 0)'">
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
      top: -3px;
      left: -3px;
      width: 6px;
      height: 6px;
      background-color: #00f2ff;
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      box-shadow: 0 0 10px #00f2ff;
    }

    .cursor-follower {
      position: absolute;
      top: -20px;
      left: -20px;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(0, 242, 255, 0.45);
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                  height 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                  background-color 0.25s ease,
                  border-color 0.25s ease;
    }

    .is-pointer .cursor-follower {
      width: 52px;
      height: 52px;
      top: -26px;
      left: -26px;
      background: rgba(0, 242, 255, 0.12);
      border-color: rgba(0, 242, 255, 0.8);
    }

    .cursor-follower.has-badge {
      width: 72px;
      height: 72px;
      top: -36px;
      left: -36px;
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
  isVisible = signal<boolean>(false);
  isPointer = signal<boolean>(false);
  cursorMode = signal<string>(''); // 'VIEW' | 'DRAG' | 'EXPLORE' | 'ADD' | ''

  dotX = signal<number>(-100);
  dotY = signal<number>(-100);
  followerX = signal<number>(-100);
  followerY = signal<number>(-100);

  private targetX = -100;
  private targetY = -100;
  private currentX = -100;
  private currentY = -100;
  private animFrameId: number | null = null;

  ngOnInit() {
    this.startFollowerLoop();
  }

  ngOnDestroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isVisible()) {
      this.isVisible.set(true);
    }
    this.dotX.set(e.clientX);
    this.dotY.set(e.clientY);
    this.targetX = e.clientX;
    this.targetY = e.clientY;

    const target = e.target as HTMLElement | null;
    if (target) {
      const mode = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (mode) {
        this.cursorMode.set(mode);
        this.isPointer.set(true);
      } else {
        this.cursorMode.set('');
        const isClickable = !!target.closest('button, a, input, select, textarea, [role="button"]');
        this.isPointer.set(isClickable);
      }
    }
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.isVisible.set(false);
  }

  private startFollowerLoop() {
    const render = () => {
      // Smooth lerp for outer ring
      const ease = 0.18;
      this.currentX += (this.targetX - this.currentX) * ease;
      this.currentY += (this.targetY - this.currentY) * ease;

      this.followerX.set(this.currentX);
      this.followerY.set(this.currentY);

      this.animFrameId = requestAnimationFrame(render);
    };
    render();
  }
}
