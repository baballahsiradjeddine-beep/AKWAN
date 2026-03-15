import { motion } from 'motion/react';
import { Sparkles, Heart, Star, Smile, BookOpen, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';

export default function About() {
  const { t } = useTranslation();
  const settings = useStore((state) => state.settings);

  return (
    <div className="min-h-screen bg-brand-surface py-10 md:py-24 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -right-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 -left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="inline-flex items-center justify-center space-x-2 space-x-reverse mb-4 md:mb-6 bg-white px-6 md:px-8 py-3 md:py-4 rounded-full border-2 md:border-4 border-brand-bg shadow-xl"
          >
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
            <h1 className="text-2xl md:text-5xl font-black text-brand-secondary">{settings.aboutTitle}</h1>
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-brand-accent animate-pulse-soft" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-brand-muted font-bold max-w-2xl mx-auto leading-relaxed"
          >
            {settings.aboutSubtitle}
          </motion.p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-16 md:space-y-32">
          
          {/* Block 1 */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-20"
          >
            <div className="w-full md:w-1/2">
              <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl aspect-square md:aspect-[4/3] bg-brand-bg/50 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={settings.aboutImage1} 
                  alt="أطفال يلعبون" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/30 to-transparent mix-blend-multiply"></div>
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-right">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-accent rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto md:mx-0 shadow-lg transform rotate-6">
                <Heart className="w-6 h-6 md:w-8 md:h-8 text-brand-secondary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-brand-secondary mb-3 md:mb-4">{t('about_idea_title')}</h2>
              <p className="text-base md:text-lg text-brand-muted font-bold leading-relaxed">
                {t('about_idea_desc')}
              </p>
            </div>
          </motion.div>

          {/* Block 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-20"
          >
            <div className="w-full md:w-1/2">
              <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl aspect-square md:aspect-[4/3] bg-brand-bg/50 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={settings.aboutImage2} 
                  alt="ألعاب خشبية" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/30 to-transparent mix-blend-multiply"></div>
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-right">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto md:mx-0 shadow-lg transform -rotate-6">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-brand-secondary mb-3 md:mb-4">{t('about_quality_title')}</h2>
              <p className="text-base md:text-lg text-brand-muted font-bold leading-relaxed">
                {t('about_quality_desc')}
              </p>
            </div>
          </motion.div>

        </div>

        {/* Core Values */}
        <div className="mt-16 md:mt-32">
          <h2 className="text-2xl md:text-4xl font-black text-brand-secondary text-center mb-8 md:mb-12">{t('core_values')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: BookOpen, title: t('value_learning_title'), desc: t('value_learning_desc'), color: 'bg-brand-primary' },
              { icon: Globe, title: t('value_identity_title'), desc: t('value_identity_desc'), color: 'bg-brand-accent' },
              { icon: Smile, title: t('value_creativity_title'), desc: t('value_creativity_desc'), color: 'bg-[#A8DADC]' },
            ].map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border-2 md:border-4 border-brand-bg text-center group"
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 ${val.color} rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  <val.icon className={`w-8 h-8 md:w-10 md:h-10 ${val.color === 'bg-brand-primary' ? 'text-white' : 'text-brand-secondary'}`} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-brand-secondary mb-2 md:mb-4">{val.title}</h3>
                <p className="text-sm md:text-base text-brand-muted font-bold">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
