from typing import TypedDict, Literal, List
import uuid
import json
import os
from datetime import datetime

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

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
    tags: List[str]


def get_previous_sentences(userInput) -> str:
    """
    Retrieves the last 25 generated sentences for a specific profile (age + language),
    sorted by newest first.

    Args:
        userInput (dict): Must contain 'age' (int) and 'language' (str).

    Returns:
        str: A formatted list of sentences for the LLM to review.
    """
    try:
        target_lang = userInput.get("language")
        target_age = userInput.get("age")
        limit = 25

        if not target_lang or not target_age:
            return "Error: userInput must provide 'language' and 'age' to fetch history."
        
        ref = db.collection(configs.generation_collection_name)
        query = (
            ref
            .where(filter=FieldFilter("userInput.language", "==", target_lang))
            .where(filter=FieldFilter("userInput.age", "==", target_age))
            .order_by("created_at", direction=firestore.Query.DESCENDING)
            .limit(limit)
        )
                
        docs = query.stream()
        results = [doc.to_dict() for doc in docs]

        if not results:
            return "History: No previous sentences found for this profile."
    
        formatted_output = [f"History (Last {len(results)} items):"]

        for i, item in enumerate(results, 1):
            pedagogical = item.get("pedagogicalOutput", {})
            #u_in = item.get("userInput", {})
            
            sentence = pedagogical.get("sentence", "[No Sentence]")
            #target_word = u_in.get("targetWord", "General")
            #theme = u_in.get("theme", "General")
            
            formatted_output.append(f"{i}. \"{sentence}\"")

        return "\n".join(formatted_output)

    except Exception as e:
        return f"System Error retrieving history: {str(e)}"


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
            - 'tags': A list of 2-5 lowercase, single-word descriptive tags.

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

        if configs.local_persistence:
            doc_data["created_at"] = datetime.now().isoformat()
            with open(os.path.join("tmp", f"{unique_id}.json"), "w",  encoding="utf-8") as f:
                json.dump(doc_data, f, indent=4)
        else:
            doc_ref = db.collection(configs.generation_collection_name).document(unique_id)
            doc_ref.set(doc_data)

        return unique_id

    except Exception as ex:
        print(f"Failed to persist data: {ex}")
        # Return None to signal failure to the Agent logic
        return None


# python -m monster_word_agent.teacher.tools
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    user_request = {
        "age": 5,
        "language": "fr",
        "theme": "Forest",
        "targetWord": None,
    }

    print(get_previous_sentences(user_request))


