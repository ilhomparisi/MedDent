import { ReactNode, useEffect, useState, forwardRef } from 'react';
import { api } from '../lib/api';
import { useConfiguration } from '../contexts/ConfigurationContext';

interface SectionWrapperProps {
  sectionName: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  heroImageWidth?: number;
  heroImageHeight?: number;
}

interface SectionBackground {
  background_type: 'color' | 'image' | 'video' | 'gradient';
  background_value: string;
  image_url?: string;
  background_overlay_color: string;
  background_overlay_opacity: number;
  background_position: string;
  background_size: string;
  background_repeat: string;
  background_attachment: string;
  background_position_left: number;
  background_position_right: number;
  background_position_top: number;
  background_position_bottom: number;
  video_loop: boolean;
  video_muted: boolean;
  video_autoplay: boolean;
  video_width_percentage: number;
  video_horizontal_align: string;
  enabled: boolean;
}

const SectionWrapper = forwardRef<HTMLDivElement, SectionWrapperProps>(({ sectionName, children, className = '', style = {}, heroImageWidth, heroImageHeight }, ref) => {
  const { getConfig } = useConfiguration();
  const [background, setBackground] = useState<SectionBackground | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const edgeBlendSettings = {
    enabled: getConfig('edge_blend_enabled', false),
    width: parseFloat(getConfig('edge_blend_width', '100')),
    side: getConfig('edge_blend_side', 'left'),
  };
  const heroOvalFrame = getConfig('hero_oval_frame', true);
  const heroImageDimensions = {
    width: parseFloat(getConfig('hero_image_outer_width', '236')),
    height: parseFloat(getConfig('hero_image_outer_height', '436')),
  };

  useEffect(() => {
    fetchBackground();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sectionName]);

  const fetchBackground = async () => {
    try {
      const data = await api.getSectionBackground(sectionName);
      if (data && data.enabled) {
        setBackground(data);
      } else {
        setBackground(null);
      }
    } catch (error) {
      console.error(`Error fetching background for ${sectionName}:`, error);
      setBackground(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={className} style={style}>{children}</div>;
  }

  if (!background || !background.enabled) {
    return <div className={className} style={style}>{children}</div>;
  }

  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = { ...style, position: 'relative' };

    if (background.background_type === 'color') {
      baseStyle.backgroundColor = background.background_value;
    } else if (background.background_type === 'gradient') {
      baseStyle.background = background.background_value;
    } else if (background.background_type === 'image' && background.image_url) {
      baseStyle.backgroundImage = `url(${background.image_url})`;
      baseStyle.backgroundSize = background.background_size;
      baseStyle.backgroundRepeat = background.background_repeat;
      baseStyle.backgroundAttachment = background.background_attachment;

      if (sectionName !== 'hero') {
        const hasPixelPositioning = background.background_position_left !== 0 ||
                                   background.background_position_right !== 0 ||
                                   background.background_position_top !== 0 ||
                                   background.background_position_bottom !== 0;

        if (hasPixelPositioning) {
          let positionStr = '';
          if (background.background_position_left) {
            positionStr += `${background.background_position_left}px `;
          } else if (background.background_position_right) {
            positionStr += `right ${background.background_position_right}px `;
          } else {
            positionStr += '0 ';
          }

          if (background.background_position_top) {
            positionStr += `${background.background_position_top}px`;
          } else if (background.background_position_bottom) {
            positionStr += `bottom ${background.background_position_bottom}px`;
          } else {
            positionStr += '0';
          }

          baseStyle.backgroundPosition = positionStr;
        } else {
          baseStyle.backgroundPosition = background.background_position;
        }
      }
    }

    return baseStyle;
  };

  const getBackgroundColor = (): string => {
    if (background.background_type === 'color') {
      return background.background_value;
    }

    const sectionElement = document.querySelector(`[data-section="${sectionName}"]`);
    if (sectionElement) {
      const computedStyle = window.getComputedStyle(sectionElement);
      const bgColor = computedStyle.backgroundColor;
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        return bgColor;
      }
    }

    return '#000000';
  };

  const shouldShowEdgeBlend = (): boolean => {
    if (!edgeBlendSettings.enabled) return false;
    if (!background) return false;
    if (isMobile) return false;

    if (background.background_type === 'video' && background.video_width_percentage < 100) return true;
    if (background.background_type === 'image') return true;

    return false;
  };

  const getEdgeBlendGradients = () => {
    if (!shouldShowEdgeBlend()) return null;

    const bgColor = getBackgroundColor();
    const width = edgeBlendSettings.width;
    const side = edgeBlendSettings.side;

    const gradients: Array<{ side: 'left' | 'right'; gradient: string }> = [];

    if (side === 'left' || side === 'both') {
      gradients.push({
        side: 'left',
        gradient: `linear-gradient(to right, ${bgColor}, transparent)`,
      });
    }

    if (side === 'right' || side === 'both') {
      gradients.push({
        side: 'right',
        gradient: `linear-gradient(to left, ${bgColor}, transparent)`,
      });
    }

    return { gradients, width };
  };

  const hasOverlay = background.background_overlay_opacity > 0;

  const getResponsiveStyles = () => {
    if (background.background_type === 'image' && background.image_url && sectionName === 'hero') {
      let desktopPosition = background.background_position;
      if (desktopPosition === 'right') {
        desktopPosition = 'right 113px center';
      } else if (desktopPosition === 'left') {
        desktopPosition = 'left 113px center';
      } else if (desktopPosition.includes('right') && !desktopPosition.match(/right\s+\d/)) {
        desktopPosition = desktopPosition.replace('right', 'right 113px');
      } else if (desktopPosition.includes('left') && !desktopPosition.match(/left\s+\d/)) {
        desktopPosition = desktopPosition.replace('left', 'left 113px');
      }

      const calculateOvalPosition = () => {
        const hasPixelPositioning = background.background_position_left !== 0 ||
                                   background.background_position_right !== 0 ||
                                   background.background_position_top !== 0 ||
                                   background.background_position_bottom !== 0;

        if (!hasPixelPositioning) {
          return {
            horizontal: 'left: 75%;',
            vertical: 'top: 50%; transform: translate(-50%, -50%);'
          };
        }

        let horizontal = '';
        let vertical = '';

        if (background.background_position_right !== 0) {
          const rightValue = Math.max(0, Math.min(background.background_position_right, 800));
          horizontal = `right: ${rightValue}px;`;
        } else if (background.background_position_left !== 0) {
          const leftValue = Math.max(0, Math.min(background.background_position_left, 800));
          horizontal = `left: ${leftValue}px;`;
        } else {
          horizontal = 'left: 75%;';
        }

        if (background.background_position_top !== 0) {
          const topValue = Math.max(-100, Math.min(background.background_position_top, 300));
          vertical = `top: calc(50% + ${topValue}px); transform: translate(-50%, -50%);`;
        } else if (background.background_position_bottom !== 0) {
          const bottomValue = Math.max(0, Math.min(background.background_position_bottom, 300));
          vertical = `bottom: ${bottomValue}px; transform: translateX(-50%);`;
        } else {
          vertical = 'top: 50%; transform: translate(-50%, -50%);';
        }

        return { horizontal, vertical };
      };

      const ovalPosition = calculateOvalPosition();

      const useBottomPositioning = background.background_position_bottom !== 0 && background.background_position_top === 0;
      const hoverTransform = useBottomPositioning ? 'translateX(-50%)' : 'translate(-50%, -50%)';

      const ovalWidth = heroImageWidth || heroImageDimensions.width;
      const ovalHeight = heroImageHeight || heroImageDimensions.height;
      const tabletWidth = Math.round(ovalWidth * 0.9);
      const tabletHeight = Math.round(ovalHeight * 0.9);
      const pillRadius = Math.floor(ovalWidth / 2);
      const tabletPillRadius = Math.floor(tabletWidth / 2);

      const ovalFrameStyles = heroOvalFrame ? `
        [data-section="hero"][data-bg-image="true"] {
          position: relative;
        }
        [data-section="hero"][data-bg-image="true"]::before {
          content: '';
          position: absolute;
          ${ovalPosition.vertical}
          ${ovalPosition.horizontal}
          width: ${ovalWidth}px;
          height: ${ovalHeight}px;
          background-image: url('${background.image_url}');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
          border-radius: ${pillRadius}px;
          z-index: 1;
          transition: all 0.3s ease;
          border: 2px solid rgba(0, 102, 204, 0.6);
          box-shadow: 0 25px 50px -12px rgba(0, 102, 204, 0.3), 0 0 30px rgba(0, 102, 204, 0.4);
          pointer-events: none;
        }
        .oval-hover-trigger {
          border-radius: ${pillRadius}px;
        }
        @media (min-width: 1025px) {
          [data-section="hero"][data-bg-image="true"]:has(.oval-hover-trigger:hover)::before {
            transform: ${hoverTransform};
          }
        }
        [data-section="hero"][data-bg-image="true"] {
          background-image: none !important;
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          [data-section="hero"][data-bg-image="true"]::before {
            width: ${tabletWidth}px;
            height: ${tabletHeight}px;
            border-radius: ${tabletPillRadius}px;
            left: 75%;
            transform: translate(-50%, -50%);
          }
        }
        @media (max-width: 767px) {
          [data-section="hero"][data-bg-image="true"]::before {
            display: none;
          }
          [data-section="hero"][data-bg-image="true"] {
            background-image: none !important;
          }
        }
      ` : `
        [data-section="hero"][data-bg-image="true"] {
          background-position: center center !important;
        }
      `;

      return `
        <style>
          ${ovalFrameStyles}
          @media (min-width: 768px) {
            [data-section="hero"][data-bg-image="true"] {
              ${heroOvalFrame ? '' : `background-position: ${desktopPosition} !important;`}
            }
          }
        </style>
      `;
    }
    return null;
  };

  return (
    <>
      {getResponsiveStyles() && (
        <div dangerouslySetInnerHTML={{ __html: getResponsiveStyles() || '' }} />
      )}
      <div
        ref={ref}
        className={`${className} w-full max-w-full`}
        style={getBackgroundStyle()}
        data-section={sectionName}
        data-bg-image={background.background_type === 'image' && background.image_url ? 'true' : undefined}
      >
      {background.background_type === 'video' && background.image_url && (
        <div
          className="absolute inset-0 flex items-center"
          style={{
            zIndex: 0,
            justifyContent: background.video_horizontal_align === 'left' ? 'flex-start' :
                           background.video_horizontal_align === 'right' ? 'flex-end' : 'center',
          }}
        >
          <video
            autoPlay={background.video_autoplay}
            loop={background.video_loop}
            muted={background.video_muted}
            playsInline
            className="h-full"
            style={{
              width: `${background.video_width_percentage || 100}%`,
              objectFit: background.background_size === 'contain' ? 'contain' : background.background_size === 'auto' ? 'none' : 'cover',
              objectPosition: background.background_position || 'center',
            }}
          >
            <source src={background.image_url} type="video/mp4" />
          </video>
        </div>
      )}

      {hasOverlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: background.background_overlay_color,
            opacity: background.background_overlay_opacity,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      )}

      {(() => {
        const blendConfig = getEdgeBlendGradients();
        if (!blendConfig) return null;

        return blendConfig.gradients.map((gradient, index) => (
          <div
            key={index}
            className="absolute inset-y-0"
            style={{
              [gradient.side]: 0,
              width: `${blendConfig.width}px`,
              background: gradient.gradient,
              zIndex: 1.5,
              pointerEvents: 'none',
            }}
          />
        ));
      })()}

      {sectionName === 'hero' && heroOvalFrame && background?.background_type === 'image' && background?.image_url && (
        <div
          className="oval-hover-trigger hidden lg:block"
          style={{
            position: 'absolute',
            ...(() => {
              const hasPixelPositioning = background.background_position_left !== 0 ||
                                         background.background_position_right !== 0 ||
                                         background.background_position_top !== 0 ||
                                         background.background_position_bottom !== 0;

              let horizontal = '';
              let vertical = '';

              if (!hasPixelPositioning) {
                horizontal = 'left: 75%';
                vertical = 'top: 50%';
              } else {
                if (background.background_position_right !== 0) {
                  const rightValue = Math.max(0, Math.min(background.background_position_right, 800));
                  horizontal = `right: ${rightValue}px`;
                } else if (background.background_position_left !== 0) {
                  const leftValue = Math.max(0, Math.min(background.background_position_left, 800));
                  horizontal = `left: ${leftValue}px`;
                } else {
                  horizontal = 'left: 75%';
                }

                if (background.background_position_top !== 0) {
                  const topValue = Math.max(-100, Math.min(background.background_position_top, 300));
                  vertical = `top: calc(50% + ${topValue}px)`;
                } else if (background.background_position_bottom !== 0) {
                  const bottomValue = Math.max(0, Math.min(background.background_position_bottom, 300));
                  vertical = `bottom: ${bottomValue}px`;
                } else {
                  vertical = 'top: 50%';
                }
              }

              const styleObj: any = {};
              if (horizontal.includes('right')) {
                styleObj.right = horizontal.split(':')[1].trim();
              } else if (horizontal.includes('left')) {
                styleObj.left = horizontal.split(':')[1].trim();
              }

              if (vertical.includes('bottom')) {
                styleObj.bottom = vertical.split(':')[1].trim();
                styleObj.transform = 'translateX(-50%)';
              } else {
                const topMatch = vertical.match(/top:\s*([^;]+)/);
                if (topMatch) {
                  styleObj.top = topMatch[1].trim();
                } else {
                  styleObj.top = '50%';
                }
                styleObj.transform = 'translate(-50%, -50%)';
              }

              return styleObj;
            })(),
            width: `${heroImageWidth || heroImageDimensions.width}px`,
            height: `${heroImageHeight || heroImageDimensions.height}px`,
            zIndex: 50,
            cursor: 'pointer',
          }}
        />
      )}

      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
    </>
  );
});

SectionWrapper.displayName = 'SectionWrapper';

export default SectionWrapper;
