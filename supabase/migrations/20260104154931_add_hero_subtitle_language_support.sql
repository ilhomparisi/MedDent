/*
  # Add Hero Subtitle Language Support

  1. New Settings
    - `hero_subtitle_uz` - Hero subtitle in Uzbek language
    - `hero_subtitle_ru` - Hero subtitle in Russian language

  2. Notes
    - Allows admin to set different hero subtitle text for each language
    - Existing `hero_subtitle` field will be used as fallback
*/

DO $$ 
BEGIN
  -- Add hero_subtitle_uz setting
  INSERT INTO site_settings (key, value, category)
  VALUES (
    'hero_subtitle_uz',
    '"Atigi 1 ta tashrifda, bor-yo''g''i 60 daqiqa ichida sarg''aygan tishlar va \"og''zimdan hid keladimi?\" degan ichki xavotirdan butunlay xalos bo''ling. Tajribali stomatolog yordamida o''zingizga qulay sharoitda, odamlar bilan uyalmasdan, muloqotda ishonch bilan gapiradigan tabassumga ega bo''ling!"',
    'hero'
  )
  ON CONFLICT (key) DO NOTHING;

  -- Add hero_subtitle_ru setting
  INSERT INTO site_settings (key, value, category)
  VALUES (
    'hero_subtitle_ru',
    '"Всего за 1 визит, всего за 60 минут избавьтесь от пожелтевших зубов и неприятного запаха. С помощью опытного стоматолога, безболезненно и в комфортных условиях получите более яркую и уверенную улыбку!"',
    'hero'
  )
  ON CONFLICT (key) DO NOTHING;
END $$;