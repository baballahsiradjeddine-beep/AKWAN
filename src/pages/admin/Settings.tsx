import { motion } from 'motion/react';
import { Save, Globe, CreditCard, Truck, Bell, Shield, Store, Image as ImageIcon, Type, Link as LinkIcon, Upload, Loader2, Handshake, Plus, Trash2, MessageSquareQuote } from 'lucide-react';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useStore, SiteSettings } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import AdminTestimonials from '../../components/admin/Testimonials';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadField, setCurrentUploadField] = useState<string | null>(null);

  // Update local state if global settings change
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة فقط');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
      return;
    }

    setUploadingField(fieldName);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (fieldName === 'add_partner') {
        setFormData(prev => ({
          ...prev,
          partners: [...prev.partners, publicUrl]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [fieldName]: publicUrl
        }));
      }
      
      toast.success('تم رفع الصورة بنجاح');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`فشل الرفع: ${error.message || 'تأكد من وجود Bucket باسم site-assets في Supabase'}`);
    } finally {
      setUploadingField(null);
    }
  };

  const triggerUpload = (fieldName: string) => {
    setCurrentUploadField(fieldName);
    fileInputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await updateSettings(formData);
      setSaveMessage('تم حفظ الإعدادات بنجاح!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setSaveMessage(`حدث خطأ: ${error.message || 'يرجى المحاولة مرة أخرى'}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: Store },
    { id: 'content', label: 'محتوى الموقع', icon: Type },
    { id: 'images', label: 'الصور', icon: ImageIcon },
    { id: 'social', label: 'التواصل الاجتماعي', icon: LinkIcon },
    { id: 'partners', label: 'الشركاء', icon: Handshake },
    { id: 'testimonials', label: 'آراء العملاء', icon: MessageSquareQuote },
    { id: 'payment', label: 'الدفع', icon: CreditCard },
    { id: 'shipping', label: 'الشحن', icon: Truck },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">الإعدادات</h1>
          {saveMessage && (
            <p className="text-green-600 font-bold text-sm mt-1">{saveMessage}</p>
          )}
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-secondary transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <nav className="flex flex-col p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-right font-bold ${
                      isActive 
                        ? 'bg-brand-bg text-brand-primary' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={(e) => currentUploadField && handleFileUpload(e, currentUploadField)}
          />
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">إعدادات المتجر العامة</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">قم بتحديث معلومات متجرك الأساسية والهوية البصرية.</p>
                </div>
                
                <div className="space-y-6">
                  {/* Logo & Favicon Section */}
                  <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10">
                    <h3 className="text-lg font-bold text-brand-primary mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      هوية المتجر (الشعار والـ Favicon)
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">نوع الشعار</label>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, logoType: 'text' }))}
                            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all border-2 ${formData.logoType === 'text' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-100 hover:border-brand-primary/30'}`}
                          >
                            نص (اسم المتجر)
                          </button>
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, logoType: 'image' }))}
                            className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all border-2 ${formData.logoType === 'image' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-100 hover:border-brand-primary/30'}`}
                          >
                            صورة (Logo)
                          </button>
                        </div>
                      </div>

                      {formData.logoType === 'image' && (
                        <div className="p-4 bg-white rounded-xl border border-gray-100">
                          <label className="block text-sm font-bold text-gray-700 mb-3">صورة الشعار</label>
                          <div 
                            onClick={() => triggerUpload('logoImage')}
                            className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center min-h-[120px] ${formData.logoImage ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-gray-200 hover:border-brand-primary/50 bg-gray-50'}`}
                          >
                            {uploadingField === 'logoImage' ? (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                                <span className="text-sm font-bold text-brand-primary">جاري الرفع...</span>
                              </div>
                            ) : formData.logoImage ? (
                              <div className="relative w-full flex flex-col items-center gap-3">
                                <img src={formData.logoImage} alt="Logo" className="max-h-24 object-contain rounded-lg" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                  <span className="text-white text-xs font-bold bg-brand-primary px-3 py-1 rounded-full">تغيير الصورة</span>
                                </div>
                                <p className="text-[10px] text-gray-400 truncate max-w-full">{formData.logoImage}</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-gray-400">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                  <Upload className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold">اضغط لرفع الشعار</span>
                                <span className="text-[10px]">يفضل خلفية شفافة PNG</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-white rounded-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3">أيقونة المتصفح (Favicon)</label>
                        <div 
                          onClick={() => triggerUpload('favicon')}
                          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center min-h-[100px] ${formData.favicon ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-gray-200 hover:border-brand-primary/50 bg-gray-50'}`}
                        >
                          {uploadingField === 'favicon' ? (
                            <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                          ) : formData.favicon ? (
                            <div className="flex flex-col items-center gap-2">
                              <img src={formData.favicon} alt="Favicon" className="w-10 h-10 object-contain" />
                              <span className="text-[10px] text-gray-400">اضغط للتغيير</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span className="text-xs font-bold">رفع أيقونة</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">اسم المتجر</label>
                    <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">البريد الإلكتروني للتواصل</label>
                      <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
                      <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">العنوان</label>
                    <input type="text" name="contactAddress" value={formData.contactAddress} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">السجل التجاري</label>
                      <input type="text" name="commercialRegister" value={formData.commercialRegister} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">الرقم الضريبي</label>
                      <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">محتوى الموقع</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">تعديل النصوص الثابتة في صفحات الموقع.</p>
                </div>
                
                {/* Navbar */}
                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-brand-primary">الشريط العلوي</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">شريط الإعلانات (اتركه فارغاً لإخفائه)</label>
                    <input type="text" name="announcementText" value={formData.announcementText} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>

                {/* Hero */}
                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-brand-primary">القسم الرئيسي (الرئيسية)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">العنوان الرئيسي</label>
                    <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">النص الفرعي</label>
                    <textarea rows={3} name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">نص الزر</label>
                    <input type="text" name="heroButtonText" value={formData.heroButtonText} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>

                {/* About */}
                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-brand-primary">قسم من نحن</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">العنوان</label>
                    <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">النص الفرعي</label>
                    <textarea rows={2} name="aboutSubtitle" value={formData.aboutSubtitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary resize-none"></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-primary">الفوتر (أسفل الصفحة)</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">وصف المتجر القصير</label>
                    <textarea rows={3} name="footerDescription" value={formData.footerDescription} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">صور الموقع</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">تغيير الصور الثابتة في الموقع (رفع مباشر أو روابط).</p>
                </div>
                
                <div className="space-y-8">
                  {[
                    { id: 'heroImage', label: 'صورة القسم الرئيسي (Hero)' },
                    { id: 'aboutImage1', label: 'صورة من نحن 1' },
                    { id: 'aboutImage2', label: 'صورة من نحن 2' }
                  ].map((field) => (
                    <div key={field.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <label className="block text-sm font-bold text-gray-700 mb-3">{field.label}</label>
                      <div 
                        onClick={() => triggerUpload(field.id)}
                        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[160px] ${(formData as any)[field.id] ? 'border-brand-primary/30 bg-white' : 'border-gray-200 hover:border-brand-primary/50 bg-gray-50'}`}
                      >
                        {uploadingField === field.id ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                            <span className="text-sm font-bold text-brand-primary">جاري الرفع...</span>
                          </div>
                        ) : (formData as any)[field.id] ? (
                          <div className="relative w-full flex flex-col items-center gap-4">
                            <img src={(formData as any)[field.id]} alt="Preview" className="max-h-40 w-auto object-contain rounded-xl shadow-sm" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                              <span className="bg-white text-brand-primary px-4 py-2 rounded-xl font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">تغيير الصورة</span>
                            </div>
                            <p className="text-[10px] text-gray-400 truncate max-w-xs">{(formData as any)[field.id]}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Upload className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-gray-600">اضغط لرفع الصورة</p>
                              <p className="text-xs">أو اسحب الملف هنا</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">التواصل الاجتماعي</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">روابط حسابات المتجر على منصات التواصل.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">انستغرام</label>
                    <input type="url" name="social_instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">سناب شات</label>
                    <input type="url" name="social_snapchat" value={formData.socialLinks.snapchat} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">تيك توك</label>
                    <input type="url" name="social_tiktok" value={formData.socialLinks.tiktok} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">فيسبوك</label>
                    <input type="url" name="social_facebook" value={formData.socialLinks.facebook} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">شركاؤنا</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">إدارة شعارات الشركاء التي تظهر في الصفحة الرئيسية.</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.partners.map((logo, index) => (
                    <div key={index} className="relative group bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center min-h-[120px]">
                      <img src={logo} alt={`Partner ${index + 1}`} className="max-h-16 w-auto object-contain mb-2" />
                      <button 
                        onClick={() => {
                          const newPartners = [...formData.partners];
                          newPartners.splice(index, 1);
                          setFormData(prev => ({ ...prev, partners: newPartners }));
                        }}
                        className="absolute -top-2 -left-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => triggerUpload('add_partner')}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-brand-primary/50 hover:bg-brand-bg/20 transition-all flex flex-col items-center justify-center min-h-[120px] text-gray-400 hover:text-brand-primary"
                  >
                    {uploadingField === 'add_partner' ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">إضافة شريك</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <AdminTestimonials />
            )}

            {['payment', 'shipping'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                  <Store className="w-10 h-10 text-brand-primary opacity-50" />
                </div>
                <h3 className="text-lg font-black text-gray-800 mb-2">قريباً </h3>
                <p className="text-gray-500 font-medium max-w-sm">
                  هذا القسم قيد التطوير حالياً. سيتم إضافة إعدادات {tabs.find(t => t.id === activeTab)?.label} قريباً.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
