-- Create storage buckets for photo management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('original-photos', 'original-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('enhanced-photos', 'enhanced-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Create storage policies for original photos
CREATE POLICY "Users can upload their own original photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'original-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own original photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'original-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own original photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'original-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for enhanced photos
CREATE POLICY "Users can upload their own enhanced photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'enhanced-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own enhanced photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'enhanced-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own enhanced photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'enhanced-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create user credits table
CREATE TABLE public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies for user credits
CREATE POLICY "Users can view their own credits" 
ON public.user_credits
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own credits" 
ON public.user_credits
FOR UPDATE 
USING (user_id = auth.uid());

-- Create photo enhancements table to track usage
CREATE TABLE public.photo_enhancements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_photo_url TEXT NOT NULL,
  enhanced_photo_url TEXT,
  photo_category TEXT NOT NULL,
  enhancement_theme TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  processing_time INTEGER,
  cost_credits INTEGER DEFAULT 1,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photo_enhancements ENABLE ROW LEVEL SECURITY;

-- Create policies for photo enhancements
CREATE POLICY "Users can view their own enhancements" 
ON public.photo_enhancements
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own enhancements" 
ON public.photo_enhancements
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own enhancements" 
ON public.photo_enhancements
FOR UPDATE 
USING (user_id = auth.uid());

-- Create function to initialize user credits
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 3);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize credits on user signup
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_credits();

-- Create function to update timestamps
CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_photo_enhancements_updated_at
BEFORE UPDATE ON public.photo_enhancements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();