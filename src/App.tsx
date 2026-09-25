import { Navigate, Route, Routes } from 'react-router-dom'
import { ChatPanel } from './components/ChatPanel'
import { Landing } from './components/Landing'
import { MemoryPanel } from './components/MemoryPanel'
import { ObjectivesPanel } from './components/ObjectivesPanel'
import { PipelinePanel } from './components/PipelinePanel'
import { Workspace } from './components/Workspace'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<Workspace />}>
        <Route index element={<Navigate to="chat" replace />} />
        <Route path="chat" element={<ChatPanel />} />
        <Route path="objectives" element={<ObjectivesPanel />} />
        <Route path="pipeline" element={<PipelinePanel />} />
        <Route path="memory" element={<MemoryPanel />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
