import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, MoreVertical, X, Package, Truck, CheckCircle, Clock, Filter, ChevronRight, ChevronLeft, Download, Printer } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

import { useStore } from '../../store/useStore';
import { exportToCSV } from '../../utils/export';

export default function AdminOrders() {
  const { orders, fetchOrders, updateOrderStatus, isLoadingOrders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'تم التوصيل': return 'bg-emerald-100 text-emerald-600';
      case 'قيد المعالجة': return 'bg-amber-100 text-amber-600';
      case 'تم الشحن': return 'bg-blue-100 text-blue-600';
      case 'ملغي': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'تم التوصيل': return <CheckCircle className="w-4 h-4" />;
      case 'قيد المعالجة': return <Clock className="w-4 h-4" />;
      case 'تم الشحن': return <Truck className="w-4 h-4" />;
      case 'ملغي': return <X className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setActiveDropdown(null);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'الكل' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">إدارة الطلبات</h1>
          <p className="text-slate-400 font-bold mt-1">تتبع وحالة طلبات عملائك في مكان واحد.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => exportToCSV(filteredOrders.map(o => ({ 
              'رقم الطلب': o.id, 
              'العميل': o.customer_name, 
              'المبلغ': o.total_amount, 
              'الحالة': o.status, 
              'التاريخ': new Date(o.created_at).toLocaleDateString('ar-SA') 
            })), 'الطلبات')}
            className="bg-white text-slate-600 px-4 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">تصدير</span>
          </button>
          <button 
            onClick={() => {
              try {
                window.print();
              } catch (e) {
                toast.error('عذراً، ميزة الطباعة قد لا تعمل داخل نافذة المعاينة. يرجى فتح التطبيق في نافذة جديدة.');
              }
            }}
            className="bg-brand-primary text-white px-4 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline">طباعة التقارير</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الطلبات', value: orders.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'قيد المعالجة', value: orders.filter(o => o.status === 'قيد المعالجة').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'تم التوصيل', value: orders.filter(o => o.status === 'تم التوصيل').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'ملغاة', value: orders.filter(o => o.status === 'ملغي').length, icon: X, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="ابحث برقم الطلب أو اسم العميل..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-slate-700"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-black text-slate-700 text-sm cursor-pointer"
            >
              <option value="الكل">جميع الحالات</option>
              <option value="قيد المعالجة">قيد المعالجة</option>
              <option value="تم الشحن">تم الشحن</option>
              <option value="تم التوصيل">تم التوصيل</option>
              <option value="ملغي">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">رقم الطلب</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">العميل</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">التاريخ</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">المجموع</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-black">جاري تحميل الطلبات...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-black">لا توجد طلبات حالياً.</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5 font-black text-slate-800 text-sm">{order.id}</td>
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-800 text-sm">{order.customer_name}</p>
                      <p className="text-[10px] text-slate-400 font-black mt-0.5">{order.customer_phone}</p>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-8 py-5 font-black text-brand-primary text-sm">{order.total_amount.toFixed(2)} ر.س</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2 relative" ref={activeDropdown === order.id ? dropdownRef : null}>
                        <button 
                          onClick={() => { setSelectedOrder(order); setIsViewing(true); }}
                          className="p-2.5 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-xl transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                            className={`p-2.5 rounded-xl transition-all ${activeDropdown === order.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          <AnimatePresence>
                            {activeDropdown === order.id && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                              >
                                <div className="p-2">
                                  <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">تغيير الحالة</p>
                                  {['قيد المعالجة', 'تم الشحن', 'تم التوصيل', 'ملغي'].map((status) => (
                                    <button 
                                      key={status}
                                      onClick={() => handleUpdateStatus(order.id, status)}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs ${order.status === status ? 'bg-brand-bg text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                      <span>{status}</span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <span className="text-xs text-slate-400 font-black uppercase tracking-widest">
            صفحة {currentPage} من {totalPages || 1}
          </span>
          <div className="flex gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      <AnimatePresence>
        {isViewing && selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">تفاصيل الطلب {selectedOrder.id}</h2>
                  <p className="text-slate-400 font-bold text-sm mt-1">
                    {new Date(selectedOrder.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <button onClick={() => setIsViewing(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Status Banner */}
                <div className={`p-6 rounded-[1.5rem] flex items-center justify-between ${getStatusColor(selectedOrder.status)}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/40 p-3 rounded-xl">
                      {getStatusIcon(selectedOrder.status)}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider opacity-70">حالة الطلب الحالية</p>
                      <p className="text-xl font-black">{selectedOrder.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all">
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">معلومات العميل</h4>
                    <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 space-y-3">
                      <p className="font-black text-slate-800">{selectedOrder.customer_name}</p>
                      <p className="text-sm font-bold text-slate-600">{selectedOrder.customer_phone}</p>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed">{selectedOrder.customer_address}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">ملخص الدفع</h4>
                    <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 space-y-4">
                      <div className="flex justify-between text-sm font-bold text-slate-600">
                        <span>قيمة المنتجات ({selectedOrder.items_count})</span>
                        <span>{(selectedOrder.total_amount - 25).toFixed(2)} ر.س</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-600">
                        <span>الشحن</span>
                        <span>25.00 ر.س</span>
                      </div>
                      <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="font-black text-slate-800">الإجمالي</span>
                        <span className="text-xl font-black text-brand-primary">{selectedOrder.total_amount.toFixed(2)} ر.س</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Placeholder */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">المنتجات المطلوبة</h4>
                  <div className="space-y-3">
                    {[1, 2].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                          <div>
                            <p className="text-sm font-black text-slate-800">اسم المنتج التجريبي {i + 1}</p>
                            <p className="text-xs font-bold text-slate-400">الكمية: 1</p>
                          </div>
                        </div>
                        <p className="font-black text-slate-800 text-sm">125.00 ر.س</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-slate-100 flex gap-4 shrink-0 bg-slate-50/50">
                <button onClick={() => setIsViewing(false)} className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-white transition-all">
                  إغلاق
                </button>
                <button className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20">
                  تحديث الحالة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
