import json
import asyncio

from google.adk.agents import LlmAgent
from google.adk.models import Gemini
from google.adk.runners import InMemoryRunner
from dotenv import load_dotenv


from .instructions import INSTRUCTIONS_V1
from .tools import persist_learning_data
from ..app_configs import configs


teacher_agent = LlmAgent(
    name="PedagocialArchitect",
    instruction=INSTRUCTIONS_V1,
    model=Gemini(model=configs.llm_model),  # TODO: check use_interactions_api
    tools=[persist_learning_data],
)


async def main():
    runner = InMemoryRunner(agent=teacher_agent)

    user_request = {
        "gender": "f",
        "age": 6,
        "language": "fr",
        "theme": "Forest",
        "targetWord": None,
    }

    await runner.run_debug(
        json.dumps(user_request),
        verbose=True,
    )


# python -m  monster-word-agent.teacher.agent
if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())
