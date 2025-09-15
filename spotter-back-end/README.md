# Spotter Backend

## Overview

Django backend for trip planning and ELD (Electronic Logging Device) related operations.

## CORS Configuration

The backend uses `django-cors-headers`.

Key points:

- Middleware order: `corsheaders.middleware.CorsMiddleware` must be the first middleware in `MIDDLEWARE`.
- Do not add trailing slashes to origins in `CORS_ALLOWED_ORIGINS`.
- Avoid enabling `CORS_ALLOW_ALL_ORIGINS` in production; explicitly list trusted domains.
- If cookie/session auth is introduced, set `CORS_ALLOW_CREDENTIALS = True` and add the frontend host(s) to `CSRF_TRUSTED_ORIGINS`.

Troubleshooting checklist:

1. Confirm the frontend uses the correct base URL (`VITE_API_URL`). No trailing slash.
2. Ensure the request path matches Django's `urlpatterns` (current API prefix: `/api/trips/`). The trip planning endpoint is: `/api/trips/plan/`.
3. Inspect the network response headers in the browser for `Access-Control-Allow-Origin`. If missing, ensure the request `Origin` exactly matches an entry in `CORS_ALLOWED_ORIGINS`.
4. If deploying a new backend URL, update the frontend `.env` and rebuild/redeploy the frontend.
5. Avoid caching issues: hard refresh (Ctrl+Shift+R) after redeploy.

## Environment Variables

Create a `.env` file with:

```
DB_NAME=
DB_USER=
DB_USER_PASSWORD=
DB_HOST=
DB_PORT=3306
DEBUG=False
```

## Running Locally

Install dependencies and run migrations:

```
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Tests

Run tests with pytest:

```
pytest -q
```
