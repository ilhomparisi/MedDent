import { api } from './api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  publicUrl?: string;
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

export const uploadImage = async (file: File, bucketType: 'reviews' | 'logos' = 'reviews'): Promise<string> => {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    const result = await api.uploadImage(file, bucketType);
    return result.url || result.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Rasm yuklashda xatolik yuz berdi.');
  }
};

export const uploadReviewImage = async (file: File): Promise<UploadResult> => {
  try {
    const url = await uploadImage(file, 'reviews');
    return { success: true, url, publicUrl: url };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Kutilmagan xatolik yuz berdi.' };
  }
};

export const deleteReviewImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl) return true;
    await api.deleteImage(imageUrl);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

export const getImageUrlFromPath = (path: string): string => {
  return path; // Images are served from /uploads/
};
