#!/bin/bash
set -e

# Update system packages
sudo apt-get update

# Install Node.js 20 using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Navigate to the ai-ui-kit package directory
cd /mnt/persist/workspace/packages/ai-ui-kit

# Install dependencies
npm ci

# Install Playwright browsers and dependencies
npx playwright install --with-deps

# Build the project to ensure everything is set up correctly
npm run build

# Add npm global bin to PATH in user profile
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> $HOME/.profile

# Source the profile to make PATH available immediately
source $HOME/.profile