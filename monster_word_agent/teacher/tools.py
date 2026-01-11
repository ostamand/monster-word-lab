from typing import TypedDict, Optional, Literal
import uuid
from google.cloud import firestore

from ..database import db
from ..app_configs import configs


class UserInput(TypedDict):
    age: int
    language: Literal["en", "fr", "es"]
    theme: str
    targetWord: str


class PedagogicalOutput(TypedDict):
    sentence: str
    learningGoal: str


def persist_learning_data(userInput, pedagogicalOutput) -> str:
    """
    Persists the generated pedagogical content and user context to the database.

    This function acts as a tool for the PedagogicalArchitect agent. It accepts
    the finalized user constraints and the generated learning content and attempts
    to save them to Firestore.

    Args:
        userInput (UserInput): A dictionary containing the learner's profile and
            context. Must include:
            - 'age': Integer representing the child's age.
            - 'language': The ISO code ('en', 'fr', 'es').
            - 'theme': The context theme (e.g., 'Space').
            - 'targetWord': The specific vocabulary word being taught.

        pedagogicalOutput (PedagogicalOutput): A dictionary containing the
            generated content. Must include:
            - 'sentence': The generated learning sentence.
            - 'learningGoal': Metadata explaining the pedagogical intent.

    Returns:
        Optional[str]:
            - Returns the **unique document ID (UUID)** if persistence is successful.
            - Returns **None** if the database operation fails.
    """
    try:
        unique_id = str(uuid.uuid4())

        doc_data = {
            "id": unique_id,
            "userInput": userInput,
            "pedagogicalOutput": pedagogicalOutput,
            "status": "initialized",
            "created_at": firestore.SERVER_TIMESTAMP,
        }

        doc_ref = db.collection(configs.generation_collection_name).document(unique_id)
        doc_ref.set(doc_data)

        return unique_id

    except Exception as ex:
        print(f"Failed to persist data: {ex}")
        # Return None to signal failure to the Agent logic
        return None
