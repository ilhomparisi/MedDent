import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { FileText, Link2, MousePointer, TrendingUp, Calendar, Clock } from 'lucide-react';

interface DashboardStats {
  totalSubmissions: number;
  todaySubmissions: number;
  weekSubmissions: number;
  activeCampaigns: number;
  totalClicks: number;
  conversionRate: number;
}

interface RecentSubmission {
  id: string;
  full_name: string;
  phone: string;
  source: string;
  created_at: string;
}

interface SourceStat {
  source: string;
  count: number;
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubmissions: 0,
    todaySubmissions: 0,
    weekSubmissions: 0,
    activeCampaigns: 0,
    totalClicks: 0,
    conversionRate: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [sourceStats, setSourceStats] = useState<SourceStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [allForms, campaigns] = await Promise.all([
        api.getConsultationForms(),
        api.getCampaignLinks(),
      ]);

      const totalSubmissions = allForms.length;
      const todaySubmissions = allForms.filter((f: any) => new Date(f.created_at) >= today).length;
      const weekSubmissions = allForms.filter((f: any) => new Date(f.created_at) >= weekAgo).length;
      const activeCampaigns = campaigns.filter((c: any) => c.is_active).length;
      const totalClicks = campaigns.reduce((sum: number, c: any) => sum + (c.click_count || 0), 0);
      const conversionRate = totalClicks > 0 ? ((totalSubmissions / totalClicks) * 100) : 0;

      setStats({
        totalSubmissions,
        todaySubmissions,
        weekSubmissions,
        activeCampaigns,
        totalClicks,
        conversionRate: Math.round(conversionRate * 10) / 10,
      });

      const recentData = allForms
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((f: any) => ({
          id: f._id || f.id,
          full_name: f.full_name,
          phone: f.phone,
          source: f.source || 'Direct Visit',
          created_at: f.created_at,
        }));

      setRecentSubmissions(recentData);

      const sourceCounts: Record<string, number> = {};
      allForms.forEach((s: any) => {
        const src = s.source || 'Direct Visit';
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      });
      const sourceStatsArray = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);
      setSourceStats(sourceStatsArray);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceColor = (source: string) => {
    if (source === 'Direct Visit') return 'bg-slate-500';
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
    const hash = source.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 text-center">
        <div className="text-slate-400">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Jami arizalar</p>
              <p className="text-3xl font-bold text-white">{stats.totalSubmissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Bugun</p>
              <p className="text-3xl font-bold text-white">{stats.todaySubmissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Shu hafta</p>
              <p className="text-3xl font-bold text-white">{stats.weekSubmissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Link2 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Faol kampaniyalar</p>
              <p className="text-3xl font-bold text-white">{stats.activeCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Jami kliklar</p>
              <p className="text-3xl font-bold text-white">{stats.totalClicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Konversiya</p>
              <p className="text-3xl font-bold text-white">{stats.conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">So'nggi arizalar</h3>
          {recentSubmissions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Hozircha arizalar yo'q</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{submission.full_name}</p>
                    <p className="text-slate-400 text-sm">{submission.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${getSourceColor(submission.source || 'Direct Visit')}`}>
                      {submission.source || 'Direct Visit'}
                    </span>
                    <p className="text-slate-500 text-xs mt-1">{formatDate(submission.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Manbalar bo'yicha</h3>
          {sourceStats.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Ma'lumot yo'q</p>
          ) : (
            <div className="space-y-3">
              {sourceStats.map((stat, index) => {
                const percentage = stats.totalSubmissions > 0 ? (stat.count / stats.totalSubmissions * 100) : 0;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{stat.source}</span>
                      <span className="text-white font-medium">{stat.count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getSourceColor(stat.source)} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
