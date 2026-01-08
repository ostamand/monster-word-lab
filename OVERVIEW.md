# Project Design: AI-Powered Visual Vocabulary Builder

## 1. Project Overview

**Goal:** Build a custom multi-agent system using Google Agent Development Kit (ADK) to generate high-quality, safe, and age-appropriate visual learning aids for children.

**The "Product":** A web interface where parents input child demographics (age, language) and learning goals. The system outputs a high-fidelity image with a vocabulary sentence overlaid and an accompanying audio pronunciation file ("Click for Answer").

**Core Philosophy:**

- **Safety First:** Strict filtering to ensure content is appropriate for the specific age group.
- **High Quality:** Professional-grade image composition and legibility (no AI-mangled text).
- **Pedagogical Value:** Sentences and visuals are tailored to learning levels, not just random generation.

## 2. User Experience Flow

### Input (Parent View)

The parent provides the following context:

- **Child Profile:** Age (e.g., "4"), Language (e.g., "English").
- **Constraint (Optional):** Target Word (e.g., "Astronaut").
- **Theme (Optional):** Context preference (e.g., "Space", "Dinosaurs", "Pixar Style").

### Output (Child View)

1. **Visual:** A beautiful, age-appropriate image depicting the sentence. The text is clearly overlaid on the image using high-contrast design.
2. **Audio:** A button to play the sentence (Text-to-Speech) to reinforce pronunciation.

## 3. System Architecture: "The Educational Studio"

The backend utilizes a **Sequential Multi-Agent Architecture** with a Quality Assurance loop.

### The Flow

`User Input` **[Pedagogical Agent]** **[Guardian Agent]** **[Creative Director]** **[Builder Agent]** **[Critic Agent]** `Final Output`

### Agent Definitions

#### Agent 1: The Pedagogical Architect ("The Teacher")

- **Role:** Curriculum design and sentence construction.
- **Responsibility:**
- Selects a word if none is provided based on age-appropriate word lists (e.g., Dolch, CEFR).
- Constructs a sentence that explains the word through context.
- Adjusts complexity (Lexile level) based on age.

- **Output:** JSON object containing `target_word`, `sentence_text`, and `difficulty_level`.

#### Agent 2: The Guardian ("The Safety Officer")

- **Role:** Content moderation and age-appropriateness.
- **Responsibility:**
- Strictly reviews the sentence from the _Pedagogical Architect_.
- **Contextual Safety:** Ensures concepts are not too abstract or scary for the specific age (e.g., "Vampire" might be rejected for a 3-year-old).

- **Action:**
- _Pass:_ Forward to Creative Director.
- _Fail:_ Return to Pedagogical Architect with specific rejection reason.

#### Agent 3: The Creative Director ("The Artist")

- **Role:** Visual conceptualization and prompt engineering.
- **Responsibility:**
- Translates the educational sentence into a stable diffusion/Imagen prompt.
- **Composition Control:** Explicitly requests "Negative Space" (e.g., "wide angle, empty clear sky in top 30%") to ensure the text overlay will be legible later.
- **Style Enforcement:** Applies the requested theme (e.g., "Claymation", "Watercolor").

- **Output:** Refined Image Prompt string.

#### Agent 4: The Builder ("The Engineer")

- **Role:** Execution and Tool Use. This agent handles the technical assembly.
- **Tools Required:**

1. `image_generation_tool`: Calls Google Imagen 3 (or similar).
2. `text_overlay_tool`: Python (PIL/Pillow) script to programmatically render text onto the image (ensures perfect spelling).
3. `speech_synthesis_tool`: Calls Google Cloud TTS to generate the `.mp3`.

- **Output:** URL to the composed Image and URL to the Audio file.

#### Agent 5: The Critic ("QA Lead")

- **Role:** Quality Assurance and Verification.
- **Responsibility:**
- Uses a Vision Model (e.g., Gemini Pro Vision) to "look" at the final image.
- **Legibility Check:** "Is the text clearly readable against the background?"
- **Safety Check:** "Did the image generator accidentally create something distorted or scary?"

- **Action:**
- _Approve:_ Release to User.
- _Reject:_ Send feedback loop to _Creative Director_ to regenerate with simpler background or different composition.

## 4. Technical Specifications

### Data Model (State)

The following state object is passed between agents:

```json
{
  "user_context": {
    "age": 5,
    "language": "en-US",
    "theme": "Space"
  },
  "learning_content": {
    "word": "Rocket",
    "sentence": "The rocket flies to the moon."
  },
  "assets": {
    "image_prompt": "...",
    "raw_image_path": "...",
    "final_image_path": "...",
    "audio_path": "..."
  },
  "qa_status": "pending" // approved | rejected
}
```

### Tooling Requirements

To support the **Builder Agent**, the following Python functions must be exposed as tools:

1. **`generate_image(prompt: str)`**: Wrapper for Image Generation API.
2. **`generate_speech(text: str)`**: Wrapper for Text-to-Speech API.
3. **`render_card(image_path: str, text: str)`**:

- _Logic:_ Loads image, calculates negative space average color (dark vs light), selects contrasting text color, draws text with a semi-transparent background box (scrim) for guaranteed legibility.

## 5. Implementation Roadmap

**Phase 1: The Core Pipeline**

- Implement Agents 1, 3, and 4.

* Build the Python `render_card` tool (Crucial for "High Quality" text).
* Validate that text overlay looks professional.

**Phase 2: Safety & Logic**

- Implement Agent 2 (Guardian).
- Test boundary cases (e.g., asking for "monsters" for a 2-year-old).

**Phase 3: The Critic Loop**

- Implement Agent 5 (Critic).
- Wire up the feedback mechanism so the system automatically regenerates bad images without user intervention.
