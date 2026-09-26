import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DEMO_NOTICE, getPerson } from '../data/network'
import { useAppState } from '../state/AppState'
import { threadIdFor } from '../state/reducer'
import { STAGE_LABEL, STAGES, type PipelineStage } from '../types'
import { Avatar } from './Avatar'
import { IntroCard } from './IntroCard'
import { NextMove } from './NextMove'

type Filter = 'all' | PipelineStage

export function PipelinePanel() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('all')
  const visible = state.opportunities.filter((opportunity) => filter === 'all' || opportunity.stage === filter)

  return (
    <div className="panel-scroll">
      <header className="panel-head">
        <div>
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> Pipeline
          </p>
          <h1>People worth a move</h1>
          <p className="lede-sm">
            Investor outreach is the primary path — stage, check size, thesis, and a warm intro. Lead generation and
            resellers use the same stages. {DEMO_NOTICE}
          </p>
        </div>
      </header>

      <div className="pipe-filters" role="group" aria-label="Filter by stage">
        <FilterButton label="All" count={state.opportunities.length} pressed={filter === 'all'} onClick={() => setFilter('all')} />
        {STAGES.map((stage) => (
          <FilterButton
            key={stage}
            label={STAGE_LABEL[stage]}
            count={state.opportunities.filter((opportunity) => opportunity.stage === stage).length}
            pressed={filter === stage}
            onClick={() => setFilter(stage)}
          />
        ))}
      </div>

      {state.objectives.length === 0 ? (
        <div className="empty">
          <h2>The pipeline is empty</h2>
          <p>Set an objective in chat. Connect will qualify someone from the demo graph and wait for your approval.</p>
          <Link className="btn btn-primary" to="/">
            Start chat
          </Link>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <h2>Nobody in this stage</h2>
          <p>
            {state.opportunities.length === 0
              ? 'Finish the short interview and a qualified person will land here.'
              : 'Try another stage, or keep working the objective in chat.'}
          </p>
        </div>
      ) : (
        <ul className="pipe-list">
          {visible.map((opportunity) => {
            const person = getPerson(opportunity.personId)
            const objective = state.objectives.find((item) => item.id === opportunity.objectiveId)
            if (!person) return null
            return (
              <li key={opportunity.id}>
                {objective ? <p className="kind-line pipe-obj">{objective.title}</p> : null}
                {opportunity.stage === 'intro_proposed' ? (
                  <IntroCard opportunity={opportunity} mode="pipeline" />
                ) : (
                  <article className="person-card" aria-label={person.name}>
                    <header className="intro-head">
                      <Avatar name={person.name} id={person.id} />
                      <div>
                        <p className="demo-pill">Demo profile</p>
                        <h2>{person.name}</h2>
                        <p className="muted">
                          {person.role} at {person.company}
                        </p>
                      </div>
                      <span className={`badge badge-${opportunity.stage}`}>{STAGE_LABEL[opportunity.stage]}</span>
                    </header>
                    <p>{opportunity.whyNow}</p>
                    {(opportunity.investment ?? person.investment) ? (
                      <dl className="fit-facts fit-facts-compact">
                        <div>
                          <dt>Stage</dt>
                          <dd>{(opportunity.investment ?? person.investment)?.stage}</dd>
                        </div>
                        <div>
                          <dt>Check</dt>
                          <dd>{(opportunity.investment ?? person.investment)?.checkSize}</dd>
                        </div>
                        <div>
                          <dt>Thesis</dt>
                          <dd>{(opportunity.investment ?? person.investment)?.thesis}</dd>
                        </div>
                        <div>
                          <dt>Geography</dt>
                          <dd>{(opportunity.investment ?? person.investment)?.geography}</dd>
                        </div>
                      </dl>
                    ) : null}
                    <p className="warm-inline">
                      <strong>Warm path:</strong> {opportunity.mutual} · {opportunity.relationship}
                    </p>
                    {opportunity.draft ? <pre className="draft-text">{opportunity.draft}</pre> : null}
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={() => {
                        dispatch({ type: 'open_thread', opportunityId: opportunity.id })
                        navigate(`/talk/${threadIdFor(opportunity.id)}`)
                      }}
                    >
                      Talk with {person.name}
                    </button>
                    {opportunity.stage === 'qualified' || opportunity.stage === 'researching' ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        disabled={objective?.status === 'paused'}
                        onClick={() => dispatch({ type: 'propose_intro', opportunityId: opportunity.id })}
                      >
                        {opportunity.stage === 'researching' ? 'Propose intro anyway' : 'Propose intro'}
                      </button>
                    ) : null}
                    {objective?.status === 'paused' && (opportunity.stage === 'qualified' || opportunity.stage === 'researching') ? (
                      <p className="muted">Resume the objective before proposing an intro.</p>
                    ) : null}
                    <NextMove opportunity={opportunity} />
                  </article>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function FilterButton({
  label,
  count,
  pressed,
  onClick,
}: {
  label: string
  count: number
  pressed: boolean
  onClick: () => void
}) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick}>
      {label} <span className="count">{count}</span>
    </button>
  )
}
