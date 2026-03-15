import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, ArrowLeft, Sparkles, Gift, User, Phone, MapPin, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export default function Cart() {
  const { t } = useTranslation();
  const cartItems = useStore((state) => state.cart);
  const settings = useStore((state) => state.settings);
  const updateQuantity = useStore((state) => state.updateCartQuantity);
  const removeItem = useStore((state) => state.removeFromCart);
  const createOrder = useStore((state) => state.createOrder);
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Shipping calculation logic
  const getShippingFee = () => {
    if (subtotal === 0) return 0;
    if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) return 0;
    return settings.shippingFee || 0;
  };

  const shipping = getShippingFee();
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setIsSubmitting(true);
    try {
      await createOrder({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        items: cartItems,
        total_amount: total
      });
      setOrderSuccess(true);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(t('checkout_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-brand-surface py-20 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-12 text-center shadow-2xl border-8 border-brand-bg max-w-2xl w-full"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-4xl font-black text-brand-secondary mb-4">{t('order_success_title')}</h2>
          <p className="text-xl text-brand-muted mb-10">{t('order_success_desc')}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-10 py-4 bg-brand-primary text-white rounded-full font-black text-xl shadow-lg hover:bg-brand-secondary transition-all"
          >
            {t('back_to_home')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-surface py-12 md:py-20 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 -right-20 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 -left-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex items-center justify-center md:justify-start gap-3 mb-8 md:mb-12">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-lg border-2 md:border-4 border-brand-bg flex items-center justify-center transform -rotate-6"
          >
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-brand-primary" />
          </motion.div>
          <h1 className="text-2xl md:text-5xl font-black text-brand-secondary tracking-tight">
            {isCheckingOut ? t('checkout_title') : t('shopping_cart')}
            <Sparkles className="inline-block w-5 h-5 md:w-6 md:h-6 text-brand-accent ml-2 animate-pulse" />
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-[0_20px_50px_rgba(92,67,106,0.1)] border-8 border-brand-bg max-w-3xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>
            
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-32 h-32 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-white"
            >
              <ShoppingCart className="w-16 h-16 text-brand-muted/50" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-black text-brand-secondary mb-4">{t('empty_cart_title')}</h2>
            <p className="text-xl text-brand-muted font-bold mb-10">{t('empty_cart_desc')}</p>
            
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-black text-white bg-brand-primary rounded-full hover:bg-brand-secondary transition-all shadow-[0_10px_30px_rgba(141,105,159,0.4)] hover:shadow-[0_15px_40px_rgba(92,67,106,0.5)] hover:-translate-y-1 group border-4 border-transparent hover:border-brand-accent/50"
            >
              <Gift className="w-6 h-6 ml-3 group-hover:animate-bounce" />
              {t('browse_shop_now')}
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Main Content Area */}
            <div className="w-full lg:w-2/3 space-y-6">
              <AnimatePresence mode="wait">
                {!isCheckingOut ? (
                  <motion.div 
                    key="cart-items"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {cartItems.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        transition={{ type: "spring", bounce: 0.4, delay: index * 0.1 }}
                        className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-[0_10px_30px_rgba(92,67,106,0.05)] border-2 md:border-4 border-brand-bg flex flex-col sm:flex-row items-center gap-6 md:gap-10 hover:shadow-[0_15px_40px_rgba(141,105,159,0.15)] hover:border-brand-primary/20 transition-all group relative overflow-hidden"
                      >
                        {/* Decorative side accent */}
                        <div className="absolute top-0 right-0 w-1.5 md:w-2 h-full bg-brand-primary/10 group-hover:bg-brand-accent transition-colors"></div>

                        <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden bg-brand-surface shrink-0 shadow-inner border-2 md:border-4 border-white">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                        
                        <div className="flex-grow text-center sm:text-right flex flex-col justify-between h-full py-1">
                          <div>
                            <h3 className="text-lg sm:text-2xl font-black text-brand-secondary mb-1 leading-snug">
                              <Link to={`/product/${item.id}`} className="hover:text-brand-primary transition-colors">{item.name}</Link>
                            </h3>
                            <div className="text-brand-primary font-black text-lg md:text-xl mb-4 md:mb-6">
                              {item.price.toFixed(2)} <span className="text-xs md:text-sm font-bold text-brand-muted">{t('sar')}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center sm:justify-start gap-6 md:gap-8">
                            <div className="flex items-center bg-brand-surface rounded-xl md:rounded-2xl p-0.5 md:p-1 border-2 border-brand-bg shadow-inner">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg md:rounded-xl text-brand-secondary font-black hover:text-brand-primary hover:shadow-md transition-all"
                              >
                                -
                              </button>
                              <span className="w-10 md:w-12 text-center font-black text-lg md:text-xl text-brand-secondary">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg md:rounded-xl text-brand-secondary font-black hover:text-brand-primary hover:shadow-md transition-all"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 hover:text-white hover:bg-red-500 p-2 md:p-3 bg-red-50 rounded-xl md:rounded-2xl transition-all shadow-sm hover:shadow-md"
                              title={t('remove')}
                            >
                              <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="hidden sm:flex flex-col items-end justify-center pl-4 border-r-2 border-brand-bg border-dashed h-full">
                          <span className="text-sm font-bold text-brand-muted mb-1">{t('total_item')}</span>
                          <div className="text-2xl font-black text-brand-secondary">
                            {(item.price * item.quantity).toFixed(2)} <span className="text-sm font-bold text-brand-muted">{t('sar')}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="checkout-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(92,67,106,0.1)] border-8 border-brand-bg"
                  >
                    <button 
                      onClick={() => setIsCheckingOut(false)}
                      className="flex items-center text-brand-muted font-bold hover:text-brand-primary mb-8 transition-colors group"
                    >
                      <ArrowLeft className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      {t('back_to_cart')}
                    </button>

                    <h2 className="text-3xl font-black text-brand-secondary mb-8">{t('delivery_info')}</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-lg font-bold text-brand-secondary block">{t('full_name')}</label>
                        <div className="relative">
                          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted w-5 h-5" />
                          <input 
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-brand-surface border-4 border-brand-bg rounded-2xl py-4 pr-12 pl-4 focus:border-brand-primary outline-none transition-all font-bold text-brand-secondary"
                            placeholder={t('full_name_placeholder')}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-lg font-bold text-brand-secondary block">{t('phone_number')}</label>
                        <div className="relative">
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted w-5 h-5" />
                          <input 
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-brand-surface border-4 border-brand-bg rounded-2xl py-4 pr-12 pl-4 focus:border-brand-primary outline-none transition-all font-bold text-brand-secondary"
                            placeholder={t('phone_placeholder')}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-lg font-bold text-brand-secondary block">{t('delivery_address')}</label>
                        <div className="relative">
                          <MapPin className="absolute right-4 top-6 text-brand-muted w-5 h-5" />
                          <textarea 
                            required
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full bg-brand-surface border-4 border-brand-bg rounded-2xl py-4 pr-12 pl-4 focus:border-brand-primary outline-none transition-all font-bold text-brand-secondary resize-none"
                            placeholder={t('address_placeholder')}
                          />
                        </div>
                      </div>

                      <div className="bg-brand-surface p-6 rounded-2xl border-2 border-brand-bg">
                        <p className="text-brand-secondary font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                          {t('cod_only')}
                        </p>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-brand-primary text-white rounded-[2rem] font-black text-xl shadow-lg hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            {t('processing_order')}
                          </>
                        ) : (
                          <>
                            {t('confirm_order_now')}
                            <ArrowLeft className="w-6 h-6" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.3 }}
                className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(92,67,106,0.1)] border-4 md:border-8 border-brand-bg sticky top-28 relative overflow-hidden"
              >
                {/* Decorative background shape */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none"></div>

                <h3 className="text-xl md:text-3xl font-black text-brand-secondary mb-6 md:mb-8 flex items-center">
                  {t('order_summary')}
                  <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-brand-primary mr-2 md:mr-3"></span>
                </h3>
                
                <div className="space-y-4 md:space-y-5 mb-6 md:mb-8 text-brand-secondary font-bold text-base md:text-lg">
                  <div className="flex justify-between items-center p-3 md:p-4 bg-brand-surface rounded-xl md:rounded-2xl">
                    <span className="text-brand-muted">{t('subtotal')}</span>
                    <span className="font-black">{subtotal.toFixed(2)} {t('sar')}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 md:p-4 bg-brand-surface rounded-xl md:rounded-2xl">
                    <span className="text-brand-muted">{t('shipping_cost')}</span>
                    <span className="font-black">{shipping === 0 ? t('free') : `${shipping.toFixed(2)} ${t('sar')}`}</span>
                  </div>
                  
                  <div className="relative pt-4 md:pt-6 mt-4 md:mt-6">
                    <div className="absolute top-0 left-0 w-full border-t-2 md:border-t-4 border-brand-bg border-dashed"></div>
                    <div className="flex justify-between items-end text-xl md:text-3xl font-black">
                      <span>{t('total')}</span>
                      <span className="text-brand-primary">{total.toFixed(2)} {t('sar')}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-brand-muted mt-1 md:mt-2 text-left">{t('vat_included')}</p>
                  </div>
                </div>

                {!isCheckingOut && (
                  <motion.button 
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl flex items-center justify-center space-x-2 space-x-reverse shadow-[0_10px_30px_rgba(141,105,159,0.4)] border-2 md:border-4 border-transparent hover:border-brand-accent/50 bg-brand-primary text-white hover:bg-brand-secondary transition-all mb-4 md:mb-6 group"
                  >
                    <span>{t('secure_checkout')}</span>
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-2 transition-transform" />
                  </motion.button>
                )}
                
                <Link to="/shop" className="flex items-center justify-center text-brand-muted font-bold hover:text-brand-primary transition-colors group">
                  <span className="border-b-2 border-transparent group-hover:border-brand-primary">{t('continue_shopping')}</span>
                  <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
