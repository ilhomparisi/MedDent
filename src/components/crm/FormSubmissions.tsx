import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Search, Download, ChevronLeft, ChevronRight, Filter, X, Calendar, FileText, Check, Loader2, FileSpreadsheet, Clock } from 'lucide-react';

interface Submission {
  _id?: string;
  id?: string;
  full_name: string;
  phone: string;
  lives_in_tashkent: string;
  last_dentist_visit: string;
  current_problems: string;
  previous_clinic_experience: string;
  missing_teeth: string;
  preferred_call_time: string;
  source: string;
  lead_status: string;
  notes: string;
  created_at: string;
  time_spent_seconds: number | null;
}

const LEAD_STATUSES = [
  { value: 'Yangi', label: 'Yangi', color: 'bg-blue-500' },
  { value: 'Qo\'ng\'iroq qilindi', label: 'Qo\'ng\'iroq qilindi', color: 'bg-amber-500' },
  { value: 'Kelishildi', label: 'Kelishildi', color: 'bg-emerald-500' },
  { value: 'Rad etildi', label: 'Rad etildi', color: 'bg-red-500' },
  { value: 'Kutmoqda', label: 'Kutmoqda', color: 'bg-slate-500' },
];

export default function FormSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  useEffect(() => {
    loadSources();
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [page, perPage, search, sourceFilter, statusFilter, dateFrom, dateTo]);

  const loadSources = async () => {
    try {
      const response = await api.getConsultationFormSources();
      if (response.sources) {
        setSources(response.sources.sort());
      }
    } catch (error) {
      console.error('Error loading sources:', error);
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const response = await api.getConsultationForms({
        page,
        perPage,
        search: search || undefined,
        sourceFilter: sourceFilter || undefined,
        statusFilter: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });

      // Convert MongoDB _id to id for compatibility
      const formattedData = response.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));

      setSubmissions(formattedData);
      setTotalCount(response.pagination.totalCount);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.updateConsultationForm(id, { lead_status: newStatus });
      setSubmissions(prev =>
        prev.map(s => (s.id === id || s._id === id) ? { ...s, lead_status: newStatus } : s)
      );
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateNotes = async (id: string, newNotes: string) => {
    setUpdatingId(id);
    try {
      await api.updateConsultationForm(id, { notes: newNotes });
      setSubmissions(prev =>
        prev.map(s => (s.id === id || s._id === id) ? { ...s, notes: newNotes } : s)
      );
    } catch (error) {
      console.error('Error updating notes:', error);
    } finally {
      setUpdatingId(null);
      setEditingNotesId(null);
    }
  };

  const startEditingNotes = (submission: Submission) => {
    setEditingNotesId(submission.id);
    setTempNotes(submission.notes || '');
  };

  const cancelEditingNotes = () => {
    setEditingNotesId(null);
    setTempNotes('');
  };

  const getStatusColor = (status: string) => {
    const statusObj = LEAD_STATUSES.find(s => s.value === status);
    return statusObj?.color || 'bg-slate-500';
  };

  const exportToCSV = async () => {
    try {
      // Fetch all data for export (use large perPage)
      const response = await api.getConsultationForms({
        page: 1,
        perPage: 10000, // Large number to get all records
        search: search || undefined,
        sourceFilter: sourceFilter || undefined,
        statusFilter: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });

      const data = response.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));

      if (!data || data.length === 0) return;

    const headers = ['Sana', 'Ism', 'Telefon', 'Holat', 'Izohlar', 'Vaqt (soniya)', 'Toshkentda yashaydi', 'Oxirgi tashrif', 'Muammolar', 'Oldingi klinika tajribasi', 'Yo\'q tishlar', 'Qo\'ng\'iroq vaqti', 'Manba'];
    const rows = data.map(s => [
      new Date(s.created_at).toLocaleString('uz-UZ'),
      s.full_name,
      s.phone,
      s.lead_status || 'Yangi',
      s.notes || '',
      s.time_spent_seconds !== null ? s.time_spent_seconds : '',
      s.lives_in_tashkent || '',
      s.last_dentist_visit || '',
      s.current_problems || '',
      s.previous_clinic_experience || '',
      s.missing_teeth || '',
      s.preferred_call_time || '',
      s.source || 'Direct Visit'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `arizalar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToExcel = async () => {
    try {
      // Fetch all data for export (use large perPage)
      const response = await api.getConsultationForms({
        page: 1,
        perPage: 10000, // Large number to get all records
        search: search || undefined,
        sourceFilter: sourceFilter || undefined,
        statusFilter: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });

      const data = response.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));

      if (!data || data.length === 0) return;

    const headers = ['Sana', 'Ism', 'Telefon', 'Holat', 'Izohlar', 'Vaqt (soniya)', 'Toshkentda yashaydi', 'Oxirgi tashrif', 'Muammolar', 'Oldingi klinika tajribasi', 'Yo\'q tishlar', 'Qo\'ng\'iroq vaqti', 'Manba'];
    const rows = data.map(s => [
      new Date(s.created_at).toLocaleString('uz-UZ'),
      s.full_name || '',
      s.phone || '',
      s.lead_status || 'Yangi',
      s.notes || '',
      s.time_spent_seconds !== null ? String(s.time_spent_seconds) : '',
      s.lives_in_tashkent || '',
      s.last_dentist_visit || '',
      s.current_problems || '',
      s.previous_clinic_experience || '',
      s.missing_teeth || '',
      s.preferred_call_time || '',
      s.source || 'Direct Visit'
    ]);

    const escapeXml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    let xmlRows = '';
    xmlRows += '<Row ss:StyleID="Header">';
    headers.forEach(h => {
      xmlRows += `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`;
    });
    xmlRows += '</Row>';

    rows.forEach(row => {
      xmlRows += '<Row>';
      row.forEach(cell => {
        xmlRows += `<Cell><Data ss:Type="String">${escapeXml(String(cell))}</Data></Cell>`;
      });
      xmlRows += '</Row>';
    });

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#1e293b" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF" ss:Bold="1"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Arizalar">
    <Table>
      ${xmlRows}
    </Table>
  </Worksheet>
</Workbook>`;

      const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `arizalar_${new Date().toISOString().split('T')[0]}.xls`;
      link.click();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Eksport qilishda xatolik yuz berdi');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const formatTimeSpent = (seconds: number | null): string => {
    if (seconds === null || seconds === undefined) return '-';
    if (seconds < 60) return `${seconds} son`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
      return remainingSeconds > 0 ? `${minutes} daq ${remainingSeconds} son` : `${minutes} daq`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} soat ${remainingMinutes} daq`;
  };

  const totalPages = Math.ceil(totalCount / perPage);
  const hasFilters = search || sourceFilter || statusFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch('');
    setSourceFilter('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Ism yoki telefon bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sourceFilter}
              onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Barcha manbalar</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Barcha holatlar</option>
            {LEAD_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Tozalash
            </button>
          )}

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Yuklanmoqda...</div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Arizalar topilmadi</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/50">
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Sana</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Ism</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Telefon</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Holat</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Izohlar</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Muammolar</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Vaqt
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-slate-300 font-medium">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <>
                      <tr
                        key={submission.id}
                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                      >
                        <td
                          className="py-3 px-4 text-slate-400 text-sm cursor-pointer"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                        >
                          {formatDate(submission.created_at)}
                        </td>
                        <td
                          className="py-3 px-4 text-white font-medium cursor-pointer"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                        >
                          {submission.full_name}
                        </td>
                        <td
                          className="py-3 px-4 text-slate-300 cursor-pointer"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                        >
                          {submission.phone}
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="relative">
                            {updatingId === submission.id ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                              </div>
                            ) : (
                              <select
                                value={submission.lead_status || 'Yangi'}
                                onChange={(e) => updateLeadStatus(submission.id, e.target.value)}
                                className={`px-2 py-1 text-xs rounded-full text-white border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${getStatusColor(submission.lead_status || 'Yangi')}`}
                              >
                                {LEAD_STATUSES.map(status => (
                                  <option key={status.value} value={status.value} className="bg-slate-800 text-white">
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-[200px]" onClick={(e) => e.stopPropagation()}>
                          {editingNotesId === submission.id ? (
                            <div className="flex items-center gap-2">
                              <textarea
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                                rows={2}
                                autoFocus
                              />
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => updateNotes(submission.id, tempNotes)}
                                  disabled={updatingId === submission.id}
                                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={cancelEditingNotes}
                                  className="p-1 bg-slate-600 text-white rounded hover:bg-slate-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => startEditingNotes(submission)}
                              className="text-slate-300 text-sm cursor-pointer hover:bg-slate-700/50 rounded px-2 py-1 min-h-[28px] truncate"
                              title={submission.notes || 'Izoh qo\'shish uchun bosing'}
                            >
                              {submission.notes || <span className="text-slate-500 italic">Izoh qo'shish...</span>}
                            </div>
                          )}
                        </td>
                        <td
                          className="py-3 px-4 text-slate-300 max-w-[150px] truncate cursor-pointer"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                        >
                          {submission.current_problems || '-'}
                        </td>
                        <td
                          className="py-3 px-4 text-slate-400 text-sm cursor-pointer"
                          onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                        >
                          {formatTimeSpent(submission.time_spent_seconds)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${getSourceColor(submission.source || 'Direct Visit')}`}>
                            {submission.source || 'Direct Visit'}
                          </span>
                        </td>
                      </tr>
                      {expandedId === submission.id && (
                        <tr key={`${submission.id}-details`} className="bg-slate-700/20">
                          <td colSpan={8} className="py-4 px-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-slate-500">Toshkentda yashaydi</p>
                                <p className="text-slate-300">{submission.lives_in_tashkent || '-'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Oxirgi stomatolog tashrifi</p>
                                <p className="text-slate-300">{submission.last_dentist_visit || '-'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Oldingi klinika tajribasi</p>
                                <p className="text-slate-300">{submission.previous_clinic_experience || '-'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Yo'qolgan tishlar</p>
                                <p className="text-slate-300">{submission.missing_teeth || '-'}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Qo'ng'iroq vaqti</p>
                                <p className="text-slate-300">{submission.preferred_call_time || '-'}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-slate-500">Hozirgi muammolar</p>
                                <p className="text-slate-300">{submission.current_problems || '-'}</p>
                              </div>
                              {submission.notes && (
                                <div className="md:col-span-4">
                                  <p className="text-slate-500">Izohlar</p>
                                  <p className="text-slate-300 whitespace-pre-wrap">{submission.notes}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-slate-700">
              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">
                  Jami: {totalCount} ta ariza
                </span>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                  className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-slate-400 text-sm">ta</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-300 text-sm">
                  {page} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
