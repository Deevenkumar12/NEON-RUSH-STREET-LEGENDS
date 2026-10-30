@echo off
echo Open http://localhost:8000 in browser (phones on same WiFi: http://YOUR-PC-IP:8000)
start http://localhost:8000
python -m http.server 8000
