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

1. Landing → **Hire Connect** or **Start chat**.
2. Tell Connect the objective. **Meet investors** is the default chip. Lead generation and Resellers are secondary. Blank or symbol-only objectives are rejected.
3. Answer the context and timing questions.
4. Review the intro card: why both sides should meet, the warm path, and the draft.
5. **Approve intro**, **Edit intro**, or **Reject intro**. Approval updates the pipeline and shows the next move. It does not email anyone.
6. Objectives, pipeline, chat, and memory persist in `localStorage` under `arches-connect.v1`.

## What is real vs simulated

| Real in this preview | Simulated |
| --- | --- |
| Objective interview, validation, and status (active / paused / done) | People, companies, and mutuals — all fictional |
| Intro draft you can edit | “Reasoning” is a deterministic matcher and templates, not a live model |
| Approval, rejection, and follow-through logged on the pipeline | Approval does not send email or message a mutual |
| Memory notes and preferences | No Syrena, Boardy, or other private network |
| Persistence in this browser, with a visible error if storage fails | No accounts, billing, or production deploy |

## Workspace

- `/` marketing
- `/app/chat` conversation with Connect
- `/app/objectives` objectives and linked activity
- `/app/pipeline` stages from researching through closed / nurture
- `/app/memory` summary, preferences, outcomes
