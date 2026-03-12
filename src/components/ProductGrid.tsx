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
              whileHover={{ y: -12, scale: 1.02 }}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-4 border-brand-bg"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-brand-bg/20">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-white text-sm font-black bg-brand-primary/80 self-start px-3 py-1 rounded-full backdrop-blur-sm">
                    عرض التفاصيل
                  </span>
                </div>
                
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-brand-accent text-brand-secondary text-xs font-black px-4 py-1.5 rounded-full shadow-lg border-2 border-white transform rotate-3">
                    {product.badge}
                  </div>
                )}
              </Link>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-black text-brand-secondary line-clamp-2 flex-grow leading-tight">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-700">{product.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-black text-brand-primary">
                      {product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-brand-muted -mt-1">ر.س</span>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="p-4 rounded-2xl bg-brand-accent text-brand-secondary hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-md border-2 border-white"
                  >
                    <ShoppingCart className="w-6 h-6" />
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

          <Link 
            to="/shop" 
            className="inline-flex items-center justify-center px-8 py-4 md:px-12 md:py-6 text-xl md:text-2xl font-black text-brand-secondary bg-brand-bg border-[4px] md:border-[6px] border-white shadow-[0_15px_40px_rgba(92,67,106,0.15)] rounded-full hover:border-brand-primary/30 hover:text-brand-primary transition-all group"
          >
            عرض جميع الألعاب 
            <motion.span 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mr-2 md:mr-3 inline-block"
            >
              🎈
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
