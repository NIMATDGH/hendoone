from datetime import datetime, timezone
from uuid import uuid4

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from .mongo import get_db


def health(request):
    return JsonResponse({"status": "ok"})


@require_http_methods(["POST"])
def session_view(request):
    db = get_db()
    sessions = db.sessions

    session_id = request.COOKIES.get("session_id")
    session_doc = None

    if session_id:
        session_doc = sessions.find_one({"session_id": session_id})

    if not session_doc:
        session_id = str(uuid4())
        session_doc = {
            "session_id": session_id,
            "current_step": 0,
            "created_at": datetime.now(timezone.utc),
        }
        sessions.insert_one(session_doc)

    response = JsonResponse(
        {
            "session_id": session_doc.get("session_id", session_id),
            "current_step": session_doc.get("current_step", 0),
        }
    )
    response.set_cookie("session_id", session_id, httponly=True, samesite="Lax", path="/")
    return response
