---
title: 7、Claude Code 不是终端聊天框：它是会动手的工程 Agent
date: 2026-07-20
tags: ["AI", "Vibe Coding"]
description: 你有没有遇到过这种场景：项目 CI 红了、测试挂了、PR 冲突了、依赖升级炸了，你打开 IDE 准备硬啃，结果半小时过去只定位到“可能是某个配置问题”。这时候很多人会把错误粘进聊天窗口，等 AI 给一段建议。说实话，这已经有点落后了。 Claude Code 的关键变化不是“Claude 变聪明了”…
---

<font style="color:rgb(51, 65, 85);">你有没有遇到过这种场景：项目 CI 红了、测试挂了、PR 冲突了、依赖升级炸了，你打开 IDE 准备硬啃，结果半小时过去只定位到“可能是某个配置问题”。这时候很多人会把错误粘进聊天窗口，等 AI 给一段建议。说实话，这已经有点落后了。</font>

<font style="color:rgb(23, 32, 51);">Claude Code 的关键变化不是“Claude 变聪明了”，而是它直接进入了你的工程现场：</font>**<font style="color:rgb(15, 23, 42);">能读代码、改文件、跑命令、看 diff、接 MCP、记住项目习惯、调用技能、甚至让多个 Agent 并行干活。</font>**<font style="color:rgb(23, 32, 51);">说人话就是：以前你在问一个远程顾问；现在你旁边多了一个会开终端的搭档。</font>

<!-- 这是一张图片，ocr 内容为：读代码 01 02 03 改文件 04 05 05 } 进入工程现场 只给建议 看结果 跑测试 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537052333-e72eb89c-cb35-417c-9597-46e8b9215258-1784548878977-1.png)

## <font style="color:rgb(15, 23, 42);">一、Claude Code 到底是什么：不是“CLI 版聊天机器人”</font>
<font style="color:rgb(23, 32, 51);">一句话定义：</font>**<font style="color:rgb(15, 23, 42);">Claude Code 是 Anthropic 官方的 agentic coding tool，它能在开发环境里读取代码库、编辑文件、运行命令，并和 IDE、桌面端、Web、CI/CD、Slack、MCP 工具链打通。</font>**

<font style="color:rgb(23, 32, 51);">这个定义听起来有点官方，我们换个生活类比：普通聊天式 AI 像“你给同事发截图问怎么修”；Claude Code 像“同事坐到你工位旁边，能翻项目、能跑测试、能改代码、能写 PR 描述”。差别大不大？非常大。因为软件工程不是问答题，它是</font>**<font style="color:rgb(15, 23, 42);">一串可验证的动作</font>**<font style="color:rgb(23, 32, 51);">。</font>

| **<font style="color:rgb(15, 23, 42);">使用方式</font>** | **<font style="color:rgb(15, 23, 42);">你在做什么</font>** | **<font style="color:rgb(15, 23, 42);">AI 能做到哪一步</font>** | **<font style="color:rgb(15, 23, 42);">风险点</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">对话助手</font> | <font style="color:rgb(23, 32, 51);">复制代码 / 错误 / 日志</font> | <font style="color:rgb(23, 32, 51);">给建议、写片段</font> | <font style="color:rgb(23, 32, 51);">上下文缺失，容易“看起来对”</font> |
| <font style="color:rgb(23, 32, 51);">IDE 插件</font> | <font style="color:rgb(23, 32, 51);">在文件里补全、局部修改</font> | <font style="color:rgb(23, 32, 51);">理解当前文件和部分项目</font> | <font style="color:rgb(23, 32, 51);">容易停留在补全器心智</font> |
| **<font style="color:rgb(15, 23, 42);">Claude Code</font>** | <font style="color:rgb(23, 32, 51);">把任务交给工程 Agent</font> | <font style="color:rgb(23, 32, 51);">读库、改文件、跑命令、验证、提交</font> | <font style="color:rgb(23, 32, 51);">权限边界、不可逆操作、过度信任</font> |


### <font style="color:rgb(15, 23, 42);">1.1 Claude Code 整体架构：一套围绕项目运行的工程系统</font>
<font style="color:rgb(23, 32, 51);">如果把 Claude Code 只理解成“会聊天的终端工具”，你就会低估它。更准确的架构视角是：</font>**<font style="color:rgb(15, 23, 42);">Claude Code 是一个围绕当前代码库运行的工程系统</font>**<font style="color:rgb(23, 32, 51);">。它不是单个模型，也不是单个插件，而是把入口、上下文、Agent Loop、工具、权限、外部集成和交付结果串成一条链。</font>

| **<font style="color:rgb(15, 23, 42);">架构层</font>** | **<font style="color:rgb(15, 23, 42);">职责</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目中的例子</font>** | **<font style="color:rgb(15, 23, 42);">输出什么</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">入口层</font> | <font style="color:rgb(23, 32, 51);">接收任务、选择工作界面</font> | <font style="color:rgb(23, 32, 51);">Terminal、Cursor 扩展、VS Code、Web、GitHub Action</font> | <font style="color:rgb(23, 32, 51);">一个任务会话</font> |
| <font style="color:rgb(23, 32, 51);">上下文层</font> | <font style="color:rgb(23, 32, 51);">装配项目事实和当前证据</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">.claude/rules</font>`<br/><font style="color:rgb(23, 32, 51);">、Memory、选中文件、测试日志</font> | <font style="color:rgb(23, 32, 51);">当前任务的局部地图</font> |
| <font style="color:rgb(23, 32, 51);">推理层</font> | <font style="color:rgb(23, 32, 51);">理解目标、拆解步骤、生成计划</font> | <font style="color:rgb(23, 32, 51);">判断 FastAPI 路由、Pydantic schema、service/repo 边界</font> | <font style="color:rgb(23, 32, 51);">计划、疑问、修改策略</font> |
| <font style="color:rgb(23, 32, 51);">Agent Loop</font> | <font style="color:rgb(23, 32, 51);">观察、行动、验证、修复、交付</font> | <font style="color:rgb(23, 32, 51);">Read → Edit → pytest → diff → 再修复</font> | <font style="color:rgb(23, 32, 51);">逐轮收敛的结果</font> |
| <font style="color:rgb(23, 32, 51);">工具层</font> | <font style="color:rgb(23, 32, 51);">执行真实操作</font> | <font style="color:rgb(23, 32, 51);">Read、Grep、Bash、Git、MCP、Web、Hooks</font> | <font style="color:rgb(23, 32, 51);">文件、命令结果、外部系统数据</font> |
| <font style="color:rgb(23, 32, 51);">治理层</font> | <font style="color:rgb(23, 32, 51);">限制风险动作</font> | <font style="color:rgb(23, 32, 51);">permission mode、deny 规则、Auto Mode、确认弹窗</font> | <font style="color:rgb(23, 32, 51);">自动/确认/拒绝</font> |
| <font style="color:rgb(23, 32, 51);">交付层</font> | <font style="color:rgb(23, 32, 51);">输出 diff、测试和说明</font> | <font style="color:rgb(23, 32, 51);">git diff、测试报告、PR 描述、commit</font> | <font style="color:rgb(23, 32, 51);">可审查的工程产物</font> |

<!-- 这是一张图片，ocr 内容为：00 循环执行 任务入口 权限治理 理解与计划 验证交付 装配上下文 调用工具 能力来自系统,不只来自模型 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537082664-d42fe47c-3ed4-4863-8174-c29d926b63b6-1784548878977-3.png)

<font style="color:rgb(23, 32, 51);">这个架构解释了为什么 Claude Code 不是“更聪明的补全器”。补全器只关心当前行，Claude Code 关心的是：当前目标是什么、项目约定是什么、哪里能改、改完如何证明正确、哪里必须停下来问人。它的能力来自架构，不只是来自模型本身。</font>

### <font style="color:rgb(15, 23, 42);">1.2 Claude Code 能力地图：它到底能在哪些环节帮你</font>
<font style="color:rgb(23, 32, 51);">能力地图的作用，是把“Claude Code 很强”这种模糊印象，拆成可用、可控、可验证的工程能力。对 Python 项目来说，最实用的是按任务阶段来看，而不是按功能宣传语来看。</font>

| **<font style="color:rgb(15, 23, 42);">能力域</font>** | **<font style="color:rgb(15, 23, 42);">Claude Code 能做什么</font>** | **<font style="color:rgb(15, 23, 42);">常用工具</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目例子</font>** | **<font style="color:rgb(15, 23, 42);">不适合什么</font>** |
| :--- | :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">代码库理解</font> | <font style="color:rgb(23, 32, 51);">定位入口、调用链、相似实现、依赖关系</font> | <font style="color:rgb(23, 32, 51);">Grep / Glob / Read</font> | <font style="color:rgb(23, 32, 51);">搜索</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">TaskCreate</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">create_task</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">TaskOut</font>` | <font style="color:rgb(23, 32, 51);">替代你做业务判断</font> |
| <font style="color:rgb(23, 32, 51);">需求拆解</font> | <font style="color:rgb(23, 32, 51);">把模糊目标拆成 Scope、Non-goal、验收项</font> | <font style="color:rgb(23, 32, 51);">Chat / Plan</font> | <font style="color:rgb(23, 32, 51);">把“修复 422”拆成 schema、测试、风险、停止条件</font> | <font style="color:rgb(23, 32, 51);">在没有 Spec 时直接开改</font> |
| <font style="color:rgb(23, 32, 51);">代码修改</font> | <font style="color:rgb(23, 32, 51);">小步编辑、局部重构、生成补丁</font> | <font style="color:rgb(23, 32, 51);">Edit / Write</font> | <font style="color:rgb(23, 32, 51);">修改 Pydantic 校验、FastAPI 路由、service 层逻辑</font> | <font style="color:rgb(23, 32, 51);">大范围无约束重写</font> |
| <font style="color:rgb(23, 32, 51);">验证与回归</font> | <font style="color:rgb(23, 32, 51);">跑测试、看日志、修失败点</font> | <font style="color:rgb(23, 32, 51);">Bash / pytest / ruff / mypy</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">uv run pytest tests/api/test_tasks.py</font>` | <font style="color:rgb(23, 32, 51);">用总结代替测试</font> |
| <font style="color:rgb(23, 32, 51);">审查与交付</font> | <font style="color:rgb(23, 32, 51);">输出 diff 说明、风险、剩余问题</font> | <font style="color:rgb(23, 32, 51);">git diff / summary</font> | <font style="color:rgb(23, 32, 51);">列出 changed files、root cause、verification</font> | <font style="color:rgb(23, 32, 51);">只给一段“已修复”口头结论</font> |
| <font style="color:rgb(23, 32, 51);">外部集成</font> | <font style="color:rgb(23, 32, 51);">连接 issue、监控、数据库、文档系统</font> | <font style="color:rgb(23, 32, 51);">MCP</font> | <font style="color:rgb(23, 32, 51);">读取 Sentry 错误、Jira issue、只读数据库摘要</font> | <font style="color:rgb(23, 32, 51);">把外部系统当成高权限直连通道</font> |
| <font style="color:rgb(23, 32, 51);">协作编排</font> | <font style="color:rgb(23, 32, 51);">分配子任务、隔离上下文、并行扫描</font> | <font style="color:rgb(23, 32, 51);">Subagents / Skills</font> | <font style="color:rgb(23, 32, 51);">子 Agent 扫描全部调用方，主 Agent 只看摘要</font> | <font style="color:rgb(23, 32, 51);">无边界 fan-out</font> |
| <font style="color:rgb(23, 32, 51);">安全治理</font> | <font style="color:rgb(23, 32, 51);">控制自动执行范围</font> | <font style="color:rgb(23, 32, 51);">Permissions / Hooks / Settings</font> | <font style="color:rgb(23, 32, 51);">禁止删库、禁写生产、要求高风险操作确认</font> | <font style="color:rgb(23, 32, 51);">把权限默认全开</font> |


