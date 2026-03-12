import { Star, ShoppingCart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function ProductGrid() {
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);
  // Only show first 4 products on home page
  const displayProducts = products.slice(0, 4);

  return (
    <section id="products" className="py-16 md:py-24 bg-brand-surface relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 -left-20 w-64 h-64 md:w-96 md:h-96 bg-brand-accent/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-40 -right-20 w-80 h-80 md:w-[30rem] md:h-[30rem] bg-brand-primary/5 rounded-full blur-3xl"
        />
        
        {/* Floating background shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-5 md:right-10 w-8 h-8 md:w-12 md:h-12 border-4 border-brand-primary/10 rounded-xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 left-5 md:left-10 w-6 h-6 md:w-8 md:h-8 bg-brand-accent/20 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="inline-flex items-center justify-center space-x-2 space-x-reverse mb-4 md:mb-6 bg-brand-bg px-6 py-3 md:px-8 md:py-4 rounded-full border-4 border-white shadow-lg cursor-pointer"
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-secondary">أحدث إصداراتنا</h2>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
          </motion.div>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg md:text-xl font-bold px-4">
            اكتشف مجموعتنا المميزة من الألعاب التعليمية المصممة بعناية لتنمية مهارات طفلك اللغوية والإبداعية. 🧩
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {displayProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: index * 0.1 }}
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
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 text-center"
        >
          {/* Simplified Vision Text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-10 max-w-2xl mx-auto px-6"
          >
            <p className="text-lg md:text-xl font-bold text-[#8d699f] leading-relaxed">
              <span className="text-brand-accent/40 mx-2">•</span>
              نصمم ألعابًا تحتضن التجربة والإبداع وتغرس حب الثقافة واللغة العربية في القلوب الصغيرة.
              <span className="text-brand-accent/40 mx-2">•</span>
            </p>
          </motion.div>

          <Link to="/shop">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center space-x-2 space-x-reverse px-8 py-4 md:px-12 md:py-6 text-xl md:text-2xl font-black text-brand-secondary bg-brand-bg border-[6px] border-white shadow-lg rounded-full cursor-pointer"
            >
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
              <span>عرض جميع الألعاب</span>
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mr-2 md:mr-3 inline-block"
              >
                🎈
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
