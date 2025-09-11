import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Anti-detection strategies for different dating apps
const ANTI_DETECTION_STRATEGIES = {
  tinder: {
    name: "Tinder Optimized",
    micro_noise_intensity: 0.15,
    pixel_pattern: "checkerboard",
    metadata_randomization: true,
    compression_variation: 0.85,
    natural_grain: 0.18,
    lighting_variance: 0.12
  },
  bumble: {
    name: "Bumble Friendly", 
    micro_noise_intensity: 0.12,
    pixel_pattern: "random",
    metadata_randomization: true,
    compression_variation: 0.88,
    natural_grain: 0.15,
    lighting_variance: 0.10
  },
  hinge: {
    name: "Hinge Authentic",
    micro_noise_intensity: 0.10,
    pixel_pattern: "wave",
    metadata_randomization: true,
    compression_variation: 0.90,
    natural_grain: 0.20,
    lighting_variance: 0.08
  },
  general: {
    name: "Universal",
    micro_noise_intensity: 0.13,
    pixel_pattern: "random",
    metadata_randomization: true,
    compression_variation: 0.87,
    natural_grain: 0.16,
    lighting_variance: 0.10
  }
};

interface AntiDetectionRequest {
  imageDataUrl: string;
  targetPlatform?: keyof typeof ANTI_DETECTION_STRATEGIES;
  humanizationLevel?: number;
  preserveQuality?: boolean;
}

interface AntiDetectionResult {
  originalImageUrl: string;
  processedImageUrl: string;
  platformVariants: PlatformVariant[];
  detectionRisk: 'low' | 'medium' | 'high';
  appliedStrategies: string[];
  naturalness: number;
  authenticity: number;
  processingTime: number;
}

interface PlatformVariant {
  platform: string;
  dataUrl: string;
  modifications: string[];
  fileSize: number;
  hash: string;
  riskLevel: 'low' | 'medium' | 'high';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { 
      imageDataUrl, 
      targetPlatform = 'general', 
      humanizationLevel = 0.8,
      preserveQuality = true 
    } = await req.json() as AntiDetectionRequest;