:::info
**<font style="color:rgb(37, 99, 235);">💡</font>****<font style="color:rgb(37, 99, 235);"> 能力地图的核心结论</font>**

<font style="color:rgb(23, 32, 51);">Claude Code 的价值不是“会不会写”，而是</font>**<font style="color:rgb(15, 23, 42);">能不能在受控边界内完成一轮工程任务</font>**<font style="color:rgb(23, 32, 51);">。如果它只能生成代码片段，那只是写作工具；如果它能读上下文、动手修改、跑验证、输出 diff、接受审查，才配叫工程 Agent。</font>

:::

<font style="color:rgb(23, 32, 51);">看出来了吗？Claude Code 真正的价值不在“会写代码”，而在“能把写代码前后的工程动作串起来”。写一个函数只是其中一步；定位、修改、测试、审查、提交、复盘，才是完整工作流。</font>

<!-- 这是一张图片，ocr 内容为：持续闭环 代码库上下文 工具系统 -0T 工程AGENT 规则与记忆 验证与交付 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547553206-c8635108-07f0-4146-a18f-d389a95c93f9-1784548878977-5.png)

<font style="color:rgb(100, 116, 139);">Claude Code 的工程 Agent 闭环。它不是单点补全，而是围绕代码库持续行动。</font>

## <font style="color:rgb(15, 23, 42);">二、安装与启动：不要只背“npm 全局安装”</font>
<font style="color:rgb(23, 32, 51);">很多教程还停留在一句 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">npm install -g @anthropic-ai/claude-code</font>`<font style="color:rgb(23, 32, 51);">。这在历史上有意义，但现在的 Claude Code 官方入口已经更丰富：终端原生安装、Homebrew、WinGet、VS Code / Cursor 扩展、JetBrains 插件、Desktop App、Web 和 iOS 都是常见入口。</font>

:::warning
**<font style="color:rgb(217, 119, 6);">⚠️</font>****<font style="color:rgb(217, 119, 6);"> 注意：安装方式会影响升级行为</font>**

<font style="color:rgb(23, 32, 51);">官方文档推荐 Native Install，因为它会自动后台更新；Homebrew 和 WinGet 需要你自己定期升级。团队环境里，这不是小事——安全补丁、权限策略、MCP 行为都可能跟版本相关。</font>

:::

#### <font style="color:rgb(15, 23, 42);">🖥️</font><font style="color:rgb(15, 23, 42);"> macOS / Linux / WSL</font>
```bash
curl -fsSL https://claude.ai/install.sh | bash
cd your-project
claude
```

#### <font style="color:rgb(15, 23, 42);">🪟</font><font style="color:rgb(15, 23, 42);"> Windows PowerShell</font>
```bash
irm https://claude.ai/install.ps1 | iex
cd your-project
claude
```

windows CMD安装

```bash
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

<font style="color:rgb(23, 32, 51);">Windows 用户要多记一个细节：原生 Windows 上建议安装 Git for Windows，这样 Claude Code 的 Bash 工具体验会更接近 Unix 环境；没有 Git for Windows 时，它会退到 PowerShell 作为 shell 工具。WSL 用户则天然更适合跑类 Linux 工程链路。</font>

| **<font style="color:rgb(15, 23, 42);">入口</font>** | **<font style="color:rgb(15, 23, 42);">适合谁</font>** | **<font style="color:rgb(15, 23, 42);">典型动作</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">Terminal CLI</font> | <font style="color:rgb(23, 32, 51);">重度工程师、DevOps、后端、CLI 爱好者</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">claude</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">交互、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">claude -p</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">脚本化、管道处理日志</font> |
| <font style="color:rgb(23, 32, 51);">VS Code / Cursor</font> | <font style="color:rgb(23, 32, 51);">IDE 流用户</font> | <font style="color:rgb(23, 32, 51);">内联 diff、@ 引用、计划审查、文件选择上下文</font> |
| <font style="color:rgb(23, 32, 51);">JetBrains</font> | <font style="color:rgb(23, 32, 51);">Java / Kotlin / Python / WebStorm 用户</font> | <font style="color:rgb(23, 32, 51);">共享选择上下文、可视化 diff</font> |
| <font style="color:rgb(23, 32, 51);">Desktop App</font> | <font style="color:rgb(23, 32, 51);">需要多会话、可视化审查、定时任务的人</font> | <font style="color:rgb(23, 32, 51);">并排跑任务、视觉 diff、调度任务</font> |
| <font style="color:rgb(23, 32, 51);">Web / iOS</font> | <font style="color:rgb(23, 32, 51);">远程启动长任务、移动端跟进</font> | <font style="color:rgb(23, 32, 51);">云端任务、浏览器工作、Teleport 拉回终端</font> |

<!-- 这是一张图片，ocr 内容为：00 //V 终端 IDE //V 00 000 0-0-0 同一代码库 桌面端 WEB CI/CD -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537116336-9b056704-225f-41d4-8658-950f7494ebae-1784548878977-7.png)

<font style="color:rgb(23, 32, 51);">所以别把 Claude Code 理解成“一个 npm 包”。它更像一套跨终端、IDE、桌面、Web、CI、聊天系统的工程操作层。终端只是最硬核、最透明的入口。</font>

## <font style="color:rgb(15, 23, 42);">三、终端 Agent 的五层心智模型：从“问答”升级到“工程操作系统”</font>
<font style="color:rgb(23, 32, 51);">学习 Claude Code，最怕只学命令。命令今天叫 A，明天入口换成 B，知识就废了。真正稳定的是心智模型。</font>

<font style="color:rgb(23, 32, 51);">建议把 Claude Code 拆成五层：</font>**<font style="color:rgb(15, 23, 42);">模型层、上下文层、工具层、编排层、安全层</font>**<font style="color:rgb(23, 32, 51);">。像一家公司：模型是脑子，上下文是档案室，工具是手脚，编排是项目经理，安全层是法务和门禁。少任何一层都不行。</font>

<!-- 这是一张图片，ocr 内容为：模型层 越往下越像工程底座 上下文层 1208 工具层 编排层 同自 安全层 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547591715-4a4ca800-251c-4386-a935-63412f886c47-1784548878978-9.png)

<font style="color:rgb(100, 116, 139);">Claude Code 不是单一工具，而是模型、上下文、工具、编排、安全五层叠起来的系统。</font>

### <font style="color:rgb(15, 23, 42);">3.1 模型层：模型负责推理，但它不是完整工程系统</font>
<font style="color:rgb(23, 32, 51);">模型层决定 Claude Code 的基础能力：理解自然语言、分析代码、生成补丁、解释错误、总结方案。Anthropic 当前主力 Claude 模型大致可以理解为：</font>**<font style="color:rgb(15, 23, 42);">更强推理模型适合复杂架构和高风险修改，更快模型适合摘要、分类、简单解释和低风险自动化</font>**<font style="color:rgb(23, 32, 51);">。但在 Claude Code 里，不要把“模型强”误解成“可以省掉工程流程”。</font>

| **<font style="color:rgb(15, 23, 42);">任务类型</font>** | **<font style="color:rgb(15, 23, 42);">模型层真正负责什么</font>** | **<font style="color:rgb(15, 23, 42);">仍然需要工程系统兜底什么</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">解释代码</font> | <font style="color:rgb(23, 32, 51);">阅读上下文并形成解释</font> | <font style="color:rgb(23, 32, 51);">上下文是否完整、解释是否符合实际运行结果</font> |
| <font style="color:rgb(23, 32, 51);">生成代码</font> | <font style="color:rgb(23, 32, 51);">根据目标和约束生成实现</font> | <font style="color:rgb(23, 32, 51);">Diff Review、类型检查、测试和回归验证</font> |
| <font style="color:rgb(23, 32, 51);">跨文件重构</font> | <font style="color:rgb(23, 32, 51);">推理影响面并提出修改计划</font> | <font style="color:rgb(23, 32, 51);">任务切片、回滚边界、逐步合并</font> |
| <font style="color:rgb(23, 32, 51);">疑难 Debug</font> | <font style="color:rgb(23, 32, 51);">分析日志、提出假设、建议验证路径</font> | <font style="color:rgb(23, 32, 51);">真实运行、最小复现、观测数据和人工判断</font> |


<font style="color:rgb(23, 32, 51);">所以模型层的正确心智是：</font>**<font style="color:rgb(15, 23, 42);">它是大脑，不是项目事实本身；它能推理，但不能替代上下文、工具和验证。</font>**<font style="color:rgb(23, 32, 51);">你给错事实，它会认真地推错；你不给边界，它会认真地越界。</font>

### <font style="color:rgb(15, 23, 42);">3.2 上下文层：Claude Code 为什么能“像在项目里工作”</font>
<font style="color:rgb(23, 32, 51);">普通聊天工具主要依赖你粘贴上下文；Claude Code 运行在项目目录里，可以围绕当前仓库组织上下文。它能读取文件、搜索代码、参考</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);">、使用 Memory、结合会话历史和终端输出，再把这些材料交给模型推理。</font>

#### <font style="color:rgb(15, 23, 42);">📄</font><font style="color:rgb(15, 23, 42);"> CLAUDE.md</font>
<font style="color:rgb(23, 32, 51);">项目级说明书。放架构分层、常用命令、测试策略、禁止修改的目录、团队约定。它相当于“团队给 Claude 的入职文档”。</font>

#### <font style="color:rgb(15, 23, 42);">🧠</font><font style="color:rgb(15, 23, 42);"> Memory</font>
<font style="color:rgb(23, 32, 51);">跨会话偏好和经验。适合记录稳定但不一定属于代码库的事实，例如“回答保持简短”“发布前必须跑 smoke”。</font>

#### <font style="color:rgb(15, 23, 42);">🧩</font><font style="color:rgb(15, 23, 42);"> Skills</font>
<font style="color:rgb(23, 32, 51);">可复用流程。把重复三次以上的操作封成</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">SKILL.md</font>`<font style="color:rgb(23, 32, 51);">，例如发布检查、迁移审查、API 文档生成。</font>

