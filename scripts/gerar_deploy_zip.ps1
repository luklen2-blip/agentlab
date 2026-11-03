# Script Automatizado para Gerar Pacote de Deploy Limpo na Área de Trabalho (.zip)
$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $PSScriptRoot
$desktopPath = [Environment]::GetFolderPath("Desktop")
if (-not (Test-Path $desktopPath)) {
    $desktopPath = "C:\Users\luciano\OneDrive\Desktop"
}
$zipPath = Join-Path $desktopPath "AgentLab-Pro-Deploy-Producao.zip"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host " GERANDO PACOTE DE IMPLANTAÇÃO NUVEM: AGENTLAB PRO" -ForegroundColor Cyan
Write-Host " Destino: $zipPath" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan

if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

$tempFolder = Join-Path $env:TEMP ("agentlab_pack_" + [Guid]::NewGuid().ToString().Substring(0,8))
New-Item -ItemType Directory -Path $tempFolder | Out-Null

$itemsToCopy = @(
    "package.json",
    "server.js",
    "render.yaml",
    "Dockerfile",
    ".gitignore",
    ".dockerignore",
    "README.md",
    "public",
    "tests",
    "scripts"
)

foreach ($item in $itemsToCopy) {
    $src = Join-Path $projectDir $item
    if (Test-Path $src) {
        $dest = Join-Path $tempFolder $item
        Copy-Item -Recurse -Force $src $dest
    }
}

# Criar arquivo ZIP limpo
Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipPath -Force
Remove-Item -Recurse -Force $tempFolder

Write-Host "✅ Pacote gerado com sucesso na Área de Trabalho!" -ForegroundColor Green
Write-Host "Arquivo: $zipPath" -ForegroundColor White
Write-Host "Tamanho: $((Get-Item $zipPath).Length / 1KB) KB" -ForegroundColor Gray

