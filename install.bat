@echo off
echo 🚀 Installing BitcoinYield - Bitcoin Investment Platform
echo ========================================================

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16.x or higher.
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node -v') do (
    set NODE_VERSION=%%a
)
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 16 (
    echo ❌ Node.js version is too old. Please install Node.js 16.x or higher.
    exit /b 1
)

echo ✅ Node.js %NODE_VERSION% detected

:: Install dependencies
echo 📦 Installing dependencies...
where yarn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    yarn install
) else (
    npm install
)

:: Check if installation was successful
if %ERRORLEVEL% equ 0 (
    echo ✅ Dependencies installed successfully
    
    :: Create .env file if it doesn't exist
    if not exist .env (
        echo Creating .env file...
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000 > .env
    )
    
    echo.
    echo 🎉 Installation complete!
    echo.
    echo To start the development server, run:
    where yarn >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        echo   yarn dev
    ) else (
        echo   npm run dev
    )
    echo.
    echo Then open http://localhost:3000 in your browser
) else (
    echo ❌ Installation failed. Please check the error messages above.
    exit /b 1
)
