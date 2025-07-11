@echo off
echo Starting HTTP Server on port 8080...
echo.
echo Your website will be available at:
echo   - Local: http://localhost:8080
echo   - Network: http://[YOUR_IP]:8080
echo.
echo To stop the server, press Ctrl+C
echo.
python -m http.server 8080
pause
