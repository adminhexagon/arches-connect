export function BillingPage() {
  return (
    <div className="panel-scroll">
      <header className="page-head">
        <h1>Billing</h1>
        <p>Billing is not part of this preview. There is nothing to buy, and no card is stored.</p>
      </header>
      <div className="empty-panel">
        <h2>No plan to manage</h2>
        <p>Connect runs locally in this browser. Approval still does not send email.</p>
      </div>
    </div>
  )
}

export function ReferralsPage() {
  return (
    <div className="panel-scroll">
      <header className="page-head">
        <h1>Referrals</h1>
        <p>Referrals are not part of this preview. There is no invite link and no reward balance.</p>
      </header>
      <div className="empty-panel">
        <h2>Nothing to share yet</h2>
        <p>When a live workspace exists, invites can live here. This demo does not create them.</p>
      </div>
    </div>
  )
}
