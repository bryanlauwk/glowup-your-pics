import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const TestEnhancement: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      console.log('🧪 Running enhancement test...');
      
      // Test internal function
      const testResponse = await supabase.functions.invoke('test-gemini', {});
      console.log('Test response:', testResponse);
      
      setResult(testResponse);
      toast.success('Test completed');
      
    } catch (error) {
      console.error('Test failed:', error);
      setResult({ error: error.message });
      toast.error('Test failed: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Enhancement Function Test</CardTitle>
        <CardDescription>
          Test the Gemini photo enhancement function
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTest} disabled={testing} className="w-full">
          {testing ? 'Testing...' : 'Run Test'}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Test Result:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};