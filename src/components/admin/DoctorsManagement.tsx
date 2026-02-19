import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { uploadDoctorImage, deleteDoctorImage } from '../../lib/doctorImageUpload';
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

interface Doctor {
  _id?: string;
  id?: string;
  name: string;
  name_uz?: string;
  name_ru?: string;
  specialty: string;
  specialty_uz?: string;
  specialty_ru?: string;
  bio?: string;
  bio_uz?: string;
  bio_ru?: string;
  years_experience: number;
  education?: string;
  education_uz?: string;
  education_ru?: string;
  image_url?: string | null;
  is_active: boolean;
  display_order?: number;
}

export default function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    name_uz: '',
    name_ru: '',
    specialty: '',
    specialty_uz: '',
    specialty_ru: '',
    bio: '',
    bio_uz: '',
    bio_ru: '',
    years_experience: 0,
    education: '',
    education_uz: '',
    education_ru: '',
    image_url: '',
    is_active: true,
    display_order: 0,
  });

  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await api.getDoctors(false);
      setDoctors(data.map((d: any) => ({ ...d, id: d._id || d.id })));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setMessage('Shifokorlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const result = await uploadDoctorImage(file);

    if (result.success && result.url) {
      setFormData({ ...formData, image_url: result.url });
      setMessage('Rasm muvaffaqiyatli yuklandi!');
    } else {
      setMessage(result.error || 'Rasm yuklashda xatolik');
    }

    setUploadingImage(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (editingDoctor) {
        await api.updateDoctor(editingDoctor.id!, formData);
        setMessage('Shifokor muvaffaqiyatli yangilandi!');
      } else {
        await api.createDoctor(formData);
        setMessage('Shifokor muvaffaqiyatli qo\'shildi!');
      }

      resetForm();
      fetchDoctors();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving doctor:', error);
      setMessage('Saqlashda xatolik yuz berdi!');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      name_uz: doctor.name_uz || doctor.name,
      name_ru: doctor.name_ru || doctor.name,
      specialty: doctor.specialty,
      specialty_uz: doctor.specialty_uz || doctor.specialty,
      specialty_ru: doctor.specialty_ru || doctor.specialty,
      bio: doctor.bio || '',
      bio_uz: doctor.bio_uz || doctor.bio || '',
      bio_ru: doctor.bio_ru || doctor.bio || '',
      years_experience: doctor.years_experience,
      education: doctor.education || '',
      education_uz: doctor.education_uz || doctor.education || '',
      education_ru: doctor.education_ru || doctor.education || '',
      image_url: doctor.image_url || '',
      is_active: doctor.is_active,
      display_order: doctor.display_order || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (doctor: Doctor) => {
    if (!confirm(`${doctor.name}ni o'chirmoqchimisiz?`)) return;

    try {
      if (doctor.image_url) {
        await deleteDoctorImage(doctor.image_url);
      }

      await api.deleteDoctor(doctor.id!);

      setMessage('Shifokor muvaffaqiyatli o\'chirildi!');
      fetchDoctors();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setMessage('O\'chirishda xatolik yuz berdi!');
    }
  };

  const toggleActive = async (doctor: Doctor) => {
    try {
      await api.updateDoctor(doctor.id!, { is_active: !doctor.is_active });
      fetchDoctors();
    } catch (error) {
      console.error('Error toggling doctor status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_uz: '',
      name_ru: '',
      specialty: '',
      specialty_uz: '',
      specialty_ru: '',
      bio: '',
      bio_uz: '',
      bio_ru: '',
      years_experience: 0,
      education: '',
      education_uz: '',
      education_ru: '',
      image_url: '',
      is_active: true,
      display_order: 0,
    });
    setEditingDoctor(null);
    setShowForm(false);
    setActiveTab('uz');
  };

  if (loading) {
    return <div className="text-white">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Shifokorlar</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Yangi Shifokor
          </button>
        )}
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

      {showForm && (
        <div className="bg-neutral-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              {editingDoctor ? 'Shifokorni Tahrirlash' : 'Yangi Shifokor Qo\'shish'}
            </h3>
            <button
              onClick={resetForm}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-4 border-b border-neutral-600">
              <button
                type="button"
                onClick={() => setActiveTab('uz')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'uz'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-neutral-400'
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
                    : 'text-neutral-400'
                }`}
              >
                Русский язык
              </button>
            </div>

            {activeTab === 'uz' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Ism va Familiya (O'zbek) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name_uz}
                      onChange={(e) => setFormData({ ...formData, name_uz: e.target.value, name: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Mutaxassislik (O'zbek) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specialty_uz}
                      onChange={(e) => setFormData({ ...formData, specialty_uz: e.target.value, specialty: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Ta'lim (O'zbek)
                  </label>
                  <textarea
                    value={formData.education_uz}
                    onChange={(e) => setFormData({ ...formData, education_uz: e.target.value, education: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Biografiya (O'zbek)
                  </label>
                  <textarea
                    value={formData.bio_uz}
                    onChange={(e) => setFormData({ ...formData, bio_uz: e.target.value, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Имя и Фамилия (Русский) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name_ru}
                      onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Специальность (Русский) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specialty_ru}
                      onChange={(e) => setFormData({ ...formData, specialty_ru: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Образование (Русский)
                  </label>
                  <textarea
                    value={formData.education_ru}
                    onChange={(e) => setFormData({ ...formData, education_ru: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Биография (Русский)
                  </label>
                  <textarea
                    value={formData.bio_ru}
                    onChange={(e) => setFormData({ ...formData, bio_ru: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-600">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tajriba (yil)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tartib Raqami
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg border border-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Rasm (10MB gacha)
              </label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-lg cursor-pointer hover:bg-neutral-500">
                  {uploadingImage ? (
                    <>Yuklanmoqda...</>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Rasm Yuklash
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm text-neutral-300">
                Faol
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {doctors.length === 0 ? (
          <div className="bg-neutral-700 rounded-lg p-8 text-center">
            <ImageIcon className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-400">Hali shifokorlar qo'shilmagan</p>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-neutral-700 rounded-lg p-4 flex items-center gap-4"
            >
              {doctor.image_url ? (
                <img
                  src={doctor.image_url}
                  alt={doctor.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-neutral-600 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-neutral-400" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
                <p className="text-neutral-300">{doctor.specialty}</p>
                <p className="text-sm text-neutral-400">{doctor.years_experience} yillik tajriba</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(doctor)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    doctor.is_active
                      ? 'bg-green-600 text-white'
                      : 'bg-neutral-600 text-neutral-300'
                  }`}
                >
                  {doctor.is_active ? 'Faol' : 'Nofaol'}
                </button>
                <button
                  onClick={() => handleEdit(doctor)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(doctor)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
