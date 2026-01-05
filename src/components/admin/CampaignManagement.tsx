import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Copy, Check, X, Link2, MousePointer, FileText, ExternalLink } from 'lucide-react';

interface Campaign {
  id: string;
  campaign_name: string;
  unique_code: string;
  is_active: boolean;
  expiry_date: string | null;
  click_count: number;
  submission_count?: number;
  created_at: string;
}

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', expiry: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'indefinite'>('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const { data: campaignsData } = await supabase
      .from('campaign_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (campaignsData) {
      const { data: submissions } = await supabase
        .from('consultation_forms')
        .select('source');

      const submissionCounts: Record<string, number> = {};
      submissions?.forEach(s => {
        const source = s.source || '';
        submissionCounts[source] = (submissionCounts[source] || 0) + 1;
      });

      const enrichedCampaigns = campaignsData.map(c => ({
        ...c,
        submission_count: submissionCounts[c.unique_code] || 0
      }));

      setCampaigns(enrichedCampaigns);
    }
    setLoading(false);
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    const newCode = editingId ? formData.code : generateSlug(name);
    setFormData({ ...formData, name, code: newCode });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!formData.name.trim()) {
      setError('Kampaniya nomi kiritilishi shart');
      setSaving(false);
      return;
    }

    if (!formData.code.trim()) {
      setError('URL kodi kiritilishi shart');
      setSaving(false);
      return;
    }

    const codeRegex = /^[a-z0-9-]+$/;
    if (!codeRegex.test(formData.code)) {
      setError('Kod faqat kichik harflar, raqamlar va tire (-) dan iborat bo\'lishi kerak');
      setSaving(false);
      return;
    }

    const campaignData = {
      campaign_name: formData.name,
      unique_code: formData.code,
      expiry_date: formData.expiry ? new Date(formData.expiry).toISOString() : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('campaign_links')
        .update(campaignData)
        .eq('id', editingId);

      if (error) {
        setError(error.message.includes('duplicate') ? 'Bu kod allaqachon ishlatilgan' : error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('campaign_links')
        .insert(campaignData);

      if (error) {
        setError(error.message.includes('duplicate') ? 'Bu kod allaqachon ishlatilgan' : error.message);
        setSaving(false);
        return;
      }
    }

    setFormData({ name: '', code: '', expiry: '' });
    setShowForm(false);
    setEditingId(null);
    setSaving(false);
    loadCampaigns();
  };

  const handleEdit = (campaign: Campaign) => {
    setFormData({
      name: campaign.campaign_name,
      code: campaign.unique_code,
      expiry: campaign.expiry_date ? campaign.expiry_date.split('T')[0] : ''
    });
    setEditingId(campaign.id);
    setShowForm(true);
    setError('');
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('campaign_links')
      .update({ is_active: !currentStatus })
      .eq('id', id);
    loadCampaigns();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haqiqatan ham bu kampaniyani o\'chirmoqchimisiz?')) return;
    await supabase.from('campaign_links').delete().eq('id', id);
    loadCampaigns();
  };

  const copyLink = async (code: string, id: string) => {
    const url = `${window.location.origin}/?source=${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatus = (campaign: Campaign) => {
    if (!campaign.is_active) return { label: 'Nofaol', color: 'bg-slate-500' };
    if (campaign.expiry_date && new Date(campaign.expiry_date) < new Date()) {
      return { label: 'Muddati o\'tgan', color: 'bg-red-500' };
    }
    if (!campaign.expiry_date) return { label: 'Cheksiz', color: 'bg-emerald-500' };
    return { label: 'Faol', color: 'bg-blue-500' };
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'all') return true;
    const status = getStatus(c);
    if (filter === 'active') return status.label === 'Faol' || status.label === 'Cheksiz';
    if (filter === 'expired') return status.label === 'Muddati o\'tgan';
    if (filter === 'indefinite') return status.label === 'Cheksiz';
    return true;
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Cheksiz';
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <div className="text-slate-400">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'expired', 'indefinite'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {f === 'all' ? 'Barchasi' : f === 'active' ? 'Faol' : f === 'expired' ? 'Muddati o\'tgan' : 'Cheksiz'}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', code: '', expiry: '' });
            setEditingId(null);
            setShowForm(true);
            setError('');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi kampaniya
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Kampaniyani tahrirlash' : 'Yangi kampaniya'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Kampaniya nomi</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="masalan: Instagram reklama"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">URL kodi</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="masalan: instagram-reklama"
              />
              <p className="text-slate-500 text-sm mt-1">
                Havola: {window.location.origin}/?source={formData.code || 'kod'}
              </p>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Amal qilish muddati (ixtiyoriy)</label>
              <input
                type="date"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-slate-500 text-sm mt-1">Bo'sh qoldiring agar cheksiz bo'lsa</p>
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg">{error}</div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : 'Yaratish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setError('');
                }}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        {filteredCampaigns.length === 0 ? (
          <div className="p-8 text-center">
            <Link2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Kampaniyalar topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Kampaniya</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Havola</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-medium">Kliklar</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-medium">Arizalar</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-medium">Konversiya</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Muddat</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">Holat</th>
                  <th className="text-right py-3 px-4 text-slate-300 font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => {
                  const status = getStatus(campaign);
                  const conversionRate = campaign.click_count > 0
                    ? Math.round((campaign.submission_count || 0) / campaign.click_count * 100)
                    : 0;
                  return (
                    <tr key={campaign.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-4 px-4">
                        <p className="text-white font-medium">{campaign.campaign_name}</p>
                        <p className="text-slate-500 text-sm">{campaign.unique_code}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyLink(campaign.unique_code, campaign.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 text-sm transition-colors"
                          >
                            {copiedId === campaign.id ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-400" />
                                Nusxalandi
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Nusxalash
                              </>
                            )}
                          </button>
                          <a
                            href={`${window.location.origin}/?source=${campaign.unique_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-300">
                          <MousePointer className="w-4 h-4" />
                          {campaign.click_count}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-300">
                          <FileText className="w-4 h-4" />
                          {campaign.submission_count || 0}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-medium ${conversionRate > 5 ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {conversionRate}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">{formatDate(campaign.expiry_date)}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(campaign.id, campaign.is_active)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-80 ${status.color}`}
                        >
                          {status.label === 'Faol' || status.label === 'Cheksiz' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {status.label}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(campaign)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
