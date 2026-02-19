import { api } from './api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Faqat JPEG, PNG, va WebP formatdagi rasmlar qabul qilinadi.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Rasm hajmi 10MB dan oshmasligi kerak.';
  }

  return null;
};

export const uploadDoctorImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const validationError = validateImageFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const result = await api.uploadImage(file, 'doctors');
    return { success: true, url: result.url || result.publicUrl };
  } catch (error) {
    console.error('Error uploading doctor image:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Rasm yuklashda xatolik yuz berdi.' 
    };
  }
};

export const deleteDoctorImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl) return true;
    await api.deleteImage(imageUrl);
    return true;
  } catch (error) {
    console.error('Error deleting doctor image:', error);
    return false;
  }
};
