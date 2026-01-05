import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface ValueStackingSectionProps {
  onOpenConsultation: () => void;
}

interface ValueStacking {
  id: string;
  main_heading: string;
  left_pay_label: string;
  left_price: string;
  left_description: string;
  left_button_text: string;
  right_pay_label: string;
  right_price: string;
  right_description: string;
  right_button_text: string;
  vs_text: string;
  is_active: boolean;
  main_heading_size: number;
  pay_label_size: number;
  price_size: number;
  description_size: number;
  button_text_size: number;
  main_heading_size_mobile?: number;
  pay_label_size_mobile?: number;
  price_size_mobile?: number;
  description_size_mobile?: number;
  button_text_size_mobile?: number;
  main_heading_color: string;
  left_card_scale: number;
  right_card_scale: number;
  left_card_scale_mobile: number;
  right_card_scale_mobile: number;
  left_description_to_button_spacing_mobile?: number;
  left_description_to_button_spacing_desktop?: number;
  right_description_to_button_spacing_mobile?: number;
  right_description_to_button_spacing_desktop?: number;
}

export default function ValueStackingSection({ onOpenConsultation }: ValueStackingSectionProps) {
  const { language } = useLanguage();
  const [data, setData] = useState<ValueStacking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [gradientSettings, setGradientSettings] = useState({
    opacity: '0.25',
    width: '90',
    height: '85',
    blur: '60',
  });

  useEffect(() => {
    fetchData();
    fetchGradientSettings();
  }, [language]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      const { data: result, error } = await supabase
        .from('value_stacking')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (result) {
        const dataWithLang = {
          ...result,
          main_heading: language === 'ru' && result.main_heading_ru ? result.main_heading_ru : result.main_heading_uz || result.main_heading,
          left_pay_label: language === 'ru' && result.left_pay_label_ru ? result.left_pay_label_ru : result.left_pay_label_uz || result.left_pay_label,
          left_price: language === 'ru' && result.left_price_ru ? result.left_price_ru : result.left_price_uz || result.left_price,
          left_description: language === 'ru' && result.left_description_ru ? result.left_description_ru : result.left_description_uz || result.left_description,
          left_button_text: language === 'ru' && result.left_button_text_ru ? result.left_button_text_ru : result.left_button_text_uz || result.left_button_text,
          right_pay_label: language === 'ru' && result.right_pay_label_ru ? result.right_pay_label_ru : result.right_pay_label_uz || result.right_pay_label,
          right_price: language === 'ru' && result.right_price_ru ? result.right_price_ru : result.right_price_uz || result.right_price,
          right_description: language === 'ru' && result.right_description_ru ? result.right_description_ru : result.right_description_uz || result.right_description,
          right_button_text: language === 'ru' && result.right_button_text_ru ? result.right_button_text_ru : result.right_button_text_uz || result.right_button_text,
          vs_text: language === 'ru' && result.vs_text_ru ? result.vs_text_ru : result.vs_text_uz || result.vs_text,
        };
        setData(dataWithLang);
      }
    } catch (error) {
      console.error('Error fetching value stacking:', error);
    } finally {
      setLoading(false);
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

  const parseStrikethrough = (text: string) => {
    const parts = text.split(/~~(.+?)~~/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <del key={index}>{part}</del>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (loading || !data) {
    return null;
  }

  return (
    <section data-section="value-stacking" className="bg-black text-white py-24 relative overflow-hidden">
      <style>
        {`
          .value-heading {
            font-size: ${data.main_heading_size_mobile || 24}px;
          }
          .value-pay-label {
            font-size: ${data.pay_label_size_mobile || 10}px;
          }
          .value-price {
            font-size: ${data.price_size_mobile || 32}px;
          }
          .value-description {
            font-size: ${data.description_size_mobile || 12}px;
          }
          .value-button-text {
            font-size: ${data.button_text_size_mobile || 13}px;
          }

          @media (min-width: 768px) {
            .value-heading {
              font-size: ${data.main_heading_size}px;
            }
            .value-pay-label {
              font-size: ${data.pay_label_size}px;
            }
            .value-price {
              font-size: ${data.price_size}px;
            }
            .value-description {
              font-size: ${data.description_size}px;
            }
            .value-button-text {
              font-size: ${data.button_text_size}px;
            }
          }
        `}
      </style>
      <div
        className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{
          width: `${gradientSettings.width}%`,
          height: `${gradientSettings.height}%`,
          background: `radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0, 102, 255, ${gradientSettings.opacity}) 0%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.6}) 30%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.32}) 50%, transparent 70%)`,
          filter: `blur(${gradientSettings.blur}px)`,
        }}
      />

      <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px] relative z-10">
        <h2
          className="text-center font-bold pt-16 mb-6 md:mb-10 value-heading"
          style={{ lineHeight: '1.2', color: data.main_heading_color || '#FFFFFF' }}
        >
          {data.main_heading}
        </h2>

        <div className="relative">
          <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-blue-500"></div>

          <svg className="hidden lg:block absolute top-24 left-0 right-0 w-full pointer-events-none" height="120" preserveAspectRatio="xMidYMin meet" viewBox="0 0 1200 120">
            <line
              x1="600"
              y1="0"
              x2="300"
              y2="120"
              stroke="#0066CC"
              strokeWidth="2.5"
              strokeDasharray="8,4"
              opacity="0.8"
            />
            <line
              x1="600"
              y1="0"
              x2="900"
              y2="120"
              stroke="#0066CC"
              strokeWidth="2.5"
              strokeDasharray="8,4"
              opacity="0.8"
            />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12 relative max-w-[1400px] mx-auto" style={{ marginTop: '40px' }}>

            <div className="relative flex items-center justify-center">
              <div
                className="value-card bg-black border-2 rounded-3xl p-6 md:p-8 lg:p-12 h-full flex flex-col transition-all duration-300"
                style={{
                  borderColor: 'rgba(0, 102, 204, 0.3)',
                  boxShadow: '0 0 0 0 rgba(0, 102, 204, 0.2)',
                  transform: `scale(${(isMobile ? (data.left_card_scale_mobile || 100) : (data.left_card_scale || 100)) / 100})`,
                  transformOrigin: 'center',
                  width: '100%',
                  maxWidth: '640px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 102, 204, 0.6)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 102, 204, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 102, 204, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 102, 204, 0.2)';
                }}
              >
                <div className="text-center mb-6">
                  <p
                    className="text-gray-400 uppercase tracking-wider mb-4 value-pay-label"
                  >
                    {data.left_pay_label}
                  </p>
                  <p
                    className="font-bold text-white mb-6 md:mb-8 value-price"
                    style={{ lineHeight: '1' }}
                  >
                    {data.left_price}
                  </p>
                </div>

                <p
                  className="text-gray-300 text-center leading-relaxed value-description"
                >
                  {parseStrikethrough(data.left_description)}
                </p>

                <button
                  className="w-full bg-transparent border-2 border-white/30 text-white py-3 md:py-4 px-4 md:px-6 rounded-full font-semibold hover:bg-white/5 hover:border-white/60 transition-all duration-300 flex items-center justify-center gap-2 value-button-text"
                  style={{ marginTop: `${isMobile ? (data.left_description_to_button_spacing_mobile || 16) : (data.left_description_to_button_spacing_desktop || 64)}px` }}
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="truncate">{data.left_button_text}</span>
                </button>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-20 h-20 rounded-full border-4 bg-black" style={{ borderColor: '#0066CC' }}>
              <span className="font-bold text-2xl" style={{ color: '#0066CC' }}>{data.vs_text}</span>
            </div>

            <div className="lg:hidden flex items-center justify-center my-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-3 md:border-4 bg-black flex items-center justify-center" style={{ borderColor: '#0066CC' }}>
                <span className="font-bold text-lg md:text-2xl" style={{ color: '#0066CC' }}>{data.vs_text}</span>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div
                className="value-card rounded-3xl p-6 md:p-8 lg:p-12 h-full flex flex-col transition-all duration-300"
                style={{
                  background: 'linear-gradient(to bottom right, #0066CC, #0052A3)',
                  boxShadow: '0 0 0 0 rgba(0, 102, 204, 0.4)',
                  transform: `scale(${(isMobile ? (data.right_card_scale_mobile || 100) : (data.right_card_scale || 100)) / 100})`,
                  transformOrigin: 'center',
                  width: '100%',
                  maxWidth: '640px'
                }}
                onMouseEnter={(e) => {
                  const scale = (isMobile ? (data.right_card_scale_mobile || 100) : (data.right_card_scale || 100)) / 100;
                  e.currentTarget.style.transform = `scale(${scale * 1.02})`;
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 102, 204, 0.4)';
                }}
                onMouseLeave={(e) => {
                  const scale = (isMobile ? (data.right_card_scale_mobile || 100) : (data.right_card_scale || 100)) / 100;
                  e.currentTarget.style.transform = `scale(${scale})`;
                  e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 102, 204, 0.4)';
                }}
              >
                <div className="text-center mb-6">
                  <p
                    className="uppercase tracking-wider mb-4 value-pay-label"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {data.right_pay_label}
                  </p>
                  <p
                    className="font-bold text-white mb-6 md:mb-8 value-price"
                    style={{ lineHeight: '1' }}
                  >
                    {data.right_price}
                  </p>
                </div>

                <p
                  className="text-center leading-relaxed value-description"
                  style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                >
                  {parseStrikethrough(data.right_description)}
                </p>

                <button
                  onClick={() => {
                    const resultsSection = document.getElementById('results');
                    if (resultsSection) {
                      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full bg-white py-3 md:py-4 px-4 md:px-6 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] value-button-text"
                  style={{
                    color: '#0066CC',
                    marginTop: `${isMobile ? (data.right_description_to_button_spacing_mobile || 16) : (data.right_description_to_button_spacing_desktop || 64)}px`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <span className="truncate">{data.right_button_text}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
