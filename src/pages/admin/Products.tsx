import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit, Trash2, MoreVertical, X, Upload, Loader2 } from 'lucide-react';
import { useStore, Product } from '../../store/useStore';
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminProducts() {
  const products = useStore((state) => state.products);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: '',
    image: '',
    additionalImages: [] as string[],
    description: '',
    rating: 5,
    reviews: 0,
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
      alert('حدث خطأ أثناء رفع الصورة');
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
      alert('حدث خطأ أثناء رفع الصور الإضافية');
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
      await addProduct({
        ...productForm,
        image: productForm.image || 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80'
      });
      setIsAdding(false);
      resetForm();
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && productForm.name && productForm.price > 0) {
      await updateProduct(editingId, {
        ...productForm,
        image: productForm.image || 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80'
      });
      setIsEditing(false);
      setEditingId(null);
      resetForm();
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
      reviews: product.reviews,
      soldOut: product.soldOut || false
    });
    setEditingId(product.id);
    setIsEditing(true);
  };

  const resetForm = () => {
    setProductForm({ name: '', price: 0, category: '', image: '', additionalImages: [], description: '', rating: 5, reviews: 0, soldOut: false });
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

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-8">
        <h1 className="text-2xl font-black text-gray-800">إدارة المنتجات</h1>
        <button 
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-secondary transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(isAdding || isEditing) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <h2 className="text-xl font-black text-gray-800">{isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form id="productForm" onSubmit={isEditing ? handleEditSubmit : handleAddSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">اسم المنتج</label>
                    <input 
                      type="text" 
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">السعر (ر.س)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">التصنيف</label>
                      <input 
                        type="text" 
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
                    <textarea 
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">صورة المنتج الأساسية</label>
                    <div className="flex gap-4 items-start">
                      {productForm.image && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <input 
                          type="url" 
                          value={productForm.image}
                          onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                          placeholder="رابط الصورة (https://...)"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left"
                          dir="ltr"
                        />
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <div className={`flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brand-primary hover:text-brand-primary transition-colors ${isUploading ? 'opacity-50 bg-gray-50' : 'bg-white'}`}>
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            <span className="font-bold text-sm">
                              {isUploading ? 'جاري الرفع...' : 'أو ارفع صورة من جهازك'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">صور إضافية للمنتج</label>
                    <div className="space-y-3">
                      {productForm.additionalImages && productForm.additionalImages.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                          {productForm.additionalImages.map((img, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                              <img src={img} alt={`Additional ${index + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImageUpload}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className={`flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brand-primary hover:text-brand-primary transition-colors ${isUploading ? 'opacity-50 bg-gray-50' : 'bg-white'}`}>
                          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                          <span className="font-bold text-sm">
                            {isUploading ? 'جاري الرفع...' : 'ارفع صور إضافية'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="soldOut"
                      checked={productForm.soldOut}
                      onChange={(e) => setProductForm({...productForm, soldOut: e.target.checked})}
                      className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary"
                    />
                    <label htmlFor="soldOut" className="text-sm font-bold text-gray-700">نفدت الكمية</label>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0 bg-gray-50">
                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(false); }} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-white transition-colors">
                  إلغاء
                </button>
                <button type="submit" form="productForm" className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary transition-colors">
                  {isEditing ? 'حفظ التعديلات' : 'إضافة'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث عن منتج..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium"
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-primary font-bold text-gray-700"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-primary font-bold text-gray-700"
        >
          <option>الأحدث أولاً</option>
          <option>السعر: من الأقل للأعلى</option>
          <option>السعر: من الأعلى للأقل</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-black text-gray-600">المنتج</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">التصنيف</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">السعر</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-black text-gray-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product, index) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500 font-bold">ID: #{1000 + product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                      {product.category || 'عام'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-brand-primary">
                    {product.price.toFixed(2)} ر.س
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      product.soldOut 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {product.soldOut ? 'نفدت الكمية' : 'متوفر'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors" 
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
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
            عرض {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedProducts.length)} إلى {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} من {filteredAndSortedProducts.length} منتج
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
