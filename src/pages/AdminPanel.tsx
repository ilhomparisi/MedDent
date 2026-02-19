import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Settings,
  Type,
  Palette,
  Users,
  Star,
  Clock,
  LogOut,
  Layers,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Megaphone,
  Zap,
  Package,
  FileText,
  Image,
  KeyRound,
  Link2
} from 'lucide-react';
import GeneralSettings from '../components/admin/GeneralSettings';
import ColorSettings from '../components/admin/ColorSettings';
import FontSettings from '../components/admin/FontSettings';
import DoctorsManagement from '../components/admin/DoctorsManagement';
import ResultsManagement from '../components/admin/ResultsManagement';
import ReviewsManagement from '../components/admin/ReviewsManagement';
import SectionBackgroundsManagement from '../components/admin/SectionBackgroundsManagement';
import PillSectionsManagement from '../components/admin/PillSectionsManagement';
import FAQManagement from '../components/admin/FAQManagement';
import ValueStackingManagement from '../components/admin/ValueStackingManagement';
import FinalCTAManagement from '../components/admin/FinalCTAManagement';
import GradientSettings from '../components/admin/GradientSettings';
import PresetManagement from '../components/admin/PresetManagement';
import FooterTextsManagement from '../components/admin/FooterTextsManagement';
import HeroImageSettings from '../components/admin/HeroImageSettings';
import CRMCredentialsManagement from '../components/admin/CRMCredentialsManagement';
import CampaignManagement from '../components/admin/CampaignManagement';

type Tab = 'presets' | 'general' | 'colors' | 'fonts' | 'backgrounds' | 'gradient' | 'hero-image' | 'doctors' | 'pill-sections' | 'value-stacking' | 'results' | 'reviews' | 'faq' | 'final-cta' | 'footer-texts' | 'crm-users' | 'campaigns';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const session = await api.getSession();
    if (!session) {
      navigate('/adminlogin');
      return;
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await api.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'presets' as Tab, label: 'Presetlar', icon: Package },
    { id: 'general' as Tab, label: 'Umumiy', icon: Settings },
    { id: 'colors' as Tab, label: 'Ranglar', icon: Palette },
    { id: 'fonts' as Tab, label: 'Shriftlar', icon: Type },
    { id: 'backgrounds' as Tab, label: 'Fonlar va Shaffoflik', icon: Layers },
    { id: 'gradient' as Tab, label: 'Gradient Sozlamalari', icon: Zap },
    { id: 'hero-image' as Tab, label: 'Hero Rasm Sozlamasi', icon: Image },
    { id: 'doctors' as Tab, label: 'Shifokorlar', icon: Users },
    { id: 'pill-sections' as Tab, label: 'Tabletka Bo\'limlari', icon: Sparkles },
    { id: 'value-stacking' as Tab, label: 'Value Stacking', icon: TrendingUp },
    { id: 'results' as Tab, label: 'Natijalar', icon: Clock },
    { id: 'reviews' as Tab, label: 'Sharhlar', icon: Star },
    { id: 'faq' as Tab, label: 'FAQ', icon: HelpCircle },
    { id: 'final-cta' as Tab, label: 'Oxirgi CTA', icon: Megaphone },
    { id: 'footer-texts' as Tab, label: 'Footer Matnlari', icon: FileText },
    { id: 'crm-users' as Tab, label: 'CRM Foydalanuvchilari', icon: KeyRound },
    { id: 'campaigns' as Tab, label: 'Kampaniyalar', icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/image.png" alt="MedDent" className="h-12 w-auto" />
              <div>
                <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
                <p className="text-neutral-400 text-sm">Saytni boshqarish</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Chiqish
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-neutral-800 rounded-xl p-4 sticky top-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1">
            <div className="bg-neutral-800 rounded-xl p-8">
              {activeTab === 'presets' && <PresetManagement />}
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'colors' && <ColorSettings />}
              {activeTab === 'fonts' && <FontSettings />}
              {activeTab === 'backgrounds' && <SectionBackgroundsManagement />}
              {activeTab === 'gradient' && <GradientSettings />}
              {activeTab === 'hero-image' && <HeroImageSettings />}
              {activeTab === 'doctors' && <DoctorsManagement />}
              {activeTab === 'pill-sections' && <PillSectionsManagement />}
              {activeTab === 'value-stacking' && <ValueStackingManagement />}
              {activeTab === 'results' && <ResultsManagement />}
              {activeTab === 'reviews' && <ReviewsManagement />}
              {activeTab === 'faq' && <FAQManagement />}
              {activeTab === 'final-cta' && <FinalCTAManagement />}
              {activeTab === 'footer-texts' && <FooterTextsManagement />}
              {activeTab === 'crm-users' && <CRMCredentialsManagement />}
              {activeTab === 'campaigns' && <CampaignManagement />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
