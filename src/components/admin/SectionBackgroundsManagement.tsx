import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Upload, X, Save, Image, Video, Palette, Layers } from 'lucide-react';

// Preview Component Imports
import HeroSection from '../HeroSection';
import ServicesSection from '../ServicesSection';
import DoctorsSection from '../DoctorsSection';
import ReviewsSection from '../ReviewsSection';
import AboutSection from '../AboutSection';
import PatientResultsSection from '../PatientResultsSection';
import PillChoiceSection from '../PillChoiceSection';
import FAQSection from '../FAQSection';
import ValueStackingSection from '../ValueStackingSection';
import FinalCTASection from '../FinalCTASection';
import FeatureBanners from '../FeatureBanners';

interface SectionBackground {
  _id?: string;
  id?: string;
  section_name: string;
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

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  features: 'Features Section (After Hero)',
  services: 'Services Section',
  doctors: 'Doctors Section',
  reviews: 'Reviews Section',
  about: 'About Section',
  results: 'Results Section',
  kim_uchun: 'Kim Uchun Section',
  pill_choice: 'Pill Choice Section',
  faq: 'FAQ Section',
  value_stacking: 'Value Stacking Section',
  final_cta: 'Final CTA Section',
};

// Component to render actual section preview
const SectionPreview = ({ sectionName }: { sectionName: string }) => {
  switch (sectionName) {
    case 'hero':
      return <HeroSection />;
    case 'services':
      return <ServicesSection />;
    case 'doctors':
      return <DoctorsSection />;
    case 'reviews':
      return <ReviewsSection />;
    case 'about':
      return <AboutSection />;
    case 'results':
      return <PatientResultsSection />;
    case 'features':
      return <FeatureBanners />;
    case 'kim_uchun':
      return <FeatureBanners />;
    case 'pill_choice':
      return <PillChoiceSection />;
    case 'faq':
      return <FAQSection />;
    case 'value_stacking':
      return <ValueStackingSection />;
    case 'final_cta':
      return <FinalCTASection />;
    default:
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>No preview available for this section</p>
        </div>
      );
  }
};

