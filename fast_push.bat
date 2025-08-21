@echo off
chcp 65001
set /p msg=请输入提交信息: 
git add .
git commit -m "%msg%"
git push
pause
