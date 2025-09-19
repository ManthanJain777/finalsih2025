#!/bin/bash

# ExeSecure AI Deployment Script
echo "🚀 Starting ExeSecure AI deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# Deploy Supabase functions
echo "⚡ Deploying Supabase functions..."
supabase functions deploy server

echo "✅ Deployment complete!"
echo "🔗 Your app should be live at your Vercel domain"
echo "📧 Check your email for deployment confirmation"

# Optional: Open the deployed site
# vercel --prod --open