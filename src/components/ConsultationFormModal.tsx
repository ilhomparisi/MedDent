import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api';
import { getStoredSource, clearStoredSource, getTimeSpentOnPage, resetPageLoadTime } from '../hooks/useSourceTracking';

interface ConsultationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationFormModal({ isOpen, onClose }: ConsultationFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    livesInTashkent: '',
    lastDentistVisit: '',
    currentProblems: '',
    previousClinicExperience: '',
    missingTeeth: '',
    preferredCallTime: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const source = getStoredSource() || 'Direct Visit';
      const timeSpent = getTimeSpentOnPage();

      await api.submitConsultationForm({
        full_name: formData.fullName,
        phone: formData.phone,
        lives_in_tashkent: formData.livesInTashkent,
        last_dentist_visit: formData.lastDentistVisit,
        current_problems: formData.currentProblems,
        previous_clinic_experience: formData.previousClinicExperience,
        missing_teeth: formData.missingTeeth,
        preferred_call_time: formData.preferredCallTime,
        source: source,
        time_spent_seconds: timeSpent,
      });

      clearStoredSource();
      resetPageLoadTime();
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        livesInTashkent: '',
        lastDentistVisit: '',
        currentProblems: '',
        previousClinicExperience: '',
        missingTeeth: '',
        preferredCallTime: '',
      });

      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center md:p-4 overflow-y-auto">
      <div className="bg-white md:rounded-2xl max-w-2xl w-full h-full md:h-auto md:max-h-[90vh] md:my-4 relative flex flex-col">
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight pr-8">
            Bepul Professional tish chistkasi uchun ma'lumotlaringizni qoldiring va siz bilan bog'lanamiz.
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800 text-lg font-semibold">
                Arizangiz muvaffaqiyatli yuborildi!
              </p>
              <p className="text-green-600 mt-2">
                Tez orada siz bilan bog'lanamiz.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-red-800 text-sm sm:text-base">
                  {submitError}
                </div>
              )}

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  1. To'liq ismingiz
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Ismingiz va familiyangizni yozing"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  2. Telefon raqamingiz
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+998 00-000-00-00"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  3. Toshkent shahrida yashaysizmi?
                </label>
                <input
                  type="text"
                  value={formData.livesInTashkent}
                  onChange={(e) => handleInputChange('livesInTashkent', e.target.value)}
                  placeholder="Ha / Yo'q"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  4. Oxirgi marta qachon stomatolog ko'rigida bo'lgansiz?
                </label>
                <input
                  type="text"
                  value={formData.lastDentistVisit}
                  onChange={(e) => handleInputChange('lastDentistVisit', e.target.value)}
                  placeholder="1 yil"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  5. Hozir tishingizda sizni bezovta qilayotgan muammolar bormi?
                </label>
                <textarea
                  value={formData.currentProblems}
                  onChange={(e) => handleInputChange('currentProblems', e.target.value)}
                  placeholder="Agar og'riq, sarg'ayish, tosh, qonash yoki boshqa muammolar bo'lsa yozib qoldiring"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 resize-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  6. Avval boshqa klinikaga borganmisiz? Agar ha bo'lsa, natija qanday bo'lgan?
                </label>
                <textarea
                  value={formData.previousClinicExperience}
                  onChange={(e) => handleInputChange('previousClinicExperience', e.target.value)}
                  placeholder="Agar ha bo'lsa – nima yoqmadi yoki qanday muammo qolganini yozing"
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 resize-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  7. Sizda tishda yetishmovchilik (bo'sh joy / yo'qolgan tish) bormi?
                </label>
                <textarea
                  value={formData.missingTeeth}
                  onChange={(e) => handleInputChange('missingTeeth', e.target.value)}
                  placeholder="Holatni qisqacha yozsangiz."
                  rows={2}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 resize-none text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-900 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  8. Qaysi vaqtda sizga telefon qilishimiz qulay? (09:00–18:00 orasida)
                </label>
                <input
                  type="text"
                  value={formData.preferredCallTime}
                  onChange={(e) => handleInputChange('preferredCallTime', e.target.value)}
                  placeholder="10:00–12:00"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
