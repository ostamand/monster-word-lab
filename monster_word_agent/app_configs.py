import os
from dataclasses import dataclass
from dotenv import load_dotenv

@dataclass
class Configs:
    gcp_project: str
    gcp_location: str
    gcp_media_bucket: str
    media_model: str
    llm_model: str
    font_path: str
    generation_collection_name: str
    local_persistence: bool

load_dotenv()

configs = Configs(
    gcp_project=os.environ["GOOGLE_CLOUD_PROJECT"],
    gcp_location=os.environ["GOOGLE_CLOUD_LOCATION"],
    gcp_media_bucket=os.environ["GOOGLE_CLOUD_MEDIA_BUCKET"],
    media_model=os.environ["MEDIA_GENERATION_MODEL"],
    llm_model=os.environ["LLM_MODEL"],
    font_path=os.environ["MEDIA_COMPOSE_FONT_PATH"],
    generation_collection_name = "learning_generations",
    local_persistence=os.environ.get("LOCAL_PERSISTENCE", "FALSE") == 'TRUE'
)