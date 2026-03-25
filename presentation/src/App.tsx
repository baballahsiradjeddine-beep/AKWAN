import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Rocket, Sparkles, Globe, Smartphone, TrendingUp, Bot, Gift, Award, PackageX, Truck, CloudLightning, Unplug, Puzzle, Medal, DollarSign, Repeat, MousePointerClick } from 'lucide-react';
import confetti from 'canvas-confetti';

const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);
      osc.start(audioCtx.currentTime + startTime);
      osc.stop(audioCtx.currentTime + startTime + duration);
    };
    playNote(523.25, 0, 0.3); // C5
    playNote(659.25, 0.1, 0.3); // E5
    playNote(783.99, 0.2, 0.3); // G5
    playNote(1046.50, 0.3, 0.6); // C6
  } catch (e) {}
};

const playErrorSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);
      osc.start(audioCtx.currentTime + startTime);
      osc.stop(audioCtx.currentTime + startTime + duration);
    };
    playNote(150, 0, 0.4); 
    playNote(100, 0.2, 0.5); 
  } catch (e) {}
};

const playNavigationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    // A soft high-pass filter swoosh effect
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {}
};

// Stable random values for background elements to avoid flashes on re-render
const LIGHT_PARTICLES = [...Array(12)].map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 20 + 10,
  duration: 15 + Math.random() * 20,
  delay: Math.random() * 5
}));

const LIGHT_ORBS = [...Array(5)].map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 200 + 150,
  duration: 30 + Math.random() * 30
}));

// Reusable animated background (Rebuilt with pure CSS for absolute stability)
const BackgroundBlobs = ({ isDarkMode = false }: { isDarkMode?: boolean }) => {
  return (
    <div className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden transition-colors duration-[2000ms] ${isDarkMode ? 'bg-[#0a0914]' : 'bg-[#fdfbfb]'}`}>
      
      {/* Universal Grid Overlay */}
      <div 
        className={`absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_15%,transparent_100%)] transition-opacity duration-[2000ms] ${isDarkMode ? 'opacity-10' : 'opacity-20'}`}
      ></div>

      {/* Light Mode Layer */}
      <div className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${isDarkMode ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
        {/* Soft Circular Blobs (Dark Mode Style applied to Light Mode) */}
        <div className="absolute top-[10%] right-[10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] bg-brand-primary/10 rounded-full blur-[100px] mix-blend-multiply animate-float-wide"></div>
        <div className="absolute bottom-[10%] left-[15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-purple-400/15 rounded-full blur-[100px] mix-blend-multiply animate-spin-super-slow"></div>
        <div className="absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse-soft"></div>
        
        {/* CSS-Animated Particles */}
        {LIGHT_PARTICLES.map((p, i) => (
           <div
              key={`particle-${i}`}
              className="absolute bg-gradient-to-tr from-brand-primary/40 to-brand-accent/40 rounded-full blur-md shadow-lg"
              style={{
                 left: `${p.x}%`,
                 bottom: `${p.y}%`,
                 width: p.size,
                 height: p.size,
                 animation: `float-vertical ${p.duration}s ease-in-out infinite`,
                 animationDelay: `${p.delay}s`
              }}
           />
        ))}

        {/* Floating Outlined Orbs */}
        {LIGHT_ORBS.map((orb, i) => (
           <div
              key={`orb-${i}`}
              className="absolute border-2 border-brand-primary/20 rounded-[40px] md:rounded-[80px] shadow-[inset_0_0_20px_rgba(141,105,159,0.1)]"
              style={{
                 left: `${orb.x}%`,
                 top: `${orb.y}%`,
                 width: orb.size,
                 height: orb.size,
                 animation: `spin-reverse ${orb.duration}s linear infinite`,
                 opacity: 0.25
              }}
           />
        ))}
      </div>

      {/* Dark Mode Layer */}
      <div className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} pointer-events-none`}>
          <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-float-wide"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-spin-super-slow"></div>
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen animate-pulse-soft"></div>
      </div>

    </div>
  );
};

