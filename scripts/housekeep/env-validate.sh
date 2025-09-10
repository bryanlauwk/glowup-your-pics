#!/bin/bash
set -e

echo "🔧 Validating environment setup..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Copy .env.example to .env"
    exit 1
fi

# Check required environment variables
required_vars=("VITE_SUPABASE_PROJECT_ID" "VITE_SUPABASE_PUBLISHABLE_KEY" "VITE_SUPABASE_URL")

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env; then
        echo "❌ Missing required environment variable: ${var}"
        exit 1
    fi
done

echo "✅ Environment validation complete!"