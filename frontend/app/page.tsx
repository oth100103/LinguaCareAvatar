'use client';

import { useEffect, useState } from 'react';
import { useSession, useAgent } from '@livekit/components-react';
import { TokenSource } from 'livekit-client';

import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { AgentControlBar } from '@/components/agents-ui/agent-control-bar';
import { AgentAudioVisualizerAura } from '@/components/agents-ui/agent-audio-visualizer-aura';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';

const TOKEN_SOURCE = TokenSource.endpoint('/api/token');

type DemoProps = {
  scenario: string;
  tone: string;
  level: string;
  setScenario: (value: string) => void;
  setTone: (value: string) => void;
  setLevel: (value: string) => void;
  updateConfig: (
    scenario: string,
    level: string,
    tone: string
  ) => Promise<void>;
};

export default function Page() {
  const session = useSession(TOKEN_SOURCE, { agentName: 'default' });

  const [scenario, setScenario] = useState('job interview');
  const [tone, setTone] = useState('friendly');
  const [level, setLevel] = useState('A2');

  useEffect(() => {
    if (!session) return;
  
    console.log('SESSION START TRIGGERED');
  
    session.start().catch((err) => {
      console.error('SESSION ERROR', err);
    });
  }, [session]);

  const updateConfig = async (
    newScenario: string,
    newLevel: string,
    newTone: string
  ) => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: newScenario,
          level: newLevel,
          tone: newTone,
        }),
      });
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
      <select
      onChange={(e) => {
        setScenario(e.target.value);
        updateConfig(e.target.value, level, tone);
      }}
      >
          <option value="job interview">Job Interview</option>
          <option value="restaurant">Restaurant</option>
          <option value="doctor">Doctor</option>
        </select>
      </div>
  
      <AgentSessionProvider session={session}>
        <Demo
          scenario={scenario}
          tone={tone}
          level={level}
          setScenario={setScenario}
          setTone={setTone}
          setLevel={setLevel}
          updateConfig={updateConfig}
        />
      </AgentSessionProvider>
    </div>
  );
}

function Demo({
  scenario,
  tone,
  level,
  setScenario,
  setTone,
  setLevel,
  updateConfig,
}: DemoProps) {
  const { state } = useAgent();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            LinguaCare
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Voice Learning Studio
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Passe Szenario, Tonalität und Sprachniveau an und starte direkt die
            Sprachübung mit deinem Live-Agenten.
          </p>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Session Setup</h2>
              <p className="mt-1 text-sm text-slate-300">
                Definiere die Lernsituation vor dem Gespräch.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Szenario
                </label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  value={scenario}
                  onChange={(e) => {
                    const value = e.target.value;
                    setScenario(value);
                    void updateConfig(value, level, tone);
                  }}
                >
                  <option value="job interview">Job Interview</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Tonalität
                </label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  value={tone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTone(value);
                    void updateConfig(scenario, level, value);
                  }}
                >
                  <option value="friendly">Friendly</option>
                  <option value="strict">Strict</option>
                  <option value="annoyed">Annoyed</option>
                  <option value="formal">Formal</option>
                  <option value="nervous">Nervous</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Niveau
                </label>
                <select
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  value={level}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLevel(value);
                    void updateConfig(scenario, value, tone);
                  }}
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-xs uppercase tracking-wide text-cyan-300">
                  Aktives Szenario
                </p>
                <p className="mt-2 text-2xl font-semibold capitalize">
                  {scenario}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-300">
                  Aktuelles Niveau
                </p>
                <p className="mt-2 text-2xl font-semibold">{level}</p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                <p className="text-xs uppercase tracking-wide text-amber-300">
                  Aktuelle Tonalität
                </p>
                <p className="mt-2 text-2xl font-semibold capitalize">{tone}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live Session</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Starte das Gespräch über das Mikrofon und beobachte Audio und
                  Transcript in Echtzeit.
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-3xl border border-white/10 bg-slate-950/40 p-6">
              <AgentAudioVisualizerAura state={state} />
            </div>

            <div className="mb-6 rounded-3xl border border-white/10 bg-slate-950/40 p-4">
              <AgentChatTranscript agentState={state} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
              <AgentControlBar
                variant="livekit"
                isChatOpen={false}
                isConnected={true}
                controls={{
                  leave: true,
                  microphone: true,
                  camera: false,
                  screenShare: false,
                  chat: true,
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}