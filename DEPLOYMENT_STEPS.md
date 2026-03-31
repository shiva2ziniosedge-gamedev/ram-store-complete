# RAM Store Deployment Guide

## What We're Deploying
- **Backend**: C# .NET API with SQLite database, email service
- **Frontend**: HTML/CSS/JS with PDF download feature
- **Features**: All current features will work (email, PDF, reviews, orders)

## Step 1: Deploy Backend to Railway

1. **Create Railway Account**:
   - Go to https://railway.app
   - Sign up with GitHub (free account)

2. **Prepare Repository**:
   - Create new GitHub repository
   - Upload ONLY the `Back-end/RamApi` folder contents to the repository root
   - Include: Program.cs, Controllers/, Models/, Services/, appsettings.json, etc.

3. **Deploy on Railway**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects .NET and builds
   - Wait 5-10 minutes for deployment
   - **COPY THE URL** (like: https://ramapi-production.railway.app)

## Step 2: Update Frontend

After getting Railway URL, tell me the URL and I'll update the frontend files.

## Step 3: Deploy Frontend to Netlify

1. **Create Netlify Account**:
   - Go to https://netlify.com
   - Sign up (free account)

2. **Deploy Frontend**:
   - Drag & drop the entire `front-end` folder to Netlify
   - Or connect GitHub repository
   - Netlify will give you a URL like: https://your-site-name.netlify.app

## Step 4: Test Everything

- Visit your Netlify URL
- Test placing orders (email should work)
- Test PDF downloads
- Test reviews system

## Features That Will Work:
✅ Email notifications (Gmail SMTP)
✅ PDF invoice downloads (client-side)
✅ SQLite database (persistent on Railway)
✅ Reviews system
✅ Order management
✅ All current functionality

## About PDF Email Attachments:
- We removed PDF email attachments (was causing issues)
- PDF still downloads in browser when order is placed
- Email contains order confirmation without PDF attachment

## Estimated Time: 30-45 minutes total
- Railway deployment: 10-15 minutes
- Frontend update: 2 minutes  
- Netlify deployment: 5 minutes
- Testing: 10-15 minutes

## Free Tier Limits:
- **Railway**: 500 hours/month (enough for testing)
- **Netlify**: 100GB bandwidth/month
- **Gmail**: 500 emails/day (plenty for orders)

## Custom Domain (Optional):
After deployment works, you can:
1. Buy domain from Namecheap/GoDaddy (~$10/year)
2. Point it to your Netlify site
3. Get custom URL like www.onlineramorder.com