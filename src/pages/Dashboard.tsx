import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PhotoLineupStationV2 from "@/components/dashboard/PhotoLineupStationV2";
import { CreditsDisplay } from '@/components/CreditsDisplay';
import { DevPanel } from '@/components/DevPanel';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DatingTipsSidebar } from '@/components/dashboard/DatingTipsSidebar';
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
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Floating Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <div className="pt-20"> {/* Account for fixed header */}
        <div className="container mx-auto px-4 py-6">
          {/* Clean Layout with Integrated Smart Tips */}
          <PhotoLineupStationV2 
            uploadedPhotos={uploadedPhotos} 
            setUploadedPhotos={setUploadedPhotos} 
            onNext={(photo, slotIndex) => {
              logger.debug('Photo ready', { photoId: photo?.id, slotIndex });
            }} 
            onIndividualTransform={(photo, slotIndex) => {
              logger.debug('Photo transformed', { photoId: photo?.id, slotIndex });
            }} 
            onBulkTransform={photos => {
              setBulkPhotos(photos);
              logger.info('Bulk processing initiated', { photoCount: photos.length });
            }} 
          />
          
          {/* Credits Display */}
          <div className="mt-8">
            <CreditsDisplay />
          </div>

          {/* Dev Panel (admin only) */}
          <DevPanel />
        </div>
      </div>
    </div>
  );
}