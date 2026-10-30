#!/bin/sh
echo "Open http://localhost:8000  (phones on same WiFi: http://YOUR-PC-IP:8000)"
python3 -m http.server 8000
