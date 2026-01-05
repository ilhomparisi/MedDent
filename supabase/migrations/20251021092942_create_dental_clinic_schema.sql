/*
  # Dental Clinic Database Schema

  ## Overview
  This migration creates the complete database schema for a premium dental clinic landing page.
  It includes tables for doctors, services, reviews, appointments, and promotions.

  ## Tables Created

  ### 1. doctors
  Stores information about dental clinic doctors and specialists
  - `id` (uuid, primary key) - Unique identifier for each doctor
  - `name` (text) - Full name of the doctor
  - `specialty` (text) - Medical specialty (e.g., "Orthodontist", "Cosmetic Dentist")
  - `image_url` (text) - URL to doctor's profile image
  - `bio` (text) - Brief biography and qualifications
  - `years_experience` (integer) - Years of professional experience
  - `education` (text) - Educational background and degrees
  - `is_active` (boolean) - Whether doctor is currently accepting patients
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. services
  Stores dental services offered by the clinic
  - `id` (uuid, primary key) - Unique identifier for each service
  - `title` (text) - Service name (e.g., "Teeth Whitening")
  - `description` (text) - Detailed service description
  - `price_from` (integer) - Starting price in UZS
  - `icon_name` (text) - Lucide React icon name for UI display
  - `duration` (integer) - Typical duration in minutes
  - `is_active` (boolean) - Whether service is currently offered
  - `display_order` (integer) - Order for displaying on website
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. reviews
  Stores patient testimonials and reviews
  - `id` (uuid, primary key) - Unique identifier for each review
  - `patient_name` (text) - Name of the patient (can be pseudonym)
  - `rating` (integer) - Rating from 1-5 stars
  - `review_text` (text) - Detailed review content
  - `service_used` (text) - Service the patient received
  - `is_approved` (boolean) - Moderation status
  - `created_at` (timestamptz) - Review submission date

  ### 4. appointments
  Stores appointment bookings and consultation requests
  - `id` (uuid, primary key) - Unique identifier for each appointment
  - `patient_name` (text) - Patient's full name
  - `email` (text) - Patient's email address
  - `phone` (text) - Patient's phone number
  - `service_id` (uuid, foreign key) - Requested service
  - `doctor_id` (uuid, foreign key, optional) - Preferred doctor
  - `preferred_date` (date) - Requested appointment date
  - `preferred_time` (time) - Requested appointment time
  - `message` (text, optional) - Additional notes or concerns
  - `booking_type` (text) - "quick" or "scheduled"
  - `status` (text) - "pending", "confirmed", "completed", "cancelled"
  - `created_at` (timestamptz) - Booking timestamp

  ### 5. promotions
  Stores active promotional offers
  - `id` (uuid, primary key) - Unique identifier for each promotion
  - `title` (text) - Promotion headline
  - `description` (text) - Detailed promotion description
  - `value` (integer) - Value in UZS
  - `expiry_type` (text) - "24hours" or "fixed_date"
  - `is_active` (boolean) - Whether promotion is currently active
  - `created_at` (timestamptz) - Promotion creation date

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Public read access for doctors, services, reviews, and active promotions
  - Restricted write access - only authenticated users can modify data
  - Appointments table allows public inserts but restricted reads
*/

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  image_url text,
  bio text,
  years_experience integer DEFAULT 0,
  education text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price_from integer NOT NULL,
  icon_name text NOT NULL,
  duration integer DEFAULT 30,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  service_used text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_id uuid REFERENCES services(id),
  doctor_id uuid REFERENCES doctors(id),
  preferred_date date,
  preferred_time time,
  message text,
  booking_type text NOT NULL DEFAULT 'quick' CHECK (booking_type IN ('quick', 'scheduled')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  value integer NOT NULL,
  expiry_type text NOT NULL DEFAULT '24hours' CHECK (expiry_type IN ('24hours', 'fixed_date')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors table
CREATE POLICY "Anyone can view active doctors"
  ON doctors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only authenticated users can insert doctors"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update doctors"
  ON doctors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for services table
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Only authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for appointments table
CREATE POLICY "Anyone can insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for promotions table
CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only authenticated users can insert promotions"
  ON promotions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update promotions"
  ON promotions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_preferred_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON promotions(is_active);