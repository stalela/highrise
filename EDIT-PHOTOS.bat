@echo off
cd /d "%~dp0.."
echo.
echo Checking for fleet photos in images\raw\...
echo.

if not exist "images\raw\fleet-1.jpg" goto :missing
if not exist "images\raw\fleet-2.jpg" goto :missing
if not exist "images\raw\fleet-3.jpg" goto :missing
if not exist "images\raw\fleet-4.jpg" goto :missing

echo All 4 photos found. Starting Wakanda AI edit...
echo.
npx ts-node --esm scripts/edit-real-images.ts
echo.
echo Done! Check public\images\real\ for your edited photos.
pause
goto :end

:missing
echo.
echo ERROR: Not all fleet photos found in images\raw\
echo.
echo Please save these files to:  %CD%\images\raw\
echo.
echo   fleet-1.jpg  -- Komatsu excavator loading Scania
echo   fleet-2.jpg  -- DAF tipper truck parked
echo   fleet-3.jpg  -- Excavator + Scania second angle
echo   fleet-4.jpg  -- Scania loaded with red soil
echo.
echo Then double-click this file again.
pause

:end
