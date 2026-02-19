import { useState, useEffect } from 'react';
import { Frown, Wind, AlertCircle, Heart, Star, Shield, Sparkles, Plus, LucideIcon } from 'lucide-react';
import { useConfiguration } from '../contexts/ConfigurationContext';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface FeatureBannersProps {
  onBookClick?: () => void;
}

interface KimUchunSettings {
  title: string;
  title_align: string;
  card1_text: string;
  card1_icon: string;
  card2_text: string;
  card2_icon: string;
  card3_text: string;
  card3_icon: string;
  button_text: string;
  button_align: string;
  button_text_size: string;
}

const iconMap: { [key: string]: LucideIcon } = {
  Frown,
  Wind,
  AlertCircle,
  Heart,
  Star,
  Shield,
  Sparkles,
};

export default function FeatureBanners({ onBookClick }: FeatureBannersProps) {
  const { language } = useLanguage();
  const { getConfig } = useConfiguration();
  const t = translations[language];
  
  const primaryColor = getConfig('primary_color', '#2563eb');
  const settings: KimUchunSettings = {
    title: getConfig('kim_uchun_title', ''),
    title_align: getConfig('kim_uchun_title_align', 'left'),
    card1_text: getConfig('kim_uchun_card1_text', ''),
    card1_icon: getConfig('kim_uchun_card1_icon', 'Frown'),
    card2_text: getConfig('kim_uchun_card2_text', ''),
    card2_icon: getConfig('kim_uchun_card2_icon', 'Wind'),
    card3_text: getConfig('kim_uchun_card3_text', ''),
    card3_icon: getConfig('kim_uchun_card3_icon', 'AlertCircle'),
    button_text: getConfig('kim_uchun_button_text', ''),
    button_align: getConfig('kim_uchun_button_align', 'center'),
    button_text_size: getConfig('kim_uchun_button_text_size', '16'),
  };
  const titleSize = getConfig('kim_uchun_title_size', '36');
  const cardTextSize = getConfig('kim_uchun_card_text_size', '16');

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || AlertCircle;
    return Icon;
  };

  const cards = [
    { text: settings.card1_text, icon: settings.card1_icon },
    { text: settings.card2_text, icon: settings.card2_icon },
    { text: settings.card3_text, icon: settings.card3_icon },
  ];

  return (
    <SectionWrapper sectionName="features" className="relative min-h-screen bg-white text-black flex items-center overflow-hidden py-20">
      <div className="relative z-10 w-full">
        <div className="w-full flex flex-col items-center px-8 md:px-10 lg:px-[96px]">
          <div className="mb-12 w-full max-w-[1920px]">
            <h2
              className={`font-bold tracking-tight leading-tight text-blue-600 mb-8 ${
                settings.title_align === 'left' ? 'text-left' :
                settings.title_align === 'right' ? 'text-right' :
                'text-center'
              }`}
              style={{ fontSize: `${titleSize}px` }}
            >
              {settings.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-[1920px] justify-items-center">
            {cards.map((card, index) => {
              const Icon = getIcon(card.icon);
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-neutral-200 transition-all hover:scale-105 flex flex-col items-center text-center w-full max-w-md"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: primaryColor }} />
                  </div>
                  <p
                    className="text-neutral-700 leading-relaxed"
                    style={{ fontSize: `${cardTextSize}px` }}
                  >
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={`flex w-full max-w-[1920px] ${
            settings.button_align === 'left' ? 'justify-start' :
            settings.button_align === 'right' ? 'justify-end' :
            'justify-center'
          }`}>
            <button
              onClick={() => {
                const valueStackingSection = document.querySelector('[data-section="value-stacking"]');
                if (valueStackingSection) {
                  valueStackingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                backgroundColor: primaryColor,
                fontSize: `${settings.button_text_size}px`
              }}
              className="px-8 py-3.5 text-white font-medium rounded-full hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2"
            >
              {settings.button_text}
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
