@echo off
chcp 65001
git add .
git commit -m "$(date +"%Y-%m-%d %H:%M:%S")"
git push
echo 提交成功！
pause
