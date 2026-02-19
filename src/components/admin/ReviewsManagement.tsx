import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Star, Trash2, Check, X, Search, Plus, Edit2, ArrowUp, ArrowDown } from 'lucide-react';

interface Review {
  _id?: string;
  id?: string;
  patient_name: string;
  patient_name_uz?: string;
  patient_name_ru?: string;
  review_text: string;
  review_text_uz?: string;
  review_text_ru?: string;
  rating: number;
  service_used?: string;
  service_used_uz?: string;
  service_used_ru?: string;
  image_url?: string | null;
  is_approved: boolean;
  is_featured?: boolean;
  is_active?: boolean;
  display_order?: number;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_name_uz: '',
    patient_name_ru: '',
    review_text: '',
    review_text_uz: '',
    review_text_ru: '',
    rating: 5,
    service_used: '',
    service_used_uz: '',
    service_used_ru: '',
    is_approved: true,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, filter, searchTerm]);

  const fetchReviews = async () => {
    try {
      const data = await api.getReviews();
      setReviews(data.map((r: any) => ({ ...r, id: r._id || r.id })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMessage('Sharhlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const moveReview = async (review: Review, direction: 'up' | 'down') => {
    try {
      const currentIndex = reviews.findIndex(r => r.id === review.id);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === reviews.length - 1)
      ) {
        return;
      }

      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const swapReview = reviews[swapIndex];

      // Swap display_order values
      await api.updateReview(review.id!, { display_order: swapReview.display_order });
      await api.updateReview(swapReview.id!, { display_order: review.display_order });

      await fetchReviews();
      setMessage(`Sharh ${direction === 'up' ? 'yuqoriga' : 'pastga'} ko'chirildi`);
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('Error moving review:', error);
      setMessage('Sharhni ko\'chirishda xatolik yuz berdi');
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    if (filter === 'approved') {
      filtered = filtered.filter(r => r.is_approved);
    } else if (filter === 'pending') {
      filtered = filtered.filter(r => !r.is_approved);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.service_used && r.service_used.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredReviews(filtered);
  };

  const toggleApproval = async (review: Review) => {
    try {
      await api.updateReview(review.id!, { is_approved: !review.is_approved });

      setMessage(review.is_approved ? 'Sharh rad etildi' : 'Sharh tasdiqlandi');
      fetchReviews();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling review approval:', error);
      setMessage('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`${review.patient_name}ning sharhini o'chirmoqchimisiz?`)) return;

    try {
      await api.deleteReview(review.id!);

      setMessage('Sharh muvaffaqiyatli o\'chirildi!');
      fetchReviews();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting review:', error);
      setMessage('O\'chirishda xatolik yuz berdi!');
    }
  };

  const openCreateModal = () => {
    setEditingReview(null);
    setFormData({
      patient_name: '',
      patient_name_uz: '',
      patient_name_ru: '',
      review_text: '',
      review_text_uz: '',
      review_text_ru: '',
      rating: 5,
      service_used: '',
      service_used_uz: '',
      service_used_ru: '',
      is_approved: true,
    });
    setActiveTab('uz');
    setShowModal(true);
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setFormData({
      patient_name: review.patient_name,
      patient_name_uz: (review as any).patient_name_uz || review.patient_name,
      patient_name_ru: (review as any).patient_name_ru || review.patient_name,
      review_text: review.review_text,
      review_text_uz: (review as any).review_text_uz || review.review_text,
      review_text_ru: (review as any).review_text_ru || review.review_text,
      rating: review.rating,
      service_used: review.service_used || '',
      service_used_uz: (review as any).service_used_uz || review.service_used || '',
      service_used_ru: (review as any).service_used_ru || review.service_used || '',
      is_approved: review.is_approved,
    });
    setActiveTab('uz');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const reviewData = {
        patient_name: formData.patient_name,
        patient_name_uz: formData.patient_name_uz,
        patient_name_ru: formData.patient_name_ru,
        review_text: formData.review_text,
        review_text_uz: formData.review_text_uz,
        review_text_ru: formData.review_text_ru,
        rating: formData.rating,
        service_used: formData.service_used || null,
        service_used_uz: formData.service_used_uz || null,
        service_used_ru: formData.service_used_ru || null,
        is_approved: formData.is_approved,
      };

      if (editingReview) {
        await api.updateReview(editingReview.id!, reviewData);
        setMessage('Sharh muvaffaqiyatli yangilandi!');
      } else {
        await api.createReview(reviewData);
        setMessage('Sharh muvaffaqiyatli qo\'shildi!');
      }

      setShowModal(false);
      fetchReviews();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving review:', error);
      setMessage('Xatolik yuz berdi!');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-500'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-white">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Sharhlar</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-neutral-400">
            Jami: {reviews.length} ({reviews.filter(r => r.is_approved).length} tasdiqlangan)
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Yangi sharh
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('muvaffaqiyatli') || message.includes('tasdiqlandi')
              ? 'bg-green-600/20 text-green-400 border border-green-600'
              : 'bg-red-600/20 text-red-400 border border-red-600'
          }`}
        >
          {message}
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            Tasdiqlangan
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
            }`}
          >
            Kutilmoqda
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-neutral-700 rounded-lg p-8 text-center">
            <Star className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
            <p className="text-neutral-400">
              {filter === 'all' ? 'Hali sharhlar yo\'q' :
               filter === 'approved' ? 'Tasdiqlangan sharhlar yo\'q' :
               'Tasdiqlanishi kerak bo\'lgan sharhlar yo\'q'}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-neutral-700 rounded-lg p-4 border-l-4 ${
                review.is_approved ? 'border-green-600' : 'border-yellow-600'
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{review.patient_name}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveReview(review, 'up')}
                          disabled={reviews.findIndex(r => r.id === review.id) === 0}
                          className="p-1 bg-neutral-600 text-white rounded hover:bg-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Yuqoriga"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveReview(review, 'down')}
                          disabled={reviews.findIndex(r => r.id === review.id) === reviews.length - 1}
                          className="p-1 bg-neutral-600 text-white rounded hover:bg-neutral-500 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Pastga"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => openEditModal(review)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleApproval(review)}
                        className={`p-2 rounded-lg ${
                          review.is_approved
                            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        title={review.is_approved ? 'Rad etish' : 'Tasdiqlash'}
                      >
                        {review.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-neutral-300 mb-2">{review.review_text}</p>

                  {review.service_used && (
                    <p className="text-sm text-neutral-400">
                      Xizmat: {review.service_used}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                    <span>{new Date(review.created_at).toLocaleDateString('uz-UZ')}</span>
                    <span className={`px-2 py-1 rounded ${
                      review.is_approved
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {review.is_approved ? 'Tasdiqlangan' : 'Kutilmoqda'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingReview ? 'Sharhni tahrirlash' : 'Yangi sharh qo\'shish'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 mb-4 border-b border-neutral-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('uz')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'uz'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-neutral-400'
                  }`}
                >
                  O'zbek tili
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ru')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'ru'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-neutral-400'
                  }`}
                >
                  Русский язык
                </button>
              </div>

              {activeTab === 'uz' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Bemor ismi (O'zbek) *
                    </label>
                    <input
                      type="text"
                      value={formData.patient_name_uz}
                      onChange={(e) => setFormData({ ...formData, patient_name_uz: e.target.value, patient_name: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Sharh matni (O'zbek) *
                    </label>
                    <textarea
                      value={formData.review_text_uz}
                      onChange={(e) => setFormData({ ...formData, review_text_uz: e.target.value, review_text: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Xizmat (O'zbek)
                    </label>
                    <input
                      type="text"
                      value={formData.service_used_uz}
                      onChange={(e) => setFormData({ ...formData, service_used_uz: e.target.value, service_used: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Masalan: Tishlarni oqartirish"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Имя пациента (Русский) *
                    </label>
                    <input
                      type="text"
                      value={formData.patient_name_ru}
                      onChange={(e) => setFormData({ ...formData, patient_name_ru: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Текст отзыва (Русский) *
                    </label>
                    <textarea
                      value={formData.review_text_ru}
                      onChange={(e) => setFormData({ ...formData, review_text_ru: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Услуга (Русский)
                    </label>
                    <input
                      type="text"
                      value={formData.service_used_ru}
                      onChange={(e) => setFormData({ ...formData, service_used_ru: e.target.value })}
                      className="w-full px-4 py-2 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-blue-500 focus:outline-none"
                      placeholder="Например: Отбеливание зубов"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-neutral-600">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Reyting *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-neutral-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_approved"
                  checked={formData.is_approved}
                  onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_approved" className="text-sm text-neutral-300">
                  Tasdiqlangan
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingReview ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
