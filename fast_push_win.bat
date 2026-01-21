@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 获取当前日期和时间（格式：YYYY-MM-DD HH:MM:SS）
for /f "tokens=1-7 delims=/:. " %%a in ('wmic path win32_localtime get /format:list ^| findstr "="') do (
    set "%%a=%%b"
)

:: 补零（确保月份、日期、小时等为两位数）
set "MM=0!Month!"
set "MM=!MM:～-2!"
set "DD=0!Day!"
set "DD=!DD:～-2!"
set "HH=0!Hour!"
set "HH=!HH:～-2!"
set "Min=0!Minute!"
set "Min=!Min:～-2!"
set "Sec=0!Second!"
set "Sec=!Sec:～-2!"

set "DATETIME=!Year!-!MM!-!DD! !HH!:!Min!:!Sec!"

git add .
git commit -m "!DATETIME!"
git push

echo 提交成功！
pause