import os

from django.core.exceptions import ImproperlyConfigured
from pymongo import MongoClient

_client = None


def get_db():
    """
    Return a MongoDB database instance using env-provided URI/name.
    """
    global _client

    uri = os.environ.get("MONGO_URI")
    db_name = os.environ.get("MONGO_DB_NAME")

    if not uri or not db_name:
        raise ImproperlyConfigured("MONGO_URI and MONGO_DB_NAME must be set")

    if _client is None:
        _client = MongoClient(uri)

    return _client[db_name]
