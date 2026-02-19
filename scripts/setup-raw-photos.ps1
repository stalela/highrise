# setup-raw-photos.ps1
# ──────────────────────────────────────────────────────────
# Copies/renames your 4 fleet photos into images/raw/
#
# OPTION A: Pass paths explicitly
#   .\scripts\setup-raw-photos.ps1 photo1.jpg photo2.jpg photo3.jpg photo4.jpg
#
# OPTION B: Drop 4 images onto this script in Explorer
#
# Photo order:
#   1 → fleet-1.jpg  (Komatsu excavator loading Scania)
#   2 → fleet-2.jpg  (DAF tipper truck parked)
#   3 → fleet-3.jpg  (Excavator + Scania second angle)
#   4 → fleet-4.jpg  (Scania loaded with red soil)

param(
  [string]$Photo1,
  [string]$Photo2,
  [string]$Photo3,
  [string]$Photo4
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RawDir    = Join-Path $ScriptDir "..\images\raw"
New-Item -ItemType Directory -Force -Path $RawDir | Out-Null

$Names = @("fleet-1", "fleet-2", "fleet-3", "fleet-4")
$Photos = @($Photo1, $Photo2, $Photo3, $Photo4)

# If no args, search recent images in Downloads/Pictures/Desktop
if (-not $Photo1) {
  $SearchDirs = @(
    "$env:USERPROFILE\Downloads",
    "$env:USERPROFILE\Pictures",
    "$env:USERPROFILE\Desktop"
  )

  Write-Host "`nSearching for recent images in Downloads, Pictures, Desktop..." -ForegroundColor Cyan

  $Found = Get-ChildItem -Path $SearchDirs -Include "*.jpg","*.jpeg","*.png" -Recurse -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 4 -ExpandProperty FullName

  if ($Found.Count -lt 4) {
    Write-Host "`n❌  Could not auto-find 4 images." -ForegroundColor Red
    Write-Host "`nPlease save the 4 chat images directly to:" -ForegroundColor Yellow
    Write-Host "   $RawDir\" -ForegroundColor White
    Write-Host "`nWith these exact filenames:" -ForegroundColor Yellow
    Write-Host "   fleet-1.jpg  — Komatsu excavator loading Scania" -ForegroundColor White
    Write-Host "   fleet-2.jpg  — DAF tipper truck parked" -ForegroundColor White
    Write-Host "   fleet-3.jpg  — Excavator + Scania second angle" -ForegroundColor White
    Write-Host "   fleet-4.jpg  — Scania loaded with red soil" -ForegroundColor White
    exit 1
  }

  Write-Host "`nFound $($Found.Count) images:" -ForegroundColor Green
  for ($i = 0; $i -lt $Found.Count; $i++) {
    Write-Host "  $($i+1). $($Found[$i])"
  }
  Write-Host ""
  $confirm = Read-Host "Use these in this order? (y/N)"
  if ($confirm -notmatch "^[Yy]$") { Write-Host "Aborted."; exit 1 }

  $Photos = $Found
}

for ($i = 0; $i -lt 4; $i++) {
  $Src  = $Photos[$i]
  $Dest = Join-Path $RawDir "$($Names[$i]).jpg"
  Copy-Item -Path $Src -Destination $Dest -Force
  Write-Host "✅  $(Split-Path -Leaf $Src)  →  images\raw\$($Names[$i]).jpg" -ForegroundColor Green
}

Write-Host "`n✨  All 4 photos ready in images\raw\" -ForegroundColor Green
Write-Host "`nNow run:" -ForegroundColor Cyan
Write-Host "   npx ts-node --esm scripts/edit-real-images.ts" -ForegroundColor White
