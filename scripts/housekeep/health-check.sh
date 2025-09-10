#!/bin/bash
set -e

echo "🏥 Running full project health check..."

echo "1/6 Environment validation..."
./scripts/housekeep/env-validate.sh

echo "2/6 Type checking..."
./scripts/housekeep/type-check.sh

echo "3/6 Linting..."
npx eslint . --max-warnings 0

echo "4/6 Testing..."
npx vitest run

echo "5/6 Build check..."
npm run build

echo "6/6 Dependency audit..."
npm audit --audit-level moderate

echo "🎉 All health checks passed!"