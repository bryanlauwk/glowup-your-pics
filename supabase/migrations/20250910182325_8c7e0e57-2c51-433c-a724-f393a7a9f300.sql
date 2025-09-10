-- Add trial tracking to user_credits table
ALTER TABLE public.user_credits 
ADD COLUMN trial_used BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN trial_date TIMESTAMP WITH TIME ZONE;

-- Update existing users to have used trial (grandfathered)
UPDATE public.user_credits 
SET trial_used = true, trial_date = created_at
WHERE credits > 0;

-- Create function to initialize new users with FREE trial
CREATE OR REPLACE FUNCTION public.initialize_user_with_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_credits (user_id, credits, trial_used, trial_date)
  VALUES (NEW.id, 1, false, null);  -- 1 FREE trial credit
  RETURN NEW;
END;
$function$;

-- Update the trigger to use new function
DROP TRIGGER IF EXISTS initialize_user_credits_trigger ON auth.users;
CREATE TRIGGER initialize_user_credits_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_with_trial();

-- Create table for tracking user trial results (for conversion optimization)
CREATE TABLE public.trial_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_photo_url TEXT NOT NULL,
  enhanced_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_to_paid BOOLEAN DEFAULT false,
  conversion_date TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.trial_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own trial results" 
ON public.trial_results 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own trial results" 
ON public.trial_results 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own trial results" 
ON public.trial_results 
FOR UPDATE 
USING (user_id = auth.uid());