#### <font style="color:rgb(15, 23, 42);">🔌</font><font style="color:rgb(15, 23, 42);"> MCP</font>
<font style="color:rgb(23, 32, 51);">外部系统上下文。GitHub、Jira、数据库、监控、设计稿、内部文档都可以通过 MCP 进入受控工具链。</font>

<font style="color:rgb(23, 32, 51);">上下文层最重要的不是“越多越好”，而是“刚好够用”。</font>

<font style="color:rgb(23, 32, 51);">一个工程任务通常需要这几类上下文：</font>

<!-- 这是一张图片，ocr 内容为：任务目标 项目规则 代码证据 运行证据 验证计划 火 无关噪声 刚好够用 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537160267-471276c7-cbf3-4a8b-9361-8dee1cac0b25-1784548878978-11.png)

<font style="color:rgb(23, 32, 51);">如果上下文不足，Claude Code 会猜；如果上下文太杂，它会被噪音污染。成熟用法是先让它</font>**<font style="color:rgb(15, 23, 42);">调查并列出证据</font>**<font style="color:rgb(23, 32, 51);">，再批准它修改。</font>

### <font style="color:rgb(15, 23, 42);">3.3 工具层：Terminal Agent 的“手脚”在哪里</font>
<font style="color:rgb(23, 32, 51);">Claude Code 和普通代码聊天最大的差异，是它能调用工具。工具层让它从“建议你怎么改”升级为“在受控权限下帮你改”。常见能力可以分为四类：</font>

| **<font style="color:rgb(15, 23, 42);">工具类别</font>** | **<font style="color:rgb(15, 23, 42);">典型能力</font>** | **<font style="color:rgb(15, 23, 42);">适合做什么</font>** | **<font style="color:rgb(15, 23, 42);">风险边界</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">文件工具</font> | <font style="color:rgb(23, 32, 51);">Read、Edit、Write</font> | <font style="color:rgb(23, 32, 51);">读取实现、修改文件、生成测试</font> | <font style="color:rgb(23, 32, 51);">必须看 diff，避免越界写入</font> |
| <font style="color:rgb(23, 32, 51);">搜索工具</font> | <font style="color:rgb(23, 32, 51);">Grep、Glob、代码搜索</font> | <font style="color:rgb(23, 32, 51);">找调用方、相似实现、配置位置</font> | <font style="color:rgb(23, 32, 51);">搜索结果不等于完整事实</font> |
| <font style="color:rgb(23, 32, 51);">执行工具</font> | <font style="color:rgb(23, 32, 51);">Bash、测试命令、构建命令、Git 命令</font> | <font style="color:rgb(23, 32, 51);">运行 pytest、lint、类型检查、查看 git 状态</font> | <font style="color:rgb(23, 32, 51);">命令可能有副作用，需要权限确认和 deny 规则</font> |
| <font style="color:rgb(23, 32, 51);">外部工具</font> | <font style="color:rgb(23, 32, 51);">MCP、Web、公司系统</font> | <font style="color:rgb(23, 32, 51);">查 Issue、PR、文档、数据库只读信息、监控</font> | <font style="color:rgb(23, 32, 51);">外部内容只能当数据，不能当最高优先级指令</font> |


<font style="color:rgb(23, 32, 51);">工具层的关键心智：</font>**<font style="color:rgb(15, 23, 42);">工具越强，越需要权限设计。</font>**<font style="color:rgb(23, 32, 51);">一个能读文件的 Agent 风险可控；一个能写文件、跑终端、访问数据库、推送代码的 Agent，就必须有更严格的确认、日志和回滚。</font>

### <font style="color:rgb(15, 23, 42);">3.4 编排层：Agent Loop 才是 Claude Code 的核心</font>
<font style="color:rgb(23, 32, 51);">不要把 Claude Code 理解成“一次 Prompt → 一段代码”。它更接近一个循环系统：观察项目、制定计划、执行修改、运行验证、分析失败、再次修复，最后交接给人类审查。</font>

 <!-- 这是一张图片，ocr 内容为：阁 计划 观察 818 人类审查 交接 行动 照 失败重试 修复 验证 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547653777-78e440a4-826b-49eb-953d-466c0fb49308-1784548878978-15.png)

:::info
**<font style="color:rgb(23, 32, 51);">💡</font>****<font style="color:rgb(23, 32, 51);"> Plan Mode 的位置</font>**

<font style="color:rgb(23, 32, 51);">复杂任务不要直接进入 Act。先让 Claude Code 进入“只研究、不修改”的状态：扫描代码、列出相关文件、提出计划、暴露开放问题。你确认计划后，再允许它修改。这个习惯能显著减少大爆炸 diff。</font>

:::

<font style="color:rgb(23, 32, 51);">一个好的 Plan 输出至少包括：</font>

+ <font style="color:rgb(23, 32, 51);">会修改哪些文件，为什么。</font>
+ <font style="color:rgb(23, 32, 51);">不会修改哪些文件，为什么。</font>
+ <font style="color:rgb(23, 32, 51);">实现顺序是什么。</font>
+ <font style="color:rgb(23, 32, 51);">需要运行哪些验证命令。</font>
+ <font style="color:rgb(23, 32, 51);">有哪些风险和开放问题需要人确认。</font>

### <font style="color:rgb(15, 23, 42);">3.5 安全层：终端 Agent 的边界必须显式设计</font>
<font style="color:rgb(23, 32, 51);">Claude Code 运行在终端里，这意味着它离真实工程环境很近：能读项目、能改文件、能跑命令、能接外部系统。它越有用，越需要刹车。安全层至少包括四件事：</font>

| **<font style="color:rgb(15, 23, 42);">安全机制</font>** | **<font style="color:rgb(15, 23, 42);">解决什么问题</font>** | **<font style="color:rgb(15, 23, 42);">建议</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">权限确认</font> | <font style="color:rgb(23, 32, 51);">防止高风险命令或写入自动执行</font> | <font style="color:rgb(23, 32, 51);">对删除、迁移、推送、生产访问保持人工确认</font> |
| <font style="color:rgb(23, 32, 51);">deny / allow 规则</font> | <font style="color:rgb(23, 32, 51);">限制命令、路径和工具范围</font> | <font style="color:rgb(23, 32, 51);">默认最小权限，敏感目录和密钥文件禁止读取</font> |
| <font style="color:rgb(23, 32, 51);">Hooks</font> | <font style="color:rgb(23, 32, 51);">在关键动作前后执行自动检查</font> | <font style="color:rgb(23, 32, 51);">写入后跑格式检查，提交前跑测试或安全扫描</font> |
| <font style="color:rgb(23, 32, 51);">审计与回滚</font> | <font style="color:rgb(23, 32, 51);">知道 Agent 做过什么，并能恢复</font> | <font style="color:rgb(23, 32, 51);">看 diff、用 git 管理、保留命令输出和验证记录</font> |


<font style="color:rgb(23, 32, 51);">这里的关键不是“把 Agent 限死”，而是</font>**<font style="color:rgb(15, 23, 42);">把风险动作变成显式决策点</font>**<font style="color:rgb(23, 32, 51);">。写普通测试可以自动化；删库、改迁移、改权限、推送代码、访问生产数据，必须停下来让人确认。</font>

### <font style="color:rgb(15, 23, 42);">3.6 把五层合起来看：一个 Python 任务如何流转</font>
<font style="color:rgb(23, 32, 51);">以“修复 FastAPI 项目中</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">POST /tasks</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">的 422 测试失败”为例，五层会这样协同：</font>

| **<font style="color:rgb(15, 23, 42);">层级</font>** | **<font style="color:rgb(15, 23, 42);">Claude Code 做什么</font>** | **<font style="color:rgb(15, 23, 42);">你要检查什么</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">模型层</font> | <font style="color:rgb(23, 32, 51);">理解失败日志，推断可能是 Pydantic schema 或路由校验问题</font> | <font style="color:rgb(23, 32, 51);">推断是否有证据，不要接受空泛结论</font> |
| <font style="color:rgb(23, 32, 51);">上下文层</font> | <font style="color:rgb(23, 32, 51);">读取</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">api/tasks.py</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">schemas/task.py</font>`<br/><font style="color:rgb(23, 32, 51);">、失败测试和</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>` | <font style="color:rgb(23, 32, 51);">是否漏掉 fixture、异常处理器或全局路由配置</font> |
| <font style="color:rgb(23, 32, 51);">工具层</font> | <font style="color:rgb(23, 32, 51);">用 Grep 找相关测试，用 Bash 跑单测，用 Edit 修改 schema</font> | <font style="color:rgb(23, 32, 51);">命令是否安全，修改是否在 Scope 内</font> |
| <font style="color:rgb(23, 32, 51);">编排层</font> | <font style="color:rgb(23, 32, 51);">先计划，再修改，再运行测试，根据失败继续修</font> | <font style="color:rgb(23, 32, 51);">是否一步一步收敛，而不是到处乱改</font> |
| <font style="color:rgb(23, 32, 51);">安全层</font> | <font style="color:rgb(23, 32, 51);">遇到迁移、依赖、删除文件时请求确认</font> | <font style="color:rgb(23, 32, 51);">高风险动作是否被拦住，diff 是否可回滚</font> |


