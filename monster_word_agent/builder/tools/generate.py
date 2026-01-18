import os
import uuid
import base64
from typing import Dict

from google import genai
from google.genai import types
from google.cloud import storage

from ...app_configs import configs


def generate_image_tool(id: str, prompt: str) -> str:
    """
    Generates an image using Nano Banana (Gemini 2.5 Flash Image) and uploads it to GCS.

    Args:
        id (str): The unique UUID for this generation pipeline.
        prompt (str): The natural language description for the image model.

    Returns:
        str: The GCS path of the raw generated image.
    """
    ai_client = genai.Client(
        vertexai=True,
        project=configs.gcp_project,
        location=configs.gcp_location,
    )

    storage_client = storage.Client(project=configs.gcp_project)

    prompt_part = types.Part.from_text(text=prompt)

    contents = [
        types.Content(role="user", parts=[prompt_part]),
    ]

    generate_content_config = types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        safety_settings=[
            types.SafetySetting(
                category="HARM_CATEGORY_HATE_SPEECH", threshold="BLOCK_LOW_AND_ABOVE"
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold="BLOCK_LOW_AND_ABOVE",
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold="BLOCK_LOW_AND_ABOVE",
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_HARASSMENT", threshold="BLOCK_LOW_AND_ABOVE"
            ),
        ],
        image_config=types.ImageConfig(
            aspect_ratio="4:3",
            image_size="1K",
            output_mime_type="image/png",
        ),
    )

    try:
        response = ai_client.models.generate_content(
            model=configs.media_model,
            contents=contents,
            config=generate_content_config,
        )

        image_data = None
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    image_data = part.inline_data.data
                    break

        if not image_data:
            raise ValueError("No image data found in response.")

        if isinstance(image_data, str):
            image_bytes = base64.b64decode(image_data)
        else:
            image_bytes = image_data

        if configs.local_persistence:
            local_path = os.path.join("tmp", "raw", f"{id}.png")
            with open(local_path, "wb") as f:
                f.write(image_bytes)
            return os.path.abspath(local_path)
        else:
            filename = f"raw/{id}.png"
            bucket = storage_client.bucket(configs.gcp_media_bucket)
            blob = bucket.blob(filename)
            blob.upload_from_string(image_bytes, content_type="image/png")
            return f"gs://{configs.gcp_media_bucket}/{filename}"

    except Exception as e:
        print(f"❌ Image generation failed: {e}")
        raise e


# uv run -m src.builder.tools.generate
if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    test_prompt = """
        A whimsical digital storybook art illustration showing a small young boy looking up in amazement at an enormous, friendly yellow dog in a sunny neighborhood park. 
        The dog's soft golden fur is rendered with warm, vibrant tones, and its massive scale compared to the boy creates a sense of wonder and friendliness. 
        The scene is filled with bright, cheerful lighting and a clear blue sky. 
        The composition is a wide-angle shot. The main subject is centered in the top two-thirds of the frame. 
        The bottom 20% of the image is a clean, solid, uncluttered surface of the park's green grass to allow for text overlay. 
        Do not place any objects in the bottom 20%.
    """

    response = generate_image_tool(test_prompt)

    print(response)
