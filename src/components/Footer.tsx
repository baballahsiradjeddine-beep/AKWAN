import { Instagram, Facebook, Heart, Mail, Phone, MapPin, Send, Ghost } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

// Simple TikTok icon as it's not in standard lucide
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const settings = useStore((state) => state.settings);

  return (
    <footer className="bg-brand-secondary text-white pt-20 pb-10 mt-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <Link to="/" className="text-4xl font-black text-brand-accent tracking-tight mb-6 inline-block">
              {settings.siteName}
            </Link>
            <p className="text-gray-300 mb-8 text-sm leading-loose max-w-sm">
              {settings.footerDescription}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 space-x-reverse">
              <a 
                href={settings.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-brand-secondary transition-all duration-300 hover:scale-110" 
                title="انستغرام"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={settings.socialLinks.snapchat} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-brand-secondary transition-all duration-300 hover:scale-110" 
                title="سناب شات"
              >
                <Ghost className="w-5 h-5" />
              </a>
              <a 
                href={settings.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-brand-secondary transition-all duration-300 hover:scale-110" 
                title="تيك توك"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a 
                href={settings.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-brand-secondary transition-all duration-300 hover:scale-110" 
                title="فيسبوك"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <h4 className="text-xl font-bold mb-6 text-white relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-2 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 w-1/2 h-1 bg-brand-accent rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-base text-gray-300 w-full">
              <li><Link to="/" className="flex items-center justify-center md:justify-start hover:text-brand-accent transition-all duration-300 hover:translate-x-[-4px] md:hover:translate-x-1 group"><span className="w-2 h-2 rounded-full bg-brand-primary ml-3 group-hover:bg-brand-accent transition-colors"></span>الرئيسية</Link></li>
              <li><Link to="/shop" className="flex items-center justify-center md:justify-start hover:text-brand-accent transition-all duration-300 hover:translate-x-[-4px] md:hover:translate-x-1 group"><span className="w-2 h-2 rounded-full bg-brand-primary ml-3 group-hover:bg-brand-accent transition-colors"></span>المتجر</Link></li>
              <li><Link to="/about" className="flex items-center justify-center md:justify-start hover:text-brand-accent transition-all duration-300 hover:translate-x-[-4px] md:hover:translate-x-1 group"><span className="w-2 h-2 rounded-full bg-brand-primary ml-3 group-hover:bg-brand-accent transition-colors"></span>من نحن</Link></li>
              <li><Link to="/cart" className="flex items-center justify-center md:justify-start hover:text-brand-accent transition-all duration-300 hover:translate-x-[-4px] md:hover:translate-x-1 group"><span className="w-2 h-2 rounded-full bg-brand-primary ml-3 group-hover:bg-brand-accent transition-colors"></span>سلة المشتريات</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <h4 className="text-xl font-bold mb-6 text-white relative inline-block">
              تواصل معنا
              <span className="absolute -bottom-2 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 w-1/2 h-1 bg-brand-accent rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-base text-gray-300">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-0">
                <MapPin className="w-6 h-6 md:ml-3 text-brand-accent shrink-0" />
                <span>{settings.contactAddress}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
                <Phone className="w-6 h-6 md:ml-3 text-brand-accent shrink-0" />
                <span dir="ltr">{settings.contactPhone}</span>
              </li>
              <li className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
                <Mail className="w-6 h-6 md:ml-3 text-brand-accent shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <h4 className="text-xl font-bold mb-6 text-white relative inline-block">
              النشرة البريدية
              <span className="absolute -bottom-2 right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 w-1/2 h-1 bg-brand-accent rounded-full"></span>
            </h4>
            <p className="text-gray-300 mb-6 text-base leading-relaxed max-w-xs">
              اشترك في نشرتنا البريدية للحصول على أحدث العروض والمنتجات الجديدة.
            </p>
            <form className="w-full relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="البريد الإلكتروني..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300 hover:bg-white/10 text-sm"
                required
              />
              <button 
                type="submit"
                className="absolute left-1.5 top-1.5 bottom-1.5 w-10 bg-brand-accent text-brand-secondary rounded-lg flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-105"
                aria-label="اشتراك"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-sm text-gray-400">
          <p className="flex items-center">
            صُنع بحب <Heart className="w-4 h-4 mx-1.5 text-brand-accent" fill="currentColor" /> © {new Date().getFullYear()} {settings.siteName}. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <span className="bg-white/5 px-4 py-2 rounded-lg text-xs font-medium tracking-wider text-gray-300">س.ت: {settings.commercialRegister}</span>
            <span className="bg-white/5 px-4 py-2 rounded-lg text-xs font-medium tracking-wider text-gray-300">الرقم الضريبي: {settings.taxNumber}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
