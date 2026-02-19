import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useConfiguration } from '../contexts/ConfigurationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface PatientResultsSectionProps {
  onOpenConsultation: () => void;
}

export default function PatientResultsSection({ onOpenConsultation }: PatientResultsSectionProps) {
  const { language } = useLanguage();
  const { getConfig } = useConfiguration();
  const t = translations[language];
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const uiTexts = {
    title: getConfig(`results_title${language === 'uz' ? '_uz' : language === 'ru' ? '_ru' : ''}`, 'Bemorlarimiz Natijalari'),
    subtitle: getConfig(`results_subtitle${language === 'uz' ? '_uz' : language === 'ru' ? '_ru' : ''}`, 'Muvaffaqiyatli davolash natijalari va tabassumlar'),
    title_align: getConfig('results_title_align', 'center'),
    subtitle_align: getConfig('results_subtitle_align', 'center'),
    title_size: getConfig('results_title_size', '36'),
    subtitle_size: getConfig('results_subtitle_size', '18'),
    cta_text: getConfig(`results_cta_text${language === 'uz' ? '_uz' : language === 'ru' ? '_ru' : ''}`, 'Yours can be the next one.'),
    cta_text_size: getConfig('results_cta_text_size', '20'),
    cta_text_weight: getConfig('results_cta_text_weight', '400'),
    cta_text_align: getConfig('results_cta_text_align', 'center'),
    button_text: getConfig(`results_button_text${language === 'uz' ? '_uz' : language === 'ru' ? '_ru' : ''}`, 'YES! GIVE ME ACCESS NOW'),
    button_text_size_desktop: getConfig('results_button_text_size_desktop', '18'),
    button_text_size_mobile: getConfig('results_button_text_size_mobile', '16'),
    button_url: getConfig('results_button_url', '#booking'),
    button_enabled: getConfig('results_button_enabled', true),
    subtext: getConfig(`results_subtext${language === 'uz' ? '_uz' : language === 'ru' ? '_ru' : ''}`, 'Secure your access today and start your journey.'),
    subtext_size: getConfig('results_subtext_size', '14'),
    subtext_align: getConfig('results_subtext_align', 'center'),
    shadow_opacity: getConfig('results_shadow_opacity', '0.9'),
    solid_blue_width: getConfig('results_solid_blue_width', '64'),
    shadow_width: getConfig('results_shadow_width', '192'),
  };
  
  const gradientSettings = {
    opacity: getConfig('gradient_opacity', '0.25'),
    width: getConfig('gradient_width', '90'),
    height: getConfig('gradient_height', '85'),
    blur: getConfig('gradient_blur', '60'),
  };

  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const topContainerRef = useRef<HTMLDivElement>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);
  const topAnimationRef = useRef<number | null>(null);
  const bottomAnimationRef = useRef<number | null>(null);
  const topProgressRef = useRef(-50);
  const bottomProgressRef = useRef(0);
  const topSpeedRef = useRef(0.025);
  const bottomSpeedRef = useRef(0.025);
  const topHoveredRef = useRef(false);
  const bottomHoveredRef = useRef(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchResultImages();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [language]);

  useEffect(() => {
    if (resultImages.length === 0) return;

    const animateTopRow = () => {
      if (!topRowRef.current || !topContainerRef.current) return;

      const baseSpeed = isMobile ? 0.12 : 0.025;
      const targetSpeed = topHoveredRef.current ? 0.008 : baseSpeed;
      topSpeedRef.current += (targetSpeed - topSpeedRef.current) * 0.05;

      topProgressRef.current += topSpeedRef.current;

      if (topProgressRef.current >= 0) {
        topProgressRef.current = topProgressRef.current - 50;
      }

      topRowRef.current.style.transform = `translateX(${topProgressRef.current}%)`;

      topAnimationRef.current = requestAnimationFrame(animateTopRow);
    };

    const animateBottomRow = () => {
      if (!bottomRowRef.current || !bottomContainerRef.current) return;

      const baseSpeed = isMobile ? 0.12 : 0.025;
      const targetSpeed = bottomHoveredRef.current ? 0.008 : baseSpeed;
      bottomSpeedRef.current += (targetSpeed - bottomSpeedRef.current) * 0.05;

      bottomProgressRef.current += bottomSpeedRef.current;

      if (bottomProgressRef.current >= 50) {
        bottomProgressRef.current = bottomProgressRef.current - 50;
      }

      bottomRowRef.current.style.transform = `translateX(-${bottomProgressRef.current}%)`;

      bottomAnimationRef.current = requestAnimationFrame(animateBottomRow);
    };

    topAnimationRef.current = requestAnimationFrame(animateTopRow);
    bottomAnimationRef.current = requestAnimationFrame(animateBottomRow);

    return () => {
      if (topAnimationRef.current) cancelAnimationFrame(topAnimationRef.current);
      if (bottomAnimationRef.current) cancelAnimationFrame(bottomAnimationRef.current);
    };
  }, [resultImages, isMobile]);

  const fetchResultImages = async () => {
    try {
      const data = await api.getReviews();
      const images = data
        .filter((r: any) => r.is_approved && r.image_url)
        .map((r: any) => r.image_url)
        .filter((url: any): url is string => url !== null && url !== undefined)
        .sort((a: string, b: string) => {
          // Sort by creation date if available, otherwise keep order
          return 0;
        });

      setResultImages(images);
    } catch (error) {
      console.error('Error fetching result images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="results" className="bg-white py-24">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-[113px]">
          <div className="text-center mb-16">
            <h2 className="font-bold text-neutral-900 mb-4" style={{ fontSize: `${uiTexts.title_size}px` }}>{uiTexts.title}</h2>
            <p className="text-xl text-neutral-600">{t.common.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  if (resultImages.length === 0) {
    return (
      <section id="results" className="bg-white py-24">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-[113px]">
          <div className="text-center py-12">
            <h2 className="font-bold text-neutral-900 mb-4" style={{ fontSize: `${uiTexts.title_size}px` }}>{uiTexts.title}</h2>
            <p className="text-xl text-neutral-500">{t.common.noResults}</p>
          </div>
        </div>
      </section>
    );
  }

  const firstRow = resultImages.filter((_, index) => index % 2 === 0);
  const secondRow = resultImages.filter((_, index) => index % 2 === 1);

  return (
    <section
      id="results"
      data-section="results"
      className="relative py-16 overflow-visible bg-black"
    >

      {/* CENTER - Mobile Gradient (replaces side gradients) */}
      <div
        className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{
          width: `${gradientSettings.width}%`,
          height: `${gradientSettings.height}%`,
          background: `radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0, 102, 255, ${gradientSettings.opacity}) 0%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.6}) 30%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.32}) 50%, transparent 70%)`,
          filter: `blur(${gradientSettings.blur}px)`,
        }}
      />

      {/* LEFT SIDE - TOP HALF ONLY - Desktop Curved Gradient */}
      <div
        className="hidden md:block absolute left-0 z-10 pointer-events-none"
        style={{
          width: `${Math.max(parseInt(uiTexts.solid_blue_width) + parseInt(uiTexts.shadow_width), 500)}px`,
          height: '60%',
          top: '-10%',
          background: `radial-gradient(ellipse 120% 100% at 0% 50%, rgba(0, 102, 255, ${uiTexts.shadow_opacity}) 0%, rgba(0, 102, 255, ${parseFloat(uiTexts.shadow_opacity) * 0.6}) 20%, rgba(0, 102, 255, ${parseFloat(uiTexts.shadow_opacity) * 0.35}) 40%, rgba(0, 102, 255, ${parseFloat(uiTexts.shadow_opacity) * 0.15}) 60%, transparent 80%)`,
          filter: 'blur(30px)',
        }}
      />

      {/* RIGHT SIDE - BOTTOM HALF ONLY - Desktop Curved Gradient */}
      <div
        className="hidden md:block absolute right-0 z-10 pointer-events-none"
        style={{
          width: `${Math.max(parseInt(uiTexts.solid_blue_width) + parseInt(uiTexts.shadow_width), 500)}px`,
          height: '60%',
          bottom: '-10%',
          background: `radial-gradient(ellipse 120% 100% at 100% 50%, rgba(0, 102, 255, ${uiTexts.shadow_opacity}) 0%, rgba(0, 102, 255, ${parseFloat(uiTexts.shadow_opacity) * 0.6}) 20%, rgba(0, 102, 255, ${parseFloat(uiTexts.shadow_opacity) * 0.35}) 40%, rgba(0, 102, 255, ${parseFloat(uiTexts.shadow_opacity) * 0.15}) 60%, transparent 80%)`,
          filter: 'blur(30px)',
        }}
      />

      <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px] mb-16 relative z-20">
        <div className="mb-4">
          <h2
            className={`font-black text-white mb-3 tracking-tight ${
              uiTexts.title_align === 'left' ? 'text-left' :
              uiTexts.title_align === 'right' ? 'text-right' :
              'text-center'
            }`}
            style={{ fontSize: `${uiTexts.title_size}px` }}
          >
            {uiTexts.title}
          </h2>
        </div>
      </div>

      <div className="relative overflow-hidden max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px]">
        <div className="space-y-4 relative z-10">
          {/* TOP ROW */}
          <div
            ref={topContainerRef}
            className="relative flex overflow-hidden"
            onMouseEnter={() => { topHoveredRef.current = true; }}
            onMouseLeave={() => { topHoveredRef.current = false; }}
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <div
              ref={topRowRef}
              className="flex gap-2 whitespace-nowrap will-change-transform"
            >
              {[...firstRow, ...firstRow, ...firstRow].map((imageUrl, index) => (
                <div
                  key={`top-${index}`}
                  className="carousel-image inline-block w-36 md:w-[280px] lg:w-[300px] aspect-square bg-white rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                >
                  <img
                    src={imageUrl}
                    alt={`${t.common.patientResult} ${index + 1}`}
                    className="w-full h-full object-contain bg-neutral-50"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div
            ref={bottomContainerRef}
            className="relative flex overflow-hidden"
            onMouseEnter={() => { bottomHoveredRef.current = true; }}
            onMouseLeave={() => { bottomHoveredRef.current = false; }}
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <div
              ref={bottomRowRef}
              className="flex gap-2 whitespace-nowrap will-change-transform"
            >
              {[...secondRow, ...secondRow, ...secondRow].map((imageUrl, index) => (
                <div
                  key={`bottom-${index}`}
                  className="carousel-image inline-block w-36 md:w-[280px] lg:w-[300px] aspect-square bg-white rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
                >
                  <img
                    src={imageUrl}
                    alt={`${t.common.patientResult} ${index + 1}`}
                    className="w-full h-full object-contain bg-neutral-50"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px] mt-16">
        <div className={`${
          uiTexts.cta_text_align === 'left' ? 'text-left' :
          uiTexts.cta_text_align === 'right' ? 'text-right' :
          'text-center'
        }`}>
          <p
            className="text-white mb-12"
            style={{
              fontSize: `${uiTexts.cta_text_size}px`,
              fontWeight: uiTexts.cta_text_weight,
              lineHeight: '1.5',
            }}
          >
            {uiTexts.cta_text}
          </p>

          {uiTexts.button_enabled && (
            <button
              onClick={onOpenConsultation}
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 uppercase"
              style={{
                fontSize: isMobile
                  ? `${uiTexts.button_text_size_mobile}px`
                  : `${uiTexts.button_text_size_desktop}px`
              }}
            >
              {uiTexts.button_text}
            </button>
          )}

          {uiTexts.subtext && (
            <p
              className="text-neutral-400 mt-0.5"
              style={{
                fontSize: `${uiTexts.subtext_size}px`,
                textAlign: uiTexts.subtext_align as 'left' | 'center' | 'right',
              }}
            >
              {uiTexts.subtext}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
