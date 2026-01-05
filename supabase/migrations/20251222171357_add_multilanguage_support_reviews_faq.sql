/*
  # Add multilanguage support to reviews and faq_items tables

  1. Changes to reviews table
    - Add `patient_name_uz` column for Uzbek patient name
    - Add `patient_name_ru` column for Russian patient name
    - Add `review_text_uz` column for Uzbek review text
    - Add `review_text_ru` column for Russian review text
    - Add `service_used_uz` column for Uzbek service name
    - Add `service_used_ru` column for Russian service name

  2. Changes to faq_items table
    - Add `question_uz` column for Uzbek question
    - Add `question_ru` column for Russian question
    - Add `answer_uz` column for Uzbek answer
    - Add `answer_ru` column for Russian answer

  3. Notes
    - Existing columns are kept for backward compatibility
    - Data is copied to language-specific columns
*/

-- Add language-specific columns for reviews
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'patient_name_uz') THEN
    ALTER TABLE reviews ADD COLUMN patient_name_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'patient_name_ru') THEN
    ALTER TABLE reviews ADD COLUMN patient_name_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'review_text_uz') THEN
    ALTER TABLE reviews ADD COLUMN review_text_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'review_text_ru') THEN
    ALTER TABLE reviews ADD COLUMN review_text_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'service_used_uz') THEN
    ALTER TABLE reviews ADD COLUMN service_used_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'service_used_ru') THEN
    ALTER TABLE reviews ADD COLUMN service_used_ru text;
  END IF;
END $$;

-- Copy existing review data to language-specific columns
UPDATE reviews 
SET 
  patient_name_uz = COALESCE(patient_name_uz, patient_name),
  patient_name_ru = COALESCE(patient_name_ru, patient_name),
  review_text_uz = COALESCE(review_text_uz, review_text),
  review_text_ru = COALESCE(review_text_ru, review_text),
  service_used_uz = COALESCE(service_used_uz, service_used),
  service_used_ru = COALESCE(service_used_ru, service_used)
WHERE patient_name_uz IS NULL OR patient_name_ru IS NULL;

-- Add language-specific columns for faq_items
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faq_items' AND column_name = 'question_uz') THEN
    ALTER TABLE faq_items ADD COLUMN question_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faq_items' AND column_name = 'question_ru') THEN
    ALTER TABLE faq_items ADD COLUMN question_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faq_items' AND column_name = 'answer_uz') THEN
    ALTER TABLE faq_items ADD COLUMN answer_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'faq_items' AND column_name = 'answer_ru') THEN
    ALTER TABLE faq_items ADD COLUMN answer_ru text;
  END IF;
END $$;

-- Copy existing FAQ data to language-specific columns
UPDATE faq_items 
SET 
  question_uz = COALESCE(question_uz, question),
  question_ru = COALESCE(question_ru, question),
  answer_uz = COALESCE(answer_uz, answer),
  answer_ru = COALESCE(answer_ru, answer)
WHERE question_uz IS NULL OR question_ru IS NULL;