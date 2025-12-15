import json
from typing import Iterable, List, Optional

from django.contrib import admin
from django.utils.html import format_html
from django.db import models

from .mongo import get_db


class SessionProxy(models.Model):
    session_id = models.CharField(max_length=64, primary_key=True)
    current_step = models.IntegerField(null=True, blank=True)
    final_code = models.CharField(max_length=16, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        verbose_name = "Game Session"
        verbose_name_plural = "Game Sessions"

    def __str__(self):
        return self.session_id


class SessionQuerySet:
    """
    Minimal QuerySet-like wrapper so admin pages can paginate and search
    Mongo-backed documents without touching the SQL DB.
    """

    def __init__(self, data: Iterable[SessionProxy]):
        self._data: List[SessionProxy] = list(data)
        self.model = SessionProxy

    def __iter__(self):
        return iter(self._data)

    def __len__(self):
        return len(self._data)

    def count(self):
        return len(self._data)

    def __getitem__(self, key):
        return self._data[key]

    def order_by(self, *fields):
        items = list(self._data)
        for field in reversed(fields or []):
            reverse = False
            name = field
            if field.startswith("-"):
                reverse = True
                name = field[1:]
            items.sort(key=lambda obj: getattr(obj, name, None), reverse=reverse)
        return SessionQuerySet(items)

    def filter(self, *args, **kwargs):
        # Filtering handled by get_search_results; return self for compatibility.
        return self


@admin.register(SessionProxy)
class SessionAdmin(admin.ModelAdmin):
    list_display = ("session_id", "current_step", "final_code", "created_at", "completed_at")
    search_fields = ("session_id", "final_code")
    readonly_fields = (
        "session_id",
        "current_step",
        "final_code",
        "created_at",
        "completed_at",
        "selfie_path",
        "full_document",
    )
    ordering = ("-created_at",)

    def get_queryset(self, request):
        db = get_db()
        docs = list(db.sessions.find())
        objects: List[SessionProxy] = []
        for doc in docs:
            obj = SessionProxy(
                session_id=doc.get("session_id", ""),
                current_step=doc.get("current_step"),
                final_code=doc.get("final_code"),
                created_at=doc.get("created_at"),
                completed_at=doc.get("completed_at"),
            )
            obj._mongo_doc = doc  # type: ignore[attr-defined]
            objects.append(obj)
        return SessionQuerySet(objects).order_by(*self.ordering)

    def get_search_results(self, request, queryset, search_term):
        if not search_term:
            return queryset, False
        term = search_term.lower()
        filtered = [
            obj
            for obj in queryset
            if term in (obj.session_id or "").lower()
            or term in (obj.final_code or "").lower()
        ]
        return SessionQuerySet(filtered), False

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_view_permission(self, request, obj=None):
        return True

    def selfie_path(self, obj: SessionProxy):
        doc = getattr(obj, "_mongo_doc", {}) or {}
        step3 = (doc.get("steps") or {}).get("step3") or {}
        retained = step3.get("image_retained")
        if retained:
            path = step3.get("path")
            if path:
                return format_html('<a href="{}" target="_blank">{}</a>', path, path)
        return "Not retained"

    selfie_path.short_description = "Selfie"

    def full_document(self, obj: SessionProxy):
        doc = getattr(obj, "_mongo_doc", {}) or {}
        return format_html("<pre>{}</pre>", json.dumps(doc, default=str, indent=2))

    full_document.short_description = "Document"
