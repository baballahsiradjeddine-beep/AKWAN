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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10">
          {displayProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.8, y: 50, rotate: index % 2 === 0 ? -2 : 2 }}
              whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring", 
                bounce: 0.5, 
                duration: 0.8, 
                delay: index * 0.1 
              }}
              whileHover={{ 
                y: -15, 
                scale: 1.03,
                rotate: index % 2 === 0 ? 1 : -1,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="group flex flex-col bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-4 border-brand-bg shadow-[0_10px_30px_rgba(92,67,106,0.05)] hover:shadow-[0_40px_60px_rgba(141,105,159,0.15)] hover:border-brand-primary/20 transition-all duration-500 relative"
            >
              {/* Decorative corner shape */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-accent/20 rounded-full blur-xl group-hover:bg-brand-accent/40 transition-colors duration-500 z-0"></div>

              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-bg/30 p-3 md:p-4 z-10">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <motion.div 
                    className="w-full h-full rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden relative shadow-inner"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                </Link>
                
                {product.badge && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 3 }}
                    transition={{ type: "spring", delay: 0.5 + (index * 0.1) }}
                    className="absolute top-6 right-6 md:top-8 md:right-8 bg-brand-accent text-brand-secondary text-xs md:text-sm font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg border-2 border-white pointer-events-none"
                  >
                    {product.badge}
                  </motion.div>
                )}
                {product.soldOut && (
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 bg-brand-secondary text-white text-xs md:text-sm font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg transform -rotate-3 border-2 border-white pointer-events-none">
                    نفدت الكمية
                  </div>
                )}
                
                {/* Quick Add Button (Hover) */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={product.soldOut}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className={`w-full py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-black text-base md:text-lg flex items-center justify-center space-x-2 space-x-reverse shadow-2xl border-2 border-white ${
                      product.soldOut 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300' 
                        : 'bg-brand-primary text-white hover:bg-brand-secondary'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                    <span>{product.soldOut ? 'نفدت الكمية' : 'أضف للسلة'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 md:p-8 flex flex-col flex-grow bg-white relative z-10">
                <div className="flex items-center space-x-2 space-x-reverse mb-4 bg-amber-50 w-fit px-4 py-1.5 rounded-full border border-amber-200 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-amber-700">{product.rating}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl xl:text-3xl font-black text-brand-secondary mb-4 line-clamp-2 flex-grow group-hover:text-brand-primary transition-colors leading-snug">
                  <Link to={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-brand-bg border-dashed">
                  <div className="bg-brand-surface px-4 py-2 rounded-2xl border-2 border-brand-bg shadow-sm">
                    <span className="text-3xl md:text-4xl font-black text-brand-primary flex items-baseline gap-1 drop-shadow-sm">
                      {product.price.toFixed(2)} 
                      <span className="text-sm md:text-lg font-bold text-brand-secondary/60">ر.س</span>
                    </span>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all font-bold text-sm"
                  >
                    التفاصيل
                  </Link>
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
