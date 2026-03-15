import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Partners() {
  const partners = useStore((state) => state.settings.partners);

  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-brand-surface relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-brand-accent/20 rounded-xl"
        />
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-10 w-6 h-6 md:w-10 md:h-10 bg-brand-primary/10 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="text-center mb-10 md:mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-flex items-center justify-center space-x-2 space-x-reverse mb-4 md:mb-6 bg-brand-bg px-4 py-2 md:px-8 md:py-4 rounded-full border-2 md:border-4 border-white shadow-lg cursor-pointer"
          >
            <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-secondary">شركاؤنا</h2>
            <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
          </motion.div>
          <p className="text-brand-muted max-w-2xl mx-auto text-base md:text-xl font-bold px-4">
            نفخر بالعمل مع نخبة من الشركاء والجهات التي تدعم رؤيتنا في تطوير مهارات الأطفال. ✨
          </p>
        </motion.div>

        <div className="relative mt-6 md:mt-10" dir="ltr">
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute inset-y-0 left-0 w-12 md:w-40 bg-gradient-to-r from-brand-surface to-transparent z-20 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-12 md:w-40 bg-gradient-to-l from-brand-surface to-transparent z-20 pointer-events-none"></div>

          <div className="flex overflow-hidden relative">
            <motion.div 
              animate={{ x: ['0%', '-50%'] }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex whitespace-nowrap gap-12 md:gap-40 items-center py-8 md:py-12 w-max"
            >
              {/* Duplicate the array multiple times to ensure it covers more than the screen width */}
              {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((logo, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0 bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-brand-primary/20 transition-all duration-300"
                >
                  <img 
                    src={logo} 
                    alt="Partner" 
                    className="h-16 md:h-36 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
