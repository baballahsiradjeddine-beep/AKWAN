import { motion } from 'motion/react';
import { Save, Globe, CreditCard, Truck, Bell, Shield, Store, Image as ImageIcon, Type, Link as LinkIcon, Upload, Loader2, Handshake, Plus, Trash2, MessageSquareQuote } from 'lucide-react';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useStore, SiteSettings } from '../../store/useStore';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import AdminTestimonials from '../../components/admin/Testimonials';
import { useTranslation } from 'react-i18next';

export default function AdminSettings() {
  const { t } = useTranslation();
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
      toast.error(t('only_image_file_allowed'));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('image_size_limit'));
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
      
      toast.success(t('image_uploaded_success'));
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`${t('upload_failed')}: ${error.message}`);
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
    setSaveMessage(t('saving_and_translating')); // Saving and translating
    try {
      const translatedData = { ...formData };
      const { translateText } = await import('../../utils/translate');

      const fieldsToTranslate = [
        ['announcementText', 'announcementTextEn'],
        ['heroTitle', 'heroTitleEn'],
        ['heroSubtitle', 'heroSubtitleEn'],
        ['heroButtonText', 'heroButtonTextEn'],
        ['aboutTitle', 'aboutTitleEn'],
        ['aboutSubtitle', 'aboutSubtitleEn'],
        ['footerDescription', 'footerDescriptionEn'],
      ] as const;

      for (const [arField, enField] of fieldsToTranslate) {
        if (translatedData[arField]) {
          translatedData[enField] = await translateText(translatedData[arField]);
        }
      }

      await updateSettings(translatedData);
      setFormData(translatedData);
      setSaveMessage(t('save_translate_success'));
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setSaveMessage(`${t('error_occurred')}: ${error.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const tabs = [
    { id: 'general', label: t('general_settings', 'عام'), icon: Store },
    { id: 'content', label: t('site_content', 'محتوى الموقع'), icon: Type },
    { id: 'images', label: t('images_settings', 'الصور'), icon: ImageIcon },
    { id: 'social', label: t('social_media', 'التواصل الاجتماعي'), icon: LinkIcon },
    { id: 'partners', label: t('partners', 'الشركاء'), icon: Handshake },
    { id: 'testimonials', label: t('testimonials', 'آراء العملاء'), icon: MessageSquareQuote },
    { id: 'payment', label: t('payment_settings', 'الدفع'), icon: CreditCard },
    { id: 'shipping', label: t('shipping_settings', 'الشحن'), icon: Truck },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">{t('settings')}</h1>
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
          <span>{isSaving ? t('saving_changes', 'جاري الحفظ...') : t('save_changes', 'حفظ التغييرات')}</span>
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
                  <h2 className="text-xl font-black text-gray-800 mb-1">{t('general_store_settings')}</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">{t('general_store_settings_desc')}</p>
                </div>
                
                <div className="space-y-6">
                  {/* Logo & Favicon Section */}
                  <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/10">
                    <h3 className="text-lg font-bold text-brand-primary mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      {t('store_identity')}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('logo_type')}</label>
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
                          <label className="block text-sm font-bold text-gray-700 mb-3">{t('logo_image_label')}</label>
                          <div 
                            onClick={() => triggerUpload('logoImage')}
                            className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center min-h-[120px] ${formData.logoImage ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-gray-200 hover:border-brand-primary/50 bg-gray-50'}`}
                          >
                            {uploadingField === 'logoImage' ? (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                                <span className="text-sm font-bold text-brand-primary">{t('uploading')}</span>
                              </div>
                            ) : formData.logoImage ? (
                              <div className="relative w-full flex flex-col items-center gap-3">
                                <img src={formData.logoImage} alt="Logo" className="max-h-24 object-contain rounded-lg" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                  <span className="text-white text-xs font-bold bg-brand-primary px-3 py-1 rounded-full">{t('change_image')}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 truncate max-w-full">{formData.logoImage}</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-gray-400">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                  <Upload className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold">{t('click_to_upload_logo')}</span>
                                <span className="text-[10px]">{t('transparent_png_preferred')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-white rounded-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3">{t('browser_favicon')}</label>
                        <div 
                          onClick={() => triggerUpload('favicon')}
                          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center min-h-[100px] ${formData.favicon ? 'border-brand-primary/30 bg-brand-primary/5' : 'border-gray-200 hover:border-brand-primary/50 bg-gray-50'}`}
                        >
                          {uploadingField === 'favicon' ? (
                            <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                          ) : formData.favicon ? (
                            <div className="flex flex-col items-center gap-2">
                              <img src={formData.favicon} alt="Favicon" className="w-10 h-10 object-contain" />
                              <span className="text-[10px] text-gray-400">{t('click_to_change')}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                              <Upload className="w-5 h-5" />
                              <span className="text-xs font-bold">{t('upload_icon')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('store_name_label')}</label>
                    <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('contact_email')}</label>
                      <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('phone_number')}</label>
                      <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('address')}</label>
                    <input type="text" name="contactAddress" value={formData.contactAddress} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('commercial_register')}</label>
                      <input type="text" name="commercialRegister" value={formData.commercialRegister} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t('tax_number_label')}</label>
                      <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">{t('site_content', 'محتوى الموقع')}</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">{t('site_content_desc')}</p>
                </div>
                
                {/* Navbar */}
                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-brand-primary">{t('top_bar')}</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('announcement_bar_label')}</label>
                    <input type="text" name="announcementText" value={formData.announcementText} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>

                {/* Hero */}
                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-brand-primary">{t('hero_section_label')}</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('main_heading')}</label>
                    <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('subheading')}</label>
                    <textarea rows={3} name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('button_text')}</label>
                    <input type="text" name="heroButtonText" value={formData.heroButtonText} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>

                {/* About */}
                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-brand-primary">{t('about_section_label')}</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('address')}</label>
                    <input type="text" name="aboutTitle" value={formData.aboutTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('subheading')}</label>
                    <textarea rows={2} name="aboutSubtitle" value={formData.aboutSubtitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary resize-none"></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-primary">{t('footer_label')}</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('short_store_desc')}</label>
                    <textarea rows={3} name="footerDescription" value={formData.footerDescription} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary resize-none"></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">{t('images_settings')}</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">{t('site_images_desc')}</p>
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
                            <span className="text-sm font-bold text-brand-primary">{t('uploading')}</span>
                          </div>
                        ) : (formData as any)[field.id] ? (
                          <div className="relative w-full flex flex-col items-center gap-4">
                            <img src={(formData as any)[field.id]} alt="Preview" className="max-h-40 w-auto object-contain rounded-xl shadow-sm" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                              <span className="bg-white text-brand-primary px-4 py-2 rounded-xl font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">{t('change_image')}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 truncate max-w-xs">{(formData as any)[field.id]}</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-gray-400">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Upload className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-gray-600">{t('click_to_upload_image')}</p>
                              <p className="text-xs">{t('or_drag_drop')}</p>
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
                  <h2 className="text-xl font-black text-gray-800 mb-1">{t('social_media')}</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">{t('social_media_desc')}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('instagram')}</label>
                    <input type="url" name="social_instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('snapchat')}</label>
                    <input type="url" name="social_snapchat" value={formData.socialLinks.snapchat} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('tiktok')}</label>
                    <input type="url" name="social_tiktok" value={formData.socialLinks.tiktok} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('facebook')}</label>
                    <input type="url" name="social_facebook" value={formData.socialLinks.facebook} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary text-left" dir="ltr" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">{t('partners')}</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">{t('partners_desc')}</p>
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
                        <span className="text-sm font-bold">{t('add_partner')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <AdminTestimonials />
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-800 mb-1">{t('shipping_settings')}</h2>
                  <p className="text-sm text-gray-500 font-medium mb-6">{t('shipping_settings_desc')}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-brand-bg/30 p-6 rounded-2xl border border-brand-primary/10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Truck className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-secondary">{t('delivery_costs')}</h3>
                        <p className="text-xs text-brand-muted font-medium">{t('delivery_costs_desc')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">{t('fixed_shipping_fee')}</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            name="shippingFee" 
                            value={formData.shippingFee} 
                            onChange={(e) => setFormData(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))} 
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary font-black text-brand-secondary" 
                            placeholder="0.00"
                            min="0"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">ر.س</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">{t('shipping_fee_note')}</p>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">{t('free_shipping_threshold')}</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            name="freeShippingThreshold" 
                            value={formData.freeShippingThreshold} 
                            onChange={(e) => setFormData(prev => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) || 0 }))} 
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary font-black text-brand-secondary" 
                            placeholder="0.00"
                            min="0"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">ر.س</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">{t('free_shipping_note')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                    <div className="shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Shield className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-800">{t('important_note')}</p>
                      <p className="text-xs text-amber-700 font-medium mt-0.5">{t('remove_shipping_fee_note')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-10 h-10 text-brand-primary opacity-50" />
                </div>
                <h3 className="text-lg font-black text-gray-800 mb-2">{t('coming_soon')}</h3>
                <p className="text-gray-500 font-medium max-w-sm">
                  هذا القسم قيد التطوير حالياً. سيتم إضافة إعدادات الدفع قريباً.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
