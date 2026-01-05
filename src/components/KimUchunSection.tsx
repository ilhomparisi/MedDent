import { Frown, Wind, AlertCircle, Plus } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

const ICON_MAP = {
  Frown,
  Wind,
  AlertCircle,
} as const;

const STYLES = {
  titleSize: 36,
  cardTextSize: 16,
  buttonTextSize: 20,
  primaryColor: '#0066CC',
  titleAlign: 'center' as const,
  buttonAlign: 'center' as const,
} as const;

export default function KimUchunSection() {
  const { language } = useLanguage();
  const t = translations[language];

  const cards = [
    {
      icon: 'Frown' as const,
      text: t.features.card1,
    },
    {
      icon: 'Wind' as const,
      text: t.features.card2,
    },
    {
      icon: 'AlertCircle' as const,
      text: t.features.card3,
    },
  ];

  const handleScrollToValueStacking = () => {
    const valueStackingSection = document.querySelector('[data-section="value-stacking"]');
    if (valueStackingSection) {
      valueStackingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getIconComponent = (iconName: keyof typeof ICON_MAP) => {
    const Icon = ICON_MAP[iconName];
    return Icon;
  };

  const getTitleAlignment = () => {
    switch (STYLES.titleAlign) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  const getButtonAlignment = () => {
    switch (STYLES.buttonAlign) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  return (
    <SectionWrapper sectionName="features" className="relative min-h-screen bg-white text-black flex items-center overflow-hidden py-20">
      <div className="relative z-10 w-full">
        <div className="w-full flex flex-col items-center px-4 md:px-10 lg:px-[96px]">
          <div className="mb-12 w-full max-w-[1920px]">
            <h2
              className={`font-bold tracking-tight leading-tight mb-8 ${getTitleAlignment()}`}
              style={{
                fontSize: `${STYLES.titleSize}px`,
                color: STYLES.primaryColor,
              }}
            >
              {t.features.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-[1920px] justify-items-center">
            {cards.map((card, index) => {
              const Icon = getIconComponent(card.icon);
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-neutral-200 transition-all hover:scale-105 flex flex-col items-center text-center w-full max-w-md"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${STYLES.primaryColor}15`,
                    }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: STYLES.primaryColor }}
                    />
                  </div>
                  <p
                    className="text-neutral-700 leading-relaxed"
                    style={{ fontSize: `${STYLES.cardTextSize}px` }}
                  >
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={`flex w-full max-w-[1920px] ${getButtonAlignment()}`}>
            <button
              onClick={handleScrollToValueStacking}
              style={{
                backgroundColor: STYLES.primaryColor,
                fontSize: `${STYLES.buttonTextSize}px`,
              }}
              className="px-8 py-3.5 text-white font-medium rounded-full hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2"
            >
              {t.features.buttonText}
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
