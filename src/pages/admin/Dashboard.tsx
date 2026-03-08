import { motion } from 'motion/react';
import { Users, ShoppingBag, DollarSign, TrendingUp, Package, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../../store/useStore';

const data = [
  { name: 'السبت', sales: 4000 },
  { name: 'الأحد', sales: 3000 },
  { name: 'الإثنين', sales: 2000 },
  { name: 'الثلاثاء', sales: 2780 },
  { name: 'الأربعاء', sales: 1890 },
  { name: 'الخميس', sales: 2390 },
  { name: 'الجمعة', sales: 3490 },
];

export default function Dashboard() {
  const products = useStore((state) => state.products);
  const fetchProducts = useStore((state) => state.fetchProducts);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const stats = [
    { name: 'إجمالي المبيعات', value: '0.00 ر.س', icon: DollarSign, change: '0%', color: 'bg-brand-primary/10 text-brand-primary' },
    { name: 'الطلبات الجديدة', value: '0', icon: ShoppingBag, change: '0%', color: 'bg-brand-secondary/10 text-brand-secondary' },
    { name: 'العملاء النشطين', value: '0', icon: Users, change: '0%', color: 'bg-brand-accent/20 text-brand-secondary' },
    { name: 'المنتجات', value: products.length.toString(), icon: Package, change: 'محدث', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-800">نظرة عامة</h1>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-secondary transition-colors shadow-sm">
          تصدير التقرير
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-gray-500'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-bold mb-1">{stat.name}</h3>
              <p className="text-2xl font-black text-gray-800">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity & Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
          <h2 className="text-lg font-black text-gray-800 mb-4">المبيعات خلال الأسبوع</h2>
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8D699F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8D699F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Tajawal' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'Tajawal' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'Tajawal' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#8D699F" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-4">أحدث الطلبات</h2>
          <div className="space-y-4">
            {[
              { id: '1005', customer: 'أحمد محمد', time: 'منذ 10 دقائق', total: 450.50 },
              { id: '1004', customer: 'سارة خالد', time: 'منذ 45 دقيقة', total: 120.00 },
              { id: '1003', customer: 'فهد عبدالله', time: 'منذ ساعتين', total: 890.00 },
              { id: '1002', customer: 'نورة سعد', time: 'منذ 3 ساعات', total: 340.25 },
              { id: '1001', customer: 'محمد علي', time: 'منذ 5 ساعات', total: 560.00 },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary font-bold">
                    {order.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">طلب #{order.id}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
                <span className="font-black text-brand-primary text-sm">
                  {order.total.toFixed(2)} ر.س
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" className="w-full mt-4 py-2 text-sm font-bold text-brand-primary hover:bg-brand-bg rounded-lg transition-colors block text-center">
            عرض كل الطلبات
          </Link>
        </div>
      </div>
    </div>
  );
}
