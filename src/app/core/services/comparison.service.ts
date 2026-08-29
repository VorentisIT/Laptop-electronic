import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { SoundService } from './sound.service';
import { AnalyticsService } from './analytics.service';

export interface WinnerBadges {
  bestPerformanceId?: string;
  bestValueId?: string;
  bestBatteryId?: string;
  bestDisplayId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  readonly comparedProducts = signal<Product[]>([]);

  readonly count = computed(() => this.comparedProducts().length);
  readonly isFull = computed(() => this.comparedProducts().length >= 3);

  readonly winners = computed<WinnerBadges>(() => {
    const list = this.comparedProducts();
    if (list.length < 2) return {};

    // Best Performance
    const perfSorted = [...list].sort((a, b) => {
      const scoreA = a.benchmarks.geekbenchMultiCore + a.benchmarks.timespyGpuScore;
      const scoreB = b.benchmarks.geekbenchMultiCore + b.benchmarks.timespyGpuScore;
      return scoreB - scoreA;
    });

    // Best Value (Score / Price ratio)
    const valueSorted = [...list].sort((a, b) => {
      const valA = (a.benchmarks.geekbenchMultiCore + a.benchmarks.timespyGpuScore) / (a.price || 1);
      const valB = (b.benchmarks.geekbenchMultiCore + b.benchmarks.timespyGpuScore) / (b.price || 1);
      return valB - valA;
    });

    // Best Battery
    const batterySorted = [...list].sort((a, b) => {
      return b.benchmarks.batteryLifeHours - a.benchmarks.batteryLifeHours;
    });

    // Best Display (Nits * Refresh)
    const displaySorted = [...list].sort((a, b) => {
      return (b.specs.displayNits * b.specs.refreshRate) - (a.specs.displayNits * a.specs.refreshRate);
    });

    return {
      bestPerformanceId: perfSorted[0]?.id,
      bestValueId: valueSorted[0]?.id,
      bestBatteryId: batterySorted[0]?.id,
      bestDisplayId: displaySorted[0]?.id
    };
  });

  constructor(
    private sound: SoundService,
    private analytics: AnalyticsService
  ) {}

  toggleProduct(product: Product): boolean {
    const current = this.comparedProducts();
    const exists = current.some(p => p.id === product.id);

    if (exists) {
      this.removeProduct(product.id);
      return false;
    } else {
      if (current.length >= 3) {
        // Pop the first one to keep 3
        this.comparedProducts.update(items => [...items.slice(1), product]);
      } else {
        this.comparedProducts.update(items => [...items, product]);
      }
      this.sound.playClick();
      this.analytics.track('product_compare_add', { productId: product.id, name: product.name });
      return true;
    }
  }

  addProduct(product: Product) {
    if (this.isCompared(product.id)) return;
    this.comparedProducts.update(items => {
      if (items.length >= 3) {
        return [...items.slice(1), product];
      }
      return [...items, product];
    });
    this.sound.playClick();
    this.analytics.track('product_compare_add', { productId: product.id });
  }

  removeProduct(productId: string) {
    this.comparedProducts.update(items => items.filter(p => p.id !== productId));
    this.sound.playClick();
  }

  isCompared(productId: string): boolean {
    return this.comparedProducts().some(p => p.id === productId);
  }

  clearComparison() {
    this.comparedProducts.set([]);
    this.sound.playClick();
  }
}
