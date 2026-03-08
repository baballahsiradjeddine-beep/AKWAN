import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans text-brand-secondary selection:bg-brand-accent selection:text-brand-secondary flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
