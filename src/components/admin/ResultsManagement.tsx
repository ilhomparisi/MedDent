import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { uploadReviewImage, deleteReviewImage } from '../../lib/imageUpload';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

interface Review {
  _id?: string;
  id?: string;
  patient_name: string;
  rating: number;
  review_text: string;
  image_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export default function ResultsManagement() {
  const [resultImages, setResultImages] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    cta_text: 'Yours can be the next one.',
    cta_text_size: '20',
    cta_text_weight: '400',
    cta_text_align: 'center',
    button_text: 'YES! GIVE ME ACCESS NOW',
    button_text_size_desktop: '18',
    button_text_size_mobile: '16',
    button_url: '#booking',
    button_enabled: true,
    subtext: 'Secure your access today and start your journey.',
    subtext_size: '14',
    subtext_align: 'center',
    shadow_opacity: '0.9',
    solid_blue_width: '64',
    shadow_width: '192',
  });

  useEffect(() => {
    fetchResultImages();
    fetchSettings();
  }, []);

  const fetchResultImages = async () => {
    try {
      const data = await api.getReviews();
      const filtered = data
        .filter((r: any) => r.is_approved && r.image_url)
        .map((r: any) => ({ ...r, id: r._id || r.id }))
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setResultImages(filtered);
    } catch (error) {
      console.error('Error fetching result images:', error);
      setMessage('Rasmlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const settings = await api.getSiteSettings();
      const settingsObj: any = {};
      settings.forEach((setting: any) => {
        if (setting.key.startsWith('results_')) {
          const key = setting.key.replace('results_', '');
          settingsObj[key] = setting.value;
        }
      });
      setSettings(prev => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      await api.updateSiteSetting(`results_${key}`, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      setMessage('Sozlamalar saqlandi!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage('Sozlamalarni saqlashda xatolik!');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of Array.from(files)) {
      try {
        const result = await uploadReviewImage(file);

        if (result.success && result.url) {
          await api.createReview({
            patient_name: 'Bemor',
            rating: 5,
            review_text: 'Natija rasmi',
            is_approved: true,
            image_url: result.url,
          });
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error('Error saving image:', error);
        errorCount++;
      }
    }

    setUploadingImages(false);

    if (successCount > 0) {
      setMessage(`${successCount} ta rasm muvaffaqiyatli yuklandi!`);
      fetchResultImages();
    }

    if (errorCount > 0) {
      setMessage(
        (prev) =>
          `${prev} ${errorCount} ta rasmda xatolik yuz berdi.`
      );
    }

    setTimeout(() => setMessage(''), 3000);
    e.target.value = '';
  };

  const handleDelete = async (result: Review) => {
    if (!confirm('Ushbu rasmni o\'chirmoqchimisiz?')) return;

    try {
      if (result.image_url) {
        await deleteReviewImage(result.image_url);
      }

      await api.deleteReview(result.id!);

      setMessage('Rasm muvaffaqiyatli o\'chirildi!');
      fetchResultImages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting result:', error);
      setMessage('O\'chirishda xatolik yuz berdi!');
    }
  };

  if (loading) {
    return <div className="text-white">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Natijalar</h2>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('muvaffaqiyatli') || message.includes('saqlandi')
              ? 'bg-green-600/20 text-green-400 border border-green-600'
              : 'bg-red-600/20 text-red-400 border border-red-600'
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-neutral-800 rounded-lg p-6 mb-8 border border-neutral-700">
        <h3 className="text-lg font-semibold text-white mb-4">CTA va Tugma Sozlamalari</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              CTA Matni
            </label>
            <input
              type="text"
              value={settings.cta_text}
              onChange={(e) => setSettings({ ...settings, cta_text: e.target.value })}
              onBlur={() => updateSetting('cta_text', settings.cta_text)}
              className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Matn Hajmi
              </label>
              <input
                type="number"
                value={settings.cta_text_size}
                onChange={(e) => setSettings({ ...settings, cta_text_size: e.target.value })}
                onBlur={() => updateSetting('cta_text_size', settings.cta_text_size)}
                className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Og'irligi
              </label>
              <select
                value={settings.cta_text_weight}
                onChange={(e) => {
                  setSettings({ ...settings, cta_text_weight: e.target.value });
                  updateSetting('cta_text_weight', e.target.value);
                }}
                className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Hizalama
              </label>
              <select
                value={settings.cta_text_align}
                onChange={(e) => {
                  setSettings({ ...settings, cta_text_align: e.target.value });
                  updateSetting('cta_text_align', e.target.value);
                }}
                className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg"
              >
                <option value="left">Chapga</option>
                <option value="center">Markazga</option>
                <option value="right">O'ngga</option>
              </select>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-6">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="checkbox"
                id="button_enabled"
                checked={settings.button_enabled}
                onChange={(e) => {
                  setSettings({ ...settings, button_enabled: e.target.checked });
                  updateSetting('button_enabled', e.target.checked);
                }}
                className="w-4 h-4"
              />
              <label htmlFor="button_enabled" className="text-sm font-medium text-neutral-300">
                Tugmani Ko'rsatish
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Tugma Matni
              </label>
              <input
                type="text"
                value={settings.button_text}
                onChange={(e) => setSettings({ ...settings, button_text: e.target.value })}
                onBlur={() => updateSetting('button_text', settings.button_text)}
                disabled={!settings.button_enabled}
                className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tugma Shrift O'lchami Desktop (px)
                </label>
                <input
                  type="number"
                  min="12"
                  max="32"
                  value={settings.button_text_size_desktop}
                  onChange={(e) => setSettings({ ...settings, button_text_size_desktop: e.target.value })}
                  onBlur={() => updateSetting('button_text_size_desktop', settings.button_text_size_desktop)}
                  disabled={!settings.button_enabled}
                  className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tugma Shrift O'lchami Mobile (px)
                </label>
                <input
                  type="number"
                  min="10"
                  max="28"
                  value={settings.button_text_size_mobile}
                  onChange={(e) => setSettings({ ...settings, button_text_size_mobile: e.target.value })}
                  onBlur={() => updateSetting('button_text_size_mobile', settings.button_text_size_mobile)}
                  disabled={!settings.button_enabled}
                  className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Tugma URL
              </label>
              <input
                type="text"
                value={settings.button_url}
                onChange={(e) => setSettings({ ...settings, button_url: e.target.value })}
                onBlur={() => updateSetting('button_url', settings.button_url)}
                disabled={!settings.button_enabled}
                className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg disabled:opacity-50"
              />
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Qo'shimcha Matn
            </label>
            <input
              type="text"
              value={settings.subtext}
              onChange={(e) => setSettings({ ...settings, subtext: e.target.value })}
              onBlur={() => updateSetting('subtext', settings.subtext)}
              className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg mb-4"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Matn Hajmi
                </label>
                <input
                  type="number"
                  value={settings.subtext_size}
                  onChange={(e) => setSettings({ ...settings, subtext_size: e.target.value })}
                  onBlur={() => updateSetting('subtext_size', settings.subtext_size)}
                  className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Hizalama
                </label>
                <select
                  value={settings.subtext_align}
                  onChange={(e) => {
                    setSettings({ ...settings, subtext_align: e.target.value });
                    updateSetting('subtext_align', e.target.value);
                  }}
                  className="w-full px-4 py-2 bg-neutral-700 text-white border border-neutral-600 rounded-lg"
                >
                  <option value="left">Chapga</option>
                  <option value="center">Markazga</option>
                  <option value="right">O'ngga</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Soya Quyuqligi (Shadow Opacity)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.shadow_opacity}
                onChange={(e) => {
                  setSettings({ ...settings, shadow_opacity: e.target.value });
                  updateSetting('shadow_opacity', e.target.value);
                }}
                className="flex-1"
              />
              <span className="text-white font-medium w-12 text-center">
                {(parseFloat(settings.shadow_opacity) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Natijalar bo'limidagi ko'k soya intensivligini sozlaydi
            </p>
          </div>

          <div className="border-t border-neutral-700 pt-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Qattiq Ko'k Fon Kengligi (Solid Blue Width)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="200"
                step="8"
                value={settings.solid_blue_width}
                onChange={(e) => {
                  setSettings({ ...settings, solid_blue_width: e.target.value });
                  updateSetting('solid_blue_width', e.target.value);
                }}
                className="flex-1"
              />
              <span className="text-white font-medium w-16 text-center">
                {settings.solid_blue_width}px
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Yon tomonlardagi qattiq ko'k fonning kengligini sozlaydi
            </p>
          </div>

          <div className="border-t border-neutral-700 pt-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Soya Kengligi (Shadow Width)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="400"
                step="8"
                value={settings.shadow_width}
                onChange={(e) => {
                  setSettings({ ...settings, shadow_width: e.target.value });
                  updateSetting('shadow_width', e.target.value);
                }}
                className="flex-1"
              />
              <span className="text-white font-medium w-16 text-center">
                {settings.shadow_width}px
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Qattiq ko'k fondan ichkariga cho'zilgan soyaning kengligini sozlaydi
            </p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Natija Rasmlari</h3>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
            {uploadingImages ? (
              <>Yuklanmoqda...</>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Rasmlar Yuklash
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
            />
          </label>
        </div>

        <div className="mb-4 text-sm text-neutral-400">
          <p>Har bir rasm 10MB gacha bo'lishi mumkin</p>
          <p>Faqat JPEG, PNG va WebP formatlarni qo'llab-quvvatlaydi</p>
          <p>Jami: {resultImages.length} ta rasm</p>
        </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resultImages.length === 0 ? (
          <div className="col-span-full bg-neutral-700 rounded-lg p-8 text-center">
            <ImageIcon className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-400">Hali natija rasmlari yo'q</p>
          </div>
        ) : (
          resultImages.map((result) => (
            <div
              key={result.id}
              className="relative bg-neutral-700 rounded-lg overflow-hidden group"
            >
              <img
                src={result.image_url!}
                alt="Natija"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(result)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}
