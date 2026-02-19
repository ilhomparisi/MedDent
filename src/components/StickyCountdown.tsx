import { useState, useEffect } from 'react';
import { useConfiguration } from '../contexts/ConfigurationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

interface StickyCountdownProps {
  onBookClick: () => void;
  hideCountdown?: boolean;
}

export default function StickyCountdown({ onBookClick, hideCountdown = false }: StickyCountdownProps) {
  const { language } = useLanguage();
  const { getConfig } = useConfiguration();
  const t = translations[language];
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [countdownStart] = useState<number>(Date.now());
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [isButtonNearby, setIsButtonNearby] = useState(false);
  const [isManuallyDismissed, setIsManuallyDismissed] = useState(false);
  
  const offerHours = parseInt(getConfig('offer_hours', '24'));
  const primaryColor = getConfig('primary_color', '#0066CC');
  const offerEnabled = getConfig('offer_enabled', true);
  const expiryText = getConfig('countdown_expiry_text', '');
  const expiryTextSize = getConfig('countdown_expiry_text_size', '16');
  const expiryTextWeight = getConfig('countdown_expiry_text_weight', '700');
  const expiryTextAlign = getConfig('countdown_expiry_text_align', 'center');
  const countdownGlowText = getConfig('countdown_glow_text', '24 soat');
  const countdownGlowColor = getConfig('countdown_glow_color', '#0066CC');
  const countdownGlowIntensity = getConfig('countdown_glow_intensity', '50');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      detectBackgroundColor();
      detectButtonOverlap();
    };

    const handleResize = () => {
      detectButtonOverlap();
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let dismissTimeout: NodeJS.Timeout;
    if (isManuallyDismissed) {
      dismissTimeout = setTimeout(() => {
        setIsManuallyDismissed(false);
      }, 12000);
    }
    return () => clearTimeout(dismissTimeout);
  }, [isManuallyDismissed]);

  const calculateGlowEffect = (intensity: string, color: string) => {
    const intensityValue = parseInt(intensity) / 100;
    if (intensityValue === 0) return 'none';

    const baseBlur = 10 * intensityValue;
    const midBlur = 20 * intensityValue;
    const farBlur = 30 * intensityValue;
    const baseOpacity = 0.8 * intensityValue;
    const midOpacity = 0.6 * intensityValue;
    const farOpacity = 0.4 * intensityValue;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 102, b: 204 };
    };

    const rgb = hexToRgb(color);
    return `0 0 ${baseBlur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${baseOpacity}), 0 0 ${midBlur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${midOpacity}), 0 0 ${farBlur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${farOpacity})`;
  };

  const normalizeApostrophes = (str: string): string => {
    return str.replace(/[''ʻʼ`´]/g, "'");
  };

  const renderExpiryTextWithGlow = () => {
    if (!expiryText || !countdownGlowText) {
      return expiryText;
    }

    const parts: Array<{ text: string; hasGlow: boolean }> = [];
    const normalizedText = normalizeApostrophes(expiryText.toLowerCase());
    const normalizedGlowText = normalizeApostrophes(countdownGlowText.toLowerCase());
    const glowIndex = normalizedText.indexOf(normalizedGlowText);

    if (glowIndex !== -1) {
      if (glowIndex > 0) {
        parts.push({ text: expiryText.substring(0, glowIndex), hasGlow: false });
      }
      parts.push({
        text: expiryText.substring(glowIndex, glowIndex + countdownGlowText.length),
        hasGlow: true
      });
      if (glowIndex + countdownGlowText.length < expiryText.length) {
        parts.push({
          text: expiryText.substring(glowIndex + countdownGlowText.length),
          hasGlow: false
        });
      }
    } else {
      parts.push({ text: expiryText, hasGlow: false });
    }

    return parts.map((part, index) => {
      if (part.hasGlow) {
        return (
          <span
            key={index}
            style={{
              color: countdownGlowColor,
              textShadow: calculateGlowEffect(countdownGlowIntensity, countdownGlowColor),
            }}
          >
            {part.text}
          </span>
        );
      }
      return <span key={index}>{part.text}</span>;
    });
  };

  const detectButtonOverlap = () => {
    const isMobile = window.innerWidth < 640;
    if (!isMobile) {
      setIsButtonNearby(false);
      return;
    }

    const countdownWidth = 190;
    const countdownHeight = 120;
    const bottomMargin = 12;
    const rightMargin = 12;

    const countdownRect = {
      left: window.innerWidth - countdownWidth - rightMargin,
      right: window.innerWidth - rightMargin,
      top: window.innerHeight - countdownHeight - bottomMargin,
      bottom: window.innerHeight - bottomMargin,
    };

    const bufferZone = 40;
    const detectionZone = {
      left: countdownRect.left - bufferZone,
      right: countdownRect.right + bufferZone,
      top: countdownRect.top - bufferZone,
      bottom: countdownRect.bottom + bufferZone,
    };

    const buttons = document.querySelectorAll('button, a[role="button"], [onclick]');
    let buttonFound = false;

    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();

      const isIntersecting = !(
        rect.right < detectionZone.left ||
        rect.left > detectionZone.right ||
        rect.bottom < detectionZone.top ||
        rect.top > detectionZone.bottom
      );

      if (isIntersecting && rect.width > 0 && rect.height > 0) {
        const isVisible = window.getComputedStyle(button).opacity !== '0' &&
                         window.getComputedStyle(button).visibility !== 'hidden' &&
                         window.getComputedStyle(button).display !== 'none';

        if (isVisible) {
          buttonFound = true;
        }
      }
    });

    setIsButtonNearby(buttonFound);
  };

  const detectBackgroundColor = () => {
    const testPoints = [
      { x: 150, y: window.innerHeight / 2 },
      { x: 100, y: window.innerHeight / 2 + 50 },
      { x: 100, y: window.innerHeight / 2 - 50 },
    ];

    let detectedColors: { r: number; g: number; b: number; weight: number }[] = [];

    for (const point of testPoints) {
      let currentElement = document.elementFromPoint(point.x, point.y);
      let layerColors: { r: number; g: number; b: number; a: number }[] = [];

      while (currentElement) {
        const computed = window.getComputedStyle(currentElement);
        const bgColor = computed.backgroundColor;

        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          const rgb = bgColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            const a = rgb.length >= 4 ? parseFloat(rgb[3]) : 1;

            layerColors.push({ r, g, b, a });

            if (a >= 0.9) {
              break;
            }
          }
        }

        if (currentElement.tagName === 'BODY' || currentElement.tagName === 'HTML') {
          break;
        }

        currentElement = currentElement.parentElement;
      }

      if (layerColors.length > 0) {
        let finalR = 255, finalG = 255, finalB = 255;

        for (let i = 0; i < layerColors.length; i++) {
          const layer = layerColors[i];
          finalR = layer.r * layer.a + finalR * (1 - layer.a);
          finalG = layer.g * layer.a + finalG * (1 - layer.a);
          finalB = layer.b * layer.a + finalB * (1 - layer.a);
        }

        detectedColors.push({ r: finalR, g: finalG, b: finalB, weight: 1 });
      }
    }

    if (detectedColors.length > 0) {
      const totalWeight = detectedColors.reduce((sum, c) => sum + c.weight, 0);
      const avgR = detectedColors.reduce((sum, c) => sum + c.r * c.weight, 0) / totalWeight;
      const avgG = detectedColors.reduce((sum, c) => sum + c.g * c.weight, 0) / totalWeight;
      const avgB = detectedColors.reduce((sum, c) => sum + c.b * c.weight, 0) / totalWeight;

      const luminance = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;

      console.log(`Detected average color: RGB(${avgR.toFixed(0)}, ${avgG.toFixed(0)}, ${avgB.toFixed(0)}), Luminance: ${luminance.toFixed(2)}`);
      console.log(`Background is ${luminance < 0.6 ? 'DARK' : 'LIGHT'} - Using ${luminance < 0.6 ? 'WHITE' : 'BLACK'} countdown`);

      setIsDarkBackground(luminance < 0.6);
    }
  };


  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = countdownStart + offerHours * 60 * 60 * 1000;
      const difference = targetTime - Date.now();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [offerHours, countdownStart]);

  const handleTouchDismiss = () => {
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      setIsManuallyDismissed(true);
    }
  };

  const isVisible = scrollY > 300;
  const isMobile = window.innerWidth < 640;
  const shouldHideOnMobile = isMobile && (isButtonNearby || isManuallyDismissed);

  if (!offerEnabled || !isVisible || hideCountdown) {
    return null;
  }

  const bgColor = isDarkBackground ? 'rgba(255, 255, 255, 0.95)' : 'rgba(23, 23, 23, 0.95)';
  const textColor = isDarkBackground ? '#000000' : '#ffffff';
  const mutedColor = isDarkBackground ? '#404040' : '#a3a3a3';
  const borderColor = isDarkBackground ? 'rgba(200, 200, 200, 0.8)' : 'rgba(64, 64, 64, 0.8)';
  const boxBgColor = isDarkBackground ? 'rgba(240, 240, 240, 0.8)' : 'rgba(38, 38, 38, 0.5)';
  const boxBorderColor = isDarkBackground ? 'rgba(200, 200, 200, 0.7)' : 'rgba(64, 64, 64, 0.7)';

  const finalOpacity = shouldHideOnMobile ? 0 : (isHovered ? 0 : 1);
  const finalPointerEvents = shouldHideOnMobile ? 'none' : (isHovered ? 'none' : 'auto');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isMobile ? '12px' : '16px',
        right: isMobile ? '12px' : '16px',
        zIndex: 9999,
        transition: 'all 0.3s ease',
        opacity: finalOpacity,
        pointerEvents: finalPointerEvents,
        maxWidth: isMobile ? 'calc(100vw - 24px)' : 'auto',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchDismiss}
    >
      <div
        style={{
          backgroundColor: bgColor,
          backdropFilter: 'blur(24px)',
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.3), 0 5px 5px -5px rgba(0, 0, 0, 0.15)',
          padding: isMobile ? '10px 12px' : '17px 22px',
          display: 'block',
          width: isMobile ? '200px' : '260px',
          transition: 'all 0.5s ease',
          position: 'relative',
        }}
      >

        <div
          style={{
            color: textColor,
            fontSize: isMobile ? `${Math.max(11, parseInt(expiryTextSize) - 4)}px` : `${expiryTextSize}px`,
            fontWeight: expiryTextWeight,
            letterSpacing: '0.05em',
            marginBottom: isMobile ? '8px' : '10px',
            transition: 'all 0.5s ease',
            textAlign: expiryTextAlign as 'left' | 'center' | 'right',
            lineHeight: '1.3',
            whiteSpace: 'pre-line',
          }}
        >
          {renderExpiryTextWithGlow()}
        </div>

        <div style={{ display: 'flex', gap: isMobile ? '10px' : '12px', transition: 'all 0.5s ease', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: isMobile ? '1' : 'none' }}>
            <div
              style={{
                backgroundColor: boxBgColor,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${boxBorderColor}`,
                borderRadius: '8px',
                padding: isMobile ? '12px 6px' : '10px 10px',
                minWidth: isMobile ? 'auto' : 'auto',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center',
                transition: 'all 0.5s ease',
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? '20px' : '32px',
                  fontWeight: 'bold',
                  color: textColor,
                  fontVariantNumeric: 'tabular-nums',
                  transition: 'all 0.5s ease',
                  lineHeight: '1',
                }}
              >
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
            </div>
            <span
              style={{
                color: mutedColor,
                fontSize: isMobile ? '9px' : '11px',
                marginTop: isMobile ? '4px' : '6px',
                transition: 'all 0.5s ease',
                fontWeight: '500',
              }}
            >
              {t.hero.hours}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: isMobile ? '1' : 'none' }}>
            <div
              style={{
                backgroundColor: boxBgColor,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${boxBorderColor}`,
                borderRadius: '8px',
                padding: isMobile ? '12px 6px' : '10px 10px',
                minWidth: isMobile ? 'auto' : 'auto',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center',
                transition: 'all 0.5s ease',
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? '20px' : '32px',
                  fontWeight: 'bold',
                  color: textColor,
                  fontVariantNumeric: 'tabular-nums',
                  transition: 'all 0.5s ease',
                  lineHeight: '1',
                }}
              >
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
            </div>
            <span
              style={{
                color: mutedColor,
                fontSize: isMobile ? '9px' : '11px',
                marginTop: isMobile ? '4px' : '6px',
                transition: 'all 0.5s ease',
                fontWeight: '500',
              }}
            >
              {t.hero.minutes}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: isMobile ? '1' : 'none' }}>
            <div
              style={{
                backgroundColor: boxBgColor,
                backdropFilter: 'blur(8px)',
                border: `1px solid ${boxBorderColor}`,
                borderRadius: '8px',
                padding: isMobile ? '12px 6px' : '10px 10px',
                minWidth: isMobile ? 'auto' : 'auto',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center',
                transition: 'all 0.5s ease',
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? '20px' : '32px',
                  fontWeight: 'bold',
                  color: textColor,
                  fontVariantNumeric: 'tabular-nums',
                  transition: 'all 0.5s ease',
                  lineHeight: '1',
                }}
              >
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
            <span
              style={{
                color: mutedColor,
                fontSize: isMobile ? '9px' : '11px',
                marginTop: isMobile ? '4px' : '6px',
                transition: 'all 0.5s ease',
                fontWeight: '500',
              }}
            >
              {t.hero.seconds}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
