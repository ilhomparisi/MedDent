import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Smartphone, Monitor } from 'lucide-react';

interface FinalCTA {
  _id?: string;
  id?: string;
  is_active: boolean;
  heading_line1: string;
  heading_highlight1: string;
  heading_line2: string;
  heading_line3: string;
  heading_highlight2: string;
  heading_highlight3: string;
  description: string;
  button_text: string;
  button_subtext: string;
  heading_line1_size: number;
  heading_highlight1_size: number;
  heading_line2_size: number;
  heading_line3_size: number;
  heading_highlight2_size: number;
  heading_highlight3_size: number;
  description_size: number;
  button_text_size: number;
  button_subtext_size: number;
  button_text_size_mobile?: number;
  button_subtext_size_mobile?: number;
  heading_alignment: string;
  description_alignment: string;
  button_alignment: string;
}

export default function FinalCTAManagement() {
  const [data, setData] = useState<FinalCTA | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');
  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await api.getFinalCTA();
      if (result) {
        setData({ ...result, id: result._id || result.id });
      }
    } catch (error) {
      console.error('Error fetching final CTA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const updateData = {
        is_active: data.is_active,
        heading_line1: data.heading_line1,
        heading_line1_uz: (data as any).heading_line1_uz || data.heading_line1,
        heading_line1_ru: (data as any).heading_line1_ru || null,
        heading_highlight1: data.heading_highlight1,
        heading_highlight1_uz: (data as any).heading_highlight1_uz || data.heading_highlight1,
        heading_highlight1_ru: (data as any).heading_highlight1_ru || null,
        heading_line2: data.heading_line2,
        heading_line2_uz: (data as any).heading_line2_uz || data.heading_line2,
        heading_line2_ru: (data as any).heading_line2_ru || null,
        heading_line3: data.heading_line3,
        heading_line3_uz: (data as any).heading_line3_uz || data.heading_line3,
        heading_line3_ru: (data as any).heading_line3_ru || null,
        heading_highlight2: data.heading_highlight2,
        heading_highlight2_uz: (data as any).heading_highlight2_uz || data.heading_highlight2,
        heading_highlight2_ru: (data as any).heading_highlight2_ru || null,
        heading_highlight3: data.heading_highlight3,
        heading_highlight3_uz: (data as any).heading_highlight3_uz || data.heading_highlight3,
        heading_highlight3_ru: (data as any).heading_highlight3_ru || null,
        description: data.description,
        description_uz: (data as any).description_uz || data.description,
        description_ru: (data as any).description_ru || null,
        button_text: data.button_text,
        button_text_uz: (data as any).button_text_uz || data.button_text,
        button_text_ru: (data as any).button_text_ru || null,
        button_subtext: data.button_subtext,
        button_subtext_uz: (data as any).button_subtext_uz || data.button_subtext,
        button_subtext_ru: (data as any).button_subtext_ru || null,
        heading_line1_size: data.heading_line1_size,
        heading_highlight1_size: data.heading_highlight1_size,
        heading_line2_size: data.heading_line2_size,
        heading_line3_size: data.heading_line3_size,
        heading_highlight2_size: data.heading_highlight2_size,
        heading_highlight3_size: data.heading_highlight3_size,
        description_size: data.description_size,
        button_text_size: data.button_text_size,
        button_subtext_size: data.button_subtext_size,
        button_text_size_mobile: data.button_text_size_mobile,
        button_subtext_size_mobile: data.button_subtext_size_mobile,
        heading_alignment: data.heading_alignment,
        description_alignment: data.description_alignment,
        button_alignment: data.button_alignment,
      };

      await api.updateFinalCTA(updateData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!data) {
    return <div className="text-white">No data found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Final CTA Section</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.is_active}
            onChange={(e) => setData({ ...data, is_active: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-white">Active</span>
        </label>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Heading Content</h3>
          <div className="flex gap-2 border-b border-gray-600">
            <button
              type="button"
              onClick={() => setActiveTab('uz')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'uz'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400'
              }`}
            >
              O'zbek tili
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ru')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'ru'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400'
              }`}
            >
              Русский язык
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          {activeTab === 'uz' ? 'O\'zbek tilida matn kiritish' : 'Ввод текста на русском языке'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Heading Line 1' : 'Заголовок строка 1'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).heading_line1_uz || data.heading_line1) : ((data as any).heading_line1_ru || data.heading_line1)}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, heading_line1: e.target.value, heading_line1_uz: e.target.value } as any);
                } else {
                  setData({ ...data, heading_line1_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Size (px)</label>
            <input
              type="number"
              value={data.heading_line1_size}
              onChange={(e) => setData({ ...data, heading_line1_size: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Highlight 1 (Blue)' : 'Выделение 1 (синий)'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).heading_highlight1_uz || data.heading_highlight1) : ((data as any).heading_highlight1_ru || '')}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, heading_highlight1: e.target.value, heading_highlight1_uz: e.target.value } as any);
                } else {
                  setData({ ...data, heading_highlight1_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Size (px)</label>
            <input
              type="number"
              value={data.heading_highlight1_size}
              onChange={(e) => setData({ ...data, heading_highlight1_size: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Heading Line 2' : 'Заголовок строка 2'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).heading_line2_uz || data.heading_line2) : ((data as any).heading_line2_ru || '')}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, heading_line2: e.target.value, heading_line2_uz: e.target.value } as any);
                } else {
                  setData({ ...data, heading_line2_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Size (px)</label>
            <input
              type="number"
              value={data.heading_line2_size}
              onChange={(e) => setData({ ...data, heading_line2_size: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Heading Line 3' : 'Заголовок строка 3'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).heading_line3_uz || data.heading_line3) : ((data as any).heading_line3_ru || '')}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, heading_line3: e.target.value, heading_line3_uz: e.target.value } as any);
                } else {
                  setData({ ...data, heading_line3_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Size (px)</label>
            <input
              type="number"
              value={data.heading_line3_size}
              onChange={(e) => setData({ ...data, heading_line3_size: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Highlight 2 (Blue)' : 'Выделение 2 (синий)'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).heading_highlight2_uz || data.heading_highlight2) : ((data as any).heading_highlight2_ru || '')}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, heading_highlight2: e.target.value, heading_highlight2_uz: e.target.value } as any);
                } else {
                  setData({ ...data, heading_highlight2_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Size (px)</label>
            <input
              type="number"
              value={data.heading_highlight2_size}
              onChange={(e) => setData({ ...data, heading_highlight2_size: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Highlight 3 (White)' : 'Выделение 3 (белый)'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).heading_highlight3_uz || data.heading_highlight3) : ((data as any).heading_highlight3_ru || '')}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, heading_highlight3: e.target.value, heading_highlight3_uz: e.target.value } as any);
                } else {
                  setData({ ...data, heading_highlight3_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Size (px)</label>
            <input
              type="number"
              value={data.heading_highlight3_size}
              onChange={(e) => setData({ ...data, heading_highlight3_size: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-white mb-2">Heading Alignment</label>
          <select
            value={data.heading_alignment}
            onChange={(e) => setData({ ...data, heading_alignment: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">Description</h3>

        <div>
          <label className="block text-white mb-2">
            {activeTab === 'uz' ? 'Description Text' : 'Текст описания'}
          </label>
          <textarea
            value={activeTab === 'uz' ? ((data as any).description_uz || data.description) : ((data as any).description_ru || '')}
            onChange={(e) => {
              if (activeTab === 'uz') {
                setData({ ...data, description: e.target.value, description_uz: e.target.value } as any);
              } else {
                setData({ ...data, description_ru: e.target.value } as any);
              }
            }}
            rows={4}
            className="w-full p-2 bg-gray-700 text-white rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Description Size (px)</label>
            <input
              type="number"
              value={data.description_size}
              onChange={(e) => setData({ ...data, description_size: Number(e.target.value) })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Description Alignment</label>
            <select
              value={data.description_alignment}
              onChange={(e) => setData({ ...data, description_alignment: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Button</h3>
          <div className="flex gap-2 bg-neutral-700 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                deviceView === 'mobile'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                deviceView === 'desktop'
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Button Text' : 'Текст кнопки'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).button_text_uz || data.button_text) : ((data as any).button_text_ru || '')}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, button_text: e.target.value, button_text_uz: e.target.value } as any);
                } else {
                  setData({ ...data, button_text_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Button Text Size (px) - {deviceView === 'mobile' ? 'Mobile' : 'Desktop'}</label>
            <input
              type="number"
              min="12"
              max="48"
              value={deviceView === 'mobile' ? (data.button_text_size_mobile || 18) : data.button_text_size}
              onChange={(e) => setData({
                ...data,
                [deviceView === 'mobile' ? 'button_text_size_mobile' : 'button_text_size']: Number(e.target.value)
              })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              {activeTab === 'uz' ? 'Button Subtext' : 'Подтекст кнопки'}
            </label>
            <input
              type="text"
              value={activeTab === 'uz' ? ((data as any).button_subtext_uz || data.button_subtext) : ((data as any).button_subtext_ru || '')}
              onChange={(e) => {
                if (activeTab === 'uz') {
                  setData({ ...data, button_subtext: e.target.value, button_subtext_uz: e.target.value } as any);
                } else {
                  setData({ ...data, button_subtext_ru: e.target.value } as any);
                }
              }}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Subtext Size (px) - {deviceView === 'mobile' ? 'Mobile' : 'Desktop'}</label>
            <input
              type="number"
              min="10"
              max="36"
              value={deviceView === 'mobile' ? (data.button_subtext_size_mobile || 13) : data.button_subtext_size}
              onChange={(e) => setData({
                ...data,
                [deviceView === 'mobile' ? 'button_subtext_size_mobile' : 'button_subtext_size']: Number(e.target.value)
              })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Button Alignment</label>
            <select
              value={data.button_alignment}
              onChange={(e) => setData({ ...data, button_alignment: e.target.value })}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
