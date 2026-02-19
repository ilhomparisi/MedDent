const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiError {
  error: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({ 
          error: `HTTP error! status: ${response.status}` 
        }));
        throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Consultation Forms
  async submitConsultationForm(data: {
    full_name: string;
    phone: string;
    lives_in_tashkent?: string;
    last_dentist_visit?: string;
    current_problems?: string;
    previous_clinic_experience?: string;
    missing_teeth?: string;
    preferred_call_time?: string;
    source?: string;
    time_spent_seconds?: number;
  }) {
    return this.request<{ success: boolean; message: string; id: string }>('/consultation-forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getConsultationForms(params?: {
    page?: number;
    perPage?: number;
    search?: string;
    sourceFilter?: string;
    statusFilter?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const queryString = params ? new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    const endpoint = queryString ? `/consultation-forms?${queryString}` : '/consultation-forms';
    return this.request<{
      data: any[];
      pagination: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
      };
    }>(endpoint);
  }

  async getConsultationFormSources() {
    return this.request<{ sources: string[] }>('/consultation-forms/sources');
  }

  async updateConsultationForm(id: string, data: { lead_status?: string; notes?: string }) {
    return this.request<{ success: boolean; data: any }>(`/consultation-forms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getConsultationFormById(id: string) {
    return this.request<{ data: any }>(`/consultation-forms/${id}`);
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ 
      success: boolean; 
      token: string; 
      user: { id: string; email: string } 
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore errors on logout
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async getSession() {
    try {
      return await this.request<{ 
        success: boolean; 
        user: { id: string; email: string } 
      }>('/auth/session');
    } catch {
      this.clearToken();
      return null;
    }
  }

  // Settings
  async getAllSettings() {
    return this.request<{ settings: Record<string, any> }>('/settings');
  }

  async getSetting(key: string) {
    return this.request<{ key: string; value: any }>(`/settings/${key}`);
  }

  async upsertSetting(key: string, value: any) {
    return this.request<{ success: boolean }>(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ key, value }),
    });
  }

  async bulkUpdateSettings(settings: Record<string, any>) {
    return this.request<{ success: boolean }>('/settings/bulk', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  }

  // Doctors
  async getDoctors(activeOnly = false) {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await this.request<{ data: any[] }>(`/doctors${params}`);
    return response.data ?? response;
  }

  async getDoctor(id: string) {
    return this.request<{ data: any }>(`/doctors/${id}`);
  }

  async createDoctor(data: any) {
    return this.request<{ success: boolean; data: any }>('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDoctor(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDoctor(id: string) {
    return this.request<{ success: boolean }>(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async getReviews(params?: { approved_only?: boolean; is_result?: boolean }) {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const response = await this.request<{ data: any[] }>(`/reviews${queryString ? '?' + queryString : ''}`);
    return response.data ?? response;
  }

  async createReview(data: any) {
    return this.request<{ success: boolean; data: any }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReview(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReview(id: string) {
    return this.request<{ success: boolean }>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // FAQs
  async getFAQs(activeOnly = false) {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await this.request<{ data: any[] }>(`/faqs${params}`);
    return response.data ?? response;
  }

  async createFAQ(data: any) {
    return this.request<{ success: boolean; data: any }>('/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFAQ(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFAQ(id: string) {
    return this.request<{ success: boolean }>(`/faqs/${id}`, {
      method: 'DELETE',
    });
  }

  async updateFAQOrder(id: string, display_order: number) {
    return this.request<{ success: boolean }>(`/faqs/${id}/order`, {
      method: 'PATCH',
      body: JSON.stringify({ display_order }),
    });
  }

  // Pill Sections
  async getPillSections(activeOnly = false) {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await this.request<{ data: any[] }>(`/pill-sections${params}`);
    return response.data ?? response;
  }

  async createPillSection(data: any) {
    return this.request<{ success: boolean; data: any }>('/pill-sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePillSection(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/pill-sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePillSection(id: string) {
    return this.request<{ success: boolean }>(`/pill-sections/${id}`, {
      method: 'DELETE',
    });
  }

  // Value Stacking
  async getValueItems(activeOnly = false) {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await this.request<{ data: any[] }>(`/value-items${params}`);
    return response.data ?? response;
  }

  async createValueItem(data: any) {
    return this.request<{ success: boolean; data: any }>('/value-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateValueItem(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/value-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteValueItem(id: string) {
    return this.request<{ success: boolean }>(`/value-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Campaigns
  async getCampaigns() {
    return this.request<{ data: any[] }>('/campaigns');
  }

  async getCampaignByCode(code: string) {
    return this.request<{ data: any }>(`/campaigns/${code}`);
  }

  async createCampaign(data: any) {
    return this.request<{ success: boolean; data: any }>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string) {
    return this.request<{ success: boolean }>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async incrementCampaignClick(code: string) {
    return this.request<{ success: boolean }>('/campaigns/increment-click', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // CRM Users
  async getCRMUsers() {
    return this.request<{ data: any[] }>('/crm-users');
  }

  async createCRMUser(data: any) {
    return this.request<{ success: boolean; data: any }>('/crm-users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCRMUser(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/crm-users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCRMUser(id: string) {
    return this.request<{ success: boolean }>(`/crm-users/${id}`, {
      method: 'DELETE',
    });
  }

  // Presets
  async getPresets() {
    return this.request<{ data: any[] }>('/presets');
  }

  async getPreset(id: string) {
    return this.request<{ data: any }>(`/presets/${id}`);
  }

  async createPreset(name: string, description?: string) {
    return this.request<{ success: boolean; data: any }>('/presets', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async applyPreset(id: string) {
    return this.request<{ success: boolean }>(`/presets/${id}/apply`, {
      method: 'POST',
    });
  }

  async updatePreset(id: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/presets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePreset(id: string) {
    return this.request<{ success: boolean }>(`/presets/${id}`, {
      method: 'DELETE',
    });
  }

  // File Upload
  async uploadImage(file: File, type: string = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const url = `${this.baseURL}/upload/image`;
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async deleteImage(url: string) {
    return this.request<{ success: boolean }>('/upload/image', {
      method: 'DELETE',
      body: JSON.stringify({ url }),
    });
  }

  // Services
  async getServices(activeOnly = true) {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await this.request<{ data: any[] }>(`/services${params}`);
    return response.data;
  }

  async getService(id: string) {
    const response = await this.request<{ data: any }>(`/services/${id}`);
    return response.data;
  }

  async createService(service: any) {
    return this.request<{ success: boolean; data: any }>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }

  async updateService(id: string, service: any) {
    return this.request<{ success: boolean; data: any }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  }

  async deleteService(id: string) {
    return this.request<{ success: boolean }>(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Section Backgrounds
  async getSectionBackgrounds() {
    const response = await this.request<{ data: any[] }>('/section-backgrounds');
    return response.data;
  }

  async getSectionBackground(sectionName: string) {
    const response = await this.request<{ data: any }>(`/section-backgrounds/${sectionName}`);
    return response.data;
  }

  async updateSectionBackground(sectionName: string, data: any) {
    return this.request<{ success: boolean; data: any }>(`/section-backgrounds/${sectionName}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSectionBackground(sectionName: string) {
    return this.request<{ success: boolean }>(`/section-backgrounds/${sectionName}`, {
      method: 'DELETE',
    });
  }

  // Final CTA
  async getFinalCTA() {
    const response = await this.request<{ data: any }>('/final-cta');
    return response.data;
  }

  async updateFinalCTA(data: any) {
    return this.request<{ success: boolean; data: any }>('/final-cta', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Appointments
  async createAppointment(appointment: any) {
    return this.request<{ success: boolean; data: any }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
  }

  async getAppointments(status?: string) {
    const params = status ? `?status=${status}` : '';
    const response = await this.request<{ data: any[] }>(`/appointments${params}`);
    return response.data;
  }

  async updateAppointment(id: string, appointment: any) {
    return this.request<{ success: boolean; data: any }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
  }

  async deleteAppointment(id: string) {
    return this.request<{ success: boolean }>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // CRM Login
  async crmLogin(username: string, password: string) {
    return this.request<{ success: boolean; user?: { id: string; username: string }; error?: string }>('/crm-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // --- Aliases for consistent lowercase/camelCase naming used across components ---

  // FAQ aliases
  async getFaqs(activeOnly = false) { return this.getFAQs(activeOnly); }
  async createFaq(data: any) { return this.createFAQ(data); }
  async updateFaq(id: string, data: any) { return this.updateFAQ(id, data); }
  async deleteFaq(id: string) { return this.deleteFAQ(id); }
  async updateFaqOrder(id: string, display_order: number) { return this.updateFAQOrder(id, display_order); }

  // CRM user aliases
  async getCrmUsers() { return this.getCRMUsers(); }
  async createCrmUser(data: any) { return this.createCRMUser(data); }
  async updateCrmUser(id: string, data: any) { return this.updateCRMUser(id, data); }
  async deleteCrmUser(id: string) { return this.deleteCRMUser(id); }

  // Campaign link aliases (maps to campaign methods)
  async getCampaignLinks() { return this.getCampaigns(); }
  async createCampaignLink(data: any) { return this.createCampaign(data); }
  async updateCampaignLink(id: string, data: any) { return this.updateCampaign(id, data); }
  async deleteCampaignLink(id: string) { return this.deleteCampaign(id); }

  // Site settings aliases
  async getSiteSettings() { return this.getAllSettings(); }
  async getSiteSetting(key: string) { return this.getSetting(key); }
  async updateSiteSetting(key: string, value: any) { return this.upsertSetting(key, value); }

  // File upload aliases
  async uploadFile(file: File, type: string = 'general') { return this.uploadImage(file, type); }
  async deleteFile(url: string) { return this.deleteImage(url); }
}

export const api = new ApiClient(API_BASE_URL);
