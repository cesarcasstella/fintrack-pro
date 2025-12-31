# FinTrack Pro - Deployment Guide

## Prerequisites

- Node.js 20.x
- npm or pnpm
- Git
- Vercel CLI (optional)
- GitHub account
- Neon/Supabase account
- Twilio account (for WhatsApp)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/cesarcasstella/fintrack-pro.git
cd fintrack-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Supabase (if using Supabase Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-secure-secret

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Anthropic (for NLP parsing)
ANTHROPIC_API_KEY=your_api_key

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn
```

### 4. Setup Database

```bash
# Generate and push schema
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

## Local Development

```bash
# Start development server
npm run dev

# Run with HTTPS (for WhatsApp testing)
npm run dev:https

# Run tests
npm run test

# Run linting
npm run lint
```

## Deployment Environments

### Staging Deployment

Staging deploys automatically when pushing to `develop` branch.

**Manual deployment:**
```bash
vercel --env staging
```

**Staging URL:** https://staging.fintrack.app

### Production Deployment

Production deploys when creating a version tag.

**Steps:**
```bash
# 1. Ensure all tests pass
npm run test
npm run build

# 2. Merge develop to main
git checkout main
git merge develop
git push origin main

# 3. Create and push version tag
git tag v1.0.0
git push origin v1.0.0
```

**Production URL:** https://fintrack.app

## Vercel Configuration

### Project Setup

1. Import project in Vercel dashboard
2. Connect GitHub repository
3. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

| Variable | Environments |
|----------|--------------|
| DATABASE_URL | Production, Preview |
| NEXTAUTH_SECRET | Production, Preview |
| NEXTAUTH_URL | Production, Preview |
| TWILIO_* | Production, Preview |
| ANTHROPIC_API_KEY | Production, Preview |

### Domain Configuration

1. Add custom domain in Vercel
2. Configure DNS:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
3. Enable HTTPS (automatic)

## Database Migrations

### Development
```bash
# Create new migration
npm run db:generate

# Apply migration
npm run db:push

# View database
npm run db:studio
```

### Production
```bash
# Migrations run automatically in CI/CD
# Manual migration (if needed):
DATABASE_URL=production_url npx drizzle-kit push
```

## WhatsApp Integration

### Twilio Sandbox Setup

1. Go to Twilio Console → Messaging → Try It Out → WhatsApp
2. Follow instructions to join sandbox
3. Configure webhook URL:
   ```
   https://fintrack.app/api/webhooks/whatsapp
   ```

### Production WhatsApp

1. Apply for Twilio WhatsApp Business API
2. Get approved phone number
3. Update `TWILIO_WHATSAPP_NUMBER` in env

## Monitoring & Logging

### Vercel Analytics

Enabled by default. View in Vercel Dashboard → Analytics.

### Error Tracking (Sentry)

1. Create Sentry project
2. Add `SENTRY_DSN` to environment
3. Errors automatically captured

### Custom Logging

```typescript
// Logs visible in Vercel Functions logs
console.log('[Transaction]', { userId, amount });
console.error('[Error]', error);
```

## Health Checks

### Endpoint
```
GET /api/health
```

### Response
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Rollback Procedure

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

## Scaling Considerations

### Current Limits (Free/Pro Tier)
- Serverless function timeout: 10s (Free) / 60s (Pro)
- Bandwidth: 100GB/month
- Database connections: 10 concurrent

### When to Scale
- >1000 daily active users
- >10 concurrent database connections
- Function timeouts occurring

### Scaling Options
1. Upgrade Vercel plan
2. Add database read replicas
3. Implement Redis caching
4. Use connection pooling (PgBouncer)

## Security Checklist

- [ ] Environment variables not exposed in client
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Secrets rotated regularly
- [ ] Database backups configured
- [ ] Error messages don't leak sensitive info

## Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database connection error:**
```bash
# Check connection string
# Ensure IP is whitelisted in Neon/Supabase
```

**WhatsApp webhook not receiving:**
```bash
# Check Twilio logs
# Verify webhook URL is correct
# Ensure HTTPS is working
```

### Support

- GitHub Issues: https://github.com/cesarcasstella/fintrack-pro/issues
- Vercel Support: https://vercel.com/support
- Twilio Support: https://support.twilio.com
