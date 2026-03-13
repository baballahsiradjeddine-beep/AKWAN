import React, { useEffect, useState } from 'react';
import { useStore, Testimonial } from '../../store/useStore';
import { Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const { testimonials, isLoadingTestimonials, fetchTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>({ name: '', text: '', rating: 5, avatar: '' });

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
        toast.success('تم تحديث الرأي بنجاح');
      } else {
        await addTestimonial(formData);
        toast.success('تم إضافة الرأي بنجاح');
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: '', text: '', rating: 5, avatar: '' });
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const startEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({ name: testimonial.name, text: testimonial.text, rating: testimonial.rating, avatar: testimonial.avatar });
    setIsAdding(true);
  };

  if (isLoadingTestimonials) {
    return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-gray-800">إدارة آراء العملاء</h2>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', text: '', rating: 5, avatar: '' }); }}
          className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-secondary"
        >
          <Plus className="w-5 h-5" /> إضافة رأي
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
          <input type="text" placeholder="اسم العميل" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 rounded-lg border" required />
          <textarea placeholder="نص الرأي" value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full p-2 rounded-lg border" required />
          <input type="number" min="1" max="5" placeholder="التقييم (1-5)" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} className="w-full p-2 rounded-lg border" required />
          <input type="url" placeholder="رابط الصورة (اختياري)" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full p-2 rounded-lg border" />
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Save className="w-4 h-4" /> حفظ</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2"><X className="w-4 h-4" /> إلغاء</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">{t.name}</h3>
              <p className="text-sm text-gray-600">{t.text}</p>
              <p className="text-xs text-brand-primary font-bold">التقييم: {t.rating}/5</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteTestimonial(t.id).then(() => toast.success('تم الحذف'))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
