import { supabase } from './supabase';

const REVIEW_BUCKET_NAME = 'review-images';
const LOGO_BUCKET_NAME = 'logos';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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

export const uploadImage = async (file: File, bucketType: 'reviews' | 'logos' = 'reviews'): Promise<string> => {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const bucketName = bucketType === 'logos' ? LOGO_BUCKET_NAME : REVIEW_BUCKET_NAME;
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Rasm yuklashda xatolik yuz berdi.');
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
};

export const uploadReviewImage = async (file: File): Promise<UploadResult> => {
  try {
    const url = await uploadImage(file, 'reviews');
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Kutilmagan xatolik yuz berdi.' };
  }
};

export const deleteReviewImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!imageUrl) return true;

    const urlParts = imageUrl.split(`${REVIEW_BUCKET_NAME}/`);
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(REVIEW_BUCKET_NAME)
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

export const getImageUrlFromPath = (path: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(REVIEW_BUCKET_NAME)
    .getPublicUrl(path);

  return publicUrl;
};
