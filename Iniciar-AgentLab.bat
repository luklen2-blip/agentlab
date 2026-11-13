@echo off
chcp 65001 > nul
title AgentLab Pro - Laboratório de Agentes de IA 24/7
color 0B

echo =======================================================
echo     AGENTLAB PRO - LABORATÓRIO DE AGENTES IA 24/7
echo =======================================================
echo.
echo Iniciando servidor HTTP local de alta resiliência...
echo.

cd /d "%~dp0"
if not exist "server.js" (
    cd /d "C:\Users\luciano\OneDrive\Documentos\nova pasta\index.html\agent-lab"
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js não foi encontrado no PATH do sistema.
    echo Por favor, instale o Node.js v18+ para continuar.
    pause
    exit /b 1
)

set PORT=3055
echo [OK] Servidor configurado na porta %PORT%
echo [OK] Monitoramento em: http://localhost:%PORT%/api/health
echo.
echo Abrindo o navegador diretamente na Sorveteria D'ALÊ...
start http://localhost:%PORT%/?niche=dale

node server.js
pause

