@echo off
echo =======================================================
echo   Avvio Server Locale Street Review su http://localhost:3000
echo =======================================================
echo.
start http://localhost:3000/index_preview.html
python -m http.server 3000
