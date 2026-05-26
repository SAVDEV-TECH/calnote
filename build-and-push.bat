@echo off
REM Build and push CalNote to GitHub

echo.
echo ========================================
echo Building Next.js project...
echo ========================================
cd c:\Users\savde\Documents\Project\calnote
npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Build failed! Check the errors above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build successful! Checking git status...
echo ========================================
git status

echo.
echo ========================================
echo Staging all changes...
echo ========================================
git add -A

echo.
echo ========================================
echo Committing changes...
echo ========================================
git commit -m "Feat: Enhanced calculator UX with Firebase, Firestore, and history details view

- Implemented Firebase authentication with email/password signup and login
- Integrated Firestore for cloud database storage with user-scoped collections
- Added rich button interactions: sound effects, particle animations, glow, bounce, shrink
- Created interactive history timeline with clickable calculation details modal
- Added vertical scrolling to history list with smooth animations
- Reorganized layout: moved tabs from bottom to top for better UX
- Fixed Firestore path structure to match security rules
- Fixed CaptionModal state management and speech recognition
- Added error boundaries and delete confirmation modals
- Removed duplicate bottom navigation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Git commit failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Pushing to GitHub...
echo ========================================
git push

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Git push failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Changes pushed to GitHub!
echo ========================================
pause
