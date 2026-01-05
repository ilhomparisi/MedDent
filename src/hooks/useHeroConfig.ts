import { useConfigValues } from '../contexts/ConfigurationContext';
import { translations } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';

export interface HeroConfig {
  hero_title: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  hero_badge_text: string;
  hero_badge_text_align: string;
  hero_badge_text_size: string;
  hero_badge_text_size_mobile: string;
  hero_badge_font_family: string;
  offer_enabled: boolean;
  offer_hours: number;
  hero_title_align: string;
  hero_subtitle_align: string;
  hero_button_align: string;
  hero_title_size: string;
  hero_title_line1_size: string;
  hero_title_line2_size: string;
  hero_title_line1_size_mobile: string;
  hero_title_line2_size_mobile: string;
  hero_subtitle_size: string;
  hero_subtitle_size_mobile: string;
  hero_button_text_size: string;
  hero_button_text_size_mobile: string;
  hero_count_up_enabled: boolean;
  hero_count_up_number: number;
  hero_count_up_text: string;
  hero_count_up_duration: number;
  hero_count_up_duration_mobile: number;
  hero_count_up_text_size: number;
  hero_count_up_text_size_mobile: number;
  hero_button_height_mobile: number;
  hero_button_width_mobile: string;
  text_glow_color: string;
  text_glow_intensity: string;
  hero_card_image: string;
  primary_color: string;
  tooth_icon_color: string;
  tooth_icon_glow_color: string;
  tooth_icon_glow_intensity: string;
  tooth_icon_url: string;
  hero_oval_frame_border_color: string;
  hero_oval_frame: boolean;
}

const DEFAULT_HERO_CONFIG: HeroConfig = {
  hero_title: '',
  hero_title_line1: '',
  hero_title_line2: '',
  hero_subtitle: '',
  hero_cta_primary: '',
  hero_cta_secondary: '',
  hero_badge_text: '',
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
  hero_count_up_text: '',
  hero_count_up_duration: 2000,
  hero_count_up_duration_mobile: 1500,
  hero_count_up_text_size: 18,
  hero_count_up_text_size_mobile: 16,
  hero_button_height_mobile: 50,
  hero_button_width_mobile: 'auto',
  text_glow_color: '#ffffff',
  text_glow_intensity: '50',
  hero_card_image: '',
  primary_color: '#2563eb',
  tooth_icon_color: '#2563eb',
  tooth_icon_glow_color: '#2563eb',
  tooth_icon_glow_intensity: '50',
  tooth_icon_url: '',
  hero_oval_frame_border_color: '#2563eb',
  hero_oval_frame: true,
};

export function useHeroConfig(): HeroConfig {
  const { language } = useLanguage();
  const t = translations[language];

  const config = useConfigValues<HeroConfig>(
    Object.keys(DEFAULT_HERO_CONFIG) as Array<keyof HeroConfig>,
    {
      ...DEFAULT_HERO_CONFIG,
      hero_title: t.hero.title,
      hero_title_line1: t.hero.titleLine1,
      hero_title_line2: t.hero.titleLine2,
      hero_subtitle: t.hero.subtitle,
      hero_cta_primary: t.hero.ctaPrimary,
      hero_cta_secondary: t.hero.ctaSecondary,
      hero_badge_text: t.hero.badge,
      hero_count_up_text: t.hero.countUpText,
    }
  );

  return config;
}
