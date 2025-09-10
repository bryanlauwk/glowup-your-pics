-- Fix remaining security function search path issues
CREATE OR REPLACE FUNCTION public.cleanup_stale_enhancements()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE photo_enhancements 
  SET status = 'failed', updated_at = now()
  WHERE status = 'processing' 
    AND created_at < now() - interval '10 minutes';
END;
$function$;

CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 3);
  RETURN NEW;
END;
$function$;