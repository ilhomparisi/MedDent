import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Save, AlertCircle, CheckCircle, Upload, X, Smartphone, Monitor } from 'lucide-react';

interface PillSection {
  _id?: string;
  id?: string;
  section_type: 'white' | 'black';
  main_heading: string;
  subheading: string;
  blue_pill_title: string;
  blue_pill_description: string;
  blue_pill_details: string;
  red_pill_title: string;
  red_pill_description: string;
  red_pill_details: string;
  button_text: string;
  heading_align: 'left' | 'center' | 'right';
  subheading_align: 'left' | 'center' | 'right';
  is_active: boolean;
  display_order: number;
  main_heading_size: number;
  subheading_size: number;
  blue_pill_title_size: number;
  blue_pill_description_size: number;
  blue_pill_details_size: number;
  red_pill_title_size: number;
  red_pill_description_size: number;
  red_pill_details_size: number;
  button_text_size: number;
  main_heading_size_mobile?: number;
  subheading_size_mobile?: number;
  blue_pill_title_size_mobile?: number;
  blue_pill_description_size_mobile?: number;
  blue_pill_details_size_mobile?: number;
  red_pill_title_size_mobile?: number;
  red_pill_description_size_mobile?: number;
  red_pill_details_size_mobile?: number;
  button_text_size_mobile?: number;
  button_padding_x: number;
  button_padding_y: number;
  button_max_width: number;
  matrix_image_max_width: number;
  matrix_image_url?: string | null;
  pill_spacing_mobile: number;
  pill_spacing_desktop: number;
}

