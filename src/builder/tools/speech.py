import os
from google.cloud import texttospeech
from google.cloud import storage


def generate_speech_tool(generation_id: str, text: str, language: str) -> str:
    """
    Synthesizes text using Google Cloud 'Chirp 3: HD' and saves to GCS
    using the provided generation ID for the filename.

    Args:
        generation_id (str): The shared ID for this generation (matches the image).
        text (str): The sentence to speak.
        language (str): The language code ('en', 'fr', 'es').

    Returns:
        str: The GCS URI of the saved audio file.
    """
    try:
        project_id = os.environ["GCP_PROJECT"]
        bucket_name = os.environ["GCP_MEDIA_BUCKET"]
    except KeyError as e:
        return f"Error: Missing environment variable {e}"

    voice_map = {
        "en": {"code": "en-US", "name": "en-US-Chirp3-HD-Charon"},
        "fr": {"code": "fr-FR", "name": "fr-FR-Chirp3-HD-Charon"},
        "es": {"code": "es-ES", "name": "es-ES-Chirp3-HD-Charon"},
    }

    voice_config = voice_map.get(language.lower(), voice_map["en"])

    tts_client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code=voice_config["code"], name=voice_config["name"]
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        effects_profile_id=["headphone-class-device"],
    )

    try:
        response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        storage_client = storage.Client(project=project_id)
        bucket = storage_client.bucket(bucket_name)

        filename = f"audio/{generation_id}.mp3"
        blob = bucket.blob(filename)

        blob.upload_from_string(response.audio_content, content_type="audio/mpeg")

        return f"gs://{bucket_name}/{filename}"

    except Exception as e:
        print(f"❌ TTS Generation failed: {e}")
        return f"Error generating speech: {str(e)}"


# uv run -m src.builder.tools.speech
if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    data = {
        "generationId": "93a275e5-f887-40d2-a881-87c2e20cd7a4",
        "rawMedia": "gs://multimodal-custom-agent-assets/raw/93a275e5-f887-40d2-a881-87c2e20cd7a4.png",
        "sentence": "The boy looks at the enormous yellow dog.",
        "language": "en",
    }

    response = generate_speech_tool(
        data["generationId"], data["sentence"], data["language"]
    )

    print(response)
