import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ChatPanel } from './components/ChatPanel'
import { ConnectorsPanel } from './components/ConnectorsPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { ObjectivesPanel } from './components/ObjectivesPanel'
import { PersonChat } from './components/PersonChat'
import { PipelinePanel } from './components/PipelinePanel'
import { BillingPage, ReferralsPage } from './components/StubPage'
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
        <Route path="history" element={<HistoryPanel />} />
        <Route path="talk/:threadId" element={<TalkRoute />} />
        <Route path="objectives" element={<ObjectivesPanel />} />
        <Route path="pipeline" element={<PipelinePanel />} />
        <Route path="connectors" element={<ConnectorsPanel />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="referrals" element={<ReferralsPage />} />
      </Route>
      <Route path="/app/*" element={<Navigate to="/" replace />} />
      <Route path="/memory" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
