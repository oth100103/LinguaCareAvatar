import os
os.environ["LIVEKIT_DISABLE_TELEMETRY"] = "1"

import asyncio
import time
import threading
import requests

transcript = []

from dotenv import load_dotenv
load_dotenv()
from livekit.agents import Agent, AgentSession, JobContext, cli, WorkerOptions
from livekit.plugins import openai
# from livekit.plugins import tavus


# -----------------------------
# GLOBAL STATE (wird vom Frontend gesteuert)
# -----------------------------
state = {
    "scenario": "job interview",
    "level": "A2",
    "tone": "friendly",
}

# -----------------------------
# CONFIG VOM FRONTEND HOLEN
# -----------------------------
def get_config():
    try:
        res = requests.get("http://localhost:3000/api/config")
        return res.json()
    except:
        return {
            "scenario": "job interview",
            "level": "A2",
            "tone": "neutral"
        }


# -----------------------------
# POLLING THREAD (Live Update)
# -----------------------------
def poll_config():
    global state
    while True:
        config = get_config()
        state["scenario"] = config.get("scenario", state["scenario"])
        state["level"] = config.get("level", state["level"])
        state["tone"] = config.get("tone", state["tone"])
        print("Live state updated:", state)
        time.sleep(3)


# -----------------------------
# DYNAMISCHER PROMPT
# -----------------------------
def build_instructions():
    scenario = state["scenario"]
    level = state["level"]
    tone = state["tone"]

    return f"""
You are LinguaCare, a German tutor.

Scenario: {scenario}
Level: {level}
Tone: {tone}

Rules:
- Speak ONLY German
- Adapt language to CEFR level {level}
- Use simple, clear sentences
- Max 2 sentences
- Ask one follow-up question

Behavior:
- friendly → warm, supportive
- strict → correct and direct
- annoyed → slightly impatient but still polite
- nervous → hesitant, unsure tone
- formal → polite and professional
"""

# -----------------------------
# ENTRYPOINT
# -----------------------------
async def entrypoint(ctx: JobContext):
    print("ENTRYPOINT STARTED FROM UI")
    print("ENTRYPOINT STARTED")
    print("Starting config polling thread...")
    threading.Thread(target=poll_config, daemon=True).start()

    await ctx.connect()

    # Tavus Avatar Setup
    persona_id = os.getenv("TAVUS_PERSONA_ID")
    replica_id = os.getenv("TAVUS_REPLICA_ID")

    # tavus_avatar = tavus.AvatarSession(
    #    persona_id=persona_id,
    #    replica_id=replica_id,
    #)

    # Agent erstellen
    agent = Agent(
    instructions=build_instructions()
    )

    # Session starten
    session = AgentSession(
        llm=openai.realtime.RealtimeModel(
            voice="alloy",
            temperature=0.7,
        )
    )
    
    await session.start(
    agent=agent,
    room=ctx.room,
    record=True,
    )
    print("AFTER SESSION START")
    
    await session.generate_reply(
    instructions=build_instructions()
    )
    print("AFTER GENERATE REPLY")


    # 🔥 LIVE PROMPT UPDATE LOOP
    

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(entrypoint_fnc=entrypoint)
    )