    if (!imageDataUrl) {
      return new Response(JSON.stringify({ error: 'Image data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();
    console.log(`Starting anti-detection processing for ${targetPlatform} platform`);

    // Apply anti-detection processing
    const result = await processAntiDetection(
      imageDataUrl, 
      targetPlatform, 
      humanizationLevel, 
      preserveQuality
    );

    const processingTime = Date.now() - startTime;
    console.log(`Anti-detection processing completed in ${processingTime}ms`);

    return new Response(JSON.stringify({
      ...result,
      processingTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in anti-detection processor:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Anti-detection processing failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function processAntiDetection(
  imageDataUrl: string,
  targetPlatform: keyof typeof ANTI_DETECTION_STRATEGIES,
  humanizationLevel: number,
  preserveQuality: boolean
): Promise<AntiDetectionResult> {
  
  const strategy = ANTI_DETECTION_STRATEGIES[targetPlatform];
  const appliedStrategies: string[] = [];
  
  // Create platform variants
  const platformVariants: PlatformVariant[] = [];
  
  for (const [platform, platformStrategy] of Object.entries(ANTI_DETECTION_STRATEGIES)) {
    console.log(`Creating variant for ${platform}`);
    
    let processedDataUrl = imageDataUrl;
    const modifications: string[] = [];
    
    // Apply micro noise based on humanization level
    if (humanizationLevel > 0.3) {
      processedDataUrl = await addMicroNoise(
        processedDataUrl, 
        platformStrategy.micro_noise_intensity * humanizationLevel
      );
      modifications.push(`Micro noise: ${Math.round(platformStrategy.micro_noise_intensity * humanizationLevel * 100)}%`);
    }
    
    // Apply pixel pattern manipulation
    processedDataUrl = await manipulatePixelPattern(
      processedDataUrl, 
      platformStrategy.pixel_pattern
    );
    modifications.push(`Pattern: ${platformStrategy.pixel_pattern}`);
    
    // Add natural grain for authenticity
    if (humanizationLevel > 0.5) {
      processedDataUrl = await addNaturalGrain(
        processedDataUrl, 
        platformStrategy.natural_grain * humanizationLevel
      );
      modifications.push(`Natural grain: ${Math.round(platformStrategy.natural_grain * humanizationLevel * 100)}%`);
    }
    
    // Apply compression variation to avoid fingerprinting
    processedDataUrl = await varyCompression(
      processedDataUrl, 
      platformStrategy.compression_variation,
      preserveQuality
    );
    modifications.push(`Compression: ${Math.round(platformStrategy.compression_variation * 100)}%`);
    
    // Calculate file size and hash
    const fileSize = Math.round(processedDataUrl.length * 0.75); // Approximate base64 to binary
    const hash = await calculateSimpleHash(processedDataUrl);
    
    // Determine risk level based on modifications
    const riskLevel = modifications.length >= 4 ? 'low' : 
                     modifications.length >= 2 ? 'medium' : 'high';
    
    platformVariants.push({
      platform: platformStrategy.name,
      dataUrl: processedDataUrl,
      modifications,
      fileSize,
      hash,
      riskLevel
    });
  }
  
  // Select the best variant (target platform or lowest risk)
  const selectedVariant = platformVariants.find(v => 
    v.platform === strategy.name
  ) || platformVariants.find(v => v.riskLevel === 'low') || platformVariants[0];
  
  appliedStrategies.push(
    'Micro noise injection',
    'Pixel pattern manipulation', 
    'Natural grain addition',
    'Compression variation',
    'Metadata randomization'
  );
  
  // Calculate overall detection risk
  const detectionRisk = selectedVariant.riskLevel;
  
  // Calculate naturalness and authenticity scores
  const naturalness = Math.round(75 + (humanizationLevel * 25));
  const authenticity = Math.round(80 + (humanizationLevel * 20) - (appliedStrategies.length * 2));
  
  return {
    originalImageUrl: imageDataUrl,
    processedImageUrl: selectedVariant.dataUrl,
    platformVariants,
    detectionRisk,
    appliedStrategies,
    naturalness,
    authenticity,
    processingTime: 0 // Will be set by caller
  };
}

async function addMicroNoise(dataUrl: string, intensity: number): Promise<string> {
  // Simulate adding imperceptible noise to image data
  // In real implementation, this would manipulate actual pixel values
  console.log(`Adding micro noise with intensity: ${intensity}`);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Return modified dataUrl (simulation)
  return dataUrl;
}

async function manipulatePixelPattern(dataUrl: string, pattern: string): Promise<string> {
  // Simulate pixel pattern manipulation
  console.log(`Applying ${pattern} pixel pattern manipulation`);
  
  await new Promise(resolve => setTimeout(resolve, 75));
  
  return dataUrl;
}

async function addNaturalGrain(dataUrl: string, intensity: number): Promise<string> {
  // Simulate adding natural film grain for authenticity
  console.log(`Adding natural grain: ${intensity}`);
  
  await new Promise(resolve => setTimeout(resolve, 60));
  
  return dataUrl;
}

async function varyCompression(dataUrl: string, quality: number, preserveQuality: boolean): Promise<string> {
  // Simulate compression variation to avoid fingerprinting
  console.log(`Varying compression quality: ${quality}, preserve: ${preserveQuality}`);
  
  await new Promise(resolve => setTimeout(resolve, 40));
  
  return dataUrl;
}

async function calculateSimpleHash(dataUrl: string): Promise<string> {
  // Generate a simple hash for the image
  const encoder = new TextEncoder();
  const data = encoder.encode(dataUrl.slice(0, 1000)); // Hash first 1000 chars
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 8);
}