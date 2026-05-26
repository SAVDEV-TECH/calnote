# CalcNote Deployment Guide

## Pre-Deployment Checklist

- [ ] npm install firebase (completed)
- [ ] .env.local created with dev Firebase credentials
- [ ] All testing guides completed and tested
- [ ] App working locally at http://localhost:3000
- [ ] Calculator sounds, particles, animations working
- [ ] Auth flow (signup/login/logout) working
- [ ] Saving calculations to Firestore working
- [ ] History loading and syncing in real-time
- [ ] Voice caption working
- [ ] Real-time sync across tabs working

## Step 1: Create Production Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a **NEW Firebase project for production**
   - Name: "CalcNote-Production" (or similar)
3. Enable same services:
   - Firestore Database
   - Authentication
4. Get new credentials from Project Settings
5. **Keep these SEPARATE from development credentials**

## Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/log in with GitHub account
3. Click "Add New" → "Project"
4. Import your GitHub repository (fork if needed)
5. Configure deployment settings:
   - **Framework:** Next.js (auto-detected)
   - **Root directory:** . (root)
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
6. Click "Deploy"
7. Wait for build to complete (typically 3-5 minutes)

## Step 3: Add Production Environment Variables

1. In Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add all 6 Firebase production credentials:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Set `NEXT_PUBLIC_USE_EMULATOR=false`
5. Redeploy project after setting variables

## Step 4: Setup Firestore Production Rules

1. In production Firebase project
2. Navigate to **Firestore → Rules**
3. Deploy the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /calculations/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

4. Click "Publish" to deploy rules

## Step 5: Test Production Deployment

1. Click the Vercel deployment link
2. You should see the CalcNote app
3. Test the following features:
   - Sign up new account (or use existing)
   - Test calculator operations
   - Verify sound and particles work
   - Create and save a calculation
   - Check Firestore console - data should appear
   - Test real-time sync on multiple tabs
   - Verify history loads correctly

## Step 6: Custom Domain (Optional)

1. In Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions
5. Verify domain ownership
6. App now accessible at your custom domain!

## Step 7: Monitor in Production

### Vercel Dashboard
- Monitor build status
- Check function logs for errors
- Track deployment history

### Firebase Console
- Monitor Firestore usage and costs
- Monitor authentication activity
- Review security rules

### Additional Monitoring
- Consider setting up email alerts for errors
- Set budget alerts in Firebase to control costs

## Step 8: Rollback Plan

In case of issues:
- **Local backups:** Keep local .env files backed up
- **Credentials:** Keep old Firebase credentials safe
- **Vercel:** Can redeploy previous versions via dashboard
- **Firebase:** Can export/backup Firestore data
- **GitHub:** All commits are preserved for rollback

## Troubleshooting Production Issues

| Issue | Solution |
|-------|----------|
| App blank or 404 | Check Vercel build logs for errors |
| Firebase connection failing | Verify env vars match production credentials |
| Auth not working | Check Firebase project has Authentication enabled |
| No data showing | Check Firestore security rules and user authentication |
| Sounds not working | Check browser audio permissions and console for errors |
| Real-time sync not working | Check Firestore listeners in browser console |

## Performance Optimization

- **Build Size:** Check Vercel build size report
- **Firebase Usage:** Monitor read/write operations
- **Caching:** Consider implementing caching strategies
- **Real-time Listeners:** Monitor subscription count to avoid exceeding limits

## Security Checklist

- ✅ API keys prefixed with `NEXT_PUBLIC_` (safe for client-side)
- ✅ Firestore rules restrict access by `userId`
- ✅ No secrets in `.env.example`
- ✅ Passwords hashed and managed by Firebase Authentication
- ✅ HTTPS enforced by Vercel by default
- ✅ Environment variables stored securely in Vercel

## Quick Reference

### Useful Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)
- [Next.js Documentation](https://nextjs.org/docs)

### Environment Variables
All variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_USE_EMULATOR=false
```

## Support & Additional Resources

For issues or questions:
- Check Vercel logs: `vercel logs <deployment-url>`
- Review Firebase documentation for Firestore and Auth
- Check Next.js documentation for deployment specifics
- Test locally first with `.env.local` before deploying
