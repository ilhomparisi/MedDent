import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { api } from '../lib/api';
import { useConfiguration } from '../contexts/ConfigurationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface FAQItem {
  id: string;
  question: string;
  question_uz?: string;
  question_ru?: string;
  answer: string;
  answer_uz?: string;
  answer_ru?: string;
  is_active: boolean;
  display_order: number;
}

export default function FAQSection() {
  const { language } = useLanguage();
  const { getConfig } = useConfiguration();
  const t = translations[language];
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const primaryColor = getConfig('primary_color', '#0066CC');
  const faqSettings = {
    title_size: getConfig('faq_title_size', '36'),
    subtitle_size: getConfig('faq_subtitle_size', '18'),
    title_align: getConfig('faq_title_align', 'center'),
    subtitle_align: getConfig('faq_subtitle_align', 'center'),
    question_size: getConfig('faq_question_size', '18'),
    answer_size: getConfig('faq_answer_size', '16'),
  };

  useEffect(() => {
    fetchFAQItems();
  }, [language]);

  const fetchFAQItems = async () => {
    try {
      const data = await api.getFaqs();
      
      const faqItemsWithLang = data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        question: language === 'ru' && item.question_ru ? item.question_ru : item.question_uz || item.question,
        answer: language === 'ru' && item.answer_ru ? item.answer_ru : item.answer_uz || item.answer,
      }));

      setFaqItems(faqItemsWithLang);
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return null;
  }

  if (faqItems.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px]">
        <div className="mb-16">
          <h2
            className={`font-bold mb-6 text-gray-900 ${
              faqSettings.title_align === 'left' ? 'text-left' :
              faqSettings.title_align === 'right' ? 'text-right' :
              'text-center'
            }`}
            style={{ fontSize: `${faqSettings.title_size}px` }}
          >
            {t.faq.title}
          </h2>
          <p
            className={`text-gray-600 ${
              faqSettings.subtitle_align === 'left' ? 'text-left' :
              faqSettings.subtitle_align === 'right' ? 'text-right' :
              'text-center'
            }`}
            style={{ fontSize: `${faqSettings.subtitle_size}px` }}
          >
            {t.faq.subtitle}
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <div key={item.id} className="space-y-4">
              <button
                onClick={() => toggleItem(index)}
                className="w-full rounded-[32px] overflow-hidden transition-all duration-300 shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}e6, ${primaryColor}d9)`
                }}
              >
                <div className="px-8 py-5 flex items-center justify-between text-left">
                  <h3
                    className="font-medium text-white pr-4 flex-1"
                    style={{ fontSize: `${faqSettings.question_size}px` }}
                  >
                    {item.question}
                  </h3>
                  <div
                    className="flex-shrink-0 bg-white rounded-full w-12 h-12 flex items-center justify-center transition-transform duration-300"
                    style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  >
                    <Plus className="w-6 h-6" style={{ color: primaryColor }} />
                  </div>
                </div>
              </button>

              {openIndex === index && (
                <div
                  className="rounded-[32px] overflow-hidden shadow-lg transition-all duration-300 animate-in slide-in-from-top-4"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}e6, ${primaryColor}d9)`
                  }}
                >
                  <div className="px-8 py-6">
                    <div
                      className="text-white/90 leading-relaxed"
                      style={{ fontSize: `${faqSettings.answer_size}px` }}
                    >
                      {item.answer.includes('•') ? (
                        <div className="space-y-3">
                          {item.answer.split('•').map((part, idx) => {
                            const trimmedPart = part.trim();
                            if (!trimmedPart) return null;
                            return (
                              <div key={idx} className="flex gap-2">
                                <span className="flex-shrink-0">•</span>
                                <span className="flex-1">{trimmedPart}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span>{item.answer}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
