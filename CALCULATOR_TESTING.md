# Calculator UX Testing Guide

Comprehensive testing guide for validating all calculator features, animations, sounds, and responsiveness.

---

## Before Testing

Before starting any tests, ensure the following prerequisites are met:

- ✓ You are logged in to the app
- ✓ You are on the "Calc" tab
- ✓ Browser volume is ON (system volume and browser volume)
- ✓ Using Chrome, Edge, or Firefox (best support for Web Audio API)
- ✓ Open browser DevTools Console (F12) to check for errors
- ✓ Use a desktop or laptop for initial testing (mobile tests come later)

---

## Test 1: Sound on Button Click

**Objective:** Verify that clicking calculator buttons produces an audible beep sound.

**Steps:**
1. Click any number button (example: "5")
2. Listen for audio feedback

**Expected Results:**
- You hear a beep sound play immediately
- Sound is approximately 800Hz frequency
- Sound duration is approximately 100ms
- Sound is clear and audible

**If No Sound Occurs:**
- Check system volume is not muted
- Check browser volume is not muted
- Check browser console (F12) for errors like "Web Audio not supported"
- Try a different browser (Chrome preferred)
- Verify microphone is not interfering with audio output

**Notes:** This is a critical UX feature for confirmation feedback.

---

## Test 2: Particle Effect

**Objective:** Verify that particles animate upward from buttons showing the clicked digit.

**Steps:**
1. Click button "7"
2. Observe the area around the button for floating particles
3. Watch the animation from start to finish

**Expected Results:**
- Exactly 3 particles appear showing the number "7"
- Particles float upward from the button center
- Particles gradually fade out as they float
- Animation duration is approximately 600ms
- Animation is smooth with no stuttering
- Particles disappear completely at end (no orphaned elements)

**If Not Visible:**
- Ensure you're watching the button clicked (animation happens near button)
- Check browser console for Framer Motion errors
- Try clicking multiple times to ensure particles always appear
- Try maximizing browser window (fullscreen mode helps visibility)
- Check if CSS transforms are supported: open DevTools > Rendering > check for transform support
- Try in a different browser

**Notes:** Particle effect should be visible immediately upon button click. If CSS animations are disabled in browser settings, this won't work.

---

## Test 3: Button Glow

**Objective:** Verify visual feedback when buttons are clicked using a glow/flash effect.

**Steps:**
1. Click any calculator button
2. Watch the button closely during the click
3. Observe the glow effect appearance and disappearance

**Expected Results:**
- A purple or accent color glow/flash appears on the button
- Glow is centered on the button
- Glow lasts approximately 200ms
- Glow fades smoothly (not abruptly)
- Effect is noticeable but not overwhelming

**If Not Visible:**
- The glow effect is subtle - watch carefully during the click
- Try clicking with good lighting conditions
- Ensure button doesn't have other visual effects obscuring the glow
- Check that theme colors are correctly set (should use accent/primary purple color)

**Notes:** This is a subtle effect - you need to watch closely. It's concurrent with the shrink animation.

---

## Test 4: Shrink Animation

**Objective:** Verify that buttons shrink and bounce back when clicked.

**Steps:**
1. Click any calculator button
2. Observe the button size during and after the click
3. Watch for the bounce/spring effect

**Expected Results:**
- Button shrinks to approximately 0.95 scale when clicked (5% smaller)
- Button smoothly bounces back to full size (1.0 scale)
- Entire animation completes in approximately 250ms total
- Animation feels natural with spring-like physics
- All buttons consistently show this effect

**If Not Visible:**
- Animation might be too fast to see - try slow-motion video (120fps) if available
- Ensure browser animations are not disabled
- Check browser console for animation library errors

**Notes:** This works best on desktop. Mobile touches may not trigger the animation as readily.

---

## Test 5: Keyboard Input

**Objective:** Verify that keyboard input works correctly for calculations.

**Steps:**

### 5.1 Number Input
1. Type "5" on keyboard
2. Type "3" on keyboard
3. Observe display

**Expected:** Display shows "53"

### 5.2 Basic Calculation
1. Type "5"
2. Type "+"
3. Type "3"
4. Press "="
5. Observe result

**Expected:** Display shows "8"

### 5.3 Backspace
1. Enter "123"
2. Press Backspace key
3. Observe display

**Expected:** Display shows "12" (last digit removed)

### 5.4 Escape Key
1. Enter "456"
2. Press Escape key
3. Observe display

**Expected:** Display is cleared (shows "0")

**If Issues Occur:**
- Check that the calculator input field has focus (click on display first)
- Verify keyboard layout (some non-US keyboards may have different behavior)
- Check browser console for input handling errors

**Notes:** These are standard calculator keyboard shortcuts. They should work on all browsers and platforms.

---

## Test 6: Long Expression Handling

**Objective:** Verify that the display correctly handles long mathematical expressions.

**Steps:**
1. Enter the expression: `123456789 × 987654321 + 123456789`
2. Press "=" to calculate
3. Observe display rendering, text size, and overflow behavior

**Expected Results:**
- Text does not overflow beyond display boundaries
- Font size automatically adapts (becomes smaller for longer numbers)
- Display remains readable even with very long numbers
- No horizontal scrolling occurs
- Entire result is visible

**Test Long Numbers:**
1. Enter "12345678901234567890"
2. Observe how display adapts

**Expected:** The number is either truncated, wrapped, or scaled down - but not hidden

**If Issues Occur:**
- Check CSS for display overflow properties
- Verify responsive font-size calculations are working
- Check if there's a max-width constraint affecting the display
- Try different browsers to see if rendering differs

