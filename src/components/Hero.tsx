import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, Star, Moon, Cloud, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const rotate1 = useTransform(scrollY, [0, 500], [0, 45]);
  const settings = useStore((state) => state.settings);

  return (
    <div className="relative bg-brand-bg min-h-[100svh] lg:min-h-[90vh] flex items-start lg:items-center pt-20 pb-24 lg:pt-16 lg:pb-16 px-4 lg:px-8">
      {/* Decorative background elements - Playful Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-64 h-64 md:w-96 md:h-96 rounded-full bg-brand-primary/20 blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -left-24 w-48 h-48 md:w-72 md:h-72 rounded-full bg-brand-accent/20 blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2], x: [0, -30, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-1/4 w-56 h-56 md:w-80 md:h-80 rounded-full bg-[#A8DADC]/40 blur-3xl"
        />

        {/* Parallax Floating Icons - Hidden some on mobile to prevent clutter */}
        <motion.div style={{ y: y1 }} className="absolute top-32 right-10 md:right-1/4 opacity-60">
          <Star className="text-brand-accent w-8 h-8 md:w-10 md:h-10 animate-float" fill="currentColor" />
        </motion.div>
        
        <motion.div style={{ y: y2 }} className="absolute bottom-32 left-10 md:left-1/4 opacity-40">
          <Star className="text-brand-primary w-6 h-6 md:w-8 md:h-8 animate-float-reverse" fill="currentColor" />
        </motion.div>
        
        <motion.div style={{ y: y1, rotate: rotate1 }} className="absolute top-40 left-10 md:left-20 opacity-30 hidden sm:block">
          <Moon className="text-brand-primary w-10 h-10 md:w-12 md:h-12 animate-float" fill="currentColor" />
        </motion.div>
        
        <motion.div style={{ y: y2 }} className="absolute bottom-40 right-10 md:right-20 opacity-50">
          <Sparkles className="text-brand-accent w-10 h-10 md:w-14 md:h-14 animate-float-reverse" />
        </motion.div>

        <motion.div 
          animate={{ x: [-20, 20, -20], y: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-4 md:right-10 opacity-40 hidden sm:block"
        >
          <Cloud className="text-white w-16 h-16 md:w-24 md:h-24" fill="currentColor" />
        </motion.div>

        <motion.div 
          animate={{ x: [20, -20, 20], y: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 left-4 md:left-1/3 opacity-30"
        >
          <Cloud className="text-white w-20 h-20 md:w-32 md:h-32" fill="currentColor" />
        </motion.div>

        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-1/2 opacity-20"
        >
          <Sun className="text-brand-accent w-24 h-24 md:w-32 md:h-32" fill="currentColor" />
        </motion.div>
        
        {/* Abstract Shapes */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/3 right-1/4 md:right-1/3 w-12 h-12 md:w-16 md:h-16 border-4 md:border-8 border-brand-primary/20 rounded-full animate-pulse-soft" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 left-5 md:left-10 w-16 h-16 md:w-20 md:h-20 border-4 md:border-8 border-brand-accent/20 rounded-2xl md:rounded-3xl rotate-45 animate-float" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-right flex flex-col items-center lg:items-start mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.7, duration: 1.2 }}
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="inline-flex items-center space-x-2 space-x-reverse bg-white/80 backdrop-blur-sm px-4 py-2 md:px-5 md:py-2.5 rounded-full mb-6 md:mb-8 border-2 border-brand-accent/30 shadow-[0_4px_15px_rgba(255,209,102,0.3)] cursor-pointer"
            >
              <span className="flex h-3 w-3 md:h-4 md:w-4 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-brand-accent"></span>
              </span>
              <span className="text-sm md:text-base font-black text-brand-secondary">عالم من الخيال والمرح! 🪁</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-secondary leading-[1.6] md:leading-[1.5] mb-8 md:mb-10 drop-shadow-sm"
            >
              {settings.heroTitle.includes('جذوري العربية!') ? (
                <span dangerouslySetInnerHTML={{ 
                  __html: settings.heroTitle.replace('جذوري العربية!', '<span class="text-brand-primary relative inline-block group mt-4 md:mt-0">جذوري العربية!<svg class="absolute w-[110%] h-4 md:h-6 -bottom-3 md:-bottom-4 -right-[5%] text-brand-accent opacity-90 group-hover:animate-pulse-soft" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 25 20 50 10 T 100 10" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none" /></svg></span>') 
                }} />
              ) : (
                settings.heroTitle
              )}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-brand-secondary/80 mb-10 md:mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-bold px-4 lg:px-0"
            >
              {settings.heroSubtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 md:gap-10 w-full sm:w-auto px-4 sm:px-0"
            >
              <motion.a 
                whileHover={{ scale: 1.05, y: -5, rotate: -2 }}
                whileTap={{ scale: 0.95, rotate: 2 }}
                href="#products" 
                className="inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 text-lg md:text-xl font-black text-white bg-brand-primary rounded-[2rem] hover:bg-brand-secondary transition-colors shadow-[0_10px_30px_rgba(141,105,159,0.4)] w-full sm:w-auto relative overflow-hidden group border-4 border-transparent hover:border-brand-accent/50"
              >
                <span className="relative z-10 flex items-center">
                  {settings.heroButtonText}
                  <motion.span 
                    animate={{ y: [0, -8, 0], rotate: [0, 10, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mr-2 md:mr-3 text-xl md:text-2xl"
                  >
                    🚀
                  </motion.span>
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
              </motion.a>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
                whileTap={{ scale: 0.95, rotate: -2 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  to="/about" 
                  className="inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 text-lg md:text-xl font-black text-brand-secondary bg-white border-4 border-white shadow-lg rounded-[2rem] hover:border-brand-primary/30 hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  تعرف علينا 🎈
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Image - Cinematic & Playful */}
          <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0 px-4 sm:px-8 lg:px-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6, duration: 1.5, delay: 0.3 }}
              className="relative z-10 max-w-md md:max-w-lg mx-auto"
            >
              {/* Main Image Container */}
              <motion.div 
                whileHover={{ scale: 1.02, rotate: -2 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_20px_40px_rgba(92,67,106,0.2)] md:shadow-[0_30px_60px_rgba(92,67,106,0.25)] border-[8px] md:border-[12px] border-white bg-white aspect-square md:aspect-[4/3] lg:aspect-square"
              >
                <img 
                  src={settings.heroImage} 
                  alt="أطفال يلعبون بألعاب خشبية تعليمية" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Overlay gradient for cinematic feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/50 via-transparent to-transparent mix-blend-multiply"></div>
                
                {/* Inner decorative border */}
                <div className="absolute inset-3 md:inset-4 border-2 md:border-4 border-dashed border-white/40 rounded-[2rem] md:rounded-[3rem] pointer-events-none"></div>
              </motion.div>

              {/* Floating Elements around the image - Adjusted for mobile */}
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 5, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -top-6 -right-2 sm:-top-10 sm:-right-10 bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-xl sm:shadow-2xl border-2 sm:border-4 border-brand-accent flex items-center gap-2 sm:gap-4 z-20 cursor-pointer hover:scale-110 transition-transform scale-90 sm:scale-100 origin-top-right"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-accent rounded-full flex items-center justify-center text-xl sm:text-3xl shadow-inner animate-pulse-soft">
                  ✨
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-brand-muted font-black">تقييم العملاء</p>
                  <p className="text-base sm:text-xl font-black text-brand-secondary">4.9/5.0 ⭐</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0], x: [0, -5, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-2 sm:-bottom-12 sm:-left-12 bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-xl sm:shadow-2xl border-2 sm:border-4 border-brand-primary flex items-center gap-2 sm:gap-4 z-20 cursor-pointer hover:scale-110 transition-transform scale-90 sm:scale-100 origin-bottom-left"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-brand-primary rounded-full flex items-center justify-center text-xl sm:text-3xl shadow-inner text-white animate-pulse-soft">
                  🎨
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-brand-muted font-black">ألعاب تعليمية</p>
                  <p className="text-base sm:text-xl font-black text-brand-secondary">+50 منتج</p>
                </div>
              </motion.div>

              {/* Extra playful dots */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1/2 -right-8 sm:-right-16 w-6 h-6 sm:w-8 sm:h-8 bg-brand-accent rounded-full z-0"
              />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                className="absolute bottom-1/4 -right-6 sm:-right-12 w-4 h-4 sm:w-5 sm:h-5 bg-brand-primary rounded-full z-0"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
