# Firestore Security Rules Guide

## What Security Rules Do

### Rule System Overview
Firestore Security Rules are a declarative language that determines who can access and modify your database. They run on Firebase's servers, meaning your security logic executes before any data leaves the database—even if malicious users bypass your app's client-side validation.

### User-Scoped Access
Rules in this project enforce **user-scoped data isolation**. Each user can only read and write their own calculations. This means:
- User A cannot see User B's calculations
- User A cannot modify User B's calculations
- The database respects user identity boundaries automatically

### Privacy Guarantees
By implementing these rules:
- **Client-side bypasses don't matter** — malicious app modifications can't access other users' data
- **Direct database access is blocked** — tools like Firebase console require authentication
- **Data is isolated by default** — no calculation leaks between users
- **Compliance-ready** — supports data privacy requirements

---

## Rules to Deploy

Copy and deploy these exact rules to your Firestore database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /calculations/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

These rules:
- Use Firestore Security Rules v2 (the current standard)
- Target the `cloud.firestore` service
- Match all documents under `/calculations/{userId}/` and nested subcollections
- Grant read and write permissions only to authenticated users whose ID matches the path

---

## Step-by-Step Deploy Instructions

### 1. Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (calnote)

### 2. Navigate to Firestore Rules
1. In the left sidebar, click **Firestore Database**
2. Click the **Rules** tab at the top

### 3. Replace Default Rules
1. You'll see the default rules (typically allow all in development mode)
2. Select all the text in the editor
3. Delete it
4. Paste the rules shown above exactly as written

### 4. Click Publish
1. Click the **Publish** button in the top-right corner
2. Firebase will validate the rules syntax
3. If valid, you'll see "Rules updated" confirmation
4. The rules are now live—changes take effect immediately

### 5. Verify Deployment
1. Wait 30 seconds for rules to propagate to all Firebase servers
2. Reload your app and test that authenticated users can still read/write their data
3. Check that unauthenticated requests are rejected
4. Verify cross-user access is blocked

---

## What Each Line Does

### Line 1: `rules_version = '2';`
- Specifies the Firestore Security Rules language version
- Version 2 is required for modern rules syntax
- Always include this as the first line

### Line 2: `service cloud.firestore {`
- Declares that rules apply to Cloud Firestore
- Firebase supports multiple services (Realtime Database, Storage); this specifies Firestore

### Line 3: `match /databases/{database}/documents {`
- Matches the root of your Firestore database
- `{database}` is a variable matching any database (your project has one default database)
- `documents` is required to match the documents service

### Line 4: `match /calculations/{userId}/{document=**} {`
- `match` defines a path pattern
- `/calculations/{userId}/` — matches the calculations collection, with userId as a path variable
- `{document=**}` — recursively matches any subcollections and documents nested under this path
  - `**` is a wildcard that matches zero or more path segments
  - This allows users to create nested subcollections without writing additional rules

### Line 5: `allow read, write: if request.auth.uid == userId;`
- `allow read, write` — grants both read and write permissions (create, update, delete, get, list)
- `request.auth.uid` — the unique ID of the authenticated user making the request
- `== userId` — compares the user's ID to the path variable userId
- **The security check**: user can only access `/calculations/{their_uid}/...`

### Line 6-7: Closing braces
- Close the match blocks in reverse order
- Required for valid syntax

---

## Testing the Rules

### Verify Rules Work

#### Test 1: Authenticated User Reads Own Data
1. Log in to your app as `user@example.com`
2. Create a calculation (should succeed)
3. Refresh the page
4. Verify the calculation loads (rule allowed the read)

**Expected result**: ✅ Calculation displays

#### Test 2: Authenticated User Writes Own Data
1. Log in to your app
2. Create a new calculation
3. Verify it saves without errors

**Expected result**: ✅ New calculation created

