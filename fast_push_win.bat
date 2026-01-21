@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: 使用 PowerShell 获取标准格式的当前时间（推荐！）
for /f "delims=" %%i in ('powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set "DATETIME=%%i"

git add .
git commit -m "!DATETIME!"
git push

echo 提交成功！
pause