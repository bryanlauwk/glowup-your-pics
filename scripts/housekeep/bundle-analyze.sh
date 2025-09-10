#!/bin/bash
set -e

echo "📦 Analyzing bundle size..."
npm run build

echo "📊 Bundle analysis complete!"
echo "Check dist/ directory for build output"