export default function PillSectionsManagement() {
  const [whiteSection, setWhiteSection] = useState<PillSection | null>(null);
  const [blackSection, setBlackSection] = useState<PillSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const data = await api.getPillSections();
      
      const whiteSec = data.find((s: any) => s.section_type === 'white') || null;
      const blackSec = data.find((s: any) => s.section_type === 'black') || null;

      setWhiteSection(whiteSec ? { ...whiteSec, id: whiteSec._id || whiteSec.id } : null);
      setBlackSection(blackSec ? { ...blackSec, id: blackSec._id || blackSec.id } : null);
    } catch (error) {
      console.error('Error fetching sections:', error);
      showMessage('error', 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async (section: PillSection) => {
    setSaving(true);
    try {
      const updateData = {
        main_heading: section.main_heading,
        main_heading_uz: section.main_heading,
        subheading: section.subheading,
        subheading_uz: section.subheading,
        blue_pill_title: section.blue_pill_title,
        blue_pill_title_uz: section.blue_pill_title,
        blue_pill_description: section.blue_pill_description,
        blue_pill_description_uz: section.blue_pill_description,
        blue_pill_details: section.blue_pill_details,
        blue_pill_details_uz: section.blue_pill_details,
        red_pill_title: section.red_pill_title,
        red_pill_title_uz: section.red_pill_title,
        red_pill_description: section.red_pill_description,
        red_pill_description_uz: section.red_pill_description,
        red_pill_details: section.red_pill_details,
        red_pill_details_uz: section.red_pill_details,
        button_text: section.button_text,
        button_text_uz: section.button_text,
        heading_align: section.heading_align,
        subheading_align: section.subheading_align,
        main_heading_size: section.main_heading_size,
        subheading_size: section.subheading_size,
        blue_pill_title_size: section.blue_pill_title_size,
        blue_pill_description_size: section.blue_pill_description_size,
        blue_pill_details_size: section.blue_pill_details_size,
        red_pill_title_size: section.red_pill_title_size,
        red_pill_description_size: section.red_pill_description_size,
        red_pill_details_size: section.red_pill_details_size,
        button_text_size: section.button_text_size,
        main_heading_size_mobile: section.main_heading_size_mobile,
        subheading_size_mobile: section.subheading_size_mobile,
        blue_pill_title_size_mobile: section.blue_pill_title_size_mobile,
        blue_pill_description_size_mobile: section.blue_pill_description_size_mobile,
        blue_pill_details_size_mobile: section.blue_pill_details_size_mobile,
        red_pill_title_size_mobile: section.red_pill_title_size_mobile,
        red_pill_description_size_mobile: section.red_pill_description_size_mobile,
        red_pill_details_size_mobile: section.red_pill_details_size_mobile,
        button_text_size_mobile: section.button_text_size_mobile,
        button_padding_x: section.button_padding_x,
        button_padding_y: section.button_padding_y,
        button_max_width: section.button_max_width,
        matrix_image_max_width: section.matrix_image_max_width,
        matrix_image_url: section.matrix_image_url,
        pill_spacing_mobile: section.pill_spacing_mobile,
        pill_spacing_desktop: section.pill_spacing_desktop,
      };

      await api.updatePillSection(section.id!, updateData);

      showMessage('success', 'Muvaffaqiyatli saqlandi!');
      await fetchSections();
    } catch (error) {
      console.error('Error saving section:', error);
      showMessage('error', 'Saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    section: PillSection,
    setSection: (section: PillSection) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Faqat rasm fayllarini yuklash mumkin');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Fayl hajmi 5MB dan oshmasligi kerak');
      return;
    }

    setUploadingImage(section.id!);

    try {
      const result = await api.uploadFile(file, 'pill-section-images');
      setSection({ ...section, matrix_image_url: result.url });
      showMessage('success', 'Rasm muvaffaqiyatli yuklandi!');
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Rasmni yuklashda xatolik yuz berdi');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleRemoveImage = async (
    section: PillSection,
    setSection: (section: PillSection) => void
  ) => {
    if (!section.matrix_image_url) return;

    try {
      await api.deleteFile(section.matrix_image_url);
      setSection({ ...section, matrix_image_url: null });
      showMessage('success', 'Rasm o\'chirildi');
    } catch (error) {
      console.error('Error removing image:', error);
      showMessage('error', 'Rasmni o\'chirishda xatolik yuz berdi');
    }
  };

  const renderSectionEditor = (
    section: PillSection | null,
    setSection: (section: PillSection) => void,
    title: string,
    bgPreview: string
  ) => {
    if (!section) return null;

    return (
      <div className={`${bgPreview} p-8 rounded-xl mb-8`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <div className="flex gap-2 bg-neutral-800 p-1 rounded-lg">
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
              Mobil
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

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Asosiy sarlavha
            </label>
            <input
              type="text"
              value={section.main_heading}
              onChange={(e) =>
                setSection({ ...section, main_heading: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Sarlavha shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
              </label>
              <input
                type="number"
                min="16"
                max="120"
                value={deviceView === 'mobile' ? (section.main_heading_size_mobile || 24) : section.main_heading_size}
                onChange={(e) =>
                  setSection({
                    ...section,
                    [deviceView === 'mobile' ? 'main_heading_size_mobile' : 'main_heading_size']: parseInt(e.target.value) || 48
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Sarlavha tekislash
              </label>
              <select
                value={section.heading_align}
                onChange={(e) =>
                  setSection({
                    ...section,
                    heading_align: e.target.value as 'left' | 'center' | 'right',
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="left">Chapga</option>
                <option value="center">Markazga</option>
                <option value="right">O'ngga</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Kichik sarlavha
            </label>
            <input
              type="text"
              value={section.subheading}
              onChange={(e) =>
                setSection({ ...section, subheading: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Kichik sarlavha shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
              </label>
              <input
                type="number"
                min="12"
                max="80"
                value={deviceView === 'mobile' ? (section.subheading_size_mobile || 14) : section.subheading_size}
                onChange={(e) =>
                  setSection({
                    ...section,
                    [deviceView === 'mobile' ? 'subheading_size_mobile' : 'subheading_size']: parseInt(e.target.value) || 20
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Kichik sarlavha tekislash
              </label>
              <select
                value={section.subheading_align}
                onChange={(e) =>
                  setSection({
                    ...section,
                    subheading_align: e.target.value as 'left' | 'center' | 'right',
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="left">Chapga</option>
                <option value="center">Markazga</option>
                <option value="right">O'ngga</option>
              </select>
            </div>
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <h4 className="text-lg font-semibold mb-4 text-blue-400">
              Ko'k tabletka
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Sarlavha
                </label>
                <input
                  type="text"
                  value={section.blue_pill_title}
                  onChange={(e) =>
                    setSection({ ...section, blue_pill_title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Sarlavha shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
                </label>
                <input
                  type="number"
                  min="14"
                  max="60"
                  value={deviceView === 'mobile' ? (section.blue_pill_title_size_mobile || 18) : section.blue_pill_title_size}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      [deviceView === 'mobile' ? 'blue_pill_title_size_mobile' : 'blue_pill_title_size']: parseInt(e.target.value) || 24
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Qisqa tavsif
                </label>
                <textarea
                  value={section.blue_pill_description}
                  onChange={(e) =>
                    setSection({ ...section, blue_pill_description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Qisqa tavsif shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
                </label>
                <input
                  type="number"
                  min="12"
                  max="40"
                  value={deviceView === 'mobile' ? (section.blue_pill_description_size_mobile || 14) : section.blue_pill_description_size}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      [deviceView === 'mobile' ? 'blue_pill_description_size_mobile' : 'blue_pill_description_size']: parseInt(e.target.value) || 16
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Batafsil tavsif
                </label>
                <textarea
                  value={section.blue_pill_details}
                  onChange={(e) =>
                    setSection({ ...section, blue_pill_details: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Batafsil tavsif shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
                </label>
                <input
                  type="number"
                  min="10"
                  max="36"
                  value={deviceView === 'mobile' ? (section.blue_pill_details_size_mobile || 12) : section.blue_pill_details_size}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      [deviceView === 'mobile' ? 'blue_pill_details_size_mobile' : 'blue_pill_details_size']: parseInt(e.target.value) || 14
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <h4 className="text-lg font-semibold mb-4 text-red-400">
              Qizil tabletka
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Sarlavha
                </label>
                <input
                  type="text"
                  value={section.red_pill_title}
                  onChange={(e) =>
                    setSection({ ...section, red_pill_title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Sarlavha shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
                </label>
                <input
                  type="number"
                  min="14"
                  max="60"
                  value={deviceView === 'mobile' ? (section.red_pill_title_size_mobile || 18) : section.red_pill_title_size}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      [deviceView === 'mobile' ? 'red_pill_title_size_mobile' : 'red_pill_title_size']: parseInt(e.target.value) || 24
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Qisqa tavsif
                </label>
                <textarea
                  value={section.red_pill_description}
                  onChange={(e) =>
                    setSection({ ...section, red_pill_description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Qisqa tavsif shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
                </label>
                <input
                  type="number"
                  min="12"
                  max="40"
                  value={deviceView === 'mobile' ? (section.red_pill_description_size_mobile || 14) : section.red_pill_description_size}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      [deviceView === 'mobile' ? 'red_pill_description_size_mobile' : 'red_pill_description_size']: parseInt(e.target.value) || 16
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Batafsil tavsif
                </label>
                <textarea
                  value={section.red_pill_details}
                  onChange={(e) =>
                    setSection({ ...section, red_pill_details: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Batafsil tavsif shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
                </label>
                <input
                  type="number"
                  min="10"
                  max="36"
                  value={deviceView === 'mobile' ? (section.red_pill_details_size_mobile || 12) : section.red_pill_details_size}
                  onChange={(e) =>
                    setSection({
                      ...section,
                      [deviceView === 'mobile' ? 'red_pill_details_size_mobile' : 'red_pill_details_size']: parseInt(e.target.value) || 14
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Tugma matni
            </label>
            <input
              type="text"
              value={section.button_text}
              onChange={(e) =>
                setSection({ ...section, button_text: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Tugma matni shrift o'lchami (px) - {deviceView === 'mobile' ? 'Mobil' : 'Desktop'}
              </label>
              <input
                type="number"
                min="12"
                max="40"
                value={deviceView === 'mobile' ? (section.button_text_size_mobile || 14) : section.button_text_size}
                onChange={(e) =>
                  setSection({
                    ...section,
                    [deviceView === 'mobile' ? 'button_text_size_mobile' : 'button_text_size']: parseInt(e.target.value) || 20
                  })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Tugma maksimal kengligi (px)
              </label>
              <input
                type="number"
                min="200"
                max="600"
                value={section.button_max_width}
                onChange={(e) =>
                  setSection({ ...section, button_max_width: parseInt(e.target.value) || 320 })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Tugma gorizontal padding (px)
              </label>
              <input
                type="number"
                min="16"
                max="100"
                value={section.button_padding_x}
                onChange={(e) =>
                  setSection({ ...section, button_padding_x: parseInt(e.target.value) || 48 })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Tugma vertikal padding (px)
              </label>
              <input
                type="number"
                min="8"
                max="40"
                value={section.button_padding_y}
                onChange={(e) =>
                  setSection({ ...section, button_padding_y: parseInt(e.target.value) || 16 })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t border-neutral-600 pt-6">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Tabletka orasidagi masofa
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Mobilda masofa (px)
                </label>
                <input
                  type="number"
                  min="0"
                  max="128"
                  value={section.pill_spacing_mobile}
                  onChange={(e) =>
                    setSection({ ...section, pill_spacing_mobile: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-neutral-400 mt-2">
                  Ko'k va qizil tabletka orasidagi vertikal masofa (mobil)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Desktopda masofa (px)
                </label>
                <input
                  type="number"
                  min="0"
                  max="128"
                  value={section.pill_spacing_desktop}
                  onChange={(e) =>
                    setSection({ ...section, pill_spacing_desktop: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-neutral-400 mt-2">
                  Ko'k va qizil tabletka orasidagi gorizontal masofa (desktop)
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-600 pt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-neutral-300">
                Matrix Personaji Rasmi
              </label>

              {section.matrix_image_url ? (
                <div className="space-y-4">
                  <div className="relative w-full h-64 bg-neutral-800 rounded-lg overflow-hidden">
                    <img
                      src={section.matrix_image_url}
                      alt="Matrix Character"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(section, setSection)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Rasmni o'chirish
                  </button>
                </div>
              ) : (
                <div>
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-neutral-800">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="w-12 h-12 text-neutral-400 mb-3" />
                      <p className="text-sm text-neutral-400 mb-1">
                        {uploadingImage === section.id ? 'Yuklanmoqda...' : 'Rasmni yuklash uchun bosing'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        PNG, JPG (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, section, setSection)}
                      disabled={uploadingImage === section.id}
                    />
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Matrix rasm maksimal kengligi (px)
              </label>
              <input
                type="number"
                min="300"
                max="1200"
                value={section.matrix_image_max_width}
                onChange={(e) =>
                  setSection({ ...section, matrix_image_max_width: parseInt(e.target.value) || 600 })
                }
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-neutral-400 mt-2">
                Matrix personaji rasmining maksimal kengligini sozlang (300-1200px oralig'ida)
              </p>
            </div>
          </div>

          <button
            onClick={() => handleSave(section)}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-400 text-lg">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Tabletka bo'limlari boshqaruvi
        </h2>
        <p className="text-neutral-400">
          Qora fon variantini tahrirlang
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-600/20 border border-green-600 text-green-400'
              : 'bg-red-600/20 border border-red-600 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {blackSection &&
        renderSectionEditor(
          blackSection,
          setBlackSection,
          'Qora fon bo\'limi',
          'bg-black border border-neutral-800'
        )}
    </div>
  );
}
