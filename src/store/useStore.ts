import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  additionalImages?: string[];
  badge?: string;
  description: string;
  category: string;
  soldOut?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SiteSettings {
  // Global
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  commercialRegister: string;
  taxNumber: string;
  
  // Navbar
  announcementText: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  
  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  aboutImage1: string;
  aboutImage2: string;
  
  // Footer
  footerDescription: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

const defaultSettings: SiteSettings = {
  siteName: 'اسم متجرك',
  contactEmail: 'admin@example.com',
  contactPhone: '+966 50 000 0000',
  contactAddress: 'العنوان هنا',
  commercialRegister: '0000000000',
  taxNumber: '000000000000000',
  announcementText: 'أهلاً بك في متجرنا الجديد!',
  heroTitle: 'عنوان جذاب لمتجرك هنا',
  heroSubtitle: 'وصف قصير وجذاب لمتجرك ومنتجاتك هنا لجذب الزوار.',
  heroButtonText: 'تسوق الآن',
  heroImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
  aboutTitle: 'من نحن',
  aboutSubtitle: 'اكتب قصة متجرك ورؤيتك هنا.',
  aboutImage1: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
  aboutImage2: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
  footerDescription: 'وصف قصير للمتجر يظهر في أسفل الصفحة.',
  socialLinks: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
  }
};

interface StoreState {
  products: Product[];
  cart: CartItem[];
  settings: SiteSettings;
  isLoadingProducts: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isLoadingSettings: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  settings: defaultSettings,
  isLoadingSettings: true,
  isLoadingProducts: true,
  
  fetchProducts: async () => {
    try {
      set({ isLoadingProducts: true });
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        set({ isLoadingProducts: false });
        return;
      }

      if (data) {
        set({ products: data, isLoadingProducts: false });
      }
    } catch (error) {
      console.error('Error:', error);
      set({ isLoadingProducts: false });
    }
  },

  addProduct: async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set((state) => ({
          products: [data, ...state.products]
        }));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id, updatedProduct) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        set((state) => ({
          products: state.products.map(p => p.id === id ? data : p)
        }));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        products: state.products.filter(p => p.id !== id),
        cart: state.cart.filter(item => item.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
  
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.id === product.id);
    if (existingItem) {
      return {
        cart: state.cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),
  
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter(item => item.id !== id)
  })),
  
  updateCartQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),
  
  clearCart: () => set({ cart: [] }),
  
  fetchSettings: async () => {
    try {
      set({ isLoadingSettings: true });
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        set({ isLoadingSettings: false });
        return;
      }

      if (data) {
        // Parse socialLinks if it's stored as JSON string, otherwise use as is
        let parsedSocialLinks = defaultSettings.socialLinks;
        if (data.socialLinks) {
          parsedSocialLinks = typeof data.socialLinks === 'string' 
            ? JSON.parse(data.socialLinks) 
            : data.socialLinks;
        }

        const parsedSettings = {
          ...defaultSettings,
          ...data,
          socialLinks: parsedSocialLinks
        };
        set({ settings: parsedSettings, isLoadingSettings: false });
      } else {
        set({ isLoadingSettings: false });
      }
    } catch (error) {
      console.error('Error:', error);
      set({ isLoadingSettings: false });
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const currentSettings = get().settings;
      const updated = { ...currentSettings, ...newSettings };

      // Optimistic update
      set({ settings: updated });

      // Upsert to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...updated });

      if (error) {
        // Revert on error
        set({ settings: currentSettings });
        throw error;
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
}));
