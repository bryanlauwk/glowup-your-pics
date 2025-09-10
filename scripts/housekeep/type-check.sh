#!/bin/bash
set -e

echo "🔍 Running TypeScript type checking..."
npx tsc --noEmit

echo "✅ Type checking complete!"