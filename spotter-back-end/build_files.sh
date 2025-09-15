#!/bin/bash

echo "🔧 Building static files for Vercel deployment..."
# Exit on any failure
set -e

echo "🗂️ Collecting static files for Vercel deployment..."
python manage.py collectstatic --noinput
echo "✅ Static build completed!"