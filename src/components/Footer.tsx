import { Instagram, Twitter, Facebook, Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Footer() {
  const settings = useStore((state) => state.settings);

  return (
    <footer className="bg-brand-secondary text-white pt-20 pb-10 mt-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start">
            <Link to="/" className="text-4xl font-black text-brand-accent tracking-tight mb-6 inline-block">
              {settings.siteName}
            </Link>
            <p className="text-gray-300 mb-8 text-sm leading-loose">
              {settings.footerDescription}
            </p>
            <div className="flex space-x-3 space-x-reverse">
              <a href={settings.socialLinks.instagram} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-brand-secondary transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={settings.socialLinks.twitter} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-brand-secondary transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={settings.socialLinks.facebook} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-brand-accent hover:text-brand-secondary transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-6 text-white relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-brand-accent rounded-full"></span>
            </h4>
            <ul className="space-y-5 text-sm text-gray-300 w-full">
              <li><Link to="/" className="flex items-center hover:text-brand-accent transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary ml-2 group-hover:bg-brand-accent transition-colors"></span>الرئيسية</Link></li>
              <li><Link to="/shop" className="flex items-center hover:text-brand-accent transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary ml-2 group-hover:bg-brand-accent transition-colors"></span>المتجر</Link></li>
              <li><Link to="/about" className="flex items-center hover:text-brand-accent transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary ml-2 group-hover:bg-brand-accent transition-colors"></span>من نحن</Link></li>
              <li><Link to="/cart" className="flex items-center hover:text-brand-accent transition-colors group"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary ml-2 group-hover:bg-brand-accent transition-colors"></span>سلة المشتريات</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-6 text-white relative inline-block">
              تواصل معنا
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-brand-accent rounded-full"></span>
            </h4>
            <ul className="space-y-6 text-sm text-gray-300">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 ml-3 text-brand-accent shrink-0" />
                <span>{settings.contactAddress}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 ml-3 text-brand-accent shrink-0" />
                <span dir="ltr">{settings.contactPhone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 ml-3 text-brand-accent shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-bold mb-6 text-white relative inline-block">
              النشرة البريدية
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-brand-accent rounded-full"></span>
            </h4>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              اشترك في نشرتنا البريدية للحصول على أحدث العروض والمنتجات الجديدة.
            </p>
            <form className="w-full relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="البريد الإلكتروني..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-sm"
                required
              />
              <button 
                type="submit"
                className="absolute left-1.5 top-1.5 bottom-1.5 w-10 bg-brand-accent text-brand-secondary rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                aria-label="اشتراك"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-400">
          <p className="flex items-center">
            صُنع بحب <Heart className="w-4 h-4 mx-1.5 text-brand-accent" fill="currentColor" /> © {new Date().getFullYear()} {settings.siteName}. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <span className="bg-white/5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wider">س.ت: {settings.commercialRegister}</span>
            <span className="bg-white/5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wider">الرقم الضريبي: {settings.taxNumber}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
