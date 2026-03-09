import { motion } from 'motion/react';
import { Users, ShoppingBag, DollarSign, Package, ArrowUpRight, ArrowDownRight, MoreHorizontal, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';

const salesData = [
  { name: 'السبت', sales: 4200, orders: 45 },
  { name: 'الأحد', sales: 3800, orders: 38 },
  { name: 'الإثنين', sales: 5100, orders: 52 },
  { name: 'الثلاثاء', sales: 4800, orders: 48 },
  { name: 'الأربعاء', sales: 6200, orders: 65 },
  { name: 'الخميس', sales: 7500, orders: 82 },
  { name: 'الجمعة', sales: 8900, orders: 95 },
];

const topProducts = [
  { id: 1, name: 'طقم دلة خشبي', sales: 124, price: 224.25, image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=100&q=80' },
  { id: 2, name: 'بطاقات كتابة الحروف', sales: 98, price: 75.00, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&q=80' },
  { id: 3, name: 'تكوين الكلمات الطويلة', sales: 76, price: 570.00, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=100&q=80' },
];

export default function Dashboard() {
  const { products, fetchProducts, orders, fetchOrders, customers, fetchCustomers, isLoadingProducts, isLoadingOrders, isLoadingCustomers } = useStore();
  const [timeRange, setTimeRange] = useState('7 أيام');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, [fetchProducts, fetchOrders, fetchCustomers]);

  const totalSales = orders
    .filter(o => o.status === 'تم التوصيل')
    .reduce((acc, curr) => acc + curr.total_amount, 0);

  const stats = [
    { 
      name: 'إجمالي المبيعات', 
      value: `${totalSales.toFixed(2)} ر.س`, 
      icon: DollarSign, 
      change: '+12.5%', 
      isUp: true,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50'
    },
    { 
      name: 'الطلبات الجديدة', 
      value: orders.length.toString(), 
      icon: ShoppingBag, 
      change: '+18.2%', 
      isUp: true,
      color: 'from-brand-primary to-brand-secondary',
      bg: 'bg-brand-bg'
    },
    { 
      name: 'العملاء النشطين', 
      value: customers.length.toString(), 
      icon: Users, 
      change: '-2.4%', 
      isUp: false,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50'
    },
    { 
      name: 'المنتجات', 
      value: products.length.toString(), 
      icon: Package, 
      change: 'محدث', 
      isUp: true,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50'
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">لوحة التحكم</h1>
          <p className="text-slate-400 font-bold mt-1">نظرة شاملة على أداء متجرك اليوم.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {['اليوم', '7 أيام', '30 يوم'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${timeRange === range ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${stat.isUp ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-slate-400 text-sm font-bold mb-2">{stat.name}</h3>
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
              </div>
              {/* Decorative background shape */}
              <div className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-black text-slate-800">تحليلات المبيعات</h2>
              <p className="text-xs text-slate-400 font-bold mt-1">مقارنة المبيعات والطلبات خلال الأسبوع</p>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8D699F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8D699F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700, fontFamily: 'Tajawal' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700, fontFamily: 'Tajawal' }} 
                  dx={-15}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontFamily: 'Tajawal', padding: '15px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8D699F" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-slate-800">الأكثر مبيعاً</h2>
            <Link to="/admin/products" className="text-xs font-black text-brand-primary hover:underline">عرض الكل</Link>
          </div>
          <div className="space-y-6 flex-1">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 text-sm truncate">{product.name}</h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{product.sales} مبيعة</p>
                </div>
                <div className="text-left">
                  <p className="font-black text-brand-primary text-sm">{product.price} ر.س</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.sales / 150) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="bg-brand-primary h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
            <span>تحميل التقرير الكامل</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-800">أحدث الطلبات</h2>
          <Link to="/admin/orders" className="px-6 py-2.5 bg-brand-bg text-brand-primary rounded-xl font-black text-sm hover:bg-brand-primary hover:text-white transition-all">
            إدارة جميع الطلبات
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-400 text-xs font-black uppercase tracking-wider border-b border-slate-100">
                <th className="pb-4 pr-4">العميل</th>
                <th className="pb-4">رقم الطلب</th>
                <th className="pb-4">التاريخ</th>
                <th className="pb-4">المبلغ</th>
                <th className="pb-4">الحالة</th>
                <th className="pb-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoadingOrders ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-bold">جاري التحميل...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-bold">لا توجد طلبات.</td>
                </tr>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm">
                          {order.customer_name?.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{order.customer_name}</span>
                      </div>
                    </td>
                    <td className="py-5 font-bold text-slate-500">#{order.id}</td>
                    <td className="py-5 text-slate-400 font-medium text-sm">
                      {new Date(order.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="py-5 font-black text-slate-800">{order.total_amount.toFixed(2)} ر.س</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                        order.status === 'تم التوصيل' ? 'bg-emerald-100 text-emerald-600' : 
                        order.status === 'قيد المعالجة' ? 'bg-amber-100 text-amber-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-5 text-center">
                      <Link to="/admin/orders" className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-all inline-block">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
