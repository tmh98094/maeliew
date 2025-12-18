-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads featured" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access featured" ON storage.objects;

-- Create new policies that allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to portfolio-images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Allow authenticated uploads to featured-images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'featured-images');

-- Allow public read access to all images
CREATE POLICY "Allow public read access to portfolio-images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow public read access to featured-images" ON storage.objects
FOR SELECT USING (bucket_id = 'featured-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated delete from portfolio-images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow authenticated delete from featured-images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'featured-images');