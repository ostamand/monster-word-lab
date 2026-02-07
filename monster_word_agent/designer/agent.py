import json
import asyncio

from google.adk.agents import LlmAgent
from google.adk.models import Gemini
from google.adk.runners import InMemoryRunner
from dotenv import load_dotenv

from .instructions import INSTRUCTIONS_V1
from ..teacher.tools import persist_learning_data, get_previous_sentences
from ..app_configs import configs

designer_agent = LlmAgent(
    name="DesignerAgent",
    instruction=INSTRUCTIONS_V1,
    model=Gemini(model=configs.llm_model),
    tools=[persist_learning_data, get_previous_sentences],
)

async def main():
    runner = InMemoryRunner(agent=designer_agent)

    user_request = {
        "age": 6,
        "language": "fr",
        "theme": "Forest",
        "targetWord": None,
    }

    await runner.run_debug(
        json.dumps(user_request),
        verbose=True,
    )

if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())
