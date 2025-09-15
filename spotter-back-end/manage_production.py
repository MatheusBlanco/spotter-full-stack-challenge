#!/usr/bin/env python3
"""
Production management script for Vercel deployment.
Use this for running Django management commands in production.
"""

import os
import sys

import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spotter_api.settings')
    django.setup()
    execute_from_command_line(sys.argv)
