import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

interface ValueStacking {
  _id?: string;
  id?: string;
  main_heading: string;
  main_heading_uz: string;
  main_heading_ru: string;
  left_pay_label: string;
  left_pay_label_uz: string;
  left_pay_label_ru: string;
  left_price: string;
  left_price_uz: string;
  left_price_ru: string;
  left_description: string;
  left_description_uz: string;
  left_description_ru: string;
  left_button_text: string;
  left_button_text_uz: string;
  left_button_text_ru: string;
  right_pay_label: string;
  right_pay_label_uz: string;
  right_pay_label_ru: string;
  right_price: string;
  right_price_uz: string;
  right_price_ru: string;
  right_description: string;
  right_description_uz: string;
  right_description_ru: string;
  right_button_text: string;
  right_button_text_uz: string;
  right_button_text_ru: string;
  vs_text: string;
  vs_text_uz: string;
  vs_text_ru: string;
  is_active: boolean;
  main_heading_size: number;
  pay_label_size: number;
  price_size: number;
  description_size: number;
  button_text_size: number;
  main_heading_size_mobile: number;
  pay_label_size_mobile: number;
  price_size_mobile: number;
  description_size_mobile: number;
  button_text_size_mobile: number;
  main_heading_color: string;
  left_card_scale: number;
  right_card_scale: number;
  left_card_scale_mobile: number;
  right_card_scale_mobile: number;
  left_description_to_button_spacing_mobile: number;
  left_description_to_button_spacing_desktop: number;
  right_description_to_button_spacing_mobile: number;
  right_description_to_button_spacing_desktop: number;
}

