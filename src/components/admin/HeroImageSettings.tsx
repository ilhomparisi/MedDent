import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RotateCcw } from 'lucide-react';

const DEFAULT_WIDTH = 236;
const DEFAULT_HEIGHT = 436;
const MIN_WIDTH = 150;
const MAX_WIDTH = 500;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 700;

export default function HeroImageSettings() {
  const [outerWidth, setOuterWidth] = useState(DEFAULT_WIDTH);
  const [outerHeight, setOuterHeight] = useState(DEFAULT_HEIGHT);
  const [cardImage, setCardImage] = useState('');
  const [ovalFrameBorderColor, setOvalFrameBorderColor] = useState('#2563eb');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchCardImage();
    fetchOvalFrameBorderColor();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['hero_image_outer_width', 'hero_image_outer_height']);

      if (error) throw error;

      const settings: Record<string, string> = {};
      data?.forEach((setting) => {
        settings[setting.key] = setting.value;
      });

      if (settings.hero_image_outer_width) {
        setOuterWidth(parseInt(settings.hero_image_outer_width, 10));
      }
      if (settings.hero_image_outer_height) {
        setOuterHeight(parseInt(settings.hero_image_outer_height, 10));
      }
    } catch (error) {
      console.error('Error fetching hero image settings:', error);
      showMessage('error', 'Sozlamalarni yuklashda xatolik');
    }
  };

  const fetchCardImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_card_image')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setCardImage(data.value as string);
      }
    } catch (error) {
      console.error('Error fetching card image:', error);
    }
  };

  const fetchOvalFrameBorderColor = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_oval_frame_border_color')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setOvalFrameBorderColor(data.value as string);
      }
    } catch (error) {
      console.error('Error fetching oval frame border color:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = [
        { key: 'hero_image_outer_width', value: outerWidth.toString(), category: 'appearance' },
        { key: 'hero_image_outer_height', value: outerHeight.toString(), category: 'appearance' },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      showMessage('success', 'Sozlamalar muvaffaqiyatli saqlandi');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Sozlamalarni saqlashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOuterWidth(DEFAULT_WIDTH);
    setOuterHeight(DEFAULT_HEIGHT);
  };

  const innerWidth = Math.max(0, outerWidth - 48);
  const innerHeight = Math.max(0, outerHeight - 48);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Hero Rasm O'lchami</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Kenglik (Width)
              </label>
              <span className="text-sm text-gray-500">{outerWidth}px</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={MIN_WIDTH}
                max={MAX_WIDTH}
                value={outerWidth}
                onChange={(e) => setOuterWidth(parseInt(e.target.value, 10))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min={MIN_WIDTH}
                max={MAX_WIDTH}
                value={outerWidth}
                onChange={(e) => setOuterWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parseInt(e.target.value, 10) || MIN_WIDTH)))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{MIN_WIDTH}px</span>
              <span>{MAX_WIDTH}px</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Balandlik (Height)
              </label>
              <span className="text-sm text-gray-500">{outerHeight}px</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={MIN_HEIGHT}
                max={MAX_HEIGHT}
                value={outerHeight}
                onChange={(e) => setOuterHeight(parseInt(e.target.value, 10))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                min={MIN_HEIGHT}
                max={MAX_HEIGHT}
                value={outerHeight}
                onChange={(e) => setOuterHeight(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, parseInt(e.target.value, 10) || MIN_HEIGHT)))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{MIN_HEIGHT}px</span>
              <span>{MAX_HEIGHT}px</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Jonli Ko'rinish (Live Preview)</h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tashqi o'lcham:</span>
            <span className="font-medium text-gray-900">{outerWidth}px × {outerHeight}px</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Ichki o'lcham:</span>
            <span className="font-medium text-gray-900">{innerWidth}px × {innerHeight}px</span>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8">
          <div
            className="oval-frame-outer"
            style={{
              width: `${outerWidth}px`,
              height: `${outerHeight}px`,
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '0px',
              border: `16px solid ${ovalFrameBorderColor}`,
              transition: 'all 0.2s ease-out',
            }}
          >
            <div
              className="oval-frame-inner"
              style={{
                width: `${innerWidth}px`,
                height: `${innerHeight}px`,
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
                backgroundColor: '#e5e7eb',
              }}
            >
              {cardImage ? (
                <img
                  src={cardImage}
                  alt="Hero Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <p className="text-sm">Rasm yuklanmagan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
