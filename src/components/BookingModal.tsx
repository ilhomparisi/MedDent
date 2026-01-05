import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { supabase, Service, Doctor } from '../lib/supabase';
import { translations } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

type BookingMode = 'select' | 'quick' | 'scheduled';

export default function BookingModal({ isOpen, onClose, preselectedServiceId }: BookingModalProps) {
  const [mode, setMode] = useState<BookingMode>('select');
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { language } = useLanguage();

  const t = translations[language];

  const [formData, setFormData] = useState({
    patient_name: '',
    email: '',
    phone: '',
    service_id: preselectedServiceId || '',
    doctor_id: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (preselectedServiceId) {
        setFormData(prev => ({ ...prev, service_id: preselectedServiceId }));
      }
    }
  }, [isOpen, preselectedServiceId]);

  const fetchData = async () => {
    try {
      const [servicesRes, doctorsRes] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true).order('display_order'),
        supabase.from('doctors').select('*').eq('is_active', true),
      ]);

      if (servicesRes.data) setServices(servicesRes.data);
      if (doctorsRes.data) setDoctors(doctorsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        patient_name: formData.patient_name,
        email: formData.email,
        phone: formData.phone,
        service_id: formData.service_id || null,
        doctor_id: formData.doctor_id || null,
        preferred_date: formData.preferred_date || null,
        preferred_time: formData.preferred_time || null,
        message: formData.message || null,
        booking_type: mode === 'quick' ? 'quick' : 'scheduled',
        status: 'pending',
      };

      const { error } = await supabase.from('appointments').insert([appointmentData]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Qabulga yozilish muvaffaqiyatsiz. Qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMode('select');
    setSuccess(false);
    setFormData({
      patient_name: '',
      email: '',
      phone: '',
      service_id: preselectedServiceId || '',
      doctor_id: '',
      preferred_date: '',
      preferred_time: '',
      message: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-neutral-900">{t.booking.title}</h2>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">{t.booking.success.title}</h3>
              <p className="text-neutral-600">{t.booking.success.message}</p>
            </div>
          ) : mode === 'select' ? (
            <div className="space-y-4">
              <p className="text-neutral-600 mb-6">
                {t.booking.selectMode}
              </p>

              <button
                onClick={() => setMode('quick')}
                className="w-full p-6 border-2 border-neutral-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <MessageSquare className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{t.booking.quick.title}</h3>
                    <p className="text-neutral-600">{t.booking.quick.description}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMode('scheduled')}
                className="w-full p-6 border-2 border-neutral-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <Calendar className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{t.booking.scheduled.title}</h3>
                    <p className="text-neutral-600">{t.booking.scheduled.description}</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t.booking.form.changeMethod}
              </button>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  {t.booking.form.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="Abdullayev Abdulla"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {t.booking.form.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    {t.booking.form.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t.booking.form.service}
                </label>
                <select
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="">{t.booking.form.selectService}</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              {mode === 'scheduled' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      {t.booking.form.doctor}
                    </label>
                    <select
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">{t.booking.form.anyDoctor}</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        {t.booking.form.preferredDate} *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        {t.booking.form.preferredTime} *
                      </label>
                      <select
                        required
                        value={formData.preferred_time}
                        onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">{t.booking.form.selectTime}</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  {t.booking.form.message}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                  placeholder={t.booking.form.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.booking.form.submitting : t.booking.form.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
