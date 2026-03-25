import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-center p-4 text-center ${isRTL ? '' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="relative">
          <h1 className="text-9xl font-black text-brand-primary/10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black text-brand-secondary">{t('page_not_found_title', 'الصفحة غير موجودة')}</span>
          </div>
        </div>
        
        <p className="text-gray-500 font-medium">
          {t('page_not_found_desc', 'عذراً، يبدو أنك ضللت الطريق. الصفحة التي تبحث عنها غير موجودة أو تم نقلها.')}
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <Home className="w-5 h-5" />
          <span>{t('back_to_shop', 'العودة للمتجر')}</span>
        </Link>
      </motion.div>
    </div>
  );
}
