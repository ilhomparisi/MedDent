/*
  # Add Comprehensive Text Settings and Countdown Configuration

  1. New Settings Keys
    - Countdown component texts (discount expiry text, styling options)
    - Hero section badge text configuration
    - All missing section text settings
    - Services section complete text configuration
    - Footer section complete text configuration
    - Service detail modal texts
    
  2. Updates
    - Ensure all UI text keys are available for admin editing
    - Add font size and weight settings for countdown expiry text
    - Add configuration for all section titles and subtitles with alignment
*/

-- Add countdown text configuration settings
DO $$
BEGIN
  -- Countdown discount expiry text
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'countdown_expiry_text') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('countdown_expiry_text', '"CHEGIRMA TEZ ORADA TUGAYDI!"', 'texts');
  END IF;

  -- Countdown expiry text font size
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'countdown_expiry_text_size') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('countdown_expiry_text_size', '"16"', 'texts');
  END IF;

  -- Countdown expiry text font weight
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'countdown_expiry_text_weight') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('countdown_expiry_text_weight', '"700"', 'texts');
  END IF;

  -- Services section texts
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_title') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_title', '"Bizning Xizmatlarimiz"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_subtitle') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_subtitle', '"Zamonaviy texnologiya va usullar bilan sizning ehtiyojlaringizga moslashtirilgan to''liq stomatologik xizmatlar."', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_title_align') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_title_align', '"center"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_subtitle_align') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_subtitle_align', '"center"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_price_prefix') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_price_prefix', '"dan boshlab"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_duration_label') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_duration_label', '"Muolaja Vaqti"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_book_button') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_book_button', '"Hozir Yozilish"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'services_learn_more') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('services_learn_more', '"Batafsil"', 'texts');
  END IF;

  -- Footer section texts
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'footer_description') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('footer_description', '"Professional stomatologiya xizmatlari. Sizning tabassum sog''ligingiz bizning ustuvorligimiz."', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'footer_quick_links') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('footer_quick_links', '"Tezkor Havolalar"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'footer_contact_us') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('footer_contact_us', '"Biz Bilan Bog''laning"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'footer_working_hours') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('footer_working_hours', '"Ish Vaqti"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'footer_emergency') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('footer_emergency', '"24/7 Shoshilinch"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'footer_emergency_text') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('footer_emergency_text', '"Shoshilinch yordam uchun istalgan vaqtda qo''ng''iroq qiling"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'footer_copyright') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('footer_copyright', '"© 2025 MedDent. Barcha huquqlar himoyalangan."', 'texts');
  END IF;

  -- About section texts (if needed)
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'about_title') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('about_title', '"Biz Haqimizda"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'about_subtitle') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('about_subtitle', '"Professional stomatologiya xizmatlari"', 'texts');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'about_content') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('about_content', '"Biz zamonaviy stomatologiya klinikasimiz. Yuqori malakali shifokorlar va eng so''nggi texnologiyalar bilan xizmat ko''rsatamiz."', 'texts');
  END IF;
END $$;