**<font style="color:rgb(15, 23, 42);">Claude Code 的能力不在“会回答”，而在“能在安全边界内循环执行工程动作”。</font>**<font style="color:rgb(23, 32, 51);">下一章我们就拆开工具调用，看它为什么能真的干活。</font>

## <font style="color:rgb(15, 23, 42);">四、工具调用：它为什么能“真的干活”</font>
<font style="color:rgb(23, 32, 51);">普通 LLM 只能回答问题；Claude Code 会调用工具。这个差别像“顾问”和“能坐到你电脑前干活的同事”。但工具调用不是魔法，更不是让模型获得无限权限。它的本质是一个闭环：</font>**<font style="color:rgb(15, 23, 42);">Claude 先收集上下文，再选择工具行动，工具返回结果，Claude 根据结果继续判断</font>**<font style="color:rgb(23, 32, 51);">。</font>

:::info
**<font style="color:rgb(37, 99, 235);">💡</font>****<font style="color:rgb(37, 99, 235);"> 官方心智模型：gather context → take action → verify results</font>**

<font style="color:rgb(23, 32, 51);">按照当前 Claude Code 官方文档，Agentic Loop 可以概括为三件事：收集上下文、采取行动、验证结果。工具调用贯穿这三步：搜索文件是上下文，编辑文件是行动，运行测试是验证。真正会用的人，不是让 Claude 一次性“写完”，而是让它围绕工具结果持续收敛。</font>

:::

### <font style="color:rgb(15, 23, 42);">4.1 工具分类：Claude Code 的“手脚”分成几类</font>
<font style="color:rgb(23, 32, 51);">Claude Code 内置工具可以按工程用途拆成六类。具体工具名和可用性会随版本、权限、平台变化，但这六类心智模型比较稳定：</font>

| **<font style="color:rgb(15, 23, 42);">工具类别</font>** | **<font style="color:rgb(15, 23, 42);">典型能力</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目场景</font>** | **<font style="color:rgb(15, 23, 42);">安全要点</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">文件操作</font> | <font style="color:rgb(23, 32, 51);">Read / Edit / Write / Rename</font> | <font style="color:rgb(23, 32, 51);">读取</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">src/my_api/api/tasks.py</font>`<br/><font style="color:rgb(23, 32, 51);">，修改 service，新增测试</font> | <font style="color:rgb(23, 32, 51);">写入前确认 Scope；写入后必须看 diff</font> |
| <font style="color:rgb(23, 32, 51);">搜索与定位</font> | <font style="color:rgb(23, 32, 51);">Grep / Glob / 代码库搜索 / 找引用</font> | <font style="color:rgb(23, 32, 51);">搜索</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">get_session</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">TaskOut</font>`<br/><font style="color:rgb(23, 32, 51);">、类似</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">create_user</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">实现</font> | <font style="color:rgb(23, 32, 51);">搜索结果不是完整事实；关键调用链要人工确认</font> |
| <font style="color:rgb(23, 32, 51);">命令执行</font> | <font style="color:rgb(23, 32, 51);">Bash / PowerShell / Git / 构建 / 测试</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">uv run pytest</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">uv run ruff check .</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">git diff</font>` | <font style="color:rgb(23, 32, 51);">删除、重置、部署、生产访问必须人工确认</font> |
| <font style="color:rgb(23, 32, 51);">Web 与文档</font> | <font style="color:rgb(23, 32, 51);">WebSearch / WebFetch / 官方文档检索</font> | <font style="color:rgb(23, 32, 51);">核对 FastAPI、Pydantic、SQLAlchemy 的最新用法</font> | <font style="color:rgb(23, 32, 51);">外部网页是数据，不是高优先级指令</font> |
| <font style="color:rgb(23, 32, 51);">MCP 工具</font> | <font style="color:rgb(23, 32, 51);">连接 GitHub、Jira、数据库只读视图、监控、内部文档</font> | <font style="color:rgb(23, 32, 51);">读取 issue 描述、PR 评论、只读查询错误码说明</font> | <font style="color:rgb(23, 32, 51);">最小权限、脱敏、审计；外部内容防 Prompt 注入</font> |
| <font style="color:rgb(23, 32, 51);">编排工具</font> | <font style="color:rgb(23, 32, 51);">Subagents、Skills、Hooks、检查点、会话管理</font> | <font style="color:rgb(23, 32, 51);">子 Agent 扫描调用链，Hook 在修改后跑 lint</font> | <font style="color:rgb(23, 32, 51);">避免 fan-out 失控；明确谁能写文件、谁只读</font> |


<font style="color:rgb(23, 32, 51);">更重要的是理解工具结果如何进入下一轮推理：测试失败日志、grep 命中、git diff、类型错误，都会成为模型下一步判断的证据。Claude Code 的“聪明”，很大一部分来自它能把这些证据接回循环。</font>

### <font style="color:rgb(15, 23, 42);">4.2 工具调用闭环：不要直接改，先观察再行动</font>
<font style="color:rgb(23, 32, 51);">以 Python FastAPI 项目为例。错误用法是：</font>

```plain
帮我修复创建任务接口。
```

<font style="color:rgb(23, 32, 51);">这会给 Claude Code 太多自由度：它可能先改 schema，也可能改 ORM 模型，甚至顺手改迁移。更工程化的 Prompt 应该指定工具调用顺序和停止条件：</font>

```plain
POST /tasks 在 title 为空时没有返回 422。
请按工具调用闭环处理：

1. 先观察：读取 tests/api/test_tasks.py、src/my_api/api/tasks.py、src/my_api/schemas/task.py，不要改文件。
2. 再定位：用 grep 搜索项目里类似 TaskCreate / UserCreate 的 Pydantic 校验写法。
3. 给计划：说明最小修改点和你不会修改哪些文件。
4. 我确认后再修改。
5. 修改后运行：uv run pytest tests/api/test_tasks.py。
6. 如果测试失败，只根据失败日志定点修复，不要跳过测试或放宽断言。
7. 最终输出：修改文件、根因、验证命令、未验证风险。

如果需要改 ORM model、alembic migration、依赖或全局错误处理，先停止并问我。
```

<font style="color:rgb(23, 32, 51);">这段 Prompt 的价值不在“礼貌”，而是给工具调用加上工程协议：</font>**<font style="color:rgb(15, 23, 42);">Read/Grep 用来找证据，Edit/Write 用来做最小修改，Bash 用来验证，Diff 用来审查，Ask User 用来处理高风险分叉。</font>**

<!-- 这是一张图片，ocr 内容为：计划 国Q 行动 观察 审查交付 证据回流 验证 人民国 失败重试 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547694848-9d3b17bf-ac75-4bba-a3b8-51de2a068a27-1784548878978-13.png)

### <font style="color:rgb(15, 23, 42);">4.3 Python 实战：修复一个 422 校验失败</font>
<font style="color:rgb(23, 32, 51);">假设当前测试失败：</font>

```plain
FAILED tests/api/test_tasks.py::test_create_task_rejects_empty_title
E   AssertionError: assert 201 == 422
```

<font style="color:rgb(23, 32, 51);">Claude Code 的理想工具轨迹应该像这样：</font>

