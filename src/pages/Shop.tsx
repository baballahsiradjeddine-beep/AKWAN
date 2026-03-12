import { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Star, ShoppingCart, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Shop() {
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);
  
  const [filter, setFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['الكل', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'الكل' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-brand-surface py-12 md:py-20 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -right-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 -left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-10 w-16 h-16 border-4 border-brand-accent/20 rounded-2xl rotate-45"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-4 border-brand-bg text-3xl">
              🛍️
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-brand-secondary mb-6 tracking-tight"
          >
            متجر <span className="text-brand-primary relative inline-block">
              أكوان
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-accent opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 25 20 50 10 T 100 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </motion.h1>
          <p className="text-brand-muted text-lg md:text-xl font-bold max-w-2xl mx-auto">
            اكتشف عالمنا المليء بالألعاب التعليمية الممتعة التي تنمي مهارات طفلك وتطلق العنان لخياله ✨
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16 bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border-2 border-white shadow-sm">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-brand-muted" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن لعبة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir="rtl"
              className="w-full pl-4 pr-12 py-3 md:py-4 bg-white border-2 border-brand-bg rounded-full focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-brand-secondary placeholder:text-brand-muted/50 shadow-inner text-right"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-brand-primary text-white shadow-[0_4px_15px_rgba(141,105,159,0.4)] scale-105 border-2 border-brand-primary' 
                    : 'bg-white text-brand-secondary hover:bg-brand-bg border-2 border-white shadow-sm hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {filteredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden border-[6px] border-brand-bg shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-300 flex flex-col isolate"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50/50 z-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-white text-sm font-bold bg-white/20 backdrop-blur-md self-start px-4 py-1.5 rounded-full border border-white/30">
                    عرض التفاصيل
                  </span>
                </div>
                
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-brand-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md backdrop-blur-sm border border-white/20">
                    {product.badge}
                  </div>
                )}
              </Link>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 flex-grow leading-tight hover:text-brand-primary transition-colors">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1 bg-amber-50/50 px-2.5 py-1 rounded-md border border-amber-100/50">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-700">{product.rating}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{product.category}</span>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-brand-primary">
                      {product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-slate-400 -mt-1">ر.س</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="p-3.5 rounded-xl bg-brand-accent text-white hover:bg-brand-primary transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-[3rem] border-4 border-brand-bg shadow-sm mt-8"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-black text-brand-secondary mb-2">لم نجد ما تبحث عنه!</h3>
            <p className="text-lg font-bold text-brand-muted">حاول استخدام كلمات بحث مختلفة أو تصفح تصنيف آخر.</p>
            <button 
              onClick={() => { setFilter('الكل'); setSearchQuery(''); }}
              className="mt-8 px-8 py-3 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-colors shadow-lg"
            >
              عرض جميع الألعاب
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
