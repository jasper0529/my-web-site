---
title: 8、如何写好 CLAUDE.md把项目隐性知识写成可执行规则
date: 2026-07-31
tags: ["AI", "Vibe Coding"]
description: 你有没有遇到过这种场面：Claude Code 第一次进仓库，代码写得不差，却在包管理器、测试入口、生成目录边界上反复猜错，问题往往不在模型“不会写”，而在于它还不知道你的项目到底怎么工作。每猜错一次，就是一次返工、一次 token 浪费。 不是模型笨，是你没给它入职材料。 CLAUDE.md就是那张入职卡…
---

<font style="color:rgb(62, 76, 102);">你有没有遇到过这种场面：Claude Code 第一次进仓库，代码写得不差，却在包管理器、测试入口、生成目录边界上反复猜错，问题往往不在模型“不会写”，而在于它还不知道</font>**<font style="color:rgb(14, 23, 41);">你的项目到底怎么工作</font>**<font style="color:rgb(62, 76, 102);">。每猜错一次，就是一次返工、一次 token 浪费。</font>

<font style="color:rgb(62, 76, 102);">不是模型笨，是你没给它入职材料。  
</font>CLAUDE.md<font style="color:rgb(62, 76, 102);">就是那张入职卡，别写成论文，就写</font>**<font style="color:rgb(14, 23, 41);">代码里看不出来、猜错就得返工的那几条</font>**<font style="color:rgb(62, 76, 102);">。官方建议整份控制在 200 行以内，写多了没人看，模型也记不住。</font>

:::info
**💡**版本说明

本文基于 Claude Code可用的官方文档整理。Claude Code 更新较快，涉及命令、加载机制和版本门槛的内容，请以文末官方资料为准。

:::

## ⏱ 60 秒，先让它跑起来
<font style="color:rgb(148, 163, 184);">先抄这段根文件 → 换成真实命令 → 跑下面三条验证。读完全文是可选加深，不是入场券。</font>

```markdown
# CLAUDE.md  —— paste, edit commands, commit
## Commands
- Install: `uv sync`
- Test: `uv run pytest`
- Lint: `uv run ruff check .`
- Typecheck: `uv run mypy src`
## Rules
- Python 3.12+. Prefer existing modules; do not hand-edit generated code or `.venv/`.
- After logic changes, run pytest for the affected path and report results.
## Safety
- No secrets in repo. Hard tool blocks → Settings permissions.deny (not only this file).
```

### 提交完怎么验？
1. `/context`<font style="color:rgb(203, 213, 225);"> —</font> 看当前会话是否加载了这份 CLAUDE.md、占了多少上下文
2. `/memory` — 打开/编辑项目指令与 Auto memory 相关文件
3. `/doctor` — 诊断配置；过长文件可能被提示 trim（官方 target under 200 lines）

:::info
**<font style="color:rgb(37, 99, 235);">💡</font>****<font style="color:rgb(37, 99, 235);"> 先给结论</font>**

`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">是你（或团队）手写的</font>**<font style="color:rgb(15, 23, 42);">项目指导文件</font>**<font style="color:rgb(23, 32, 51);">：behavioral guidance，用来提供上下文、命令和工作方法。</font>**<font style="color:rgb(15, 23, 42);">它不是运行时权限系统</font>**<font style="color:rgb(23, 32, 51);">；强制拒绝工具请用 Settings 里的</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">permissions.deny</font>`<font style="color:rgb(23, 32, 51);">（client-enforced）。它也</font>**<font style="color:rgb(15, 23, 42);">不是</font>**<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">Auto memory（Claude 自动写的笔记），更不是 Subagent 的 Agent memory。写得好的标准：短、具体、可验证。</font>

:::

:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 术语约定（避免混为一谈）</font>**

+ **<font style="color:rgb(15, 23, 42);">CLAUDE.md</font>**<font style="color:rgb(23, 32, 51);">：你写的项目指令（instructions），可审查、可提交；适用时通常</font>**<font style="color:rgb(15, 23, 42);">全量加载</font>**<font style="color:rgb(23, 32, 51);">进上下文。</font>
+ **<font style="color:rgb(15, 23, 42);">Auto memory</font>**<font style="color:rgb(23, 32, 51);">：Claude 为主会话自动整理的笔记；主索引常受</font><font style="color:rgb(23, 32, 51);"> </font>**<font style="color:rgb(15, 23, 42);">~200 行 / ~25KB</font>**<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">一类限制（以当前文档为准），与 CLAUDE.md 互补。</font>
+ `**<font style="color:rgb(29, 78, 216);">/memory</font>**`<font style="color:rgb(23, 32, 51);">：管理相关文件的命令入口，不是一种“记忆类型”。</font>
+ **<font style="color:rgb(15, 23, 42);">Agent memory</font>**<font style="color:rgb(23, 32, 51);">：Subagent frontmatter 的 </font>`<font style="color:rgb(29, 78, 216);">memory</font>`<font style="color:rgb(23, 32, 51);"> 字段，独立目录，与主会话 Auto memory </font>**<font style="color:rgb(15, 23, 42);">不互通</font>**<font style="color:rgb(23, 32, 51);">。</font>

:::

## <font style="color:rgb(15, 23, 42);">一、它究竟解决什么问题？</font>
<font style="color:rgb(23, 32, 51);">把 Claude Code 想象成一位能力很强、但刚入职的同事。它能读代码、跑命令、改文件，可它不会凭空知道：这个仓库用哪个包管理器、哪些测试才算验收、为什么某个看似奇怪的目录不能动。</font>

`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">就像工位旁边那张“项目入职卡”：放的是</font>**<font style="color:rgb(15, 23, 42);">不显而易见、却会影响决策</font>**<font style="color:rgb(23, 32, 51);">的信息。它适合告诉 Claude：</font>

### <font style="color:rgb(15, 23, 42);">🧱</font><font style="color:rgb(15, 23, 42);"> 怎么运行</font>
<font style="color:rgb(23, 32, 51);">安装、构建、测试、Lint、格式化的真实命令。</font>

### <font style="color:rgb(15, 23, 42);">🧭</font><font style="color:rgb(15, 23, 42);"> 怎么判断</font>
<font style="color:rgb(23, 32, 51);">目录职责、架构边界、验收标准和变更流程。</font>

### <font style="color:rgb(15, 23, 42);">🚧</font><font style="color:rgb(15, 23, 42);"> 哪些别碰</font>
<font style="color:rgb(23, 32, 51);">生成文件、生产配置、兼容性陷阱和安全约束。</font>

<font style="color:rgb(23, 32, 51);">反过来，下面这些内容往往不值得写进去：Claude 通过文件名就能猜到的常识、整段源码复制、每天都会变的构建产物、秘密和凭据。上下文不是越多越好；垃圾信息多了，真正重要的规则反而会被淹没。</font>

<!-- 这是一张图片，ocr 内容为：CLAUDE.MD CLAUDE.MD 小酸鸡 怎么运行 完成验证 明筑 代码 怎么判断 改对位置 CLAUDE CLAUDE 脚本 哪些别碰 选对命令 测试 不是更多文字,而是正确上下文 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462537831-2de8ebd3-231f-4693-805b-67ffd34c996c.png)

:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 判断一条规则值不值得写</font>**<font style="color:rgb(23, 32, 51);">问自己一句：“一个新同事只看代码，能稳定推导出这条信息吗？”如果不能，而且猜错会造成返工，就值得写</font><font style="color:rgb(23, 32, 51);background-color:rgb(236, 253, 245);">。</font>

:::

## <font style="color:rgb(15, 23, 42);">二、如何写好 CLAUDE.md：核心方法</font>
<font style="color:rgb(23, 32, 51);">这是全文最重要的一章。加载机制、Monorepo、边界地图都是配套知识；真正决定效果的，是你能不能写出</font>**<font style="color:rgb(15, 23, 42);">短、硬、可验证</font>**<font style="color:rgb(23, 32, 51);">的规则。</font>

:::info
**<font style="color:rgb(37, 99, 235);">💡</font>****<font style="color:rgb(37, 99, 235);"> 一句话标准</font>**

<font style="color:rgb(23, 32, 51);">好的 </font>`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> 不是“写给老板看的规范文档”，而是“读完就能少犯一个错误的操作卡”。每一行都要能改变 Claude 的下一步动作。</font>

:::

### <font style="color:rgb(15, 23, 42);">2.1 黄金结构：命令 → 结构 → 规则 → 验证 → 安全</font>
<!-- 这是一张图片，ocr 内容为：先给地图,再给动作,最后给边界. CLAUDE.MD 安安全 命令 结构 规则 项目 验证 品 先问再做 怎么跑 做完了吗 是什么 怎么改 改哪里 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462642079-11819898-fb66-495c-8dbe-a0f6a940d10d.png)

<font style="color:rgb(23, 32, 51);">推荐固定顺序，人和 Agent 都能快速扫读：</font>

1. **<font style="color:rgb(15, 23, 42);">Project / 项目是什么</font>**<font style="color:rgb(23, 32, 51);">：一句话 + 技术栈关键点（只写会影响决策的）。</font>
2. **<font style="color:rgb(15, 23, 42);">Commands / 命令</font>**<font style="color:rgb(23, 32, 51);">：安装、测试、Lint、类型检查、生成代码——可复制粘贴。</font>
3. **<font style="color:rgb(15, 23, 42);">Structure / 结构</font>**<font style="color:rgb(23, 32, 51);">：关键目录职责；标明生成目录、禁止手改路径。</font>
4. **<font style="color:rgb(15, 23, 42);">Rules / 变更规则</font>**<font style="color:rgb(23, 32, 51);">：怎么改、先读什么、跨包要触发什么。</font>
5. **<font style="color:rgb(15, 23, 42);">Verification / 验收</font>**<font style="color:rgb(23, 32, 51);">：改完必须跑什么；失败/缺环境时怎么报告。</font>
6. **<font style="color:rgb(15, 23, 42);">Safety / 安全与请示</font>**<font style="color:rgb(23, 32, 51);">：密钥、生产、基础设施、数据迁移的边界。</font>

#### <font style="color:rgb(15, 23, 42);">为什么这个顺序更适合 Agent？</font>
<font style="color:rgb(23, 32, 51);">把它想成新同事入职：你不会一上来就让他背公司的价值观，而是先告诉他“这个项目怎么启动”，再说明“文件放在哪里”，接着才讲哪些动作必须确认。Agent 也一样。</font>**<font style="color:rgb(15, 23, 42);">命令</font>**<font style="color:rgb(23, 32, 51);">解决“能不能跑”，</font>**<font style="color:rgb(15, 23, 42);">结构</font>**<font style="color:rgb(23, 32, 51);">解决“该改哪里”，</font>**<font style="color:rgb(15, 23, 42);">规则</font>**<font style="color:rgb(23, 32, 51);">解决“怎么改”，</font>**<font style="color:rgb(15, 23, 42);">验证</font>**<font style="color:rgb(23, 32, 51);">解决“做完了吗”，</font>**<font style="color:rgb(15, 23, 42);">安全</font>**<font style="color:rgb(23, 32, 51);">解决“哪些事不能自作主张”。顺序反过来，规则很容易变成脱离实际的口号。</font>

<font style="color:rgb(15, 23, 42);">🧭</font><font style="color:rgb(15, 23, 42);"> 先给地图</font>

<font style="color:rgb(23, 32, 51);">只列会影响决策的目录、入口和生成路径；不要把整个文件树复制进来。</font>

<font style="color:rgb(15, 23, 42);">🛠</font><font style="color:rgb(15, 23, 42);"> 再给动作</font>

<font style="color:rgb(23, 32, 51);">命令必须能直接粘贴执行，并写清在哪个目录运行、预计产生什么结果。</font>

<font style="color:rgb(15, 23, 42);">🔍</font><font style="color:rgb(15, 23, 42);"> 补上证据</font>

<font style="color:rgb(23, 32, 51);">每条关键规则都配一个验证动作，否则 Claude 只能“相信自己做对了”。</font>

**<font style="color:rgb(100, 116, 139);">一个足够小、但信息完整的根文件骨架</font>**

