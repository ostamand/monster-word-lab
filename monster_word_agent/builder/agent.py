import asyncio
import json

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.models import Gemini
from google.adk.runners import InMemoryRunner
from dotenv import load_dotenv

from .instructions import INSTRUCTIONS_V1
from .tools.combine import create_composite_card_tool
from .tools.generate import generate_image_tool
from .tools.speech import generate_speech_tool
from .tools.persistence import persist_media_paths
from ..app_configs import configs

builder_agent = LlmAgent(
    name="BuilderAgent",
    instruction=INSTRUCTIONS_V1,
    model=Gemini(model=configs.llm_model),
    tools=[
        generate_image_tool,
        generate_speech_tool,
        create_composite_card_tool,
        persist_media_paths,
    ],
)


async def main():
    from ..teacher.agent import teacher_agent
    from ..creative.agent import creative_agent

    sequential_agent = SequentialAgent(
        name="SequentialAgent",
        sub_agents=[teacher_agent, creative_agent, builder_agent],
    )

    runner = InMemoryRunner(agent=sequential_agent)

    user_request = {
        "age": 5,
        "language": "fr",
        "theme": None,
        "targetWord": "petit",
    }

    response = await runner.run_debug(
        json.dumps(user_request),
        verbose=True,
    )


# python -m monster_word_agent.builder.agent
if __name__ == "__main__":
    load_dotenv()
    asyncio.run(main())
