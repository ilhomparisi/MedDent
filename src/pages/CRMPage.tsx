import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRMAuth } from '../contexts/CRMAuthContext';
import { FileText, LayoutDashboard, LogOut, User } from 'lucide-react';
import CRMDashboard from '../components/crm/CRMDashboard';
import FormSubmissions from '../components/crm/FormSubmissions';

type Tab = 'dashboard' | 'submissions';

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { user, loading, logout } = useCRMAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/crm/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/crm/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'submissions' as Tab, label: 'Arizalar', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/image.png"
                alt="MedDent Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-white text-xl font-bold">MEDDENT CRM Tizimi</h1>
                <p className="text-slate-400 text-sm">Arizalarni boshqaring</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4" />
                <span>{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 rounded-lg hover:bg-red-600/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Chiqish
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-56 flex-shrink-0">
            <nav className="bg-slate-800 rounded-xl p-3 sticky top-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && <CRMDashboard />}
            {activeTab === 'submissions' && <FormSubmissions />}
          </main>
        </div>
      </div>
    </div>
  );
}
