import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PhotoLineupStation from "@/components/dashboard/PhotoLineupStation";
import { CreditsDisplay } from '@/components/CreditsDisplay';
import { DevPanel } from '@/components/DevPanel';
import { logger } from '@/lib/logger';
type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';
type EnhancementTheme = 'confident-successful' | 'authentic-approachable' | 'irresistible-magnetic' | 'stunning-sophisticated' | 'creative-unique';
interface PhotoAnalysis {
  confidence: number;
  suggestions: string[];
  attractivenessScore: number;
}
interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  category?: PhotoCategory;
  theme?: EnhancementTheme;
  analysis?: PhotoAnalysis;
  enhancedUrl?: string;
}
export default function Dashboard() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();

  // Simplified state - just manage the photo lineup
  const [uploadedPhotos, setUploadedPhotos] = useState<(UploadedPhoto | null)[]>(Array.from({
    length: 6
  }, () => null));
  const [bulkPhotos, setBulkPhotos] = useState<UploadedPhoto[]>([]);
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  if (loading) {
    return <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-6">
        {/* Streamlined Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Build Your Perfect Dating Profile
          </h1>
          <p className="text-muted-foreground">6 photos can make or break your dating success. We curate a winning lineup tailored to you, you pick your favorites, then we work our magic to maximize your matches.</p>
        </div>

        {/* Single Unified Photo Station */}
        <PhotoLineupStation uploadedPhotos={uploadedPhotos} setUploadedPhotos={setUploadedPhotos} onNext={(photo, slotIndex) => {
        // Handle any post-processing actions if needed
        logger.debug('Photo ready', { photoId: photo?.id, slotIndex });
      }} onIndividualTransform={(photo, slotIndex) => {
        // Handle individual transformation completion
        logger.debug('Photo transformed', { photoId: photo?.id, slotIndex });
      }} onBulkTransform={photos => {
        // Handle bulk transformation
        setBulkPhotos(photos);
        logger.info('Bulk processing initiated', { photoCount: photos.length });
      }} />

        <CreditsDisplay />
        <DevPanel />
      </div>
    </div>;
}