# AI-Hire Netlify Deployment Guide

## 🚀 Deployment Steps:

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Choose GitHub
5. Select your AI-Hire repository
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

### 3. Set Environment Variables
In Netlify dashboard → Site settings → Environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_API_KEY=your_google_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_HOST_URL=https://your-site-name.netlify.app
VAPI_PUBLIC_KEY=your_vapi_public_key
```

### 4. Deploy Functions (Optional)
If you need serverless functions, create `netlify/functions/` directory.

### 5. Custom Domain (Optional)
- Go to Domain settings
- Add your custom domain
- Configure DNS

## ⚠️ Important Notes:
- Netlify works best with static sites
- For API routes, consider Vercel or Railway
- Make sure all environment variables are set
- Test the deployment thoroughly

## 🔧 Troubleshooting:
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are correct

