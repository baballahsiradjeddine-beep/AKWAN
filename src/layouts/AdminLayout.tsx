import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

const sidebarLinks = [
  { name: 'لوحة التحكم', path: '/admin', icon: LayoutDashboard },
  { name: 'المنتجات', path: '/admin/products', icon: Package },
  { name: 'الطلبات', path: '/admin/orders', icon: ShoppingCart },
  { name: 'العملاء', path: '/admin/customers', icon: Users },
  { name: 'الإعدادات', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // ProtectedRoute will automatically redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800" dir="rtl">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-brand-dark text-white z-50 flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/admin" className="text-2xl font-black text-brand-accent tracking-tight flex items-center gap-2">
            <span className="bg-white text-brand-dark w-8 h-8 rounded-lg flex items-center justify-center text-xl">أ</span>
            أكوان
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors font-medium">
            <LayoutDashboard className="w-5 h-5" />
            <span>العودة للمتجر</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 space-x-reverse border-r border-gray-200 pr-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
                م
              </div>
              <span className="font-bold text-sm hidden sm:block">مدير النظام</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-surface/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
