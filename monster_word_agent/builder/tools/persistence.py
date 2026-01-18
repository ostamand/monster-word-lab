import os
import json
from datetime import datetime

from google.cloud import firestore

from ...database import db
from ...app_configs import configs


def persist_media_paths(id: str, final_image_path: str, final_audio_path: str) -> str:
    """
    Updates the existing generation record in Firestore with the final GCS paths
    for the generated media.

    Args:
        id (str): The unique UUID of the generation (must match the document ID).
        final_image_path (str): The GCS path of the final composite flashcard.
        final_audio_path (str): The GCS path of the generated audio.

    Returns:
        str: Success message indicating the paths were saved.
    """
    try:
        if configs.local_persistence:
            file_path = os.path.join("tmp", f"{id}.json")
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            data.update({
                "final_image_gcs_path": final_image_path,
                "final_audio_gcs_path": final_audio_path,
                "status": "completed",
                "completed_at": datetime.now().isoformat()
            })
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4)
        else:
            doc_ref = db.collection(configs.generation_collection_name).document(id)
            doc_ref.update(
                {
                    "final_image_gcs_path": final_image_path,
                    "final_audio_gcs_path": final_audio_path,
                    "status": "completed",
                    "completed_at": firestore.SERVER_TIMESTAMP,
                }
            )

        return "Media paths persisted successfully."

    except Exception as e:
        print(f"Failed to update media paths: {e}")
        return f"Error persisting paths: {str(e)}"
