import { useState, useEffect } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { supabase, Service } from '../lib/supabase';
import ServiceDetailModal from './ServiceDetailModal';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface ServicesSectionProps {
  onBookClick: (serviceId?: string) => void;
}

export default function ServicesSection({ onBookClick }: ServicesSectionProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.1);
  const [uiTexts, setUiTexts] = useState({
    title: 'Bizning Xizmatlarimiz',
    subtitle: 'Zamonaviy texnologiya va usullar bilan sizning ehtiyojlaringizga moslashtirilgan to\'liq stomatologik xizmatlar.',
    price_prefix: 'danboshlab',
    duration_label: 'Muolaja Vaqti',
    title_align: 'center',
    subtitle_align: 'center',
  });

  useEffect(() => {
    fetchServices();
    fetchBackground();
    fetchUITexts();
  }, [language]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      const servicesWithLang = data?.map(service => ({
        ...service,
        title: language === 'ru' && service.title_ru ? service.title_ru : service.title_uz || service.title,
        description: language === 'ru' && service.description_ru ? service.description_ru : service.description_uz || service.description,
        detailed_description: language === 'ru' && service.detailed_description_ru ? service.detailed_description_ru : service.detailed_description_uz || service.detailed_description,
      })) || [];

      setServices(servicesWithLang);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackground = async () => {
    try {
      const { data, error } = await supabase
        .from('section_backgrounds')
        .select('image_url, opacity')
        .eq('section_name', 'services')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBackgroundImage(data.image_url || '');
        setBackgroundOpacity(parseFloat(data.opacity) || 0.1);
      }
    } catch (error) {
      console.error('Error fetching services background:', error);
    }
  };

  const fetchUITexts = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['services_title', 'services_subtitle', 'services_price_prefix', 'services_duration_label', 'services_title_align', 'services_subtitle_align']);

      if (error) throw error;

      const textsObj: any = {};
      data?.forEach((setting) => {
        if (setting.key === 'services_title') textsObj.title = setting.value;
        else if (setting.key === 'services_subtitle') textsObj.subtitle = setting.value;
        else if (setting.key === 'services_price_prefix') textsObj.price_prefix = setting.value;
        else if (setting.key === 'services_duration_label') textsObj.duration_label = setting.value;
        else if (setting.key === 'services_title_align') textsObj.title_align = setting.value;
        else if (setting.key === 'services_subtitle_align') textsObj.subtitle_align = setting.value;
      });

      setUiTexts(prev => ({ ...prev, ...textsObj }));
    } catch (error) {
      console.error('Error fetching UI texts:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const handleLearnMore = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <section id="services" className="relative bg-white py-24">
        <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px]">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-neutral-900 mb-4">{t.services.title}</h2>
            <p className="text-xl text-neutral-600">{t.common.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <SectionWrapper sectionName="services" id="services" className="relative bg-white py-24 overflow-hidden">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              opacity: backgroundOpacity,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

        <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px]">
          <div className="mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold text-neutral-900 mb-4 tracking-tight ${
              uiTexts.title_align === 'left' ? 'text-left' :
              uiTexts.title_align === 'right' ? 'text-right' :
              'text-center'
            }`}>
              {uiTexts.title}
            </h2>
            <p className={`text-xl text-neutral-600 max-w-2xl ${
              uiTexts.subtitle_align === 'left' ? 'text-left' :
              uiTexts.subtitle_align === 'right' ? 'text-right ml-auto' :
              'text-center mx-auto'
            }`}>
              {uiTexts.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-neutral-200/50"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-200">
                    <div>
                      <p className="text-2xl font-bold text-neutral-900">
                        {formatPrice(service.price_from)} <span className="text-sm font-normal text-neutral-500">UZS</span>
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">{uiTexts.price_prefix}</p>
                    </div>
                    <div className="flex flex-col items-end text-neutral-600">
                      <p className="text-xs text-neutral-500 mb-1">{uiTexts.duration_label}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">~{service.duration} {t.services.minutes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLearnMore(service.id)}
                      className="flex-1 px-4 py-3 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      {t.services.learnMore}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => onBookClick(service.id)}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all"
                    >
                      {t.services.bookNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <ServiceDetailModal
        serviceId={selectedServiceId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedServiceId(null);
        }}
        onBookService={onBookClick}
      />
    </>
  );
}
