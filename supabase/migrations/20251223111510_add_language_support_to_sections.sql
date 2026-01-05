/*
  # Add Language Support to Results and Doctors Sections
  
  1. Changes
    - Adds Uzbek (_uz) and Russian (_ru) settings for Results section
    - Adds Uzbek (_uz) and Russian (_ru) settings for Doctors section
    - Updates existing settings with translations
  
  2. Settings Updated
    - Results Section: title, subtitle, cta_text, button_text, subtext
    - Doctors Section: title, subtitle, experience_label
*/

INSERT INTO site_settings (key, value, category, updated_at)
SELECT * FROM (VALUES
  ('results_title_uz', '"BIZGA ISHONCH BILDIRGAN BEMORLARIMIZ NATIJALARI"'::jsonb, 'text'::text, now()),
  ('results_title_ru', '"РЕЗУЛЬТАТЫ НАШИХ ПАЦИЕНТОВ, ДОВЕРИВШИХСЯ НАМ"'::jsonb, 'text'::text, now()),
  ('results_subtitle_uz', '"Sizniki keyingisi bo''lishi mumkin."'::jsonb, 'text'::text, now()),
  ('results_subtitle_ru', '"Ваш может быть следующим."'::jsonb, 'text'::text, now()),
  ('results_cta_text_uz', '"Hoziroq ro''yxatdan o''taman!"'::jsonb, 'text'::text, now()),
  ('results_cta_text_ru', '"Записаться сейчас!"'::jsonb, 'text'::text, now()),
  ('results_button_text_uz', '"Hoziroq ro''yxatdan o''taman!"'::jsonb, 'text'::text, now()),
  ('results_button_text_ru', '"Записаться сейчас!"'::jsonb, 'text'::text, now()),
  ('results_subtext_uz', '"Qaror qabul qilish uchun sizda 24 soat vaqt bor."'::jsonb, 'text'::text, now()),
  ('results_subtext_ru', '"У вас есть 24 часа, чтобы принять решение."'::jsonb, 'text'::text, now()),
  ('doctors_title_uz', '"SIZNING TABASSUMINGIZ ORTIDAGI JAMOA"'::jsonb, 'text'::text, now()),
  ('doctors_title_ru', '"КОМАНДА ЗА ВАШЕЙ УЛЫБКОЙ"'::jsonb, 'text'::text, now()),
  ('doctors_subtitle_uz', '"Sizni qulay, og''riqsiz va ishonchli muhitda qabul qiladigan tajribali shifokorlarimiz — tabassumingizni sog''lom va chiroyli holatga qaytarish uchun shu yerda."'::jsonb, 'text'::text, now()),
  ('doctors_subtitle_ru', '"Наши опытные врачи примут вас в комфортной, безболезненной и доверительной обстановке — чтобы вернуть вашей улыбке здоровье и красоту."'::jsonb, 'text'::text, now()),
  ('doctors_experience_label_uz', '"yillik tajriba"'::jsonb, 'text'::text, now()),
  ('doctors_experience_label_ru', '"лет опыта"'::jsonb, 'text'::text, now())
) AS new_settings(key, value, category, updated_at)
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings WHERE key = new_settings.key
);