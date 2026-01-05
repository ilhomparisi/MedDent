import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FAQItem {
  id: string;
  question: string;
  question_uz?: string;
  question_ru?: string;
  answer: string;
  answer_uz?: string;
  answer_ru?: string;
  is_active: boolean;
  display_order: number;
}

export default function FAQManagement() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'uz' | 'ru'>('uz');
  const [editForm, setEditForm] = useState({
    question: '',
    question_uz: '',
    question_ru: '',
    answer: '',
    answer_uz: '',
    answer_ru: '',
    is_active: true,
  });

  useEffect(() => {
    fetchFAQItems();
  }, []);

  const fetchFAQItems = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqItems(data || []);
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId('new');
    setEditForm({
      question: '',
      question_uz: '',
      question_ru: '',
      answer: '',
      answer_uz: '',
      answer_ru: '',
      is_active: true,
    });
    setActiveTab('uz');
  };

  const handleEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setEditForm({
      question: item.question,
      question_uz: item.question_uz || item.question,
      question_ru: item.question_ru || item.question,
      answer: item.answer,
      answer_uz: item.answer_uz || item.answer,
      answer_ru: item.answer_ru || item.answer,
      is_active: item.is_active,
    });
    setActiveTab('uz');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId === 'new') {
        const maxOrder = faqItems.reduce((max, item) => Math.max(max, item.display_order), 0);
        const { error } = await supabase
          .from('faq_items')
          .insert([{
            ...editForm,
            display_order: maxOrder + 1,
          }]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faq_items')
          .update(editForm)
          .eq('id', editingId);

        if (error) throw error;
      }

      setEditingId(null);
      setEditForm({ question: '', answer: '', is_active: true });
      await fetchFAQItems();
    } catch (error) {
      console.error('Error saving FAQ item:', error);
      alert('Failed to save FAQ item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;

    try {
      const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchFAQItems();
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      alert('Failed to delete FAQ item');
    }
  };

  const handleMoveUp = async (item: FAQItem) => {
    const currentIndex = faqItems.findIndex(i => i.id === item.id);
    if (currentIndex === 0) return;

    const prevItem = faqItems[currentIndex - 1];

    try {
      await supabase
        .from('faq_items')
        .update({ display_order: prevItem.display_order })
        .eq('id', item.id);

      await supabase
        .from('faq_items')
        .update({ display_order: item.display_order })
        .eq('id', prevItem.id);

      await fetchFAQItems();
    } catch (error) {
      console.error('Error reordering FAQ items:', error);
    }
  };

  const handleMoveDown = async (item: FAQItem) => {
    const currentIndex = faqItems.findIndex(i => i.id === item.id);
    if (currentIndex === faqItems.length - 1) return;

    const nextItem = faqItems[currentIndex + 1];

    try {
      await supabase
        .from('faq_items')
        .update({ display_order: nextItem.display_order })
        .eq('id', item.id);

      await supabase
        .from('faq_items')
        .update({ display_order: item.display_order })
        .eq('id', nextItem.id);

      await fetchFAQItems();
    } catch (error) {
      console.error('Error reordering FAQ items:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading FAQ items...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">FAQ Management</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add FAQ Item
        </button>
      </div>

      {editingId && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId === 'new' ? 'Add New FAQ Item' : 'Edit FAQ Item'}
          </h3>

          <div className="space-y-4">
            <div className="flex gap-2 mb-4 border-b border-gray-300">
              <button
                type="button"
                onClick={() => setActiveTab('uz')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'uz'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                O'zbek tili
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ru')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'ru'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                Русский язык
              </button>
            </div>

            {activeTab === 'uz' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Savol (O'zbek)</label>
                  <input
                    type="text"
                    value={editForm.question_uz}
                    onChange={(e) => setEditForm({ ...editForm, question_uz: e.target.value, question: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Savolni kiriting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Javob (O'zbek)</label>
                  <textarea
                    value={editForm.answer_uz}
                    onChange={(e) => setEditForm({ ...editForm, answer_uz: e.target.value, answer: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                    placeholder="Javobni kiriting"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Вопрос (Русский)</label>
                  <input
                    type="text"
                    value={editForm.question_ru}
                    onChange={(e) => setEditForm({ ...editForm, question_ru: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Введите вопрос"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ответ (Русский)</label>
                  <textarea
                    value={editForm.answer_ru}
                    onChange={(e) => setEditForm({ ...editForm, answer_ru: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                    placeholder="Введите ответ"
                  />
                </div>
              </>
            )}

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !editForm.question_uz || !editForm.answer_uz || !editForm.question_ru || !editForm.answer_ru}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saqlanyapti...' : 'Saqlash'}
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditForm({ question: '', question_uz: '', question_ru: '', answer: '', answer_uz: '', answer_ru: '', is_active: true });
                  setActiveTab('uz');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={item.id}
            className={`bg-white border-2 rounded-lg p-6 ${
              item.is_active ? 'border-gray-200' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">{item.question}</h4>
                <p className="text-gray-600 mb-2">{item.answer}</p>
                <span className={`text-sm px-2 py-1 rounded ${
                  item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleMoveUp(item)}
                  disabled={index === 0}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleMoveDown(item)}
                  disabled={index === faqItems.length - 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 hover:bg-blue-100 text-blue-600 rounded"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {faqItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No FAQ items yet. Click "Add FAQ Item" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
