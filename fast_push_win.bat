@echo off
chcp 65001
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "datetime=%%a"
set "msg=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%"
git add .
git commit -m "%msg%"
git push
echo 提交成功！
pause
