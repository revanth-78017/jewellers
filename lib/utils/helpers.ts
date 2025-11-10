// Helper utility functions

import { Design, FilterOptions } from '@/lib/types';

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const filterDesigns = (designs: Design[], filters: FilterOptions): Design[] => {
  let filtered = [...designs];

  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter(d => filters.type!.includes(d.type));
  }

  if (filters.material && filters.material.length > 0) {
    filtered = filtered.filter(d => filters.material!.includes(d.material));
  }

  if (filters.gemstone && filters.gemstone.length > 0) {
    filtered = filtered.filter(d => filters.gemstone!.includes(d.gemstone));
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(d => d.price >= min && d.price <= max);
  }

  // Sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'date':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }
  }

  return filtered;
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const getRandomDesigns = (count: number = 6): Design[] => {
  // Mock data for demonstration
  const types = ['ring', 'necklace', 'bracelet', 'earring', 'pendant'] as const;
  const materials = ['gold', 'silver', 'platinum', 'rose-gold', 'white-gold'] as const;
  const gemstones = ['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'none'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    name: `Design ${i + 1}`,
    type: types[Math.floor(Math.random() * types.length)],
    material: materials[Math.floor(Math.random() * materials.length)],
    gemstone: gemstones[Math.floor(Math.random() * gemstones.length)],
    imageUrl: `/images/placeholder-${i + 1}.jpg`,
    price: Math.floor(Math.random() * 10000) + 500,
    createdAt: new Date(),
    isFavorite: false,
  }));
};

