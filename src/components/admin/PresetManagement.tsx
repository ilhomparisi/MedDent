import { useState, useEffect } from 'react';
import { Save, Download, Upload, Copy, Trash2, Check, Play } from 'lucide-react';
import {
  getAllPresets,
  saveCurrentConfigurationAsPreset,
  applyPreset,
  deletePreset,
  duplicatePreset,
  exportPresetAsJSON,
  importPresetFromJSON,
  ConfigurationPreset,
} from '../../lib/configurationPresets';

export default function PresetManagement() {
  const [presets, setPresets] = useState<ConfigurationPreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJSON, setImportJSON] = useState('');
  const [importName, setImportName] = useState('');

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    setLoading(true);
    const data = await getAllPresets();
    setPresets(data);
    setLoading(false);
  };

  const handleSaveCurrentConfig = async () => {
    if (!newPresetName.trim()) {
      setMessage('Iltimos, preset nomini kiriting!');
      return;
    }

    setSaving(true);
    setMessage('');

    const result = await saveCurrentConfigurationAsPreset(
      newPresetName,
      newPresetDescription
    );

    if (result.success) {
      setMessage('Konfiguratsiya muvaffaqiyatli saqlandi!');
      setNewPresetName('');
      setNewPresetDescription('');
      setShowSaveDialog(false);
      await fetchPresets();
    } else {
      setMessage(`Xatolik: ${result.error}`);
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleApplyPreset = async (presetId: string) => {
    if (!confirm('Ushbu presetni qo\'llashni xohlaysizmi? Bu barcha joriy sozlamalarni o\'zgartiradi.')) {
      return;
    }

    setSaving(true);
    setMessage('');

    const result = await applyPreset(presetId);

    if (result.success) {
      setMessage('Preset muvaffaqiyatli qo\'llandi!');
      await fetchPresets();
      window.location.reload();
    } else {
      setMessage(`Xatolik: ${result.error}`);
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeletePreset = async (presetId: string) => {
    if (!confirm('Ushbu presetni o\'chirmoqchimisiz? Bu amalni bekor qilib bo\'lmaydi.')) {
      return;
    }

    const result = await deletePreset(presetId);

    if (result.success) {
      setMessage('Preset muvaffaqiyatli o\'chirildi!');
      await fetchPresets();
    } else {
      setMessage(`Xatolik: ${result.error}`);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleDuplicatePreset = async (presetId: string, originalName: string) => {
    const newName = prompt('Yangi preset nomi:', `${originalName} (nusxa)`);
    if (!newName) return;

    const result = await duplicatePreset(presetId, newName);

    if (result.success) {
      setMessage('Preset muvaffaqiyatli nusxa olindi!');
      await fetchPresets();
    } else {
      setMessage(`Xatolik: ${result.error}`);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleExportPreset = async (presetId: string, presetName: string) => {
    const json = await exportPresetAsJSON(presetId);
    if (!json) {
      setMessage('Eksport qilishda xatolik!');
      return;
    }

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presetName.replace(/\s+/g, '_')}_config.json`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage('Preset muvaffaqiyatli eksport qilindi!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImportPreset = async () => {
    if (!importName.trim() || !importJSON.trim()) {
      setMessage('Iltimos, nom va JSON ma\'lumotlarini kiriting!');
      return;
    }

    setSaving(true);
    const result = await importPresetFromJSON(importName, importJSON);

    if (result.success) {
      setMessage('Preset muvaffaqiyatli import qilindi!');
      setImportName('');
      setImportJSON('');
      setShowImportDialog(false);
      await fetchPresets();
    } else {
      setMessage(`Xatolik: ${result.error}`);
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="text-white">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Konfiguratsiya Presetlari</h2>
          <p className="text-neutral-400 text-sm mt-1">
            Joriy sozlamalarni saqlang va keyinroq qayta yuklang
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
          >
            <Upload className="w-5 h-5" />
            Import
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-5 h-5" />
            Joriy Konfiguratsiyani Saqlash
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('muvaffaqiyatli')
              ? 'bg-green-600/20 text-green-400 border border-green-600'
              : 'bg-red-600/20 text-red-400 border border-red-600'
          }`}
        >
          {message}
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Yangi Preset Yaratish</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Preset Nomi *
                </label>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Masalan: Yoz Mavzusi"
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tavsif
                </label>
                <textarea
                  value={newPresetDescription}
                  onChange={(e) => setNewPresetDescription(e.target.value)}
                  placeholder="Preset haqida qisqacha ma'lumot..."
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveCurrentConfig}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Preset Import Qilish</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Preset Nomi *
                </label>
                <input
                  type="text"
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  placeholder="Import qilinadigan preset nomi"
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  JSON Ma'lumotlari *
                </label>
                <textarea
                  value={importJSON}
                  onChange={(e) => setImportJSON(e.target.value)}
                  placeholder='{"primary_color": "#2563eb", ...}'
                  rows={10}
                  className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowImportDialog(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleImportPreset}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Import qilinmoqda...' : 'Import Qilish'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {presets.length === 0 ? (
          <div className="bg-neutral-700 rounded-lg p-8 text-center">
            <p className="text-neutral-400">Hozircha presetlar yo'q</p>
            <p className="text-neutral-500 text-sm mt-2">
              Yuqoridagi "Joriy Konfiguratsiyani Saqlash" tugmasini bosing
            </p>
          </div>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-neutral-700 rounded-lg p-6 hover:bg-neutral-600/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">{preset.name}</h3>
                    {preset.is_active && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600">
                        <Check className="w-3 h-3" />
                        Faol
                      </span>
                    )}
                  </div>
                  {preset.description && (
                    <p className="text-neutral-400 text-sm mt-1">{preset.description}</p>
                  )}
                  <p className="text-neutral-500 text-xs mt-2">
                    Yaratilgan: {new Date(preset.created_at).toLocaleString('uz-UZ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApplyPreset(preset.id)}
                    disabled={saving || preset.is_active}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Presetni qo'llash"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExportPreset(preset.id, preset.name)}
                    className="p-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500"
                    title="Eksport qilish"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicatePreset(preset.id, preset.name)}
                    className="p-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500"
                    title="Nusxa olish"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePreset(preset.id)}
                    disabled={preset.is_active}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
