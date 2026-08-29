import { Injectable, signal, computed } from '@angular/core';
import { MOCK_PRODUCTS } from '../data/products.data';
import { Product, ProductCategory, ProductSegment, FilterState } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Master product store
  readonly products = signal<Product[]>(MOCK_PRODUCTS);

  // Active filters
  readonly filterState = signal<FilterState>({
    category: 'all',
    segment: 'all',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'featured'
  });

  // Flagship Hero Product
  readonly flagshipProduct = computed(() => {
    return this.products().find(p => p.isFlagship) ?? this.products()[0];
  });

  // Featured Products
  readonly featuredProducts = computed(() => {
    return this.products().filter(p => p.isFeatured);
  });

  // Filtered Products
  readonly filteredProducts = computed(() => {
    const list = this.products();
    const filter = this.filterState();
    
    return list.filter(p => {
      // Category filter
      if (filter.category !== 'all' && p.category !== filter.category) {
        return false;
      }
      // Segment filter
      if (filter.segment !== 'all' && !p.segment.includes(filter.segment as ProductSegment)) {
        return false;
      }
      // Price filter
      if (p.price < filter.minPrice || p.price > filter.maxPrice) {
        return false;
      }
      // Search query
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q);
        const matchesSpecs = p.specs.processor.toLowerCase().includes(q) || p.specs.graphics.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSpecs) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      switch (filter.sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'performance':
          return (b.benchmarks.geekbenchMultiCore + b.benchmarks.timespyGpuScore) -
                 (a.benchmarks.geekbenchMultiCore + a.benchmarks.timespyGpuScore);
        case 'featured':
        default:
          return (b.isFlagship ? 2 : b.isFeatured ? 1 : 0) - (a.isFlagship ? 2 : a.isFeatured ? 1 : 0);
      }
    });
  });

  // Get by ID or slug
  getProductByIdOrSlug(idOrSlug: string): Product | undefined {
    return this.products().find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  // Get by category
  getProductsByCategory(cat: ProductCategory): Product[] {
    return this.products().filter(p => p.category === cat);
  }

  // Set category
  setCategory(category: ProductCategory | 'all') {
    this.filterState.update(prev => ({ ...prev, category }));
  }

  // Set segment
  setSegment(segment: ProductSegment | 'all') {
    this.filterState.update(prev => ({ ...prev, segment }));
  }

  // Set search
  setSearchQuery(searchQuery: string) {
    this.filterState.update(prev => ({ ...prev, searchQuery }));
  }

  // Set sort
  setSortBy(sortBy: FilterState['sortBy']) {
    this.filterState.update(prev => ({ ...prev, sortBy }));
  }

  // Set price range
  setPriceRange(minPrice: number, maxPrice: number) {
    this.filterState.update(prev => ({ ...prev, minPrice, maxPrice }));
  }

  // Reset filters
  resetFilters() {
    this.filterState.set({
      category: 'all',
      segment: 'all',
      searchQuery: '',
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'featured'
    });
  }
}