```markdown
# CLAUDE.md

## Project
- Python 3.12 monorepo; API lives in `apps/api`.

## Commands
- Install: `uv sync`
- Test API: `uv run pytest apps/api/tests -q`
- Typecheck: `uv run mypy apps/api`

## Structure
- `packages/contracts`: source of truth for API schemas.
- `**/generated/**`: regenerate; do not edit by hand.

## Rules
- Schema change: edit contracts → regenerate → run API contract tests.

## Verification
- Report commands run and any skipped check with its reason.
```

<font style="color:rgb(23, 32, 51);">注意这里没有介绍 Python 是什么，也没有粘贴 README。它只保留 Claude 无法稳定猜出、但猜错会导致返工的事实。</font>

<!-- 这是一张图片，ocr 内容为：仓库里的所有事实 测试 边界 目录树 README 命令 日志 代码能稳定推导? 常识 源码复述 目录清单 猜错会返工? 没有代价的内容 被吹走 能改变行动? 删 少,但每条有用 真实命令 验收证据 关键边界 CLAUDE.MD -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462560558-cdfe4166-32bd-46e9-b08b-8a0bdeaab84b.png)

### <font style="color:rgb(15, 23, 42);">2.2 七条编写原则</font>
| **<font style="color:rgb(15, 23, 42);">原则</font>** | **<font style="color:rgb(15, 23, 42);">人话</font>** | **<font style="color:rgb(15, 23, 42);">反例</font>** | **<font style="color:rgb(15, 23, 42);">正例</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">可执行</font>** | <font style="color:rgb(23, 32, 51);">读完知道下一步敲什么</font> | <font style="color:rgb(23, 32, 51);">注意测试质量</font> | `<font style="color:rgb(29, 78, 216);">uv run pytest tests/auth -q</font>` |
| **<font style="color:rgb(15, 23, 42);">可定位</font>** | <font style="color:rgb(23, 32, 51);">写清路径/包名/命令入口</font> | <font style="color:rgb(23, 32, 51);">API 要规范</font> | `<font style="color:rgb(29, 78, 216);">apps/api</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">禁止在 handler 里直连生产 DB URL</font> |
| **<font style="color:rgb(15, 23, 42);">非显而易见</font>** | <font style="color:rgb(23, 32, 51);">只写代码推不稳的事实</font> | <font style="color:rgb(23, 32, 51);">这是 Python 项目</font> | `<font style="color:rgb(29, 78, 216);">src/**/generated/</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">禁止手改</font> |
| **<font style="color:rgb(15, 23, 42);">单一事实来源</font>** | <font style="color:rgb(23, 32, 51);">同一条规则只写一次</font> | <font style="color:rgb(23, 32, 51);">根和包各写一遍 uv</font> | <font style="color:rgb(23, 32, 51);">根写 uv/Python 版本；包写该包 pytest 入口</font> |
| **<font style="color:rgb(15, 23, 42);">失败可报告</font>** | <font style="color:rgb(23, 32, 51);">缺环境时不许假装成功</font> | <font style="color:rgb(23, 32, 51);">尽量跑全量测试</font> | <font style="color:rgb(23, 32, 51);">无 Docker 则停止并报告，勿静默跳过</font> |
| **<font style="color:rgb(15, 23, 42);">短硬优先</font>** | <font style="color:rgb(23, 32, 51);">官方建议 target under </font>**<font style="color:rgb(15, 23, 42);">200 lines</font>**<font style="color:rgb(23, 32, 51);">；超长时 </font>`<font style="color:rgb(29, 78, 216);">/doctor</font>`<font style="color:rgb(23, 32, 51);">可能提示修剪</font> | <font style="color:rgb(23, 32, 51);">600 行百科</font> | <font style="color:rgb(23, 32, 51);">硬规则 + 导入长文档</font> |
| **<font style="color:rgb(15, 23, 42);">指导 ≠ 权限</font>** | <font style="color:rgb(23, 32, 51);">CLAUDE.md 只是行为引导；强制拒绝用</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">permissions.deny</font>` | <font style="color:rgb(23, 32, 51);">只写“不要删生产”</font> | <font style="color:rgb(23, 32, 51);">规则提醒 + client-enforced deny / Hooks</font> |


#### <font style="color:rgb(15, 23, 42);">把“原则”落成一句能执行的话</font>
<font style="color:rgb(23, 32, 51);">写规则时可以套一个简单句式：</font>**<font style="color:rgb(15, 23, 42);">动作 + 范围 + 触发条件 + 验收证据 + 失败处理</font>**<font style="color:rgb(23, 32, 51);">。五个位置不一定每次都写满，但涉及支付、权限、迁移、生成代码时，缺一项都值得警惕。</font>

