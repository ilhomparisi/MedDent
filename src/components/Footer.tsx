import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Send, Clock } from 'lucide-react';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onBookClick: () => void;
  onOpenConsultation?: () => void;
}

interface Settings {
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  working_hours_weekday: string;
  working_hours_saturday: string;
  working_hours_sunday: string;
  social_facebook: string;
  social_instagram: string;
  social_telegram: string;
}

export default function Footer({ onBookClick, onOpenConsultation }: FooterProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [settings, setSettings] = useState<Settings>({
    contact_phone: '+998 90 123 45 67',
    contact_email: 'info@dentalcare.uz',
    contact_address: '123 Amir Temur Street, Tashkent, Uzbekistan',
    working_hours_weekday: 'Dushanba - Juma: 9:00 - 20:00',
    working_hours_saturday: 'Shanba: 10:00 - 18:00',
    working_hours_sunday: 'Yakshanba: Yopiq',
    social_facebook: 'https://facebook.com',
    social_instagram: 'https://instagram.com',
    social_telegram: 'https://t.me',
  });
  const [logoUrl, setLogoUrl] = useState('/image.png');
  const [uiTexts, setUiTexts] = useState({
    description: translations.uz.footer.description,
    quick_links: translations.uz.footer.quickLinks,
    our_services: translations.uz.footer.ourServices,
    our_doctors: translations.uz.footer.ourDoctors,
    patient_reviews: translations.uz.footer.patientReviews,
    book_appointment: translations.uz.footer.bookAppointment,
    contact_us: translations.uz.footer.contactUs,
    working_hours: translations.uz.footer.workingHours,
    emergency: translations.uz.footer.emergency,
    emergency_text: translations.uz.footer.emergencyText,
    copyright: translations.uz.footer.copyright,
    privacy: translations.uz.footer.privacy,
    terms: translations.uz.footer.terms,
    cookies: translations.uz.footer.cookies,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchUITexts();
  }, [language]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'contact_phone',
          'contact_email',
          'contact_address',
          'working_hours_weekday',
          'working_hours_saturday',
          'working_hours_sunday',
          'social_facebook',
          'social_instagram',
          'social_telegram',
          'site_logo',
        ]);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach((setting) => {
        if (setting.key === 'site_logo' && setting.value) {
          const cacheBuster = `?t=${Date.now()}`;
          setLogoUrl(setting.value + cacheBuster);
        } else {
          settingsObj[setting.key] = setting.value;
        }
      });

      setSettings((prev) => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchUITexts = async () => {
    try {
      const { data, error } = await supabase
        .from('ui_texts')
        .select('key, value, value_uz, value_ru')
        .eq('section', 'footer');

      if (error) throw error;

      const textsObj: any = {};
      data?.forEach((text) => {
        if (language === 'ru' && text.value_ru) {
          textsObj[text.key] = text.value_ru;
        } else if (text.value_uz) {
          textsObj[text.key] = text.value_uz;
        } else {
          textsObj[text.key] = text.value;
        }
      });

      setUiTexts(prev => ({ ...prev, ...textsObj }));
    } catch (error) {
      console.error('Error fetching UI texts:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-neutral-900 text-white overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px] py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 overflow-x-hidden">
          <div>
            <div className="mb-6">
              <img
                src={logoUrl}
                alt="MedDent"
                className="md:h-16 w-auto max-w-full" style={{ height: '64px' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/image.png';
                }}
              />
            </div>
            <p className="text-neutral-400 leading-relaxed mb-6 text-sm md:text-base break-words">
              {uiTexts.description}
            </p>
            <div className="flex gap-4">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.social_telegram && (
                <a
                  href={settings.social_telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4">{uiTexts.quick_links}</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-neutral-400 hover:text-white transition-colors text-sm md:text-base text-left"
                >
                  {t.nav.patientResults}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-neutral-400 hover:text-white transition-colors text-sm md:text-base text-left"
                >
                  {uiTexts.our_doctors}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-neutral-400 hover:text-white transition-colors text-sm md:text-base text-left"
                >
                  {uiTexts.patient_reviews}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenConsultation?.()}
                  className="text-neutral-400 hover:text-white transition-colors text-sm md:text-base text-left"
                >
                  {uiTexts.book_appointment}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4">{uiTexts.contact_us}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-neutral-400 text-sm md:text-base break-words">
                  {settings.contact_address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`} className="text-neutral-400 hover:text-white transition-colors text-sm md:text-base break-words">
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="text-neutral-400 hover:text-white transition-colors text-sm md:text-base break-words">
                  {settings.contact_email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4">{uiTexts.working_hours}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-neutral-400 text-sm md:text-base break-words">{settings.working_hours_weekday}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-neutral-400 text-sm md:text-base break-words">{settings.working_hours_saturday}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-neutral-400 text-sm md:text-base break-words">{settings.working_hours_sunday}</p>
                </div>
              </li>
              <li className="mt-4 pt-4 border-t border-neutral-800">
                <p className="text-blue-400 font-medium text-sm md:text-base">{uiTexts.emergency}</p>
                <p className="text-neutral-400 text-sm break-words">{uiTexts.emergency_text}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              {uiTexts.copyright}
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                {uiTexts.privacy}
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                {uiTexts.terms}
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                {uiTexts.cookies}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