| **<font style="color:rgb(15, 23, 42);">步骤</font>** | **<font style="color:rgb(15, 23, 42);">工具动作</font>** | **<font style="color:rgb(15, 23, 42);">目标</font>** | **<font style="color:rgb(15, 23, 42);">你要检查什么</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">1</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">Read tests/api/test_tasks.py</font>` | <font style="color:rgb(23, 32, 51);">确认测试期望和请求 payload</font> | <font style="color:rgb(23, 32, 51);">测试是否合理，不要为了通过而放宽断言</font> |
| <font style="color:rgb(23, 32, 51);">2</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">Read src/my_api/schemas/task.py</font>` | <font style="color:rgb(23, 32, 51);">查看</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">TaskCreate</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">是否有</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">min_length</font>` | <font style="color:rgb(23, 32, 51);">是否用 Pydantic v2 写法</font> |
| <font style="color:rgb(23, 32, 51);">3</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">Grep "Field(" src/my_api</font>` | <font style="color:rgb(23, 32, 51);">找项目已有校验风格</font> | <font style="color:rgb(23, 32, 51);">是否复用项目模式，而不是自造格式</font> |
| <font style="color:rgb(23, 32, 51);">4</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">Edit schemas/task.py</font>` | <font style="color:rgb(23, 32, 51);">做最小修改</font> | <font style="color:rgb(23, 32, 51);">是否只改 schema，不动无关文件</font> |
| <font style="color:rgb(23, 32, 51);">5</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">uv run pytest tests/api/test_tasks.py</font>` | <font style="color:rgb(23, 32, 51);">验证行为</font> | <font style="color:rgb(23, 32, 51);">失败日志是否回灌，而不是跳过测试</font> |
| <font style="color:rgb(23, 32, 51);">6</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">git diff</font>` | <font style="color:rgb(23, 32, 51);">审查最终修改</font> | <font style="color:rgb(23, 32, 51);">diff 是否小、可解释、符合 Scope</font> |


<font style="color:rgb(23, 32, 51);">一个可能的最小修复是：</font>

```plain
# src/my_api/schemas/task.py
from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)
```

<font style="color:rgb(23, 32, 51);">注意，工具调用本身不会保证“工程正确”。如果项目的标题空白字符串 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">" "</font>`<font style="color:rgb(23, 32, 51);"> 也应被拒绝，单纯 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">min_length=1</font>`<font style="color:rgb(23, 32, 51);"> 不够；这就需要测试、业务规则和人工 Review 继续收口。</font>

<!-- 这是一张图片，ocr 内容为：API SCHEMA GIT DIFF 三 422 复现问题 定位证据 运行单测 验证通过 检查差异 最小修改 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537203331-db277eea-c8a6-43dc-a5bc-dc7d74608207-1784548878978-17.png)

### <font style="color:rgb(15, 23, 42);">4.4 工具权限边界：哪些可以自动，哪些必须问人</font>
<font style="color:rgb(23, 32, 51);">Claude Code 的终端能力很强，所以要把工具动作分级：</font>

| **<font style="color:rgb(15, 23, 42);">风险等级</font>** | **<font style="color:rgb(15, 23, 42);">例子</font>** | **<font style="color:rgb(15, 23, 42);">建议策略</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">低风险</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">git status</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">rg TaskCreate</font>`<br/><font style="color:rgb(23, 32, 51);">、读取文件</font> | <font style="color:rgb(23, 32, 51);">可以自动执行，但保留日志</font> |
| <font style="color:rgb(23, 32, 51);">中风险</font> | <font style="color:rgb(23, 32, 51);">编辑源码、运行</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">uv run pytest</font>`<br/><font style="color:rgb(23, 32, 51);">、创建测试文件</font> | <font style="color:rgb(23, 32, 51);">允许在 Scope 内执行，必须看 diff</font> |
| <font style="color:rgb(23, 32, 51);">高风险</font> | <font style="color:rgb(23, 32, 51);">修改迁移、批量移动文件、改 CI、安装依赖</font> | <font style="color:rgb(23, 32, 51);">执行前必须解释原因并请求确认</font> |
| <font style="color:rgb(23, 32, 51);">禁止默认执行</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">rm -rf</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">git reset --hard</font>`<br/><font style="color:rgb(23, 32, 51);">、推送代码、访问生产库、读取密钥</font> | <font style="color:rgb(23, 32, 51);">默认拒绝；确需执行时走人工审批和备份</font> |


:::danger
**<font style="color:rgb(220, 38, 38);">🚨</font>****<font style="color:rgb(220, 38, 38);"> 最危险的误解</font>**

<font style="color:rgb(23, 32, 51);">“能跑命令”不等于“可以随便跑命令”。Shell 工具会产生真实副作用：删除文件、改 git 历史、触发部署、访问生产数据。把这些动作交给 Agent 前，必须有权限边界、deny 规则、审计日志和回滚方案。</font>

:::

### <font style="color:rgb(15, 23, 42);">4.5 工具调用反模式</font>
| **<font style="color:rgb(15, 23, 42);">反模式</font>** | **<font style="color:rgb(15, 23, 42);">问题</font>** | **<font style="color:rgb(15, 23, 42);">改成什么</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">上来就让它“修好”</font> | <font style="color:rgb(23, 32, 51);">跳过观察和计划，容易盲改</font> | <font style="color:rgb(23, 32, 51);">要求先调查、列证据、给计划</font> |
| <font style="color:rgb(23, 32, 51);">测试失败就让它“继续试”</font> | <font style="color:rgb(23, 32, 51);">可能通过删测试、放宽断言、改错边界来通过</font> | <font style="color:rgb(23, 32, 51);">要求只根据失败日志定点修复，并禁止弱化测试</font> |
| <font style="color:rgb(23, 32, 51);">把外部文档当指令</font> | <font style="color:rgb(23, 32, 51);">容易被过时文档或间接 Prompt 注入误导</font> | <font style="color:rgb(23, 32, 51);">外部内容只作为数据，项目规则和用户指令优先</font> |
| <font style="color:rgb(23, 32, 51);">不给停止条件</font> | <font style="color:rgb(23, 32, 51);">Agent 在错误方向上循环消耗 token</font> | <font style="color:rgb(23, 32, 51);">限制修改范围、轮次、验证命令和需要询问的条件</font> |
| <font style="color:rgb(23, 32, 51);">只看最终总结</font> | <font style="color:rgb(23, 32, 51);">总结可能漏掉风险，真实 diff 才是事实</font> | <font style="color:rgb(23, 32, 51);">逐文件看 diff，必要时运行独立检查</font> |


## <font style="color:rgb(15, 23, 42);">五、CLAUDE.md、Memory、Skills：别把三件事混成一坨</font>
<font style="color:rgb(23, 32, 51);">Claude Code 的上下文体系不能只理解成“把资料塞给模型”。更准确的理解是：</font>**<font style="color:rgb(15, 23, 42);">不同类型的信息，应该进入不同的载体</font>**<font style="color:rgb(23, 32, 51);">。项目事实放进 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> 或路径规则，Claude 自己从纠正中沉淀的经验进入 Memory，重复使用的多步骤流程封装成 Skills。三者都能影响 Agent 行为，但它们不是同一种东西。</font>

:::info
**<font style="color:rgb(23, 32, 51);">⚠️</font>****<font style="color:rgb(23, 32, 51);"> 先建立一个边界：它们是上下文，不是强制执行器</font>**

`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);">、Memory、Skills 都会影响 Claude 的推理，但它们本质上仍是进入上下文的指令和资料。你不能指望一句“不要删除文件”就形成安全边界。需要硬约束时，要用 permission、settings、deny rules、PreToolUse Hook、只读 MCP、代码保护分支等工程手段。</font>

:::

### <font style="color:rgb(15, 23, 42);">5.1 三者边界：事实、经验、流程</font>
<font style="color:rgb(23, 32, 51);">判断信息该放哪里，可以用一句话：</font>**<font style="color:rgb(15, 23, 42);">稳定项目事实放 CLAUDE.md，跨会话经验放 Memory，可复用操作流程放 Skills；局部目录规则放 .claude/rules。</font>**

| **<font style="color:rgb(15, 23, 42);">机制</font>** | **<font style="color:rgb(15, 23, 42);">谁维护</font>** | **<font style="color:rgb(15, 23, 42);">什么时候进入上下文</font>** | **<font style="color:rgb(15, 23, 42);">适合放什么</font>** | **<font style="color:rgb(15, 23, 42);">不要放什么</font>** |
| :--- | :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">CLAUDE.md</font>** | <font style="color:rgb(23, 32, 51);">团队或个人显式编写</font> | <font style="color:rgb(23, 32, 51);">会话启动时加载相关层级文件</font> | <font style="color:rgb(23, 32, 51);">项目结构、架构边界、常用命令、验证标准、团队约定</font> | <font style="color:rgb(23, 32, 51);">密钥、临时需求、冗长 README、一次性任务计划</font> |
| **<font style="color:rgb(15, 23, 42);">.claude/rules/</font>** | <font style="color:rgb(23, 32, 51);">团队维护</font> | <font style="color:rgb(23, 32, 51);">全局加载或按路径匹配时加载</font> | <font style="color:rgb(23, 32, 51);">按目录/文件类型生效的规则，例如 API、测试、迁移规范</font> | <font style="color:rgb(23, 32, 51);">互相冲突的规则、过宽泛口号、与代码事实不一致的旧约定</font> |
| **<font style="color:rgb(15, 23, 42);">Memory / Auto memory</font>** | <font style="color:rgb(23, 32, 51);">Claude 从纠正和偏好中沉淀，用户需要审计</font> | <font style="color:rgb(23, 32, 51);">后续会话自动带入</font> | <font style="color:rgb(23, 32, 51);">用户偏好、反复踩坑、项目非显性经验、调试线索</font> | <font style="color:rgb(23, 32, 51);">敏感凭证、已在代码中明确表达的事实、过期经验、临时 bug 现象</font> |
| **<font style="color:rgb(15, 23, 42);">Skills</font>** | <font style="color:rgb(23, 32, 51);">团队或个人封装</font> | <font style="color:rgb(23, 32, 51);">用户</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">/skill-name</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">调用或 Claude 判断相关时加载</font> | <font style="color:rgb(23, 32, 51);">代码审查、发布检查、失败诊断、生成模块、迁移审查等流程</font> | <font style="color:rgb(23, 32, 51);">纯背景知识堆积、不会复用的 prompt、带高风险副作用但可自动触发的流程</font> |

<!-- 这是一张图片，ocr 内容为：SKILLS MEMORY CLAUDE.MD 可复用流程 长期经验 项目事实 CCCCCCCCC 0日照 不要混装 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537232664-4d8d06f2-e6ff-45d5-8dcd-da0d7d7039b1-1784548878978-19.png)

<font style="color:rgb(23, 32, 51);">这个边界非常重要。很多团队把所有东西都塞进</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);">：目录说明、发布流程、PR 模板、安全规范、数据库迁移教程、几千行历史事故复盘。结果是启动上下文臃肿，规则彼此冲突，Claude 反而更不稳定。好的上下文体系不是“越多越好”，而是</font>**<font style="color:rgb(15, 23, 42);">越精确、越分层、越可审计越好</font>**<font style="color:rgb(23, 32, 51);">。</font>

### <font style="color:rgb(15, 23, 42);">5.2 CLAUDE.md：Python 项目的 Agent 入职手册</font>
`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">面向 Agent，不是 README 的复制品。README 通常告诉人“这个项目是什么”；</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">要告诉 Claude Code“在这个项目里应该怎么工作、哪些边界不能越过、改完后如何证明正确”。</font>

<font style="color:rgb(23, 32, 51);">一个 Python FastAPI 项目的</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">可以这样写：</font>

```plain
# CLAUDE.md

## Project
- Python 3.12
- FastAPI
- SQLAlchemy 2.0 async ORM
- Pydantic v2
- pytest + pytest-asyncio
- ruff + mypy
- uv is the package manager

## Commands
- Install dependencies: uv sync
- Run lint: uv run ruff check .
- Run type check: uv run mypy src/my_api
- Run all tests: uv run pytest
- Run API tests: uv run pytest tests/api
- Run a single test: uv run pytest tests/api/test_tasks.py -k "create_task"

## Architecture
- src/my_api/api/: FastAPI routers. Parse HTTP input and return response schemas.
- src/my_api/service/: business orchestration and transaction boundaries.
- src/my_api/repo/: SQLAlchemy queries. Repos do not commit transactions.
- src/my_api/schemas/: Pydantic request and response models.
- src/my_api/models/: SQLAlchemy ORM models.
- tests/api/: black-box API tests through httpx AsyncClient.
- tests/service/: service-level tests with mocked repos or test database.

## Coding Rules
- Routers must not import ORM models directly.
- Routers call services; services call repos.
- Repos must not call session.commit(); transaction ownership stays in service layer.
- Use Pydantic v2 APIs. Do not add v1-style validators unless existing code requires it.
- Do not add dependencies without user approval.
- Do not edit Alembic migrations unless the task explicitly asks for schema migration.
- Do not weaken tests to make them pass.

