import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ChatPanel } from './components/ChatPanel'
import { MemoryPanel } from './components/MemoryPanel'
import { ObjectivesPanel } from './components/ObjectivesPanel'
import { PersonChat } from './components/PersonChat'
import { PipelinePanel } from './components/PipelinePanel'
import { Workspace } from './components/Workspace'

function TalkRoute() {
  const { threadId = '' } = useParams()
  return <PersonChat threadId={threadId} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Workspace />}>
        <Route index element={<ChatPanel />} />
        <Route path="talk/:threadId" element={<TalkRoute />} />
        <Route path="objectives" element={<ObjectivesPanel />} />
        <Route path="pipeline" element={<PipelinePanel />} />
        <Route path="memory" element={<MemoryPanel />} />
      </Route>
      <Route path="/app/*" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
