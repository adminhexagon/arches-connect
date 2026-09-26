import { useState } from 'react'

interface Connector {
  id: string
  name: string
  body: string
  mode: 'connect' | 'soon'
}

const CHANNELS: Connector[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    body: 'Message Connect and keep an objective moving from WhatsApp.',
    mode: 'connect',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    body: 'Give Connect context from mail you choose, so an intro can start from a conversation you already had.',
    mode: 'connect',
  },
  {
    id: 'slack',
    name: 'Slack',
    body: 'Bring Connect into a workspace so a team can hand off an objective.',
    mode: 'soon',
  },
]

const TOOLS: Connector[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    body: 'Helps Connect understand your background and who you already know.',
    mode: 'connect',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    body: 'Helps Connect see who you are meeting and which relationships are already in motion.',
    mode: 'soon',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    body: 'Helps Connect understand contacts, companies, and deals without working blind.',
    mode: 'soon',
  },
  {
    id: 'notion',
    name: 'Notion',
    body: 'Gives Connect notes your team already wrote, so you do not have to explain them again.',
    mode: 'soon',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    body: 'Lets Connect use decks and documents you pick to understand the objective.',
    mode: 'soon',
  },
]

export function ConnectorsPanel() {
  const [notice, setNotice] = useState<string | null>(null)

  return (
    <div className="panel-scroll">
      <header className="page-head">
        <h1>Give Connect more context to work with.</h1>
        <p>Connect the places where your relationships and work already live. This preview does not sign in anywhere.</p>
      </header>

      <section className="connector-section" aria-labelledby="channels-heading">
        <h2 id="channels-heading">Channels</h2>
        <p>Work with Connect in the tools you already use.</p>
        <div className="connector-grid">
          {CHANNELS.map((item) => (
            <ConnectorCard key={item.id} item={item} onConnect={setNotice} />
          ))}
        </div>
      </section>

      <section className="connector-section" aria-labelledby="tools-heading">
        <h2 id="tools-heading">Your tools</h2>
        <p>Give Connect more context to work with.</p>
        <div className="connector-grid">
          {TOOLS.map((item) => (
            <ConnectorCard key={item.id} item={item} onConnect={setNotice} />
          ))}
        </div>
      </section>

      {notice ? (
        <p className="connector-notice" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  )
}

function ConnectorCard({ item, onConnect }: { item: Connector; onConnect: (message: string) => void }) {
  return (
    <article className="connector-card">
      <h3>{item.name}</h3>
      <p>{item.body}</p>
      {item.mode === 'soon' ? (
        <button type="button" className="btn btn-soon" disabled>
          Coming soon
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            onConnect(`${item.name} stays disconnected. This preview does not run a live sign-in, and nothing was connected.`)
          }
        >
          Connect {item.name}
        </button>
      )}
    </article>
  )
}
