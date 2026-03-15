import React from 'react';
import { Order } from '../../store/useStore';
import { useTranslation } from 'react-i18next';

interface PrintableReportProps {
  stats: {
    totalSales: number;
    orderCount: number;
    productCount: number;
  };
  recentOrders: Order[];
  dateRange: string;
}

const PrintableReport: React.FC<PrintableReportProps> = ({ stats, recentOrders, dateRange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`print-only p-8 bg-white text-black font-sans ${isRTL ? '' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'} style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      {/* Header */}
      <div className={`flex justify-between items-start border-b-2 border-gray-200 pb-6 mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">{t('sales_analytics')}</h1>
          <p className="text-gray-500 font-bold mt-1">{t('my_arabic_roots')}</p>
        </div>
        <div className={isRTL ? 'text-left' : 'text-right'}>
          <p className="text-sm font-bold">{t('date')}: {new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</p>
          <p className="text-sm font-bold">{t('today')}: {dateRange}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="border border-gray-200 p-4 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('total_sales')}</p>
          <p className="text-2xl font-black">{stats.totalSales.toLocaleString()} {t('sar')}</p>
        </div>
        <div className="border border-gray-200 p-4 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('new_orders')}</p>
          <p className="text-2xl font-black">{stats.orderCount}</p>
        </div>
        <div className="border border-gray-200 p-4 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('total_products')}</p>
          <p className="text-2xl font-black">{stats.productCount}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div>
        <h2 className={`text-xl font-black mb-4 border-black pr-3 ${isRTL ? 'border-r-4 pr-3' : 'border-l-4 pl-3'}`}>{t('recent_orders')}</h2>
        <table className={`w-full border-collapse ${isRTL ? 'text-right' : 'text-left'}`}>
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-3 text-sm font-black">{t('order_number')}</th>
              <th className="p-3 text-sm font-black">{t('customer')}</th>
              <th className="p-3 text-sm font-black">{t('date')}</th>
              <th className="p-3 text-sm font-black">{t('amount')}</th>
              <th className="p-3 text-sm font-black">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200">
                <td className="p-3 text-sm font-bold">#{order.id.slice(0, 8)}</td>
                <td className="p-3 text-sm font-bold">{order.customer_name}</td>
                <td className="p-3 text-sm font-bold">{new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</td>
                <td className="p-3 text-sm font-black">{order.total_amount} {t('sar')}</td>
                <td className="p-3 text-sm font-bold">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-gray-200 text-center text-xs text-gray-400 font-bold">
        <p>تم إنشاء هذا التقرير آلياً من لوحة تحكم المتجر</p>
        <p className="mt-1">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
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

export default PrintableReport;
