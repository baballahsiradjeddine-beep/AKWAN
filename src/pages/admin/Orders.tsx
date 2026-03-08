import { motion } from 'motion/react';
import { Search, Filter, Eye, MoreVertical } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-1005', customer: 'أحمد محمد', date: '2023-10-27', total: 450.50, status: 'مكتمل', items: 3 },
  { id: 'ORD-1004', customer: 'سارة خالد', date: '2023-10-26', total: 120.00, status: 'قيد المعالجة', items: 1 },
  { id: 'ORD-1003', customer: 'فهد عبدالله', date: '2023-10-25', total: 890.00, status: 'تم الشحن', items: 5 },
  { id: 'ORD-1002', customer: 'نورة سعد', date: '2023-10-24', total: 340.25, status: 'ملغي', items: 2 },
  { id: 'ORD-1001', customer: 'محمد علي', date: '2023-10-23', total: 560.00, status: 'مكتمل', items: 4 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'مكتمل': return 'bg-emerald-100 text-emerald-600';
    case 'قيد المعالجة': return 'bg-yellow-100 text-yellow-600';
    case 'تم الشحن': return 'bg-brand-secondary/10 text-brand-secondary';
    case 'ملغي': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-gray-800">إدارة الطلبات</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث برقم الطلب أو اسم العميل..." 
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium"
          />
        </div>
        <div className="flex gap-2">
          <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-primary font-bold text-gray-700">
            <option>جميع الحالات</option>
            <option>مكتمل</option>
            <option>قيد المعالجة</option>
            <option>تم الشحن</option>
            <option>ملغي</option>
          </select>
          <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2 font-bold">
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">تصفية</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-black text-gray-600">رقم الطلب</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">العميل</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">التاريخ</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">الإجمالي</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockOrders.map((order, index) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{order.date}</td>
                  <td className="px-6 py-4 font-black text-brand-primary">{order.total.toFixed(2)} ر.س</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors" title="عرض التفاصيل">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500 font-bold">
            عرض 1 إلى 5 من 24 طلب
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-white transition-colors disabled:opacity-50">السابق</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-white transition-colors disabled:opacity-50">التالي</button>
          </div>
        </div>
      </div>
    </div>
  );
}
