import asyncio
import json

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.models import Gemini
from google.adk.runners import InMemoryRunner
from dotenv import load_dotenv

from .instructions import INSTRUCTIONS_V1
from .tools.orchestrator import build_media_assets_tool
from ..app_configs import configs

builder_agent = LlmAgent(
    name="BuilderAgent",
    instruction=INSTRUCTIONS_V1,
    model=Gemini(model=configs.llm_model),
    tools=[
        build_media_assets_tool,
    ],
)


async def main():
    from ..designer.agent import designer_agent

    sequential_agent = SequentialAgent(
        name="SequentialAgent",
        sub_agents=[designer_agent, builder_agent],
    )

    runner = InMemoryRunner(agent=sequential_agent)

    user_request = {
        "age": 5,
        "language": "fr",
        "theme": None,
        "targetWord": None,
    }

    response = await runner.run_debug(
        json.dumps(user_request),
        verbose=True,
    )


# python -m monster_word_agent.builder.agent
if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())
