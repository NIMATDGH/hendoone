from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    path("session/", views.session_view, name="session"),
]
