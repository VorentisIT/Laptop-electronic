import { Product, ProductSegment } from './product.model';

export type ConfigPriority = 'performance' | 'battery' | 'portability' | 'display' | 'gpu' | 'price';

export interface ConfiguratorState {
  useCase: ProductSegment | null;
  priorities: ConfigPriority[];
  budgetTier: 'entry' | 'mid' | 'high' | 'ultra' | null;
  formFactor: 'compact' | 'studio' | 'desktop_replacement' | 'modular' | null;
  currentStep: number;
}

export interface ConfigRecommendation {
  product: Product;
  matchScore: number;
  matchReasons: string[];
  keySpecSummary: string;
}
