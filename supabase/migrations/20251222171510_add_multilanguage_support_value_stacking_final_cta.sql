/*
  # Add multilanguage support to value_stacking and final_cta_section tables

  1. Changes to value_stacking table
    - Add language-specific columns for all text fields
    - Fields: main_heading, left_pay_label, left_price, left_description, left_button_text
    - Fields: right_pay_label, right_price, right_description, right_button_text, vs_text
    - Each field gets _uz and _ru variants

  2. Changes to final_cta_section table
    - Add language-specific columns for all text fields
    - Fields: heading_line1, heading_highlight1, heading_line2, heading_line3
    - Fields: heading_highlight2, heading_highlight3, description, button_text, button_subtext
    - Each field gets _uz and _ru variants

  3. Notes
    - Existing columns are kept for backward compatibility
    - Data is copied to language-specific columns
*/

-- Add language-specific columns for value_stacking
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'main_heading_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN main_heading_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'main_heading_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN main_heading_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_pay_label_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN left_pay_label_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_pay_label_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN left_pay_label_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_price_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN left_price_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_price_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN left_price_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_description_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN left_description_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_description_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN left_description_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_button_text_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN left_button_text_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'left_button_text_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN left_button_text_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_pay_label_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN right_pay_label_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_pay_label_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN right_pay_label_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_price_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN right_price_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_price_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN right_price_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_description_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN right_description_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_description_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN right_description_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_button_text_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN right_button_text_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'right_button_text_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN right_button_text_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'vs_text_uz') THEN
    ALTER TABLE value_stacking ADD COLUMN vs_text_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'value_stacking' AND column_name = 'vs_text_ru') THEN
    ALTER TABLE value_stacking ADD COLUMN vs_text_ru text;
  END IF;
END $$;

-- Copy existing value_stacking data
UPDATE value_stacking 
SET 
  main_heading_uz = COALESCE(main_heading_uz, main_heading),
  main_heading_ru = COALESCE(main_heading_ru, main_heading),
  left_pay_label_uz = COALESCE(left_pay_label_uz, left_pay_label),
  left_pay_label_ru = COALESCE(left_pay_label_ru, left_pay_label),
  left_price_uz = COALESCE(left_price_uz, left_price),
  left_price_ru = COALESCE(left_price_ru, left_price),
  left_description_uz = COALESCE(left_description_uz, left_description),
  left_description_ru = COALESCE(left_description_ru, left_description),
  left_button_text_uz = COALESCE(left_button_text_uz, left_button_text),
  left_button_text_ru = COALESCE(left_button_text_ru, left_button_text),
  right_pay_label_uz = COALESCE(right_pay_label_uz, right_pay_label),
  right_pay_label_ru = COALESCE(right_pay_label_ru, right_pay_label),
  right_price_uz = COALESCE(right_price_uz, right_price),
  right_price_ru = COALESCE(right_price_ru, right_price),
  right_description_uz = COALESCE(right_description_uz, right_description),
  right_description_ru = COALESCE(right_description_ru, right_description),
  right_button_text_uz = COALESCE(right_button_text_uz, right_button_text),
  right_button_text_ru = COALESCE(right_button_text_ru, right_button_text),
  vs_text_uz = COALESCE(vs_text_uz, vs_text),
  vs_text_ru = COALESCE(vs_text_ru, vs_text)
WHERE main_heading_uz IS NULL OR main_heading_ru IS NULL;

-- Add language-specific columns for final_cta_section
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_line1_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line1_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_line1_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line1_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight1_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight1_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight1_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight1_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_line2_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line2_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_line2_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line2_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_line3_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line3_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_line3_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line3_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight2_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight2_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight2_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight2_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight3_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight3_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight3_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight3_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'description_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN description_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'description_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN description_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'button_text_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN button_text_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'button_text_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN button_text_ru text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'button_subtext_uz') THEN
    ALTER TABLE final_cta_section ADD COLUMN button_subtext_uz text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'final_cta_section' AND column_name = 'button_subtext_ru') THEN
    ALTER TABLE final_cta_section ADD COLUMN button_subtext_ru text;
  END IF;
END $$;

-- Copy existing final_cta_section data
UPDATE final_cta_section 
SET 
  heading_line1_uz = COALESCE(heading_line1_uz, heading_line1),
  heading_line1_ru = COALESCE(heading_line1_ru, heading_line1),
  heading_highlight1_uz = COALESCE(heading_highlight1_uz, heading_highlight1),
  heading_highlight1_ru = COALESCE(heading_highlight1_ru, heading_highlight1),
  heading_line2_uz = COALESCE(heading_line2_uz, heading_line2),
  heading_line2_ru = COALESCE(heading_line2_ru, heading_line2),
  heading_line3_uz = COALESCE(heading_line3_uz, heading_line3),
  heading_line3_ru = COALESCE(heading_line3_ru, heading_line3),
  heading_highlight2_uz = COALESCE(heading_highlight2_uz, heading_highlight2),
  heading_highlight2_ru = COALESCE(heading_highlight2_ru, heading_highlight2),
  heading_highlight3_uz = COALESCE(heading_highlight3_uz, heading_highlight3),
  heading_highlight3_ru = COALESCE(heading_highlight3_ru, heading_highlight3),
  description_uz = COALESCE(description_uz, description),
  description_ru = COALESCE(description_ru, description),
  button_text_uz = COALESCE(button_text_uz, button_text),
  button_text_ru = COALESCE(button_text_ru, button_text),
  button_subtext_uz = COALESCE(button_subtext_uz, button_subtext),
  button_subtext_ru = COALESCE(button_subtext_ru, button_subtext)
WHERE heading_line1_uz IS NULL OR heading_line1_ru IS NULL;