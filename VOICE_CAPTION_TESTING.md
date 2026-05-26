# Voice Caption Testing Guide

## Before Testing

- [ ] Logged in to app
- [ ] Microphone is connected and working
- [ ] Browser has microphone permission (or will prompt)
- [ ] Volume is ON
- [ ] Using Chrome/Edge (best speech recognition support)

## Test 1: Voice Button Appears

**Steps:**
1. Create a calculation: 50 × 2 = 100
2. Click "Save with Caption"

**Expected Results:**
- Modal opens with caption textarea
- Mic button visible at bottom-right of textarea
- Mic button shows mic icon (not animating)

## Test 2: Click Mic Button

**Steps:**
1. Click the mic button
2. Click "Allow" on permission dialog (if first time)

**Expected Results:**
- Browser asks for microphone permission (if first time)
- Mic button shows loading spinner (animated)
- Mic button turns red

## Test 3: Speak Your Caption

**Steps:**
1. While mic is active (red button, spinning), speak clearly:
   - Example: "This is a test calculation"
2. Speak at normal volume, 1-2 sentences
3. Stop speaking

**Expected Results:**
- Mic stops listening (button returns to normal)
- Your words appear in caption textarea
- `is_voice_caption` marked TRUE in database

## Test 4: Multiple Voice Inputs

**Steps:**
1. Caption has: "This is a test"
2. Click mic again
3. Speak: "For quality assurance"

**Expected Results:**
- New words append to existing caption
- Caption now reads: "This is a test For quality assurance"
- Words separated by space

## Test 5: Voice + Manual Typing

**Steps:**
1. Click mic, speak: "Initial voice"
   - Result: "Initial voice"
2. Then type manually: " and more text"
   - Result: "Initial voice and more text"

**Expected Results:**
- Both voice and manual typing work together seamlessly

## Test 6: Browser Not Supporting Speech

**Steps:**
1. Try on Safari (might not support)

**Expected Results:**
- Error message appears
- Error message should say: "Speech recognition not supported in this browser"
- User can still type caption manually

## Test 7: Mic Permission Denied

**Steps:**
1. Deny microphone permission in browser
2. Click mic button

**Expected Results:**
- Error appears after a moment
- Error should say something like: "permission denied"
- User can still type caption

## Test 8: Verify Voice Flag in History

**Steps:**
1. After saving calculation with voice caption
2. Go to History tab
3. Look for your calculation
4. Hover over mic icon

**Expected Results:**
- Small mic icon badge appears on card
- Tooltip says "Captured via voice"

## Test 9: Check Firestore

**Steps:**
1. Open Firebase Console
2. Navigate to Firestore
3. Find your calculation with voice caption

**Expected Results:**
- `is_voice_caption` field = true
- `caption` contains your spoken words

---

## Testing Checklist

| Test | Status | Notes |
|------|--------|-------|
| Test 1: Voice Button Appears | ☐ | |
| Test 2: Click Mic Button | ☐ | |
| Test 3: Speak Your Caption | ☐ | |
| Test 4: Multiple Voice Inputs | ☐ | |
| Test 5: Voice + Manual Typing | ☐ | |
| Test 6: Browser Not Supporting Speech | ☐ | |
| Test 7: Mic Permission Denied | ☐ | |
| Test 8: Verify Voice Flag in History | ☐ | |
| Test 9: Check Firestore | ☐ | |

## Common Issues & Troubleshooting

### Mic button not appearing
- Ensure you've clicked "Save with Caption" button
- Check browser console for errors
- Verify microphone is connected

### Voice not being captured
- Check browser microphone permissions
- Ensure volume is ON
- Try speaking more clearly
- Test microphone in browser's microphone test

### Words not appending correctly
- Make sure to pause between voice captures
- Check for network delays

### Voice flag not showing in Firestore
- Refresh Firestore Console
- Check user's calculation document
- Verify `is_voice_caption` field exists

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best support for Web Speech API |
| Edge | ✅ Full | Chromium-based, same as Chrome |
| Firefox | ⚠️ Partial | May have limited support |
| Safari | ❌ No | Web Speech API not supported |
| Opera | ✅ Full | Chromium-based |

---

**Last Updated:** Testing guide created for voice caption feature