export default function ValueStackingManagement() {
  const [data, setData] = useState<ValueStacking>({
    id: '',
    main_heading: '',
    main_heading_uz: '',
    main_heading_ru: '',
    left_pay_label: '',
    left_pay_label_uz: '',
    left_pay_label_ru: '',
    left_price: '',
    left_price_uz: '',
    left_price_ru: '',
    left_description: '',
    left_description_uz: '',
    left_description_ru: '',
    left_button_text: '',
    left_button_text_uz: '',
    left_button_text_ru: '',
    right_pay_label: '',
    right_pay_label_uz: '',
    right_pay_label_ru: '',
    right_price: '',
    right_price_uz: '',
    right_price_ru: '',
    right_description: '',
    right_description_uz: '',
    right_description_ru: '',
    right_button_text: '',
    right_button_text_uz: '',
    right_button_text_ru: '',
    vs_text: 'VS',
    vs_text_uz: 'VS',
    vs_text_ru: 'VS',
    is_active: true,
    main_heading_size: 48,
    pay_label_size: 16,
    price_size: 56,
    description_size: 18,
    button_text_size: 16,
    main_heading_size_mobile: 36,
    pay_label_size_mobile: 10,
    price_size_mobile: 32,
    description_size_mobile: 12,
    button_text_size_mobile: 13,
    main_heading_color: '#FFFFFF',
    left_card_scale: 100,
    right_card_scale: 100,
    left_card_scale_mobile: 100,
    right_card_scale_mobile: 100,
    left_description_to_button_spacing_mobile: 16,
    left_description_to_button_spacing_desktop: 64,
    right_description_to_button_spacing_mobile: 16,
    right_description_to_button_spacing_desktop: 64,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const items = await api.getValueItems(false);
      // ValueStacking is a single record, get the first active one or create default
      const result = items.find((item: any) => item.is_active) || items[0] || null;
      if (result) {
        setData({ ...result, id: result._id || result.id });
      }
    } catch (error) {
      console.error('Error fetching value stacking:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      if (data.id) {
        await api.updateValueItem(data.id, data);
      } else {
        await api.createValueItem(data);
      }

      setMessage('Muvaffaqiyatli saqlandi!');
      setTimeout(() => setMessage(''), 3000);
      await fetchData();
    } catch (error) {
      console.error('Error saving value stacking:', error);
      setMessage('Xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Value Stacking Bo'limi</h2>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Yangilash
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('Muvaffaqiyatli') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.is_active}
              onChange={(e) => setData({ ...data, is_active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Bo'limni ko'rsatish</span>
          </label>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('uz')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'uz'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              O'zbekcha
            </button>
            <button
              onClick={() => setActiveTab('ru')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'ru'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Русский
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asosiy Sarlavha {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
          </label>
          <input
            type="text"
            value={activeTab === 'uz' ? data.main_heading_uz : data.main_heading_ru}
            onChange={(e) => setData({
              ...data,
              [activeTab === 'uz' ? 'main_heading_uz' : 'main_heading_ru']: e.target.value
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={activeTab === 'uz' ? "IKKI YO'L, BITTA TANLOV" : "ДВА ПУТИ, ОДИН ВЫБОР"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sarlavha o'lchami
            </label>
            <input
              type="number"
              value={data.main_heading_size}
              onChange={(e) => setData({ ...data, main_heading_size: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sarlavha rangi
            </label>
            <input
              type="color"
              value={data.main_heading_color}
              onChange={(e) => setData({ ...data, main_heading_color: e.target.value })}
              className="w-full h-[42px] px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAY yorlig'i o'lchami
            </label>
            <input
              type="number"
              value={data.pay_label_size}
              onChange={(e) => setData({ ...data, pay_label_size: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Narx o'lchami
            </label>
            <input
              type="number"
              value={data.price_size}
              onChange={(e) => setData({ ...data, price_size: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ta'rif o'lchami
            </label>
            <input
              type="number"
              value={data.description_size}
              onChange={(e) => setData({ ...data, description_size: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tugma o'lchami
            </label>
            <input
              type="number"
              value={data.button_text_size}
              onChange={(e) => setData({ ...data, button_text_size: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-base text-gray-900 mb-4">Mobile o'lchamlari (px)</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sarlavha (mobile)
              </label>
              <input
                type="number"
                value={data.main_heading_size_mobile}
                onChange={(e) => setData({ ...data, main_heading_size_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAY yorlig'i (mobile)
              </label>
              <input
                type="number"
                value={data.pay_label_size_mobile}
                onChange={(e) => setData({ ...data, pay_label_size_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Narx (mobile)
              </label>
              <input
                type="number"
                value={data.price_size_mobile}
                onChange={(e) => setData({ ...data, price_size_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ta'rif (mobile)
              </label>
              <input
                type="number"
                value={data.description_size_mobile}
                onChange={(e) => setData({ ...data, description_size_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tugma (mobile)
              </label>
              <input
                type="number"
                value={data.button_text_size_mobile}
                onChange={(e) => setData({ ...data, button_text_size_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-base text-gray-900 mb-4">Kartochka o'lchamlari - Desktop (100 = standart)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chap kartochka o'lchami (%)
              </label>
              <input
                type="number"
                value={data.left_card_scale}
                onChange={(e) => setData({ ...data, left_card_scale: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="50"
                max="150"
                step="5"
              />
              <p className="mt-1 text-xs text-gray-500">
                50-150 oralig'ida (100 = standart o'lcham)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O'ng kartochka o'lchami (%)
              </label>
              <input
                type="number"
                value={data.right_card_scale}
                onChange={(e) => setData({ ...data, right_card_scale: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="50"
                max="150"
                step="5"
              />
              <p className="mt-1 text-xs text-gray-500">
                50-150 oralig'ida (100 = standart o'lcham)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-base text-gray-900 mb-4">Kartochka o'lchamlari - Mobile (100 = standart)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chap kartochka o'lchami (%)
              </label>
              <input
                type="number"
                value={data.left_card_scale_mobile}
                onChange={(e) => setData({ ...data, left_card_scale_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="50"
                max="150"
                step="5"
              />
              <p className="mt-1 text-xs text-gray-500">
                50-150 oralig'ida (100 = standart o'lcham)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O'ng kartochka o'lchami (%)
              </label>
              <input
                type="number"
                value={data.right_card_scale_mobile}
                onChange={(e) => setData({ ...data, right_card_scale_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="50"
                max="150"
                step="5"
              />
              <p className="mt-1 text-xs text-gray-500">
                50-150 oralig'ida (100 = standart o'lcham)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-base text-gray-900 mb-4">Tugma oralig'i - Ta'rif va Tugma orasidagi masofa (px)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chap (Mobile)
              </label>
              <input
                type="number"
                value={data.left_description_to_button_spacing_mobile}
                onChange={(e) => setData({ ...data, left_description_to_button_spacing_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ta'rif va tugma orasidagi oraliq
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chap (Desktop)
              </label>
              <input
                type="number"
                value={data.left_description_to_button_spacing_desktop}
                onChange={(e) => setData({ ...data, left_description_to_button_spacing_desktop: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ta'rif va tugma orasidagi oraliq
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O'ng (Mobile)
              </label>
              <input
                type="number"
                value={data.right_description_to_button_spacing_mobile}
                onChange={(e) => setData({ ...data, right_description_to_button_spacing_mobile: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ta'rif va tugma orasidagi oraliq
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O'ng (Desktop)
              </label>
              <input
                type="number"
                value={data.right_description_to_button_spacing_desktop}
                onChange={(e) => setData({ ...data, right_description_to_button_spacing_desktop: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ta'rif va tugma orasidagi oraliq
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 border-r border-gray-200 pr-8">
            <h3 className="font-semibold text-lg text-gray-900">Chap tomon (Qimmat variant)</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'lang yorlig'i {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <input
                type="text"
                value={activeTab === 'uz' ? data.left_pay_label_uz : data.left_pay_label_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'left_pay_label_uz' : 'left_pay_label_ru']: e.target.value
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "TO'LANG" : "ПЛАТИТЕ"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Narx {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <input
                type="text"
                value={activeTab === 'uz' ? data.left_price_uz : data.left_price_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'left_price_uz' : 'left_price_ru']: e.target.value
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "1,000,000+" : "1,000,000+"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ta'rif {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <textarea
                value={activeTab === 'uz' ? data.left_description_uz : data.left_description_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'left_description_uz' : 'left_description_ru']: e.target.value
                })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "Boshqa klinikalarda..." : "В других клиниках..."}
              />
              <p className="mt-1 text-xs text-gray-500">
                Matnni chizib tashlash uchun: ~~700,000 so'm~~
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tugma matni {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <input
                type="text"
                value={activeTab === 'uz' ? data.left_button_text_uz : data.left_button_text_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'left_button_text_uz' : 'left_button_text_ru']: e.target.value
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "1,000,000 SO'M SARFLASH" : "ПОТРАТИТЬ 1,000,000 СУМ"}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">O'ng tomon (Bepul variant)</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'lang yorlig'i {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <input
                type="text"
                value={activeTab === 'uz' ? data.right_pay_label_uz : data.right_pay_label_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'right_pay_label_uz' : 'right_pay_label_ru']: e.target.value
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "TO'LANG" : "ПЛАТИТЕ"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Narx {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <input
                type="text"
                value={activeTab === 'uz' ? data.right_price_uz : data.right_price_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'right_price_uz' : 'right_price_ru']: e.target.value
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "0 so'm" : "0 сум"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ta'rif {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <textarea
                value={activeTab === 'uz' ? data.right_description_uz : data.right_description_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'right_description_uz' : 'right_description_ru']: e.target.value
                })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "Bizning klinikada..." : "В нашей клинике..."}
              />
              <p className="mt-1 text-xs text-gray-500">
                Matnni chizib tashlash uchun: ~~700,000 so'm~~
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tugma matni {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
              </label>
              <input
                type="text"
                value={activeTab === 'uz' ? data.right_button_text_uz : data.right_button_text_ru}
                onChange={(e) => setData({
                  ...data,
                  [activeTab === 'uz' ? 'right_button_text_uz' : 'right_button_text_ru']: e.target.value
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === 'uz' ? "HOZIROQ YOZILAMAN" : "ЗАПИСАТЬСЯ СЕЙЧАС"}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VS matni {activeTab === 'uz' ? '(O\'zbekcha)' : '(Русский)'}
          </label>
          <input
            type="text"
            value={activeTab === 'uz' ? data.vs_text_uz : data.vs_text_ru}
            onChange={(e) => setData({
              ...data,
              [activeTab === 'uz' ? 'vs_text_uz' : 'vs_text_ru']: e.target.value
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="VS"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </div>
  );
}