**Notes:** This ensures the calculator is usable even with large mathematical results.

---

## Test 7: Math Errors

**Objective:** Verify proper handling of invalid mathematical operations.

**Steps:**

### 7.1 Division by Zero
1. Enter "5"
2. Click "÷"
3. Enter "0"
4. Press "="
5. Observe result

**Expected:** Display shows "Math Error" (NOT "Infinity" or blank)

### 7.2 Incomplete Expression
1. Enter "5"
2. Click "+"
3. Press "=" immediately
4. Observe behavior

**Expected:** Either completes the operation sensibly or shows an error message

### 7.3 Invalid Operations
1. Try any sequence that would cause an error
2. Verify error handling is graceful

**Expected:** App doesn't crash, error message is clear

**If Issues Occur:**
- Check browser console for uncaught JavaScript errors
- Verify Math Error handling is implemented in calculation engine
- Ensure error messages are user-friendly

**Notes:** Robust error handling is critical for user trust. The app should never crash or show confusing error codes.

---

## Test 8: Mobile Responsiveness

**Objective:** Verify that the calculator layout works correctly on mobile devices and smaller screens.

**Steps:**

### 8.1 Browser Resize
1. Open the calculator in a desktop browser
2. Resize browser window to mobile width (375px - typical mobile)
3. Observe layout changes

**Expected Results:**
- Buttons stack/organize properly for small screens
- Display remains readable
- No horizontal scrolling is required
- Buttons are still easily clickable (not too small)
- All features work the same way

### 8.2 Responsive Text
1. Enter a long calculation on mobile view
2. Observe how display text adjusts

**Expected:** Text scales appropriately for the screen size

### 8.3 Touch Interactions (if testing on actual device)
1. Tap number buttons
2. Verify sounds, particles, and animations work on touch
3. Check if touch is responsive (not delayed)

**Expected:** All animations and sounds work the same on touch as on desktop

### 8.4 Landscape Orientation (Actual Mobile)
1. Rotate device to landscape orientation
2. Verify layout adapts appropriately
3. Check calculations still work

**Expected:** Responsive design handles both portrait and landscape

**If Issues Occur:**
- Check media queries in CSS for mobile breakpoints
- Verify buttons have appropriate touch-target size (minimum 44x44px)
- Check that CSS flexbox/grid is responsive
- Test on actual mobile device (Chrome DevTools mobile emulation can be misleading)

**Notes:** Mobile testing is especially important. Always test on both emulation and real devices if possible.

---

## Testing Checklist

Use this checklist to track your testing progress:

- [ ] Test 1: Sound on Button Click
- [ ] Test 2: Particle Effect
- [ ] Test 3: Button Glow
- [ ] Test 4: Shrink Animation
- [ ] Test 5: Keyboard Input
- [ ] Test 6: Long Expression Handling
- [ ] Test 7: Math Errors
- [ ] Test 8: Mobile Responsiveness

---

## Known Issues & Limitations

Document any issues found here:

- Issue: [Describe]
  - Severity: [Critical / High / Medium / Low]
  - Browser: [Which browser]
  - Steps to Reproduce: [Steps]
  - Workaround: [If available]

---

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| Web Audio (Sound) | ✓ | ✓ | ✓ | ✓ |
| CSS Animations | ✓ | ✓ | ✓ | ✓ |
| Framer Motion | ✓ | ✓ | ✓ | ✓ |
| Keyboard Input | ✓ | ✓ | ✓ | ✓ |
| Mobile Responsive | ✓ | ✓ | ✓ | ✓ |

---

## Testing Environments

### Desktop Testing
- **OS:** Windows 10/11, macOS, Linux
- **Browsers:** Chrome (latest), Firefox (latest), Edge (latest)
- **Screen:** 1920x1080 (typical desktop)

### Mobile Testing
- **OS:** iOS (latest), Android (latest)
- **Browsers:** Safari, Chrome Mobile, Firefox Mobile
- **Screen Sizes:** 375px (iPhone), 412px (Android), various tablets

### Accessibility Testing
- Test with keyboard navigation only
- Test with screen reader enabled
- Verify sufficient color contrast for all UI elements
- Test animation can be disabled (prefers-reduced-motion)

---

## Reporting Test Results

When reporting issues, include:

1. **Environment:** Browser, OS, device, screen size
2. **Steps to Reproduce:** Exact steps that cause the issue
3. **Expected Result:** What should happen
4. **Actual Result:** What actually happened
5. **Severity:** Critical / High / Medium / Low
6. **Screenshots/Videos:** If applicable
7. **Console Errors:** Any errors from DevTools console

---

## Quick Reference: What to Listen/Look For

| Test | Sense | What to Notice |
|------|-------|-----------------|
| Sound | Hearing | Sharp beep, ~100ms duration, clear tone |
| Particles | Vision | 3 particles, float up, fade out, ~600ms |
| Glow | Vision | Purple flash, ~200ms, subtle |
| Shrink | Vision | 5% scale reduction, bounce back, ~250ms |
| Keyboard | Logic | Input appears correctly, calculations work |
| Long Text | Vision | No overflow, readable, adapts size |
| Math Error | Logic | "Math Error" displayed, not crash |
| Mobile | Vision | Layout flows, no scroll, readable |

---

## Notes for Developers

- All animations use Framer Motion for smooth transitions
- Audio is generated using Web Audio API (not pre-recorded files)
- Responsive design uses CSS media queries
- Keyboard input is handled by standard HTML input events
- Mobile touch events map to same handlers as mouse clicks

---

**Last Updated:** [Date of testing]

**Tester:** [Name]

**Overall Status:** [Pass / Fail / Partial Pass]
