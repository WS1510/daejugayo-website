@echo off
echo 관리자 페이지 서버를 시작합니다...
cd /d "e:\daejugayo-website"
python -m http.server 8080
pause
