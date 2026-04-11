# TAN-33 首页信息架构精简建议

## 背景

- 工单目标：在保留 SEO 强度的前提下，收紧 `voice-clone.org` 首页商业叙事与转化路径。
- 分析依据：
  - Linear issue 描述中给出的审查结论：首页存在 `17` 个 H2、`38` 个 H3，模块过多导致叙事被稀释。
  - 当前首页实现：[`src/app/[locale]/(marketing)/(home)/page.tsx`](../src/app/[locale]/(marketing)/(home)/page.tsx)。
  - 首页文案来源：[`messages/en.json`](../messages/en.json) 中的 `HomePage` 节点。
- 限制说明：工单提到的 `reports/voice-clone-org-audit.html` 当前未在仓库中找到，因此以下建议以 issue 内审计数据和现有源码复核结果为主。

## 现状判断

当前首页的顶层 section 顺序为：

1. Hero
2. Demo
3. Use Cases
4. Features
5. How It Works
6. AI Capabilities
7. Comparison
8. Pricing
9. FAQ
10. CTA

### 主要问题

1. `Hero` 已经包含可交互产品体验，但后面又追加独立 `Demo`，导致“先试用还是先看介绍”出现路径分叉。
2. `Use Cases`、`Features`、`How It Works`、`AI Capabilities`、`Comparison` 都在解释“产品做什么、为什么更好”，信息职责重叠。
3. 首页缺乏真实可信的 `social proof`。仓库中虽然存在 `logo-cloud` 与 `testimonials` 模块，但目前内容是占位或无关素材，不能直接承担信任建立职责。
4. `Pricing`、`FAQ`、`CTA` 都放在尾部，导致高意图用户需要穿过大量解释型内容才能进入决策区。
5. SEO 信息量主要靠“多 section + 多副标题”堆出来，但这些内容没有被组织成一条清晰的商业叙事线。

## 新版首页 section 顺序建议

建议将首页压缩为 6 个 section，使用 `landing-page-generator` 的转化骨架来组织：

### 1. Hero + 即时产品证明

职责：
- 停住扫描。
- 让用户在首屏就理解“这是一个可以立即体验的 AI voice clone 工具”。
- 保留当前可交互面板，避免再用独立模块重复说明。

建议内容：
- 保留当前 `HeroSection` 的主标题、描述、交互面板。
- 将 `DemoSection` 中最有价值的内容并入 Hero 下半部分，作为“试听样例 / 快速证明”而不是独立 section。
- Hero 只保留一个主 CTA，次 CTA 指向试听锚点或 pricing，而不是再跳回首页首屏。

### 2. Social Proof / Trust Bar

职责：
- 在用户继续滚动前，先建立信任。
- 承接 issue 中建议的 `hero → social proof → use case → trust → CTA` 路径。

建议内容：
- 优先使用真实可验证素材：用户数量、生成次数、可公开客户评价、媒体提及、团队背景、可验证平台能力。
- 如果暂时没有真实 testimonial 或 logo，不要启用占位 `LogoCloudSection` / `TestimonialsSection`。
- 可先使用事实型 trust bar 过渡，例如：浏览器内录音、支持上传音频、免费试用、云端保存、多语言。

### 3. Core Use Cases

职责：
- 解释“谁最适合用它”。
- 让不同意图的用户快速自我归类。

建议内容：
- 保留 `UseCasesSection`，但从 6 张卡压缩到 3 张优先场景。
- 推荐优先保留：
  - Content Creation
  - Education / Training
  - Business / Marketing
- 其余场景下沉到独立用例页、博客页或 `/use-cases` 集合页。

### 4. Product Proof：How It Works + Core Features

职责：
- 解释产品如何工作。
- 用有限模块完成“功能说明 + 使用路径说明”。

建议内容：
- 合并 `HowItWorksSection` 与 `FeaturesSection`。
- 上半部分保留 3-step 流程，让用户知道从上传样本到生成语音的路径。
- 下半部分保留 3 到 4 个关键能力，不再单独保留一整个 `Features` section。
- 只保留一个主视觉，避免“流程图 + 特性图 + AI 图”连续堆叠。

### 5. Trust / Objection Handling

职责：
- 回答“为什么选你，而不是别的方式”。
- 消除用户在真实性、门槛、成本、可控性上的顾虑。

建议内容：
- 将 `ComparisonSection` 压缩成 3 到 4 条高价值对比结论，放在这一段中。
- `AiCapabilitiesSection` 不再单独存在，只保留能支持信任判断的能力点，例如自然度、速度、多语言、管理能力。
- 在这一段补充隐私、音频要求、导出能力、账户体系等真实决策信息。

