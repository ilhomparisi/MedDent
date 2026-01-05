import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

export default function ColorSettings() {
  const [colors, setColors] = useState({
    primary_color: '#2563eb',
    secondary_color: '#dc2626',
    accent_color: '#0891b2',
    hero_oval_frame_border_color: '#2563eb',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['primary_color', 'secondary_color', 'accent_color', 'hero_oval_frame_border_color']);

      if (error) throw error;

      const colorsObj: any = {};
      data?.forEach((setting) => {
        colorsObj[setting.key] = setting.value;
      });

      setColors((prev) => ({ ...prev, ...colorsObj }));
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const updates = Object.entries(colors).map(([key, value]) => ({
        key,
        value: value,
        category: 'colors',
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' });

        if (error) throw error;
      }

      setMessage('Ranglar muvaffaqiyatli saqlandi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving colors:', error);
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
        <h2 className="text-2xl font-bold text-white">Rang Sozlamalari</h2>
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

      <div className="space-y-4">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="bg-neutral-700 rounded-lg p-6">
            <label className="block text-sm font-medium text-neutral-300 mb-2 capitalize">
              {key.replace('_', ' ')}
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={value}
                onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                className="w-20 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
