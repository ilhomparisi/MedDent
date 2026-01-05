/*
  # Admin Panel and Site Settings Schema

  ## Overview
  This migration adds comprehensive admin functionality and site customization tables.

  ## Tables Created

  ### 1. admin_users
  Stores admin login credentials
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `password_hash` (text)
  - `created_at` (timestamptz)

  ### 2. site_settings
  Stores all customizable site settings including colors, texts, images
  - `id` (uuid, primary key)
  - `key` (text, unique) - Setting identifier
  - `value` (jsonb) - Setting value (flexible JSON structure)
  - `category` (text) - Setting category (colors, texts, images, etc.)
  - `updated_at` (timestamptz)

  ### 3. section_backgrounds
  Stores background images for different sections
  - `id` (uuid, primary key)
  - `section_name` (text, unique)
  - `image_url` (text)
  - `opacity` (decimal)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Admin tables require authentication
  - Site settings readable by all, writable by authenticated only
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create section_backgrounds table
CREATE TABLE IF NOT EXISTS section_backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name text UNIQUE NOT NULL,
  image_url text,
  opacity decimal DEFAULT 0.5,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_backgrounds ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Only authenticated users can view admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can modify site_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for section_backgrounds
CREATE POLICY "Anyone can view section_backgrounds"
  ON section_backgrounds FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can modify section_backgrounds"
  ON section_backgrounds FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add image_url column to services table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services ADD COLUMN image_url text;
  END IF;
END $$;

-- Insert default admin user (email: admin@meddent.uz, password: admin123)
-- Password hash is bcrypt hash of 'admin123'
INSERT INTO admin_users (email, password_hash) VALUES
('admin@meddent.uz', '$2a$10$rZ8qVnQ0xKZHqV8YxYWZieLzG7pX5h5uHv8KvXxH0YqZJ5KwFJK5W')
ON CONFLICT (email) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value, category) VALUES
('site_name', '"MedDent"', 'branding'),
('site_tagline', '"Oilaviy Stomatologiya"', 'branding'),
('primary_color', '"#0066CC"', 'colors'),
('secondary_color', '"#CC0000"', 'colors'),
('accent_color', '"#0099CC"', 'colors'),
('hero_title', '"Bepul Professional Tozalash"', 'texts'),
('hero_subtitle', '"700,000 UZS qiymatida. Yuqori sifatli stomatologik xizmatlardan bahramand bo''ling."', 'texts'),
('hero_cta_primary', '"Bepul Tozalashni Oling"', 'texts'),
('hero_cta_secondary', '"Batafsil"', 'texts'),
('services_title', '"Bizning Xizmatlarimiz"', 'texts'),
('services_subtitle', '"Zamonaviy texnologiya va usullar bilan sizning ehtiyojlaringizga moslashtirilgan to''liq stomatologik xizmatlar."', 'texts'),
('doctors_title', '"Mutaxassis Shifokorlarimiz"', 'texts'),
('doctors_subtitle', '"Sizning stomatologik sog''ligingiz va chiroyli tabassumingizga bag''ishlangan jahon darajasidagi mutaxassislar."', 'texts'),
('reviews_title', '"Bemorlarimiz Fikri"', 'texts'),
('reviews_subtitle', '"Bizga ishongan bemorlarning haqiqiy tajribalari."', 'texts'),
('contact_phone', '"+998 90 123 45 67"', 'contact'),
('contact_email', '"info@meddent.uz"', 'contact'),
('contact_address', '"123 Amir Temur ko''chasi, Toshkent, O''zbekiston"', 'contact'),
('working_hours_weekday', '"Dushanba - Juma: 9:00 - 20:00"', 'contact'),
('working_hours_saturday', '"Shanba: 10:00 - 18:00"', 'contact'),
('working_hours_sunday', '"Yakshanba: Yopiq"', 'contact'),
('social_facebook', '"https://facebook.com"', 'social'),
('social_instagram', '"https://instagram.com"', 'social'),
('social_telegram', '"https://t.me"', 'social')
ON CONFLICT (key) DO NOTHING;

-- Insert default section backgrounds
INSERT INTO section_backgrounds (section_name, image_url, opacity) VALUES
('hero', 'https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg', 0.3),
('features', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg', 0.2),
('services', 'https://images.pexels.com/photos/305565/pexels-photo-305565.jpeg', 0.1),
('doctors', 'https://images.pexels.com/photos/4269491/pexels-photo-4269491.jpeg', 0.2),
('reviews', 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg', 0.1)
ON CONFLICT (section_name) DO NOTHING;