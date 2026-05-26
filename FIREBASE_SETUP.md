# Firebase Setup Guide for CalNote

This guide will walk you through setting up Firebase for the CalNote project. Follow each section carefully.

---

## Step 1: Step-by-Step Firebase Project Creation

### 1.1 Go to Firebase Console
- Navigate to [Firebase Console](https://console.firebase.google.com/)
- Sign in with your Google account (create one if needed)

### 1.2 Create a New Project
1. Click the **"Create a project"** button (or **"Add project"** if you have existing projects)
2. Enter project name: **CalNote** (or your preferred name)
3. Click **"Continue"**
4. You'll be asked about Google Analytics - choose **"Enable Google Analytics"** (optional but recommended)
5. Select or create a Google Analytics account, then click **"Create project"**
6. Wait for the project to be created (this takes a few moments)

### 1.3 Enable Firestore Database
1. In the Firebase Console, go to **Build** → **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose location: Select the region closest to you (e.g., **us-central1** for USA)
4. Select **"Production mode"** (not testing mode - you'll add security rules later)
5. Click **"Enable"**
6. Wait for Firestore to initialize

### 1.4 Enable Authentication (Email/Password)
1. Go to **Build** → **Authentication** (left sidebar)
2. Click **"Get started"**
3. Find **Email/Password** in the list of sign-in methods
4. Click on it, then toggle **"Enable"** to turn it on
5. Click **"Save"**

### 1.5 Copy Your Credentials
Keep this page open - you'll need information from here in the next step.

---

## Step 2: Getting Your Credentials

### 2.1 Access Project Settings
1. In the Firebase Console, click the **gear icon** ⚙️ at the top left
2. Click **"Project Settings"**

### 2.2 Find Your Web App Configuration
1. Scroll down to the **"Your apps"** section
2. If you don't see a web app, click the **"</>"** (web) icon to create one
3. Enter app name: **CalNote Web** (or any name)
4. Click **"Register app"**
5. You'll see a code snippet with your configuration

### 2.3 Copy These Values
You'll need the following values from your configuration:
```
apiKey: "YOUR_API_KEY"
authDomain: "YOUR_PROJECT_ID.firebaseapp.com"
projectId: "YOUR_PROJECT_ID"
storageBucket: "YOUR_PROJECT_ID.appspot.com"
messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
appId: "YOUR_APP_ID"
```

**Important:** These values are shown in the registration page. Save them somewhere safe - you'll need them for the next step.

---

## Step 3: Creating .env.local

### 3.1 Locate the File
In your CalNote project root directory, you should have a `.env.example` file.

### 3.2 Create .env.local
1. Copy `.env.example` and rename it to `.env.local`
2. Open `.env.local` in your text editor

### 3.3 Fill in Your Firebase Credentials
Replace the placeholder values with the actual values from Step 2. Your `.env.local` should look like this:

```
# Firebase Configuration
# Get these values from Firebase Console > Project Settings > Your apps > Web app config

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrst
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=calnote-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=calnote-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=calnote-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890ghij

# Optional: Add more environment variables as needed
```

### 3.4 Variable Explanations

| Variable | Where to Find | Purpose |
|----------|---------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console > Project Settings > Web app config > apiKey | Identifies your Firebase project to the Google servers |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console > Project Settings > Web app config > authDomain | Domain used for authentication redirects |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console > Project Settings > General > Project ID | Unique identifier for your Firebase project |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console > Project Settings > Web app config > storageBucket | Storage bucket for your project |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console > Project Settings > Web app config > messagingSenderId | Used for push notifications |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console > Project Settings > Web app config > appId | Unique identifier for your web app |

**Note:** The `NEXT_PUBLIC_` prefix means these values are exposed to the browser (they're not secret). This is fine because Firebase API keys are meant to be public and are secured by Firestore rules.

### 3.5 Save the File
Save `.env.local` in your project root. **Do NOT commit this file to git** - it's already in `.gitignore`.

---

## Step 4: Firestore Security Rules

### 4.1 Understanding Security Rules
Firestore security rules protect your database. With production mode enabled, no one can read or write without proper rules.

### 4.2 Security Rules for Development
Copy the following rules for a development environment:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own user document
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Allow authenticated users to read/write their own events
    match /users/{uid}/events/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }

    // Allow authenticated users to read/write their own settings
    match /users/{uid}/settings/{document=**} {
      allow read, write: if request.auth.uid == uid;
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4.3 What These Rules Do
- **Allow authenticated users to read/write their own data:** Users can only access documents in `/users/{uid}` where `{uid}` matches their authentication UID
- **Organize data by user:** Each user has their own `events` and `settings` subcollections
- **Deny all other access:** Any access not explicitly allowed is denied by default
- **Security:** Users cannot access other users' data or create unauthorized collections

### 4.4 How to Apply These Rules
1. Go to **Firebase Console** → **Firestore Database**
2. Click the **"Rules"** tab at the top
3. Delete any existing rules
4. Paste the rules from Section 4.2
5. Click **"Publish"**
6. Wait for the publish to complete (should take a few seconds)

### 4.5 For Production
For a production environment, you may want stricter rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow writes to validated data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow create: if request.resource.data.size() <= 50
                    && request.resource.data.keys().hasAll(['email', 'createdAt']);
    }

    match /users/{uid}/events/{eventId} {
      allow read, write: if request.auth.uid == uid;
      allow create: if request.resource.data.size() <= 100;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Step 5: Verification Steps

### 5.1 Check if Setup is Complete
Follow this checklist:

- [ ] Firebase project created and visible in Firebase Console
- [ ] Firestore Database enabled and in "Production mode"
- [ ] Authentication enabled with Email/Password sign-in method
- [ ] `.env.local` file created with all 6 Firebase configuration variables
- [ ] Security rules published to Firestore
- [ ] `.env.local` is NOT committed to git (check `.gitignore`)

### 5.2 Test Your Credentials Work

#### Test 1: Start Your Development Server
```bash
npm run dev
```

The app should start without errors related to Firebase credentials.

#### Test 2: Check Browser Console
1. Open your app at `http://localhost:3000`
2. Open browser DevTools (F12 or Cmd+Option+I)
3. Go to the **Console** tab
4. You should NOT see Firebase-related errors
5. Look for any red errors starting with "Firebase" - if present, your credentials are wrong

#### Test 3: Test Authentication
1. Try to sign up with a test account
2. If signup works, your credentials are correct
3. If you get errors like "Cannot read property of undefined", check your `.env.local` file

#### Test 4: Verify Firestore Rules
1. After successfully creating an account, check Firebase Console → Firestore
2. Click **"Data"** tab
3. You should see a `users` collection with your user ID
4. If you can't see it after 30 seconds, your rules might be blocking writes

### 5.3 Common Success Signs
- ✅ App loads without console errors
- ✅ Sign up completes successfully
- ✅ User data appears in Firestore within 30 seconds
- ✅ You can log in and out

---

## Step 6: Troubleshooting

### Issue: "Cannot read properties of undefined (reading 'getAuth')"
**Cause:** Firebase configuration variables are missing or incorrect

**Solution:**
1. Check that `.env.local` exists in your project root
2. Verify all 6 variables are present and not empty
3. Verify values are copied exactly from Firebase Console (no extra spaces or quotes)
4. Restart your development server: `npm run dev`

---

### Issue: "Permission denied" or "PERMISSION_DENIED" errors
**Cause:** Firestore security rules not published or incorrect

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Verify the rules are published (click "Publish" if not)
3. Check that rules match the ones in Step 4.2
4. Wait 5-10 seconds for rules to propagate
5. Try signing up again

---

### Issue: Sign-up fails with "auth/invalid-email" or similar
**Cause:** Email/Password authentication not enabled in Firebase

**Solution:**
1. Go to Firebase Console → Authentication → Sign-in method
2. Check that "Email/Password" is enabled (toggle should be ON/blue)
3. If not enabled, click it and toggle ON
4. Try signing up again

---

### Issue: Sign-up succeeds but no user document appears in Firestore
**Cause:** Security rules are blocking write access or authentication not properly configured

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Verify the rules in Step 4.2 are exactly as shown
3. Verify they are published (click "Publish")
4. Check that the user is authenticated (check Authentication page - should see your account)
5. Wait 10 seconds and refresh Firestore data tab
6. If still not appearing, temporarily change rules to:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       allow read, write: if true;
     }
   }
   ```
   Try again, then switch back to secure rules if it works

---

### Issue: "apiKey is invalid" or "Invalid API key"
**Cause:** API key copied incorrectly or from wrong place

**Solution:**
1. Go to Firebase Console → Project Settings → Web app config
2. Copy the `apiKey` value exactly (it starts with "AIza...")
3. Paste it into `.env.local` as `NEXT_PUBLIC_FIREBASE_API_KEY`
4. Make sure there are NO extra spaces or quotes
5. Example: `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrst`
6. Restart your development server

---

### Issue: App loads but Firebase not working, no errors in console
**Cause:** `.env.local` not being read by Next.js

**Solution:**
1. Verify `.env.local` is in your project root (same level as `package.json`)
2. Stop your development server (Ctrl+C)
3. Delete `.next` folder: `rm -rf .next` (or delete via file explorer)
4. Start development server again: `npm run dev`
5. Check browser console for Firebase initialization messages

---

### Issue: Can't find "Web app config" in Project Settings
**Cause:** No web app registered for your project

**Solution:**
1. Go to Firebase Console → Project Settings
2. Scroll down to "Your apps" section
3. If it's empty, click the **"</>"** icon to add a web app
4. Follow the registration wizard
5. After registration, your config will appear

---

## Need More Help?

- **Firebase Documentation:** https://firebase.google.com/docs/firestore
- **Next.js Environment Variables:** https://nextjs.org/docs/basic-features/environment-variables
- **Firebase CLI:** Can be used for advanced setup, see https://firebase.google.com/docs/cli

---

## Security Reminders

⚠️ **Important Security Notes:**
- **Never commit `.env.local` to git** - it's in `.gitignore` for a reason
- **The API key is public** - that's normal for Firebase. It's secured by Firestore rules, not key secrecy
- **Always use security rules in production** - don't leave `allow read, write: if true`
- **Review Firestore rules regularly** - especially before going live
- **Test thoroughly** - make sure only authenticated users can access their own data

---

## Next Steps

After completing this setup:
1. ✅ Your app is ready for local development
2. 📝 Consider setting up additional Firestore collections for your specific needs
3. 🚀 When ready for production, review security rules in Step 4.5
4. 🔐 Set up Firebase Hosting for deployment (see Firebase Console → Hosting)

Congratulations! Your Firebase setup is complete! 🎉
