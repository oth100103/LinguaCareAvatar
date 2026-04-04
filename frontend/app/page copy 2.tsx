'use client';

import { useSession, useAgent } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { TokenSource } from 'livekit-client';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { AgentControlBar } from '@/components/agents-ui/agent-control-bar';
import { AgentAudioVisualizerAura } from '@/components/agents-ui/agent-audio-visualizer-aura';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';

const TOKEN_SOURCE = TokenSource.endpoint('/api/token');

export default function Page() {
  const session = useSession(TOKEN_SOURCE, { agentName: 'default' });
  const [scenario, setScenario] = useState('job interview');
const [tone, setTone] = useState('friendly');
const [level, setLevel] = useState('A2');
  useEffect(() => {
    session.start().catch(console.error);
  }, []);
  const saveConfig = async (newScenario: string, newTone: string, newLevel: string) => {
    await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario: newScenario,
        tone: newTone,
        level: newLevel,
      }),
    });
  };
  return (
    <AgentSessionProvider session={session}>
      <Demo />
    </AgentSessionProvider>
  );
}

function Demo() {
  const { state } = useAgent();

  return (
    <div className="p-10">
      <AgentChatTranscript agentState={state} />

      <AgentAudioVisualizerAura state={state} />

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
  );
}