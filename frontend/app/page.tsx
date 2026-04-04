'use client';

import { useSession, useAgent } from '@livekit/components-react';
import { useEffect } from 'react';
import { TokenSource } from 'livekit-client';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { AgentControlBar } from '@/components/agents-ui/agent-control-bar';
import { AgentAudioVisualizerAura } from '@/components/agents-ui/agent-audio-visualizer-aura';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';

const TOKEN_SOURCE = TokenSource.endpoint('/api/token');

export default function Page() {
  const session = useSession(TOKEN_SOURCE, { agentName: 'default' });
  useEffect(() => {
    session.start().catch(console.error);
  }, []);

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