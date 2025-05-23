#!/bin/bash

# BitcoinYield Installation Script

echo "🚀 Installing BitcoinYield - Bitcoin Investment Platform"
echo "========================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16.x or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version is too old. Please install Node.js 16.x or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v yarn &> /dev/null; then
    yarn install
else
    npm install
fi

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating .env file..."
        echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" > .env
    fi
    
    echo ""
    echo "🎉 Installation complete!"
    echo ""
    echo "To start the development server, run:"
    if command -v yarn &> /dev/null; then
        echo "  yarn dev"
    else
        echo "  npm run dev"
    fi
    echo ""
    echo "Then open http://localhost:3000 in your browser"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
