/*
  # Comprehensive Admin Features

  1. New Tables
    - `ui_texts` - Store all editable text content
    - `contact_buttons` - Floating contact button configuration
    
  2. Updates to existing tables
    - Add opacity controls for all sections
    - Add gradient support for colors
    - Add offer hours configuration
    - Add About Us section support

  3. New Settings Keys
    - All footer texts
    - All section headers
    - Emergency contact text
    - Offer countdown hours
    - Contact button visibility
*/

-- Create UI texts table for comprehensive text management
CREATE TABLE IF NOT EXISTS ui_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE ui_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read UI texts"
  ON ui_texts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage UI texts"
  ON ui_texts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create contact buttons configuration table
CREATE TABLE IF NOT EXISTS contact_buttons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  button_type text NOT NULL,
  enabled boolean DEFAULT true,
  label text NOT NULL,
  value text NOT NULL,
  icon text NOT NULL,
  display_order int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_buttons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read contact buttons"
  ON contact_buttons FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage contact buttons"
  ON contact_buttons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default contact buttons
INSERT INTO contact_buttons (button_type, enabled, label, value, icon, display_order)
VALUES 
  ('telegram', true, 'Telegram', 'https://t.me/yourusername', 'send', 1),
  ('phone', true, 'Qo''ng''iroq qilish', '+998901234567', 'phone', 2)
ON CONFLICT DO NOTHING;

-- Insert default UI texts
INSERT INTO ui_texts (section, key, value, description) VALUES
  -- Hero section
  ('hero', 'badge_text', 'Cheklangan Vaqt Taklifi', 'Hero badge text'),
  ('hero', 'countdown_label', 'Taklif tugash vaqti', 'Countdown label'),
  
  -- Services section
  ('services', 'title', 'Bizning Xizmatlarimiz', 'Services section title'),
  ('services', 'subtitle', 'Zamonaviy texnologiya va usullar bilan sizning ehtiyojlaringizga moslashtirilgan to''liq stomatologik xizmatlar.', 'Services section subtitle'),
  ('services', 'price_prefix', 'dan boshlab', 'Price prefix text'),
  ('services', 'duration_label', 'Muolaja Vaqti', 'Duration label'),
  
  -- Doctors section
  ('doctors', 'title', 'Bizning Shifokorlar', 'Doctors section title'),
  ('doctors', 'subtitle', 'Yuqori malakali va tajribali mutaxassislar jamoasi', 'Doctors section subtitle'),
  
  -- Reviews section
  ('reviews', 'title', 'Mijozlar Fikrlari', 'Reviews section title'),
  ('reviews', 'subtitle', 'Bizning mijozlarimiz biz haqimizda nima deyishadi', 'Reviews section subtitle'),
  
  -- About section
  ('about', 'title', 'Biz Haqimizda', 'About section title'),
  ('about', 'subtitle', 'Professional stomatologiya xizmatlari', 'About section subtitle'),
  ('about', 'content', 'Biz zamonaviy stomatologiya klinikasimiz. Yuqori malakali shifokorlar va eng so''nggi texnologiyalar bilan xizmat ko''rsatamiz.', 'About content'),
  
  -- Footer
  ('footer', 'description', 'Professional stomatologiya xizmatlari. Sizning tabassum sog''ligingiz bizning ustuvorligimiz.', 'Footer description'),
  ('footer', 'quick_links', 'Tezkor Havolalar', 'Quick links heading'),
  ('footer', 'our_services', 'Bizning Xizmatlar', 'Our services link'),
  ('footer', 'our_doctors', 'Bizning Shifokorlar', 'Our doctors link'),
  ('footer', 'patient_reviews', 'Bemorlar Sharhlari', 'Patient reviews link'),
  ('footer', 'book_appointment', 'Qabulga Yozilish', 'Book appointment link'),
  ('footer', 'contact_us', 'Biz Bilan Bog''laning', 'Contact us heading'),
  ('footer', 'working_hours', 'Ish Vaqti', 'Working hours heading'),
  ('footer', 'monday_friday', 'Dushanba - Juma', 'Monday to Friday'),
  ('footer', 'saturday', 'Shanba', 'Saturday'),
  ('footer', 'sunday', 'Yakshanba', 'Sunday'),
  ('footer', 'closed', 'Yopiq', 'Closed'),
  ('footer', 'emergency', '24/7 Shoshilinch', 'Emergency heading'),
  ('footer', 'emergency_text', 'Shoshilinch yordam uchun istalgan vaqtda qo''ng''iroq qiling', 'Emergency text'),
  ('footer', 'copyright', '© 2025 MedDent. Barcha huquqlar himoyalangan.', 'Copyright text'),
  ('footer', 'privacy', 'Maxfiylik Siyosati', 'Privacy policy'),
  ('footer', 'terms', 'Foydalanish Shartlari', 'Terms of service'),
  ('footer', 'cookies', 'Cookie Siyosati', 'Cookie policy'),
  
  -- Service detail modal
  ('service_detail', 'overview_tab', 'Umumiy', 'Overview tab'),
  ('service_detail', 'process_tab', 'Jarayon', 'Process tab'),
  ('service_detail', 'faq_tab', 'Savollar', 'FAQ tab'),
  ('service_detail', 'description_heading', 'Tavsif', 'Description heading'),
  ('service_detail', 'benefits_heading', 'Afzalliklar', 'Benefits heading'),
  ('service_detail', 'process_heading', 'Davolash jarayoni', 'Process heading'),
  ('service_detail', 'faq_heading', 'Tez-tez so''raladigan savollar', 'FAQ heading'),
  ('service_detail', 'duration_label', 'Davomiyligi', 'Duration label'),
  ('service_detail', 'price_label', 'Narxi', 'Price label'),
  ('service_detail', 'book_button', 'Qabulga yozilish', 'Book button'),
  ('service_detail', 'close_button', 'Yopish', 'Close button')
ON CONFLICT (section, key) DO NOTHING;

-- Add new settings for offer hours
DO $$
BEGIN
  -- Add offer_hours if not exists
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'offer_hours'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('offer_hours', '24', 'promotion');
  END IF;

  -- Add contact_buttons_enabled
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'contact_buttons_enabled'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('contact_buttons_enabled', 'true', 'contact');
  END IF;

  -- Add gradient colors support
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'primary_gradient'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('primary_gradient', '{"from": "#2563eb", "to": "#06b6d4"}', 'colors');
  END IF;
END $$;