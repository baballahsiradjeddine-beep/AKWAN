import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, Share2, ChevronRight, Check, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

export default function ProductDetails() {
  const { id } = useParams();
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);
  
  const product = products.find(p => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product?.image || '');

  // Update selected image when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-surface relative overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-6"
        >
          🔍
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-black text-brand-secondary mb-6">المنتج غير موجود 😔</h2>
        <Link 
          to="/shop" 
          className="px-8 py-4 bg-brand-primary text-white rounded-full font-black hover:bg-brand-secondary transition-colors shadow-lg border-4 border-transparent hover:border-brand-accent/50"
        >
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      // Add the product multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface py-8 md:py-16 relative overflow-hidden">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm font-bold text-brand-muted mb-8 bg-white/50 backdrop-blur-sm w-fit px-4 py-2 rounded-full border-2 border-white shadow-sm">
          <Link to="/" className="hover:text-brand-primary transition-colors flex items-center">
            الرئيسية
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/shop" className="hover:text-brand-primary transition-colors">المتجر</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-brand-secondary">{product.name}</span>
        </nav>

        <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(92,67,106,0.08)] border-8 border-brand-bg flex flex-col lg:flex-row gap-16 lg:gap-24 relative overflow-hidden">
          
          {/* Decorative corner */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Product Image */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="relative aspect-square rounded-[2.5rem] overflow-hidden border-8 border-brand-surface shadow-inner bg-brand-bg/30 group"
            >
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {product.badge && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="absolute top-6 right-6 bg-brand-accent text-brand-secondary text-sm md:text-base font-black px-5 py-2.5 rounded-full shadow-lg transform rotate-3 border-4 border-white z-10"
                >
                  {product.badge}
                </motion.div>
              )}
            </motion.div>

            {/* Additional Images Gallery */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedImage === product.image ? 'border-brand-primary shadow-md scale-105' : 'border-transparent hover:border-brand-primary/50'
                  }`}
                >
                  <img src={product.image} alt="Main" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
                {product.additionalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-4 transition-all ${
                      selectedImage === img ? 'border-brand-primary shadow-md scale-105' : 'border-transparent hover:border-brand-primary/50'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            >
              <div className="flex items-center space-x-6 space-x-reverse mb-8">
                <div className="flex items-center bg-brand-surface px-6 py-3 rounded-full border-2 border-brand-bg shadow-sm">
                  <Star className="w-6 h-6 fill-brand-accent text-brand-accent ml-3" />
                  <span className="text-lg font-black text-brand-secondary">{product.rating}</span>
                </div>
                <span className="text-base font-bold text-brand-muted hover:text-brand-primary transition-colors cursor-pointer border-b-2 border-transparent hover:border-brand-primary pb-1">
                  {product.reviews} تقييم
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-secondary mb-6 leading-tight relative inline-block">
                {product.name}
                <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-brand-accent animate-pulse-soft opacity-70" />
              </h1>

              <div className="text-4xl font-black text-brand-primary mb-10 flex items-baseline gap-3 bg-brand-surface w-fit px-8 py-4 rounded-2xl border-4 border-brand-bg shadow-sm">
                {product.price.toFixed(2)} <span className="text-xl font-bold text-brand-muted">ر.س</span>
              </div>

              <p className="text-lg md:text-xl text-brand-secondary/80 font-bold mb-12 leading-relaxed max-w-2xl">
                {product.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-8 mb-12">
                {/* Quantity */}
              <div className="flex items-center justify-between bg-brand-surface rounded-2xl px-4 py-3 border-4 border-brand-bg w-full sm:w-48 shadow-inner">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-xl text-brand-secondary font-black text-2xl hover:text-brand-primary hover:shadow-md transition-all"
                >
                  -
                </button>
                <span className="font-black text-3xl text-brand-secondary">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-xl text-brand-secondary font-black text-2xl hover:text-brand-primary hover:shadow-md transition-all"
                >
                  +
                </button>
                </div>

                {/* Add to Cart */}
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={product.soldOut}
                  className={`flex-1 py-4 md:py-0 rounded-[1.5rem] font-black text-xl flex items-center justify-center space-x-3 space-x-reverse shadow-[0_10px_30px_rgba(141,105,159,0.3)] border-4 border-transparent transition-all ${
                    product.soldOut 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300 shadow-none' 
                      : added 
                        ? 'bg-green-500 text-white border-green-400 shadow-[0_10px_30px_rgba(34,197,94,0.4)]' 
                        : 'bg-brand-primary text-white hover:bg-brand-secondary hover:border-brand-accent/50'
                  }`}
                >
                  {added ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Check className="w-7 h-7" />
                      </motion.div>
                      <span>تمت الإضافة بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-7 h-7" />
                      <span>{product.soldOut ? 'نفدت الكمية' : 'أضف للسلة'}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-12 border-t-4 border-brand-bg border-dashed pt-12">
                <button className="flex items-center gap-4 text-brand-muted hover:text-red-500 font-bold transition-colors group">
                  <div className="p-4 bg-brand-surface rounded-xl group-hover:bg-red-50 transition-colors">
                    <Heart className="w-7 h-7 group-hover:fill-red-500" />
                  </div>
                  <span className="text-xl">إضافة للمفضلة</span>
                </button>
                <button className="flex items-center gap-4 text-brand-muted hover:text-brand-primary font-bold transition-colors group">
                  <div className="p-4 bg-brand-surface rounded-xl group-hover:bg-brand-primary/10 transition-colors">
                    <Share2 className="w-7 h-7" />
                  </div>
                  <span className="text-xl">مشاركة</span>
                </button>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
