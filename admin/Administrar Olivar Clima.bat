@echo off
title Administrador Olivar Clima
color 2F
cd /d "%~dp0.."
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles%\Git\cmd;%PATH%"
set GIT_TERMINAL_PROMPT=
set GCM_INTERACTIVE=

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Falta instalar Node.js en este computador.
  echo   Descargalo desde https://nodejs.org e intenta de nuevo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo   Preparando por primera vez, espera un momento...
  call npm install --no-fund --no-audit
)

node admin\server.mjs
pause
