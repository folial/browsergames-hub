@echo off
cd /d "%~dp0"

echo.
echo === BrowserGames Hub: Deploy to GitHub Pages ===
echo.

git add .
git commit -m "Update BrowserGames Hub"
git push origin main

echo.
echo === Done. GitHub Pages should rebuild automatically. ===
echo.
pause
