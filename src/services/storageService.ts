import { supabase } from '../lib/supabase';
import { convertToWebP, getImageDimensions } from '../utils/imageCompression';

export class StorageService {
  private static BUCKET_NAME = 'portfolio-images';

  /**
   * Upload an image to Supabase Storage
   */
  static async uploadImage(file: File, folder: string = 'portfolio'): Promise<string> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    // Determine bucket based on folder
    let bucketName = this.BUCKET_NAME; // default: portfolio-images
    if (folder === 'featured') {
      bucketName = 'featured-images';
    }

    // Convert to WebP for better compression
    let fileToUpload = file;
    try {
      fileToUpload = await convertToWebP(file, 0.85);
    } catch (error) {
      console.warn('WebP conversion failed, uploading original:', error);
      fileToUpload = file;
    }

    // Generate unique filename with .webp extension
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    console.log(`Uploading ${file.name} to ${bucketName}/${fileName}`);

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    console.log('Upload successful:', data.path);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  /**
   * Delete an image from Supabase Storage
   */
  static async deleteImage(filePath: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    // Extract bucket and path from URL if it's a full URL
    let bucketName = this.BUCKET_NAME;
    let path = filePath;
    
    if (filePath.includes('supabase.co')) {
      const url = new URL(filePath);
      const pathParts = url.pathname.split('/storage/v1/object/public/');
      if (pathParts.length > 1) {
        const [bucket, ...pathSegments] = pathParts[1].split('/');
        bucketName = bucket;
        path = pathSegments.join('/');
      }
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Get public URL for an image
   */
  static getPublicUrl(path: string): string {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * List all images in a folder
   */
  static async listImages(folder: string = 'portfolio'): Promise<string[]> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .list(folder);

    if (error) {
      console.error('List error:', error);
      throw new Error(`Failed to list images: ${error.message}`);
    }

    return data.map(file => `${folder}/${file.name}`);
  }
}
