#!/bin/bash

# Exit on any failure
set -e

echo "🔧 Building static files for Vercel deployment..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Collect static files
echo "🗂️ Collecting static files..."
python manage.py collectstatic --noinput

# Create staticfiles_build directory for Vercel
echo "📁 Preparing static files for deployment..."
mkdir -p staticfiles_build
cp -r staticfiles/* staticfiles_build/

echo "✅ Build completed successfully!"