@echo off
REM Email Dashboard - Complete Setup Script for Windows
REM This script sets up both backend and frontend

echo ================================================
echo   Email Dashboard - Complete Setup
echo ================================================
echo.

REM Backend Setup
echo [1/4] Setting up Backend...
cd backend

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo + .env file created
) else (
    echo + .env file already exists
)

echo Installing backend dependencies...
call npm install
echo + Backend dependencies installed
echo.

REM Frontend Setup
echo [2/4] Setting up Frontend...
cd ..\frontend

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo + .env file created
) else (
    echo + .env file already exists
)

echo Installing frontend dependencies...
call npm install
echo + Frontend dependencies installed
echo.

REM Instructions
echo [3/4] Setup Complete!
echo.
echo + Backend ready at: http://localhost:5000
echo + Frontend ready at: http://localhost:5173
echo.
echo [4/4] To start the application:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 2. Start Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:5173
echo.
echo 4. Login with:
echo    Email: demo@example.com
echo    Password: demo123
echo.
echo ================================================
echo   Setup Complete! Happy Coding!
echo ================================================
echo.
pause
