# TAN-394 rework evidence

## Scope

- Source issue: TAN-363
- Previous rework issue: TAN-392
- Review issue: TAN-393
- Current rework issue: TAN-394
- PR: https://github.com/tanchaowen84/voice-clone/pull/32
- Branch: `codex/tan-363-home-voice-action-20260517`

## Base sync

- Base branch: `origin/main`
- Initial `origin/main` HEAD after fetch: `a4e74b8a9eae55942dab3e65bf7e0641110e8307`
- Initial PR branch HEAD: `d209b1422af561d154e1ac5fcf705f6671a8de10`
- Initial merge-base: `cb44fe2d9c3f233509b1f8e5ac11dc3714628096`
- Initial ahead/behind: PR branch was ahead 2, behind 7 versus `origin/main`
- Sync method: merged `origin/main` into the PR branch
- Post-sync merge-base: `a4e74b8a9eae55942dab3e65bf7e0641110e8307`
- Post-sync behind base: 0

## Rework summary

- Removed the required voice-permission checkbox.
- Removed permission state and permission-based generation gating.
- Removed unrequested permission/consent/legal FAQ and CTA copy.
- Kept TAN-363 homepage improvements: Voice Clone is the default hero action, the hero describes the record/upload -> text -> generate flow, and the first action area is clearer.
- Kept and corrected TAN-392 single-locale redirect behavior so `/` and `/en` do not loop after the latest base merge.

## Verification

- `pnpm install --frozen-lockfile`: lockfile up to date, already up to date.
- `pnpm build`: passed.
- Local service: `pnpm start --hostname 127.0.0.1 --port 3000`

### Curl

| URL | Status | Redirects | Final URL |
| --- | --- | ---: | --- |
| `http://localhost:3000/` | 200 | 0 | `http://localhost:3000/` |
| `http://localhost:3000/en` | 200 | 1 | `http://localhost:3000/` |
| `http://127.0.0.1:3000/` | 200 | 0 | `http://127.0.0.1:3000/` |
| `http://127.0.0.1:3000/en` | 200 | 1 | `http://localhost:3000/` |
| `http://127.0.0.1:3000/api/voice-clone/voices?locale=en` | 200 | 0 | `http://127.0.0.1:3000/api/voice-clone/voices?locale=en` |

API key result:

```json
{
  "success": true,
  "count": 11770,
  "firstVoice": "Voice_1754036259715"
}
```

### Chrome

- Local URL: `http://127.0.0.1:3000/`
- Result: no `ERR_TOO_MANY_REDIRECTS`
- UI result: Voice Clone hero is visible, Voice Clone is the default panel, no required permission checkbox, no permission/consent/impersonation/permitted copy in the visible homepage first action area.
- Screenshot: [`tan-394-homepage-chrome.jpg`](./tan-394-homepage-chrome.jpg)

## Cleanup

- Local server was stopped after validation.
- Worktree used: `/Users/tcw/Desktop/webDevelop/voice-clone/worktrees/TAN-363-20260517`
