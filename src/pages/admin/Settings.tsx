import { motion } from 'motion/react';
import { Save, Globe, CreditCard, Truck, Bell, Shield, Store, Image as ImageIcon, Type, Link as LinkIcon } from 'lucide-react';
import { useState, useEffect, ChangeEvent } from 'react';
import { useStore, SiteSettings } from '../../store/useStore';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Update local state if global settings change
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

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
    } catch (error) {
      setSaveMessage('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.');
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
                  <p className="text-sm text-gray-500 font-medium mb-6">قم بتحديث معلومات متجرك الأساسية.</p>
                </div>
                
                <div className="space-y-4">
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
                  <p className="text-sm text-gray-500 font-medium mb-6">تغيير الصور الثابتة في الموقع (ضع روابط الصور).</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">صورة القسم الرئيسي (Hero)</label>
                    <div className="flex gap-4 items-start">
                      <input type="text" name="heroImage" value={formData.heroImage} onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                      {formData.heroImage && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <img src={formData.heroImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">صورة من نحن 1</label>
                    <div className="flex gap-4 items-start">
                      <input type="text" name="aboutImage1" value={formData.aboutImage1} onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                      {formData.aboutImage1 && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <img src={formData.aboutImage1} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">صورة من نحن 2</label>
                    <div className="flex gap-4 items-start">
                      <input type="text" name="aboutImage2" value={formData.aboutImage2} onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                      {formData.aboutImage2 && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <img src={formData.aboutImage2} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">تويتر (X)</label>
                    <input type="url" name="social_twitter" value={formData.socialLinks.twitter} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">فيسبوك</label>
                    <input type="url" name="social_facebook" value={formData.socialLinks.facebook} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                </div>
              </div>
            )}

            {['payment', 'shipping'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                  <Store className="w-10 h-10 text-brand-primary opacity-50" />
                </div>
                <h3 className="text-lg font-black text-gray-800 mb-2">قريباً</h3>
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
