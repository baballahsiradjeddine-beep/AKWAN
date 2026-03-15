import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, VideoReview } from '../store/useStore';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Share2, ChevronRight, Check, Sparkles, MessageCircle, ShoppingBag, Play } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function VideoReviewItem({ review }: { review: VideoReview }) {
  const [playing, setPlaying] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      {/* Description */}
      {review.description && (
        <div className="bg-slate-50 p-2.5 rounded-3xl border border-slate-100 shadow-sm text-center">
          <span className="text-brand-primary font-black text-2xl block mb-0 text-right">"</span>
          <p className="text-slate-700 font-bold leading-[24px] text-[22px] mt-[-12px]">
            {review.description}
          </p>
        </div>
      )}
      
      <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-xl group bg-slate-100">
        {!playing ? (
          <>
            <img src={review.thumbnailUrl} alt={review.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <button 
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all"
            >
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-brand-secondary fill-brand-secondary ml-1" />
              </div>
            </button>
          </>
        ) : (
          <video src={review.videoUrl} className="w-full h-full object-cover" controls autoPlay />
        )}
        
        {/* Darker gradient shadow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
          <div className="flex items-center justify-start gap-3">
            <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" referrerPolicy="no-referrer" />
            <span className="font-bold text-lg">{review.name}</span>
          </div>
          <div className="flex gap-1 mt-2 text-brand-accent">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-brand-accent" />)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);
  const settings = useStore((state) => state.settings);
  
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

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <h2 className="text-3xl md:text-4xl font-black text-brand-secondary mb-6">{t('product_not_found')}</h2>
        <Link 
          to="/shop" 
          className="px-8 py-4 bg-brand-primary text-white rounded-full font-black hover:bg-brand-secondary transition-colors shadow-lg border-4 border-transparent hover:border-brand-accent/50"
        >
          {t('back_to_shop')}
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

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t('link_copied'));
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleOrderNow = () => {
    if (product) {
      const isInCart = useStore.getState().cart.some(item => item.id === product.id);
      if (!isInCart) {
        for (let i = 0; i < quantity; i++) {
          addToCart(product);
        }
      }
      navigate('/cart');
    }
  };

  const handleWhatsAppContact = () => {
    if (!product) return;
    const message = `${t('whatsapp_inquiry_prefix')} ${product.name}\n${t('link')}: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    const phone = settings.contactPhone.replace(/\s+/g, '');
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
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
        <nav className="flex items-center space-x-2 space-x-reverse text-xs md:text-sm font-bold text-brand-muted mb-6 md:mb-8 bg-white/50 backdrop-blur-sm w-fit px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 border-white shadow-sm">
          <Link to="/" className="hover:text-brand-primary transition-colors flex items-center">
            {t('home')}
          </Link>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          <Link to="/shop" className="hover:text-brand-primary transition-colors">{t('shop')}</Link>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
          <span className="text-brand-secondary">{product.name}</span>
        </nav>

          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-4 md:p-10 shadow-[0_20px_50px_rgba(92,67,106,0.08)] border-4 md:border-8 border-brand-bg flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-24 relative overflow-hidden">
          
          {/* Decorative corner */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Product Image & Desktop Social Buttons */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
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

            {/* Desktop Social Buttons - Hidden on Mobile */}
            <div className="hidden lg:flex flex-col gap-4 border-t-4 border-brand-bg border-dashed pt-8">
              <div className="flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsAppContact}
                  className="flex-1 flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-all"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>{t('whatsapp')}</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-3 bg-[#f5ae0b] text-white px-6 py-4 rounded-2xl font-black text-lg shadow-[0_10px_25px_rgba(245,174,11,0.2)] hover:bg-[#e09e0a] transition-all"
                >
                  <Share2 className="w-6 h-6" />
                  <span>{t('share')}</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            >
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="flex items-center bg-brand-surface px-5 py-2 rounded-full border-2 border-brand-bg shadow-sm">
                  <Star className="w-5 h-5 fill-brand-accent text-brand-accent ml-2" />
                  <span className="text-base font-black text-brand-secondary">{product.rating}</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-5xl font-black text-brand-secondary mb-4 md:mb-6 leading-tight relative inline-block text-center lg:text-right w-full">
                {product.name}
                <Sparkles className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-6 h-6 md:w-8 md:h-8 text-brand-accent animate-pulse-soft opacity-70" />
              </h1>

              <div className="text-2xl md:text-3xl font-black text-brand-secondary mb-6 md:mb-8 flex items-center justify-center gap-2 bg-brand-surface w-full px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border-2 md:border-4 border-brand-bg shadow-sm">
                {product.price.toFixed(2)} <span className="text-base md:text-lg font-bold text-brand-muted">{t('sar')}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mb-8 items-center lg:items-start">
                <div className="flex flex-col gap-4 w-full">
                  {/* Add to Cart and Quantity */}
                  <div className="flex items-center gap-4 w-full">
                    {/* Quantity */}
                    <div className="flex items-center justify-between bg-brand-surface rounded-2xl px-3 py-1.5 border-4 border-brand-bg w-32 shadow-inner">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-brand-secondary font-black text-lg hover:text-brand-primary transition-all"
                      >
                        -
                      </button>
                      <span className="font-black text-xl text-brand-secondary">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-brand-secondary font-black text-lg hover:text-brand-primary transition-all"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToCart}
                      disabled={product.soldOut}
                      className={`flex-1 h-14 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 border-2 md:border-4 transition-all font-black text-sm md:text-base ${
                        added 
                          ? 'bg-green-500 border-green-400 text-white' 
                          : 'bg-brand-surface border-brand-bg text-brand-primary hover:border-brand-primary/30'
                      }`}
                    >
                      {added ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />}
                      <span>{added ? t('added_to_cart') : t('add_to_cart')}</span>
                    </motion.button>
                  </div>

                {/* Order Now Button */}
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrderNow}
                  disabled={product.soldOut}
                  className={`w-full py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center space-x-2 md:space-x-3 space-x-reverse shadow-[0_10px_20px_rgba(141,105,159,0.2)] border-2 md:border-4 border-transparent transition-all ${
                    product.soldOut 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300 shadow-none' 
                      : 'bg-brand-secondary text-white hover:bg-brand-primary'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                  <span>{product.soldOut ? t('out_of_stock') : t('order_now')}</span>
                </motion.button>
              </div>
            </div>

              {/* Description - Now below buttons */}
              <div className="bg-brand-surface/50 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-brand-bg mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-black text-brand-secondary mb-2 md:mb-3">{t('product_description')}</h3>
                <p className="text-base md:text-lg text-brand-secondary/80 font-bold leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Mobile Social Buttons - Hidden on Desktop */}
              <div className="lg:hidden flex flex-col sm:flex-row items-center gap-3 border-t-2 md:border-t-4 border-brand-bg border-dashed pt-6 md:pt-8">
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center gap-3 bg-green-500 text-white px-6 py-3.5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-[0_10px_25px_rgba(34,197,94,0.3)] hover:bg-green-600 transition-all"
                >
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
                  <span>{t('contact_whatsapp')}</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 bg-[#f5ae0b] text-white px-6 py-3.5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-[0_10px_25px_rgba(245,174,11,0.2)] hover:bg-[#e09e0a] transition-all"
                >
                  <Share2 className="w-6 h-6 md:w-7 md:h-7" />
                  <span>{t('share_product')}</span>
                </motion.button>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Video Reviews Section - Moved out of the main container */}
        {product.video_reviews && product.video_reviews.length > 0 && (
          <section className="mt-12 md:mt-16 py-10 md:py-16 bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(92,67,106,0.08)] border-4 md:border-8 border-brand-bg">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-black text-brand-secondary mb-3 md:mb-4 flex items-center justify-center gap-2">
                {t('product_reviews')} 🎥
              </h2>
              <p className="text-brand-muted font-bold text-base md:text-lg">{t('product_reviews_desc')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {product.video_reviews.map((review, index) => (
                <VideoReviewItem key={index} review={review} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* View All Games Button */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pb-20 text-center relative z-10"
      >
        <Link to="/shop">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center space-x-2 space-x-reverse px-8 py-4 md:px-12 md:py-6 text-lg md:text-2xl font-black text-brand-secondary bg-brand-bg border-[4px] md:border-[6px] border-white shadow-lg rounded-full cursor-pointer mt-[20px] md:mt-[30px]"
          >
            <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
            <span>{t('view_all_games')}</span>
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
  );
}
