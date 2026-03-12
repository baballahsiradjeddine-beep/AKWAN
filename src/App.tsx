import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import About from './pages/About';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import { useStore } from './store/useStore';

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    // Don't show on admin pages
    const isAdminPage = window.location.pathname.startsWith('/admin');
    if (isAdminPage) return false;
    
    // Don't show if already shown in this session
    const hasShownSplash = sessionStorage.getItem('hasShownSplash');
    return !hasShownSplash;
  });

  const fetchSettings = useStore(state => state.fetchSettings);
  const fetchProducts = useStore(state => state.fetchProducts);
  const fetchOrders = useStore(state => state.fetchOrders);
  const fetchCustomers = useStore(state => state.fetchCustomers);

  useEffect(() => {
    fetchSettings();
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, [fetchSettings, fetchProducts, fetchOrders, fetchCustomers]);

  // Update favicon dynamically
  const settings = useStore(state => state.settings);
  useEffect(() => {
    if (settings.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.favicon;
    }
    
    if (settings.siteName) {
      document.title = settings.siteName;
    }
  }, [settings.favicon, settings.siteName]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasShownSplash', 'true');
  };

  return (
    <>
      <Toaster position="top-center" />
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
