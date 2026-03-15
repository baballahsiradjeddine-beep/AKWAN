import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartPopup from '../components/CartPopup';
import { useTranslation } from 'react-i18next';

export default function PublicLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const isHome = location.pathname === '/';
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-brand-bg font-sans text-brand-secondary selection:bg-brand-accent selection:text-brand-secondary flex flex-col ${isRTL ? '' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className={`flex-grow ${isHome ? 'pt-0' : 'pt-0'} bg-brand-surface`}>
        <Outlet />
      </main>
      <Footer />
      <CartPopup />
    </div>
  );
}
