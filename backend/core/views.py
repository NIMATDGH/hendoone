import json
from datetime import datetime, timezone
from uuid import uuid4

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from pymongo import ReturnDocument

from .mongo import get_db

CORRECT_COLORS = ["red", "blue", "green", "yellow"]
CORRECT_OBJECT_NUMBERS = {
    "object1": 12,
    "object2": 7,
    "object3": 42,
    "object4": 3,
    "object5": 19,
    "object6": 88,
}


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


@require_http_methods(["POST"])
def step2_objects_view(request):
    session_id = request.COOKIES.get("session_id")
    if not session_id:
        return JsonResponse({"detail": "Session not found"}, status=404)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    answers = payload.get("answers")
    if not isinstance(answers, dict):
        return JsonResponse({"success": False, "message": "Incorrect answers"})

    if set(answers.keys()) != set(CORRECT_OBJECT_NUMBERS.keys()):
        return JsonResponse({"success": False, "message": "Incorrect answers"})

    for key, correct_value in CORRECT_OBJECT_NUMBERS.items():
        if answers.get(key) != correct_value:
            return JsonResponse({"success": False, "message": "Incorrect answers"})

    db = get_db()
    updated = db.sessions.find_one_and_update(
        {"session_id": session_id},
        {
            "$set": {
                "current_step": 2,
                "steps.step2": {"answers": answers, "completed": True},
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if not updated:
        return JsonResponse({"detail": "Session not found"}, status=404)

    return JsonResponse({"success": True, "current_step": updated.get("current_step", 2)})


@require_http_methods(["POST"])
def step1_color_view(request):
    session_id = request.COOKIES.get("session_id")
    if not session_id:
        return JsonResponse({"detail": "Session not found"}, status=404)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    colors = payload.get("colors")
    if not isinstance(colors, list) or colors != CORRECT_COLORS:
        return JsonResponse({"success": False, "message": "Incorrect pattern"})

    db = get_db()
    updated = db.sessions.find_one_and_update(
        {"session_id": session_id},
        {
            "$set": {
                "current_step": 1,
                "steps.step1": {
                    "colors": colors,
                    "completed": True,
                },
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if not updated:
        return JsonResponse({"detail": "Session not found"}, status=404)

    return JsonResponse({"success": True, "current_step": updated.get("current_step", 1)})


@require_http_methods(["GET"])
def state_view(request):
    session_id = request.COOKIES.get("session_id")
    if not session_id:
        return JsonResponse({"detail": "Session not found"}, status=404)

    db = get_db()
    session_doc = db.sessions.find_one({"session_id": session_id})
    if not session_doc:
        return JsonResponse({"detail": "Session not found"}, status=404)

    return JsonResponse(
        {
            "session_id": session_doc["session_id"],
            "current_step": session_doc.get("current_step", 0),
            "steps": session_doc.get("steps", {}),
        }
    )


@require_http_methods(["POST"])
def step_view(request):
    session_id = request.COOKIES.get("session_id")
    if not session_id:
        return JsonResponse({"detail": "Session not found"}, status=404)

    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    if "step" not in payload:
        return JsonResponse({"detail": "Missing step"}, status=400)

    step_value = payload.get("step")
    data_value = payload.get("data", {})
    step_field = f"steps.step{step_value}"

    db = get_db()
    updated = db.sessions.find_one_and_update(
        {"session_id": session_id},
        {
            "$set": {
                "current_step": step_value,
                step_field: data_value,
            }
        },
        return_document=ReturnDocument.AFTER,
    )

    if not updated:
        return JsonResponse({"detail": "Session not found"}, status=404)

    return JsonResponse(
        {
            "session_id": updated["session_id"],
            "current_step": updated.get("current_step", 0),
            "steps": updated.get("steps", {}),
        }
    )