## Verification Policy
- For schema/API changes, run: uv run pytest tests/api
- For service changes, run the relevant service tests and API regression tests.
- Before final answer, show changed files, root cause, verification command, and remaining risk.
- If verification cannot be run, explain the exact blocker instead of claiming success.
```

<font style="color:rgb(23, 32, 51);">这份文件的价值在于它把“团队默认常识”变成 Agent 可读取的工程约束。Claude Code 不需要每次重新猜测事务边界在哪里、测试命令怎么跑、Pydantic 版本是什么、迁移能不能动。它可以直接围绕这些事实做计划。</font>

:::info
**<font style="color:rgb(37, 99, 235);">💡</font>****<font style="color:rgb(37, 99, 235);"> 写 CLAUDE.md 的标准</font>**

<font style="color:rgb(23, 32, 51);">每一条最好都能被验证：</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">router 不直接 import ORM model</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">可以通过代码搜索验证；</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">repo 不 commit</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">可以通过 grep 验证；</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">修改 API 后运行 tests/api</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">可以通过终端验证。不要写“代码要优雅”“保持工程质量”这类无法操作的空话。</font>

:::

### <font style="color:rgb(15, 23, 42);">5.3 .claude/rules：大型 Python 项目的局部规则，不要让全局上下文爆炸</font>
<font style="color:rgb(23, 32, 51);">当项目变大，尤其是单仓多服务或百万行代码库时，所有规则都放进根目录 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> 会污染上下文。更好的做法是把规则拆到 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">.claude/rules/</font>`<font style="color:rgb(23, 32, 51);">，并用路径匹配控制加载时机。</font>

<!-- 这是一张图片，ocr 内容为：API规则 只七 测试规则 按需加载 .CLAUDE/RULES 迁移规则 项目根目录 API 000 服务 仓储 代码目录 模型 CLAUDE.MD 测试目录 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547905464-38a63a3f-b46d-4489-9f15-8e3937ea49db-1784548878978-21.png)

<font style="color:rgb(23, 32, 51);">例如，把 API 层规则只绑定到路由和 schema：</font>

```plain
---
paths:
  - "src/my_api/api/**/*.py"
  - "src/my_api/schemas/**/*.py"
---

# API Rules

- New endpoints must include request validation and response schema.
- Route handlers should stay thin: parse input, call service, map response.
- Do not import SQLAlchemy ORM models from router files.
- For request validation changes, add or update tests under tests/api/.
```

<font style="color:rgb(23, 32, 51);">再把测试规则绑定到</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">tests/**/*.py</font>`<font style="color:rgb(23, 32, 51);">：</font>

```plain
---
paths:
  - "tests/**/*.py"
---

# Testing Rules

- Prefer behavior assertions over implementation assertions.
- API tests should use httpx AsyncClient.
- Do not skip a failing test unless the user explicitly approves.
- When fixing flaky tests, identify whether the cause is time, order, network, database state, or async scheduling.
```

<font style="color:rgb(23, 32, 51);">路径规则的关键不是“更复杂”，而是</font>**<font style="color:rgb(15, 23, 42);">降低无关规则进入上下文的概率</font>**<font style="color:rgb(23, 32, 51);">。Claude 在修改</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">src/my_api/api/tasks.py</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">时需要 API 规则；在修改 Alembic migration 时才需要迁移规则；在处理测试时才需要测试规则。上下文越贴近当前文件，Agent 的行为越稳定。</font>

:::danger
**<font style="color:rgb(220, 38, 38);">❌</font>****<font style="color:rgb(220, 38, 38);"> 反例：错误 Rules 会降低效果</font>**

<font style="color:rgb(23, 32, 51);">假设</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">写着“service 层负责事务提交”，但</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">.claude/rules/repo.md</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">又写着“repo 方法必须 commit”。Claude 看到两个冲突规则后，可能随机选择一个，也可能为了通过测试到处补 commit。Rules 不是越多越好；过期、冲突、口号化的规则会直接降低 Agent 质量。</font>

:::

### <font style="color:rgb(15, 23, 42);">5.4 Memory：跨会话记忆，不是项目垃圾桶</font>
<font style="color:rgb(23, 32, 51);">Memory 更像“Claude 从长期互动中形成的工作笔记”。它适合记录那些</font>**<font style="color:rgb(15, 23, 42);">代码库里不容易直接看出来，但反复影响协作效率</font>**<font style="color:rgb(23, 32, 51);">的信息。例如：</font>

+ <font style="color:rgb(23, 32, 51);">用户偏好：最终回复先给结论，再列验证命令，不要长篇复述 diff。</font>
+ <font style="color:rgb(23, 32, 51);">项目经验：这个项目的测试数据库启动慢，优先跑单文件测试，最后再跑全量。</font>
+ <font style="color:rgb(23, 32, 51);">历史踩坑：任务接口的</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">title</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">空字符串校验过去漏过，改 schema 时要补 API 回归测试。</font>
+ <font style="color:rgb(23, 32, 51);">环境习惯：本仓库使用</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">uv</font>`<font style="color:rgb(23, 32, 51);">，不要建议</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">pip install -r requirements.txt</font>`<font style="color:rgb(23, 32, 51);">，除非仓库确实有该文件。</font>

<font style="color:rgb(23, 32, 51);">不该进入 Memory 的内容同样要明确：</font>

+ **<font style="color:rgb(15, 23, 42);">密钥和凭证</font>**<font style="color:rgb(23, 32, 51);">：API key、数据库密码、token、cookie 永远不放。</font>
+ **<font style="color:rgb(15, 23, 42);">一次性事实</font>**<font style="color:rgb(23, 32, 51);">：今天某个测试失败、某个临时分支名、这轮任务的计划，不值得跨会话保存。</font>
+ **<font style="color:rgb(15, 23, 42);">代码已经表达的事实</font>**<font style="color:rgb(23, 32, 51);">：目录结构、函数签名、依赖版本通常应该从仓库读取，而不是靠记忆。</font>
+ **<font style="color:rgb(15, 23, 42);">未经验证的猜测</font>**<font style="color:rgb(23, 32, 51);">：例如“数据库偶尔会死锁”如果没有证据，会误导后续排查。</font>

<font style="color:rgb(23, 32, 51);">Memory 的工程化管理应该有生命周期：</font>

| **<font style="color:rgb(15, 23, 42);">阶段</font>** | **<font style="color:rgb(15, 23, 42);">要做什么</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目例子</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">Create</font> | <font style="color:rgb(23, 32, 51);">只记录会长期复用的经验</font> | <font style="color:rgb(23, 32, 51);">“本项目 API 测试默认用 httpx AsyncClient，不直接调用 router 函数。”</font> |
| <font style="color:rgb(23, 32, 51);">Verify</font> | <font style="color:rgb(23, 32, 51);">确认记忆不是猜测，最好能被代码或团队约定支持</font> | <font style="color:rgb(23, 32, 51);">打开</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">tests/api/conftest.py</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">确认 fixture 确实如此。</font> |
| <font style="color:rgb(23, 32, 51);">Use</font> | <font style="color:rgb(23, 32, 51);">在计划和验证阶段引用它，而不是盲目相信它</font> | <font style="color:rgb(23, 32, 51);">先按记忆跑单文件测试，再根据失败日志决定是否跑全量。</font> |
| <font style="color:rgb(23, 32, 51);">Audit</font> | <font style="color:rgb(23, 32, 51);">定期检查是否过期、重复、互相冲突</font> | <font style="color:rgb(23, 32, 51);">项目从 pytest 迁到 nox 后，删除旧测试命令记忆。</font> |
| <font style="color:rgb(23, 32, 51);">Delete</font> | <font style="color:rgb(23, 32, 51);">错误记忆要删除，不要靠新记忆覆盖旧记忆</font> | <font style="color:rgb(23, 32, 51);">发现项目已不用 Pydantic v1，就清掉相关旧约定。</font> |


<font style="color:rgb(23, 32, 51);">一句话：</font>**<font style="color:rgb(15, 23, 42);">Memory 用来减少重复解释，不用来替代代码搜索。</font>**<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">Claude Code 仍然应该通过 Read、Grep、测试和 diff 获取当前事实。Memory 只是在“从哪里开始查、用什么协作风格、哪些坑要优先排除”上提供加速。</font>

### <font style="color:rgb(15, 23, 42);">5.5 Skills：把重复三次的流程封装成能力</font>
<font style="color:rgb(23, 32, 51);">Skills 解决的是另一类问题：你反复把同一段流程贴给 Claude，比如“审查 API 改动”“定位 pytest 失败”“生成 FastAPI endpoint”“发布前检查”。这类内容不应该常驻</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);">，因为它们不是每轮会话都需要；也不应该靠 Memory，因为它们不是经验碎片，而是可执行流程。</font>

<font style="color:rgb(23, 32, 51);">一个 Skill 通常是一个目录，核心入口是 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">SKILL.md</font>`<font style="color:rgb(23, 32, 51);">，可以带支持文件、模板、示例、脚本。Claude 可以在需要时加载它，也可以由用户用斜杠命令显式调用。</font>

<!-- 这是一张图片，ocr 内容为：SKILL 目录 按需调用 SKILL.MD 核心入口 SKILLMD CHECKLISTMD EXAMPLES SCRIPTS CHECKLIST.MD EXAMPLES SCRIPTS 支持材料 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547875800-15798512-fac9-4a94-be90-18bdba52dfdc.png)

<font style="color:rgb(23, 32, 51);">例如，给 Python FastAPI 项目写一个</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">python-api-review</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">Skill：</font>

```plain
---
name: python-api-review
description: Review FastAPI API changes for layering, validation, transactions, tests, and backward compatibility. Use when API routes, schemas, services, or repos changed.
allowed-tools: Read Grep Bash(git diff *) Bash(uv run ruff check *) Bash(uv run pytest tests/api*)
---

# Python API Review Skill

Use this skill to review API-related changes in this repository.

## Steps
1. Inspect the diff first:
   - git diff -- src/my_api tests/api
2. Check routing boundaries:
   - routers call service layer
   - routers do not import ORM models directly
3. Check Pydantic v2 schemas:
   - request models validate required fields
   - response models do not leak internal ORM fields
4. Check transaction ownership:
   - service owns commit/rollback
   - repo only executes queries
5. Check tests:
   - API behavior tests cover success and validation errors
   - do not weaken existing assertions
6. Run or suggest verification:
   - uv run ruff check .
   - uv run pytest tests/api
7. Final report:
   - changed files
   - correctness risks
   - missing tests
   - commands run and results
```

