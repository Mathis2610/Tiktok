from bson import ObjectId
from typing import Any, Dict, List

def serialize_doc(doc: Dict) -> Dict:
    """Convertit un document MongoDB en dict JSON-serializable"""
    if doc is None:
        return None
    
    serialized = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, dict):
            serialized[key] = serialize_doc(value)
        elif isinstance(value, list):
            serialized[key] = [serialize_doc(item) if isinstance(item, dict) else item for item in value]
        else:
            serialized[key] = value
    
    return serialized

def serialize_docs(docs: List[Dict]) -> List[Dict]:
    """Convertit une liste de documents MongoDB"""
    return [serialize_doc(doc) for doc in docs]