| **<font style="color:rgb(15, 23, 42);">模糊写法</font>** | **<font style="color:rgb(15, 23, 42);">可执行写法</font>** | **<font style="color:rgb(15, 23, 42);">为什么更可靠</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">注意缓存一致性</font> | <font style="color:rgb(23, 32, 51);">修改</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">services/catalog/**</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">的缓存键或 TTL 后，运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">uv run pytest services/catalog/tests/cache -q</font>`<br/><font style="color:rgb(23, 32, 51);">；测试 Redis 不可用时停止并报告。</font> | <font style="color:rgb(23, 32, 51);">给了路径、触发条件、命令和例外。</font> |
| <font style="color:rgb(23, 32, 51);">API 变更要小心</font> | <font style="color:rgb(23, 32, 51);">先改</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">packages/contracts/openapi.yaml</font>`<br/><font style="color:rgb(23, 32, 51);">，再运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">make generate-api</font>`<br/><font style="color:rgb(23, 32, 51);">；禁止直接编辑</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">apps/api/generated/**</font>`<br/><font style="color:rgb(23, 32, 51);">。</font> | <font style="color:rgb(23, 32, 51);">明确了唯一事实来源和生成边界。</font> |
| <font style="color:rgb(23, 32, 51);">提交前检查代码</font> | <font style="color:rgb(23, 32, 51);">提交前运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">uv run ruff check .</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">与受影响包的测试，并在摘要中报告结果。</font> | <font style="color:rgb(23, 32, 51);">“检查”变成了可复核的证据。</font> |


:::warning
**<font style="color:rgb(217, 119, 6);">⚠️</font>****<font style="color:rgb(217, 119, 6);"> 别把所有条件都塞进一句话</font>**

<font style="color:rgb(23, 32, 51);">规则一旦同时包含五六个分支，就该拆成标题、列表或 path-scoped 文件。短不是把细节删掉，而是把细节放到正确的层级，让根文件只承担“路口指示牌”的工作。</font>

:::

### <font style="color:rgb(15, 23, 42);">2.3 每条规则的“五要素”检查</font>
<font style="color:rgb(23, 32, 51);">写完一条规则，用这五个问题扫一遍；缺一项就改：</font>

+ <font style="color:rgb(15, 23, 42);">1. 动作 </font><font style="color:rgb(23, 32, 51);">要做什么？用祈使句 + 命令。</font>
+ <font style="color:rgb(15, 23, 42);">2. 范围 </font><font style="color:rgb(23, 32, 51);">对哪个包/路径生效？</font>
+ <font style="color:rgb(15, 23, 42);">3. 触发 </font><font style="color:rgb(23, 32, 51);">什么改动会触发这条？</font>
+ <font style="color:rgb(15, 23, 42);">4. 验收 </font><font style="color:rgb(23, 32, 51);">怎样算做完？命令/产物是什么？</font>
+ <font style="color:rgb(15, 23, 42);">5. 例外 </font><font style="color:rgb(23, 32, 51);">缺依赖、缺权限时怎么办？</font>
+ <font style="color:rgb(15, 23, 42);">加分：为什么 </font><font style="color:rgb(23, 32, 51);">一句话原因，避免后人删掉“看起来多余”的规则。</font>

#### <font style="color:rgb(220, 38, 38);">❌</font><font style="color:rgb(220, 38, 38);"> 不合格规则</font>
```plain
Be careful with payments.
Run tests when needed.
Keep the code clean.
```

<font style="color:rgb(23, 32, 51);">无动作、无范围、无验收、无例外。</font>

#### <font style="color:rgb(5, 150, 105);">✅</font><font style="color:rgb(5, 150, 105);"> 合格规则</font>
```plain
## Billing changes
- Scope: `services/billing/**`
- After amount/rate changes:
  1. `uv run pytest services/billing/tests -q`
  2. `uv run pytest services/billing/tests/contract -q`
- Money uses integer minor units (no float).
- If test DB is unavailable for integration tests:
  stop and report; do not skip silently.
```

#### <font style="color:rgb(15, 23, 42);">从失败结果反推缺失要素</font>
<font style="color:rgb(23, 32, 51);">这一步很实用：不要只问“这条规则写得好不好”，而要拿一次失败任务倒推。Claude 改错目录，说明</font>**<font style="color:rgb(15, 23, 42);">范围</font>**<font style="color:rgb(23, 32, 51);">不够；改完没跑测试，说明</font>**<font style="color:rgb(15, 23, 42);">验收</font>**<font style="color:rgb(23, 32, 51);">不够；测试失败却继续往下编，说明</font>**<font style="color:rgb(15, 23, 42);">例外处理</font>**<font style="color:rgb(23, 32, 51);">不够。把错误映射回五要素，比继续堆“请小心”有效得多。</font>

+ <font style="color:rgb(15, 23, 42);">🚨</font><font style="color:rgb(15, 23, 42);"> 症状：改了生成文件。</font><font style="color:rgb(23, 32, 51);">补上“源文件在哪里、生成命令是什么、生成目录禁止手改”，并在结构章节放一条醒目标记。</font>
+ <font style="color:rgb(15, 23, 42);">🚨</font><font style="color:rgb(15, 23, 42);"> 症状：测试跑错范围。</font><font style="color:rgb(23, 32, 51);">把“改动类型 → 最小测试命令”写成映射，不要只写一个昂贵的全量测试。</font>
+ <font style="color:rgb(15, 23, 42);">🚨</font><font style="color:rgb(15, 23, 42);"> 症状：缺环境仍声称通过。</font><font style="color:rgb(23, 32, 51);">明确停止条件和报告格式，例如“数据库不可用时不得跳过集成测试”。</font>
+ <font style="color:rgb(15, 23, 42);">🚨</font><font style="color:rgb(15, 23, 42);"> 症状：规则互相冲突。</font><font style="color:rgb(23, 32, 51);">保留一个事实来源，把包级差异下沉到包目录的 CLAUDE.md 或 </font>`<font style="color:rgb(29, 78, 216);">.claude/rules</font>`<font style="color:rgb(23, 32, 51);">。</font>

### <font style="color:rgb(15, 23, 42);">2.4 写什么 / 别写什么</font>
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 优先写</font>**

+ <font style="color:rgb(23, 32, 51);">真实可复制的安装/测试/生成命令</font>
+ <font style="color:rgb(23, 32, 51);">生成代码、快照、构建产物的边界</font>
+ <font style="color:rgb(23, 32, 51);">跨包变更触发清单</font>
+ <font style="color:rgb(23, 32, 51);">领域不变量（金额单位、时区、幂等）</font>
+ <font style="color:rgb(23, 32, 51);">验收与报告要求</font>
+ <font style="color:rgb(23, 32, 51);">必须人工确认的操作类型</font>

**<font style="color:rgb(220, 38, 38);">❌</font>****<font style="color:rgb(220, 38, 38);"> 尽量别写</font>**

+ <font style="color:rgb(23, 32, 51);">README 全文复述</font>
+ <font style="color:rgb(23, 32, 51);">整段源码粘贴</font>
+ <font style="color:rgb(23, 32, 51);">每天变化的日志/构建输出</font>
+ <font style="color:rgb(23, 32, 51);">密钥、Token、连接串</font>
+ <font style="color:rgb(23, 32, 51);">完整发版 17 步（改成 Skill/Command）</font>
+ <font style="color:rgb(23, 32, 51);">代码里一眼能看出的常识</font>

#### <font style="color:rgb(15, 23, 42);">一条信息到底放在哪一层？</font>
<font style="color:rgb(23, 32, 51);">判断标准不是“我觉得它重要”，而是</font>**<font style="color:rgb(15, 23, 42);">谁需要它、多久变化一次、错了会影响多大范围</font>**<font style="color:rgb(23, 32, 51);">。可以先用下面这张分流表：</font>

| **<font style="color:rgb(15, 23, 42);">信息类型</font>** | **<font style="color:rgb(15, 23, 42);">推荐位置</font>** | **<font style="color:rgb(15, 23, 42);">典型例子</font>** | **<font style="color:rgb(15, 23, 42);">不要放错层的原因</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">团队共同的命令和硬规则</font> | <font style="color:rgb(23, 32, 51);">仓库根</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>` | <font style="color:rgb(23, 32, 51);">安装、最小测试、生成目录、提交前检查</font> | <font style="color:rgb(23, 32, 51);">放到个人配置会让 CI 和同事看不到。</font> |
| <font style="color:rgb(23, 32, 51);">某个包独有的约束</font> | <font style="color:rgb(23, 32, 51);">包目录</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">或 path-scoped rule</font> | <font style="color:rgb(23, 32, 51);">支付金额单位、Worker 重试策略</font> | <font style="color:rgb(23, 32, 51);">塞进根文件会污染所有任务的上下文。</font> |
| <font style="color:rgb(23, 32, 51);">个人偏好或本机路径</font> | <font style="color:rgb(23, 32, 51);">用户级 /</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">CLAUDE.local.md</font>` | <font style="color:rgb(23, 32, 51);">本地调试端口、编辑器习惯</font> | <font style="color:rgb(23, 32, 51);">团队成员无法复现，也不应进入提交。</font> |
| <font style="color:rgb(23, 32, 51);">可重复的多步工作流</font> | <font style="color:rgb(23, 32, 51);">Skill / Command</font> | <font style="color:rgb(23, 32, 51);">发布检查、生成客户端、升级依赖</font> | <font style="color:rgb(23, 32, 51);">长流程放在根文件里既难维护又难发现。</font> |


:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 一个简单决策题</font>**

<font style="color:rgb(23, 32, 51);">如果这条信息明天改了，是否需要所有开发者立刻知道？需要，就放团队共享层；只对一个目录生效，就下沉；只有你本机知道，就不要伪装成项目规则。</font>

:::

### <font style="color:rgb(15, 23, 42);">2.5 推荐写作流程（30～60 分钟可完成第一版）</font>
1. **<font style="color:rgb(15, 23, 42);">扫仓库：</font>**<font style="color:rgb(23, 32, 51);">找到 package manager、测试入口、CI 脚本、生成代码目录。</font>
2. **<font style="color:rgb(15, 23, 42);">/init 起步（可选）：</font>**<font style="color:rgb(23, 32, 51);">没有 CLAUDE.md 时让 Claude 生成 starter；文件已经存在时，让它审计现有内容并提出改进建议。无论哪种情况，都不要原样提交。</font>
3. **<font style="color:rgb(15, 23, 42);">人工压缩：</font>**<font style="color:rgb(23, 32, 51);">删除可从代码推断的内容；只留会改变行动的事实。</font>
4. **<font style="color:rgb(15, 23, 42);">补验收与例外：</font>**<font style="color:rgb(23, 32, 51);">每条关键规则写清“跑什么 / 失败怎么说”。</font>
5. **<font style="color:rgb(15, 23, 42);">分层：</font>**<font style="color:rgb(23, 32, 51);">个人偏好 → 用户级；本机差异 → local；包细节 → 包级文件。</font>
6. **<font style="color:rgb(15, 23, 42);">实战验：</font>**<font style="color:rgb(23, 32, 51);">开一个真实小任务，看 Claude 是否按规则选命令；漏了就改文件，不改成更长的空话。</font>
7. **<font style="color:rgb(15, 23, 42);">设维护人：</font>**<font style="color:rgb(23, 32, 51);">命令变更时同步改 CLAUDE.md；过期规则比没有规则更糟。</font>

:::info
**<font style="color:rgb(37, 99, 235);">💡</font>****<font style="color:rgb(37, 99, 235);"> /init 现在不只是“第一次生成文件”</font>**

<font style="color:rgb(23, 32, 51);">设置 </font>`CLAUDE_CODE_NEW_INIT=1`<font style="color:rgb(23, 32, 51);">后，</font>`/init`<font style="color:rgb(23, 32, 51);"> 会进入交互式初始化流程，除 CLAUDE.md 外还会引导检查 skills、Hooks 与 personal memory。选择 personal 选项时，它可以创建 </font>`CLAUDE.local.md`<font style="color:rgb(23, 32, 51);"> 并加入 ignore。这里最重要的不是“一键生成”，而是把它当作仓库审计入口：生成后仍要人工核对命令、目录职责、安全边界和验证证据。</font>

:::

#### <font style="color:rgb(15, 23, 42);">用一次真实任务验收，而不是对着文件自我感动</font>
<font style="color:rgb(23, 32, 51);">写完第一版后，挑一个</font>**<font style="color:rgb(15, 23, 42);">小而真实</font>**<font style="color:rgb(23, 32, 51);">的任务：例如给某个接口补一个字段、修一个单元测试、更新一个生成客户端。任务要能在十几分钟内完成，且会经过你刚写的命令、目录和验证规则。</font>

1. **<font style="color:rgb(15, 23, 42);">记录预期：</font>**<font style="color:rgb(23, 32, 51);">在运行 Claude 前写下它应该先读哪些文件、选择哪条命令、收尾时跑哪些检查。</font>
2. **<font style="color:rgb(15, 23, 42);">观察行为：</font>**<font style="color:rgb(23, 32, 51);">重点看它有没有进入错误目录、绕过源文件、跳过验证，而不是只看最终 diff 漂不漂亮。</font>
3. **<font style="color:rgb(15, 23, 42);">修一处规则：</font>**<font style="color:rgb(23, 32, 51);">每次只修造成偏差的那条规则，避免把一次偶然失误扩写成十条限制。</font>
4. **<font style="color:rgb(15, 23, 42);">复跑同类任务：</font>**<font style="color:rgb(23, 32, 51);">确认规则能稳定改变下一次行为，再把它提交给团队。</font>

**<font style="color:rgb(100, 116, 139);">把验收写成可重复的任务卡</font>**

```plain
Task: add `timezone` to the profile response
Expected path: `packages/contracts` → `apps/api` → contract tests
Expected commands:
  1. `make generate-api`
  2. `uv run pytest apps/api/tests/contract -q`
Do not edit: `apps/api/generated/**`
Report: changed files, commands run, failures, skipped checks
```

### <font style="color:rgb(15, 23, 42);">2.6 风格与语气</font>
+ <font style="color:rgb(23, 32, 51);">用祈使句：</font>`<font style="color:rgb(29, 78, 216);">Use uv</font>`<font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);">Do not edit generated/</font>`<font style="color:rgb(23, 32, 51);">，少用“建议尽量”。</font>
+ <font style="color:rgb(23, 32, 51);">一条一事；长列表拆成小标题。</font>
+ <font style="color:rgb(23, 32, 51);">中英文都可，但命令与路径保持可复制原文。</font>
+ <font style="color:rgb(23, 32, 51);">对 Claude 和对同事用同一套说法——能当 onboarding 卡片的，才是好规则。</font>

:::warning
**<font style="color:rgb(217, 119, 6);">⚠️</font>****<font style="color:rgb(217, 119, 6);"> 长度：官方目标 under 200 lines</font>**

<font style="color:rgb(23, 32, 51);">官方文档明确建议把 CLAUDE.md </font>**<font style="color:rgb(15, 23, 42);">控制在 200 行以内（target under 200 lines）</font>**<font style="color:rgb(23, 32, 51);">；过长时 </font>`<font style="color:rgb(29, 78, 216);">/doctor</font>`<font style="color:rgb(23, 32, 51);"> 还可能主动提示修剪。想减少默认上下文，应把包级差异下沉到嵌套 CLAUDE.md，或拆成 path-scoped 、.claude/rules 如果某篇专题说明确实每次都需要，只是想改善维护结构，再用 @path 导入。被导入内容仍会进入上下文，不能靠“拆文件”省 token。根文件只保留“交通规则”。</font>

:::

#### <font style="color:rgb(15, 23, 42);">维护闭环：规则不是写完就结束</font>
<font style="color:rgb(23, 32, 51);">项目会变，命令会换，目录会重组。CLAUDE.md 最危险的状态不是空，而是</font>**<font style="color:rgb(15, 23, 42);">看起来很完整、实际已经过期</font>**<font style="color:rgb(23, 32, 51);">。把它当成代码维护，至少建立三个信号：</font>

+ <font style="color:rgb(15, 23, 42);">📌</font><font style="color:rgb(15, 23, 42);"> 变更触发 </font><font style="color:rgb(23, 32, 51);">package manager、测试命令、目录职责、权限边界发生变化时，同一个 PR 更新规则。</font>
+ <font style="color:rgb(15, 23, 42);">👤</font><font style="color:rgb(15, 23, 42);"> 明确维护人</font><font style="color:rgb(23, 32, 51);">给规则标注 owner 或团队；没人负责的文档，迟早会变成历史遗迹。</font>
+ <font style="color:rgb(15, 23, 42);">🔁</font><font style="color:rgb(15, 23, 42);"> 定期抽查 </font><font style="color:rgb(23, 32, 51);">每隔一段时间用真实任务跑一遍，并删除已经能从代码稳定推导出的内容。</font>

<font style="color:rgb(23, 32, 51);">一个很朴素的检查问题是：</font>**<font style="color:rgb(15, 23, 42);">“如果删掉这一行，Claude 下次会不会更容易做错？”</font>**<font style="color:rgb(23, 32, 51);">答案是否定的，就删；答案是肯定的，就补上路径、命令或验收证据。这样 CLAUDE.md 才会越写越短，越写越有用。</font>

### <font style="color:rgb(15, 23, 42);">2.7 实战：让 Claude 完成“月度支出分类汇总”</font>
<font style="color:rgb(23, 32, 51);">前面的原则如果只看不练，很容易变成“好像都懂，关掉页面就不会”。下面做一个能真正跑起来的小项目：输入一组消费记录，按月份汇总总支出和各分类支出。它不需要数据库，也不需要前端，但会完整经历</font>**<font style="color:rgb(15, 23, 42);">需求、规则、实现、测试、验收</font>**<font style="color:rgb(23, 32, 51);">，很适合第一次写 CLAUDE.md。</font>

:::info
**<font style="color:rgb(37, 99, 235);">🎯</font>****<font style="color:rgb(37, 99, 235);"> 练习完成后，你会得到什么？</font>**

+ <font style="color:rgb(23, 32, 51);">一个可运行的 Python 支出汇总小工具，能回答“这个月的钱花到哪里了”。</font>
+ <font style="color:rgb(23, 32, 51);">一份不到 30 行的项目级</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);">，包含命令、目录、领域规则和验收要求。</font>
+ <font style="color:rgb(23, 32, 51);">一次完整的 Agent 协作记录：Claude 读规则、实现功能、运行测试并报告结果。</font>

:::

#### <font style="color:rgb(15, 23, 42);">案例背景：金额算对，比代码看起来漂亮更重要</font>
<font style="color:rgb(23, 32, 51);">假设你在做一个个人记账工具。每条记录只有日期、分类和金额，金额用“分”保存，例如</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">3200</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">代表 32 元。现在你想增加月度汇总：查询</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">2026-07</font>`<font style="color:rgb(23, 32, 51);">，返回当月总支出，以及餐饮、交通等分类各花了多少。</font>

<font style="color:rgb(23, 32, 51);">这类需求看起来不难，却有三个很典型的坑：金额若用浮点数可能出现精度问题；月份过滤容易把 8 月数据算进来；测试失败时 Agent 可能为了“通过”去改测试。正好可以把这些隐性要求写成明确、长期、可验证的项目规则。</font>

| **<font style="color:rgb(15, 23, 42);">你需要准备</font>** | **<font style="color:rgb(15, 23, 42);">怎么确认</font>** | **<font style="color:rgb(15, 23, 42);">说明</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">Claude Code</font> | `<font style="color:rgb(29, 78, 216);">claude --version</font>` | <font style="color:rgb(23, 32, 51);">能显示版本号即可。</font> |
| <font style="color:rgb(23, 32, 51);">uv</font> | `<font style="color:rgb(29, 78, 216);">uv --version</font>` | <font style="color:rgb(23, 32, 51);">用于创建环境、安装 pytest 和运行测试。</font> |
| <font style="color:rgb(23, 32, 51);">Python 3.13</font> | `<font style="color:rgb(29, 78, 216);">uv python pin 3.13</font>` | <font style="color:rgb(23, 32, 51);">若你只能使用其他版本，可把后文规则中的版本同步改成你需要的版本。</font> |
| <font style="color:rgb(23, 32, 51);">一个空目录</font> | <font style="color:rgb(23, 32, 51);">目录内没有重要文件</font> | <font style="color:rgb(23, 32, 51);">全程使用虚构消费数据，不要放真实账单、Token 或密码。</font> |


#### <font style="color:rgb(15, 23, 42);">第 1 步：创建最小项目</font>
<font style="color:rgb(23, 32, 51);">先搭一个空舞台。下面命令会创建项目、固定 Python 版本，并把 pytest 加入开发依赖。每输完一行按回车；如果终端询问下载 Python 或访问网络，确认来源可信后再允许。</font>

**<font style="color:rgb(37, 99, 235);">macOS / Linux 命令</font>**

```plain
mkdir expense-tracker-lab
cd expense-tracker-lab
uv init --lib --name expense-tracker
uv python pin 3.13
uv add --dev pytest
mkdir -p tests
```

**<font style="color:rgb(37, 99, 235);">Windows PowerShell 命令</font>**

```plain
New-Item -ItemType Directory expense-tracker-lab
Set-Location expense-tracker-lab
uv init --lib --name expense-tracker
uv python pin 3.13
uv add --dev pytest
New-Item -ItemType Directory -Force tests
```

<font style="color:rgb(23, 32, 51);">完成后，项目大致应该长这样。</font>`<font style="color:rgb(29, 78, 216);">report.py</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">现在还不存在，它正是稍后要让 Claude 创建的文件。</font>

```plain
expense-tracker-lab/
├─ pyproject.toml
├─ .python-version
├─ src/
│  └─ expense_tracker/
│     └─ __init__.py
└─ tests/
   └─ test_report.py    # 下一步创建
```

:::warning
**<font style="color:rgb(217, 119, 6);">⚠️</font>****<font style="color:rgb(217, 119, 6);"> 命令跑不通时先停一下</font>**

<font style="color:rgb(23, 32, 51);">不要因为自己的目录名与示例不同就重来。先运行 </font>`<font style="color:rgb(29, 78, 216);">pwd</font>`<font style="color:rgb(23, 32, 51);">（PowerShell 用 </font>`<font style="color:rgb(29, 78, 216);">Get-Location</font>`<font style="color:rgb(23, 32, 51);">）确认当前位置，再检查 </font>`<font style="color:rgb(29, 78, 216);">pyproject.toml</font>`<font style="color:rgb(23, 32, 51);"> 是否就在当前目录。后面的命令都必须从这个项目根目录运行。</font>

:::

#### <font style="color:rgb(15, 23, 42);">第 2 步：先写测试，把需求变成“可判分的题目”</font>
<font style="color:rgb(23, 32, 51);">新建</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">tests/test_report.py</font>`<font style="color:rgb(23, 32, 51);">，填入下面内容。这里故意先写测试、后写实现：测试就像答案判分卡，Claude 做完后不能只说“应该可以”，而要拿运行结果证明。</font>

```python
import pytest

from expense_tracker.report import summarize_month

EXPENSES = [
    {"date": "2026-07-02", "category": "food", "amount_cents": 3200},
    {"date": "2026-07-03", "category": "transport", "amount_cents": 1500},
    {"date": "2026-07-20", "category": "food", "amount_cents": 2800},
    {"date": "2026-08-01", "category": "food", "amount_cents": 9999},
]

def test_summarizes_only_requested_month():
    assert summarize_month(EXPENSES, "2026-07") == {
        "month": "2026-07",
        "total_cents": 7500,
        "by_category": {"food": 6000, "transport": 1500},
    }

def test_rejects_bad_month():
    with pytest.raises(ValueError):
        summarize_month(EXPENSES, "July")


def test_rejects_float_amount():
    expenses = [
        {"date": "2026-07-02", "category": "food", "amount_cents": 32.5}
    ]
    with pytest.raises(TypeError):
        summarize_month(expenses, "2026-07")


def test_rejects_boolean_amount():
    expenses = [
        {"date": "2026-07-02", "category": "food", "amount_cents": True}
    ]
    with pytest.raises(TypeError):
        summarize_month(expenses, "2026-07")


def test_does_not_mutate_input():
    expenses = [item.copy() for item in EXPENSES]
    original = [item.copy() for item in expenses]

    summarize_month(expenses, "2026-07")

    assert expenses == original
```

<font style="color:rgb(23, 32, 51);">现在运行一次：</font>

```plain
uv run pytest -q
```

<!-- 这是一张图片，ocr 内容为：PS D:\EXPENSE-TRACKER-LAB> UV RUN PYTEST ERRORS ERROR COLLECTING TESTS/TEST_REPORT.PY IMPORTERROR WHILE IMPORTING TEST MODULE 'D:\EXPENSE-TRACKER-LAB\TESTS (TEST-REPORT.PY' HINT:MAKE TEST MODULES/PACKAGES HAVE VALID PYTHON NAMES. YOUR SURE TRACEBACK: D:\SOFTWARE\LIB\IMPORTLIB\__INIT__ IN IMPORT_MODULE T_-.PY:88: IN RETURN _BOOTSTRAP._GCD_IMPORT(NAME[LEVEL:], LEVEL) PACKAGE, AAAAAAAAAAAAAAAAAAAAAAAAA VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV TESTS\TEST_REPORT.PY:3: IN <MODULE> FROM EXPENSE_TRACKER.REPORT IMPORT SUMMARIZE_MONTH MODULENOTFOUNDERROR: NO MODULE NAMED 'EXPENSE_TRACKER.REPORT' SHORT TEST SUMMARY INFO ERROR TESTS/TEST_REPORT PY !!!!! INTERRUPTED: 1 ERROR DURING COLLECTION IN 0.46S ERROR -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785122932189-50cd3f34-cb31-42fe-8502-57560997ca35.png)

<font style="color:rgb(23, 32, 51);">你应该看到类似 </font>`<font style="color:rgb(29, 78, 216);">ModuleNotFoundError: No module named 'expense_tracker.report'</font>`<font style="color:rgb(23, 32, 51);"> 的失败。别慌，这次失败是</font>**<font style="color:rgb(15, 23, 42);">正确现象</font>**<font style="color:rgb(23, 32, 51);">：测试已经被发现，只是实现文件还没创建。如果提示找不到 pytest，回到项目根目录重新运行 </font>`<font style="color:rgb(29, 78, 216);">uv add --dev pytest</font>`<font style="color:rgb(23, 32, 51);">。</font>

<!-- 这是一张图片，ocr 内容为：1.实现还不存在 3.遵循规则,修复实现 2.测试被发现 TEST_XXXPY 测试已 UV RUN PYTEST-Q CLAUDE.MD 被发现 MODULENOTFOUNDERROR 全部 这是正确失败 通过 整数金额 运行验证 不改测试 1 3 女红灯不是终点,而是可验证需求的起点. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462607899-1c5eacc2-74b5-4606-bc4f-ab58f96c5065.png)

#### <font style="color:rgb(15, 23, 42);">第 3 步：别急着叫 Claude 写代码，先写项目规则</font>
<font style="color:rgb(23, 32, 51);">在项目根目录创建</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);">，写入下面内容。你可以原样用于这个练习；放进自己的项目时，必须把路径和命令换成真实值。</font>

```markdown
# CLAUDE.md

## Project
- Python 3.13 library managed with uv.
- Purpose: summarize synthetic expense records by month.

## Commands
- Install: `uv sync`
- Test: `uv run pytest -q`

## Structure
- `src/expense_tracker/`: implementation.
- `tests/`: executable requirements and regression tests.

## Domain rules
- Money uses integer cents; never use float for amounts.
- Dates use ISO `YYYY-MM-DD`; month input uses `YYYY-MM`.
- Keep `summarize_month` pure; do not mutate input records.

## Change rules
- Do not add a runtime dependency for this task.
- Do not weaken or delete tests just to make them pass.

## Verification
- Run `uv run pytest -q` after changes.
- Report changed files, test result, and skipped checks.

## Safety
- Use synthetic data only. Never add real financial records.
```

<font style="color:rgb(23, 32, 51);">这 25 行分别解决五件事：Claude 知道项目是什么、命令怎么跑、实现放哪里、金额和日期遵守什么规则、做完拿什么证据交付。尤其是“金额不用浮点数”和“不能为了通过而删测试”，都无法仅靠空目录推导出来。</font>

<font style="color:rgb(220, 38, 38);">❌</font><font style="color:rgb(220, 38, 38);"> 模糊指令</font>

```plain
帮我实现月度支出统计，
代码写得专业一点。
```

<font style="color:rgb(23, 32, 51);">没有输入输出、边界和验收。即使代码能运行，你也不知道金额规则有没有被破坏。</font>

<font style="color:rgb(5, 150, 105);">✅</font><font style="color:rgb(5, 150, 105);"> 可执行任务</font>

```plain
实现 `tests/test_report.py` 要求的功能。
开始前读取 CLAUDE.md 并说明计划；
实现后运行测试，报告改动文件和结果。
除非需求矛盾，不要修改测试。
```

<font style="color:rgb(23, 32, 51);">业务行为交给测试定义，工程边界交给 CLAUDE.md 定义，当前任务只描述本次要做什么。</font>

#### <font style="color:rgb(15, 23, 42);">第 4 步：启动 Claude，并交付这张任务卡</font>
<font style="color:rgb(23, 32, 51);">确认终端仍在</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">expense-tracker-lab</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">根目录，然后运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">claude</font>`<font style="color:rgb(23, 32, 51);">。进入会话后先执行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">/context</font>`<font style="color:rgb(23, 32, 51);">，确认项目 CLAUDE.md 已加载，再发送下面这段：</font>

```plain
请实现 `tests/test_report.py` 要求的月度支出汇总功能。

要求：
1. 开始修改前，先读取 CLAUDE.md，并用 3～5 行说明计划。
2. 实现应放在 `src/expense_tracker/report.py`。
3. 除非测试与需求矛盾，不要修改测试。
4. 完成后运行 CLAUDE.md 规定的测试。
5. 报告改动文件、测试结果，以及未执行的检查。
```

<font style="color:rgb(23, 32, 51);">Claude 正常的行动顺序应该是：读取规则和测试 → 创建</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">report.py</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">→ 运行 pytest → 根据报错修正 → 汇报结果。遇到写文件或执行命令的权限确认时，先看清目标路径和命令，只允许当前练习需要的操作。</font>

:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 你要观察的是过程，不只是答案</font>**

<font style="color:rgb(23, 32, 51);">如果 Claude 一上来就安装 pandas、把金额转成 float，或者没跑测试就说完成，说明 CLAUDE.md 没被加载、规则不够明确，或任务提示没有要求证据。先修规则，再重试；不要靠聊天里反复提醒来补洞。</font>

:::

#### <font style="color:rgb(15, 23, 42);">第 5 步：对照参考实现，理解关键逻辑</font>
<font style="color:rgb(23, 32, 51);">Claude 的代码不必与下面逐字相同，但应该满足相同行为。一个不增加第三方依赖的参考实现如下：</font>

```python
from datetime import date

def _parse_month(month: str) -> tuple[int, int]:
    if not isinstance(month, str) or len(month) != 7:
        raise ValueError("month must use YYYY-MM")
    try:
        parsed = date.fromisoformat(f"{month}-01")
    except ValueError as exc:
        raise ValueError("month must use YYYY-MM") from exc
    if parsed.strftime("%Y-%m") != month:
        raise ValueError("month must use YYYY-MM")
    return parsed.year, parsed.month

def summarize_month(expenses: list[dict], month: str) -> dict:
    target = _parse_month(month)
    by_category: dict[str, int] = {}
    for expense in expenses:
        spent_on = date.fromisoformat(expense["date"])
        cents = expense["amount_cents"]
        if not isinstance(cents, int) or isinstance(cents, bool):
            raise TypeError("amount_cents must be an integer")
        if (spent_on.year, spent_on.month) == target:
            category = expense["category"]
            by_category[category] = by_category.get(category, 0) + cents
    return {"month": month, "total_cents": sum(by_category.values()),
            "by_category": by_category}
```

<font style="color:rgb(23, 32, 51);">关键点有四个：</font>`<font style="color:rgb(29, 78, 216);">date.fromisoformat</font>`<font style="color:rgb(23, 32, 51);"> 真正校验日期；用年和月比较，而不是做模糊字符串包含；金额全程保持整数；函数只读取传入列表，不改原数据。参考实现不是唯一答案，测试和规则同时通过才是答案。</font>

#### <font style="color:rgb(15, 23, 42);">第 6 步：自己验收，不把“Claude 说通过”当证据</font>
<font style="color:rgb(23, 32, 51);">退出 Claude 后，仍在项目根目录运行：</font>

```plain
uv run pytest -q
```

<font style="color:rgb(23, 32, 51);">预期能看到 </font>`<font style="color:rgb(29, 78, 216);">5 passed</font>`<font style="color:rgb(23, 32, 51);">，耗时会因电脑而不同。接着按下面清单人工检查：</font>

| **<font style="color:rgb(15, 23, 42);">验收项</font>** | **<font style="color:rgb(15, 23, 42);">怎么检查</font>** | **<font style="color:rgb(15, 23, 42);">通过标准</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">功能正确</font> | <font style="color:rgb(23, 32, 51);">查看 pytest 输出</font> | <font style="color:rgb(23, 32, 51);">五个测试全部通过。</font> |
| <font style="color:rgb(23, 32, 51);">月份隔离</font> | <font style="color:rgb(23, 32, 51);">查看测试数据与结果</font> | <font style="color:rgb(23, 32, 51);">8 月的</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">9999</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">没算进 7 月。</font> |
| <font style="color:rgb(23, 32, 51);">金额安全</font> | <font style="color:rgb(23, 32, 51);">查看 pytest 输出</font> | <font style="color:rgb(23, 32, 51);">浮点数和布尔值金额都会被拒绝。</font> |
| <font style="color:rgb(23, 32, 51);background-color:rgb(248, 248, 248);">输入完整性</font> | <font style="background-color:rgb(248, 248, 248);">查看 pytest 输出</font> | <font style="color:rgb(23, 32, 51);background-color:rgb(248, 248, 248);">汇总函数不会修改传入记录。</font> |
| <font style="color:rgb(23, 32, 51);">改动范围</font> | <font style="color:rgb(23, 32, 51);">查看</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">git status --short</font>` | <font style="color:rgb(23, 32, 51);">没有无关依赖、配置或真实账单。</font> |
| <font style="color:rgb(23, 32, 51);">交付可信</font> | <font style="color:rgb(23, 32, 51);">回看 Claude 的摘要</font> | <font style="color:rgb(23, 32, 51);">明确报告改动文件和实际测试结果。</font> |


#### <font style="color:rgb(15, 23, 42);">第 7 步：故意做一次复盘，让规则变得更准</font>
<font style="color:rgb(23, 32, 51);">假设 Claude 虽然通过了测试，却没有验证空列表，或者遇到错误日期时抛出了难懂异常。不要立刻往 CLAUDE.md 塞十条新规定。先判断这是</font>**<font style="color:rgb(15, 23, 42);">长期项目规则</font>**<font style="color:rgb(23, 32, 51);">，还是</font>**<font style="color:rgb(15, 23, 42);">本次功能需求</font>**<font style="color:rgb(23, 32, 51);">：</font>

+ <font style="color:rgb(23, 32, 51);">“金额始终用整数分”会影响以后所有功能，留在 CLAUDE.md。</font>
+ <font style="color:rgb(23, 32, 51);">“空列表返回 0”只属于这个汇总函数，应该新增测试，而不是写进根规则。</font>
+ <font style="color:rgb(23, 32, 51);">“这次输出要按金额降序”是当前任务要求，放 Prompt 或测试，不要永久污染项目规则。</font>

:::info
**<font style="color:rgb(37, 99, 235);">🤔</font>****<font style="color:rgb(37, 99, 235);"> 为什么不把所有需求都写进 CLAUDE.md？</font>**

<font style="color:rgb(23, 32, 51);">因为它是项目的交通规则，不是每一趟行程的导航。长期不变量放 CLAUDE.md，具体功能行为放测试，当前任务目标放 Prompt。三者分开，下一次任务才不会背着一堆过期要求。</font>

:::

#### <font style="color:rgb(15, 23, 42);">常见报错：看到这些信息该怎么办？</font>
| **<font style="color:rgb(15, 23, 42);">现象</font>** | **<font style="color:rgb(15, 23, 42);">常见原因</font>** | **<font style="color:rgb(15, 23, 42);">处理方法</font>** |
| :--- | :--- | :--- |
| `<font style="color:rgb(29, 78, 216);">uv: command not found</font>` | <font style="color:rgb(23, 32, 51);">uv 未安装或终端未刷新 PATH</font> | <font style="color:rgb(23, 32, 51);">按 uv 官方安装说明处理，关闭并重新打开终端，再运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">uv --version</font>`<br/><font style="color:rgb(23, 32, 51);">。</font> |
| <font style="color:rgb(23, 32, 51);">创建实现前出现</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">ModuleNotFoundError</font>` | `<font style="color:rgb(29, 78, 216);">report.py</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">还不存在</font> | <font style="color:rgb(23, 32, 51);">这是预期的红灯，说明测试已生效，可以进入 Claude 实现步骤。</font> |
| <font style="color:rgb(23, 32, 51);">实现后仍提示模块不存在</font> | <font style="color:rgb(23, 32, 51);">文件放错路径或包名不一致</font> | <font style="color:rgb(23, 32, 51);">确认路径是</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">src/expense_tracker/report.py</font>`<br/><font style="color:rgb(23, 32, 51);">，并核对</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">pyproject.toml</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">的项目名。</font> |
| <font style="color:rgb(23, 32, 51);">Claude 修改了测试</font> | <font style="color:rgb(23, 32, 51);">任务边界不够清楚</font> | <font style="color:rgb(23, 32, 51);">撤销测试改动，在任务中明确“除非矛盾，不修改测试”，再让它实现。</font> |
| <font style="color:rgb(23, 32, 51);">Claude 没按规则行动</font> | <font style="color:rgb(23, 32, 51);">文件未加载或会话目录错误</font> | <font style="color:rgb(23, 32, 51);">运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">/context</font>`<br/><font style="color:rgb(23, 32, 51);">，确认项目文件已加载；必要时退出并从项目根目录重新启动。</font> |


:::tip
**<font style="color:rgb(5, 150, 105);">🎯</font>****<font style="color:rgb(5, 150, 105);"> 这个案例真正练的是什么？</font>**

<font style="color:rgb(23, 32, 51);">不是 25 行 Python，而是把“口头期待”拆成三层：CLAUDE.md 管长期工程规则，测试管可执行业务行为，Prompt 管本次任务。做到这一点，Claude 才从“猜需求的代码生成器”变成“按规则交付、拿证据说话的工程协作者”。</font>

:::

<!-- 这是一张图片，ocr 内容为：工程任务的三层职责 产出结果 组合执行 代码文件 真实命令 长期规则 安全边界 测试报告 人一V CLAUDE.MD 目国 月份筛选 输入不变 金额正确 测试 实现月度支出汇总 本次PROMPT 可判分行为归测试,一次性要求归PROMPT. 长期约束归规则, -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462714715-1cdbcfb3-6556-4508-aa64-28140106e0d7.png)

<font style="color:rgb(23, 32, 51);">做完这个练习，你可能会想继续往 CLAUDE.md 里加更多说明。先别急：下一章就解释为什么规则不是越多越好，以及过长之后究竟会损失什么。</font>

## <font style="color:rgb(15, 23, 42);">三、为什么短比长更有效</font>
<font style="color:rgb(23, 32, 51);">做完上一章的记账案例，你很容易产生一个冲动：既然 CLAUDE.md 有用，那就把命名规范、Git 流程、架构说明、发布步骤全塞进去，岂不是更稳？</font>**<font style="color:rgb(15, 23, 42);">恰恰相反。</font>**<font style="color:rgb(23, 32, 51);">规则文件的价值不取决于写了多少，而取决于 Claude 在需要做决定的那一刻，能不能迅速撞见那条真正重要的规则。</font>

:::warning
**<font style="color:rgb(217, 119, 6);">⚠️</font>****<font style="color:rgb(217, 119, 6);"> 长文件最危险的地方</font>**

<font style="color:rgb(23, 32, 51);">不是“多花一点 token”这么简单，而是硬规则会和背景介绍、重复说明、个人偏好一起竞争注意力。结果往往是：文件看起来面面俱到，Claude 却漏掉了最不能漏的那一行。</font>

:::

<!-- 这是一张图片，ocr 内容为：短而准 长而杂 HTTARAN BEESTHON 真实命令 看得见 占上下文 关键边界 README复述 验证动作 能执行 目录清单 容易冲突 团队口号 可验证 重复规则 难以维护 过期命令 禁止手改GENERATED/ 短,不是信息少;是每一行都改变行动. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462744890-805abbb5-fe90-46c4-a3f0-ad863ee67827.png)

### <font style="color:rgb(15, 23, 42);">3.1 先搞清楚：短，不等于信息少</font>
<font style="color:rgb(23, 32, 51);">把 CLAUDE.md 想成登机时随身带的行李。你不是只能带两件东西，而是要把每一件都换成</font>**<font style="color:rgb(15, 23, 42);">高价值、随时会用、丢了就麻烦</font>**<font style="color:rgb(23, 32, 51);">的东西。厚外套可以托运，酒店攻略可以放手机里，护照和登机牌才应该留在手边。</font>

1. <font style="color:rgb(15, 23, 42);">🎯</font><font style="color:rgb(15, 23, 42);"> 高信号：</font><font style="color:rgb(23, 32, 51);">能直接改变下一步行动，例如真实测试命令、唯一事实来源、禁止手改路径。</font>
2. <font style="color:rgb(15, 23, 42);">🧱</font><font style="color:rgb(15, 23, 42);"> 稳定：</font><font style="color:rgb(23, 32, 51);">不会明天就过期，例如金额单位、生成代码边界、包职责。</font>
3. <font style="color:rgb(15, 23, 42);">📍</font><font style="color:rgb(15, 23, 42);"> 有范围：</font><font style="color:rgb(23, 32, 51);">能说清对哪个目录、变更或任务生效，不让局部规则污染全仓库。</font>
4. <font style="color:rgb(15, 23, 42);">🔍</font><font style="color:rgb(15, 23, 42);"> 可验证：</font><font style="color:rgb(23, 32, 51);">能用命令、测试或产物证明执行过，而不是停留在“注意质量”。</font>

<font style="color:rgb(23, 32, 51);">所以“短”的准确含义是</font>**<font style="color:rgb(15, 23, 42);">高信号密度</font>**<font style="color:rgb(23, 32, 51);">：相同的上下文成本里，保留更多会改变行为的事实，删掉 Claude 能从代码推导、只对人类有帮助、或已经在别处维护的内容。</font>

### <font style="color:rgb(15, 23, 42);">3.2 长文件会付出哪四种成本？</font>
<font style="color:rgb(23, 32, 51);">先看当前文档描述的加载差异。它决定了为什么根文件、Auto memory 和按路径规则不能用同一种写法：</font>

| **<font style="color:rgb(15, 23, 42);">机制</font>** | **<font style="color:rgb(15, 23, 42);">加载方式</font>** | **<font style="color:rgb(15, 23, 42);">尺寸目标</font>** | **<font style="color:rgb(15, 23, 42);">过长会怎样</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">CLAUDE.md</font>** | <font style="color:rgb(23, 32, 51);">适用时通常</font>**<font style="color:rgb(15, 23, 42);">全量</font>**<font style="color:rgb(23, 32, 51);">进入上下文</font> | <font style="color:rgb(23, 32, 51);">官方</font><font style="color:rgb(23, 32, 51);"> </font>**<font style="color:rgb(15, 23, 42);">target under 200 lines</font>** | <font style="color:rgb(23, 32, 51);">噪声淹没硬规则；</font>`<font style="color:rgb(29, 78, 216);">/doctor</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">可能提示 trim</font> |
| **<font style="color:rgb(15, 23, 42);">Auto memory 主索引</font>** | <font style="color:rgb(23, 32, 51);">常只注入主文件前缀</font> | <font style="color:rgb(23, 32, 51);">常见</font><font style="color:rgb(23, 32, 51);"> </font>**<font style="color:rgb(15, 23, 42);">~200 行 / ~25KB</font>**<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">一类上限（以当前文档为准）</font> | <font style="color:rgb(23, 32, 51);">细节应拆到主题文件，按需再读</font> |
| **<font style="color:rgb(15, 23, 42);">path-scoped rules</font>** | <font style="color:rgb(23, 32, 51);">仅处理匹配路径时适用</font> | <font style="color:rgb(23, 32, 51);">单文件仍宜短</font> | <font style="color:rgb(23, 32, 51);">匹配时才付上下文成本</font> |


1. <font style="color:rgb(15, 23, 42);">上下文占用：</font><font style="color:rgb(23, 32, 51);">根规则会和对话、代码、工具输出共享上下文。固定说明越多，留给当前任务证据的空间就越少。</font>
2. <font style="color:rgb(15, 23, 42);">信号竞争：</font><font style="color:rgb(23, 32, 51);">金额用整数分”如果夹在几十条风格建议中，视觉上仍存在，决策时却更容易被噪声盖住。</font>
3. <font style="color:rgb(15, 23, 42);">冲突概率：</font><font style="color:rgb(23, 32, 51);">同一事实写在根文件、包文件和导入文档里，版本一旦不同，Claude 就要面对互相打架的指令。</font>
4. <font style="color:rgb(15, 23, 42);">维护成本: </font><font style="color:rgb(23, 32, 51);">内容越长，团队越不愿审查。过期命令会继续被执行，比完全没写更容易制造返工。</font>

:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 逻辑闭环</font>**

<font style="color:rgb(23, 32, 51);">CLAUDE.md 适用时通常全量进入上下文 → 每一行都有持续成本 → 根文件应保留全局高频规则；局部细节按路径加载；长流程改成 Skill；人类背景资料留在 README 或 ADR。</font>**<font style="color:rgb(15, 23, 42);">拆出去不是消失，而是改成在正确时机出现。</font>**

:::

### <font style="color:rgb(15, 23, 42);">3.3 用“六维打分”判断一行该不该留</font>
<font style="color:rgb(23, 32, 51);">光凭感觉删规则很容易走向另一个极端。下面是一套编辑用启发式，不是 Claude Code 官方评分：每条规则按六个问题检查。正向项越多，越值得留；重复、易变越严重，越应该改写或移动。</font>

| **<font style="color:rgb(15, 23, 42);">维度</font>** | **<font style="color:rgb(15, 23, 42);">要问的问题</font>** | **<font style="color:rgb(15, 23, 42);">高分例子</font>** | **<font style="color:rgb(15, 23, 42);">低分例子</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">可执行</font>** | <font style="color:rgb(23, 32, 51);">读完知道下一步做什么吗？</font> | `<font style="color:rgb(29, 78, 216);">uv run pytest tests/auth -q</font>` | <font style="color:rgb(23, 32, 51);">重视测试质量</font> |
| **<font style="color:rgb(15, 23, 42);">非显然</font>** | <font style="color:rgb(23, 32, 51);">只看代码能稳定推导吗？</font> | `<font style="color:rgb(29, 78, 216);">generated/**</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">禁止手改</font> | <font style="color:rgb(23, 32, 51);">项目使用 Python</font> |
| **<font style="color:rgb(15, 23, 42);">错误代价</font>** | <font style="color:rgb(23, 32, 51);">猜错会返工、破坏数据或引入风险吗？</font> | <font style="color:rgb(23, 32, 51);">金额使用整数分</font> | <font style="color:rgb(23, 32, 51);">变量名尽量清晰</font> |
| **<font style="color:rgb(15, 23, 42);">复用频率</font>** | <font style="color:rgb(23, 32, 51);">多类任务都会遇到吗？</font> | <font style="color:rgb(23, 32, 51);">提交前的最小验证命令</font> | <font style="color:rgb(23, 32, 51);">本次需求的输出排序</font> |
| **<font style="color:rgb(15, 23, 42);">稳定程度</font>** | <font style="color:rgb(23, 32, 51);">一个月后大概率还成立吗？</font> | <font style="color:rgb(23, 32, 51);">生成源文件的位置</font> | <font style="color:rgb(23, 32, 51);">临时迁移截止日期</font> |
| **<font style="color:rgb(15, 23, 42);">唯一来源</font>** | <font style="color:rgb(23, 32, 51);">是否已经在更权威的位置维护？</font> | <font style="color:rgb(23, 32, 51);">CLAUDE.md 指向唯一脚本</font> | <font style="color:rgb(23, 32, 51);">复制一遍完整 CI 配置</font> |


:::info
**<font style="color:rgb(37, 99, 235);">💡</font>****<font style="color:rgb(37, 99, 235);"> 一个实用判断</font>**

<font style="color:rgb(23, 32, 51);">一条规则若同时具备“非显然 + 错误代价高 + 多次复用”，即使只有一句也值得放在根文件；如果只是“听起来正确”，却没有动作、范围和证据，删掉通常不会损失任何东西。</font>

:::

### <font style="color:rgb(15, 23, 42);">3.4 压缩示范：从团队宣言变成操作卡</font>
<font style="color:rgb(23, 32, 51);">下面两份规则表达的是同一个目标。上边看着正式，却没有一句能直接验收；下边把抽象要求换成路径、命令和失败处理。</font>

#### <font style="color:rgb(220, 38, 38);">❌</font><font style="color:rgb(220, 38, 38);"> 压缩前：句句正确，句句没法判分</font>
```plain
# Engineering Guidelines
- Write clean and maintainable code.
- Use meaningful variable names.
- Follow industry best practices.
- Add tests when appropriate.
- Handle errors carefully.
- Keep documentation up to date.
- Avoid unnecessary dependencies.
- Make sure all changes are safe.
```

<font style="color:rgb(23, 32, 51);">这些话适合价值观培训，不适合控制 Agent 行动。不同人对“适当”“安全”“最佳实践”的理解完全不同。</font>

#### <font style="color:rgb(5, 150, 105);">✅</font><font style="color:rgb(5, 150, 105);"> 压缩后：每行都能改变行动</font>
```plain
## Commands
- Test: `uv run pytest -q`
- Lint: `uv run ruff check .`

## Rules
- Do not edit `src/generated/**` by hand.
- Add dependencies only with `uv add`.
- Bugfixes require a regression test.

## Verification
- Report commands run and skipped checks.
```

<font style="color:rgb(23, 32, 51);">“可维护”被替换成真实检查，“不要乱加依赖”被替换成唯一入口，“确保安全”被替换成明确边界。</font>

<font style="color:rgb(23, 32, 51);">压缩不是把八行机械地变成四行，而是</font>**<font style="color:rgb(15, 23, 42);">删掉无法验证的形容词，补上能执行的名词和动词</font>**<font style="color:rgb(23, 32, 51);">。如果删完发现没有任何事实可留，说明原文原本就没有给 Claude 新信息。</font>

### <font style="color:rgb(15, 23, 42);">3.5 删下来的内容应该搬到哪里？</font>
<font style="color:rgb(23, 32, 51);">很多人舍不得删，是担心知识丢失。其实问题不是“留或删”，而是“放在哪里，什么时候加载”。</font>

| **<font style="color:rgb(15, 23, 42);">内容</font>** | **<font style="color:rgb(15, 23, 42);">推荐去向</font>** | **<font style="color:rgb(15, 23, 42);">适用时机</font>** | **<font style="color:rgb(15, 23, 42);">例子</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">所有任务都需要的硬规则</font> | <font style="color:rgb(23, 32, 51);">根</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">CLAUDE.md</font>` | <font style="color:rgb(23, 32, 51);">进入仓库就需要</font> | <font style="color:rgb(23, 32, 51);">包管理器、全局生成边界、安全请示</font> |
| <font style="color:rgb(23, 32, 51);">单个包或目录的约束</font> | <font style="color:rgb(23, 32, 51);">嵌套 CLAUDE.md / path-scoped rule</font> | <font style="color:rgb(23, 32, 51);">处理对应路径时</font> | <font style="color:rgb(23, 32, 51);">Billing 金额规则、前端快照命令</font> |
| <font style="color:rgb(23, 32, 51);">重复执行的长流程</font> | <font style="color:rgb(23, 32, 51);">Skill / Command</font> | <font style="color:rgb(23, 32, 51);">用户明确触发流程时</font> | <font style="color:rgb(23, 32, 51);">发布、依赖升级、生成客户端</font> |
| <font style="color:rgb(23, 32, 51);">架构背景与决策历史</font> | <font style="color:rgb(23, 32, 51);">README / ADR，再按需</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">@</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">导入</font> | <font style="color:rgb(23, 32, 51);">需要理解设计原因时</font> | <font style="color:rgb(23, 32, 51);">服务拆分原因、迁移方案</font> |
| <font style="color:rgb(23, 32, 51);">强制权限与事件检查</font> | <font style="color:rgb(23, 32, 51);">Settings / Hooks</font> | <font style="color:rgb(23, 32, 51);">工具调用或生命周期事件</font> | <font style="color:rgb(23, 32, 51);">禁止读取密钥、提交前执行检查</font> |
| <font style="color:rgb(23, 32, 51);">个人偏好与本机差异</font> | <font style="color:rgb(23, 32, 51);">用户级 / local 文件</font> | <font style="color:rgb(23, 32, 51);">只影响当前用户或设备</font> | <font style="color:rgb(23, 32, 51);">本地端口、个人输出偏好</font> |


<!-- 这是一张图片，ocr 内容为：规则内容应该放到哪里? 口口 所有任务都需要 @IMPORT 只对某个目录 重复多步流程 19880 拆文件 背景与历史 西 必须强制执行 省上下文 有限 信息分拣台 个人和本机差异 四十四十 SKILL / COMMAND README / ADR 根CLAUDE.MD 嵌套规则 SETTINGS / HOOKS 用户级/LOCAL 按范围放置,按需要加载 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462773389-e11c570e-034e-4a0b-9bf2-a9e06ef3fb6a.png)

:::warning
**<font style="color:rgb(217, 119, 6);">⚠️</font>****<font style="color:rgb(217, 119, 6);"> </font>**`**<font style="color:rgb(29, 78, 216);">@import</font>**`**<font style="color:rgb(217, 119, 6);"> 不是免费的仓库</font>**

<font style="color:rgb(23, 32, 51);">把长文移到另一个文件，只在真正需要时导入才有价值；如果根文件无条件导入整本手册，内容仍会进入上下文，成本只是换了文件名。按路径加载或按任务主动读取，才是真正的延迟加载。</font>

:::

### <font style="color:rgb(15, 23, 42);">3.6 回到记账案例：哪些规则该留，哪些该搬？</font>
<font style="color:rgb(23, 32, 51);">第二章为了让练习一次跑通，给了完整的教学版 CLAUDE.md。真实项目长期维护时，还要再审一遍。下面这几条看起来都合理，但归宿并不相同：</font>

| **<font style="color:rgb(15, 23, 42);">候选内容</font>** | **<font style="color:rgb(15, 23, 42);">处理</font>** | **<font style="color:rgb(15, 23, 42);">理由</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">Money uses integer cents.</font> | **<font style="color:rgb(5, 150, 105);">保留</font>** | <font style="color:rgb(23, 32, 51);">非显然、错误代价高，而且所有金额功能都复用。</font> |
| <font style="color:rgb(23, 32, 51);">Python 3.13 library managed with uv.</font> | **<font style="color:rgb(5, 150, 105);">保留并压缩</font>** | <font style="color:rgb(23, 32, 51);">版本与包管理器会影响命令选择，可合成一行。</font> |
| <font style="color:rgb(23, 32, 51);">Do not add a runtime dependency for this task.</font> | **<font style="color:rgb(15, 23, 42);">移到 Prompt</font>** | <font style="color:rgb(23, 32, 51);">“for this task”已经说明它是一次性要求，不应永久影响后续任务。</font> |
| <font style="color:rgb(23, 32, 51);">Do not weaken or delete tests just to make them pass.</font> | **<font style="color:rgb(15, 23, 42);">改写后保留</font>** | <font style="color:rgb(23, 32, 51);">改成“修改既有测试必须解释行为变化”，避免阻止合法测试更新。</font> |
| <font style="color:rgb(23, 32, 51);">Use synthetic data only.</font> | **<font style="color:rgb(15, 23, 42);">按项目判断</font>** | <font style="color:rgb(23, 32, 51);">教学仓库可留；真实财务项目应升级为 Settings、权限和数据治理，而不只靠提醒。</font> |
| <font style="color:rgb(23, 32, 51);">Use clear names and clean code.</font> | **<font style="color:rgb(220, 38, 38);">删除</font>** | <font style="color:rgb(23, 32, 51);">没有可执行标准，且通常能从既有代码风格推导。</font> |


**<font style="color:rgb(100, 116, 139);">长期维护版可以收敛成这样</font>**

```plain
## Project
- Python 3.13 library; use uv for dependencies and commands.

## Domain rules
- Money uses integer cents; never use float for amounts.
- Dates use ISO `YYYY-MM-DD`; month input uses `YYYY-MM`.

## Change rules
- Explain any change to existing test expectations.

## Verification
- Run `uv run pytest -q` and report the result.
```

<font style="color:rgb(23, 32, 51);">看出来了吗？测试路径、实现目录如果已经遵循标准 Python 布局，就不必反复解释；一次性“不要加依赖”回到任务 Prompt；真正稳定的金额不变量仍留在最显眼的位置。</font>

### <font style="color:rgb(15, 23, 42);">3.7 一次 15 分钟的瘦身流程</font>
<font style="color:rgb(23, 32, 51);">不要等文件长到几百行才治理。命令变更、目录重组或</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">/doctor</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">提示 trim 时，按下面流程走一遍：</font>

1. **<font style="color:rgb(15, 23, 42);">看实际加载：</font>**<font style="color:rgb(23, 32, 51);">运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">/context</font>`<font style="color:rgb(23, 32, 51);">，确认有哪些 CLAUDE.md、规则和导入内容进入当前会话。</font>
2. **<font style="color:rgb(15, 23, 42);">逐行贴标签：</font>**<font style="color:rgb(23, 32, 51);">标成“全局保留、局部下沉、任务临时、人类文档、删除”五类。</font>
3. **<font style="color:rgb(15, 23, 42);">合并重复事实：</font>**<font style="color:rgb(23, 32, 51);">同一命令或约束只留一个权威来源，其他位置改成链接或删除。</font>
4. **<font style="color:rgb(15, 23, 42);">改写模糊句：</font>**<font style="color:rgb(23, 32, 51);">把“注意、尽量、保持、遵循”换成路径、动作、触发条件和验收命令。</font>
5. **<font style="color:rgb(15, 23, 42);">移动低频细节：</font>**<font style="color:rgb(23, 32, 51);">包规则下沉，长流程变 Skill，设计历史回到 README / ADR。</font>
6. **<font style="color:rgb(15, 23, 42);">跑一次真实任务：</font>**<font style="color:rgb(23, 32, 51);">观察 Claude 是否仍能选对路径和验证命令；缺失时只补回造成偏差的事实。</font>
7. **<font style="color:rgb(15, 23, 42);">用</font>****<font style="color:rgb(15, 23, 42);"> </font>**`**<font style="color:rgb(29, 78, 216);">/doctor</font>**`**<font style="color:rgb(15, 23, 42);"> </font>****<font style="color:rgb(15, 23, 42);">复查：</font>**<font style="color:rgb(23, 32, 51);">查看配置与过长提示，并把检查结果写进变更说明。</font>

:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 瘦身完成的标准</font>**

<font style="color:rgb(23, 32, 51);">不是“终于低于某个神奇行数”，而是新同事能快速扫完、Claude 能稳定执行、每条关键规则都有唯一来源。官方的 under 200 lines 是目标值，不是让你为了数字删除必要安全边界。</font>

:::

### <font style="color:rgb(15, 23, 42);">3.8 两个省 token / 排障的官方技巧</font>
#### <font style="color:rgb(15, 23, 42);">HTML 注释会被剥掉</font>
<font style="color:rgb(23, 32, 51);">CLAUDE.md 里的块级 HTML 注释</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);"><!-- maintainer notes --></font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">在注入前会被</font><font style="color:rgb(23, 32, 51);"> </font>**<font style="color:rgb(15, 23, 42);">strip</font>**<font style="color:rgb(23, 32, 51);">，不进模型上下文。适合写维护人备注、历史决策、对同事说的话——</font>**<font style="color:rgb(15, 23, 42);">不烧 token</font>**<font style="color:rgb(23, 32, 51);">。</font>

```plain
# CLAUDE.md
<!-- Owner: platform-team; review quarterly.
     Do not delete the billing invariant below. -->
## Rules
- Money uses integer minor units.
```

**<font style="color:rgb(15, 23, 42);">边界：</font>**<font style="color:rgb(23, 32, 51);">真正希望 Claude 遵守的规则不能藏在注释里，因为正常注入时它看不到。代码块里的注释会保留；如果 Claude 用 Read 工具直接打开 CLAUDE.md 原文件，也仍能看到其中的注释。因此 HTML 注释只适合减少正常注入的上下文开销，不是隐藏敏感信息或建立安全边界的办法。</font>

#### <font style="color:rgb(15, 23, 42);">/compact 后谁会重读？</font>
**<font style="color:rgb(15, 23, 42);">项目根 CLAUDE.md</font>**<font style="color:rgb(23, 32, 51);"> 在 </font>`<font style="color:rgb(29, 78, 216);">/compact</font>`<font style="color:rgb(23, 32, 51);"> 后会从磁盘 </font>**<font style="color:rgb(15, 23, 42);">重新读取</font>**<font style="color:rgb(23, 32, 51);">；嵌套/子目录的 CLAUDE.md </font>**<font style="color:rgb(15, 23, 42);">不会</font>**<font style="color:rgb(23, 32, 51);">因此自动全部重载。进阶排障：压缩后若局部规则“消失”，先确认是否在处理对应路径，或是否需要重新触达该目录文件。</font>

### <font style="color:rgb(15, 23, 42);">3.9 什么时候可以超过 200 行？</font>
**<font style="color:rgb(15, 23, 42);">target under 200 lines 是目标，不是解析器硬上限。</font>**<font style="color:rgb(23, 32, 51);">受监管项目、复杂 Monorepo 或临时迁移期，确实可能有更多不可省略的边界。但“业务复杂”不自动等于“根文件必须长”：先确认这些内容是否真的全局适用，能否按包、路径或任务拆开。</font>

#### <font style="color:rgb(15, 23, 42);">可以暂时更长</font>
<font style="color:rgb(23, 32, 51);">高风险迁移窗口、全仓库兼容期、必须同步执行的安全约束，并且有明确删除日期和维护人。</font>

#### <font style="color:rgb(15, 23, 42);">不该因此更长</font>
<font style="color:rgb(23, 32, 51);">复制 README、粘贴完整 CI、收集个人偏好、记录每次事故经过，或用篇幅掩盖没有明确命令。</font>

#### <font style="color:rgb(15, 23, 42);">超过后怎么做</font>
<font style="color:rgb(23, 32, 51);">记录原因，运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);">/doctor</font>`<font style="color:rgb(23, 32, 51);">，指定 owner，并设一次回收日期；临时规则到期就删。</font>

<font style="color:rgb(23, 32, 51);">第三章的结论可以压成一句：</font>**<font style="color:rgb(15, 23, 42);">短不是少写，而是让正确的信息在正确的范围、正确的时机出现。</font>**<font style="color:rgb(23, 32, 51);">判断方法有了，下面直接给可复制模板——先抄再改，比从零空想快得多。</font>

## <font style="color:rgb(15, 23, 42);">四、不要照抄模板：从真实仓库生成最小规则</font>
<font style="color:rgb(23, 32, 51);">每个项目的包管理器、测试入口、目录职责、生成流程和安全边界都不同。预填一份 Python、Node.js 或 Monorepo 模板，看起来省事，实际是在替仓库编造事实：命令可能不存在，目录可能无关，所谓“最佳实践”也可能与团队约定冲突。</font>

<font style="color:rgb(23, 32, 51);">真正能通用的不是模板内容，而是</font>**<font style="color:rgb(15, 23, 42);">提取证据的方法</font>**<font style="color:rgb(23, 32, 51);">。目标不是填满所有标题，而是从仓库里找出少数无法稳定推导、猜错又会返工的事实。</font>

### <font style="color:rgb(15, 23, 42);">4.1 从“套模板”切换为“做仓库体检”</font>
| **<font style="color:rgb(15, 23, 42);">做法</font>** | **<font style="color:rgb(15, 23, 42);">起点</font>** | **<font style="color:rgb(15, 23, 42);">常见结果</font>** | **<font style="color:rgb(15, 23, 42);">风险</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">照抄模板</font>** | <font style="color:rgb(23, 32, 51);">别人的技术栈和目录假设</font> | <font style="color:rgb(23, 32, 51);">一份看起来完整的 CLAUDE.md</font> | <font style="color:rgb(23, 32, 51);">命令跑不通、规则过量、边界与项目不符</font> |
| **<font style="color:rgb(15, 23, 42);">证据驱动</font>** | <font style="color:rgb(23, 32, 51);">当前仓库的脚本、CI、测试和历史约定</font> | <font style="color:rgb(23, 32, 51);">一份短小但能改变行动的规则文件</font> | <font style="color:rgb(23, 32, 51);">需要花十几分钟核对事实，但后续返工更少</font> |


<font style="color:rgb(23, 32, 51);">这就像看病：不能因为上一位患者吃某种药有效，就给所有人复制同一张处方。先检查症状和报告，再决定需要写什么；仓库里的文件、脚本和 CI 就是“检查报告”。</font>

### <font style="color:rgb(15, 23, 42);">4.2 只从六类证据中提取规则</font>
| **<font style="color:rgb(15, 23, 42);">要确认什么</font>** | **<font style="color:rgb(15, 23, 42);">优先查看的证据</font>** | **<font style="color:rgb(15, 23, 42);">可以写进 CLAUDE.md 的内容</font>** | **<font style="color:rgb(15, 23, 42);">不要猜</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">依赖如何安装</font> | <font style="color:rgb(23, 32, 51);">锁文件、manifest、Makefile、开发脚本</font> | <font style="color:rgb(23, 32, 51);">已经验证可运行的安装命令</font> | <font style="color:rgb(23, 32, 51);">看到 Python 就默认 pip，看到 JS 就默认 npm</font> |
| <font style="color:rgb(23, 32, 51);">改完如何验收</font> | <font style="color:rgb(23, 32, 51);">CI workflow、测试配置、package scripts</font> | <font style="color:rgb(23, 32, 51);">按改动范围选择的最小检查命令</font> | <font style="color:rgb(23, 32, 51);">凭经验发明 lint、类型检查或全量测试</font> |
| <font style="color:rgb(23, 32, 51);">目录由谁负责</font> | <font style="color:rgb(23, 32, 51);">入口文件、模块依赖、CODEOWNERS、局部 README</font> | <font style="color:rgb(23, 32, 51);">会影响编辑决策的职责与边界</font> | <font style="color:rgb(23, 32, 51);">把整个目录树复述一遍</font> |
| <font style="color:rgb(23, 32, 51);">哪些文件不能手改</font> | <font style="color:rgb(23, 32, 51);">生成脚本、文件头注释、构建配置</font> | <font style="color:rgb(23, 32, 51);">源文件位置、生成命令、生成产物路径</font> | <font style="color:rgb(23, 32, 51);">只凭目录名判断 generated 文件</font> |
| <font style="color:rgb(23, 32, 51);">哪些变更风险高</font> | <font style="color:rgb(23, 32, 51);">迁移脚本、权限配置、部署流程、事故记录</font> | <font style="color:rgb(23, 32, 51);">需要请示的操作和失败后的停止条件</font> | <font style="color:rgb(23, 32, 51);">用一句“所有危险操作都要小心”代替边界</font> |
| <font style="color:rgb(23, 32, 51);">有哪些领域不变量</font> | <font style="color:rgb(23, 32, 51);">回归测试、类型定义、ADR、业务文档</font> | <font style="color:rgb(23, 32, 51);">代码难以稳定推导且猜错代价高的规则</font> | <font style="color:rgb(23, 32, 51);">把个人偏好写成团队约束</font> |


:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 证据不够时怎么写？</font>**

<font style="color:rgb(23, 32, 51);">不要写。把它列为待确认问题，询问维护者或用一个真实任务验证。</font>**<font style="color:rgb(15, 23, 42);">明确的未知，比自信的错误更有价值。</font>**

:::

### <font style="color:rgb(15, 23, 42);">4.3 让 Claude 先做只读审计</font>
<font style="color:rgb(23, 32, 51);">从仓库根目录启动 Claude，先让它调查，不允许改文件。下面这段 Prompt 不绑定语言或框架，可以用于大多数代码仓库：</font>

```plain
请只读审计这个仓库，为编写 CLAUDE.md 收集证据。
不要修改文件，不要安装依赖，不要执行部署或迁移。

请输出一张表，包含：
1. 安装、开发、测试、lint、类型检查、生成代码的候选命令；
2. 每条命令的证据文件和具体位置；
3. 关键目录职责、生成产物与禁止手改路径；
4. 高风险操作和需要人工确认的事项；
5. 仍无法确认的问题。

要求：没有证据的内容标记为“未知”，不要按技术栈惯例猜测。
```

<font style="color:rgb(23, 32, 51);">拿到结果后不要直接让 Claude 写文件。你需要抽查证据：脚本是否仍在使用、CI 是否从仓库根运行、测试命令是否依赖数据库或容器、生成命令是否会覆盖本地修改。调查表的作用是暴露事实与未知，不是自动盖章。</font>

### <font style="color:rgb(15, 23, 42);">4.4 把证据变成“候选规则卡”</font>
<font style="color:rgb(23, 32, 51);">每条候选规则都过一张六格卡。任何一格答不上来，先不进根文件：</font>

1. <font style="color:rgb(15, 23, 42);">证据: </font><font style="color:rgb(23, 32, 51);">从哪个文件、脚本、测试或维护者确认？</font>
2. <font style="color:rgb(15, 23, 42);">触发: </font><font style="color:rgb(23, 32, 51);">什么变更或任务会需要它？</font>
3. <font style="color:rgb(15, 23, 42);">动作: </font><font style="color:rgb(23, 32, 51);">Claude 读完后具体要做什么？</font>
4. <font style="color:rgb(15, 23, 42);">范围: </font><font style="color:rgb(23, 32, 51);">全仓库、某个目录，还是仅本次任务？</font>
5. <font style="color:rgb(15, 23, 42);">验证: </font><font style="color:rgb(23, 32, 51);">用什么命令、测试或产物证明完成？</font>
6. <font style="color:rgb(15, 23, 42);">失败处理: </font><font style="color:rgb(23, 32, 51);">缺环境、缺权限或命令失败时怎么报告？</font>

**<font style="color:rgb(100, 116, 139);">候选规则不是直接写成规范，而是先写成记录</font>**

```plain
Evidence: `.github/workflows/ci.yml` runs `make test-api`
Trigger: changes under `apps/api/**`
Action: run `make test-api` from repository root
Scope: API package only
Verification: command exits 0 and test summary is reported
Failure: if test DB is unavailable, stop and report; do not skip
```

<font style="color:rgb(23, 32, 51);">这张卡确认后，真正进入 CLAUDE.md 的可能只剩两行。证据和讨论过程可以留在 PR、Issue 或维护注释里，不必全部占用模型上下文。</font>

### <font style="color:rgb(15, 23, 42);">4.5 最小骨架只规定结构，不预填项目事实</font>
<font style="color:rgb(23, 32, 51);">下面不是可直接提交的模板，而是一个</font>**<font style="color:rgb(15, 23, 42);">输出槽位</font>**<font style="color:rgb(23, 32, 51);">。只填已经确认且会改变行动的内容；没有内容的章节整段删除。</font>

```plain
# CLAUDE.md

## Commands
- <verified command + where to run it>

## Boundaries
- <source of truth / generated path / ownership boundary>

## Change rules
- <when X changes, do Y>

## Verification
- <change type → smallest sufficient check>
- Report failures and skipped checks with reasons.

## Safety / ask first
- <only operations that genuinely require confirmation>
```

:::warning
**<font style="color:rgb(217, 119, 6);">⚠️</font>****<font style="color:rgb(217, 119, 6);"> 未确认内容不能提交</font>**

<font style="color:rgb(23, 32, 51);">尖括号里的示意文字和“按项目情况填写”都不是规则。无法确认就删掉该行并记录问题，不要让 Claude 把示意内容当成真实指令。</font>

:::

### <font style="color:rgb(15, 23, 42);">4.6 同一套方法，会得到完全不同的结果</font>
| **<font style="color:rgb(15, 23, 42);">仓库证据</font>** | **<font style="color:rgb(15, 23, 42);">最终值得保留的规则</font>** | **<font style="color:rgb(15, 23, 42);">不会写入的内容</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">前端仓库由 pnpm scripts 驱动，GraphQL 客户端自动生成</font> | <font style="color:rgb(23, 32, 51);">真实 pnpm 检查命令；schema 是事实来源；生成目录禁止手改</font> | <font style="color:rgb(23, 32, 51);">Python 版本、数据库迁移、通用后端分层建议</font> |
| <font style="color:rgb(23, 32, 51);">Go 服务通过 Makefile 和容器测试，迁移需审批</font> | <font style="color:rgb(23, 32, 51);">Make 入口；测试依赖；迁移前请示；失败报告方式</font> | <font style="color:rgb(23, 32, 51);">前端格式化、个人编辑器习惯、猜测的部署命令</font> |
| <font style="color:rgb(23, 32, 51);">纯文档仓库只有链接检查与拼写检查</font> | <font style="color:rgb(23, 32, 51);">文档构建、链接验证、术语表位置</font> | <font style="color:rgb(23, 32, 51);">单元测试、类型检查、应用架构和生成代码规则</font> |


<font style="color:rgb(23, 32, 51);">这正是旧模板的问题：仓库之间真正共享的内容很少，强行统一只会制造噪声。通用价值应该来自</font>**<font style="color:rgb(15, 23, 42);">发现流程</font>**<font style="color:rgb(23, 32, 51);">，而不是统一答案。</font>

### <font style="color:rgb(15, 23, 42);">4.7 生成第一版后，用三道门验收</font>
1. **<font style="color:rgb(15, 23, 42);">事实门：</font>**<font style="color:rgb(23, 32, 51);">逐条指出证据来源；命令必须实际存在，路径必须真实。</font>
2. **<font style="color:rgb(15, 23, 42);">范围门：</font>**<font style="color:rgb(23, 32, 51);">只对一个包生效的规则下沉；一次性需求移回 Prompt；个人偏好移到用户级或 local。</font>
3. **<font style="color:rgb(15, 23, 42);">行为门：</font>**<font style="color:rgb(23, 32, 51);">运行一个小任务，观察 Claude 是否因此选对文件、命令和验收方式；没有改变行为的句子删除。</font>

:::tip
**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 最终产物</font>**

<font style="color:rgb(23, 32, 51);">不是一份“适合所有项目”的 CLAUDE.md，而是一套可重复的生成流程：</font>**<font style="color:rgb(15, 23, 42);">只读审计 → 核对证据 → 候选规则卡 → 最小骨架 → 真实任务验证</font>**<font style="color:rgb(23, 32, 51);">。项目变了，流程仍然成立，结果自然跟着项目变化。</font>

:::

<!-- 这是一张图片，ocr 内容为：从真实仓库生成最小CLAUDE.MD 最小骨架 5真实任务验证 2核对证据一 只读审计 候选规则卡 真实文件 候选命令 X常识 构建 构建脚本 复述 测试脚本 X模板假设 测试 证据 触发 选对文件 古团团 检查配置 代码检查 命令 跑对命令 动作 范围 边界 给出证据 部署流程 锁文件CI测试脚本 部署 验证 CLAUDE.MD 安全 未知 先不改文件 失败 验证 不从模板猜答案,要从仓库提取证据. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1785462811466-06f67fba-fc49-4996-909f-93d4781b3f75.png)

<font style="color:rgb(23, 32, 51);">规则内容由仓库决定，但内容写对只是第一步：放错目录、没有进入当前会话，效果仍然会像“没写”。作用域、加载机制、Monorepo 分层和排障方法，将在下一篇继续展开。</font>

## 结语：好的 CLAUDE.md，是一张会改变行动的入职卡
回到开头那个问题：Claude Code 为什么会在包管理器、测试入口和生成目录上反复猜错？因为这些信息往往不在某一行代码里，而是藏在团队经验、CI 脚本和事故教训里。

写好 `<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">CLAUDE.md</font>`，不是把仓库说明重新抄一遍，而是完成四次筛选：

+ 从证据出发：命令、路径和边界必须能在仓库或维护者确认中找到依据。
+ 只写不可稳定推导的事实：代码已经说清楚的内容，不必重复消耗上下文。
+ 把要求写成动作：范围、触发条件、验收证据和失败处理，比“注意质量”更有用。
+ 用真实任务验证：规则是否优秀，不看文件多完整，要看它有没有减少一次真实返工。

先从几十行开始。写清怎么安装、怎么测试、哪些文件不能手改、什么情况必须请示。等仓库变大，再讨论规则该放在哪里、何时加载，以及如何在 Monorepo 中避免互相污染。

## <font style="color:rgb(15, 23, 42);">参考资料</font>
+ [<font style="color:rgb(37, 99, 235);">Manage Claude’s memory（CLAUDE.md 指令、Auto memory 笔记、加载、/init、/memory）</font>](https://code.claude.com/docs/en/memory)
+ [<font style="color:rgb(37, 99, 235);">Claude Code settings（含 permissions.allow/deny）</font>](https://code.claude.com/docs/en/settings)
+ [<font style="color:rgb(37, 99, 235);">Hooks reference（生命周期事件）</font>](https://code.claude.com/docs/en/hooks)
+ [<font style="color:rgb(37, 99, 235);">Agent Skills</font>](https://code.claude.com/docs/en/skills)
+ [<font style="color:rgb(37, 99, 235);">Subagents（含 memory frontmatter 与 agent-memory 目录）</font>](https://code.claude.com/docs/en/sub-agents)
+ [<font style="color:rgb(37, 99, 235);">Security</font>](https://code.claude.com/docs/en/security)
+ [<font style="color:rgb(37, 99, 235);">Sandboxing</font>](https://code.claude.com/docs/en/sandboxing)
+ [<font style="color:rgb(37, 99, 235);">Common workflows</font>](https://code.claude.com/docs/en/common-workflows)
+ [<font style="color:rgb(37, 99, 235);">Work with large codebases</font>](https://code.claude.com/docs/en/large-codebases)
+ [<font style="color:rgb(37, 99, 235);">Humanlayer：Writing a good CLAUDE.md（社区写作实践）</font>](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

