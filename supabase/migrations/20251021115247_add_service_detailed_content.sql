/*
  # Add Service Detailed Content Fields

  1. Changes
    - Add `detailed_description` column to services table for rich content
    - Add `benefits` JSONB column to store list of benefits
    - Add `process_steps` JSONB column to store treatment process steps
    - Add `faq` JSONB column to store frequently asked questions
    
  2. Purpose
    - Enable detailed service information display in modal dialogs
    - Support visual presentation of service details
    - Allow structured content for better user experience
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'detailed_description'
  ) THEN
    ALTER TABLE services ADD COLUMN detailed_description TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'benefits'
  ) THEN
    ALTER TABLE services ADD COLUMN benefits JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'process_steps'
  ) THEN
    ALTER TABLE services ADD COLUMN process_steps JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'faq'
  ) THEN
    ALTER TABLE services ADD COLUMN faq JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add sample detailed content to existing services
UPDATE services
SET 
  detailed_description = 'Professional tishlarni oqartirish xizmati zamonaviy texnologiyalar yordamida amalga oshiriladi. Xavfsiz va samarali natijalar bitta seansda. Tishlaringiz 2-3 tonga oqaroq bo''ladi.',
  benefits = '["Tezkor natijalar - 1 soatda", "Xavfsiz va og''riqsiz jarayon", "Uzoq davom etadigan natijalar", "Professional uskunalar", "Tajribali shifokorlar"]'::jsonb,
  process_steps = '[{"title": "Konsultatsiya", "description": "Shifokor tishlaringizni tekshiradi"}, {"title": "Tayyorgarlik", "description": "Tishlarni tozalash va tayyorlash"}, {"title": "Oqartirish", "description": "Maxsus gel va UV yorug''lik bilan oqartirish"}, {"title": "Natija", "description": "Yakuniy tekshiruv va tavsiyalar"}]'::jsonb,
  faq = '[{"question": "Bu og''riqli jarayonmi?", "answer": "Yo''q, jarayon butunlay og''riqsiz."}, {"question": "Necha vaqt davom etadi?", "answer": "Odatda 1 soat atrofida."}, {"question": "Natijalar qancha vaqt saqlanadi?", "answer": "To''g''ri parvarish bilan 1-2 yil."}]'::jsonb
WHERE title = 'Tishlarni Oqartirish';

UPDATE services
SET 
  detailed_description = 'Tish implantlari - yo''qolgan tishlarni tiklashning eng zamonaviy va samarali usuli. Titan implantlar suyak bilan to''liq birikadi va natural tishlar kabi xizmat qiladi.',
  benefits = '["Doimiy yechim", "Tabiiy ko''rinish", "Qulay va mustahkam", "Uzoq muddatli - 20+ yil", "Qo''shni tishlarni saqlab qolish"]'::jsonb,
  process_steps = '[{"title": "Diagnostika", "description": "CT skanerlash va rejalashtirish"}, {"title": "Implant o''rnatish", "description": "Titan implantni joylashtirish"}, {"title": "Bitish davri", "description": "3-6 oy davomida suyak bilan birikish"}, {"title": "Toj o''rnatish", "description": "Keramik tojni implantga o''rnatish"}]'::jsonb,
  faq = '[{"question": "Bu qanchalik xavfsiz?", "answer": "Juda xavfsiz - 98% muvaffaqiyat darajasi."}, {"question": "Necha vaqt kerak?", "answer": "To''liq jarayon 3-6 oy."}, {"question": "Yosh chegarasi bormi?", "answer": "18 yoshdan yuqori har kim."}]'::jsonb
WHERE title = 'Tish Implantlari';

UPDATE services
SET 
  detailed_description = 'Ortodontik davolash - tishlarni to''g''ri holatga keltirish uchun zamonaviy usullar. Biz metal, keramik va ko''rinmas braketlarni taklif qilamiz.',
  benefits = '["Chiroyli tabassum", "Tishlarning to''g''ri joylashuvi", "Chaynash funktsiyasini yaxshilash", "Turli xil variantlar", "Qulay to''lov rejalari"]'::jsonb,
  process_steps = '[{"title": "Birinchi konsultatsiya", "description": "3D skanerlash va tahlil"}, {"title": "Davolash rejasi", "description": "Individual reja tuzish"}, {"title": "Breket o''rnatish", "description": "Tanlangan tizimni o''rnatish"}, {"title": "Muntazam nazorat", "description": "Oylik tekshiruvlar va sozlashlar"}]'::jsonb,
  faq = '[{"question": "Qancha vaqt kerak?", "answer": "Odatda 12-24 oy."}, {"question": "Bu og''riqli jarayonmi?", "answer": "Dastlab noqulay bo''lishi mumkin, lekin tez o''rganasiz."}, {"question": "Ko''rinmas variantlar bormi?", "answer": "Ha, Invisalign va boshqa shaffof tuzatgichlar mavjud."}]'::jsonb
WHERE title = 'Ortodontiya';