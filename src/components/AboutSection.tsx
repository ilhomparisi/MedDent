import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AboutSection() {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.1);
  const [uiTexts, setUiTexts] = useState({
    title: 'Biz Haqimizda',
    subtitle: 'Professional stomatologiya xizmatlari',
    content: 'Biz zamonaviy stomatologiya klinikasimiz. Yuqori malakali shifokorlar va eng so\'nggi texnologiyalar bilan xizmat ko\'rsatamiz. Har bir bemor uchun individual yondashuv va professional davolanish kafolatlaymiz.',
  });
  const [aboutImage, setAboutImage] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Yuqori malakali mutaxassislar',
    'Zamonaviy uskunalar',
    'Xalqaro standartlar',
    'Individual yondashuv',
  ]);

  useEffect(() => {
    fetchBackground();
    fetchUITexts();
    fetchAboutSettings();
  }, []);

  const fetchBackground = async () => {
    try {
      const { data, error } = await supabase
        .from('section_backgrounds')
        .select('image_url, opacity')
        .eq('section_name', 'about')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setBackgroundImage(data.image_url || '');
        setBackgroundOpacity(parseFloat(data.opacity) || 0.1);
      }
    } catch (error) {
      console.error('Error fetching about background:', error);
    }
  };

  const fetchUITexts = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['about_title', 'about_subtitle', 'about_content']);

      if (error) throw error;

      const textsObj: any = {};
      data?.forEach((setting) => {
        if (setting.key === 'about_title') textsObj.title = setting.value;
        else if (setting.key === 'about_subtitle') textsObj.subtitle = setting.value;
        else if (setting.key === 'about_content') textsObj.content = setting.value;
      });

      setUiTexts(prev => ({ ...prev, ...textsObj }));
    } catch (error) {
      console.error('Error fetching UI texts:', error);
    }
  };

  const fetchAboutSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['about_image', 'about_features']);

      if (error) throw error;

      data?.forEach((setting) => {
        if (setting.key === 'about_image') {
          setAboutImage(setting.value);
        } else if (setting.key === 'about_features') {
          if (Array.isArray(setting.value)) {
            setFeatures(setting.value);
          }
        }
      });
    } catch (error) {
      console.error('Error fetching about settings:', error);
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
