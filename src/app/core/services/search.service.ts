import { Injectable, signal, computed } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  readonly isSearchOpen = signal<boolean>(false);
  readonly query = signal<string>('');
  readonly recentSearches = signal<string[]>([
    'Apex 18 OLED',
    'RTX 5090',
    'Gaming laptop under 3500',
    'Liquid cooling workstation',
    'Tandem OLED 240Hz'
  ]);

  constructor(
    private productService: ProductService,
    private sound: SoundService
  ) {}

  openSearch() {
    this.isSearchOpen.set(true);
    this.sound.playClick();
  }

  closeSearch() {
    this.isSearchOpen.set(false);
  }

  toggleSearch() {
    this.isSearchOpen.update(v => !v);
    this.sound.playClick();
  }

  setQuery(q: string) {
    this.query.set(q);
  }

  addRecentSearch(term: string) {
    if (!term.trim()) return;
    this.recentSearches.update(list => {
      const filtered = list.filter(item => item.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 6);
    });
  }

  readonly searchResults = computed<Product[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];

    const products = this.productService.products();

    // Check for price under X filter (e.g. "under 3000" or "< 3000")
    const priceMatch = q.match(/under\s*(\d+)/) || q.match(/<\s*(\d+)/);
    const maxBudget = priceMatch ? parseInt(priceMatch[1], 10) : null;

    return products.filter(p => {
      if (maxBudget && p.price > maxBudget) {
        return false;
      }
      
      const cleanQ = q.replace(/under\s*\d+/, '').replace(/<\s*\d+/, '').trim();
      if (!cleanQ) return true;

      const inName = p.name.toLowerCase().includes(cleanQ);
      const inTagline = p.tagline.toLowerCase().includes(cleanQ);
      const inCat = p.category.toLowerCase().includes(cleanQ);
      const inSegment = p.segment.some(s => s.toLowerCase().includes(cleanQ));
      const inSpecs = p.specs.processor.toLowerCase().includes(cleanQ) || 
                      p.specs.graphics.toLowerCase().includes(cleanQ) ||
                      p.specs.display.toLowerCase().includes(cleanQ);

      return inName || inTagline || inCat || inSegment || inSpecs;
    });
  });
}
