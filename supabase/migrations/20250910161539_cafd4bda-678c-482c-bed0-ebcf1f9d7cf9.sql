-- Clean up stuck processing records and add a function to prevent future stale records
UPDATE photo_enhancements 
SET status = 'failed', updated_at = now() 
WHERE status = 'processing' AND created_at < now() - interval '10 minutes';

-- Create a function to automatically clean up stale processing records
CREATE OR REPLACE FUNCTION cleanup_stale_enhancements()
RETURNS void AS $$
BEGIN
  UPDATE photo_enhancements 
  SET status = 'failed', updated_at = now()
  WHERE status = 'processing' 
    AND created_at < now() - interval '10 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;