import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, Review } from '../lib/supabase';
import { translations } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const [truncatedReviews, setTruncatedReviews] = useState<Set<string>>(new Set());
  const textRefs = useRef<{ [key: string]: HTMLParagraphElement | null }>({});
  const lastScrollPosition = useRef<number>(0);
  const scrollThreshold = 150;
  const { language } = useLanguage();
  const t = translations[language];

  const [uiTexts, setUiTexts] = useState({
    title_align: 'center',
    subtitle_align: 'center',
    title_size: '36',
    subtitle_size: '18',
  });
  const [gradientSettings, setGradientSettings] = useState({
    opacity: '0.25',
    width: '90',
    height: '85',
    blur: '60',
  });

  useEffect(() => {
    fetchReviews();
    fetchUITexts();
    fetchGradientSettings();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUITexts();
        fetchGradientSettings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [language]);


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );

      // Auto-collapse expanded review after scroll threshold
      if (expandedReviewId) {
        const scrollDelta = Math.abs(container.scrollLeft - lastScrollPosition.current);
        if (scrollDelta > scrollThreshold) {
          setExpandedReviewId(null);
          lastScrollPosition.current = container.scrollLeft;
        }
      } else {
        lastScrollPosition.current = container.scrollLeft;
      }
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [reviews, expandedReviewId]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || reviews.length === 0) return;

    const startAutoScroll = () => {
      autoScrollIntervalRef.current = setInterval(() => {
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }, 3000);
    };

    const stopAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };

    startAutoScroll();

    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);
    container.addEventListener('touchstart', stopAutoScroll);

    return () => {
      stopAutoScroll();
      container.removeEventListener('mouseenter', stopAutoScroll);
      container.removeEventListener('mouseleave', startAutoScroll);
      container.removeEventListener('touchstart', stopAutoScroll);
    };
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const reviewsWithLang = data?.map(review => ({
        ...review,
        patient_name: language === 'ru' && review.patient_name_ru ? review.patient_name_ru : review.patient_name_uz || review.patient_name,
        review_text: language === 'ru' && review.review_text_ru ? review.review_text_ru : review.review_text_uz || review.review_text,
        service_used: language === 'ru' && review.service_used_ru ? review.service_used_ru : review.service_used_uz || review.service_used,
      })) || [];

      setReviews(reviewsWithLang);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUITexts = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'reviews_title_align', 'reviews_subtitle_align',
          'reviews_title_size', 'reviews_subtitle_size'
        ]);

      if (error) throw error;

      const textsObj: any = {};
      data?.forEach((setting) => {
        if (setting.key === 'reviews_title_align') textsObj.title_align = setting.value;
        else if (setting.key === 'reviews_subtitle_align') textsObj.subtitle_align = setting.value;
        else if (setting.key === 'reviews_title_size') textsObj.title_size = setting.value;
        else if (setting.key === 'reviews_subtitle_size') textsObj.subtitle_size = setting.value;
      });

      setUiTexts(prev => ({
        ...prev,
        ...textsObj,
      }));
    } catch (error) {
      console.error('Error fetching UI texts:', error);
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

  useEffect(() => {
    // Check which reviews need truncation
    const checkTruncation = () => {
      const truncated = new Set<string>();
      reviews.forEach((review) => {
        const element = textRefs.current[review.id];
        if (element && element.scrollHeight > element.clientHeight) {
          truncated.add(review.id);
        }
      });
      setTruncatedReviews(truncated);
    };

    if (reviews.length > 0) {
      // Small delay to ensure DOM is rendered
      setTimeout(checkTruncation, 100);
      window.addEventListener('resize', checkTruncation);
      return () => window.removeEventListener('resize', checkTruncation);
    }
  }, [reviews]);

  const toggleExpand = (reviewId: string) => {
    if (expandedReviewId === reviewId) {
      setExpandedReviewId(null);
    } else {
      setExpandedReviewId(reviewId);
      // Reset scroll threshold tracker
      if (scrollContainerRef.current) {
        lastScrollPosition.current = scrollContainerRef.current.scrollLeft;
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newScrollLeft =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'fill-amber-400 text-amber-400'
            : 'fill-neutral-700 text-neutral-700'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section id="reviews" className="bg-black text-white py-24">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-[113px]">
          <div className="text-center mb-16">
            <h2 className="font-bold mb-4" style={{ fontSize: `${uiTexts.title_size}px` }}>{t.reviews.title}</h2>
            <p className="text-xl text-neutral-400">{t.common.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="relative bg-black text-white py-24 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{
          width: `${gradientSettings.width}%`,
          height: `${gradientSettings.height}%`,
          background: `radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0, 102, 255, ${gradientSettings.opacity}) 0%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.6}) 30%, rgba(0, 102, 255, ${parseFloat(gradientSettings.opacity) * 0.32}) 50%, transparent 70%)`,
          filter: `blur(${gradientSettings.blur}px)`,
        }}
      />

      <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px] mb-12 relative z-10">
        <div className="mb-4">
          <h2
            className={`font-bold mb-4 tracking-tight ${
              uiTexts.title_align === 'left' ? 'text-left' :
              uiTexts.title_align === 'right' ? 'text-right' :
              'text-center'
            }`}
            style={{ fontSize: `${uiTexts.title_size}px` }}
          >
            {t.reviews.title}
          </h2>
          <p
            className={`text-neutral-400 max-w-2xl ${
              uiTexts.subtitle_align === 'left' ? 'text-left' :
              uiTexts.subtitle_align === 'right' ? 'text-right ml-auto' :
              'text-center mx-auto'
            }`}
            style={{ fontSize: `${uiTexts.subtitle_size}px` }}
          >
            {t.reviews.subtitle}
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-400">
            {t.reviews.noReviews}
          </p>
        </div>
      ) : (
        <div className="relative px-4 md:px-10 lg:px-[96px] z-10">
          <button
            onClick={() => scroll('left')}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white border-2 border-neutral-300 rounded-full items-center justify-center hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-2xl ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white border-2 border-neutral-300 rounded-full items-center justify-center hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-2xl ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 transition-[height] duration-500 ease-in-out items-start md:mx-16"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-72 md:w-80 bg-neutral-900 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-neutral-800 snap-start flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-4">
                        {renderStars(review.rating)}
                      </div>

                      <div className="mb-4">
                        <p
                          ref={(el) => { textRefs.current[review.id] = el; }}
                          className={`text-neutral-300 leading-relaxed text-base transition-all duration-300 ease-in-out ${
                            expandedReviewId === review.id ? '' : 'line-clamp-7'
                          }`}
                        >
                          "{review.review_text}"
                        </p>

                        {truncatedReviews.has(review.id) && (
                          <button
                            onClick={() => toggleExpand(review.id)}
                            className="mt-2 text-neutral-400 hover:text-white transition-colors duration-200 flex items-center gap-1 text-sm font-medium group"
                            aria-expanded={expandedReviewId === review.id}
                            aria-label={expandedReviewId === review.id ? 'Show less' : 'Read more'}
                          >
                            {expandedReviewId === review.id ? (
                              <>
                                {t.reviews.showLess}
                                <ChevronUp className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                              </>
                            ) : (
                              <>
                                {t.reviews.readMore}
                                <ChevronDown className="w-4 h-4 group-hover:translate-y-[2px] transition-transform" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-neutral-800 pt-4 mt-auto">
                      <p className="font-semibold text-white mb-1">
                        {review.patient_name}
                      </p>
                      {review.service_used && (
                        <p className="text-sm text-neutral-400">
                          {review.service_used}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          <div className="flex md:hidden items-center justify-center gap-4 mt-8">
            <button
              onClick={() => scroll('left')}
              className={`w-14 h-14 bg-white border-2 border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-2xl ${
                !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>

            <div className="flex justify-center gap-2">
              {reviews.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/50"
                />
              ))}
            </div>

            <button
              onClick={() => scroll('right')}
              className={`w-14 h-14 bg-white border-2 border-neutral-300 rounded-full flex items-center justify-center hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-2xl ${
                !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Scroll right"
              disabled={!canScrollRight}
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
          </div>
        )}
    </section>
  );
}
