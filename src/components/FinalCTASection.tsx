import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

interface FinalCTA {
  _id?: string;
  id?: string;
  is_active: boolean;
  heading_line1: string;
  heading_highlight1: string;
  heading_line2: string;
  heading_line3: string;
  heading_highlight2: string;
  heading_highlight3: string;
  description: string;
  button_text: string;
  button_subtext: string;
  heading_line1_size: number;
  heading_highlight1_size: number;
  heading_line2_size: number;
  heading_line3_size: number;
  heading_highlight2_size: number;
  heading_highlight3_size: number;
  description_size: number;
  button_text_size: number;
  button_subtext_size: number;
  button_text_size_mobile?: number;
  button_subtext_size_mobile?: number;
  heading_alignment: string;
  description_alignment: string;
  button_alignment: string;
}

interface FinalCTASectionProps {
  onOpenConsultation?: () => void;
}

export default function FinalCTASection({ onOpenConsultation }: FinalCTASectionProps) {
  const { language } = useLanguage();
  const [data, setData] = useState<FinalCTA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    try {
      const result = await api.getFinalCTA();

      if (result && result.is_active) {
        const dataWithLang = {
          ...result,
          heading_line1: language === 'ru' && result.heading_line1_ru ? result.heading_line1_ru : result.heading_line1_uz || result.heading_line1,
          heading_highlight1: language === 'ru' && result.heading_highlight1_ru ? result.heading_highlight1_ru : result.heading_highlight1_uz || result.heading_highlight1,
          heading_line2: language === 'ru' && result.heading_line2_ru ? result.heading_line2_ru : result.heading_line2_uz || result.heading_line2,
          heading_line3: language === 'ru' && result.heading_line3_ru ? result.heading_line3_ru : result.heading_line3_uz || result.heading_line3,
          heading_highlight2: language === 'ru' && result.heading_highlight2_ru ? result.heading_highlight2_ru : result.heading_highlight2_uz || result.heading_highlight2,
          heading_highlight3: language === 'ru' && result.heading_highlight3_ru ? result.heading_highlight3_ru : result.heading_highlight3_uz || result.heading_highlight3,
          description: language === 'ru' && result.description_ru ? result.description_ru : result.description_uz || result.description,
          button_text: language === 'ru' && result.button_text_ru ? result.button_text_ru : result.button_text_uz || result.button_text,
          button_subtext: language === 'ru' && result.button_subtext_ru ? result.button_subtext_ru : result.button_subtext_uz || result.button_subtext,
        };
        setData(dataWithLang);
      }
    } catch (error) {
      console.error('Error fetching final CTA:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return null;
  }

  return (
    <section className="relative bg-black text-white py-20 px-4 md:px-10 lg:px-[96px]">
      <style>
        {`
          .final-cta-button {
            font-size: ${data.button_text_size_mobile || 18}px;
          }

          .final-cta-subtext {
            font-size: ${data.button_subtext_size_mobile || 13}px;
          }

          .final-cta-button-container {
            gap: 0.125rem;
          }

          @media (min-width: 768px) {
            .final-cta-button {
              font-size: ${data.button_text_size}px;
            }

            .final-cta-subtext {
              font-size: ${data.button_subtext_size}px;
            }

            .final-cta-button-container {
              gap: 0.125rem;
            }
          }
        `}
      </style>
      <div className="max-w-[1920px] mx-auto relative z-10">
        <h2
          className="font-black mb-8 leading-tight"
          style={{
            textAlign: data.heading_alignment as 'left' | 'center' | 'right',
          }}
        >
          <span
            style={{
              fontSize: `${data.heading_line1_size}px`,
              display: 'inline',
            }}
          >
            {data.heading_line1}{' '}
          </span>
          <span
            style={{
              fontSize: `${data.heading_highlight1_size}px`,
              color: '#0066CC',
              display: 'inline',
            }}
          >
            {data.heading_highlight1}{' '}
          </span>
          <span
            style={{
              fontSize: `${data.heading_line2_size}px`,
              display: 'inline',
            }}
          >
            {data.heading_line2}{' '}
          </span>
          <span
            style={{
              fontSize: `${data.heading_line3_size}px`,
              display: 'inline',
            }}
          >
            {data.heading_line3}{' '}
          </span>
          <span
            style={{
              fontSize: `${data.heading_highlight2_size}px`,
              color: '#0066CC',
              display: 'inline',
            }}
          >
            {data.heading_highlight2}{' '}
          </span>
          {data.heading_highlight3 && (
            <span
              style={{
                fontSize: `${data.heading_highlight3_size}px`,
                color: '#FFFFFF',
                display: 'inline',
              }}
            >
              {data.heading_highlight3}
            </span>
          )}
        </h2>

        <p
          className="text-gray-300 mb-36 max-w-4xl leading-relaxed"
          style={{
            fontSize: `${data.description_size}px`,
            textAlign: data.description_alignment as 'left' | 'center' | 'right',
            marginLeft: data.description_alignment === 'center' ? 'auto' : '0',
            marginRight: data.description_alignment === 'center' ? 'auto' : '0',
          }}
        >
          {data.description}
        </p>

        <div
          className="final-cta-button-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: data.button_alignment === 'center' ? 'center' : data.button_alignment === 'right' ? 'flex-end' : 'flex-start',
          }}
        >
          <button
            onClick={() => onOpenConsultation?.()}
            className="final-cta-button font-bold text-white px-6 md:px-12 py-4 md:py-5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg whitespace-normal md:whitespace-nowrap max-w-[90%] md:max-w-none leading-tight"
            style={{
              background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)',
            }}
          >
            {data.button_text}
          </button>
          <p className="text-gray-400 final-cta-subtext">
            {data.button_subtext}
          </p>
        </div>
      </div>
    </section>
  );
}
