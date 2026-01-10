from google.adk.agents import SequentialAgent

from .teacher.agent import teacher_agent
from .creative.agent import creative_agent
from .builder.agent import builder_agent


root_agent = SequentialAgent(
    name="MonsterWordAgent",
    description="Generates learning flashcards for kids",
    sub_agents=[teacher_agent, creative_agent, builder_agent],
)
