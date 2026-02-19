import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Save, Upload, Languages } from 'lucide-react';
import { uploadImage } from '../../lib/imageUpload';

export default function GeneralSettings() {
  const [settings, setSettings] = useState({
    offer_enabled: true,
    offer_hours: 24,
    site_logo: '',
    tooth_icon_url: '',
    edge_blend_enabled: false,
    edge_blend_width: 100,
    edge_blend_side: 'left',
    countdown_expiry_text: '',
    countdown_expiry_text_size: '16',
    countdown_expiry_text_weight: '700',
    countdown_expiry_text_align: 'center',
    countdown_glow_text: '24 soat',
    countdown_glow_color: '#0066CC',
    countdown_glow_intensity: '50',
    hero_subtitle_uz: '',
    hero_subtitle_ru: '',
    hero_subtitle_white_words_uz: '',
    hero_subtitle_white_words_ru: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [whiteWordsTab, setWhiteWordsTab] = useState<'uz' | 'ru'>('uz');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settings = await api.getSiteSettings();
      const settingsObj: any = {};
      settings.forEach((setting: any) => {
        const key = setting.key;
        if (['offer_hours', 'edge_blend_width', 'countdown_expiry_text_size', 'countdown_expiry_text_weight', 'countdown_glow_intensity'].includes(key)) {
          settingsObj[key] = parseFloat(setting.value);
        } else {
          settingsObj[key] = setting.value;
        }
      });
      setSettings((prev) => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const logoUrl = await uploadImage(file, 'logos');
      setSettings({ ...settings, site_logo: logoUrl });
      await api.updateSiteSetting('site_logo', logoUrl);

      setMessage('Logo muvaffaqiyatli yuklandi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage('Logo yuklashda xatolik yuz berdi!');
    } finally {
      setUploading(false);
    }
  };

  const handleToothIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const iconUrl = await uploadImage(file, 'logos');
      setSettings({ ...settings, tooth_icon_url: iconUrl });
      await api.updateSiteSetting('tooth_icon_url', iconUrl);

      setMessage('Tish belgisi muvaffaqiyatli yuklandi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading tooth icon:', error);
      setMessage('Tish belgisi yuklashda xatolik yuz berdi!');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.updateSiteSetting(key, String(value));
      }

      setMessage('Sozlamalar muvaffaqiyatli saqlandi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Xatolik yuz berdi!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Umumiy Sozlamalar</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('muvaffaqiyatli')
              ? 'bg-green-600/20 text-green-400 border border-green-600'
              : 'bg-red-600/20 text-red-400 border border-red-600'
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-neutral-700 rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Sayt logotipi
            </label>
            <div className="flex items-center gap-4">
              {settings.site_logo && (
                <img
                  src={settings.site_logo}
                  alt="Logo"
                  className="h-16 w-auto object-contain bg-white rounded p-2"
                />
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 hover:border-blue-500 transition-colors">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Yuklanmoqda...' : 'Logo yuklash'}
                </div>
              </label>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Oq fonsiz (shaffof) PNG formatdagi logo tavsiya etiladi
            </p>
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Tish belgisi (Badge Icon)
            </label>
            <div className="flex items-center gap-4">
              {settings.tooth_icon_url && (
                <div className="h-16 w-16 bg-black rounded p-2 flex items-center justify-center">
                  <img
                    src={settings.tooth_icon_url}
                    alt="Tooth Icon"
                    className="h-12 w-12 object-contain"
                  />
                </div>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleToothIconUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 hover:border-blue-500 transition-colors">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Yuklanmoqda...' : 'Tish belgisi yuklash'}
                </div>
              </label>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Ko'k rangdagi neon tish belgisi PNG formatda yuklang. Bu belgi sahifaning yuqori qismidagi badge'da ko'rsatiladi.
            </p>
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <div>
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={settings.offer_enabled}
                  onChange={(e) => setSettings({ ...settings, offer_enabled: e.target.checked })}
                  className="w-4 h-4"
                />
                Taklifni yoqish
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Taklif vaqti (soatlar)
            </label>
            <input
              type="number"
              value={settings.offer_hours}
              onChange={(e) => setSettings({ ...settings, offer_hours: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Video/Rasm Chekkalarini Yumshatish</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Video yoki rasm fon bilan keskin chegaraga ega bo'lganda, yumshoq o'tish effekti qo'shadi
            </p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={settings.edge_blend_enabled}
                    onChange={(e) => setSettings({ ...settings, edge_blend_enabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Chekka yumshatishni yoqish
                </label>
              </div>

              {settings.edge_blend_enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Yumshatish kengligi (piksel): {settings.edge_blend_width}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="10"
                      value={settings.edge_blend_width}
                      onChange={(e) => setSettings({ ...settings, edge_blend_width: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>0px</span>
                      <span>300px</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Yumshatish tomoni
                    </label>
                    <select
                      value={settings.edge_blend_side}
                      onChange={(e) => setSettings({ ...settings, edge_blend_side: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="left">Chap tomon</option>
                      <option value="right">O'ng tomon</option>
                      <option value="both">Ikkala tomon</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Countdown Sozlamalari</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Sticky countdown qutisidagi taklif tugash matni va glow effektini sozlang
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Taklif Tugash Matni
                </label>
                <input
                  type="text"
                  value={settings.countdown_expiry_text}
                  onChange={(e) => setSettings({ ...settings, countdown_expiry_text: e.target.value })}
                  placeholder="Taklif faqat 24 soat davomida amal qiladi."
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Shrift O'lchami (px)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="40"
                    value={settings.countdown_expiry_text_size}
                    onChange={(e) => setSettings({ ...settings, countdown_expiry_text_size: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Shrift Og'irligi (400-900)
                  </label>
                  <input
                    type="number"
                    min="400"
                    max="900"
                    step="100"
                    value={settings.countdown_expiry_text_weight}
                    onChange={(e) => setSettings({ ...settings, countdown_expiry_text_weight: e.target.value })}
                    className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-600 pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">Glow Effekti Sozlamalari</h4>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Glow Effekti Berilishi Kerak Bo'lgan Matn
                  </label>
                  <input
                    type="text"
                    value={settings.countdown_glow_text}
                    onChange={(e) => setSettings({ ...settings, countdown_glow_text: e.target.value })}
                    placeholder="masalan: 24 soat"
                    className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Masalan: "24 soat" matni mavjud bo'lsa va siz "24 soat" yozsangiz, faqat bu matn glow qiladi.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Glow Rangi
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.countdown_glow_color}
                        onChange={(e) => setSettings({ ...settings, countdown_glow_color: e.target.value })}
                        className="w-16 h-10 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.countdown_glow_color}
                        onChange={(e) => setSettings({ ...settings, countdown_glow_color: e.target.value })}
                        className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Glow Intensivligi: {settings.countdown_glow_intensity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.countdown_glow_intensity}
                      onChange={(e) => setSettings({ ...settings, countdown_glow_intensity: e.target.value })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>Yo'q</span>
                      <span>Maksimum</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Hero Bo'limi Subtitle Matni va Oq Rangdagi So'zlar</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Hero bo'limidagi subtitle matnini va qaysi so'zlar oq rangda ko'rinishini belgilang
            </p>

            <div className="mb-4 flex gap-2 border-b border-neutral-600">
              <button
                onClick={() => setWhiteWordsTab('uz')}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                  whiteWordsTab === 'uz'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Languages className="w-4 h-4" />
                O'zbek tili
              </button>
              <button
                onClick={() => setWhiteWordsTab('ru')}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
                  whiteWordsTab === 'ru'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Languages className="w-4 h-4" />
                Русский язык
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  {whiteWordsTab === 'uz' ? 'To\'liq Subtitle Matni (O\'zbek)' : 'Полный текст субтитра (Русский)'}
                </label>
                <textarea
                  value={whiteWordsTab === 'uz' ? settings.hero_subtitle_uz : settings.hero_subtitle_ru}
                  onChange={(e) => setSettings({
                    ...settings,
                    [whiteWordsTab === 'uz' ? 'hero_subtitle_uz' : 'hero_subtitle_ru']: e.target.value
                  })}
                  rows={4}
                  placeholder={
                    whiteWordsTab === 'uz'
                      ? 'Atigi 1 ta tashrifda, bor-yo\'g\'i 60 daqiqa ichida sarg\'aygan tishlar va "og\'zimdan hid keladimi?" degan ichki xavotirdan butunlay xalos bo\'ling...'
                      : 'Всего за 1 визит, всего за 60 минут избавьтесь от пожелтевших зубов и неприятного запаха...'
                  }
                  className="w-full px-4 py-3 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-neutral-400 mt-1">
                  {whiteWordsTab === 'uz'
                    ? 'Bu matn hero bo\'limida ko\'rsatiladi'
                    : 'Этот текст будет отображаться в разделе hero'}
                </p>
              </div>

              <div className="border-t border-neutral-600 pt-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  {whiteWordsTab === 'uz' ? 'O\'zbek tilida oq rangdagi so\'zlar' : 'Белые слова на русском языке'}
                </label>
                <textarea
                  value={whiteWordsTab === 'uz' ? settings.hero_subtitle_white_words_uz : settings.hero_subtitle_white_words_ru}
                  onChange={(e) => setSettings({
                    ...settings,
                    [whiteWordsTab === 'uz' ? 'hero_subtitle_white_words_uz' : 'hero_subtitle_white_words_ru']: e.target.value
                  })}
                  rows={5}
                  placeholder={
                    whiteWordsTab === 'uz'
                      ? '60 daqiqa,sarg\'aygan tishlar,noxush hidlardan,yorqin,ishonchli tabassumga'
                      : '60 минут,пожелтевших зубов,неприятного запаха,яркую,уверенную улыбку'
                  }
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
                />
                <p className="text-xs text-neutral-400 mt-2">
                  {whiteWordsTab === 'uz'
                    ? 'So\'zlarni vergul bilan ajrating. Masalan: 60 daqiqa,yorqin tabassumga'
                    : 'Разделяйте слова запятыми. Например: 60 минут,яркую улыбку'}
                </p>
                <div className="mt-4 p-4 bg-neutral-600 rounded-lg">
                  <p className="text-xs text-neutral-300 font-semibold mb-2">
                    {whiteWordsTab === 'uz' ? 'Namuna:' : 'Пример:'}
                  </p>
                  <div className="text-sm text-neutral-400 leading-relaxed">
                    {whiteWordsTab === 'uz' ? (
                      <>
                        Atigi <span className="text-white font-medium">60 daqiqa</span> ichida <span className="text-white font-medium">sarg'aygan tishlar</span> va <span className="text-white font-medium">noxush hidlardan</span> xalos bo'ling. <span className="text-white font-medium">Yorqin</span> va <span className="text-white font-medium">ishonchli tabassumga</span> ega bo'ling!
                      </>
                    ) : (
                      <>
                        Всего за <span className="text-white font-medium">60 минут</span> избавьтесь от <span className="text-white font-medium">пожелтевших зубов</span> и <span className="text-white font-medium">неприятного запаха</span>. Получите более <span className="text-white font-medium">яркую</span> и <span className="text-white font-medium">уверенную улыбку</span>!
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
