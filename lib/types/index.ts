// Core types for the jewelry app

export type JewelryType = 'ring' | 'necklace' | 'bracelet' | 'earring' | 'pendant';

export type Material = 'gold' | 'silver' | 'platinum' | 'rose-gold' | 'white-gold';

export type Gemstone = 'diamond' | 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'none';

export interface Design {
  id: string;
  name: string;
  type: JewelryType;
  material: Material;
  gemstone: Gemstone;
  imageUrl: string;
  modelUrl?: string;
  prompt?: string;
  price: number;
  createdAt: Date;
  isFavorite?: boolean;
}

export interface MaterialOption {
  id: Material;
  name: string;
  color: string;
  priceMultiplier: number;
}

export interface GemstoneOption {
  id: Gemstone;
  name: string;
  color: string;
  priceMultiplier: number;
}

export interface CustomizationOptions {
  size?: number;
  engraving?: string;
  finish?: 'polished' | 'matte' | 'brushed';
}

export interface CartItem {
  design: Design;
  customization: CustomizationOptions;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface FilterOptions {
  type?: JewelryType[];
  material?: Material[];
  gemstone?: Gemstone[];
  priceRange?: [number, number];
  sortBy?: 'date' | 'price-asc' | 'price-desc' | 'popular';
}

