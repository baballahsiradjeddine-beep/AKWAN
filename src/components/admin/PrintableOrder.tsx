import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';

interface PrintableOrderProps {
  order: any;
}

const PrintableOrder: React.FC<PrintableOrderProps> = ({ order }) => {
  const { t, i18n } = useTranslation();
  const settings = useStore(state => state.settings);
  const isRTL = i18n.language === 'ar';
  
  const shippingFee = settings.shippingFee || 0;
  const subtotal = order.total_amount > shippingFee ? order.total_amount - shippingFee : order.total_amount;

  return (
    <div className={`print-only p-12 bg-white text-black font-sans ${isRTL ? '' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'} style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{t('order_number')} #{order.id.slice(0, 8)}</h1>
          <p className="text-xl font-bold text-gray-600">{new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</p>
        </div>
        <div className={isRTL ? 'text-left' : 'text-right'}>
          <h2 className="text-2xl font-black text-brand-primary">{settings.siteName}</h2>
          <p className="font-bold text-gray-500 mt-1">{settings.contactEmail}</p>
          <p className="font-bold text-gray-400 text-sm mt-1">{settings.contactPhone}</p>
        </div>
      </div>

      {/* Customer & Order Info */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className={`text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('customer')}</h3>
          <div className="space-y-1">
            <p className="text-xl font-black">{order.customer_name}</p>
            <p className="font-bold text-gray-600">{order.customer_phone}</p>
            <p className="font-bold text-gray-600 leading-relaxed">{order.customer_address}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className={`text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t('status')}</h3>
          <div className="space-y-1">
            <p className="text-xl font-black">{order.status}</p>
            <p className="font-bold text-gray-600">{t('date')}: {new Date(order.created_at).toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US')}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <h3 className={`text-sm font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('products')}</h3>
        <table className={`w-full border-collapse ${isRTL ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="p-4 font-black">{t('products')}</th>
              <th className="p-4 font-black text-center">{t('amount')}</th>
              <th className="p-4 font-black text-center">{t('total')}</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-4 font-bold">{item.name}</td>
                  <td className="p-4 font-bold text-center">{item.quantity}</td>
                  <td className="p-4 font-black text-center">{(item.price * item.quantity).toFixed(2)} {t('sar')}</td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-100">
                <td className="p-4 font-bold">{t('products')}</td>
                <td className="p-4 font-bold text-center">1</td>
                <td className="p-4 font-black text-center">{subtotal.toFixed(2)} {t('sar')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className={`flex flex-col items-end space-y-3 pt-6 ${isRTL ? 'mr-auto' : 'ml-auto'} w-72`}>
        <div className="flex justify-between w-full text-gray-600 font-bold border-b border-gray-100 pb-2">
          <span>{t('subtotal')}</span>
          <span>{subtotal.toFixed(2)} {t('sar')}</span>
        </div>
        <div className="flex justify-between w-full text-gray-600 font-bold border-b border-gray-100 pb-2">
          <span>{t('shipping')}</span>
          <span>{shippingFee.toFixed(2)} {t('sar')}</span>
        </div>
        <div className="flex justify-between w-full pt-4 border-t-2 border-brand-primary text-2xl font-black text-brand-secondary">
          <span>{t('total')}</span>
          <span>{order.total_amount.toFixed(2)} {t('sar')}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-20 text-center">
        <div className="inline-block border-2 border-brand-primary/20 bg-brand-bg rounded-2xl px-8 py-4 mb-8">
          <p className="text-xl font-black uppercase tracking-widest text-brand-secondary">{t('thank_you_trust', 'شكراً لثقتكم بنا')}</p>
        </div>
        <p className="text-xs text-gray-400 font-bold">{t('auto_generated_invoice', 'هذه الفاتورة تم إنشاؤها آلياً ولا تحتاج لختم أو توقيع')}</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible; }
          .print-only { position: absolute; left: 0; top: 0; width: 100%; }
          @page { size: A4; margin: 0; }
        }
        .print-only { display: none; }
        @media print { .print-only { display: block; } }
      `}} />
    </div>
  );
};

export default PrintableOrder;
