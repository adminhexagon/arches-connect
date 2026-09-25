import { Link } from 'react-router-dom'
import { getPerson } from '../data/network'
import { draftIntro } from '../lib/draft'
import type { Objective, Opportunity } from '../types'
import { IntroCard } from './IntroCard'
import { Logo } from './Logo'
import { StorageBanner } from './StorageBanner'

const sampleObjective: Objective = {
  id: 'sample-obj',
  title: 'Win customers',
  kind: 'customers',
  status: 'active',
  context: 'A billing API for logistics operators',
  timing: 'This quarter',
  createdAt: '2026-03-01T00:00:00.000Z',
}

function sampleOpportunity(): Opportunity | null {
  const person = getPerson('lena-voss')
  if (!person) return null
  return {
    id: 'sample-opp',
    personId: person.id,
    objectiveId: sampleObjective.id,
    stage: 'intro_proposed',
    whyNow: person.whyNow,
    reasonYou: person.fitForYou,
    reasonThem: person.fitForThem,
    mutual: person.warmPath.mutual,
    relationship: person.warmPath.relationship,
    shared: person.warmPath.shared,
    draft: draftIntro(person, sampleObjective),
    followUpDraft: '',
    createdAt: sampleObjective.createdAt,
    updatedAt: sampleObjective.createdAt,
    activity: [],
  }
}

const STEPS = [
  {
    n: '01',
    title: 'Set the objective',
    body: 'Raise, win customers, find a partner or advisor, hire a provider — or write your own.',
  },
  {
    n: '02',
    title: 'Give the context',
    body: 'What you offer, who should care, and when it needs to move. Connect will not guess a private network.',
  },
  {
    n: '03',
    title: 'Review a warm path',
    body: 'A person, why both sides should meet now, and the mutual who can actually introduce you.',
  },
  {
    n: '04',
    title: 'Approve, then follow through',
    body: 'Approval is a log. Nothing is emailed. The next move stays on the pipeline until you close it.',
  },
]

const ROWS: { label: string; assistant: string; intro: string; connect: string }[] = [
  {
    label: 'What it is',
    assistant: 'A general assistant for answers, drafts, and thinking.',
    intro: 'A way to get introduced, then the relationship is yours to run.',
    connect: 'An objective-driven relationship agent for outreach.',
  },
  {
    label: 'What you give it',
    assistant: 'A prompt or a task.',
    intro: 'A person you hope to meet.',
    connect: 'An objective, plus enough context to qualify a fit.',
  },
  {
    label: 'Who it looks for',
    assistant: 'Sources and ideas you can research yourself.',
    intro: 'Someone willing to make an introduction.',
    connect: 'A person with a reason to meet now, from a clearly labeled demo graph.',
  },
  {
    label: 'Warm paths',
    assistant: 'It can help you think about who might know whom.',
    intro: 'The introduction is the product.',
    connect: 'Every proposal names the mutual and the shared context. No invented marketplace.',
  },
  {
    label: 'The intro',
    assistant: 'It can draft outreach if you ask.',
    intro: 'It makes the introduction.',
    connect: 'It drafts the note and waits. You approve, edit, or reject.',
  },
  {
    label: 'Follow-through',
    assistant: 'It helps when you come back with another prompt.',
    intro: 'Often ends once the intro happens.',
    connect: 'Tracks approved → introduced → following up → closed or nurture.',
  },
  {
    label: 'This preview',
    assistant: '—',
    intro: '—',
    connect: 'Local demo data and simulated reasoning. Approval does not send email.',
  },
]

