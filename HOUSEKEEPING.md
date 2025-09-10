# 💖 SwipeBoost Housekeeping Guide

> Your comprehensive guide to maintaining code quality, testing, and project health

## 🚀 Quick Commands

| Command | Description |
|---------|-------------|
| `npm run lint:fix` | Fix linting and formatting issues |
| `npm run type:check` | Validate TypeScript types |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run health` | Run complete health check |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |

## 📋 Code Standards

### **Formatting & Linting**
- **Formatter**: Prettier with Tailwind CSS plugin
- **Linter**: ESLint with TypeScript and React rules
- **Editor**: EditorConfig for consistent formatting
- **Pre-commit**: Husky hooks for quality gates

### **TypeScript Configuration**
- Strict type checking enabled
- Path mapping configured (`@/` for src)
- JSX support with React 18
- Modern ES2020 target

### **Testing Strategy**
- **Framework**: Vitest + React Testing Library
- **Coverage Target**: ≥60% across all metrics
- **Test Types**: Unit, integration, and smoke tests
- **Mocking**: Supabase and external APIs

## 🛠️ Development Workflow

### **Before You Start**
1. Copy `.env.example` to `.env`
2. Run `npm run env:validate`
3. Install dependencies with `npm install`

### **Daily Development**
```bash
# Start development
npm run dev

# Run tests in watch mode
npm run test:watch

# Fix code issues
npm run lint:fix
```

### **Before Committing**
```bash
# Run full health check
npm run health

# Check specific areas
npm run type:check
npm run test:coverage
npm run lint
```

## 📊 Health Dashboard

Open `tools/health-dashboard.html` in your browser for real-time project health monitoring:

- **Code Quality**: ESLint issues and complexity metrics
- **TypeScript**: Type errors and coverage
- **Testing**: Coverage percentage and test results
- **Bundle**: Size analysis and optimization opportunities
- **Environment**: Configuration validation
- **Code Health**: TODO/FIXME tracking

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   └── common/          # Shared components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & configurations
│   ├── utils.ts         # General utilities
│   └── logger.ts        # Structured logging
├── pages/               # Route components
├── test/                # Test utilities and setup
└── types/               # TypeScript definitions
```

## 🔧 Maintenance Tasks

### **Weekly**
- [ ] Run dependency audit: `npm audit`
- [ ] Check bundle size: `npm run bundle:analyze`
- [ ] Review test coverage: `npm run test:coverage`
- [ ] Update dependencies: `npm update`

### **Monthly**
- [ ] Full codebase health check
- [ ] Review and clean TODO/FIXME items
- [ ] Performance audit
- [ ] Security scan

### **Before Release**
- [ ] Full test suite passes
- [ ] Type checking passes
- [ ] Lint checks pass
- [ ] Bundle size within limits
- [ ] Health dashboard all green
- [ ] Documentation updated

## 🚨 Troubleshooting

### **Common Issues**

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tests Failing**
```bash
# Run tests with verbose output
npm run test -- --reporter=verbose
```

**Type Errors**
```bash
# Check TypeScript configuration
npm run type:check
```

**Environment Issues**
```bash
# Validate environment setup
npm run env:validate
```

## 📈 Performance Guidelines

- Keep bundle size under 2MB
- Maintain test coverage above 60%
- Limit TypeScript errors to 0
- Keep build time under 30 seconds
- Minimize console.log usage in production

## 🔐 Security Best Practices

- Never commit secrets to repository
- Use environment variables for sensitive data
- Regular dependency audits
- Input validation and sanitization
- Proper error handling

## 📖 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vitest Guide](https://vitest.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

**💡 Pro Tip**: Use the health dashboard regularly to catch issues early and maintain high code quality!

*Last updated: $(date)*