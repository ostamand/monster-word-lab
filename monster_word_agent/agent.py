from google.adk.agents import SequentialAgent

from .designer.agent import designer_agent
from .builder.agent import builder_agent


root_agent = SequentialAgent(
    name="MonsterWordAgent",
    description="Generates learning flashcards for kids",
    sub_agents=[designer_agent, builder_agent],
)
