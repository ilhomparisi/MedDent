import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroSectionProps {
  onBookClick?: () => void;
}

interface HeroSettings {
  hero_title: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  hero_subtitle_uz?: string;
  hero_subtitle_ru?: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_badge_text: string;
  hero_badge_text_align: string;
  hero_badge_text_size?: string;
  hero_badge_text_size_mobile?: string;
  hero_badge_font_family?: string;
  offer_enabled: boolean;
  offer_hours: number;
  hero_title_align: string;
  hero_subtitle_align: string;
  hero_button_align: string;
  hero_title_size?: string;
  hero_title_line1_size?: string;
  hero_title_line2_size?: string;
  hero_title_line1_size_mobile?: string;
  hero_title_line2_size_mobile?: string;
  hero_subtitle_size?: string;
  hero_subtitle_size_mobile?: string;
  hero_button_text_size?: string;
  hero_button_text_size_mobile?: string;
  hero_count_up_enabled?: boolean;
  hero_count_up_number?: number;
  hero_count_up_text?: string;
  hero_count_up_duration?: number;
  hero_count_up_duration_mobile?: number;
  hero_count_up_text_size?: number;
  hero_count_up_text_size_mobile?: number;
  hero_button_height?: number;
  hero_button_height_mobile?: number;
  hero_button_width?: string;
  hero_button_width_mobile?: string;
  text_glow_color?: string;
  text_glow_intensity?: string;
  hero_spacing_subtitle_button?: number;
  hero_spacing_subtitle_button_mobile?: number;
  hero_spacing_button_countup?: number;
  hero_spacing_button_countup_mobile?: number;
  hero_spacing_above_badge?: number;
  hero_spacing_above_badge_mobile?: number;
  hero_subtitle_white_words_uz?: string;
  hero_subtitle_white_words_ru?: string;
}

const HERO_SPACING_CONFIG = {
  desktop: {
    aboveBadge: 0,
    badgeToTitle: 16,
    titleToSubtitle: 24,
    subtitleToButton: 34,
    buttonToCountup: 32,
  },
  mobile: {
    aboveBadge: 0,
    badgeToTitle: 12,
    titleToSubtitle: 20,
    subtitleToButton: 40,
    buttonToCountup: 10,
  },
};

