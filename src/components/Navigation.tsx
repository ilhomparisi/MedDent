import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  onBookClick: () => void;
}

export default function Navigation({ onBookClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/image.png');
  const { language, setLanguage } = useLanguage();

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_logo')
        .maybeSingle();

      if (error) throw error;

      if (data && data.value) {
        const cacheBuster = `?t=${Date.now()}`;
        setLogoUrl(data.value + cacheBuster);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-900/95 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full">
        <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-[96px]">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity ml-3 md:ml-0"
            >
              <img
                src={logoUrl}
                alt="MedDent"
                className="h-8 md:h-10 w-auto max-h-8 md:max-h-10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error('Logo failed to load:', logoUrl);
                  console.error('Falling back to default logo');
                  target.src = '/image.png';
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully:', logoUrl);
                }}
              />
            </button>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('for-whom')}
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                {t.nav.forWhom}
              </button>
              <button
                onClick={() => scrollToSection('reviews')}
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                {t.nav.reviews}
              </button>
              <button
                onClick={() => scrollToSection('results')}
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                {t.nav.results}
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="text-sm text-neutral-300 hover:text-white transition-colors"
              >
                {t.nav.team}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-800/50 rounded-lg p-1">
              <button
                onClick={() => setLanguage('uz')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  language === 'uz'
                    ? 'bg-white text-neutral-900 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  language === 'ru'
                    ? 'bg-white text-neutral-900 shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                RU
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800">
          <div className="px-6 py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('for-whom')}
              className="text-left text-neutral-300 hover:text-white transition-colors py-2"
            >
              {t.nav.forWhom}
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left text-neutral-300 hover:text-white transition-colors py-2"
            >
              {t.nav.reviews}
            </button>
            <button
              onClick={() => scrollToSection('results')}
              className="text-left text-neutral-300 hover:text-white transition-colors py-2"
            >
              {t.nav.results}
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="text-left text-neutral-300 hover:text-white transition-colors py-2"
            >
              {t.nav.team}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
