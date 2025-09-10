#!/bin/bash
set -e

echo "🔍 Running ESLint with auto-fix..."
npx eslint . --fix

echo "✨ Running Prettier..."
npx prettier --write .

echo "✅ Linting and formatting complete!"