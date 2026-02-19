import { useState, useEffect, useCallback } from 'react';
import { Pill, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';

interface PillChoiceSectionProps {
  onOpenConsultation: () => void;
}

interface PillSection {
  _id?: string;
  id?: string;
  section_type: 'white' | 'black';
  main_heading: string;
  subheading: string;
  blue_pill_title: string;
  blue_pill_description: string;
  blue_pill_details: string;
  red_pill_title: string;
  red_pill_description: string;
  red_pill_details: string;
  button_text: string;
  heading_align: 'left' | 'center' | 'right';
  subheading_align: 'left' | 'center' | 'right';
  is_active: boolean;
  display_order: number;
  main_heading_size: number;
  subheading_size: number;
  blue_pill_title_size: number;
  blue_pill_description_size: number;
  blue_pill_details_size: number;
  red_pill_title_size: number;
  red_pill_description_size: number;
  red_pill_details_size: number;
  button_text_size: number;
  main_heading_size_mobile?: number;
  subheading_size_mobile?: number;
  blue_pill_title_size_mobile?: number;
  blue_pill_description_size_mobile?: number;
  blue_pill_details_size_mobile?: number;
  red_pill_title_size_mobile?: number;
  red_pill_description_size_mobile?: number;
  red_pill_details_size_mobile?: number;
  button_text_size_mobile?: number;
  button_padding_x: number;
  button_padding_y: number;
  button_max_width: number;
  matrix_image_max_width: number;
  matrix_image_url?: string | null;
  pill_spacing_mobile: number;
  pill_spacing_desktop: number;
}

export default function PillChoiceSection({ onOpenConsultation }: PillChoiceSectionProps) {
  const { language } = useLanguage();
  const [sections, setSections] = useState<PillSection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = useCallback(async () => {
    try {
      const data = await api.getPillSections(true);

      const sectionsWithLang = data.map((section: any) => ({
        ...section,
        id: section._id || section.id,
        main_heading: language === 'ru' && section.main_heading_ru ? section.main_heading_ru : section.main_heading_uz || section.main_heading,
        subheading: language === 'ru' && section.subheading_ru ? section.subheading_ru : section.subheading_uz || section.subheading,
        blue_pill_title: language === 'ru' && section.blue_pill_title_ru ? section.blue_pill_title_ru : section.blue_pill_title_uz || section.blue_pill_title,
        blue_pill_description: language === 'ru' && section.blue_pill_description_ru ? section.blue_pill_description_ru : section.blue_pill_description_uz || section.blue_pill_description,
        blue_pill_details: language === 'ru' && section.blue_pill_details_ru ? section.blue_pill_details_ru : section.blue_pill_details_uz || section.blue_pill_details,
        red_pill_title: language === 'ru' && section.red_pill_title_ru ? section.red_pill_title_ru : section.red_pill_title_uz || section.red_pill_title,
        red_pill_description: language === 'ru' && section.red_pill_description_ru ? section.red_pill_description_ru : section.red_pill_description_uz || section.red_pill_description,
        red_pill_details: language === 'ru' && section.red_pill_details_ru ? section.red_pill_details_ru : section.red_pill_details_uz || section.red_pill_details,
        button_text: language === 'ru' && section.button_text_ru ? section.button_text_ru : section.button_text_uz || section.button_text,
      }));

      setSections(sectionsWithLang);
    } catch (error) {
      console.error('Error fetching pill sections:', error);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  if (loading) {
    return null;
  }

  const getAlignmentClass = (align: string) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  return (
    <>
      {sections.map((section) => {
        const isWhite = section.section_type === 'white';
        const bgColor = isWhite ? 'bg-black' : 'bg-black';
        const textColor = 'text-white';
        const subtextColor = 'text-neutral-300';

        return (
          <section
            key={section.id}
            id="for-whom"
            data-section="pill-choice"
            className={`${bgColor} ${textColor} py-12 lg:py-24 relative overflow-hidden lg:min-h-screen flex flex-col justify-center`}
          >
            <style>
              {`
                .pill-heading-${section.id} {
                  font-size: ${section.main_heading_size_mobile || 20}px;
                }
                .pill-subheading-${section.id} {
                  font-size: ${section.subheading_size_mobile || 13}px;
                }
                .pill-blue-title-${section.id} {
                  font-size: ${section.blue_pill_title_size_mobile || 18}px;
                }
                .pill-blue-desc-${section.id} {
                  font-size: ${section.blue_pill_description_size_mobile || 14}px;
                }
                .pill-blue-details-${section.id} {
                  font-size: ${section.blue_pill_details_size_mobile || 12}px;
                }
                .pill-red-title-${section.id} {
                  font-size: ${section.red_pill_title_size_mobile || 18}px;
                }
                .pill-red-desc-${section.id} {
                  font-size: ${section.red_pill_description_size_mobile || 14}px;
                }
                .pill-red-details-${section.id} {
                  font-size: ${section.red_pill_details_size_mobile || 12}px;
                }
                .pill-button-${section.id} {
                  font-size: ${section.button_text_size_mobile || 14}px;
                }
                .pill-spacing-${section.id} {
                  margin-top: ${section.pill_spacing_mobile}px;
                }

                @media (min-width: 768px) {
                  .pill-heading-${section.id} {
                    font-size: ${section.main_heading_size}px;
                  }
                  .pill-subheading-${section.id} {
                    font-size: ${section.subheading_size}px;
                  }
                  .pill-blue-title-${section.id} {
                    font-size: ${section.blue_pill_title_size}px;
                  }
                  .pill-blue-desc-${section.id} {
                    font-size: ${section.blue_pill_description_size}px;
                  }
                  .pill-blue-details-${section.id} {
                    font-size: ${section.blue_pill_details_size}px;
                  }
                  .pill-red-title-${section.id} {
                    font-size: ${section.red_pill_title_size}px;
                  }
                  .pill-red-desc-${section.id} {
                    font-size: ${section.red_pill_description_size}px;
                  }
                  .pill-red-details-${section.id} {
                    font-size: ${section.red_pill_details_size}px;
                  }
                  .pill-button-${section.id} {
                    font-size: ${section.button_text_size}px;
                  }
                }

                @media (min-width: 1024px) {
                  .pill-spacing-${section.id} {
                    margin-top: ${section.pill_spacing_desktop}px;
                  }
                }
              `}
            </style>
            {/* Background image - Desktop only */}
            {section.matrix_image_url && (
              <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none overflow-hidden">
                <img
                  src={section.matrix_image_url}
                  alt="Matrix Character"
                  className="object-contain opacity-100"
                  style={{
                    maxWidth: `${section.matrix_image_max_width || 600}px`,
                    maxHeight: '100vh',
                    width: 'auto',
                    height: '100%'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    console.error('Failed to load matrix image:', section.matrix_image_url);
                  }}
                />
              </div>
            )}

            <div className="max-w-[1920px] mx-auto px-8 md:px-10 lg:px-[96px] w-full relative z-10">
              {/* Top Row - Headers */}
              <div className="mb-8 lg:mb-16">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8">
                  <h2
                    className={`font-bold text-left pill-heading-${section.id} max-w-full`}
                    style={{
                      lineHeight: '1.2',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {section.main_heading.split('<br>').map((line, index, array) => {
                      const words = line.split(' ');
                      return (
                        <span key={index}>
                          <span className="md:hidden">
                            {words[0]}
                            {words.length > 1 && <><br />{words.slice(1).join(' ')}</>}
                          </span>
                          <span className="hidden md:inline">{line}</span>
                          {index < array.length - 1 && <br />}
                        </span>
                      );
                    })}
                  </h2>
                  <div className="max-w-full md:max-w-md lg:max-w-lg">
                    <p
                      className={`${subtextColor} text-left md:${getAlignmentClass(section.subheading_align)} pill-subheading-${section.id} md:hidden`}
                      style={{
                        lineHeight: '1.3',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                      dangerouslySetInnerHTML={{ __html: section.subheading.replace(/<br\s*\/?>/gi, ' ') }}
                    />
                    <p
                      className={`${subtextColor} text-left md:${getAlignmentClass(section.subheading_align)} pill-subheading-${section.id} hidden md:block`}
                      style={{
                        lineHeight: '1.3',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                      dangerouslySetInnerHTML={{ __html: section.subheading }}
                    />
                  </div>
                </div>
              </div>

              {/* Pills/Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 lg:mb-12 justify-items-center mt-20 md:mt-0">
                {/* Blue Pill */}
                <div className="space-y-4 max-w-full md:max-w-[500px] w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Pill className="w-8 h-8 text-blue-400" />
                    <h3 className={`font-bold text-blue-400 pill-blue-title-${section.id}`}>
                      {section.blue_pill_title}
                    </h3>
                  </div>
                  <p className={`${subtextColor} leading-relaxed pill-blue-desc-${section.id}`}>
                    {section.blue_pill_description}
                  </p>
                  <p className={`${subtextColor} leading-relaxed pill-blue-details-${section.id}`}>
                    {section.blue_pill_details}
                  </p>
                </div>

                {/* Middle spacer - empty on mobile/tablet, visible on desktop */}
                <div className="hidden lg:block"></div>

                {/* Red Pill */}
                <div className={`space-y-4 max-w-full md:max-w-[500px] w-full pill-spacing-${section.id}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Pill className="w-8 h-8 text-red-400" />
                    <h3 className={`font-bold text-red-400 pill-red-title-${section.id}`}>
                      {section.red_pill_title}
                    </h3>
                  </div>
                  <p className={`${subtextColor} leading-relaxed pill-red-desc-${section.id}`}>
                    {section.red_pill_description}
                  </p>
                  <p className={`${subtextColor} leading-relaxed mb-6 pill-red-details-${section.id}`}>
                    {section.red_pill_details}
                  </p>

                  <button
                    onClick={onOpenConsultation}
                    className={`bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold inline-flex items-center gap-2 transition-all hover:scale-105 shadow-lg whitespace-nowrap w-full justify-center pill-button-${section.id}`}
                    style={{
                      paddingLeft: `${section.button_padding_x}px`,
                      paddingRight: `${section.button_padding_x}px`,
                      paddingTop: `${section.button_padding_y}px`,
                      paddingBottom: `${section.button_padding_y}px`,
                      maxWidth: `${section.button_max_width}px`
                    }}
                  >
                    {section.button_text}
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Inline image - Mobile only */}
              {section.matrix_image_url && (
                <div className="lg:hidden flex justify-center mt-8">
                  <img
                    src={section.matrix_image_url}
                    alt="Matrix Character"
                    className="w-full max-w-md object-contain"
                    style={{
                      maxHeight: '500px'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      console.error('Failed to load matrix image:', section.matrix_image_url);
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
