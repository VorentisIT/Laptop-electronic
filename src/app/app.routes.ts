import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'VORENTIS — Next-Gen Electronics & Computing Ecosystem'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'Hardware Vault // VORENTIS Catalog'
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Product Architecture // VORENTIS'
  },
  {
    path: 'categories/:category',
    loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent),
    title: 'Hardware Worlds // VORENTIS'
  },
  {
    path: 'compare',
    loadComponent: () => import('./features/compare/compare.component').then(m => m.CompareComponent),
    title: 'Synchronized Hardware Matrix // VORENTIS'
  },
  {
    path: 'configurator',
    loadComponent: () => import('./features/configurator/configurator.component').then(m => m.ConfiguratorComponent),
    title: 'Find My Device // VORENTIS AI Allocator'
  },
  {
    path: 'tech-lab',
    loadComponent: () => import('./features/tech-lab/tech-lab.component').then(m => m.TechLabComponent),
    title: '3D Research Laboratory // VORENTIS'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Secure Checkout // VORENTIS'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
