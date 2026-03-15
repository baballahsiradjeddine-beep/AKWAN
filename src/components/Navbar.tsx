import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cart = useStore((state) => state.cart);
  const settings = useStore((state) => state.settings);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المتجر', path: '/shop' },
    { name: 'من نحن', path: '/about' },
  ];

  return (
    <>
      <header className="relative z-50 bg-white border-b border-gray-100 shadow-sm">
        {/* Top Announcement Bar */}
        {settings.announcementText && (
          <div className="bg-brand-primary text-white px-4 py-2 text-center text-xs md:text-sm font-bold tracking-wide shadow-sm">
            <span className="inline-flex items-center justify-center gap-2 md:gap-4">
              <span className="animate-pulse">✨</span>
              {settings.announcementText}
              <span className="animate-pulse">✨</span>
            </span>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 p-2 rounded-full transition-all"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center ml-4 md:ml-16">
              {settings.logoType === 'image' && settings.logoImage ? (
                <img src={settings.logoImage} alt={settings.siteName} className="h-8 md:h-12 w-auto object-contain" />
              ) : (
                <span className="text-2xl md:text-3xl font-black text-brand-primary tracking-tight">
                  {settings.siteName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-x-16 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className="relative text-gray-600 hover:text-brand-primary font-bold transition-colors group py-2 px-6 whitespace-nowrap text-lg"
                >
                  {link.name}
                  <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              ))}
            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden 2xl:flex flex-1 max-w-xs mx-12">
              <div className="relative w-full group">
                <input 
                  type="text" 
                  placeholder="ابحث عن ألعاب، قصص، والمزيد..." 
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-2xl py-2.5 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white transition-all duration-300 shadow-sm group-hover:border-gray-300"
                />
                <Search className="absolute right-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                <button className="absolute left-2 top-1.5 bottom-1.5 bg-brand-primary text-white px-4 rounded-xl text-sm font-medium hover:bg-brand-secondary transition-colors shadow-sm">
                  بحث
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-x-6">
              <button className="text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all lg:hidden p-2.5 rounded-full">
                <Search className="h-5 w-5" />
              </button>
              <Link to="/cart" className="relative text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 transition-all p-2.5 rounded-full flex items-center gap-2">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-brand-secondary bg-brand-accent rounded-full border-2 border-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-semibold text-gray-700">السلة</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] lg:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[9999] transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl flex flex-col ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          <span className="text-xl font-black text-brand-primary tracking-tight">{settings.siteName}</span>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-brand-primary hover:bg-brand-primary/5 p-2 rounded-full transition-all"
          >
            <X className="h-7 w-7" />
          </button>
        </div>
        
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
              {/* Search Bar in Drawer */}
              <div className="mb-6">
                <div className="relative w-full group">
                  <input 
                    type="text" 
                    placeholder="ابحث عن ألعاب..." 
                    className="w-full bg-gray-50 border-2 border-brand-bg rounded-2xl py-2.5 px-4 pr-11 focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 text-sm transition-all font-bold text-brand-secondary shadow-inner"
                  />
                  <Search className="absolute right-4 top-3 h-4 w-4 text-brand-muted" />
                </div>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    onClick={() => setIsMenuOpen(false)} 
                    to={link.path} 
                    className="block px-4 py-3.5 text-base font-black text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary rounded-2xl transition-all border-2 border-transparent hover:border-brand-primary/10"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

        {/* Footer of Drawer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
          <p className="text-xs text-center text-brand-muted font-black">
            © {new Date().getFullYear()} {settings.siteName}
          </p>
        </div>
      </div>
    </>
  );
}
