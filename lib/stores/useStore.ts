// Global state management using Zustand

import { create } from 'zustand';
import { Design, CartItem, User, FilterOptions } from '@/lib/types';

interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  description: string | null;
  photographer: string;
  photographerUrl: string;
}

interface GeneratedImage {
  id: string;
  imageUrl: string;
  publicId?: string;
  revisedPrompt: string;
  type: string;
  material: string;
  gemstone: string;
  generatedAt: string;
}

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Designs
  designs: Design[];
  addDesign: (design: Design) => void;
  removeDesign: (id: string) => void;
  toggleFavorite: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (designId: string) => void;
  updateCartQuantity: (designId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Filters
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  
  // Gallery Images
  galleryImages: GalleryImage[];
  setGalleryImages: (images: GalleryImage[]) => void;
  addGalleryImage: (image: GalleryImage) => void;
  
  // Generated Images
  generatedImages: GeneratedImage[];
  addGeneratedImage: (image: GeneratedImage) => void;
  removeGeneratedImage: (id: string) => void;
  clearGeneratedImages: () => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Theme
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Designs
  designs: [],
  addDesign: (design) => set((state) => ({ 
    designs: [design, ...state.designs] 
  })),
  removeDesign: (id) => set((state) => ({ 
    designs: state.designs.filter(d => d.id !== id) 
  })),
  toggleFavorite: (id) => set((state) => ({
    designs: state.designs.map(d => 
      d.id === id ? { ...d, isFavorite: !d.isFavorite } : d
    )
  })),
  
  // Cart
  cart: [],
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(i => i.design.id === item.design.id);
    if (existing) {
      return {
        cart: state.cart.map(i => 
          i.design.id === item.design.id 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      };
    }
    return { cart: [...state.cart, item] };
  }),
  removeFromCart: (designId) => set((state) => ({
    cart: state.cart.filter(i => i.design.id !== designId)
  })),
  updateCartQuantity: (designId, quantity) => set((state) => ({
    cart: state.cart.map(i => 
      i.design.id === designId ? { ...i, quantity } : i
    )
  })),
  clearCart: () => set({ cart: [] }),
  
  // Filters
  filters: {},
  setFilters: (filters) => set({ filters }),
  
  // Gallery Images
  galleryImages: [],
  setGalleryImages: (galleryImages) => set({ galleryImages }),
  addGalleryImage: (image) => set((state) => ({
    galleryImages: [...state.galleryImages, image]
  })),
  
  // Generated Images
  generatedImages: [],
  addGeneratedImage: (image) => set((state) => ({
    generatedImages: [image, ...state.generatedImages]
  })),
  removeGeneratedImage: (id) => set((state) => ({
    generatedImages: state.generatedImages.filter(img => img.id !== id)
  })),
  clearGeneratedImages: () => set({ generatedImages: [] }),
  
  // Loading
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));

