import { X, Check, Clock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface ServiceDetail {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  detailed_description: string;
  price_from: number;
  duration_minutes?: number;
  duration?: number;
  image_url: string;
  benefits?: string[];
  process_steps?: { title: string; description: string }[];
  faq?: { question: string; answer: string }[];
}

interface ServiceDetailModalProps {
  serviceId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onBookService: (serviceId: string) => void;
}

export default function ServiceDetailModal({
  serviceId,
  isOpen,
  onClose,
  onBookService,
}: ServiceDetailModalProps) {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'faq'>('overview');

  useEffect(() => {
    if (isOpen && serviceId) {
      fetchServiceDetails();
      document.body.style.overflow = 'hidden';
      setActiveTab('overview');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, serviceId]);

  const fetchServiceDetails = async () => {
    if (!serviceId) return;

    setLoading(true);
    try {
      const data = await api.getService(serviceId);
      setService({ ...data, id: data._id || data.id, duration: data.duration_minutes || data.duration });
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading || !service) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-12">
          <p className="text-neutral-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price);
  };

  const handleBookClick = () => {
    onBookService(service.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-neutral-900/80 hover:bg-neutral-900 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="relative h-72 md:h-96 overflow-hidden">
            <img
              src={service.image_url}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {service.title}
              </h2>
              <p className="text-lg text-white/90">
                {service.description}
              </p>
            </div>
          </div>

          <div className="sticky top-0 bg-white border-b border-neutral-200 z-10">
            <div className="flex gap-2 px-6 pt-4">
              {(['overview', 'process', 'faq'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {tab === 'overview' && 'Umumiy'}
                  {tab === 'process' && 'Jarayon'}
                  {tab === 'faq' && 'Savollar'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {service.detailed_description && (
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-4">Tavsif</h3>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                      {service.detailed_description}
                    </p>
                  </div>
                )}

                {service.benefits && service.benefits.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-6">Afzalliklar</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {service.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                        >
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-neutral-900 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-neutral-50 to-blue-50 rounded-2xl p-6 border border-neutral-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-neutral-600 mb-2">
                        <Clock className="w-5 h-5" />
                        <span>Davomiyligi</span>
                      </div>
                      <p className="text-2xl font-bold text-neutral-900">
                        ~{service.duration} daqiqa
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600 mb-2">Narxi</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatPrice(service.price_from)}+ UZS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'process' && service.process_steps && service.process_steps.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">Davolash jarayoni</h3>
                <div className="space-y-4">
                  {service.process_steps.map((step, index) => (
                    <div
                      key={index}
                      className="relative pl-12 pb-8 last:pb-0"
                    >
                      {index < service.process_steps.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-blue-200" />
                      )}
                      <div className="absolute left-0 top-0 w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="bg-neutral-50 hover:bg-neutral-100 rounded-2xl p-6 transition-colors">
                        <h4 className="text-xl font-bold text-neutral-900 mb-2">
                          {step.title}
                        </h4>
                        <p className="text-neutral-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && service.faq && service.faq.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">Tez-tez so'raladigan savollar</h3>
                {service.faq.map((item, index) => (
                  <div
                    key={index}
                    className="bg-neutral-50 hover:bg-neutral-100 rounded-2xl p-6 transition-colors"
                  >
                    <h4 className="text-lg font-bold text-neutral-900 mb-3 flex items-start gap-2">
                      <span className="text-blue-600">Q:</span>
                      {item.question}
                    </h4>
                    <p className="text-neutral-600 pl-5">
                      <span className="text-blue-600 font-bold mr-2">A:</span>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleBookClick}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
            >
              Qabulga yozilish
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 border-2 border-neutral-300 text-neutral-900 font-semibold rounded-full hover:bg-neutral-50 transition-all"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
