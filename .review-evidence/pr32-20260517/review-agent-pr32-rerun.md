# PR #32 Review-Agent Policy Validation Rerun

Date: 2026-05-17

Repo: tanchaowen84/voice-clone
PR: https://github.com/tanchaowen84/voice-clone/pull/32
Source issue: TAN-363
Review issue: TAN-377
Worktree: /tmp/voiceclone-pr32-review-rerun
Local target: http://127.0.0.1:32132/

## Verdict

blocked / not pass

## Local Commands

- `git fetch origin pull/32/head:refs/remotes/origin/pr/32`
- `git worktree add /tmp/voiceclone-pr32-review-rerun refs/remotes/origin/pr/32`
- `pnpm install --frozen-lockfile`
- `NEXT_PUBLIC_BASE_URL=http://127.0.0.1:32132 DATABASE_URL=postgres://user:pass@127.0.0.1:5432/db BETTER_AUTH_SECRET=review-agent-local-secret GOOGLE_CLIENT_ID=local GOOGLE_CLIENT_SECRET=local GITHUB_CLIENT_ID=local GITHUB_CLIENT_SECRET=local CREEM_API_URL=https://test-api.creem.io CREEM_API_KEY=local CREEM_WEBHOOK_SECRET=local pnpm build`
- `PORT=32132 HOSTNAME=127.0.0.1 ... pnpm start`
- `curl http://127.0.0.1:32132/`
- `curl -L http://127.0.0.1:32132/en`
- `curl http://127.0.0.1:32132/api/voice-clone/voices`
- `curl -X POST http://127.0.0.1:32132/api/voice-clone/create -H 'content-type: application/json' -d '{}'`
- chrome:Chrome extension opened `http://127.0.0.1:32132/`

## Results

- Install: pass.
- Build: pass.
- Local server: pass on `127.0.0.1:32132`.
- Homepage curl: `200`.
- `/en` curl with redirects: `200`.
- `/api/voice-clone/voices`: `500`, `{"error":"Failed to fetch voices"}`.
- `/api/voice-clone/create` empty POST: `500`, `{"error":"Failed to clone voice"}`.
- chrome:Chrome local homepage open: pass.
- chrome:Chrome DOM path visibility: pass. The page shows `Record or upload voice`, permission copy, text input, and `Generate cloned speech`.
- chrome:Chrome upload path: blocked. `fileChooser.setFiles` failed with `Not allowed`, so the browser path could not complete `upload sample -> confirm permission -> enter text -> generate`.

## Blocking Findings

1. Required chrome:Chrome homepage path could not be completed because the Chrome extension rejected local file upload with `Not allowed`.
2. Required localhost API smoke checks for Voice Clone endpoints returned `500` in the local review environment without a real Speechify token.

## Evidence

Screenshot: `voiceclone-pr32-review-chrome-local.png`

Local paths are backup only. Use the GitHub/Gist URL and PR/Linear comments as the durable evidence.

## Cleanup

Cleanup recorded after write-back:

- chrome:Chrome tab finalized.
- Local server on port `32132` stopped; `lsof -ti tcp:32132` returned empty.
- Temporary worktree `/tmp/voiceclone-pr32-review-rerun` removed; `git worktree list` no longer shows it.
- PR #32 remained open, non-draft, with no auto-merge request.
