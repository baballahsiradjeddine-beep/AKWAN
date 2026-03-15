import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function CartPopup() {
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
      >
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-brand-bg p-3 md:p-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 backdrop-blur-lg bg-white/90">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary relative">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-accent text-brand-secondary text-[9px] md:text-[10px] font-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {totalItems}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] md:text-xs font-bold text-brand-muted mb-0.5">لديك {totalItems} منتجات في السلة</p>
              <p className="text-base md:text-lg font-black text-brand-secondary">
                {totalPrice.toFixed(2)} <span className="text-[10px] md:text-xs font-bold opacity-60">ر.س</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={clearCart}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2.5 md:px-4 md:py-3 rounded-xl md:rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold text-xs md:text-sm"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>حذف الكل</span>
            </button>
            
            <Link
              to="/cart"
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-brand-primary text-white hover:bg-brand-secondary transition-all font-black text-xs md:text-sm shadow-lg shadow-brand-primary/20 group"
            >
              <span>إكمال الطلب</span>
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-[-4px] transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
