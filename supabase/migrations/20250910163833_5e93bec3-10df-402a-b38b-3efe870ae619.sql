-- Make enhanced-photos bucket public so users can access their enhanced images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'enhanced-photos';

-- Create RLS policies for enhanced photos access
CREATE POLICY "Users can view their own enhanced photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'enhanced-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own enhanced photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'enhanced-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own enhanced photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'enhanced-photos' AND auth.uid()::text = (storage.foldername(name))[1]);