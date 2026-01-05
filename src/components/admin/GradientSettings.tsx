import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function GradientSettings() {
  const [settings, setSettings] = useState({
    gradient_opacity: '0.25',
    gradient_width: '90',
    gradient_height: '85',
    gradient_blur: '60',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['gradient_opacity', 'gradient_width', 'gradient_height', 'gradient_blur']);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach((setting) => {
        settingsObj[setting.key] = setting.value;
      });

      setSettings((prev) => ({ ...prev, ...settingsObj }));
    } catch (error) {
      console.error('Error fetching gradient settings:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        category: 'appearance',
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: update.value })
          .eq('key', update.key);

        if (error) throw error;
      }

      setMessage('Gradient settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving gradient settings:', error);
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold text-neutral-900 mb-6">Gradient Settings</h3>
      <p className="text-neutral-600 mb-6">
        Configure the blue gradient overlay that appears on black background sections (Doctors, Reviews, Value Stacking, Final CTA).
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Gradient Opacity
            <span className="text-neutral-500 ml-2">(0.0 to 1.0 - higher = more intense)</span>
          </label>
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={settings.gradient_opacity}
            onChange={(e) => setSettings({ ...settings, gradient_opacity: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Current: {settings.gradient_opacity} (Recommended: 0.20 - 0.40)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Gradient Width
            <span className="text-neutral-500 ml-2">(0 to 100%)</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.gradient_width}
            onChange={(e) => setSettings({ ...settings, gradient_width: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Current: {settings.gradient_width}% (Recommended: 80 - 95)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Gradient Height
            <span className="text-neutral-500 ml-2">(0 to 100%)</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.gradient_height}
            onChange={(e) => setSettings({ ...settings, gradient_height: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Current: {settings.gradient_height}% (Recommended: 75 - 90)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Gradient Blur
            <span className="text-neutral-500 ml-2">(in pixels - higher = softer edges)</span>
          </label>
          <input
            type="number"
            min="0"
            max="150"
            value={settings.gradient_blur}
            onChange={(e) => setSettings({ ...settings, gradient_blur: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Current: {settings.gradient_blur}px (Recommended: 40 - 80)
          </p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <h4 className="font-semibold text-neutral-900 mb-2">Preview Effect:</h4>
          <p className="text-sm text-neutral-600 mb-3">
            The gradient creates a centered blue glow on black sections for visual depth.
          </p>
          <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: `${settings.gradient_width}%`,
                height: `${settings.gradient_height}%`,
                background: `radial-gradient(ellipse 100% 80% at 50% 50%, rgba(0, 102, 255, ${settings.gradient_opacity}) 0%, rgba(0, 102, 255, ${parseFloat(settings.gradient_opacity) * 0.6}) 30%, rgba(0, 102, 255, ${parseFloat(settings.gradient_opacity) * 0.32}) 50%, transparent 70%)`,
                filter: `blur(${settings.gradient_blur}px)`,
              }}
            />
            <div className="relative z-10 flex items-center justify-center h-full">
              <p className="text-white font-bold">Sample Content</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-neutral-400 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Gradient Settings'}
          </button>
          {message && (
            <span className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
