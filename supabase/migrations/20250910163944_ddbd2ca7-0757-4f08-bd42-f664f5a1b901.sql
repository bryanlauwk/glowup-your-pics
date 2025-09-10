-- Just ensure the enhanced-photos bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'enhanced-photos' AND public = false;