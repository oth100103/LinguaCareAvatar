"use client";

import { useState } from "react";
import { Room, RoomEvent } from "livekit-client";

export default function Home() {
  const [scenario, setScenario] = useState("job interview");
  const [level, setLevel] = useState("A2");
  const [status, setStatus] = useState("idle");
  const [room, setRoom] = useState<Room | null>(null);

  const updateConfig = async (newScenario: string, newLevel: string) => {
    setStatus("saving");

    await fetch("/api/config", {
      method: "POST",
      body: JSON.stringify({
        scenario: newScenario,
        level: newLevel,
      }),
    });

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-6">
        <div className="w-full rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-300">
              LinguaCare
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              Voice Agent Control Panel
            </h1>
            <p className="mt-3 text-slate-300">
              Steuere Szenario und Sprachniveau für deinen Avatar in Echtzeit.
            </p>

            {/* Status */}
            <div className="mt-3 text-sm text-slate-400">
              {status === "saving" && "Updating..."}
              {status === "saved" && "Saved ✓"}
            </div>
          </div>

          {/* Controls */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Scenario */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <label className="mb-3 block text-sm font-medium text-slate-200">
                Szenario
              </label>
              <select
                value={scenario}
                onChange={(e) => {
                  const value = e.target.value;
                  setScenario(value);
                  updateConfig(value, level);
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 p-3 text-white outline-none"
              >
                <option value="job interview">Job Interview</option>
                <option value="cafe">Café</option>
              </select>
              <p className="mt-3 text-sm text-slate-400">
                Wähle den Gesprächskontext für die Session.
              </p>
            </div>

            {/* Level */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <label className="mb-3 block text-sm font-medium text-slate-200">
                Niveau
              </label>
              <select
                value={level}
                onChange={(e) => {
                  const value = e.target.value;
                  setLevel(value);
                  updateConfig(scenario, value);
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 p-3 text-white outline-none"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
              <p className="mt-3 text-sm text-slate-400">
                Passe die sprachliche Komplexität an.
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
              <p className="text-sm text-cyan-200">Aktives Szenario</p>
              <p className="mt-2 text-2xl font-semibold">{scenario}</p>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-sm text-emerald-200">Aktuelles Niveau</p>
              <p className="mt-2 text-2xl font-semibold">{level}</p>
            </div>
          </div>

          {/* Connect Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={async () => {
                console.log("CLICK CONNECT");
                const room = new Room();
                room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
                  console.log("track subscribed:", track.kind, participant.identity);
                
                  if (track.kind === "audio") {
                    const audioElement = track.attach();
                    audioElement.muted = false;
                  
                    audioElement.controls = true;
                    audioElement.style.display = "block";
                    audioElement.autoplay = true;
                  
                    document.body.appendChild(audioElement);
                  
                    
                  }
                });
                const res = await fetch("/api/token");
                const data = await res.json();
                const dispatchRes = await fetch("/api/dispatch", { method: "POST" });
                const dispatchData = await dispatchRes.json();
                console.log("dispatch status:", dispatchRes.status);
                console.log("dispatch response:", dispatchData);
                await new Promise((r) => setTimeout(r, 1500));
                if (!res.ok) {
                  throw new Error(data.error || "Failed to fetch token");
                }

                console.log("LiveKit token response:", data);
                console.log("before connect");

                await room.connect(data.wsUrl, data.token);

                console.log("after connect");

                setRoom(room);
                console.log("remote participants:", room.remoteParticipants.size);
                console.log("room state:", room.state);
                setStatus("saved");
                }}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}