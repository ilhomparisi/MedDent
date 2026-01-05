/*
  # Kim Uchun Section Settings

  ## Overview
  This migration adds comprehensive configuration settings for the "Kim Uchun" (For Whom) section,
  which replaces the previous "Zamonaviy Texnologiya" section with a three-card design.

  ## Changes Made

  ### New Settings Added to site_settings table:

  1. **Section Title**
     - `kim_uchun_title` - Main section title
     - `kim_uchun_title_align` - Title alignment (left/center/right)

  2. **Three Feature Cards**
     - `kim_uchun_card1_text` - First card text content
     - `kim_uchun_card1_icon` - First card icon name from lucide-react
     - `kim_uchun_card2_text` - Second card text content
     - `kim_uchun_card2_icon` - Second card icon name from lucide-react
     - `kim_uchun_card3_text` - Third card text content
     - `kim_uchun_card3_icon` - Third card icon name from lucide-react

  3. **Call-to-Action Button**
     - `kim_uchun_button_text` - Button text
     - `kim_uchun_button_align` - Button alignment (left/center/right)

  ## Security
  - Uses existing RLS policies for site_settings table
  - All settings are readable by public, writable by authenticated users only

  ## Notes
  - Default values are set in Uzbek language
  - Icons reference lucide-react icon names
  - Button uses the same scroll-to-reviews functionality as before
*/

-- Insert Kim Uchun section settings
INSERT INTO site_settings (key, value, category) VALUES
('kim_uchun_title', '"Bu taklif aynan siz uchun, agar siz:"', 'texts'),
('kim_uchun_title_align', '"left"', 'texts'),
('kim_uchun_card1_text', '"Tishlaringiz sarg''ayib, tabassumingizdan uyaladigan bo''lsangiz"', 'texts'),
('kim_uchun_card1_icon', '"Frown"', 'texts'),
('kim_uchun_card2_text', '"Og''zingizda noxush hid sezilib, odamlar bilan bemalol gaplasha olmasangiz"', 'texts'),
('kim_uchun_card2_icon', '"Wind"', 'texts'),
('kim_uchun_card3_text', '"Tish shifokoriga borishdan qo''rqib, uzoq vaqt tashrifni kechiktirib kelgan bo''lsangiz"', 'texts'),
('kim_uchun_card3_icon', '"AlertCircle"', 'texts'),
('kim_uchun_button_text', '"Xizmatlar bilan tanishing"', 'texts'),
('kim_uchun_button_align', '"center"', 'texts')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
