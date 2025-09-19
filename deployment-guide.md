# ExeSecure AI Deployment Guide

## 🚀 Quick Deploy (Recommended)

### Prerequisites
- Node.js 18+ installed
- Git repository set up
- Supabase account

### 1. Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
# VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Backend Deployment (Supabase)

```bash
# Install Supabase CLI
npm install -g supabase

# Login and setup
supabase login
supabase link --project-ref YOUR_PROJECT_ID

# Deploy edge functions
supabase functions deploy server

# Set secrets in Supabase dashboard
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🌐 Alternative Hosting Options

### Netlify
1. Connect GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use different keys for production vs development
- Rotate keys regularly

### Supabase Security
- Enable Row Level Security (RLS)
- Configure proper API permissions
- Use service role key only on server-side

## 🚨 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Supabase Function Issues
```bash
# Check function logs
supabase functions logs server

# Test locally
supabase functions serve
```

### CORS Issues
- Ensure your domain is added to Supabase allowed origins
- Check API endpoints are correctly configured

## 📊 Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Monitor performance and usage

### Supabase Monitoring
- Check function invocations
- Monitor database performance
- Set up alerts for errors

## 🔄 CI/CD Setup

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## ✅ Post-Deployment Checklist

- [ ] Test all authentication flows
- [ ] Verify biometric verification works
- [ ] Check camera permissions
- [ ] Test cancel functionality
- [ ] Verify AI assistant responds
- [ ] Test exam monitoring features
- [ ] Check fraud detection
- [ ] Verify analytics display
- [ ] Test on mobile devices
- [ ] Check all API endpoints
- [ ] Monitor error logs

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Check Supabase function logs
3. Verify environment variables
4. Test API endpoints manually
5. Check browser console for errors