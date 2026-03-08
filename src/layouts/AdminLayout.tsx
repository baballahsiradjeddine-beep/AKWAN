import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, X, Bell, ChevronDown, User, CreditCard, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

const sidebarLinks = [
  { name: 'لوحة التحكم', path: '/admin', icon: LayoutDashboard },
  { name: 'المنتجات', path: '/admin/products', icon: Package },
  { name: 'الطلبات', path: '/admin/orders', icon: ShoppingCart },
  { name: 'العملاء', path: '/admin/customers', icon: Users },
  { name: 'الإعدادات', path: '/admin/settings', icon: Settings },
];

const mockNotifications = [
  { id: 1, title: 'طلب جديد #1005', time: 'منذ 5 دقائق', type: 'order', read: false },
  { id: 2, title: 'نفدت كمية "طقم دلة خشبي"', time: 'منذ ساعة', type: 'stock', read: false },
  { id: 3, title: 'عميل جديد سجل في المتجر', time: 'منذ 3 ساعات', type: 'user', read: true },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900" dir="rtl">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 right-0 h-screen w-72 bg-brand-dark text-white z-50 flex flex-col transition-all duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full shadow-none'} shadow-[-10px_0_30px_rgba(0,0,0,0.1)]`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <Link to="/admin" className="text-3xl font-black text-brand-accent tracking-tighter flex items-center gap-3">
            <div className="bg-gradient-to-br from-white to-slate-200 text-brand-dark w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow-lg">أ</div>
            <span>أكوان</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-1.5 custom-scrollbar">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[2px] mb-4 mr-4">القائمة الرئيسية</p>
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center group px-5 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-primary text-white font-bold shadow-[0_8px_20px_rgba(141,105,159,0.3)] translate-x-[-4px]' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <Icon className={`w-5 h-5 ml-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-[15px]">{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_10px_#FFD166]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
          <Link to="/" className="flex items-center px-5 py-3.5 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white transition-all font-bold group">
            <LayoutDashboard className="w-5 h-5 ml-4 group-hover:rotate-12 transition-transform" />
            <span className="text-[14px]">العودة للمتجر</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-5 py-3.5 rounded-2xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 ml-4 group-hover:translate-x-1 transition-transform" />
            <span className="text-[14px]">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-6 sm:px-10 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-slate-400">مرحباً بك مجدداً،</h2>
              <p className="text-lg font-black text-slate-800">مدير النظام 👋</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 rounded-2xl transition-all relative group ${showNotifications ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full left-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-black text-slate-800">الإشعارات</h3>
                      <span className="text-[10px] font-black bg-brand-primary text-white px-2 py-0.5 rounded-full">3 جديدة</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 ${!notif.read ? 'bg-brand-primary/5' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${notif.type === 'order' ? 'bg-emerald-100 text-emerald-600' : notif.type === 'stock' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {notif.type === 'order' ? <ShoppingCart className="w-5 h-5" /> : notif.type === 'stock' ? <Package className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 mb-0.5">{notif.title}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{notif.time}</p>
                          </div>
                          {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 mr-auto"></div>}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/admin/orders'); // Assuming this is where notifications lead
                      }}
                      className="w-full p-4 text-sm font-bold text-brand-primary hover:bg-slate-50 transition-colors border-t border-slate-100"
                    >
                      عرض جميع الإشعارات
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl border border-slate-200 hover:border-brand-primary/30 hover:bg-slate-50 transition-all group"
              >
                <div className="hidden sm:block text-left ml-2">
                  <p className="text-xs font-black text-slate-800">مدير النظام</p>
                  <p className="text-[10px] font-bold text-slate-400">الوصول الكامل</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center font-black shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
                  م
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-black text-slate-800">أهلاً بك، مدير النظام</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">admin@akwan.com</p>
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#F8FAFC] custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
