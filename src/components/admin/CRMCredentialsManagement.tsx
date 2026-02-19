import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Edit2, Trash2, Eye, EyeOff, Check, X, User } from 'lucide-react';

interface CRMUser {
  _id?: string;
  id?: string;
  username: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export default function CRMCredentialsManagement() {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getCrmUsers();
      setUsers(data.map((u: any) => ({ ...u, id: u._id || u.id })));
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!formData.username.trim()) {
      setError('Foydalanuvchi nomi kiritilishi shart');
      setSaving(false);
      return;
    }

    if (!editingId && !formData.password.trim()) {
      setError('Parol kiritilishi shart');
      setSaving(false);
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        const updateData: any = { username: formData.username };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await api.updateCrmUser(editingId, updateData);
      } else {
        await api.createCrmUser({
          username: formData.username,
          password: formData.password,
        });
      }

      setFormData({ username: '', password: '' });
      setShowForm(false);
      setEditingId(null);
      loadUsers();
    } catch (error: any) {
      setError(error.message?.includes('duplicate') || error.message?.includes('already') 
        ? 'Bu foydalanuvchi nomi allaqachon mavjud' 
        : error.message || 'Xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateCrmUser(id, { is_active: !currentStatus });
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haqiqatan ham bu foydalanuvchini o\'chirmoqchimisiz?')) return;
    try {
      await api.deleteCrmUser(id);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-white text-center py-8">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">MEDDENT CRM Foydalanuvchilari</h2>
          <p className="text-neutral-400 mt-1">MEDDENT CRM tizimiga kirish uchun foydalanuvchilarni boshqaring</p>
        </div>
        <button
          onClick={() => {
            setFormData({ username: '', password: '' });
            setEditingId(null);
            setShowForm(true);
            setError('');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yangi foydalanuvchi
        </button>
      </div>

      {showForm && (
        <div className="bg-neutral-700 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {editingId ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi qo\'shish'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-neutral-300 text-sm mb-2">Foydalanuvchi nomi</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-600 border border-neutral-500 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="masalan: manager"
              />
            </div>
            <div>
              <label className="block text-neutral-300 text-sm mb-2">
                {editingId ? 'Yangi parol (bo\'sh qoldiring agar o\'zgartirmoqchi bo\'lmasangiz)' : 'Parol'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-600 border border-neutral-500 rounded-lg text-white focus:outline-none focus:border-blue-500 pr-12"
                  placeholder="Kamida 6 ta belgi"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded-lg">{error}</div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : 'Qo\'shish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setError('');
                }}
                className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-500 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <div className="text-center py-12 bg-neutral-700/50 rounded-xl">
          <User className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <p className="text-neutral-400">Hozircha CRM foydalanuvchilari yo'q</p>
          <p className="text-neutral-500 text-sm mt-1">Yangi foydalanuvchi qo'shing</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Foydalanuvchi</th>
                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Holat</th>
                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Oxirgi kirish</th>
                <th className="text-left py-3 px-4 text-neutral-400 font-medium">Yaratilgan</th>
                <th className="text-right py-3 px-4 text-neutral-400 font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-neutral-700/50 hover:bg-neutral-700/30">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        user.is_active
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {user.is_active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {user.is_active ? 'Faol' : 'Nofaol'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-neutral-400">{formatDate(user.last_login)}</td>
                  <td className="py-4 px-4 text-neutral-400">{formatDate(user.created_at)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-600 rounded-lg transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 p-4 bg-neutral-700/50 rounded-lg">
        <p className="text-neutral-400 text-sm">
          <strong className="text-white">CRM kirish manzili:</strong>{' '}
          <code className="bg-neutral-600 px-2 py-1 rounded text-blue-400">/crm/login</code>
        </p>
      </div>
    </div>
  );
}
