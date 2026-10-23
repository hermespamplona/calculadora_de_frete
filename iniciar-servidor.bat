@echo off
cd /d "%~dp0"
if not exist node_modules call npm install
call npx tsc
if errorlevel 1 (
  echo Erro ao compilar o TypeScript. Veja as mensagens acima.
  pause
  exit /b 1
)
start "" http://localhost:8000
node servidor.js
pause
