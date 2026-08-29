import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductSegment } from '../models/product.model';
import { ConfigPriority, ConfiguratorState, ConfigRecommendation } from '../models/configurator.model';
import { ProductService } from './product.service';
import { SoundService } from './sound.service';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {
  readonly state = signal<ConfiguratorState>({
    useCase: null,
    priorities: [],
    budgetTier: null,
    formFactor: null,
    currentStep: 1
  });

  readonly isCompleted = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private sound: SoundService,
    private analytics: AnalyticsService
  ) {}

  setUseCase(useCase: ProductSegment) {
    this.state.update(s => ({ ...s, useCase, currentStep: 2 }));
    this.sound.playClick();
  }

  togglePriority(priority: ConfigPriority) {
    this.state.update(s => {
      const exists = s.priorities.includes(priority);
      const updated = exists ? s.priorities.filter(p => p !== priority) : [...s.priorities, priority];
      return { ...s, priorities: updated };
    });
    this.sound.playClick();
  }

  setBudgetTier(budgetTier: ConfiguratorState['budgetTier']) {
    this.state.update(s => ({ ...s, budgetTier, currentStep: 4 }));
    this.sound.playClick();
    this.completeWizard();
  }

  nextStep() {
    this.state.update(s => ({ ...s, currentStep: Math.min(4, s.currentStep + 1) }));
    this.sound.playClick();
  }

  prevStep() {
    this.state.update(s => ({ ...s, currentStep: Math.max(1, s.currentStep - 1) }));
    this.sound.playClick();
  }

  goToStep(step: number) {
    if (step >= 1 && step <= 4) {
      if (step === 4) {
        this.isCompleted.set(true);
      } else {
        this.isCompleted.set(false);
      }
      this.state.update(s => ({ ...s, currentStep: step }));
      this.sound.playClick();
    }
  }

  completeWizard() {
    this.isCompleted.set(true);
    this.sound.playChime();
    this.analytics.track('configurator_completed', {
      useCase: this.state().useCase,
      priorities: this.state().priorities,
      budgetTier: this.state().budgetTier
    });
  }

  reset() {
    this.state.set({
      useCase: null,
      priorities: [],
      budgetTier: null,
      formFactor: null,
      currentStep: 1
    });
    this.isCompleted.set(false);
    this.sound.playClick();
  }

  readonly recommendations = computed<ConfigRecommendation[]>(() => {
    const s = this.state();
    const allProducts = this.productService.products();

    const scored = allProducts.map(product => {
      let score = 50; // base score
      const matchReasons: string[] = [];

      // Use Case matching
      if (s.useCase && product.segment.includes(s.useCase)) {
        score += 25;
        matchReasons.push(`Optimized for ${s.useCase.toUpperCase()} workflows`);
      }

      // Priorities matching
      if (s.priorities.includes('performance')) {
        if (product.benchmarks.geekbenchMultiCore > 20000) {
          score += 15;
          matchReasons.push('Top-tier multi-threaded compute score');
        }
      }
      if (s.priorities.includes('gpu')) {
        if (product.specs.graphics.includes('RTX 5090') || product.specs.graphics.includes('RTX 5070')) {
          score += 15;
          matchReasons.push('High VRAM next-gen graphics engine');
        }
      }
      if (s.priorities.includes('battery')) {
        if (product.benchmarks.batteryLifeHours >= 10) {
          score += 15;
          matchReasons.push(`${product.benchmarks.batteryLifeHours}h Extended solid-state battery`);
        }
      }
      if (s.priorities.includes('portability')) {
        if (parseFloat(product.specs.weight) <= 1.6) {
          score += 15;
          matchReasons.push(`Ultralight ${product.specs.weight} chassis`);
        }
      }
      if (s.priorities.includes('display')) {
        if (product.specs.displayNits >= 1500) {
          score += 12;
          matchReasons.push(`${product.specs.displayNits} nits HDR Master panel`);
        }
      }

      // Budget scoring
      if (s.budgetTier === 'entry' && product.price <= 2000) score += 20;
      else if (s.budgetTier === 'mid' && product.price > 2000 && product.price <= 3500) score += 20;
      else if (s.budgetTier === 'high' && product.price > 3500 && product.price <= 5000) score += 20;
      else if (s.budgetTier === 'ultra' && product.price > 5000) score += 20;

      // Clamp score
      const finalScore = Math.min(99, Math.max(65, score));

      return {
        product,
        matchScore: finalScore,
        matchReasons: matchReasons.length ? matchReasons : ['High performance all-rounder chassis'],
        keySpecSummary: `${product.specs.processor} · ${product.specs.graphics}`
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  });
}
