import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'light', className = '' }) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const baseClasses = "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors font-bold";
  const variantClasses = variant === 'dark' 
    ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
    : "bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <Globe className="w-4 h-4" />
      <span className="text-xs uppercase tracking-wider">
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </span>
    </motion.button>
  );
};

export default LanguageSwitcher;
