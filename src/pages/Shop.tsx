import { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Star, ShoppingCart, Sparkles, Heart, Search } from 'lucide-react';
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
              className="w-full pl-4 pr-12 py-3 md:py-4 bg-white border-2 border-brand-bg rounded-full focus:outline-none focus:border-brand-primary/50 focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-brand-secondary placeholder:text-brand-muted/50 shadow-inner"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12">
          {filteredProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: index * 0.05 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border-4 border-brand-bg shadow-[0_8px_20px_rgba(92,67,106,0.04)] hover:shadow-[0_20px_40px_rgba(141,105,159,0.15)] hover:border-brand-primary/20 transition-all duration-300 relative"
            >
              {/* Decorative corner */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl group-hover:bg-brand-accent/30 transition-colors duration-500 z-0"></div>

              <div className="relative aspect-square overflow-hidden bg-brand-bg/30 p-4 z-10">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <motion.div 
                    className="w-full h-full rounded-[1.5rem] overflow-hidden relative shadow-inner"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => { e.preventDefault(); /* Add to wishlist logic */ }}
                      className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-muted hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </motion.div>
                </Link>
                
                {product.badge && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 3 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="absolute top-6 right-6 bg-brand-accent text-brand-secondary text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white pointer-events-none"
                  >
                    {product.badge}
                  </motion.div>
                )}
                {product.soldOut && (
                  <div className="absolute top-6 right-6 bg-brand-secondary text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg transform -rotate-3 border-2 border-white pointer-events-none">
                    نفدت الكمية
                  </div>
                )}

                {/* Quick Add Button (Hover) */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                  <button 
                    disabled={product.soldOut}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center space-x-2 space-x-reverse shadow-xl border-2 border-white ${
                      product.soldOut 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300' 
                        : 'bg-brand-primary text-white hover:bg-brand-secondary'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{product.soldOut ? 'نفدت الكمية' : 'أضف للسلة'}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow bg-white relative z-10">
                <div className="flex items-center space-x-1 space-x-reverse mb-3 bg-brand-bg/80 w-fit px-3 py-1 rounded-full border border-brand-primary/10">
                  <Star className="w-3 h-3 fill-brand-accent text-brand-accent" />
                  <span className="text-xs font-black text-brand-secondary">{product.rating}</span>
                </div>
                
                <h3 className="text-lg font-black text-brand-secondary mb-2 line-clamp-2 flex-grow group-hover:text-brand-primary transition-colors leading-snug">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-brand-bg border-dashed">
                  <span className="text-xl font-black text-brand-primary flex items-baseline gap-1">
                    {product.price.toFixed(2)} <span className="text-xs font-bold text-brand-muted">ر.س</span>
                  </span>
                  
                  {/* Small decorative icon */}
                  <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
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