const FloatingElement = ({ children, delay = 0, yOffset = 20, duration = 4, className = "" }: any) => (
  <motion.div className={className} animate={{ y: [0, -yOffset, 0] }} transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
    {children}
  </motion.div>
);

const GlassCard = ({ children, delay = 0, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.7, delay, type: "spring", bounce: 0.4 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className={`bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(141,105,159,0.2)] rounded-[2.5rem] p-8 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

// Interactive Problem Slide Game
const InteractiveProblemSlide = () => {
  const [revealed, setRevealed] = useState(false);
  const [clickedWrong, setClickedWrong] = useState(false);

  const handleCorrect = () => {
    playSuccessSound();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8D699F', '#FDBA74', '#10B981', '#F43F5E']
    });
    setRevealed(true);
  };

  const handleWrong = () => {
    playErrorSound();
    setClickedWrong(true);
    setTimeout(() => setClickedWrong(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto h-full px-6 md:px-12">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div 
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 border-4 border-brand-primary/20"
            >
              <span className="text-5xl">🤔</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-6 leading-[1.5] tracking-tight">
              المنتجات الملموسة رائعة، لكنها <span className="text-red-500 underline decoration-red-300 decoration-wavy underline-offset-8 group-hover:text-red-600 transition-colors cursor-help" title="هذا يعني تحديات لوجستية لا تنتهي">مقيدة</span> جغرافياً ولوجستياً
            </h2>
            
            <p className="text-xl md:text-2xl text-brand-muted/90 font-bold mb-12">
              بصفتك مستثمر خبير، هل تتفق مع هذه المقولة؟
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCorrect}
                className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-6 rounded-3xl font-black text-xl md:text-2xl shadow-lg border-2 border-white/30 hover:shadow-emerald-500/30 transition-shadow"
              >
                صحيح 100% 👍
              </motion.button>

              <motion.button
                 animate={clickedWrong ? { x: [-10, 10, -10, 10, 0], backgroundColor: '#ef4444', color: '#fff' } : {}}
                 transition={{ duration: 0.4 }}
                 onClick={handleWrong}
                 className="flex-1 bg-white text-brand-dark p-6 rounded-3xl font-black text-xl md:text-2xl shadow-lg border-2 border-brand-dark/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                لا، أعتقد أنك تبالغ 🤔
              </motion.button>
            </div>
            {clickedWrong && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 font-bold mt-6 text-lg">
                حاول مرة أخرى! فكّر في تكاليف الشحن والطباعة...
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="answer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col items-center justify-center w-full"
          >
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-4 bg-emerald-100/90 backdrop-blur-md text-emerald-600 px-8 py-4 rounded-full font-black mb-8 border border-emerald-200/50 shadow-sm"
            >
              <span className="text-2xl">🎉</span>
              <span className="text-lg tracking-wide">أنت على حق! وإليك الأسباب الصادمة:</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full mt-4">
              <GlassCard delay={0.3} className="!border-red-100/50 hover:!border-red-200 group !bg-white/80">
                <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner">
                  <PackageX className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-5 text-brand-dark">تكاليف تصنيع متصاعدة</h3>
                <p className="text-brand-muted/90 font-bold text-lg leading-[1.8]">كل منتج جديد يتطلب وقتًا للطباعة، وتوفير المواد الخشبية والورقية بتكلفة متزايدة وتخزين مستمر لا ينتهي.</p>
              </GlassCard>
              
              <GlassCard delay={0.5} className="!border-red-100/50 hover:!border-red-200 group !bg-white/80">
                <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-inner">
                  <Truck className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-5 text-brand-dark">عقبة الشحن والحدود</h3>
                <p className="text-brand-muted/90 font-bold text-lg leading-[1.8]">الوصول لطفل مغترب في أوروبا أو أمريكا يتطلب تكاليف شحن واستيراد خيالية تقلص الأرباح وتبطئ الانتشار.</p>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Interactive Business Model Slide Game
const InteractiveBizModelSlide = () => {
  const [revealed, setRevealed] = useState(false);
  const [clickedWrong, setClickedWrong] = useState(false);

  const handleCorrect = () => {
    playSuccessSound();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#34D399', '#10B981', '#059669', '#FCD34D']
    });
    setRevealed(true);
  };

  const handleWrong = () => {
    playErrorSound();
    setClickedWrong(true);
    setTimeout(() => setClickedWrong(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto h-full px-4 md:px-12 py-4">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div 
            key="question2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center w-full"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 border-4 border-emerald-500/20"
            >
              <span className="text-5xl">💡</span>
            </motion.div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-6 leading-[1.5] tracking-tight">
              كيف نضمن <span className="text-emerald-500 underline decoration-emerald-300 decoration-wavy underline-offset-8 group-hover:text-emerald-600 transition-colors cursor-help" title="نموذج أعمال SaaS">استدامة الأرباح</span> على المدى الطويل؟
            </h2>
            
            <p className="text-xl md:text-2xl text-brand-muted/90 font-bold mb-12">
              برأيك، أي النموذجين يُعد المفرخ الحقيقي للثروات في عالم الشركات التقنية؟
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mx-auto">
              <motion.button
                 animate={clickedWrong ? { x: [-10, 10, -10, 10, 0], backgroundColor: '#ef4444', color: '#fff' } : {}}
                 transition={{ duration: 0.4 }}
                 onClick={handleWrong}
                 className="flex-1 bg-white text-brand-dark p-6 rounded-3xl font-black text-xl md:text-2xl shadow-lg border-2 border-brand-dark/10 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                البيع لمرة واحدة فقط 📦
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCorrect}
                className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-6 rounded-3xl font-black text-xl md:text-2xl shadow-lg border-2 border-white/30 hover:shadow-emerald-500/30 transition-shadow"
              >
                الاشتراكات المتكررة 🔄
              </motion.button>
            </div>
            {clickedWrong && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 font-bold mt-6 text-lg">
                هذا نموذج جيد، لكنه لا يضمن "الاستدامة" المتكررة وتضاعف قيمة العميل!
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="answer2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex flex-col items-center justify-center w-full"
          >
            <FloatingElement yOffset={15} duration={4} className="mb-4 md:mb-8 mx-auto">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-tr from-emerald-400 to-teal-300 text-white rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_rgba(16,185,129,0.3)] rotate-12 hover:rotate-0 transition-transform duration-500 cursor-default">
                <TrendingUp className="w-10 h-10 md:w-14 md:h-14 -rotate-12 hover:rotate-0 transition-transform duration-500" strokeWidth={2} />
              </div>
            </FloatingElement>

            <motion.h2 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark mb-4 md:mb-8 leading-[1.3] md:leading-[1.4] tracking-tight"
            >
              نموذج الأرباح والاشتراكات <br className="block sm:hidden" /><span className="text-emerald-500 font-sans tracking-normal">(SaaS)</span>
            </motion.h2>

            <motion.p
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
               className="text-lg md:text-2xl text-slate-700 font-bold max-w-4xl mb-8 md:mb-16 leading-relaxed bg-white/60 backdrop-blur-md px-6 py-4 md:px-8 md:py-6 rounded-3xl border border-white/80 shadow-xl shadow-emerald-500/5 mx-auto"
            >
              بالضبط! بعكس بيع المنتج الملموس لمرة واحدة، التطبيق يضمن <span className="text-emerald-700 font-black px-3 py-1 bg-emerald-100/80 rounded-xl inline-block shadow-sm">أرباحاً متكررة</span> واستدامة قوية لا تنضب.
            </motion.p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-center">
              <GlassCard delay={0.4} className="flex-1 !border-white/50 hover:!border-white/80 group !bg-white/70 backdrop-blur-3xl !p-6 md:!p-8 shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.15)]">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 shadow-inner group-hover:shadow-emerald-200/50 transition-all duration-500">
                   <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" strokeWidth={2.5} />
                 </div>
                 <h4 className="text-xl md:text-2xl font-black text-brand-dark mb-2 md:mb-4">الدخل السلبي (Passive)</h4>
                 <p className="text-slate-600 text-sm md:text-lg font-bold leading-[1.6] md:leading-[1.8]">الآباء يدفعون اشتراكات شهرية أو سنوية مقابل وصول أطفالهم المستمر للألعاب، المحتوى الجديد، والتحديثات.</p>
              </GlassCard>
              
              <GlassCard delay={0.6} className="flex-1 !border-white/50 hover:!border-white/80 group !bg-white/70 backdrop-blur-3xl !p-6 md:!p-8 shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.15)]">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-100 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 shadow-inner group-hover:shadow-emerald-200/50 transition-all duration-500">
                   <Repeat className="w-8 h-8 md:w-10 md:h-10 text-emerald-600 group-hover:rotate-180 transition-transform duration-700" strokeWidth={2.5} />
                 </div>
                 <h4 className="text-xl md:text-2xl font-black text-brand-dark mb-2 md:mb-4">قيمة العميل (LTV)</h4>
                 <p className="text-slate-600 text-sm md:text-lg font-bold leading-[1.6] md:leading-[1.8]">عند شراء لعبة خشبية تنتهي الصفقة بانتهاء الدفع. لكن في التطبيق، العميل يبقى لسنوات، مما يضاعف قيمته اقتصادياً مرات عديدة.</p>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const slides = [
  // 1. Cover Slide
  {
    id: 'cover',
    content: (
      <div className="flex flex-col items-center justify-center text-center w-full h-full relative px-6 md:px-12">
        <FloatingElement yOffset={20} duration={6}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.2 }}
            className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-brand-primary via-[#a37eb5] to-brand-accent rounded-[3rem] md:rounded-[4rem] rotate-12 mb-12 shadow-[0_30px_70px_rgba(255,209,102,0.5)] flex items-center justify-center border-4 border-white/80 backdrop-blur-md relative overflow-hidden group hover:rotate-0 transition-transform duration-700" 
          >
            <div className="absolute inset-0 bg-white/30 mix-blend-overlay group-hover:bg-white/10 transition-colors duration-700"></div>
            <Smartphone className="absolute inset-0 m-auto w-24 h-24 md:w-28 md:h-28 text-white drop-shadow-xl z-10 group-hover:scale-110 transition-transform duration-700" strokeWidth={1.5} />
            <Sparkles className="absolute -top-6 -right-6 w-16 h-16 text-white/60 animate-spin-slow z-20" />
            <Sparkles className="absolute -bottom-4 -left-4 w-10 h-10 text-brand-accent/80 animate-spin-slow z-20" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />
          </motion.div>
        </FloatingElement>
        
        <motion.h1 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-brand-dark drop-shadow-sm leading-tight pb-2"
        >
          أكـــــوان <span className="text-brand-primary">الـرقمي</span> 🚀
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/60 backdrop-blur-2xl px-6 md:px-10 py-4 md:py-5 rounded-full border border-white/50 shadow-sm max-w-4xl hover:shadow-md transition-shadow duration-500"
        >
          <p className="text-base md:text-xl text-brand-secondary font-bold tracking-wide leading-snug">
            مرحلة جديدة: من منتجات ملموسة محلياً.. إلى <span className="text-brand-primary font-black">منصة تعليمية عالمية</span> ✨
          </p>
        </motion.div>
      </div>
    )
  },
  
  {
    id: 'problem',
    content: <InteractiveProblemSlide />
  },

  // 3. The Digital Solution
  {
    id: 'solution',
    content: (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto h-full px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-black mb-10 border border-white/20 shadow-sm"
        >
          <CloudLightning className="w-8 h-8 animate-bounce text-brand-accent" />
          <span className="text-lg tracking-wide drop-shadow-md">القفزة النوعية</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white/95 mb-12 leading-[1.5] tracking-tight drop-shadow-sm"
        >
          تحويل منتجات <span className="text-brand-primary drop-shadow-sm">أكوان</span> إلى عالم <span className="text-orange-300 relative inline-block">
            سحابي لا نهائي
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-transparent rounded-full opacity-50"></div>
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          <GlassCard delay={0.5} className="!bg-white/10 !p-6 md:!p-10 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/15 transition-all group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Unplug className="w-8 h-8 md:w-10 md:h-10 text-brand-accent" />
            </div>
            <h3 className="text-xl md:text-2xl font-black mb-4 text-white">تحرر من كل القيود</h3>
            <p className="text-white/80 font-medium text-base md:text-lg leading-[1.7]">بمجرد برمجته، التكلفة الإضافية لكل مستخدم جديد تقترب من الصفر <span className="text-brand-accent font-bold px-1">(Zero Marginal Cost)</span>، مما يعظم هامش الربح.</p>
          </GlassCard>
          
          <GlassCard delay={0.7} className="!bg-white/10 !p-6 md:!p-10 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/15 transition-all group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Globe className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-black mb-4 text-white">سوق عالمي فوراً</h3>
            <p className="text-white/80 font-medium text-base md:text-lg leading-[1.7]">الوصول لملايين الأطفال العرب حول العالم بضغطة زر وتنزيل مباشر من المتاجر الرقمية، بلا جمارك أو تأخير.</p>
          </GlassCard>
        </div>
      </div>
    )
  },

  // 4. App Features
  {
    id: 'gameplay',
    content: (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto h-full px-6 md:px-12">
        <motion.h2 
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="text-2xl md:text-4xl lg:text-5xl font-black text-brand-dark mb-12 leading-[1.4] tracking-tight"
        >
          روح أكوان التفاعلية.. <br className="hidden md:block"/>مدعومة <span className="text-brand-primary">بالذكاء الاصطناعي</span> 🤖
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { icon: Puzzle, title: "تطوير المنتجات برمجياً", desc: "ألعاب كـ 'الكلمات الطويلة' تتحول لمستويات رقمية تتفاعل بالصوت والصورة مع لمسات الطفل.", color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Bot, title: "ذكاء اصطناعي تفاعلي", desc: "تقييم ذكي لمستوى الطفل وإنشاء مسار تعليمي يتماشى فوراً مع سرعة استيعابه ونموه العقلي.", color: "text-indigo-500", bg: "bg-indigo-50" },
            { icon: Medal, title: "تحفيز وإنجاز عالمي", desc: "لوحة تصدر (Leaderboard) وجمع عملات رقمية تحفز الطفل على الاستمرار والإدمان الإيجابي للتعلم.", color: "text-pink-500", bg: "bg-pink-50" },
          ].map((item, idx) => (
             <GlassCard key={idx} delay={0.4 + (idx * 0.2)} className="group !p-6 md:!p-8 !bg-white/60 hover:!bg-white/90">
               <div className={`w-16 h-16 md:w-20 md:h-20 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm group-hover:-translate-y-2 transition-transform duration-300`}>
                 <item.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />
               </div>
               <h3 className="text-lg md:text-xl font-black text-brand-dark mb-3 leading-relaxed">{item.title}</h3>
               <p className="text-brand-muted/90 font-medium text-sm md:text-base leading-[1.7]">{item.desc}</p>
             </GlassCard>
          ))}
        </div>
      </div>
    )
  },

  // 5. Business Model
  {
    id: 'bizmodel',
    content: <InteractiveBizModelSlide />
  },

  // 6. The Leader
  {
    id: 'leader',
    content: (
      <div className="flex flex-col justify-center h-full w-full max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6 text-center md:text-right">
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, type: "spring" }}>
            <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-2 tracking-tight">
              شريككم التكنولوجي الموثوق
            </h2>
            <p className="text-lg md:text-2xl text-brand-primary/90 font-bold mt-2">سراج الدين باب الله - من يقود هذه القفزة؟ 👨‍💻</p>
          </motion.div>
        </div>

        <GlassCard delay={0.2} className="!px-6 md:!px-12 !py-8 md:!py-10 border-0 border-r-4 md:border-r-8 !border-r-brand-primary flex flex-col justify-center relative overflow-hidden bg-white/60">
          
          <h3 className="text-xl md:text-2xl font-black text-brand-dark mb-8 flex items-center gap-4 relative z-10 leading-snug">
            <Award className="text-brand-primary w-8 h-8 flex-shrink-0" strokeWidth={2} />
            تاريخ محقق في تكنولوجيا التعليم (EdTech)
          </h3>
          <ul className="space-y-6 md:space-y-8 text-base md:text-lg font-medium text-brand-muted/90 relative z-10">
            <motion.li initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, type: "spring" }} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mt-1 text-sm shadow-sm">✔</span>
              <span className="leading-[1.7]">تأسيس منصة تعليمية (Tayssir Bac) من الصفر وتحقيق خروج (Exit) بقيمة <strong className="text-brand-dark font-black px-2">$25,000</strong>.</span>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, type: "spring" }} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent/20 text-orange-600 flex items-center justify-center mt-1 text-sm shadow-sm">✔</span>
              <span className="leading-[1.7]">القدرة الميدانية على تحقيق نمو ملحوظ عبر الوصول لـ <strong className="text-brand-dark font-black px-2">16,000 مستخدم نشط</strong>.</span>
            </motion.li>
            <motion.li initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, type: "spring" }} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-secondary/10 text-brand-secondary flex items-center justify-center mt-1 text-sm shadow-sm">✔</span>
              <span className="leading-[1.7]">خبرة شاملة في الـ Product Design، إدارة النمو، وهيكلة واجهات المستخدم بسلاسة عالمية.</span>
            </motion.li>
          </ul>
        </GlassCard>
      </div>
    )
  },

  // 7. The Gift / Proof
  {
    id: 'gift',
    content: (
      <div className="flex flex-col items-center justify-center text-center w-full max-w-6xl mx-auto h-full px-6 md:px-12">
        <FloatingElement yOffset={15} duration={5}>
          <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-tr from-brand-secondary via-[#7B598F] to-indigo-400 text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(92,67,106,0.4)] mb-6 md:mb-8 relative group hover:scale-105 transition-transform duration-500 cursor-default">
            <div className="absolute inset-0 rounded-full border-4 border-white/20 scale-110 group-hover:scale-125 group-hover:opacity-0 transition-all duration-700"></div>
            <Gift className="w-10 h-10 md:w-14 md:h-14 group-hover:rotate-12 transition-transform duration-500" strokeWidth={1.5} />
          </div>
        </FloatingElement>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.4] tracking-tight drop-shadow-md"
        >
          عربون الشراكة: <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-orange-400">متجركم الحديث</span>
        </motion.h2>

        <GlassCard delay={0.5} className="max-w-4xl mx-auto !bg-white/10 !p-8 md:!p-12 border border-white/20 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <p className="text-lg md:text-2xl text-white/90 font-bold leading-[1.8] mb-8 md:mb-10 text-shadow-sm">
            لتأكيد قدرتي على بناء تجارب رقمية استثنائية وبناء ثقة قوية، <span className="text-brand-accent font-black">قمت ببرمجة المتجر الإلكتروني الجديد بالكامل وتصميمه مجاناً</span>؛ كرسالة واضحة بأننا لا نبيع الكلام، بل نصنع الواقع بكفاءة وبأعلى معايير الجودة الممكنة.
          </p>
          
          <a href="https://akwan.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-white/10 rounded-full py-4 px-8 shadow-inner border border-white/20 hover:bg-white hover:text-brand-dark text-white font-black text-xl hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer group">
             <span>تصفح المتجر الآن</span>
             <MousePointerClick className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={2} />
          </a>
        </GlassCard>
      </div>
    )
  },

  // 8. Call To Action
  {
    id: 'cta',
    content: (
      <div className="flex items-center justify-center w-full h-full text-center relative px-6 md:px-12">
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="bg-white/5 p-12 md:p-24 rounded-[3rem] md:rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] relative overflow-hidden max-w-6xl w-full border border-white/10 backdrop-blur-3xl"
        >
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00000040]"></div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative z-10"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-[2.5rem] mx-auto mb-12 flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-700 cursor-default group">
               <Rocket className="w-16 h-16 md:w-20 md:h-20 text-brand-accent group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-xl text-shadow-sm">
              لنصنع المـستـقبـل معاً!
            </h2>
            <p className="text-base md:text-xl lg:text-2xl text-white/90 font-medium mb-12 max-w-4xl mx-auto leading-[1.8] drop-shadow-md">
              منتجاتكم الملموسة أثبتت نجاحها المبهر، والآن حان وقت التوسع. هل أنتم مستعدون لبناء <span className="text-white font-black underline decoration-brand-accent decoration-4 underline-offset-8 group-hover:text-brand-accent transition-colors">أقوى منصة تعليمية عربية</span>؟
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mx-auto w-full max-w-3xl">
              <a href="https://wa.me/213560688510" target="_blank" rel="noopener noreferrer" className="group block w-full md:w-auto mx-auto md:mx-0 relative cursor-pointer flex-1">
                <div className="absolute inset-0 bg-[#25D366] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 rounded-full"></div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full relative bg-[#25D366] text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-xl md:text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all border-2 border-transparent hover:border-white/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-sm"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>واتساب</span>
                </motion.button>
              </a>

              <a href="https://t.me/+213560688510" target="_blank" rel="noopener noreferrer" className="group block w-full md:w-auto mx-auto md:mx-0 relative cursor-pointer flex-1">
                <div className="absolute inset-0 bg-[#0088cc] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 rounded-full"></div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full relative bg-[#0088cc] text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-xl md:text-2xl font-black shadow-xl flex items-center justify-center gap-4 transition-all border-2 border-transparent hover:border-white/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-sm"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm5.894-16.481l-1.927 13.066c-.143.649-.533.809-1.071.503l-2.96-2.182-1.428 1.375c-.158.158-.291.291-.598.291l.213-3.02 5.495-4.965c.239-.213-.052-.331-.371-.118l-6.793 4.276-2.924-.913c-.636-.2-.647-.636.133-.941l11.445-4.41c.531-.194.996.118.786.938z"/></svg>
                  <span>تلجرام</span>
                </motion.button>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isDesktop, setIsDesktop] = useState(true);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Only allow lg screens and above (laptops/desktops)
    };
    
    // Initial check
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      playNavigationSound();
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      playNavigationSound();
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (!isDesktop) return; // Disable keyboard navigation on mobile
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === ' ') {
        goToNextSlide();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        goToPrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isDesktop]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '-100vw' : '100vw',
      opacity: 0,
      scale: 0.65,
      rotateY: direction > 0 ? -45 : 45,
      z: -400,
      filter: 'blur(10px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      z: 0,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '-100vw' : '100vw',
      opacity: 0,
      scale: 0.65,
      rotateY: direction < 0 ? -45 : 45,
      z: -400,
      filter: 'blur(10px)'
    })
  };

  if (!isDesktop) {
    return (
      <div className="w-full h-screen overflow-hidden bg-brand-bg relative flex items-center justify-center font-sans p-6" dir="rtl">
        <BackgroundBlobs isDarkMode={false} />
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="bg-white/70 backdrop-blur-2xl border-2 border-white/80 p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-lg w-full text-center relative z-10"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-accent rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/50 relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,white_25%,white_50%,transparent_50%,transparent_75%,white_75%,white_100%)] bg-[length:20px_20px] opacity-10 blur-[1px]"></div>
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md relative z-10"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
          </div>
          <h2 className="text-3xl font-black text-brand-dark mb-4 leading-snug">
            عذراً، هذا العرض مصمم لشاشات الحواسيب فقط! 💻
          </h2>
          <p className="text-lg text-brand-muted/90 font-bold leading-relaxed mb-6">
            لقد تم تصميم هذا العرض التقديمي بطريقة فنية وإبداعية تفاعلية خصيصاً ليُعرض بأبهى حُلة على شاشات اللابتوب والكمبيوتر المكتبي.
          </p>
          <div className="px-5 py-4 bg-brand-secondary/10 rounded-2xl text-brand-secondary font-bold text-sm border border-brand-secondary/20">
            يرجى فتح الرابط من جهاز كمبيوتر للاستمتاع بالتجربة الكاملة.
          </div>
        </motion.div>
      </div>
    );
  }
  const isDarkMode = currentSlide === 2 || currentSlide === 6 || currentSlide === 7;
  return (
    <motion.div 
      initial={false}
      animate={{ backgroundColor: isDarkMode ? '#0a0914' : '#fdfbfb' }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="w-full h-screen overflow-hidden relative flex items-center justify-center font-sans selection:bg-brand-primary/30" 
      dir="rtl"
      // Added a perspective wrapper so rotateY transformations look 3D and immersive
      style={{ perspective: 1200 }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBlobs isDarkMode={isDarkMode} />
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 150, damping: 20 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.6, ease: "easeOut" },
            rotateY: { duration: 0.8, ease: "circOut" },
            z: { duration: 0.8, ease: "circOut" }
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center pb-28 pt-10 md:pb-36 z-10 overflow-y-auto no-scrollbar"
        >
          <div className="w-full h-max my-auto flex flex-col items-center justify-center">
             {slides[currentSlide].content}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Controls */}
      <motion.div 
        animate={{ 
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'
        }}
        transition={{ duration: 1.5 }}
        className="fixed bottom-6 md:bottom-8 lg:bottom-12 max-w-[90%] md:max-w-md w-full left-1/2 -translate-x-1/2 backdrop-blur-3xl border-2 p-2 md:p-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between z-50 transition-all hover:bg-white/10 group"
      >
        <button 
          onClick={goToPrevSlide} 
          disabled={currentSlide === 0}
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center disabled:opacity-30 disabled:hover:scale-100 hover:scale-110 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all focus:outline-none focus:ring-4 focus:ring-brand-primary/20 ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-white text-brand-dark hover:bg-slate-50 border border-slate-100'}`}
          title="السابق"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        
        <div className="flex gap-2 md:gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`transition-all duration-500 rounded-full h-2 md:h-3 border-none focus:outline-none ${
                currentSlide === idx 
                  ? 'w-8 md:w-12 bg-gradient-to-r from-brand-primary to-brand-accent shadow-[0_0_20px_rgba(141,105,159,0.5)]' 
                  : isDarkMode ? 'w-2 md:w-3 bg-white/20 hover:bg-white/40' : 'w-2 md:w-3 bg-brand-muted/20 hover:bg-brand-muted/40'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={goToNextSlide} 
          disabled={currentSlide === slides.length - 1}
          className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-brand-primary to-brand-secondary text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:hover:scale-100 hover:scale-110 shadow-[0_10px_20px_rgba(141,105,159,0.3)] transition-all focus:outline-none focus:ring-4 focus:ring-brand-primary/30"
          title="التالي"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
        </button>
      </motion.div>
      
      {/* Decorative Branding Corner */}
      <motion.div 
        animate={{ 
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)'
        }}
        transition={{ duration: 1.5 }}
        className="absolute top-6 right-6 md:top-8 md:right-10 z-50 flex items-center gap-3 md:gap-4 backdrop-blur-xl px-4 py-2 md:px-5 md:py-3 rounded-2xl border shadow-lg group hover:bg-white/20 transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
          <span className="text-white font-black text-xl md:text-2xl font-sans drop-shadow-md">أ</span>
        </div>
        <span className={`font-black text-xl md:text-2xl tracking-tighter hidden md:block opacity-90 group-hover:opacity-100 transition-colors ${isDarkMode ? 'text-white' : 'text-brand-dark'}`}>أكـــــــوان</span>
      </motion.div>
    </motion.div>
  );
}
