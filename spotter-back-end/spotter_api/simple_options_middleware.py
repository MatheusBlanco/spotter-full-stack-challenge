from django.http import HttpResponse


class SimpleOptionsMiddleware:
    """Return a lightweight 204 for bare OPTIONS requests not caught by Django.

    This avoids 500s during preflight when a view (e.g., class-based APIView) isn't
    executed because of earlier failures. `django-cors-headers` will still append
    the CORS headers after this middleware (it runs first in the list).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If it's a pure CORS preflight: has Origin + Access-Control-Request-Method
        if request.method == 'OPTIONS' and 'HTTP_ACCESS_CONTROL_REQUEST_METHOD' in request.META:
            # Let django-cors-headers add headers (it ran before us). Just return 204.
            return HttpResponse(status=204)
        return self.get_response(request)
