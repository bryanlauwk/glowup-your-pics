import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PhotoLineupStation from "@/components/dashboard/PhotoLineupStation";
import { CreditsDisplay } from '@/components/CreditsDisplay';
import { DevPanel } from '@/components/DevPanel';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Simplified state - just manage the photo lineup
  const [uploadedPhotos, setUploadedPhotos] = useState<(UploadedPhoto | null)[]>(
    Array.from({ length: 6 }, () => null)
  );
  const [bulkPhotos, setBulkPhotos] = useState<UploadedPhoto[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-6">
        {/* Streamlined Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Build Your Perfect Dating Profile
          </h1>
          <p className="text-muted-foreground">
            Upload photos to category-specific slots, choose your vibe, and transform them instantly
          </p>
        </div>

        {/* Single Unified Photo Station */}
        <PhotoLineupStation
          uploadedPhotos={uploadedPhotos}
          setUploadedPhotos={setUploadedPhotos}
          onNext={(photo, slotIndex) => {
            // Handle any post-processing actions if needed
            console.log('Photo ready:', photo, 'at slot:', slotIndex);
          }}
          onIndividualTransform={(photo, slotIndex) => {
            // Handle individual transformation completion
            console.log('Photo transformed:', photo, 'at slot:', slotIndex);
          }}
          onBulkTransform={(photos) => {
            // Handle bulk transformation
            setBulkPhotos(photos);
            console.log('Bulk processing:', photos.length, 'photos');
          }}
        />

        <CreditsDisplay />
        <DevPanel />
      </div>
    </div>
  );
}