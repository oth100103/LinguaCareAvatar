import logging
import os

from dotenv import load_dotenv

from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, WorkerType, cli
from livekit.plugins import openai, tavus

logger = logging.getLogger("tavus-avatar-example")
logger.setLevel(logging.INFO)

load_dotenv()


async def entrypoint(ctx: JobContext):
    # Connect to the LiveKit room before accessing local_participant-dependent features
    await ctx.connect()
    scenario = "job interview"
    level = "A2"
    session = AgentSession(
        llm=openai.realtime.RealtimeModel(
    voice="alloy",
    temperature=0.7,
        )
    )

    persona_id = os.getenv("TAVUS_PERSONA_ID")
    replica_id = os.getenv("TAVUS_REPLICA_ID")
    tavus_avatar = tavus.AvatarSession(persona_id=persona_id, replica_id=replica_id)

    # start the agent first so it connects to the room
    await session.start(
        agent=Agent(instructions=f"""
You are LinguaCare, a German tutor for the scenario: {scenario}.

Level: {level}
If the user says:
- "set level to A1/A2/B1/B2"
→ confirm the change and adapt immediately

Rules:
- Speak ONLY German
- Adapt language to CEFR level {level}
- Use appropriate vocabulary and sentence complexity
- Max 2 sentences
- Correct mistakes briefly
- Ask one follow-up question

Level guidance:
A1: very simple words, short sentences
A2: simple everyday language
B1: normal conversation
B2: more complex explanations

Style:
- Friendly, structured, teacher-like
- No flirting, no emotional bonding
"""),
        room=ctx.room,
    )

    # now start the avatar, room is connected and local_participant is available
    await tavus_avatar.start(session, room=ctx.room)

    session.generate_reply(instructions="Sage Hallo in deutsche")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, worker_type=WorkerType.ROOM))