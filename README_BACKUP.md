# 💖 SwipeBoost - AI Dating Photo Enhancement

> Transform your dating photos with AI magic and get more matches on dating apps

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd swipeboost

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your Supabase credentials to .env

# Start development
npm run dev
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or bun
- Supabase account

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint:fix` - Fix linting and formatting
- `npm run test:coverage` - Run tests with coverage
- `npm run health` - Full project health check

## 📋 Project Health

Check project health anytime with:
```bash
npm run health
```

Or open the visual dashboard:
```bash
open tools/health-dashboard.html
```

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI**: Gemini API for photo enhancement
- **Testing**: Vitest + React Testing Library

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── dashboard/       # Dashboard-specific components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── pages/               # Route components
└── test/                # Test utilities and setup

scripts/housekeep/       # Maintenance scripts
tools/                   # Development tools
```

## 🧪 Testing

We maintain **≥60% test coverage** across the codebase:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode during development
npm run test:watch
```

## 🔧 Code Quality

- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with Tailwind plugin
- **Pre-commit**: Husky hooks ensure quality
- **Type Safety**: Strict TypeScript configuration

## 📊 Monitoring

### Health Dashboard
Real-time project health monitoring available at `tools/health-dashboard.html`

Tracks:
- Code quality (lint/format issues)
- TypeScript errors and coverage
- Test coverage and results
- Bundle size and performance
- Environment configuration
- TODO/FIXME tracking

### Scripts Available
- `scripts/housekeep/lint-fix.sh` - Fix code issues
- `scripts/housekeep/type-check.sh` - Validate TypeScript
- `scripts/housekeep/test-coverage.sh` - Generate coverage
- `scripts/housekeep/health-check.sh` - Full health audit

## 🔐 Environment Variables

```bash
# Required
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co

# Optional
NODE_ENV=development
```

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] All tests pass (`npm run health`)
- [ ] Bundle size within limits
- [ ] Environment variables configured
- [ ] Health dashboard shows all green
- [ ] Performance benchmarks met

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

## 🤝 Contributing

1. Follow the [PR Checklist](PR_CHECKLIST.md)
2. Ensure all health checks pass
3. Maintain test coverage ≥60%
4. Include screenshots for UI changes
5. Update documentation as needed

## 📖 Documentation

- [Housekeeping Guide](HOUSEKEEPING.md) - Maintenance and code standards
- [PR Checklist](PR_CHECKLIST.md) - Pre-submission requirements
- Health Dashboard - Real-time project monitoring

## 💡 Features

### Core Features
- 🎯 AI-powered photo enhancement for dating apps
- 📸 Multi-category photo optimization
- 💳 Credit-based usage system
- 🔐 Secure authentication with Supabase
- 📱 Fully responsive design

### Technical Features
- ⚡ Fast Vite development server
- 🎨 Beautiful Tailwind CSS styling
- 🧪 Comprehensive test coverage
- 📊 Real-time health monitoring
- 🔍 Automated code quality checks
- 🚀 Optimized production builds

## 📞 Support

- Check [HOUSEKEEPING.md](HOUSEKEEPING.md) for common issues
- Review health dashboard for system status
- Run `npm run health` for diagnostics

---

Built with ❤️ for better dating success