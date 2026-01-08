import io
import textwrap

from google.cloud import storage
from PIL import Image, ImageDraw, ImageFont


def create_composite_card_tool(
    generation_id: str, image_path: str, sentence: str
) -> str:
    """
    Downloads raw image from GCS, overlays text in the bottom 20%,
    saves the final result back to GCS, and returns the new GCS URI.

    Args:
        generation_id (str): The UUID of the original generation.
        image_path (str): The source GCS URI (gs://bucket/raw/...).
        sentence (str): The text to overlay.

    Returns:
        str: The GCS URI of the final composited image (gs://bucket/composed/...).
    """
    if not image_path.startswith("gs://"):
        return f"Error: Invalid GCS path {image_path}"

    try:
        path_parts = image_path.replace("gs://", "").split("/", 1)
        bucket_name = path_parts[0]
        source_blob_name = path_parts[1]
    except IndexError:
        return f"Error: Could not parse bucket/blob from {image_path}"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    try:
        image_bytes = blob.download_as_bytes()
    except Exception as e:
        return f"Error downloading from GCS: {e}"

    try:
        # Load
        base = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
        width, height = base.size

        # Create Scrim (Bottom 20%)
        overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        scrim_ratio = 0.20  # 20%
        scrim_height = int(height * scrim_ratio)
        start_y = height - scrim_height

        # Draw semi-transparent black box
        draw.rectangle([(0, start_y), (width, height)], fill=(0, 0, 0, 160))

        # Composite
        base = Image.alpha_composite(base, overlay)
        base = base.convert("RGB")
        draw = ImageDraw.Draw(base)

        # Configure Font
        # Font size: ~40% of the scrim height ensures it fits comfortably
        font_size = int(scrim_height * 0.40)

        try:
            # Try to load a standard font (Adjust path for your container OS)
            # Common linux path: /usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
            font = ImageFont.truetype("arial.ttf", font_size)
        except IOError:
            font = ImageFont.load_default()

        # Wrap Text to fit width
        # Approx char width logic: font_size * 0.6 is a safe-ish estimate for variable width fonts
        chars_per_line = int(width / (font_size * 0.6))
        lines = textwrap.wrap(sentence, width=chars_per_line)

        # Calculate Vertical Center of Text within the Scrim
        # total_text_height = len(lines) * line_height
        # top_padding = (scrim_height - total_text_height) / 2
        line_height = font_size * 1.2
        total_text_height = len(lines) * line_height
        text_start_y = start_y + (scrim_height - total_text_height) / 2

        # Draw Lines
        current_y = text_start_y
        for line in lines:
            text_bbox = draw.textbbox((0, 0), line, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_x = (width - text_width) / 2

            draw.text((text_x, current_y), line, font=font, fill=(255, 255, 255))
            current_y += line_height

        # 4. Save to Buffer
        output_buffer = io.BytesIO()
        base.save(output_buffer, format="PNG")
        output_bytes = output_buffer.getvalue()

    except Exception as e:
        return f"Error processing image with PIL: {e}"

    # 5. Upload Final Image to GCS
    final_blob_name = f"composed/{generation_id}.png"
    final_blob = bucket.blob(final_blob_name)

    final_blob.upload_from_string(output_bytes, content_type="image/png")

    # 6. Return the new URI
    return f"gs://{bucket_name}/{final_blob_name}"


# uv run -m src.builder.tools.combine
if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    data = {
        "generationId": "93a275e5-f887-40d2-a881-87c2e20cd7a4",
        "rawMedia": "gs://multimodal-custom-agent-assets/raw/93a275e5-f887-40d2-a881-87c2e20cd7a4.png",
        "sentence": "The boy looks at the enormous yellow dog.",
    }

    response = create_composite_card_tool(
        data["generationId"], data["rawMedia"], data["sentence"]
    )

    print(response)
