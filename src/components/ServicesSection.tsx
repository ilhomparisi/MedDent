import { useState, useEffect } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { useConfiguration } from '../contexts/ConfigurationContext';
import ServiceDetailModal from './ServiceDetailModal';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface ServicesSectionProps {
  onBookClick: (serviceId?: string) => void;
}

interface Service {
  _id?: string;
  id?: string;
  title: string;
  title_uz?: string;
  title_ru?: string;
  description: string;
  description_uz?: string;
  description_ru?: string;
  detailed_description?: string;
  detailed_description_uz?: string;
  detailed_description_ru?: string;
  price_from?: number;
  duration_minutes?: number;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  display_order?: number;
}

export default function ServicesSection({ onBookClick }: ServicesSectionProps) {
  const { language } = useLanguage();
  const { getConfig } = useConfiguration();
  const t = translations[language];
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.1);
  
  const uiTexts = {
    title: getConfig('services_title', 'Bizning Xizmatlarimiz'),
    subtitle: getConfig('services_subtitle', 'Zamonaviy texnologiya va usullar bilan sizning ehtiyojlaringizga moslashtirilgan to\'liq stomatologik xizmatlar.'),
    price_prefix: getConfig('services_price_prefix', 'dan'),
    duration_label: getConfig('services_duration_label', 'Muolaja Vaqti'),
    title_align: getConfig('services_title_align', 'center'),
    subtitle_align: getConfig('services_subtitle_align', 'center'),
  };

  useEffect(() => {
    fetchServices();
    fetchBackground();
  }, [language]);

  const fetchServices = async () => {
    try {
      const data = await api.getServices(true);
      
      const servicesWithLang = data.map((service: any) => ({
        ...service,
        id: service._id || service.id,
        title: language === 'ru' && service.title_ru ? service.title_ru : service.title_uz || service.title,
        description: language === 'ru' && service.description_ru ? service.description_ru : service.description_uz || service.description,
        detailed_description: language === 'ru' && service.detailed_description_ru ? service.detailed_description_ru : service.detailed_description_uz || service.detailed_description,
      }));

      setServices(servicesWithLang);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackground = async () => {
    try {
      const data = await api.getSectionBackground('services');
      if (data) {
        setBackgroundImage(data.image_url || '');
        setBackgroundOpacity(parseFloat(data.opacity) || 0.1);
      }
    } catch (error) {
      console.error('Error fetching services background:', error);
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
