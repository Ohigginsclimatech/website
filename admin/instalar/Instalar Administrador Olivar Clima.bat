@echo off
title Instalador Olivar Clima
color 2F
set "PS1=%~dp0instalar.ps1"
if exist "%PS1%" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12'; iex ((New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/Ohigginsclimatech/website/main/admin/instalar/instalar.ps1'))"
)
echo.
pause
