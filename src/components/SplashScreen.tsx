import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-secondary text-white overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-brand-primary rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/4 pointer-events-none"
          />
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.15 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-brand-accent rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none"
          />

          {/* Floating Icons */}
          <motion.div
            initial={{ y: 20, opacity: 0, rotate: -20 }}
            animate={{ y: [0, -15, 0], opacity: [0, 1, 0.8], rotate: [-20, 0, -20] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 text-brand-primary pointer-events-none"
          >
            <Star className="w-10 h-10 fill-current" />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0, rotate: 20 }}
            animate={{ y: [0, 20, 0], opacity: [0, 1, 0.8], rotate: [20, 45, 20] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-1/4 left-1/4 text-brand-accent pointer-events-none"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              className="mb-8 flex justify-center"
            >
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight drop-shadow-lg">
                أكوان
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-6"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                className="text-3xl md:text-5xl font-bold text-brand-primary leading-relaxed drop-shadow-md"
              >
                مرحباً بك في عالم الطفل
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto"
              >
                عالمٌ يحتضن جذورنا العربية.. ويبث البهجة في قلوب أطفالنا ✨
              </motion.p>
            </motion.div>
          </div>

          {/* Loading Progress Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-brand-primary to-brand-accent origin-left w-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
