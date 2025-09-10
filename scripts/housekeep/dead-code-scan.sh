#!/bin/bash
set -e

echo "🔍 Scanning for dead code and unused dependencies..."

# Check for unused dependencies
echo "📦 Checking for unused dependencies..."
npx depcheck --ignores="@types/*,eslint*,prettier*,vite*,typescript"

# Check for unused exports
echo "🚪 Checking for unused exports..."
npx ts-unused-exports tsconfig.json

# Check for TODO/FIXME comments
echo "📝 Scanning for TODO/FIXME comments..."
grep -r "TODO\|FIXME\|XXX\|HACK" src/ --include="*.ts" --include="*.tsx" || echo "No TODO/FIXME comments found"

echo "✅ Dead code scan complete!"