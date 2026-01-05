import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Doctor {
  id: string;
  name: string;
  name_uz?: string;
  name_ru?: string;
  specialty: string;
  specialty_uz?: string;
  specialty_ru?: string;
  image_url: string | null;
  bio: string | null;
  bio_uz?: string;
  bio_ru?: string;
  years_experience: number;
  education: string | null;
  education_uz?: string;
  education_ru?: string;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price_from: number;
  icon_name: string;
  duration?: number;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
  created_at: string;
  detailed_description?: string;
  benefits?: string[];
  process_steps?: Array<{title: string; description: string}>;
  faq?: Array<{question: string; answer: string}>;
}

export interface Review {
  id: string;
  patient_name: string;
  rating: number;
  review_text: string;
  service_used: string | null;
  image_url: string | null;
  is_approved: boolean;
  display_order: number;
  created_at: string;
}

export interface Appointment {
  patient_name: string;
  email: string;
  phone: string;
  service_id?: string;
  doctor_id?: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  booking_type: 'quick' | 'scheduled';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  value: number;
  expiry_type: string;
  is_active: boolean;
  created_at: string;
}