const HERO_BUTTON_CONFIG = {
  desktop: {
    height: 64,
    width: 'auto',
    textSize: 20,
    textAlign: 'center',
    paddingX: 32,
  },
  mobile: {
    height: 60,
    width: '100%',
    textSize: 20,
    textAlign: 'center',
    paddingX: 12,
  },
};

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [settings, setSettings] = useState<HeroSettings>({
    hero_title: translations.uz.hero.title,
    hero_title_line1: translations.uz.hero.titleLine1,
    hero_title_line2: translations.uz.hero.titleLine2,
    hero_subtitle: translations.uz.hero.subtitle,
    hero_cta_primary: translations.uz.hero.ctaPrimary,
    hero_cta_secondary: translations.uz.hero.ctaSecondary,
    hero_badge_text: translations.uz.hero.badge,
    hero_badge_text_align: 'center',
    hero_badge_text_size: '14',
    hero_badge_text_size_mobile: '13',
    hero_badge_font_family: 'Inter, system-ui, -apple-system, sans-serif',
    offer_enabled: true,
    offer_hours: 24,
    hero_title_align: 'center',
    hero_subtitle_align: 'center',
    hero_button_align: 'center',
    hero_title_size: '48',
    hero_title_line1_size: '48',
    hero_title_line2_size: '64',
    hero_title_line1_size_mobile: '29.5',
    hero_title_line2_size_mobile: '34.5',
    hero_subtitle_size: '18',
    hero_subtitle_size_mobile: '13.5',
    hero_button_text_size: '18',
    hero_button_text_size_mobile: '16',
    hero_count_up_enabled: true,
    hero_count_up_number: 60,
    hero_count_up_text: translations.uz.hero.countUpText,
    hero_count_up_duration: 2000,
    hero_count_up_duration_mobile: 1500,
    hero_count_up_text_size: 18,
    hero_count_up_text_size_mobile: 16,
    hero_button_height_mobile: 50,
    hero_button_width_mobile: 'auto',
    text_glow_color: '#ffffff',
    text_glow_intensity: '50',
    hero_spacing_above_badge: HERO_SPACING_CONFIG.desktop.aboveBadge,
    hero_spacing_above_badge_mobile: HERO_SPACING_CONFIG.mobile.aboveBadge,
    hero_spacing_badge_title: HERO_SPACING_CONFIG.desktop.badgeToTitle,
    hero_spacing_badge_title_mobile: HERO_SPACING_CONFIG.mobile.badgeToTitle,
    hero_spacing_title_subtitle: HERO_SPACING_CONFIG.desktop.titleToSubtitle,
    hero_spacing_title_subtitle_mobile: HERO_SPACING_CONFIG.mobile.titleToSubtitle,
    hero_spacing_subtitle_button: HERO_SPACING_CONFIG.desktop.subtitleToButton,
    hero_spacing_subtitle_button_mobile: HERO_SPACING_CONFIG.mobile.subtitleToButton,
    hero_spacing_button_countup: HERO_SPACING_CONFIG.desktop.buttonToCountup,
    hero_spacing_button_countup_mobile: HERO_SPACING_CONFIG.mobile.buttonToCountup,
  });
  const [cardImage, setCardImage] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [heroImageOuterWidth, setHeroImageOuterWidth] = useState(236);
  const [heroImageOuterHeight, setHeroImageOuterHeight] = useState(436);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [countUpValue, setCountUpValue] = useState(0);
  const [toothIconColor, setToothIconColor] = useState('#2563eb');
  const [toothIconGlowColor, setToothIconGlowColor] = useState('#2563eb');
  const [toothIconGlowIntensity, setToothIconGlowIntensity] = useState('50');
  const [textGlowColor, setTextGlowColor] = useState('#ffffff');
  const [textGlowIntensity, setTextGlowIntensity] = useState('50');
  const [toothIconUrl, setToothIconUrl] = useState('');
  const [ovalFrameBorderColor, setOvalFrameBorderColor] = useState('#2563eb');

  useEffect(() => {
    fetchSettings();
    fetchCardImage();
    fetchPrimaryColor();
    fetchBadgeGlowSettings();
    fetchToothIcon();
    fetchOvalFrameBorderColor();
    fetchHeroImageDimensions();
  }, []);

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      hero_title: t.hero.title,
      hero_title_line1: t.hero.titleLine1,
      hero_title_line2: t.hero.titleLine2,
      hero_subtitle: t.hero.subtitle,
      hero_cta_primary: t.hero.ctaPrimary,
      hero_cta_secondary: t.hero.ctaSecondary,
      hero_badge_text: t.hero.badge,
      hero_count_up_text: t.hero.countUpText,
    }));
  }, [language, t]);

  // Count-up animation effect
  useEffect(() => {
    if (!settings.hero_count_up_enabled || !settings.hero_count_up_number) return;

    const targetNumber = settings.hero_count_up_number;
    const isMobile = window.innerWidth < 768;
    const duration = isMobile
      ? (settings.hero_count_up_duration_mobile || 1500)
      : (settings.hero_count_up_duration || 2000);
    const steps = 60;
    const increment = targetNumber / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCountUpValue(targetNumber);
        clearInterval(timer);
      } else {
        setCountUpValue(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [settings.hero_count_up_enabled, settings.hero_count_up_number, settings.hero_count_up_duration, settings.hero_count_up_duration_mobile]);


  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'hero_title',
          'hero_title_line1',
          'hero_title_line2',
          'hero_subtitle',
          'hero_cta_primary',
          'hero_cta_secondary',
          'hero_badge_text',
          'hero_badge_text_align',
          'hero_badge_text_size',
          'hero_badge_text_size_mobile',
          'hero_badge_font_family',
          'offer_enabled',
          'offer_hours',
          'hero_title_align',
          'hero_subtitle_align',
          'hero_button_align',
          'hero_title_size',
          'hero_title_line1_size',
          'hero_title_line2_size',
          'hero_title_line1_size_mobile',
          'hero_title_line2_size_mobile',
          'hero_subtitle_size',
          'hero_subtitle_size_mobile',
          'hero_button_text_size',
          'hero_button_text_size_mobile',
          'hero_count_up_enabled',
          'hero_count_up_number',
          'hero_count_up_text',
          'hero_count_up_duration',
          'hero_count_up_duration_mobile',
          'hero_count_up_text_size',
          'hero_count_up_text_size_mobile',
          'hero_button_height',
          'hero_button_height_mobile',
          'hero_button_width',
          'hero_button_width_mobile',
          'text_glow_color',
          'text_glow_intensity',
          'hero_spacing_badge_title',
          'hero_spacing_badge_title_mobile',
          'hero_spacing_title_subtitle',
          'hero_spacing_title_subtitle_mobile',
          'hero_spacing_subtitle_button',
          'hero_spacing_subtitle_button_mobile',
          'hero_spacing_button_countup',
          'hero_spacing_button_countup_mobile',
          'hero_spacing_above_badge',
          'hero_spacing_above_badge_mobile',
          'hero_subtitle_uz',
          'hero_subtitle_ru',
          'hero_subtitle_white_words_uz',
          'hero_subtitle_white_words_ru',
        ]);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach((setting) => {
        if (['offer_hours', 'hero_count_up_number', 'hero_count_up_duration', 'hero_count_up_duration_mobile', 'hero_count_up_text_size', 'hero_count_up_text_size_mobile', 'hero_button_height', 'hero_button_height_mobile', 'hero_button_width', 'hero_button_width_mobile', 'hero_title_size', 'hero_title_line1_size', 'hero_title_line2_size', 'hero_title_line1_size_mobile', 'hero_title_line2_size_mobile', 'hero_subtitle_size', 'hero_subtitle_size_mobile', 'hero_button_text_size', 'hero_button_text_size_mobile', 'hero_badge_text_size', 'hero_badge_text_size_mobile', 'hero_spacing_badge_title', 'hero_spacing_badge_title_mobile', 'hero_spacing_title_subtitle', 'hero_spacing_title_subtitle_mobile', 'hero_spacing_subtitle_button', 'hero_spacing_subtitle_button_mobile', 'hero_spacing_button_countup', 'hero_spacing_button_countup_mobile', 'hero_spacing_above_badge', 'hero_spacing_above_badge_mobile'].includes(setting.key)) {
          settingsObj[setting.key] = parseFloat(setting.value);
        } else if (setting.key === 'hero_count_up_enabled' || setting.key === 'offer_enabled') {
          settingsObj[setting.key] = setting.value === 'true' || setting.value === true;
        } else {
          settingsObj[setting.key] = setting.value;
        }
      });

      setSettings((prev) => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    }
  };

  const fetchCardImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_card_image')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setCardImage(data.value as string);
      }
    } catch (error) {
      console.error('Error fetching card image:', error);
    }
  };

  const fetchPrimaryColor = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'primary_color')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setPrimaryColor(data.value);
      }
    } catch (error) {
      console.error('Error fetching primary color:', error);
    }
  };

  const fetchBadgeGlowSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'tooth_icon_color',
          'tooth_icon_glow_color',
          'tooth_icon_glow_intensity',
          'text_glow_color',
          'text_glow_intensity',
          'hero_badge_glow_intensity'
        ]);

      if (error) throw error;

      let iconColor = '#2563eb';
      let iconGlowColor: string | null = null;
      let iconGlowIntensity: string | null = null;
      let txtGlowColor: string | null = null;
      let txtGlowIntensity: string | null = null;
      let legacyGlowIntensity: string | null = null;

      data?.forEach((setting) => {
        if (setting.key === 'tooth_icon_color') {
          iconColor = setting.value;
        } else if (setting.key === 'tooth_icon_glow_color') {
          iconGlowColor = setting.value;
        } else if (setting.key === 'tooth_icon_glow_intensity') {
          iconGlowIntensity = setting.value;
        } else if (setting.key === 'text_glow_color') {
          txtGlowColor = setting.value;
        } else if (setting.key === 'text_glow_intensity') {
          txtGlowIntensity = setting.value;
        } else if (setting.key === 'hero_badge_glow_intensity') {
          legacyGlowIntensity = setting.value;
        }
      });

      setToothIconColor(iconColor);
      setToothIconGlowColor(iconGlowColor || iconColor);
      setToothIconGlowIntensity(iconGlowIntensity || legacyGlowIntensity || '50');
      setTextGlowColor(txtGlowColor || '#ffffff');
      setTextGlowIntensity(txtGlowIntensity || legacyGlowIntensity || '50');
    } catch (error) {
      console.error('Error fetching badge glow settings:', error);
    }
  };

  const fetchToothIcon = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'tooth_icon_url')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setToothIconUrl(data.value as string);
      }
    } catch (error) {
      console.error('Error fetching tooth icon:', error);
    }
  };

  const fetchOvalFrameBorderColor = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_oval_frame_border_color')
        .maybeSingle();

      if (error) throw error;

      if (data?.value) {
        setOvalFrameBorderColor(data.value as string);
      }
    } catch (error) {
      console.error('Error fetching oval frame border color:', error);
    }
  };

  const fetchHeroImageDimensions = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['hero_image_outer_width', 'hero_image_outer_height']);

      if (error) throw error;

      data?.forEach((setting) => {
        if (setting.key === 'hero_image_outer_width') {
          setHeroImageOuterWidth(parseInt(setting.value, 10));
        } else if (setting.key === 'hero_image_outer_height') {
          setHeroImageOuterHeight(parseInt(setting.value, 10));
        }
      });
    } catch (error) {
      console.error('Error fetching hero image dimensions:', error);
    }
  };

  const calculateGlowEffect = (intensity: string, color: string) => {
    const intensityValue = parseInt(intensity) / 100;
    if (intensityValue === 0) return 'none';

    const baseBlur = 10 * intensityValue;
    const midBlur = 20 * intensityValue;
    const farBlur = 30 * intensityValue;
    const baseOpacity = 0.8 * intensityValue;
    const midOpacity = 0.6 * intensityValue;
    const farOpacity = 0.4 * intensityValue;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 37, g: 99, b: 235 };
    };

    const rgb = hexToRgb(color);
    return `0 0 ${baseBlur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${baseOpacity}), 0 0 ${midBlur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${midOpacity}), 0 0 ${farBlur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${farOpacity})`;
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(0, 102, 204, ${alpha})`;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getOvalFrameStyles = () => {
    return {
      border: `16px solid ${ovalFrameBorderColor}`,
    };
  };


  return (
    <SectionWrapper
      sectionName="hero"
      className="relative min-h-screen bg-black text-white overflow-hidden"
      heroImageWidth={heroImageOuterWidth}
      heroImageHeight={heroImageOuterHeight}
    >
      <style>
        {`
          .hero-button-text {
            font-size: ${settings.hero_button_text_size_mobile || '16'}px;
            white-space: normal;
            word-break: break-word;
            line-height: 1.3;
          }
          .hero-count-text {
            font-size: ${Math.max(11, (settings.hero_count_up_text_size_mobile || settings.hero_count_up_text_size || 18) * 0.65)}px;
          }
          .hero-count-number {
            font-size: ${Math.max(24, (settings.hero_count_up_text_size_mobile || settings.hero_count_up_text_size || 18) * 1.3)}px;
          }

          @media (min-width: 768px) {
            .hero-badge-text {
              font-size: ${settings.hero_badge_text_size || '14'}px !important;
            }
            .hero-title-line1 {
              font-size: ${settings.hero_title_line1_size || '29.5'}px !important;
            }
            .hero-title-line2 {
              font-size: ${settings.hero_title_line2_size || '34.5'}px !important;
            }
            .hero-subtitle {
              font-size: ${settings.hero_subtitle_size || '18'}px !important;
            }
            .hero-button-text {
              font-size: ${settings.hero_button_text_size || '18'}px;
              white-space: nowrap;
              line-height: 1;
            }
            .hero-count-text {
              font-size: ${Math.max(14, (settings.hero_count_up_text_size || 18) - 2)}px;
            }
            .hero-count-number {
              font-size: ${Math.max(32, (settings.hero_count_up_text_size || 18) * 1.8)}px;
            }
          }
        `}
      </style>

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(96,165,250,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 w-full max-w-full pt-36 md:pt-24 pb-12 md:pb-20 min-h-screen flex items-start md:items-center justify-center px-4 md:px-10 lg:px-[96px]">
        <div className="md:max-w-[1920px] md:mx-auto w-full max-w-full">
        <div className="grid gap-0 md:gap-12 items-center max-w-full" style={{ gridTemplateColumns: cardImage ? '1fr auto' : '1fr' }}>
          <div className={`${cardImage ? '' : 'lg:col-span-2'}`}>
            <div>
          <div className={`flex ${
            settings.hero_title_align === 'left' ? 'justify-start' :
            settings.hero_title_align === 'right' ? 'justify-end' :
            'justify-center'
          }`}
          style={{
            marginTop: `${isMobile ? settings.hero_spacing_above_badge_mobile : settings.hero_spacing_above_badge}px`,
            marginBottom: `${isMobile ? settings.hero_spacing_badge_title_mobile : settings.hero_spacing_badge_title}px`
          }}>
            <div
              style={{
                backgroundColor: 'rgba(55, 65, 81, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full border border-gray-700"
            >
              {toothIconUrl && (
                <img
                  src={toothIconUrl}
                  alt="Tooth Icon"
                  style={{
                    filter: `brightness(1.2) drop-shadow(${calculateGlowEffect(toothIconGlowIntensity, toothIconGlowColor)})`,
                  }}
                  className="w-4 h-4 md:w-6 md:h-6 object-contain flex-shrink-0"
                />
              )}
              <span
                style={{
                  color: '#ffffff',
                  fontSize: `${settings.hero_badge_text_size_mobile || '13'}px`,
                  fontFamily: settings.hero_badge_font_family || 'Inter, system-ui, -apple-system, sans-serif',
                  textShadow: calculateGlowEffect(settings.text_glow_intensity || '0', settings.text_glow_color || '#ffffff'),
                  lineHeight: '1.2',
                }}
                className="font-medium hero-badge-text"
              >
                {settings.hero_badge_text}
              </span>
            </div>
          </div>
          <h1 className={`font-bold tracking-tight leading-tight max-w-4xl ${
            settings.hero_title_align === 'left' ? 'text-left' :
            settings.hero_title_align === 'right' ? 'text-right ml-auto' :
            'text-center mx-auto'
          }`}>
            <div
              style={{
                fontSize: `${settings.hero_title_line1_size_mobile || '29.5'}px`,
              }}
              className="hero-title-line1"
            >
              {settings.hero_title_line1.split(' ').map((word, index) => (
                <span
                  key={index}
                  style={{
                    color: '#ffffff',
                  }}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
            <div
              style={{
                fontSize: `${settings.hero_title_line2_size_mobile || '34.5'}px`,
              }}
              className="hero-title-line2"
            >
              {settings.hero_title_line2.split(' ').map((word, index) => (
                <span
                  key={index}
                  style={{
                    color: '#0066CC',
                  }}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </h1>

          <p
            style={{
              fontSize: `${settings.hero_subtitle_size_mobile || '13.5'}px`,
              marginTop: `${isMobile ? settings.hero_spacing_title_subtitle_mobile : settings.hero_spacing_title_subtitle}px`,
            }}
            className={`text-neutral-400 max-w-2xl hero-subtitle ${
              settings.hero_subtitle_align === 'left' ? 'text-left' :
              settings.hero_subtitle_align === 'right' ? 'text-right ml-auto' :
              'text-center mx-auto'
            }`}
          >
            {(() => {
              const normalizeApostrophes = (str: string): string => {
                return str.replace(/[''ʻʼ`´]/g, "'");
              };

              const getHighlightPhrases = (lang: 'uz' | 'ru') => {
                const settingKey = lang === 'ru' ? 'hero_subtitle_white_words_ru' : 'hero_subtitle_white_words_uz';
                const wordsString = settings[settingKey];

                if (!wordsString || wordsString.trim() === '') {
                  return [];
                }

                return wordsString.split(',').map(word => word.trim()).filter(word => word.length > 0);
              };

              const highlightPhrases = getHighlightPhrases(language);

              const getSubtitleText = () => {
                if (language === 'ru' && settings.hero_subtitle_ru) {
                  return settings.hero_subtitle_ru;
                } else if (language === 'uz' && settings.hero_subtitle_uz) {
                  return settings.hero_subtitle_uz;
                }
                return settings.hero_subtitle;
              };

              let text = getSubtitleText();

              if (highlightPhrases.length === 0) {
                return text;
              }

              const normalizedText = normalizeApostrophes(text.toLowerCase());
              const result: Array<{ text: string; highlighted: boolean }> = [];
              let currentIndex = 0;

              for (const phrase of highlightPhrases) {
                const normalizedPhrase = normalizeApostrophes(phrase.toLowerCase());
                const phraseIndex = normalizedText.indexOf(normalizedPhrase, currentIndex);
                if (phraseIndex !== -1) {
                  if (phraseIndex > currentIndex) {
                    result.push({ text: text.substring(currentIndex, phraseIndex), highlighted: false });
                  }
                  result.push({ text: text.substring(phraseIndex, phraseIndex + phrase.length), highlighted: true });
                  currentIndex = phraseIndex + phrase.length;
                }
              }

              if (currentIndex < text.length) {
                result.push({ text: text.substring(currentIndex), highlighted: false });
              }

              return result.map((part, index) => {
                if (part.highlighted) {
                  return (
                    <span
                      key={index}
                      style={{
                        color: '#ffffff',
                      }}
                    >
                      {part.text}
                    </span>
                  );
                }
                return <span key={index}>{part.text}</span>;
              });
            })()}
          </p>

          <div className={`flex flex-col md:flex-row items-center ${
            settings.hero_button_align === 'left' ? 'md:justify-start' :
            settings.hero_button_align === 'right' ? 'md:justify-end' :
            'md:justify-center'
          }`}
          style={{
            marginTop: `${isMobile ? settings.hero_spacing_subtitle_button_mobile : settings.hero_spacing_subtitle_button}px`,
            gap: `${isMobile ? settings.hero_spacing_button_countup_mobile : settings.hero_spacing_button_countup}px`,
          }}>
            <button
              onClick={() => {
                const featuresSection = document.querySelector('[data-section="features"]');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative flex items-center font-medium rounded-full transition-all duration-300 hover:scale-105 overflow-visible justify-center"
              style={{
                background: `linear-gradient(to right, ${primaryColor}e6, ${primaryColor}d9)`,
                color: '#ffffff',
                height: isMobile
                  ? `${HERO_BUTTON_CONFIG.mobile.height}px`
                  : `${HERO_BUTTON_CONFIG.desktop.height}px`,
                width: isMobile
                  ? HERO_BUTTON_CONFIG.mobile.width
                  : HERO_BUTTON_CONFIG.desktop.width,
                paddingLeft: isMobile ? `${HERO_BUTTON_CONFIG.mobile.paddingX}px` : `${HERO_BUTTON_CONFIG.desktop.paddingX}px`,
                paddingRight: isMobile ? `${HERO_BUTTON_CONFIG.mobile.paddingX}px` : `${HERO_BUTTON_CONFIG.desktop.paddingX}px`,
              }}
            >
              <span
                className="relative z-10 flex-1 hero-button-text whitespace-nowrap flex items-center justify-center"
                style={{
                  fontSize: isMobile
                    ? `${HERO_BUTTON_CONFIG.mobile.textSize}px`
                    : `${HERO_BUTTON_CONFIG.desktop.textSize}px`,
                  textAlign: isMobile
                    ? HERO_BUTTON_CONFIG.mobile.textAlign
                    : HERO_BUTTON_CONFIG.desktop.textAlign,
                  paddingRight: isMobile ? '36px' : '48px',
                }}
              >
                {settings.hero_cta_primary}
              </span>
              <div
                className="absolute top-1/2 -translate-y-1/2 right-2 md:right-2 z-10 bg-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
              >
                <svg
                  className="w-3.5 h-3.5 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: primaryColor }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>

            {settings.hero_count_up_enabled && (
              <div className="flex items-center gap-2 text-white justify-center md:justify-start">
                <span className="font-bold hero-count-number">
                  {countUpValue}+
                </span>
                <span className="opacity-90 hero-count-text">
                  {settings.hero_count_up_text}
                </span>
              </div>
            )}
          </div>

        </div>


          </div>

          {cardImage && (
            <div className="oval-frame-wrapper flex items-center justify-center" data-hero-oval-parent style={{ minWidth: 'fit-content', justifySelf: 'center' }}>
              <div
                className="oval-frame-outer"
                data-hero-oval-container
                style={{
                  width: `${heroImageOuterWidth}px`,
                  height: `${heroImageOuterHeight}px`,
                  minWidth: `${heroImageOuterWidth}px`,
                  minHeight: `${heroImageOuterHeight}px`,
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '0px',
                  flexShrink: 0,
                  ...getOvalFrameStyles(),
                }}
              >
                <div
                  className="oval-frame-inner"
                  data-hero-oval-frame
                  style={{
                    width: `${heroImageOuterWidth - 48}px`,
                    height: `${heroImageOuterHeight - 48}px`,
                    minWidth: `${heroImageOuterWidth - 48}px`,
                    minHeight: `${heroImageOuterHeight - 48}px`,
                    borderRadius: '999px',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={cardImage}
                    alt="Dental Services"
                    className="oval-frame-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neutral-700 rounded-full p-1">
            <div className="w-1.5 h-2 bg-neutral-500 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
