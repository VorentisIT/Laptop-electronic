export type ProductCategory = 'laptops' | 'workstations' | 'components' | 'displays' | 'accessories';

export type ProductSegment = 'gaming' | 'creative' | 'business' | 'developer' | 'audiophile';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
  finish: 'Anodized' | 'Matte' | 'Cyber' | 'Titanium';
}

export interface ExplodedLayer {
  id: string;
  name: string;
  description: string;
  material: string;
  role: string;
  depthZ: number; // 3D explosion translation offset
  yOffset: number;
  highlightColor?: string;
  techSpec?: string;
}

export interface ProductBenchmark {
  geekbenchMultiCore: number;
  cinebenchR24: number;
  timespyGpuScore: number;
  batteryLifeHours: number;
  thermalTdpWatts: number;
  renderEfficiencyScore: number;
}

export interface ProductSpecs {
  processor: string;
  graphics: string;
  memory: string;
  storage: string;
  display: string;
  displayNits: number;
  refreshRate: number;
  battery: string;
  batteryLifeHours: number;
  weight: string;
  cooling: string;
  ports: string[];
  dimensions: string;
  os: string;
  warranty: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  modelCode: string;
  brand: string;
  tagline: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  segment: ProductSegment[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isFlagship?: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'preorder';
  badge?: string;
  
  // Visuals
  heroImage: string;
  galleryImages: string[];
  explodedViewAvailable: boolean;
  explodedLayers?: ExplodedLayer[];
  frameSequencePath?: string;
  
  // Customization & Specs
  colors: ProductColor[];
  selectedColor?: ProductColor;
  specs: ProductSpecs;
  benchmarks: ProductBenchmark;
  highlights: string[];
  inTheBox: string[];
}

export interface FilterState {
  category: ProductCategory | 'all';
  segment: ProductSegment | 'all';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  minRamGb?: number;
  minGpuVramGb?: number;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'rating' | 'performance';
}
