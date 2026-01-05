import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { supabase, Doctor } from '../lib/supabase';
import { translations } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { language } = useLanguage();

  const t = translations[language];

  const [uiTexts, setUiTexts] = useState({
    title_align: 'center',
    subtitle_align: 'center',
    title_size: '36',
    subtitle_size: '18',
  });
  const [gradientSettings, setGradientSettings] = useState({
    opacity: '0.25',
    width: '90',
    height: '85',
    blur: '60',
  });

  useEffect(() => {
    fetchDoctors();
    fetchUITexts();
    fetchGradientSettings();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUITexts();
        fetchGradientSettings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [language]);


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [doctors]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || doctors.length === 0) return;

    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }, 3000);
    };

    const stopAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };

    startAutoScroll();

    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);
    container.addEventListener('touchstart', stopAutoScroll);

    return () => {
      stopAutoScroll();
      container.removeEventListener('mouseenter', stopAutoScroll);
      container.removeEventListener('mouseleave', startAutoScroll);
      container.removeEventListener('touchstart', stopAutoScroll);
    };
  }, [doctors]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const doctorsWithLang = data?.map(doctor => ({
        ...doctor,
        name: language === 'ru' && doctor.name_ru ? doctor.name_ru : doctor.name_uz || doctor.name,
        specialty: language === 'ru' && doctor.specialty_ru ? doctor.specialty_ru : doctor.specialty_uz || doctor.specialty,
        bio: language === 'ru' && doctor.bio_ru ? doctor.bio_ru : doctor.bio_uz || doctor.bio,
        education: language === 'ru' && doctor.education_ru ? doctor.education_ru : doctor.education_uz || doctor.education,
      })) || [];

      setDoctors(doctorsWithLang);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUITexts = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'doctors_title_align', 'doctors_subtitle_align',
          'doctors_title_size', 'doctors_subtitle_size'
        ]);

      if (error) throw error;

      const textsObj: any = {};
      data?.forEach((setting) => {
        if (setting.key === 'doctors_title_align') textsObj.title_align = setting.value;
        else if (setting.key === 'doctors_subtitle_align') textsObj.subtitle_align = setting.value;
        else if (setting.key === 'doctors_title_size') textsObj.title_size = setting.value;
        else if (setting.key === 'doctors_subtitle_size') textsObj.subtitle_size = setting.value;
      });

      setUiTexts(prev => ({ ...prev, ...textsObj }));
    } catch (error) {
      console.error('Error fetching UI texts:', error);
    }
  };

  const fetchGradientSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['gradient_opacity', 'gradient_width', 'gradient_height', 'gradient_blur']);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach((setting) => {
        if (setting.key === 'gradient_opacity') settingsObj.opacity = setting.value;
        else if (setting.key === 'gradient_width') settingsObj.width = setting.value;
        else if (setting.key === 'gradient_height') settingsObj.height = setting.value;
        else if (setting.key === 'gradient_blur') settingsObj.blur = setting.value;
      });

      setGradientSettings(prev => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error fetching gradient settings:', error);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <section id="team" className="bg-black text-white py-24">
        <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px]">
          <div className="text-center mb-16">
            <h2 className="font-bold mb-4" style={{ fontSize: `${uiTexts.title_size}px` }}>{t.doctors.title}</h2>
            <p className="text-xl text-neutral-400">{t.common.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="relative bg-black text-white py-24 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{
          width: `${gradientSettings.width}%`,
          height: `${gradientSettings.height}%`,
          background: `radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0, 102, 255, ${gradientSettings.opacity}) 0%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.6}) 30%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.32}) 50%, transparent 70%)`,
          filter: `blur(${gradientSettings.blur}px)`,
        }}
      />

      <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px] mb-12 relative z-10">
        <div className="mb-4">
          <h2
            className={`font-bold mb-8 tracking-tight text-center ${
              uiTexts.title_align === 'left' ? 'md:text-left' :
              uiTexts.title_align === 'right' ? 'md:text-right' :
              'md:text-center'
            }`}
            style={{ fontSize: `${uiTexts.title_size}px` }}
          >
            {t.doctors.title}
          </h2>
          <p
            className={`text-neutral-400 max-w-2xl text-center mx-auto ${
              uiTexts.subtitle_align === 'left' ? 'md:text-left md:mx-0' :
              uiTexts.subtitle_align === 'right' ? 'md:text-right md:ml-auto md:mr-0' :
              'md:text-center md:mx-auto'
            }`}
            style={{ fontSize: `${uiTexts.subtitle_size}px` }}
          >
            {t.doctors.subtitle}
          </p>
        </div>
      </div>

      <div className="relative px-4 md:px-10 lg:px-[96px] z-10">
        <button
          onClick={() => scroll('left')}
          className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-neutral-900 border-2 border-neutral-700 rounded-full items-center justify-center hover:bg-neutral-800 hover:border-neutral-600 transition-all shadow-2xl ${
            !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => scroll('right')}
          className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-neutral-900 border-2 border-neutral-700 rounded-full items-center justify-center hover:bg-neutral-800 hover:border-neutral-600 transition-all shadow-2xl ${
            !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-8 md:mx-16"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[380px] bg-neutral-900 rounded-3xl p-8 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group"
            >
              <div className="mb-6">
                <div className="w-56 h-56 mx-auto bg-neutral-900 rounded-2xl flex items-center justify-center text-white text-4xl font-bold transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                  {doctor.image_url ? (
                    <img
                      src={doctor.image_url}
                      alt={doctor.name}
                      className="w-full h-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    doctor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  )}
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold mb-2">{doctor.name}</h3>
                <p className="text-blue-400 font-medium mb-1">{doctor.specialty}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
                  <Award className="w-4 h-4" />
                  <span>{doctor.years_experience} {t.doctors.experience}</span>
                </div>
              </div>

              {doctor.education && (
                <div className="mb-4 text-sm text-neutral-400 text-center">
                  <p className="line-clamp-2">{doctor.education}</p>
                </div>
              )}

              {doctor.bio && (
                <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
                  {doctor.bio}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex md:hidden items-center justify-center gap-4 mt-8">
          <button
            onClick={() => scroll('left')}
            className={`w-14 h-14 bg-neutral-900 border-2 border-neutral-700 rounded-full flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-600 transition-all shadow-2xl ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex justify-center gap-2">
            {doctors.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-neutral-700"
              />
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className={`w-14 h-14 bg-neutral-900 border-2 border-neutral-700 rounded-full flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-600 transition-all shadow-2xl ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
