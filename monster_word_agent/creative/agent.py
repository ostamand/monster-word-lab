import asyncio
import json

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.models import Gemini
from google.adk.runners import InMemoryRunner
from dotenv import load_dotenv

from .instructions import INSCTUCTIONS_V1
from ..app_configs import configs


creative_agent = LlmAgent(
    name="CreativeDirector",
    instruction=INSCTUCTIONS_V1,
    model=Gemini(model=configs.llm_model),
)


async def main():
    from ..teacher.agent import teacher_agent

    sequential_agent = SequentialAgent(
        name="SequentialAgent", sub_agents=[teacher_agent, creative_agent]
    )

    runner = InMemoryRunner(agent=sequential_agent)

    user_request = {
        "age": 6,
        "language": "en",
        "theme": None,
        "targetWord": None,
    }

    response = await runner.run_debug(
        json.dumps(user_request),
        verbose=True,
    )


# uv run -m monster-word-agent.creative.agent
if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())
