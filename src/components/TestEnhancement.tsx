import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export const TestEnhancement: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      logger.info('Enhancement test started', { component: 'TestEnhancement' });
      
      // Test internal function
      const testResponse = await supabase.functions.invoke('test-gemini', {});
      logger.info('Test response received', { response: testResponse });
      
      setResult(testResponse);
      toast.success('Test completed');
      
    } catch (error) {
      logger.error('Test failed', { error });
      setResult({ error: error.message });
      toast.error('Test failed: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Enhancement Function Test</CardTitle>
        <CardDescription className="text-xs">
          Test the Gemini photo enhancement function
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={runTest} disabled={testing} className="w-full h-8 text-xs">
          {testing ? 'Testing...' : 'Run Test'}
        </Button>
        
        {result && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 text-xs">Test Result:</h4>
            <pre className="text-xs overflow-auto max-h-32">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};