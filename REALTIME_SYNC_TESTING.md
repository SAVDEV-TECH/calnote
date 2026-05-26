# Real-Time Sync Testing Guide

This guide provides comprehensive instructions for testing real-time synchronization across multiple browser windows/tabs using Firestore.

## Before Testing

- TWO browser windows or tabs open
- SAME Firebase project
- SAME user account logged in on both
- Both at http://localhost:3000
- Both showing Calculator tab or History tab

## Setup: Open Two Windows

1. **Window A**: http://localhost:3000 (logged in)
2. **Window B**: http://localhost:3000 (logged in, SAME account)
3. Both should show your email in header

## Test 1: Create in Window A, Appears in Window B

1. In **Window A**: Create calculation `10 + 20 = 30`
2. In **Window A**: Add caption "Sync test"
3. In **Window A**: Click Save
4. In **Window A**: Switches to History, shows new calculation
5. **NOW LOOK AT WINDOW B HISTORY**:
   - **Expected**: The SAME calculation appears in Window B history!
   - **Expected**: Instant update (within 1-2 seconds)
   - **Expected**: No need to refresh Window B
   - **Note**: If History tab was open when you saved, it should auto-update

## Test 2: Create in Window B, Appears in Window A

1. In **Window B**: Create calculation `5 × 5 = 25`
2. In **Window B**: Add caption "From Window B"
3. In **Window B**: Click Save
4. **NOW LOOK AT WINDOW A HISTORY**:
   - **Expected**: Shows up automatically
   - **Expected**: No page refresh needed

## Test 3: Search Syncs

1. In **Window A**: In History, search for "Window B"
   - **Expected**: Shows the "From Window B" calculation
2. In **Window A**: Clear search
3. In **Window B**: Search for "Sync test"
   - **Expected**: Shows the first calculation
   - **Expected**: Each tab maintains its own search independently

## Test 4: Delete Syncs

1. In **Window A History**: Find a calculation
2. Click delete button
3. Confirm delete
4. **Expected**: Disappears from Window A
5. **NOW LOOK AT WINDOW B**:
   - **Expected**: SAME calculation also disappears
   - **Expected**: Instant sync, no refresh needed

## Test 5: Multiple Saves in Quick Succession

1. In **Window A**: Create 3 calculations quickly
2. Save each with different captions
3. Watch **Window B** history in real-time
4. **Expected**: Each calculation appears as you save
5. **Expected**: No duplicates
6. **Expected**: All appear in history

## Test 6: Real-time with Both Calculating

1. **Window A**: Calculating in calculator
2. **Window B**: Calculating in calculator
3. **Window A**: Save `40 + 60 = 100`
4. **Window B**: Save `20 + 30 = 50`
5. Both click Save simultaneously
6. Go to History in **Window A**:
   - **Expected**: See BOTH calculations
   - **Expected**: No conflicts, both saved
7. Go to History in **Window B**:
   - **Expected**: See BOTH calculations (same list)

## Test 7: Close and Reopen

1. In **Window B**: Close the tab completely
2. In **Window A**: Create calculation `7 + 8 = 15`
3. Save with caption
4. Open **Window B** again (same URL)
5. Log in (same account)
6. Go to History:
   - **Expected**: See the calculation from step 2
   - **Expected**: Data persisted in cloud

## Test 8: Different Devices (if possible)

1. **Phone**: Open http://localhost:3000 (might need local network IP)
2. **Laptop**: Open http://localhost:3000
3. Log in with SAME account on both
4. Create calculation on phone
5. **Expected**: Appears on laptop instantly
6. **Expected**: Demonstrates true cloud sync

---

## Notes for Testers

- Watch browser developer tools (F12) Network tab if you want to see Firestore real-time updates
- Check browser console for any sync errors
- Ensure internet connection is stable between both windows
- Clear browser cache if encountering unexpected behavior
- Firestore listeners should automatically update UI without manual refresh
