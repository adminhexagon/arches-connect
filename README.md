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

The app opens in the workspace: sidebar, Connect’s chat, and a context rail. There is no brochure homepage.

1. **Hire Connect** starts the investor objective. Lead generation and Resellers stay as chips.
2. Answer the context and timing questions. That interview is saved as a past search.
3. Review the intro card: why both sides should meet, the warm path, and the draft.
4. **Talk with Maya Chen** (or another match) opens a demo thread. Replies are fictional and labeled. Nothing is emailed.
5. **Approve intro**, **Edit intro**, or **Reject intro**. Approval updates the pipeline and shows the next move. It does not email anyone.
6. Searches, matches, drafts, pipeline status, Connect’s chat, and person threads persist in IndexedDB (`arches-connect`, schema version 2). A previous `localStorage` copy is imported once.

## What is real vs simulated

| Real in this preview | Simulated |
| --- | --- |
| Objective interview, validation, and status (active / paused / done) | People, companies, and mutuals — all fictional |
| Intro draft you can edit | “Reasoning” is a deterministic matcher and templates, not a live model |
| Approval, rejection, and follow-through logged on the pipeline | Approval does not send email or message a mutual |
| Memory notes and preferences | No Syrena, Boardy, or other private network |
| IndexedDB persistence for searches, chats, matches, and demo threads, with a visible error if storage fails | No accounts, billing, or production deploy |

## Workspace

- `/` Connect’s chat inside the workspace
- `/talk/:id` demo conversation with a matched person
- `/objectives` objectives and linked activity
- `/pipeline` stages from researching through closed / nurture
- `/memory` summary, preferences, outcomes
