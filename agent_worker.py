import os
os.environ["LIVEKIT_DISABLE_TELEMETRY"] = "1"

import asyncio
import time
import threading
import requests

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
}


# -----------------------------
# CONFIG VOM FRONTEND HOLEN
# -----------------------------
def get_config():
    try:
        res = requests.get("http://localhost:3000/api/config")
        return res.json()
    except:
        return state


# -----------------------------
# POLLING THREAD (Live Update)
# -----------------------------
def poll_config():
    global state
    while True:
        config = get_config()
        state["scenario"] = config.get("scenario", state["scenario"])
        state["level"] = config.get("level", state["level"])
        print("Live state updated:", state)
        time.sleep(3)


# -----------------------------
# DYNAMISCHER PROMPT
# -----------------------------
def build_instructions():
    scenario = state["scenario"]
    level = state["level"]

    return f"""
You are LinguaCare, a German tutor for the scenario: {scenario}.

Level: {level}

Rules:
- Speak ONLY German
- Adapt language to CEFR level {level}
- Use simple, clear sentences
- Max 2 sentences
- Ask one follow-up question
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
    )
    print("AFTER SESSION START")
    
    await session.generate_reply(
    instructions=build_instructions() + "\n\nBegrüße den Nutzer auf Deutsch und stelle eine einfache Frage."
    )
    print("AFTER GENERATE REPLY")


    # 🔥 LIVE PROMPT UPDATE LOOP
    

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(entrypoint_fnc=entrypoint)
    )