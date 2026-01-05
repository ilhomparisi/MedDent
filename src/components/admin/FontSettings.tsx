import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface FontOption {
  name: string;
  value: string;
  preview: string;
}

const FONT_OPTIONS: FontOption[] = [
  {
    name: 'Inter',
    value: 'Inter, system-ui, -apple-system, sans-serif',
    preview: 'Modern and professional'
  },
  {
    name: 'Roboto',
    value: 'Roboto, sans-serif',
    preview: 'Clean and readable'
  },
  {
    name: 'Open Sans',
    value: '"Open Sans", sans-serif',
    preview: 'Friendly and approachable'
  },
  {
    name: 'Poppins',
    value: 'Poppins, sans-serif',
    preview: 'Geometric and modern'
  },
  {
    name: 'Montserrat',
    value: 'Montserrat, sans-serif',
    preview: 'Bold and elegant'
  },
  {
    name: 'Lato',
    value: 'Lato, sans-serif',
    preview: 'Warm and professional'
  },
  {
    name: 'Raleway',
    value: 'Raleway, sans-serif',
    preview: 'Sophisticated and unique'
  },
  {
    name: 'Ubuntu',
    value: 'Ubuntu, sans-serif',
    preview: 'Rounded and friendly'
  },
  {
    name: 'Nunito',
    value: 'Nunito, sans-serif',
    preview: 'Soft and approachable'
  },
  {
    name: 'Playfair Display',
    value: '"Playfair Display", serif',
    preview: 'Elegant serif'
  },
  {
    name: 'Merriweather',
    value: 'Merriweather, serif',
    preview: 'Classic and readable'
  },
  {
    name: 'System Default',
    value: 'system-ui, -apple-system, sans-serif',
    preview: 'Native system font'
  }
];

export default function FontSettings() {
  const [selectedFont, setSelectedFont] = useState('');
  const [customFont, setCustomFont] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFontSettings();
  }, []);

  const loadFontSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'font_family')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        const fontValue = String(data.value).replace(/^"|"$/g, '');
        setSelectedFont(fontValue);

        const matchingFont = FONT_OPTIONS.find(f => f.value === fontValue);
        if (!matchingFont) {
          setCustomFont(fontValue);
        }
      }
    } catch (error) {
      console.error('Error loading font settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFontSettings = async () => {
    setSaving(true);
    try {
      const fontToSave = customFont.trim() || selectedFont;

      const { error } = await supabase
        .from('site_settings')
        .update({
          value: `"${fontToSave}"`,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'font_family');

      if (error) throw error;

      alert('Font settings saved successfully! The page will reload to apply changes.');
      window.location.reload();
    } catch (error) {
      console.error('Error saving font settings:', error);
      alert('Error saving font settings');
    } finally {
      setSaving(false);
    }
  };

  const handleFontSelect = (fontValue: string) => {
    setSelectedFont(fontValue);
    setCustomFont('');
  };

  const handleCustomFontChange = (value: string) => {
    setCustomFont(value);
    if (value.trim()) {
      setSelectedFont('');
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Shrift Sozlamalari</h2>
        <div className="bg-neutral-700 rounded-lg p-6">
          <p className="text-neutral-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Shrift Sozlamalari</h2>

      <div className="bg-neutral-700 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Shrift turini tanlang</h3>
          <p className="text-sm text-neutral-300 mb-4">
            Bu shrift butun sayt bo'ylab qo'llaniladi
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => handleFontSelect(font.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedFont === font.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-600 bg-neutral-800 hover:border-neutral-500'
                }`}
                style={{ fontFamily: font.value }}
              >
                <div className="font-semibold text-white mb-1">{font.name}</div>
                <div className="text-sm text-neutral-400">{font.preview}</div>
                <div className="text-xs text-neutral-500 mt-2">The quick brown fox</div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-600 pt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Yoki maxsus shrift kiriting</h3>
          <p className="text-sm text-neutral-300 mb-3">
            Google Fonts yoki boshqa shrift CSS qiymatini kiriting
          </p>

          <div className="space-y-3">
            <input
              type="text"
              value={customFont}
              onChange={(e) => handleCustomFontChange(e.target.value)}
              placeholder='Masalan: "Rubik", sans-serif'
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />

            {customFont && (
              <div
                className="p-4 bg-neutral-800 rounded-lg border border-neutral-600"
                style={{ fontFamily: customFont }}
              >
                <div className="text-white text-lg mb-2">Preview:</div>
                <div className="text-white">The quick brown fox jumps over the lazy dog</div>
                <div className="text-neutral-400 text-sm mt-2">
                  Bu yerda shrift ko'rinishi ko'rsatiladi
                </div>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-300">
                <strong>Maslahat:</strong> Google Fonts'dan shriftni import qilish uchun, index.html fayliga link qo'shish kerak.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-600 pt-6">
          <button
            onClick={saveFontSettings}
            disabled={saving || (!selectedFont && !customFont.trim())}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {saving ? 'Saqlanmoqda...' : 'Shriftni Saqlash'}
          </button>
        </div>

        {selectedFont && (
          <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
            <div className="text-sm text-neutral-400 mb-1">Joriy shrift:</div>
            <code className="text-blue-400 text-sm">{selectedFont}</code>
          </div>
        )}
      </div>
    </div>
  );
}