export default function SectionBackgroundsManagement() {
  const [backgrounds, setBackgrounds] = useState<SectionBackground[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [formData, setFormData] = useState<Partial<SectionBackground>>({
    background_type: 'color',
    background_value: '#ffffff',
    background_overlay_color: '#000000',
    background_overlay_opacity: 0,
    background_position: 'center',
    background_size: 'cover',
    background_repeat: 'no-repeat',
    background_attachment: 'scroll',
    background_position_left: 0,
    background_position_right: 0,
    background_position_top: 0,
    background_position_bottom: 0,
    video_loop: true,
    video_muted: true,
    video_autoplay: true,
    video_width_percentage: 100,
    video_horizontal_align: 'center',
    enabled: false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [heroOvalFrame, setHeroOvalFrame] = useState(true);

  useEffect(() => {
    fetchBackgrounds();
    fetchHeroOvalFrame();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      const selected = backgrounds.find(bg => bg.section_name === selectedSection);
      if (selected) {
        setFormData(selected);
      }
    }
  }, [selectedSection, backgrounds]);

  const fetchBackgrounds = async () => {
    try {
      const data = await api.getSectionBackgrounds();
      setBackgrounds(data.map((bg: any) => ({ ...bg, id: bg._id || bg.id })));
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      setMessage('Error loading backgrounds');
    }
  };

  const fetchHeroOvalFrame = async () => {
    try {
      const value = await api.getSiteSetting('hero_oval_frame');
      if (value !== undefined && value !== null) {
        setHeroOvalFrame(value === 'true' || value === true);
      }
    } catch (error) {
      console.error('Error fetching hero oval frame setting:', error);
    }
  };

  const saveHeroOvalFrame = async (enabled: boolean) => {
    try {
      await api.updateSiteSetting('hero_oval_frame', enabled.toString());
      setMessage('Hero oval frame setting saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving hero oval frame setting:', error);
      setMessage('Error saving hero oval frame setting');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = fileType === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage(`File too large. Max size: ${fileType === 'image' ? '10MB' : '50MB'}`);
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedSection}-${Date.now()}.${fileExt}`;

      const result = await api.uploadFile(file, fileName);
      if (result.success && result.url) {
        setFormData(prev => ({
          ...prev,
          image_url: result.url,
          background_type: fileType,
        }));
        setMessage(`${fileType === 'image' ? 'Image' : 'Video'} uploaded successfully`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!formData.image_url) return;

    try {
      await api.deleteFile(formData.image_url);
      setFormData(prev => ({
        ...prev,
        image_url: undefined,
        background_type: 'color',
      }));
      setMessage('File removed successfully');
    } catch (error: any) {
      console.error('Remove error:', error);
      setMessage('Failed to remove file');
    }
  };

  const handleSave = async () => {
    if (!selectedSection) {
      setMessage('Please select a section');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await api.updateSectionBackground(selectedSection, {
        background_type: formData.background_type!,
        background_value: formData.background_value!,
        image_url: formData.image_url,
        background_overlay_color: formData.background_overlay_color!,
        background_overlay_opacity: formData.background_overlay_opacity!,
        background_position: formData.background_position!,
        background_size: formData.background_size!,
        background_repeat: formData.background_repeat!,
        background_attachment: formData.background_attachment!,
        background_position_left: formData.background_position_left || 0,
        background_position_right: formData.background_position_right || 0,
        background_position_top: formData.background_position_top || 0,
        background_position_bottom: formData.background_position_bottom || 0,
        video_loop: formData.video_loop!,
        video_muted: formData.video_muted!,
        video_autoplay: formData.video_autoplay!,
        video_width_percentage: formData.video_width_percentage!,
        video_horizontal_align: formData.video_horizontal_align!,
        enabled: formData.enabled!,
      });

      await fetchBackgrounds();
      setMessage('Background settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Layers className="w-6 h-6" />
        Section Backgrounds & Opacity
      </h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('Error') || message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="font-semibold mb-3">Select Section</h3>
          <div className="space-y-2">
            {backgrounds.map(bg => (
              <button
                key={bg.id}
                onClick={() => setSelectedSection(bg.section_name)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedSection === bg.section_name
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{sectionLabels[bg.section_name] || bg.section_name}</span>
                  {bg.enabled && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSection ? (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.enabled || false}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Enable Custom Background</span>
                </label>

                {selectedSection === 'hero' && formData.enabled && formData.background_type === 'image' && (
                  <label className="flex items-center gap-2 mt-3 ml-6">
                    <input
                      type="checkbox"
                      checked={heroOvalFrame}
                      onChange={(e) => {
                        setHeroOvalFrame(e.target.checked);
                        saveHeroOvalFrame(e.target.checked);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Show as Oval Frame (200px x 400px, hidden on mobile)</span>
                  </label>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-2">Background Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['color', 'gradient', 'image', 'video'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, background_type: type })}
                      className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.background_type === type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type === 'color' && <Palette className="w-4 h-4" />}
                      {type === 'gradient' && <Layers className="w-4 h-4" />}
                      {type === 'image' && <Image className="w-4 h-4" />}
                      {type === 'video' && <Video className="w-4 h-4" />}
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(formData.background_type === 'color' || formData.background_type === 'gradient') && (
                <div>
                  <label className="block font-semibold mb-2">
                    {formData.background_type === 'color' ? 'Background Color' : 'Gradient CSS'}
                  </label>
                  {formData.background_type === 'color' ? (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.background_value || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, background_value: e.target.value })}
                        className="w-16 h-10 rounded"
                      />
                      <input
                        type="text"
                        value={formData.background_value || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, background_value: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder="#ffffff"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={formData.background_value || ''}
                      onChange={(e) => setFormData({ ...formData, background_value: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      rows={3}
                      placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                  )}
                </div>
              )}

              {(formData.background_type === 'image' || formData.background_type === 'video') && (
                <div>
                  <label className="block font-semibold mb-2">
                    {formData.background_type === 'image' ? 'Upload Image' : 'Upload Video'}
                  </label>

                  {formData.image_url ? (
                    <div className="space-y-3">
                      <div className="relative border rounded-lg p-4 bg-gray-50">
                        {/* Live Preview Container with Actual Section - 16:9 Aspect Ratio */}
                        <div className="relative rounded overflow-hidden bg-gray-100" style={{ width: '100%', paddingBottom: '56.25%', position: 'relative' }}>
                          <div className="absolute inset-0">
                          {/* Background Layer */}
                          <div
                            className="absolute inset-0 z-0"
                            style={{
                              backgroundImage: formData.background_type === 'image'
                                ? `url(${formData.image_url})`
                                : undefined,
                              backgroundPosition: (() => {
                                const hasPixelPos = formData.background_position_left !== 0 ||
                                                   formData.background_position_right !== 0 ||
                                                   formData.background_position_top !== 0 ||
                                                   formData.background_position_bottom !== 0;
                                if (hasPixelPos) {
                                  let pos = '';
                                  if (formData.background_position_left) {
                                    pos += `${formData.background_position_left}px `;
                                  } else if (formData.background_position_right) {
                                    pos += `right ${formData.background_position_right}px `;
                                  } else {
                                    pos += '0 ';
                                  }
                                  if (formData.background_position_top) {
                                    pos += `${formData.background_position_top}px`;
                                  } else if (formData.background_position_bottom) {
                                    pos += `bottom ${formData.background_position_bottom}px`;
                                  } else {
                                    pos += '0';
                                  }
                                  return pos;
                                }
                                return formData.background_position || 'center';
                              })(),
                              backgroundSize: formData.background_size || 'cover',
                              backgroundRepeat: formData.background_repeat || 'no-repeat',
                              backgroundAttachment: 'scroll',
                            }}
                          >
                            {formData.background_type === 'video' && (
                              <div
                                className="h-full flex items-center"
                                style={{
                                  justifyContent: formData.video_horizontal_align === 'left' ? 'flex-start' :
                                                 formData.video_horizontal_align === 'right' ? 'flex-end' : 'center',
                                }}
                              >
                                <video
                                  src={formData.image_url}
                                  className="h-full"
                                  style={{
                                    width: `${formData.video_width_percentage || 100}%`,
                                    objectFit: formData.background_size === 'contain' ? 'contain' : formData.background_size === 'auto' ? 'none' : 'cover',
                                    objectPosition: formData.background_position || 'center',
                                  }}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                />
                              </div>
                            )}
                          </div>

                          {/* Overlay - Only render if opacity is greater than 0 */}
                          {formData.background_overlay_opacity !== undefined && formData.background_overlay_opacity > 0 && (
                            <div
                              className="absolute inset-0 z-10 pointer-events-none"
                              style={{
                                backgroundColor: formData.background_overlay_color || '#000000',
                                opacity: formData.background_overlay_opacity
                              }}
                            />
                          )}

                          {/* Actual Section Content - Scaled down to fit 16:9 */}
                          <div
                            className="relative z-20 h-full overflow-hidden"
                            style={{
                              transform: 'scale(0.35)',
                              transformOrigin: 'top center',
                              width: '285.7%',
                              height: '285.7%'
                            }}
                          >
                            {selectedSection ? (
                              <div className="pointer-events-none">
                                <SectionPreview sectionName={selectedSection} />
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-gray-500">
                                <p style={{ transform: 'scale(2)' }}>Select a section to see preview</p>
                              </div>
                            )}
                          </div>
                          </div>
                        </div>

                        <button
                          onClick={handleRemoveFile}
                          className="absolute top-6 right-6 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 z-30"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Preview Info */}
                        <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-700 space-y-1">
                          <p className="font-semibold text-blue-900 mb-2">Live Preview Settings:</p>
                          <p><span className="font-medium">Position:</span> {formData.background_position || 'center'} | <span className="font-medium">Size:</span> {formData.background_size || 'cover'}</p>
                          <p><span className="font-medium">Repeat:</span> {formData.background_repeat || 'no-repeat'} | <span className="font-medium">Attachment:</span> {formData.background_attachment || 'scroll'}</p>
                          <p><span className="font-medium">Overlay:</span> {formData.background_overlay_opacity && formData.background_overlay_opacity > 0 ? `${formData.background_overlay_color || '#000000'} at ${(formData.background_overlay_opacity * 100).toFixed(0)}%` : 'None'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <input
                        type="file"
                        accept={formData.background_type === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => handleFileUpload(e, formData.background_type as 'image' | 'video')}
                        disabled={uploading}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 cursor-pointer transition-colors">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">
                          {uploading ? 'Uploading...' : `Click to upload ${formData.background_type}`}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Max size: {formData.background_type === 'image' ? '10MB' : '50MB'}
                        </p>
                      </div>
                    </label>
                  )}

                  {(formData.background_type === 'image' || formData.background_type === 'video') && (
                    <>
                      <div>
                        <label className="block font-semibold mb-3">Pixel Position (px)</label>
                        {selectedSection === 'hero' && (
                          <div className="mb-3 p-3 bg-blue-50 rounded text-sm text-blue-900">
                            <p className="font-medium mb-1">Oval Frame Positioning Limits:</p>
                            <p className="text-xs">• Horizontal: 0-800px | Vertical: -100 to 300px</p>
                            <p className="text-xs mt-1">• Use either Left OR Right (not both)</p>
                            <p className="text-xs">• Use either Top OR Bottom (not both)</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Left: {formData.background_position_left || 0}px
                            </label>
                            <input
                              type="number"
                              value={formData.background_position_left || 0}
                              onChange={(e) => setFormData({ ...formData, background_position_left: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border rounded"
                              placeholder="0"
                              min={selectedSection === 'hero' ? 0 : undefined}
                              max={selectedSection === 'hero' ? 800 : undefined}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Right: {formData.background_position_right || 0}px
                            </label>
                            <input
                              type="number"
                              value={formData.background_position_right || 0}
                              onChange={(e) => setFormData({ ...formData, background_position_right: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border rounded"
                              placeholder="0"
                              min={selectedSection === 'hero' ? 0 : undefined}
                              max={selectedSection === 'hero' ? 800 : undefined}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Top: {formData.background_position_top || 0}px
                            </label>
                            <input
                              type="number"
                              value={formData.background_position_top || 0}
                              onChange={(e) => setFormData({ ...formData, background_position_top: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border rounded"
                              placeholder="0"
                              min={selectedSection === 'hero' ? -100 : undefined}
                              max={selectedSection === 'hero' ? 300 : undefined}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Bottom: {formData.background_position_bottom || 0}px
                            </label>
                            <input
                              type="number"
                              value={formData.background_position_bottom || 0}
                              onChange={(e) => setFormData({ ...formData, background_position_bottom: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border rounded"
                              placeholder="0"
                              min={selectedSection === 'hero' ? 0 : undefined}
                              max={selectedSection === 'hero' ? 300 : undefined}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Size</label>
                          <select
                            value={formData.background_size || 'cover'}
                            onChange={(e) => setFormData({ ...formData, background_size: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                          >
                            <option value="cover">Cover</option>
                            <option value="contain">Contain</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Repeat</label>
                          <select
                            value={formData.background_repeat || 'no-repeat'}
                            onChange={(e) => setFormData({ ...formData, background_repeat: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                          >
                            <option value="no-repeat">No Repeat</option>
                            <option value="repeat">Repeat</option>
                            <option value="repeat-x">Repeat X</option>
                            <option value="repeat-y">Repeat Y</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Attachment</label>
                          <select
                            value={formData.background_attachment || 'scroll'}
                            onChange={(e) => setFormData({ ...formData, background_attachment: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                          >
                            <option value="scroll">Scroll</option>
                            <option value="fixed">Fixed</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.background_type === 'video' && (
                    <>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.video_autoplay || false}
                            onChange={(e) => setFormData({ ...formData, video_autoplay: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Autoplay</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.video_loop || false}
                            onChange={(e) => setFormData({ ...formData, video_loop: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Loop</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.video_muted || false}
                            onChange={(e) => setFormData({ ...formData, video_muted: e.target.checked })}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Muted</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Video Width: {formData.video_width_percentage || 100}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={formData.video_width_percentage || 100}
                            onChange={(e) => setFormData({ ...formData, video_width_percentage: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Horizontal Alignment</label>
                          <select
                            value={formData.video_horizontal_align || 'center'}
                            onChange={(e) => setFormData({ ...formData, video_horizontal_align: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div>
                <label className="block font-semibold mb-2">Overlay Settings</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Overlay Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.background_overlay_color || '#000000'}
                        onChange={(e) => setFormData({ ...formData, background_overlay_color: e.target.value })}
                        className="w-16 h-10 rounded"
                      />
                      <input
                        type="text"
                        value={formData.background_overlay_color || '#000000'}
                        onChange={(e) => setFormData({ ...formData, background_overlay_color: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Overlay Opacity: {formData.background_overlay_opacity?.toFixed(2) || '0.00'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={formData.background_overlay_opacity || 0}
                      onChange={(e) => setFormData({ ...formData, background_overlay_opacity: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Background Settings'}
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Layers className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select a section to configure its background</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
