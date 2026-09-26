# Arches Connect

Connect is an objective-led outreach workspace. **Investor outreach is the primary path** — VCs, angels, and funds, matched on stage, check size, thesis, geography, and a warm path. Lead generation and resellers are available when the objective changes.

You give it that objective, it interviews you for context, qualifies people from a **fictional demo graph**, drafts a warm intro, and waits for approval before anything is treated as sent.

This preview does not access a live relationship network and does not send email. Demo people are labeled as demo.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Other commands:

```bash
npm test
npm run build
npm run preview
```

`npm test` runs Vitest once. `npm run build` typechecks and writes a production bundle to `dist/`.

## Product path

The app opens in a dark workspace: sidebar, new chat, and the views below. There is no brochure homepage.

1. **New chat** asks “What should Connect get done for you?” Investor outreach is the primary chip. Clients and reseller partners stay available.
2. Answer the context and timing questions. That interview is saved as a past search and listed in Chat History, Recent, and Objectives.
3. Review the intro card: why both sides should meet, the warm path, and the draft.
4. **Talk with Maya Chen** (or another match) opens a demo thread. Replies are fictional and labeled. Nothing is emailed.
5. **Approve intro**, **Edit intro**, or **Reject intro**. Approval updates the pipeline and shows the next move. It does not email anyone.
6. **Connectors** lists channels and tools. Choosing Connect does not run OAuth and does not mark anything Connected. Coming soon stays disabled.
7. **Memories** shows what Connect learned. A correction is saved on this device. Billing and Referrals are stubs.
8. Searches, matches, drafts, pipeline status, pins, corrections, Connect’s chat, and person threads persist in IndexedDB (`arches-connect`, schema version 2). A previous `localStorage` copy is imported once.

## What is real vs simulated

| Real in this preview | Simulated |
| --- | --- |
| Objective interview, validation, and status (active / paused / done) | People, companies, and mutuals — all fictional |
| Intro draft you can edit | “Reasoning” is a deterministic matcher and templates, not a live model |
| Approval, rejection, and follow-through logged on the pipeline | Approval does not send email or message a mutual |
| Memory notes, corrections, and preferences | No Syrena, Boardy, or other private network |
| Connector list (nothing is signed in) | No live Gmail, Slack, WhatsApp, or CRM connection |
| IndexedDB persistence for searches, chats, matches, and demo threads, with a visible error if storage fails | No accounts, billing, or production deploy |

## Workspace

- `/` New chat, then the active conversation with Connect
- `/history` saved chats with Connect and demo person threads
- `/talk/:id` demo conversation with a matched person
- `/objectives` search, Live / Closed, and status
- `/pipeline` intros and relationships in motion
- `/connectors` channels and tools, none of them live
- `/billing` and `/referrals` stubs
- Memories opens from the top bar