#### Test 3: Prevent Cross-User Access
1. In the [Firebase Console](https://console.firebase.google.com):
   - Go to Firestore Database
   - Click the **Data** tab
   - Manually navigate to `/calculations/{other_user_uid}/` documents
2. The console will show: **"This document is not accessible"**

**Expected result**: ✅ Access denied (you don't own that user's ID)

#### Test 4: Unauthenticated User Blocked
1. Open an incognito/private browser window
2. Go to your app URL
3. Try to access the Firestore database directly via console:
   ```javascript
   db.collection('calculations').get()
   ```
4. You'll see a permission error

**Expected result**: ✅ Request denied with `FirebaseError: Missing or insufficient permissions`

### What Happens If Rules Are Wrong

If you deploy incorrect rules, here are common failures:

#### Issue: Typo in userId path
```
match /calcuations/{userId}/...  // Typo: "calcuations"
```
**Result**: Rules don't match `/calculations/` paths → all calculations fail to load

#### Issue: Using `==` instead of `!=`
```
allow read, write: if request.auth.uid != userId;  // Wrong comparison
```
**Result**: Users can only access OTHER users' data, not their own

#### Issue: Missing authentication check
```
allow read, write: if true;  // No uid check
```
**Result**: Anyone, even unauthenticated, can read/write all data

#### Issue: Too restrictive (read-only)
```
allow read: if request.auth.uid == userId;
allow write: if false;
```
**Result**: Users can read but not create/update calculations

### Debugging Rule Denials

When users report "can't save calculation" or similar errors:

#### Step 1: Check Browser Console
```
FirebaseError: Missing or insufficient permissions
```
This message indicates a rule denied the request.

#### Step 2: Verify User Authentication
In your app's JavaScript console:
```javascript
firebase.auth().currentUser.uid
```
Copy the UID—this is what `request.auth.uid` will be.

#### Step 3: Check Firestore Data Path
When the user saves, verify the path matches the rule:
- User UID: `abc123`
- Calculation should save to: `/calculations/abc123/...`
- Rule will check: `request.auth.uid (abc123) == userId (abc123)` ✅

#### Step 4: Use Firebase Console Rules Simulator (Pro Tip)
1. In [Firebase Console](https://console.firebase.google.com)
2. Go to Firestore → Rules tab
3. Click **Simulator** (bottom-right)
4. Choose operation: `get`, `create`, `update`, `delete`, etc.
5. Enter path: `/calculations/{user_uid}/{doc_path}`
6. Under **Authentication**, select **Custom** and paste a test UID
7. Click **Run**
8. You'll see exactly why the request was denied

**Example Simulation**:
- Operation: `get`
- Path: `/calculations/user_123/budget-calc`
- Auth: `user_123` (custom)
- Result: ✅ Allows `request.auth.uid (user_123) == userId (user_123)`

#### Step 5: Check User is Signed In
The most common issue: user isn't authenticated.
```javascript
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log('Signed in:', user.uid);
  } else {
    console.log('Not signed in — rules will deny all access');
  }
});
```

---

## Security Best Practices

- **Always require authentication** — Never use `allow ... if true;`
- **Match identity to paths** — Use `request.auth.uid` to verify ownership
- **Use specific paths** — Avoid top-level `allow` rules that affect everything
- **Test with real users** — Use the Firebase Console Simulator before deploying to production
- **Review rules regularly** — As your app grows, update rules to match new collections

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| "Missing or insufficient permissions" | Rules denied the request | Check user is signed in and matches path |
| Calculations won't save | Wrong path or incorrect rule syntax | Use Simulator to debug exact reason |
| Users see other users' data | Rule missing uid comparison | Verify `request.auth.uid == userId` |
| Rules won't publish | Syntax error in rule text | Check for typos and matching braces |
| App still works after publishing | Rules have latency | Wait 30-60 seconds and refresh app |

---

## Next Steps

1. **Deploy these rules now** — Follow Step-by-Step Deploy Instructions above
2. **Test thoroughly** — Use all verification tests before going to production
3. **Monitor errors** — Watch Firebase Console for rule denial patterns
4. **Plan for scale** — As you add more collections, add rules for each collection

Your Firestore database is now secure with user-scoped access control! 🔒
