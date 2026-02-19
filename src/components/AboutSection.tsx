import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';
import { useConfiguration } from '../contexts/ConfigurationContext';

export default function AboutSection() {
  const { getConfig } = useConfiguration();
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.1);
  
  const uiTexts = {
    title: getConfig('about_title', 'Biz Haqimizda'),
    subtitle: getConfig('about_subtitle', 'Professional stomatologiya xizmatlari'),
    content: getConfig('about_content', 'Biz zamonaviy stomatologiya klinikasimiz. Yuqori malakali shifokorlar va eng so\'nggi texnologiyalar bilan xizmat ko\'rsatamiz.'),
  };
  
  const aboutImage = getConfig('about_image', '');
  const features = getConfig('about_features', [
    'Yuqori malakali mutaxassislar',
    'Zamonaviy uskunalar',
    'Xalqaro standartlar',
    'Individual yondashuv',
  ]);

  useEffect(() => {
    fetchBackground();
  }, []);

  const fetchBackground = async () => {
    try {
      const data = await api.getSectionBackground('about');
      if (data) {
        setBackgroundImage(data.image_url || '');
        setBackgroundOpacity(parseFloat(data.opacity) || 0.1);
      }
    } catch (error) {
      console.error('Error fetching about background:', error);
    }
  };

  return (
    <section id="about" className="relative bg-neutral-50 py-24 overflow-hidden">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            opacity: backgroundOpacity,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4 tracking-tight">
              {uiTexts.title}
            </h2>
            <p className="text-xl text-blue-600 font-medium mb-6">
              {uiTexts.subtitle}
            </p>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              {uiTexts.content}
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-neutral-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl opacity-20 blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-neutral-200">
                {aboutImage ? (
                  <img
                    src={aboutImage}
                    alt="About us"
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[500px] bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-12 h-12 text-blue-600" />
                      </div>
                      <p className="text-neutral-600 font-medium">Professional Xizmatlar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
