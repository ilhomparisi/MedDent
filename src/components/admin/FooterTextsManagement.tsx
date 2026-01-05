import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Languages } from 'lucide-react';

interface FooterText {
  key: string;
  value: string;
  value_uz: string;
  value_ru: string | null;
  description: string;
}

export default function FooterTextsManagement() {
  const [texts, setTexts] = useState<FooterText[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const { data, error } = await supabase
        .from('ui_texts')
        .select('key, value, value_uz, value_ru, description')
        .eq('section', 'footer')
        .order('key');

      if (error) throw error;

      setTexts(data || []);
    } catch (error) {
      console.error('Error fetching footer texts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (key: string, newValue: string, lang: 'uz' | 'ru') => {
    setTexts(texts.map(text => {
      if (text.key === key) {
        if (lang === 'uz') {
          return { ...text, value_uz: newValue, value: newValue };
        } else {
          return { ...text, value_ru: newValue };
        }
      }
      return text;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      for (const text of texts) {
        const { error } = await supabase
          .from('ui_texts')
          .update({
            value: text.value,
            value_uz: text.value_uz,
            value_ru: text.value_ru,
            updated_at: new Date().toISOString(),
          })
          .eq('key', text.key)
          .eq('section', 'footer');

        if (error) throw error;
      }

      setMessage('Footer matnlari muvaffaqiyatli saqlandi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving footer texts:', error);
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
        <div>
          <h2 className="text-2xl font-bold text-white">Footer Matnlari</h2>
          <p className="text-neutral-400 text-sm mt-1">
            Footer bo'limidagi barcha matnlarni ikkala tilda tahrirlash
          </p>
        </div>
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

      <div className="mb-6 flex gap-2 border-b border-neutral-700">
        <button
          onClick={() => setActiveTab('uz')}
          className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'uz'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Languages className="w-4 h-4" />
          O'zbek tili
        </button>
        <button
          onClick={() => setActiveTab('ru')}
          className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'ru'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Languages className="w-4 h-4" />
          Русский язык
        </button>
      </div>

      <div className="bg-neutral-700 rounded-lg p-6">
        <div className="space-y-6">
          {texts.map((text) => (
            <div key={text.key} className="border-b border-neutral-600 pb-6 last:border-0">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                {text.description || text.key}
              </label>
              <textarea
                value={activeTab === 'uz' ? text.value_uz : (text.value_ru || '')}
                onChange={(e) => handleTextChange(text.key, e.target.value, activeTab)}
                rows={text.key === 'description' || text.key === 'emergency_text' ? 3 : 1}
                className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none resize-none"
                placeholder={activeTab === 'ru' ? 'Введите русский текст' : 'O\'zbek matnini kiriting'}
              />
              <p className="text-xs text-neutral-500 mt-1">
                Kalit: {text.key}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
