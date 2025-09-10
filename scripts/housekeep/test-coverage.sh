#!/bin/bash
set -e

echo "🧪 Running tests with coverage..."
npx vitest run --coverage

echo "📊 Coverage report generated in coverage/ directory"
echo "✅ Tests complete!"