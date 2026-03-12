import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit, Trash2, MoreVertical, X, Upload, Loader2, Eye, ExternalLink, Filter, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { useStore, Product } from '../../store/useStore';
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const products = useStore((state) => state.products);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: '',
    image: '',
    additionalImages: [] as string[],
    description: '',
    rating: 5,
    soldOut: false
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setProductForm({ ...productForm, image: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        newImages.push(data.publicUrl);
      }

      setProductForm(prev => ({ 
        ...prev, 
        additionalImages: [...(prev.additionalImages || []), ...newImages] 
      }));
    } catch (error) {
      console.error('Error uploading additional images:', error);
      toast.error('حدث خطأ أثناء رفع الصور الإضافية');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productForm.name && productForm.price > 0) {
      try {
        await addProduct({
          ...productForm,
          image: productForm.image || 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80'
        });
        setIsAdding(false);
        resetForm();
        toast.success('تمت إضافة المنتج بنجاح');
      } catch (error: any) {
        toast.error('حدث خطأ أثناء إضافة المنتج');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && productForm.name && productForm.price > 0) {
      try {
        await updateProduct(editingId, {
          ...productForm,
          image: productForm.image || 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80'
        });
        setIsEditing(false);
        setEditingId(null);
        resetForm();
        toast.success('تم تحديث المنتج بنجاح');
      } catch (error: any) {
        toast.error('حدث خطأ أثناء تحديث المنتج');
      }
    }
  };

  const openEditModal = (product: Product) => {
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      additionalImages: product.additionalImages || [],
      description: product.description,
      rating: product.rating,
      soldOut: product.soldOut || false
    });
    setEditingId(product.id);
    setIsEditing(true);
    setActiveDropdown(null);
  };

  const openViewModal = (product: Product) => {
    setSelectedProduct(product);
    setIsViewing(true);
    setActiveDropdown(null);
  };

  const resetForm = () => {
    setProductForm({ name: '', price: 0, category: '', image: '', additionalImages: [], description: '', rating: 5, soldOut: false });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('جميع التصنيفات');
  const [sortOrder, setSortOrder] = useState('الأحدث أولاً');

  const categories = ['جميع التصنيفات', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredAndSortedProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'جميع التصنيفات' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'السعر: من الأقل للأعلى') return a.price - b.price;
      if (sortOrder === 'السعر: من الأعلى للأقل') return b.price - a.price;
      return b.id - a.id; // Default to newest first
    });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, sortOrder]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">إدارة المنتجات</h1>
          <p className="text-slate-400 font-bold mt-1">تحكم في مخزونك ومنتجاتك بكل سهولة.</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="bg-brand-primary text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-3 group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(isAdding || isEditing) && (
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
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50">
                <h2 className="text-2xl font-black text-slate-800">{isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form id="productForm" onSubmit={isEditing ? handleEditSubmit : handleAddSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">اسم المنتج</label>
                        <input 
                          type="text" 
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold"
                          placeholder="مثال: طقم دلة خشبي"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2">السعر (ر.س)</label>
                          <input 
                            type="number" 
                            required
                            min="0"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2">التصنيف</label>
                          <input 
                            type="text" 
                            value={productForm.category}
                            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold"
                            placeholder="مثال: أواني"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-black text-slate-700 mb-2">التقييم (1-5)</label>
                          <input 
                            type="number" 
                            min="1"
                            max="5"
                            step="0.1"
                            value={productForm.rating}
                            onChange={(e) => setProductForm({...productForm, rating: parseFloat(e.target.value) || 5})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">الوصف</label>
                        <textarea 
                          rows={4}
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold resize-none"
                          placeholder="اكتب وصفاً جذاباً للمنتج..."
                        ></textarea>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">صورة المنتج الأساسية</label>
                        <div className="space-y-4">
                          <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center relative group">
                            {productForm.image ? (
                              <>
                                <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button type="button" onClick={() => setProductForm({...productForm, image: ''})} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="text-center p-6">
                                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-bold">ارفع صورة المنتج</p>
                              </div>
                            )}
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUploading}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                          <input 
                            type="url" 
                            value={productForm.image}
                            onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                            placeholder="أو ضع رابط الصورة هنا..."
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary text-left text-xs font-bold"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-4">صور إضافية للمنتج</label>
                    <div className="flex flex-wrap gap-4">
                      {productForm.additionalImages?.map((img, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                          <img src={img} alt={`Additional ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center hover:border-brand-primary transition-colors cursor-pointer group">
                        <Plus className="w-6 h-6 text-slate-300 group-hover:text-brand-primary transition-colors" />
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImageUpload}
                          disabled={isUploading}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <input 
                      type="checkbox" 
                      id="soldOut"
                      checked={productForm.soldOut}
                      onChange={(e) => setProductForm({...productForm, soldOut: e.target.checked})}
                      className="w-5 h-5 text-brand-primary rounded-lg focus:ring-brand-primary border-slate-300"
                    />
                    <label htmlFor="soldOut" className="text-sm font-black text-amber-900 cursor-pointer select-none">تحديد كمنتج "نفدت الكمية"</label>
                  </div>
                </form>
              </div>
              <div className="p-8 border-t border-slate-100 flex gap-4 shrink-0 bg-slate-50/50">
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(false); }} className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-white transition-all">
                  إلغاء
                </button>
                <button type="submit" form="productForm" className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20">
                  {isEditing ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Modal */}
        {isViewing && selectedProduct && (
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
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-black text-slate-800">تفاصيل المنتج</h2>
                <button onClick={() => setIsViewing(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                      {selectedProduct.additionalImages?.map((img, i) => (
                        <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <span className="px-4 py-1.5 bg-brand-bg text-brand-primary rounded-full text-xs font-black uppercase tracking-wider">
                        {selectedProduct.category || 'عام'}
                      </span>
                      <h3 className="text-4xl font-black text-slate-800 mt-4 tracking-tight">{selectedProduct.name}</h3>
                      <p className="text-3xl font-black text-brand-primary mt-4">{selectedProduct.price.toFixed(2)} ر.س</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">الوصف</h4>
                      <p className="text-slate-600 font-bold leading-relaxed">{selectedProduct.description || 'لا يوجد وصف لهذا المنتج.'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                        <p className="text-xs font-black text-slate-400 mb-1">الحالة</p>
                        <span className={`text-sm font-black ${selectedProduct.soldOut ? 'text-red-500' : 'text-emerald-500'}`}>
                          {selectedProduct.soldOut ? 'نفدت الكمية' : 'متوفر في المخزون'}
                        </span>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                        <p className="text-xs font-black text-slate-400 mb-1">التقييم</p>
                        <span className="text-sm font-black text-amber-500">⭐ {selectedProduct.rating}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button onClick={() => openEditModal(selectedProduct)} className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2">
                        <Edit className="w-5 h-5" />
                        <span>تعديل المنتج</span>
                      </button>
                      <button className="p-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">
                        <ExternalLink className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="ابحث عن منتج بالاسم أو التصنيف..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all font-bold text-slate-700"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-black text-slate-700 text-sm cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary font-black text-slate-700 text-sm cursor-pointer"
          >
            <option>الأحدث أولاً</option>
            <option>السعر: من الأقل للأعلى</option>
            <option>السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">المنتج</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">التصنيف</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">السعر</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">التقييم</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProducts.map((product, index) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-black mt-0.5">ID: #{1000 + product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 uppercase tracking-wider">
                      {product.category || 'عام'}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-brand-primary text-sm">
                    {product.price.toFixed(2)} ر.س
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-slate-700">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black ${
                      product.soldOut 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {product.soldOut ? 'نفدت الكمية' : 'متوفر'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2 relative" ref={activeDropdown === product.id ? dropdownRef : null}>
                      <button 
                        onClick={() => openViewModal(product)}
                        className="p-2.5 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-xl transition-all" 
                        title="عرض"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" 
                        title="تعديل"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)}
                          className={`p-2.5 rounded-xl transition-all ${activeDropdown === product.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        <AnimatePresence>
                          {activeDropdown === product.id && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                            >
                              <div className="p-2">
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-xs">
                                  <ExternalLink className="w-4 h-4" />
                                  <span>رابط المنتج</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    if(confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                                      deleteProduct(product.id);
                                      setActiveDropdown(null);
                                    }
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-xs"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>حذف المنتج</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
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
    </div>
  );
}
