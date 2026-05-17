# PR #32 review-agent policy validation rerun with env context

前缀：`[review-agent policy validation rerun with env context]`

结论：blocked / 不建议合并。

范围：
- GitHub repo: `tanchaowen84/voice-clone`
- PR: `#32`
- PR head: `5cd3981bb246f0b83b6b9b081a1b03bcf9db108c`
- Source issue: `TAN-363`
- Review issue: `TAN-377`
- Rework issue: `TAN-392`

规则验证：
- 已读取项目级本地 env context：`/Users/tcw/Documents/Obsidian Vault/AI SaaS 出海/工作流自动化/workflow/projects/voice-clone/.env.context.local`
- 已按该 context 指向的 Voice Clone 本地 env 启动 worktree，不输出 env value 或 secret value。
- 未使用 Vercel preview。
- 未 merge、undraft、enable auto-merge、close PR，未改变 PR 状态。

本地执行：
- Checkout: PR #32 拉到临时 worktree，head 为 `5cd3981`。
- Env: worktree 的 `.env.local` 链接到 env context 指向的 Voice Clone 本地 env 文件。
- Install: `pnpm install --frozen-lockfile` 通过。
- Build: `pnpm build` 通过，Next 显示加载 `.env.local`。
- Start: `pnpm start --hostname 127.0.0.1`，本地服务为 `http://127.0.0.1:32134`。

curl localhost / 127.0.0.1：
- `GET /` with `-L`: 失败，`curl: (47) Maximum (50) redirects followed`，最终 URL `http://localhost:32134/`，状态 `307`。
- `GET /en` with `-L`: 失败，`curl: (47) Maximum (50) redirects followed`，最终 URL `http://localhost:32134/`，状态 `307`。
- `HEAD http://127.0.0.1:32134/`: `307 Temporary Redirect`，`x-middleware-rewrite: http://localhost:32134/en`，`location: http://localhost:32134/`。
- `HEAD http://localhost:32134/en`: `307 Temporary Redirect`，`location: http://localhost:32134/`。
- `GET /api/voice-clone/voices?locale=en`: `200 application/json`，返回 `success: true` 和 voices 列表。
- `POST /api/voice-clone/create {}`: `500 application/json`，返回 `{"error":"Failed to clone voice"}`。

chrome:Chrome 本地路径：
- 使用 Codex Chrome skill：`/Users/tcw/.codex/plugins/cache/openai-bundled/chrome/0.1.7/skills/chrome/SKILL.md`
- 打开 `http://127.0.0.1:32134/`。
- Chrome 返回 `net::ERR_TOO_MANY_REDIRECTS`，最终 URL 为 `http://localhost:32134/`。
- 页面显示 `This page isn't working / localhost redirected you too many times / ERR_TOO_MANY_REDIRECTS`。
- 因首页无法渲染，homepage Voice Clone 用户路径无法执行。

Blocking finding：
- 在真实项目级 env context + Voice Clone 本地 env 下，PR #32 的本地 production 首页进入 localhost/127.0.0.1 redirect loop，导致 review-agent 无法完成 homepage Voice Clone 用户路径。
- 这不是 Vercel preview 结果，也不是 dummy env 结果；本轮使用的是项目级 env context 指向的本地 env。

Fix scope：
- 修复本地 production middleware / locale / base URL redirect 逻辑，使 `http://127.0.0.1:<port>/` 和 `http://127.0.0.1:<port>/en` 在真实本地 env 下稳定返回 200 页面。
- 保持 `/api/voice-clone/voices?locale=en` 在真实本地 env 下可用。
- 修复后重新跑 install、build、start、curl、chrome:Chrome homepage Voice Clone 用户路径。

Done When：
- `pnpm install --frozen-lockfile` 通过。
- `pnpm build` 通过。
- `pnpm start --hostname 127.0.0.1` 可启动。
- `curl -L /` 和 `curl -L /en` 返回 200，不再 redirect loop。
- `curl /api/voice-clone/voices?locale=en` 返回 200。
- chrome:Chrome 可以打开本地首页并完成 homepage Voice Clone 用户路径，截图证据为 GitHub / Linear / Google Drive 可打开 URL。
- 修复完成后创建新的二次 `[review]` Linear issue，不能直接 merge。

Write Back：
- 回写 GitHub PR #32、Linear `TAN-363`、`TAN-377`、`TAN-392`。
- `TAN-392` 继续作为 rework issue 复用，不重复创建。
- rework 完成后必须新建二次 review issue 或确认已有未完成二次 review issue，再由 review-agent 复核。

清理：
- chrome:Chrome tab 已 finalize。
- 本地 server `127.0.0.1:32134` 已关闭。
- 临时 worktree 已移除。
