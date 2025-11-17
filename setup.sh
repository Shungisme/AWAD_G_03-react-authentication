#!/bin/bash

# Email Dashboard - Complete Setup Script
# This script sets up both backend and frontend

echo "================================================"
echo "📧 Email Dashboard - Complete Setup"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Setup
echo -e "${BLUE}[1/4] Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Frontend Setup
echo -e "${BLUE}[2/4] Setting up Frontend...${NC}"
cd ../frontend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Instructions
echo -e "${BLUE}[3/4] Setup Complete!${NC}"
echo ""
echo -e "${GREEN}✓ Backend ready at: http://localhost:5000${NC}"
echo -e "${GREEN}✓ Frontend ready at: http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}[4/4] To start the application:${NC}"
echo ""
echo "1. Start Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "4. Login with:"
echo "   Email: demo@example.com"
echo "   Password: demo123"
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}🎉 Setup Complete! Happy Coding!${NC}"
echo -e "${GREEN}================================================${NC}"