<font style="color:rgb(23, 32, 51);">注意这里的</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">allowed-tools</font>`<font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">不是“永久授权”。它只应该给这个 Skill 在当前回合需要的最小能力。像</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">git push</font>`<font style="color:rgb(23, 32, 51);">、部署命令、生产数据库写操作，不应该放进可自动触发的 Skill。带副作用的 Skill，例如</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">/commit</font>`<font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">/deploy</font>`<font style="color:rgb(23, 32, 51);">，更适合设置为只允许用户显式调用，而不是让 Claude 自动判断。</font>

| **<font style="color:rgb(15, 23, 42);">Skill 类型</font>** | **<font style="color:rgb(15, 23, 42);">适合场景</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目例子</font>** | **<font style="color:rgb(15, 23, 42);">调用方式建议</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">知识型</font> | <font style="color:rgb(23, 32, 51);">某个领域规范，偶尔需要加载</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">api-conventions</font>`<br/><font style="color:rgb(23, 32, 51);">：统一错误格式、分页规范、版本兼容策略</font> | <font style="color:rgb(23, 32, 51);">可允许 Claude 自动触发</font> |
| <font style="color:rgb(23, 32, 51);">任务型</font> | <font style="color:rgb(23, 32, 51);">固定步骤的工程动作</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">pytest-failure-triage</font>`<br/><font style="color:rgb(23, 32, 51);">：读取失败日志、定位 fixture、最小复现</font> | <font style="color:rgb(23, 32, 51);">可自动触发，但工具权限要窄</font> |
| <font style="color:rgb(23, 32, 51);">高风险操作型</font> | <font style="color:rgb(23, 32, 51);">提交、发布、迁移、批量重构</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">release-check</font>`<br/><font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">migration-review</font>` | <font style="color:rgb(23, 32, 51);">只允许用户显式</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">/skill-name</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">调用</font> |
| <font style="color:rgb(23, 32, 51);">子 Agent 型</font> | <font style="color:rgb(23, 32, 51);">会产生大量搜索结果或日志，需要隔离上下文</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">codebase-scan</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">扫描所有调用方后返回摘要</font> | <font style="color:rgb(23, 32, 51);">适合放到 fork/subagent 上下文执行</font> |


### <font style="color:rgb(15, 23, 42);">5.6 三者如何协同：一次 POST /tasks 修改会加载什么</font>
<font style="color:rgb(23, 32, 51);">假设任务是：</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">POST /tasks 在 title 为空字符串时应该返回 422，但现在返回 201</font>`<font style="color:rgb(23, 32, 51);">。一次成熟的 Claude Code 会话里，四类上下文应该这样分工：</font>

| **<font style="color:rgb(15, 23, 42);">来源</font>** | **<font style="color:rgb(15, 23, 42);">提供什么</font>** | **<font style="color:rgb(15, 23, 42);">对本任务的影响</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">Prompt / Spec</font> | <font style="color:rgb(23, 32, 51);">当前目标、范围、验收标准、禁止事项</font> | <font style="color:rgb(23, 32, 51);">限定只修复</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">POST /tasks</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">校验，不动 ORM、不改迁移、不放宽测试。</font> |
| <font style="color:rgb(23, 32, 51);">CLAUDE.md</font> | <font style="color:rgb(23, 32, 51);">项目事实和团队默认约定</font> | <font style="color:rgb(23, 32, 51);">知道使用 Python 3.12、FastAPI、Pydantic v2、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">uv run pytest tests/api</font>`<br/><font style="color:rgb(23, 32, 51);">。</font> |
| <font style="color:rgb(23, 32, 51);">.claude/rules</font> | <font style="color:rgb(23, 32, 51);">当前文件相关的局部规则</font> | <font style="color:rgb(23, 32, 51);">读到</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">src/my_api/api/tasks.py</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">时加载 API 层规则，提醒 router 不直接碰 ORM。</font> |
| <font style="color:rgb(23, 32, 51);">Memory</font> | <font style="color:rgb(23, 32, 51);">跨会话经验和协作偏好</font> | <font style="color:rgb(23, 32, 51);">知道用户希望先给计划再改，最终回复要列验证命令和风险。</font> |
| <font style="color:rgb(23, 32, 51);">Skill</font> | <font style="color:rgb(23, 32, 51);">可复用流程</font> | <font style="color:rgb(23, 32, 51);">调用</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">/python-api-review</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">审查 diff、事务边界、Pydantic 校验和 API 测试。</font> |


<font style="color:rgb(23, 32, 51);">这也是“AI 编程工程化”和“随手让 AI 改代码”的区别。后者依赖模型临场发挥；前者让 Claude Code 在</font>**<font style="color:rgb(15, 23, 42);">明确 Spec、稳定项目事实、局部规则、长期经验、可复用流程</font>**<font style="color:rgb(23, 32, 51);">共同约束下工作。</font>

### <font style="color:rgb(15, 23, 42);">5.7 上下文装配顺序：百万行 Python 项目不要一次性喂给 Agent</font>
<font style="color:rgb(23, 32, 51);">Claude Code 能处理大型项目，不是因为它真的把百万行代码一次性读进模型，而是因为它会通过搜索、索引、文件读取、工具结果和局部规则逐步装配上下文。你应该把它理解成</font>**<font style="color:rgb(15, 23, 42);">渐进式证据收集</font>**<font style="color:rgb(23, 32, 51);">，而不是“全仓库复制粘贴”。</font>

<font style="color:rgb(23, 32, 51);">在大型 Python 服务里，一个合理的上下文装配顺序通常是：</font>

<!-- 这是一张图片，ocr 内容为：局部地图 局部规则 当前任务 运行证据 搜索定位 按需技能 关键文件 项目事实 长期经验 四湖 三凉 拒绝全仓泛读 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547838238-119b1877-a5c3-489d-9601-de7338629a8f-1784548878979-23.png)

<font style="color:rgb(23, 32, 51);">例如你要修改</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">src/my_api/api/tasks.py</font>`<font style="color:rgb(23, 32, 51);">，不要让 Claude Code “扫描整个项目然后修复”。更好的说法是：</font>

```plain
请不要全仓库泛读。按下面顺序收集上下文：

1. 读取根 CLAUDE.md，确认 Python 版本、分层规则、测试命令。
2. 读取匹配 src/my_api/api/**/*.py 和 tests/**/*.py 的 rules。
3. 用 grep 搜索：TaskCreate、create_task、TaskOut、类似 UserCreate 的校验写法。
4. 只读取这些文件：
   - src/my_api/api/tasks.py
   - src/my_api/schemas/task.py
   - src/my_api/service/tasks.py
   - tests/api/test_tasks.py
5. 输出调用链摘要和最小修改计划，不要立即改文件。
6. 如果需要读取更多文件，先说明为什么。
```

| **<font style="color:rgb(15, 23, 42);">上下文来源</font>** | **<font style="color:rgb(15, 23, 42);">优先用途</font>** | **<font style="color:rgb(15, 23, 42);">控制策略</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">Spec / 当前 Prompt</font> | <font style="color:rgb(23, 32, 51);">限定本轮目标、范围、验收</font> | <font style="color:rgb(23, 32, 51);">写清 Goal、Scope、Non-goal、Acceptance、Stop condition</font> |
| <font style="color:rgb(23, 32, 51);">CLAUDE.md</font> | <font style="color:rgb(23, 32, 51);">提供稳定项目事实</font> | <font style="color:rgb(23, 32, 51);">保持短、准、可验证，不放长教程</font> |
| <font style="color:rgb(23, 32, 51);">Rules</font> | <font style="color:rgb(23, 32, 51);">提供局部约束</font> | <font style="color:rgb(23, 32, 51);">按路径拆分，避免全局污染</font> |
| <font style="color:rgb(23, 32, 51);">Code Search</font> | <font style="color:rgb(23, 32, 51);">定位入口和相似实现</font> | <font style="color:rgb(23, 32, 51);">先搜索再读文件，避免上下文爆炸</font> |
| <font style="color:rgb(23, 32, 51);">Tool Results</font> | <font style="color:rgb(23, 32, 51);">提供当前事实证据</font> | <font style="color:rgb(23, 32, 51);">测试日志和 diff 优先于记忆和猜测</font> |
| <font style="color:rgb(23, 32, 51);">Skills</font> | <font style="color:rgb(23, 32, 51);">加载可复用流程</font> | <font style="color:rgb(23, 32, 51);">只在任务相关时加载，不常驻</font> |
| <font style="color:rgb(23, 32, 51);">Memory</font> | <font style="color:rgb(23, 32, 51);">补充长期经验</font> | <font style="color:rgb(23, 32, 51);">可用但要可质疑，不能替代代码事实</font> |


<font style="color:rgb(23, 32, 51);">这套做法对百万行项目尤其重要。Agent 的失败常常不是“模型不聪明”，而是上下文被噪声淹没：读了太多无关文件、加载了过期规则、把历史记忆当当前事实、还没定位调用链就开始改。大型项目里要让 Claude Code 先构建</font>**<font style="color:rgb(15, 23, 42);">任务相关的局部地图</font>**<font style="color:rgb(23, 32, 51);">，再做最小改动。</font>

