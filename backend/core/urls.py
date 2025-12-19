from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    path("session/", views.session_view, name="session"),
    path("state/", views.state_view, name="state"),
    path("step/", views.step_view, name="step"),
    path("step0/word/", views.step0_word_view, name="step0_word"),
    path("step1/color/", views.step1_color_view, name="step1_color"),
    path("step2/objects/", views.step2_objects_view, name="step2_objects"),
    path("step3/selfie/", views.step3_selfie_view, name="step3_selfie"),
    path("finish/", views.finish_view, name="finish"),
    path("admin/login/", views.admin_login_view, name="admin_login"),
    path("admin/logout/", views.admin_logout_view, name="admin_logout"),
    path("admin/sessions/", views.admin_sessions_list_view, name="admin_sessions_list"),
    path("admin/sessions/<str:session_id>/", views.admin_session_detail_view, name="admin_session_detail"),
]
