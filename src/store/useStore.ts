import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews?: number;
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

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  items_count: number;
  created_at: string;
  items?: any[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  created_at: string;
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
    snapchat: string;
    instagram: string;
    tiktok: string;
  };
  logoImage?: string;
  logoType: 'text' | 'image';
  favicon?: string;
  partners: string[];
}

const defaultSettings: SiteSettings = {
  siteName: 'أكوان',
  contactEmail: 'support@akwan.me',
  contactPhone: '+966 50 000 0000',
  contactAddress: 'المملكة العربية السعودية',
  commercialRegister: '0000000000',
  taxNumber: '000000000000000',
  announcementText: 'أهلاً بك في متجر أكوان الجديد! ✨',
  heroTitle: 'عالم من الخيال والمرح! 🎈',
  heroSubtitle: 'اكتشف مجموعتنا المميزة من الألعاب التعليمية المصممة بعناية لتنمية مهارات طفلك.',
  heroButtonText: 'تسوق الآن',
  heroImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
  aboutTitle: 'من نحن',
  aboutSubtitle: 'نحن في أكوان نؤمن بأن اللعب هو أفضل وسيلة للتعلم.',
  aboutImage1: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
  aboutImage2: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
  footerDescription: 'متجر أكوان للألعاب التعليمية والقصص الهادفة.',
  socialLinks: {
    facebook: '#',
    snapchat: '#',
    instagram: '#',
    tiktok: '#',
  },
  logoType: 'text',
  logoImage: '',
  favicon: '',
  partners: [
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&q=80',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&q=80',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&q=80',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&q=80',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&q=80',
  ]
};

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  customers: Customer[];
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
  isLoadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  isLoadingCustomers: boolean;
  fetchCustomers: () => Promise<void>;
  isLoadingSettings: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  createOrder: (orderData: {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    items: CartItem[];
    total_amount: number;
  }) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  orders: [],
  customers: [],
  settings: defaultSettings,
  isLoadingSettings: true,
  isLoadingProducts: true,
  isLoadingOrders: true,
  isLoadingCustomers: true,
  
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
  
  fetchOrders: async () => {
    try {
      set({ isLoadingOrders: true });
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data || [], isLoadingOrders: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ isLoadingOrders: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  fetchCustomers: async () => {
    try {
      set({ isLoadingCustomers: true });
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ customers: data || [], isLoadingCustomers: false });
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ isLoadingCustomers: false });
    }
  },
  
  fetchSettings: async () => {
    try {
      set({ isLoadingSettings: true });
      
      // First try to get record with ID 1
      let { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      // If not found by ID 1, just get the first record available
      if (!data) {
        const { data: firstData, error: firstError } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        data = firstData;
        error = firstError;
      }

      if (error) {
        console.error('Error fetching settings:', error);
        set({ isLoadingSettings: false });
        return;
      }

      if (data) {
        console.log('Settings fetched successfully:', data);
        
        // Parse socialLinks and partners if they're stored as JSON strings
        let parsedSocialLinks = defaultSettings.socialLinks;
        if (data.socialLinks) {
          try {
            parsedSocialLinks = typeof data.socialLinks === 'string' 
              ? JSON.parse(data.socialLinks) 
              : data.socialLinks;
          } catch (e) {
            console.error('Error parsing socialLinks:', e);
          }
        }

        let parsedPartners = defaultSettings.partners;
        if (data.partners) {
          try {
            parsedPartners = typeof data.partners === 'string'
              ? JSON.parse(data.partners)
              : data.partners;
          } catch (e) {
            console.error('Error parsing partners:', e);
          }
        }

        const parsedSettings = {
          ...defaultSettings,
          ...data,
          socialLinks: parsedSocialLinks,
          partners: parsedPartners
        };
        set({ settings: parsedSettings, isLoadingSettings: false });
      } else {
        console.log('No settings records found in database');
        set({ isLoadingSettings: false });
      }
    } catch (error) {
      console.error('Unexpected error fetching settings:', error);
      set({ isLoadingSettings: false });
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const currentSettings = get().settings;
      const updated = { ...currentSettings, ...newSettings };

      // Prepare data for Supabase
      const dataToSave = {
        ...updated,
        id: 1,
        // Stringify socialLinks and partners to ensure it can be stored in both text and jsonb columns
        socialLinks: JSON.stringify(updated.socialLinks),
        partners: JSON.stringify(updated.partners)
      };

      // Upsert to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert(dataToSave, { onConflict: 'id' });

      if (error) {
        console.error('Supabase error updating settings:', error);
        throw error;
      }

      // Update local state only after successful DB update or keep optimistic
      set({ settings: updated });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      // 1. Create or update customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', orderData.customer_phone)
        .single();

      let customerId;

      if (customerError && customerError.code === 'PGRST116') {
        // Customer doesn't exist, create new
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert([{
            name: orderData.customer_name,
            phone: orderData.customer_phone,
            total_orders: 1,
            total_spent: orderData.total_amount,
            last_order_date: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        customerId = newCustomer.id;
      } else if (customerData) {
        // Update existing customer
        const { error: updateError } = await supabase
          .from('customers')
          .update({
            total_orders: customerData.total_orders + 1,
            total_spent: customerData.total_spent + orderData.total_amount,
            last_order_date: new Date().toISOString()
          })
          .eq('id', customerData.id);
        
        if (updateError) throw updateError;
        customerId = customerData.id;
      }

      // 2. Create the order
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_address: orderData.customer_address,
          total_amount: orderData.total_amount,
          status: 'pending',
          items_count: orderData.items.reduce((sum, item) => sum + item.quantity, 0)
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create order items (if you have an order_items table)
      // For now, we'll just store the count in the order table as per the schema
      // But we could add a JSON column or a separate table if needed.

      // Update local state
      set((state) => ({
        orders: [newOrder, ...state.orders],
        cart: [] // Clear cart after successful order
      }));

    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}));
