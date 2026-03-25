import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartPopup from '../components/CartPopup';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PublicLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const isHome = location.pathname === '/';
  const isRTL = i18n.language === 'ar';
  
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen bg-brand-bg font-sans text-brand-secondary selection:bg-brand-accent selection:text-brand-secondary flex flex-col ${isRTL ? '' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className={`flex-grow ${isHome ? 'pt-0' : 'pt-0'} bg-brand-surface`}>
        <Outlet />
      </main>
      <Footer />
      <CartPopup />
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 p-3 bg-brand-primary text-white rounded-full shadow-lg hover:bg-brand-secondary hover:scale-110 transition-all duration-300 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}
