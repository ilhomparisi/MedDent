import { supabase } from './supabase';

const BUCKET_NAME = 'doctor-images';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Faqat JPEG, PNG, va WebP formatdagi rasmlar qabul qilinadi.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Rasm hajmi 10MB dan oshmasligi kerak.';
  }

  return null;
};

export const uploadDoctorImage = async (file: File): Promise<UploadResult> => {
  try {
    const validationError = validateImageFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `doctors/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Rasm yuklashda xatolik yuz berdi.' };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Kutilmagan xatolik yuz berdi.' };
  }
};

export const deleteDoctorImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl) return true;

    const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
