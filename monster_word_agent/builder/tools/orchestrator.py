import asyncio
from typing import Dict

from .generate import generate_image_tool
from .speech import generate_speech_tool
from .combine import create_composite_card_tool
from .persistence import persist_media_paths

async def build_media_assets_tool(id: str, image_prompt: str, sentence: str, language: str) -> Dict[str, str]:
    """
    Orchestrates the parallel generation of image and speech assets.
    
    This tool reduces latency by running independent tasks concurrently.
    1. Starts Image Generation and Speech Generation in parallel.
    2. Once Image is ready, starts Compositing (overlaying text).
    3. Once both Composite Image and Audio are ready, persists paths to the database.

    Args:
        id (str): The unique Generation ID.
        image_prompt (str): Description for the image generator.
        sentence (str): The text for overlay and speech.
        language (str): The language code (fr, en, es).

    Returns:
        Dict[str, str]: A dictionary containing the ID and final media paths.
    """
    
    async def image_pipeline():
        # Step 1: Generate Raw Image
        raw_image_path = await asyncio.to_thread(generate_image_tool, id, image_prompt)
        if raw_image_path.startswith("Error"):
            raise Exception(raw_image_path)
            
        # Step 2: Create Composite (Text Overlay)
        final_image_path = await asyncio.to_thread(create_composite_card_tool, id, raw_image_path, sentence)
        if final_image_path.startswith("Error"):
            raise Exception(final_image_path)
            
        return final_image_path

    async def speech_pipeline():
        # Step 1: Generate Speech
        audio_path = await asyncio.to_thread(generate_speech_tool, id, sentence, language)
        if audio_path.startswith("Error"):
            raise Exception(audio_path)
            
        return audio_path

    # Run pipelines concurrently
    try:
        final_image_path, final_audio_path = await asyncio.gather(
            image_pipeline(),
            speech_pipeline()
        )
    except Exception as e:
        return {"error": f"Media generation failed: {str(e)}"}

    # Step 3: Persist results
    persist_result = await asyncio.to_thread(
        persist_media_paths, id, final_image_path, final_audio_path, image_prompt
    )
    
    if persist_result.startswith("Error"):
        return {"error": persist_result}

    return {
        "id": id,
        "final_image_gcs_path": final_image_path,
        "final_audio_gcs_path": final_audio_path
    }