export function Landing() {
  const sample = sampleOpportunity()
  return (
    <div className="landing">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <StorageBanner />
      <header className="topnav">
        <Link to="/" className="brand">
          <Logo />
          <span>Arches Connect</span>
        </Link>
        <nav className="nav-links" aria-label="Product">
          <a href="#how">How it works</a>
          <a href="#compare">Compare</a>
          <a href="#preview">Preview</a>
        </nav>
        <div className="nav-cta">
          <Link to="/app/chat" className="text-link">
            Start chat
          </Link>
          <Link to="/app/chat" className="btn btn-primary">
            Hire Connect
          </Link>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" /> Objective-led outreach
            </p>
            <h1>
              Give Connect the objective.
              <em> It works the relationship.</em>
            </h1>
            <p className="lede">
              Raise, win customers, find a partner or advisor, hire a provider. Connect interviews you, qualifies who has a
              reason to meet now, and drafts the warm intro. You approve every move.
            </p>
            <div className="hero-actions">
              <Link to="/app/chat" className="btn btn-primary">
                Hire Connect
              </Link>
              <Link to="/app/chat" className="btn btn-secondary">
                Start chat
              </Link>
            </div>
            <p className="fine">Local demo data. Simulated reasoning. No emails sent.</p>
            <ol className="rail">
              <li>Objective</li>
              <li>Context</li>
              <li>Warm path</li>
              <li>Approval</li>
              <li>Follow-through</li>
            </ol>
          </div>
          <aside className="mini-chat" aria-label="Preview of a conversation">
            <div className="mini-top">
              <Logo size={22} />
              <div>
                <strong>Connect</strong>
                <span>Preview · not a live send</span>
              </div>
            </div>
            <p className="mini-agent">What are you trying to achieve?</p>
            <p className="mini-user">Win customers in logistics this quarter.</p>
            <p className="mini-agent">
              Harborline is replacing its billing stack. The warm path is Sam Ortiz, a customer who used to work with Lena
              Voss. I drafted the ask. It waits for your approval.
            </p>
            <p className="mini-note">Nothing in this preview is emailed.</p>
          </aside>
        </section>

        <section className="statement">
          <p>One tool answers. Another introduces. Connect stays on the objective until the next move is done.</p>
        </section>

        <section id="how" className="section">
          <div className="section-head">
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" /> How it works
            </p>
            <h2>From objective to next move.</h2>
          </div>
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.n}>
                <span>{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="compare" className="section">
          <div className="section-head">
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" /> Where it sits
            </p>
            <h2>Answers, introductions, or the work.</h2>
          </div>
          <div className="compare">
            <article className="compare-card">
              <h3>A general assistant</h3>
              <p>Useful when you need an answer, a draft, or a way to think something through.</p>
              <p className="card-foot">Choose it when the output is the work.</p>
            </article>
            <article className="compare-card">
              <h3>An intro network</h3>
              <p>Useful when the valuable thing is the introduction itself, and you will run the relationship after.</p>
              <p className="card-foot">Choose it when getting connected is the job.</p>
            </article>
            <article className="compare-card compare-lead">
              <h3>Connect</h3>
              <p>You bring the objective. It qualifies a person, drafts the warm intro, and tracks what happens after you approve.</p>
              <ul>
                <li>Works from an objective, not a one-off prompt</li>
                <li>Asks why both sides should meet now</li>
                <li>Names a warm path it can explain</li>
                <li>Refuses to send without approval</li>
                <li>Keeps the next move on the pipeline</li>
              </ul>
              <p className="card-foot">This preview does the workflow on demo data. It does not reach a live network.</p>
            </article>
          </div>

          <div className="table-wrap">
            <table className="feature-table">
              <caption>What changes when the job is the relationship, not the answer</caption>
              <thead>
                <tr>
                  <th scope="col"> </th>
                  <th scope="col">General assistant</th>
                  <th scope="col">Intro-only</th>
                  <th scope="col">Connect</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.assistant}</td>
                    <td>{row.intro}</td>
                    <td>{row.connect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="preview" className="section">
          <div className="section-head">
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" /> The approval
            </p>
            <h2>The intro does not move until you say so.</h2>
            <p className="lede-sm">
              A sample from the demo graph. Lena, Sam, and Harborline are fictional. Hiring Connect starts a fresh
              workspace in this browser.
            </p>
          </div>
          {sample ? <IntroCard opportunity={sample} mode="sample" /> : null}
        </section>

        <section className="closing">
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> Start
          </p>
          <h2>Tell Connect what you’re trying to achieve.</h2>
          <p>No account. No credit card. The demo stays on this device.</p>
          <div className="hero-actions">
            <Link to="/app/chat" className="btn btn-primary">
              Hire Connect
            </Link>
            <Link to="/app/chat" className="btn btn-secondary">
              Start chat
            </Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <Logo />
          <strong>Arches Connect</strong>
        </div>
        <p>Working preview of objective-led outreach. Demo relationships stay in your browser. Nothing is sent.</p>
        <nav aria-label="Footer">
          <a href="#how">How it works</a>
          <a href="#compare">Compare</a>
          <Link to="/app/chat">Start chat</Link>
        </nav>
      </footer>
    </div>
  )
}
