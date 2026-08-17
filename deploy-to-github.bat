@echo off
cd /d "%~dp0"

echo.
echo === BrowserGames Hub: Deploy to GitHub Pages ===
echo.

git add .
git commit -m "Add Pixel Whack-a-Mole and Pixel Reaction Time games"
git push origin main

echo.
echo === Done. GitHub Pages should rebuild automatically. ===
echo.
pause