### 6. Pricing Snapshot + FAQ + Final CTA

职责：
- 把转化收口。
- 为高意图用户提供最后的购买/试用判断。

建议内容：
- `PricingSection` 保留，但改成首页摘要版，只展示计划差异与主按钮。
- 完整价格细节下沉到独立 pricing 页。
- `FAQSection` 只保留 3 到 4 个最影响转化的问题，例如免费额度、导出格式、是否可上传现有音频、是否可长期保存。
- `CallToActionSection` 与收尾 FAQ 形成同一段落，减少尾部重复召唤。

## 模块处置清单

| 当前模块 | 建议处置 | 新位置 / 承接页 | 原因 |
| --- | --- | --- | --- |
| `HeroSection` | 保留 | 首页首屏 | 已经具备最强产品证明，不应再被后续 Demo 重复稀释 |
| `DemoSection` | 合并 | 并入 Hero 下方 | 当前职责与 Hero 高度重叠，适合作为首屏证明层，而不是独立 section |
| `UseCasesSection` | 保留但压缩 | 首页中段 | 有助于用户快速判断是否适合自己，但 6 张卡过多，建议压缩为 3 张核心场景 |
| `FeaturesSection` | 合并 | 并入 Product Proof | 与 How It Works、AI Capabilities 都在解释产品能力，单独存在会放大冗余 |
| `HowItWorksSection` | 合并 | 并入 Product Proof | 与 Features 最适合形成“流程 + 能力”一体化叙事 |
| `AiCapabilitiesSection` | 删除独立模块，保留要点 | 并入 Trust / Objection Handling，剩余内容下沉到详情页或博客 | 当前更像技术解释层，不适合以完整 section 占据首页 |
| `ComparisonSection` | 压缩并部分下沉 | 首页保留 3 到 4 条摘要，对比长内容迁移到独立 comparison / alternatives / blog 页面 | 现有比较项过多，扫描成本高，且与 Features/AI Capabilities 重复回答“为什么更好” |
| `PricingSection` | 保留但压缩 | 首页收尾 + 完整 `/pricing` | 高意图用户需要，但不应以完整价格表提前打断叙事 |
| `FaqSection` | 保留少量，高频问题下沉 | 首页仅保留高转化问题，完整 FAQ 转移到 `/faq`、pricing 或帮助页 | 9 个问题会拉长首页尾部，稀释 CTA |
| `CallToActionSection` | 保留并与收尾段合并 | 首页末段 | CTA 仍需要，但应与 pricing/FAQ 形成连续收口，而不是再单开一段重复表态 |
| `LogoCloudSection` | 删除占位，不启用 | 待真实素材齐备后再回归首页 | 当前 logo 不是可信社会证明，直接上线会削弱信任 |
| `TestimonialsSection` | 删除占位，不启用 | 待真实评价齐备后再回归首页 | 当前文案明显与产品无关，不适合作为首页信任资产 |

## 推荐首页骨架

可直接落成以下结构：

1. `Hero + Live Product Proof`
2. `Social Proof / Trust Bar`
3. `Core Use Cases`
4. `Product Proof (How It Works + Core Features)`
5. `Trust / Objection Handling`
6. `Pricing Snapshot + FAQ + Final CTA`

## SEO 保留策略

为了在减少 section 的同时保住 SEO 强度，建议不要简单删文案，而是重写组织方式：

- 将重复解释型文案合并进更强的主模块，保留关键词覆盖但减少独立 section 数量。
- 每个保留 section 都承担明确搜索意图：
  - Hero：`voice clone`, `AI voice clone`, `text to speech`
  - Use Cases：场景型长尾词
  - Product Proof：功能型与流程型长尾词
  - Trust / FAQ：疑问型与比较型长尾词
- 长比较内容、长 FAQ、技术解释型内容下沉到独立可索引页面，而不是继续堆在首页。
- 首页保留最强商业叙事，其余 SEO 深度交给详情页和博客页承接。

## 实施优先级建议

1. 先改 section 顺序与合并关系，不先扩写新内容。
2. 先删除重复模块，再补充可信 trust bar。
3. 最后再决定 comparison、FAQ、pricing 的下沉页落点。

## 结论

这次首页调整的关键不是“减少内容”，而是把内容重新编排成一条更短的转化路径。当前首页最应该做的，是把重复的解释型 section 合并成更少、更有职责边界的模块，并尽快补上真实可用的 social proof。这样既能保住 SEO 覆盖，也能让首页真正承担商业转化入口的角色。
