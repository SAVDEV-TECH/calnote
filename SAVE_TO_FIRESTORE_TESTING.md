# Firestore Save Testing Guide

## Before Testing
- [ ] Logged in to app
- [ ] On Calculator tab
- [ ] Have Firebase Console open in another tab

## Test 1: Create Calculation
**Steps:**
1. Enter: `15 + 25`
2. Click `=`

**Expected Results:**
- Result shows `"40"`
- `"Save with Caption"` button is enabled (not grayed out)

## Test 2: Click Save Button
**Steps:**
1. Click `"Save with Caption"` button

**Expected Results:**
- CaptionModal opens
- Shows: `"15 + 25"` and `"= 40"`
- Cursor in caption textarea
- Mic button visible

## Test 3: Add Text Caption
**Steps:**
1. Type: `"My first calculation"`
2. Click `"Save Record"`

**Expected Results:**
- Text appears in textarea
- Save button becomes enabled
- Modal closes
- Switches to History tab
- Your calculation appears in history!

## Test 4: Verify in Firestore Console
**Steps:**
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Look at `"calculations"` collection
4. Expand `{userId}` folder

**Expected Results:**
- See your calculation with:
  - `expression`: `"15 + 25"`
  - `result`: `"40"`
  - `caption`: `"My first calculation"`
  - `is_voice_caption`: `false`
  - `created_at`: timestamp

## Test 5: Multiple Calculations
**Steps:**
1. Go back to Calculator tab
2. Create another: `100 - 30 = 70`
3. Add caption: `"Quarterly math"`
4. Save

**Expected Results:**
- Now see TWO calculations in History
- Newest first (reverse chronological order)

## Test 6: Empty Caption Not Allowed
**Steps:**
1. Create calculation: `2 × 3 = 6`
2. Click `"Save with Caption"`
3. Try clicking `"Save Record"` without typing anything

**Expected Results:**
- Button stays disabled (grayed out)
- Can't save without caption

## Test 7: Search Works
**Steps:**
1. In History, search for: `"quarterly"`
2. Clear search

**Expected Results:**
- Only `"Quarterly math"` calculation shows
- After clearing, all calculations visible again

## Test Results Summary
| Test # | Name | Status | Notes |
|--------|------|--------|-------|
| 1 | Create Calculation | ⏳ Pending | |
| 2 | Click Save Button | ⏳ Pending | |
| 3 | Add Text Caption | ⏳ Pending | |
| 4 | Verify in Firestore | ⏳ Pending | |
| 5 | Multiple Calculations | ⏳ Pending | |
| 6 | Empty Caption Validation | ⏳ Pending | |
| 7 | Search Functionality | ⏳ Pending | |

---

**Test Date:** ___________  
**Tester Name:** ___________  
**Overall Status:** ⏳ Not Started
