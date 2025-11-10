// Constants for the application

import { MaterialOption, GemstoneOption } from '@/lib/types';

export const MATERIALS: MaterialOption[] = [
  { id: 'gold', name: 'Gold', color: '#FFD700', priceMultiplier: 1.0 },
  { id: 'silver', name: 'Silver', color: '#C0C0C0', priceMultiplier: 0.5 },
  { id: 'platinum', name: 'Platinum', color: '#E5E4E2', priceMultiplier: 1.5 },
  { id: 'rose-gold', name: 'Rose Gold', color: '#B76E79', priceMultiplier: 1.1 },
  { id: 'white-gold', name: 'White Gold', color: '#F5F5F5', priceMultiplier: 1.2 },
];

export const GEMSTONES: GemstoneOption[] = [
  { id: 'none', name: 'None', color: '#FFFFFF', priceMultiplier: 0 },
  { id: 'diamond', name: 'Diamond', color: '#B9F2FF', priceMultiplier: 3.0 },
  { id: 'ruby', name: 'Ruby', color: '#E0115F', priceMultiplier: 2.0 },
  { id: 'sapphire', name: 'Sapphire', color: '#0F52BA', priceMultiplier: 2.2 },
  { id: 'emerald', name: 'Emerald', color: '#50C878', priceMultiplier: 2.5 },
  { id: 'amethyst', name: 'Amethyst', color: '#9966CC', priceMultiplier: 1.5 },
];

export const JEWELRY_TYPES = [
  { id: 'ring', name: 'Ring', icon: '💍' },
  { id: 'necklace', name: 'Necklace', icon: '📿' },
  { id: 'bracelet', name: 'Bracelet', icon: '⌚' },
  { id: 'earring', name: 'Earring', icon: '👂' },
  { id: 'pendant', name: 'Pendant', icon: '💎' },
];

export const FINISHES = [
  { id: 'polished', name: 'Polished', description: 'High shine finish' },
  { id: 'matte', name: 'Matte', description: 'Subtle, non-reflective finish' },
  { id: 'brushed', name: 'Brushed', description: 'Textured, contemporary look' },
];

export const SIZES = {
  ring: [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
  bracelet: ['small', 'medium', 'large', 'x-large'],
  necklace: [14, 16, 18, 20, 22, 24],
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
};

