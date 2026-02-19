// This file provides type definitions and interfaces for migrated components
// Exported from api.ts for consistency

export interface Doctor {
  _id?: string;
  id?: string;
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

export interface Review {
  _id?: string;
  id?: string;
  patient_name: string;
  rating: number;
  review_text: string;
  service_used: string | null;
  image_url: string | null;
  is_approved: boolean;
  is_result?: boolean;
  display_order: number;
  created_at: string;
}

export interface FAQ {
  _id?: string;
  id?: string;
  question: string;
  question_uz?: string;
  question_ru?: string;
  answer: string;
  answer_uz?: string;
  answer_ru?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}
