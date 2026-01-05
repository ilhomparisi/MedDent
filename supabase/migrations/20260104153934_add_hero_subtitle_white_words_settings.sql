/*
  # Add Hero Subtitle White Words Settings

  1. New Settings
    - `hero_subtitle_white_words_uz` - Comma-separated list of Uzbek words to highlight in white
    - `hero_subtitle_white_words_ru` - Comma-separated list of Russian words to highlight in white

  2. Default Values
    - Uzbek: "60 daqiqa,sarg'aygan tishlar,noxush hidlardan,yorqin,ishonchli tabassumga"
    - Russian: "60 минут,пожелтевших зубов,неприятного запаха,яркую,уверенную улыбку"

  3. Notes
    - Words are stored as comma-separated values for easy editing
    - These settings allow admin to control which words appear in white color in the hero subtitle
*/

DO $$ 
BEGIN
  -- Add hero_subtitle_white_words_uz setting
  INSERT INTO site_settings (key, value, category)
  VALUES (
    'hero_subtitle_white_words_uz',
    '"60 daqiqa,sarg''aygan tishlar,noxush hidlardan,yorqin,ishonchli tabassumga"',
    'hero'
  )
  ON CONFLICT (key) DO NOTHING;

  -- Add hero_subtitle_white_words_ru setting
  INSERT INTO site_settings (key, value, category)
  VALUES (
    'hero_subtitle_white_words_ru',
    '"60 минут,пожелтевших зубов,неприятного запаха,яркую,уверенную улыбку"',
    'hero'
  )
  ON CONFLICT (key) DO NOTHING;
END $$;