/*
  # Update Review Images Storage Size Limit

  1. Changes
    - Update `review-images` storage bucket file size limit from 5MB to 10MB
    - This allows users to upload larger, higher-quality review images
  
  2. Technical Details
    - New limit: 10485760 bytes (10MB)
    - Previous limit: 5242880 bytes (5MB)
*/

-- Update the file size limit for review-images bucket
UPDATE storage.buckets 
SET file_size_limit = 10485760 
WHERE id = 'review-images';
