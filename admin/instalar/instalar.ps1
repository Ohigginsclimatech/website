# ---------------------------------------------------------------
#  Instalador del Administrador de Olivar Clima
#  Prepara este computador para editar equipos y precios de la web.
#  (Texto sin tildes a proposito, para que se vea bien en cualquier Windows)
# ---------------------------------------------------------------
$ErrorActionPreference = 'Stop'
$Repo   = 'https://github.com/Ohigginsclimatech/website.git'
$Folder = Join-Path $env:USERPROFILE 'OlivarClima'

function Paso($n, $texto) { Write-Host ''; Write-Host "  [$n/5] $texto" -ForegroundColor Green }
function Info($texto) { Write-Host "        $texto" -ForegroundColor Gray }
function RefreshPath {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
}
function Tiene($cmd) { [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }

Clear-Host
Write-Host ''
Write-Host '  ==================================================' -ForegroundColor Green
Write-Host '     INSTALADOR - ADMINISTRADOR OLIVAR CLIMA' -ForegroundColor Green
Write-Host '  ==================================================' -ForegroundColor Green
Write-Host '  Esto tarda unos minutos. Si Windows pregunta si'
Write-Host '  permites cambios en el equipo, responde "Si".'

try {
  RefreshPath

  # 1. Node.js
  Paso 1 'Revisando Node.js...'
  if (Tiene 'node') { Info "Ya estaba instalado ($(node --version))" }
  else {
    if (-not (Tiene 'winget')) { throw 'Falta "winget". Actualiza Windows o instala Node.js desde https://nodejs.org y vuelve a abrir este instalador.' }
    Info 'Instalando Node.js...'
    winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements | Out-Null
    RefreshPath
    if (-not (Tiene 'node')) { throw 'No se pudo instalar Node.js. Instalalo desde https://nodejs.org y vuelve a intentar.' }
    Info 'Listo'
  }

  # 2. Git
  Paso 2 'Revisando Git...'
  if (Tiene 'git') { Info 'Ya estaba instalado' }
  else {
    if (-not (Tiene 'winget')) { throw 'Falta "winget". Instala Git desde https://git-scm.com y vuelve a abrir este instalador.' }
    Info 'Instalando Git...'
    winget install --id Git.Git -e --silent --accept-package-agreements --accept-source-agreements | Out-Null
    RefreshPath
    if (-not (Tiene 'git')) { throw 'No se pudo instalar Git. Instalalo desde https://git-scm.com y vuelve a intentar.' }
    Info 'Listo'
  }

  # 3. Descargar la web
  Paso 3 'Descargando la pagina web...'
  if (Test-Path (Join-Path $Folder '.git')) {
    Info "Ya existia en $Folder, actualizando..."
    git -C $Folder pull --rebase --autostash origin main
  } else {
    git clone $Repo $Folder
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo descargar la web. Revisa la conexion a internet.' }
  }
  git -C $Folder config user.name 'Olivar Clima (administrador)'
  git -C $Folder config user.email 'ohigginsclimatech@gmail.com'
  Info "Guardada en $Folder"

  # 4. Preparar
  Paso 4 'Preparando el administrador (puede tardar 1 o 2 minutos)...'
  Push-Location $Folder
  npm install --no-fund --no-audit --loglevel=error
  $npmOk = $LASTEXITCODE -eq 0
  Pop-Location
  if (-not $npmOk) { throw 'No se pudo preparar el administrador (npm install). Revisa la conexion a internet.' }
  $bat  = Join-Path $Folder 'admin\Administrar Olivar Clima.bat'
  $desk = [Environment]::GetFolderPath('Desktop')
  $ws   = New-Object -ComObject WScript.Shell
  $lnk  = $ws.CreateShortcut((Join-Path $desk 'Administrar Olivar Clima.lnk'))
  $lnk.TargetPath       = $bat
  $lnk.WorkingDirectory = Join-Path $Folder 'admin'
  $lnk.IconLocation     = (Join-Path $Folder 'admin\olivar.ico') + ',0'
  $lnk.Description      = 'Cambiar precios, fotos y equipos de olivarclima.cl'
  $lnk.WindowStyle      = 7
  $lnk.Save()
  Info 'Icono creado en el escritorio'

  # 5. Iniciar sesion en GitHub
  Paso 5 'Conectando con GitHub...'
  Info 'Se abrira una ventana de GitHub: elige "Sign in with your browser"'
  Info 'e inicia sesion con la cuenta Ohigginsclimatech. Luego presiona "Authorize".'
  Remove-Item Env:GIT_TERMINAL_PROMPT, Env:GCM_INTERACTIVE -ErrorAction SilentlyContinue
  git -C $Folder push --dry-run origin main
  if ($LASTEXITCODE -ne 0) { throw 'No se pudo iniciar sesion en GitHub. Cierra esta ventana y vuelve a abrir el instalador.' }

  Write-Host ''
  Write-Host '  ==================================================' -ForegroundColor Green
  Write-Host '     LISTO! Todo instalado.' -ForegroundColor Green
  Write-Host ''
  Write-Host '     En el escritorio tienes el icono' -ForegroundColor Green
  Write-Host '     "Administrar Olivar Clima". Haz doble clic' -ForegroundColor Green
  Write-Host '     cada vez que quieras cambiar precios o fotos.' -ForegroundColor Green
  Write-Host '  ==================================================' -ForegroundColor Green
}
catch {
  Write-Host ''
  Write-Host '  Hubo un problema:' -ForegroundColor Red
  Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ''
  Write-Host '  Saca una foto a esta ventana y enviala para revisarla.' -ForegroundColor Yellow
}
