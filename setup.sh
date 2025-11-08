#!/bin/bash

# Fantasy Handicapper League Setup Script
# This script sets up the development environment for the betting application

set -e  # Exit on any error

echo "🏁 Setting up Fantasy Handicapper League..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm 8+"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install root dependencies (concurrently for running both servers)
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo "✅ All dependencies installed successfully!"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_PATH=./server/database.sqlite

# Client Configuration
VITE_API_URL=http://localhost:3000
EOF
    echo "✅ .env file created"
fi

echo ""
echo "🎉 Setup complete! You can now run the application:"
echo ""
echo "  Quick start:"
echo "    npm run dev"
echo ""
echo "  Or run servers separately:"
echo "    Terminal 1: npm run dev:server"
echo "    Terminal 2: npm run dev:client"
echo ""
echo "  Then open: http://localhost:5173"
echo ""
echo "📚 See README.md for detailed usage instructions"
