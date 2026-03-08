import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-secondary selection:bg-brand-accent selection:text-brand-secondary flex flex-col">
      <Navbar />
      <main className={`flex-grow ${isHome ? 'pt-0' : 'pt-24'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
