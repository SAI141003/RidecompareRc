
import { supabase } from './client';

export const initializeStorage = async () => {
  // Create avatars bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'avatars')) {
    await supabase.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      fileSizeLimit: 1024 * 1024 * 2, // 2MB
    });
  }
};
