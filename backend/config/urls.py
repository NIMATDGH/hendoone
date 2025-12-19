from django.contrib import admin
from django.urls import path, include
from core import views as core_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path("uploads/<str:session_id>/<str:filename>", core_views.uploads_selfie_view),
]
