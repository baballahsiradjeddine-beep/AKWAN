import { motion } from 'motion/react';
import { Search, Mail, Phone, MoreVertical, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';

export default function AdminCustomers() {
  const { customers, fetchCustomers, isLoadingCustomers } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-gray-800">إدارة العملاء</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium"
          />
        </div>
        <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-primary font-bold text-gray-700">
          <option>جميع الحالات</option>
          <option>نشط</option>
          <option>غير نشط</option>
        </select>
        <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-primary font-bold text-gray-700">
          <option>الأحدث انضماماً</option>
          <option>الأكثر إنفاقاً</option>
          <option>الأكثر طلباً</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-black text-gray-600">العميل</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">معلومات الاتصال</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">الطلبات</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">إجمالي الإنفاق</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingCustomers ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 font-bold">جاري تحميل العملاء...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-gray-400 font-bold">لا يوجد عملاء حالياً.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{customer.name}</p>
                          <p className="text-xs text-gray-500 font-medium">انضم في {new Date(customer.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span dir="ltr">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span dir="ltr">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{customer.total_orders}</td>
                    <td className="px-6 py-4 font-black text-brand-primary">{customer.total_spent.toFixed(2)} ر.س</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        customer.total_orders > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {customer.total_orders > 0 ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors" title="صلاحيات العميل">
                          <Shield className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-gray-500 font-bold">
            عرض {filteredCustomers.length} عميل
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
