# Authentication Testing Guide

## Before Testing

- Make sure `.env.local` is set with Firebase credentials
- Run: `npm run dev`
- App should open at http://localhost:3000

## Test 1: Sign Up Flow

- You should see a sign-up modal
- Enter email: `test@example.com`
- Enter password: `Test123456` (at least 6 chars)
- Click "Sign Up" button
- **Expected**: Modal closes, you're logged in
- **Verify**: User email shows in header (`test@example`)

## Test 2: Header Shows User

- After signup, check header for user email
- Should show `test` (email prefix)
- Should show "Sign out" button

## Test 3: Sign Out

- Click "Sign out" button in header
- **Expected**: Auth modal appears again
- **Expected**: Can sign up or sign in fresh

## Test 4: Sign In (after signing out)

- Click "Need an account? Sign in" toggle
- Enter SAME email: `test@example.com`
- Enter SAME password: `Test123456`
- Click "Sign In"
- **Expected**: Logged in again, header shows email

## Test 5: Try Wrong Password

- Sign out
- Try signing in with wrong password
- **Expected**: Error message appears
- **Expected**: Can retry

## Troubleshooting

| Error | Cause |
|-------|-------|
| `auth/invalid-email` | Email format is wrong |
| `auth/weak-password` | Password less than 6 chars |
| `auth/user-not-found` | Email doesn't exist for sign in |
| `auth/wrong-password` | Password is wrong |
| Connection error | Check `.env.local`, Firebase project |