### <font style="color:rgb(15, 23, 42);">5.8 常见反模式：上下文越多，效果不一定越好</font>
| **<font style="color:rgb(15, 23, 42);">反模式</font>** | **<font style="color:rgb(15, 23, 42);">为什么危险</font>** | **<font style="color:rgb(15, 23, 42);">更好的做法</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">把 README 全复制到 CLAUDE.md</font> | <font style="color:rgb(23, 32, 51);">大量面向人的说明会消耗上下文，但对行动没有帮助</font> | <font style="color:rgb(23, 32, 51);">只保留命令、架构边界、验证标准和高频约定</font> |
| <font style="color:rgb(23, 32, 51);">把发布流程写进 CLAUDE.md</font> | <font style="color:rgb(23, 32, 51);">每次会话都加载高风险流程，且可能被误用</font> | <font style="color:rgb(23, 32, 51);">封装成</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">/release-check</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">Skill，并限制为用户显式调用</font> |
| <font style="color:rgb(23, 32, 51);">Memory 不审计</font> | <font style="color:rgb(23, 32, 51);">过期记忆会持续误导 Agent</font> | <font style="color:rgb(23, 32, 51);">定期用</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">/memory</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">检查、编辑、删除错误项</font> |
| <font style="color:rgb(23, 32, 51);">Skills 写成百科全书</font> | <font style="color:rgb(23, 32, 51);">加载后长期占用上下文，执行步骤反而不清晰</font> | `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">SKILL.md</font>`<br/><font style="color:rgb(23, 32, 51);"> </font><font style="color:rgb(23, 32, 51);">保持短小，把大文档放 supporting files</font> |
| <font style="color:rgb(23, 32, 51);">Rules 互相冲突</font> | <font style="color:rgb(23, 32, 51);">Claude 无法判断哪个规则优先，行为变得随机</font> | <font style="color:rgb(23, 32, 51);">按目录拆分，定期删除旧规则，给每条规则保留可验证依据</font> |
| <font style="color:rgb(23, 32, 51);">把密钥写进任何上下文文件</font> | <font style="color:rgb(23, 32, 51);">会被模型读取、摘要、传播到日志或输出</font> | <font style="color:rgb(23, 32, 51);">用环境变量、密钥管理器、只读配置和权限隔离</font> |


<font style="color:rgb(23, 32, 51);">最终要形成的不是一个很长的 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);">，而是一套可维护的上下文架构：根 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">CLAUDE.md</font>`<font style="color:rgb(23, 32, 51);"> 管稳定事实，路径 Rules 管局部约束，Memory 管长期经验，Skills 管可复用流程，Hooks 和权限负责硬边界。这样 Claude Code 才能从“会写代码的聊天窗口”升级为“可纳入团队工程系统的终端 Agent”。</font>

## <font style="color:rgb(15, 23, 42);">六、Workflows 与 Agent Teams：什么时候该让多个 Agent 上场</font>
<font style="color:rgb(23, 32, 51);">单 Agent 很强，但软件工程经常天然并行：十个文件要读、五个模块要 review、三个方案要评估、多个测试失败要定位。这个时候，一个 Agent 串行干就像让一个人同时翻十本书，效率低，还容易忘。</font>

<font style="color:rgb(23, 32, 51);">Claude Code 体系里有几种“多工”方式：</font>

| **<font style="color:rgb(15, 23, 42);">方式</font>** | **<font style="color:rgb(15, 23, 42);">像什么</font>** | **<font style="color:rgb(15, 23, 42);">适合任务</font>** | **<font style="color:rgb(15, 23, 42);">别乱用在</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(23, 32, 51);">Background Agents / Agent View</font> | <font style="color:rgb(23, 32, 51);">多个终端会话并排跑</font> | <font style="color:rgb(23, 32, 51);">并行探索、长任务、独立子任务</font> | <font style="color:rgb(23, 32, 51);">单文件小修小补</font> |
| <font style="color:rgb(23, 32, 51);">Subagents / Agent Teams</font> | <font style="color:rgb(23, 32, 51);">组长分配任务给队友</font> | <font style="color:rgb(23, 32, 51);">代码审查、测试补齐、模块迁移</font> | <font style="color:rgb(23, 32, 51);">上下文必须强共享的细活</font> |
| <font style="color:rgb(23, 32, 51);">Dynamic Workflows</font> | <font style="color:rgb(23, 32, 51);">写脚本调度一队 Agent</font> | <font style="color:rgb(23, 32, 51);">大规模审查、迁移、研究、验证</font> | <font style="color:rgb(23, 32, 51);">临时小问题；token 预算不清的任务</font> |
| <font style="color:rgb(23, 32, 51);">Routines / Scheduled tasks / Loop</font> | <font style="color:rgb(23, 32, 51);">定时工单</font> | <font style="color:rgb(23, 32, 51);">每天审 PR、每周依赖检查、持续轮询</font> | <font style="color:rgb(23, 32, 51);">一次性工程修改</font> |


:::info
**<font style="color:rgb(37, 99, 235);">🔍</font>****<font style="color:rgb(37, 99, 235);"> 深度洞察</font>**

<font style="color:rgb(23, 32, 51);">多 Agent 的本质不是“让 AI 更聪明”，而是“让上下文并行”。每个子 Agent 有自己的注意力窗口和任务目标，适合独立读、独立验证、独立提出发现。真正的难点在合并结果：去重、验证、排序、落地。</font>

:::

<!-- 这是一张图片，ocr 内容为：扫描调用链 主 AGENT 任务拆分 统一验证 合并去重 补齐测试 中草中士 审查风险 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537412077-65805285-03b1-4761-84ae-f0948cbda4b0.png)

## <font style="color:rgb(15, 23, 42);">七、权限、安全和 Auto Mode：给 Agent 刹车，不是给它戴镣铐</font>
<font style="color:rgb(23, 32, 51);">Claude Code 能改文件、跑命令、接外部系统，这意味着安全不再是“提示词写好一点”就能解决。你需要权限系统、设置分层、deny 规则、托管策略、hooks 和审计。</font>

### <font style="color:rgb(15, 23, 42);">Settings 的四层作用域</font>
<font style="color:rgb(23, 32, 51);">Claude Code 设置常见位置包括用户级</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">~/.claude/settings.json</font>`<font style="color:rgb(23, 32, 51);">、项目级</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">.claude/settings.json</font>`<font style="color:rgb(23, 32, 51);">、本地项目级</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">.claude/settings.local.json</font>`<font style="color:rgb(23, 32, 51);">，以及企业托管设置。优先级大致是：托管设置最高，然后命令行参数、本地设置、项目设置、用户设置。权限规则会合并，而不是简单覆盖。</font>

```plain
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(curl *)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  }
}
```

<font style="color:rgb(23, 32, 51);">这段配置的含义很朴素：常见安全命令放行，敏感文件和高风险网络命令拦住。别小看</font><font style="color:rgb(23, 32, 51);"> </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">deny</font>`<font style="color:rgb(23, 32, 51);">。在 Agent 时代，最危险的不是它不会干活，而是它太会干活。</font>

### <font style="color:rgb(15, 23, 42);">托管策略：企业团队一定要看</font>
<font style="color:rgb(23, 32, 51);">个人项目靠自律，企业项目靠制度。Claude Code 支持 managed settings，例如限制可选模型、强制登录方式、禁用 Remote Control、禁用 Agent View、只允许托管 MCP 服务器、禁用 Auto Mode、限制 hooks URL 等。</font>

| **<font style="color:rgb(15, 23, 42);">策略</font>** | **<font style="color:rgb(15, 23, 42);">解决什么问题</font>** | **<font style="color:rgb(15, 23, 42);">适合场景</font>** |
| :--- | :--- | :--- |
| `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">allowManagedPermissionRulesOnly</font>` | <font style="color:rgb(23, 32, 51);">只允许组织定义的权限规则</font> | <font style="color:rgb(23, 32, 51);">金融、医疗、合规严格团队</font> |
| `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">allowManagedMcpServersOnly</font>` | <font style="color:rgb(23, 32, 51);">只允许管理员批准的 MCP</font> | <font style="color:rgb(23, 32, 51);">防止员工私接高风险工具</font> |
| `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">disableAutoMode</font>` | <font style="color:rgb(23, 32, 51);">禁止 Auto Mode</font> | <font style="color:rgb(23, 32, 51);">生产基础设施、敏感数据仓库</font> |
| `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">availableModels</font>` | <font style="color:rgb(23, 32, 51);">限制模型选择</font> | <font style="color:rgb(23, 32, 51);">成本管控、数据策略、模型评估期</font> |
| `<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">allowedHttpHookUrls</font>` | <font style="color:rgb(23, 32, 51);">限制 HTTP hook 目标</font> | <font style="color:rgb(23, 32, 51);">防止 hook 变成数据外传通道</font> |

<!-- 这是一张图片，ocr 内容为：权限系统回答的不是能不能跑,而是该不该自动跑 规则匹配 凉 风险分类 动作请求 自动执行 规则匹配 请求确认 有副作用 低风险 直接拒绝 敏感操作 紫山间 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784547792634-c21dcacf-1563-4bc3-9c60-2de34f32eb75.png)

### <font style="color:rgb(15, 23, 42);">Hooks：把团队工程习惯变成自动化</font>
<font style="color:rgb(23, 32, 51);">Hooks 很像“开发流程里的传感器和自动门”。在 Claude Code 的动作前后，团队可以触发脚本：比如文件编辑后自动 format，提交前跑 lint，Stop 时发通知，配置变化时检查策略。</font>

<font style="color:rgb(23, 32, 51);">但 hooks 也是代码，也可能变成数据外传通道。企业里要特别关注 </font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">allowedHttpHookUrls</font>`<font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">httpHookAllowedEnvVars</font>`<font style="color:rgb(23, 32, 51);">、</font>`<font style="color:rgb(29, 78, 216);background-color:rgb(241, 245, 249);">allowManagedHooksOnly</font>`<font style="color:rgb(23, 32, 51);"> 这类策略。你不希望一个项目级 hook 偷偷把上下文发到陌生地址。</font>

<!-- 这是一张图片，ocr 内容为：外发需授权 停止时通知 提交前检查 编辑后格式化 X阻止 个IL 允许 @@@@@ -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784537436557-0a1acb6b-9a4e-459a-90f3-b39c1c170c0e.png)

## <font style="color:rgb(15, 23, 42);">结尾：你真正要学的不是命令，而是“把 AI 纳入工程系统”</font>
<font style="color:rgb(23, 32, 51);">回到开头那个问题：Claude Code 到底是不是“终端里的聊天机器人”？答案很明确：不是。它更像一个可审计、可配置、可接工具、可跑流程的工程 Agent。</font>

<font style="color:rgb(23, 32, 51);">但重点也别跑偏。Claude Code 不会替你承担工程责任。它能加速定位、修改、验证、交付；它也可能生成看起来完美但实际有坑的代码。真正的高手不是“把所有事都交给 AI”，而是会设计上下文、权限、验证和流程，让 AI 在正确边界内高效工作。</font>

**<font style="color:rgb(15, 23, 42);">一句话收尾：</font>**<font style="color:rgb(23, 32, 51);">别把 Claude Code 当补全器，也别把它当神。把它当一名很强但需要制度约束的工程搭档，你会得到最大收益。</font>

