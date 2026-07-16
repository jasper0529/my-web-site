---
title: 6、Cursor 不只是“会补全的 VS Code”：AI-first IDE 到底强在哪？
date: 2026-07-16
tags: ["AI", "Vibe Coding"]
description: 你身边是不是也有这样的人：装了 Cursor，开了 Tab 补全，用了几天，得出一个结论——“不就是 Copilot 加聊天框吗？”说实话，这个判断不能说完全错，但它刚好错过了 Cursor 最值钱的那部分。 先给一句话定义：Cursor 是一个把“编辑器、代码库上下文、AI 对话、多文件…
---



<font style="color:rgb(74, 85, 104);">你身边是不是也有这样的人：装了 Cursor，开了 Tab 补全，用了几天，得出一个结论——“不就是 Copilot 加聊天框吗？”说实话，这个判断不能说完全错，但它刚好错过了 Cursor 最值钱的那部分。</font>

<font style="color:rgb(26, 26, 46);">先给一句话定义：</font>**<font style="color:rgb(15, 23, 42);">Cursor 是一个把“编辑器、代码库上下文、AI 对话、多文件 Agent、规则系统和外部工具”揉在一起的 AI-first IDE。</font>**<font style="color:rgb(26, 26, 46);">它不是让你少写几个字符那么简单，而是把“开发者如何给 AI 提供上下文、约束 AI、审查 AI、驱动 AI 改项目”这套流程塞进 IDE。</font>

<font style="color:rgb(26, 26, 46);">说人话就是：普通 AI 聊天像你在微信里问同事问题；Cursor 更像这个同事直接坐在你电脑前，能看项目、能改文件、能按团队规范办事，但你仍然得盯着他别乱来。</font>

## <font style="color:rgb(15, 23, 42);">一、为什么很多人只用出了“高级自动补全”的水平</font>
<!-- 这是一张图片，ocr 内容为：CURSOR强在哪? 从补全工具到工程协作者 工程协作者 补全工具 代码库 CURSOR AI IDE AGENT 理解项目 (上下文) 理解需求 文件 IMPORT OS MAIN.PY 000 SRC/ 拆解任务 2 FROM UTILS IMPORT LOAD SRC/ 3 TESTS/ 多文件执行 ADD(A, B): MAIN.PY 只补下一行 DEF 4  DEF MAIN(): DOCS/ 自我检查 API-PY 2 RESULT-A+B 多文件执行 5 UTILS.PY DATA LOAD() RETURN RESULT 6 RESULT - PROCESS(DATA) TESTS/ TEST_API.PY 7 RETURN RESULT 4 README.MD DIFF 审查 8 局部正确 规则文件 5 (TAB) RESULT -10.6 +10,7  00 规则约束 终端 CURSORRULES .EDITORCONFIG PYTEST LINT 规则 NEW LINE 全部通过 .代码规范 审查验证 机械地连续按TAB. 终端与工具 测试验证 单元测试 2 集成通试 终端运行工具 静态检查 验收清单 从被动补全 OOCERRNTO 双双双 O 功能正确 到主动协作 我专注目标, 测试通过 代码规范 把控质量与交付! 文档完善 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784195773211-8d1d5b72-45f0-4093-a2d7-c00fc6270501.png)

<font style="color:rgb(26, 26, 46);">真实场景一般长这样：你打开 Cursor，对 Chat 说“帮我加一个用户卡片组件”。AI 很热情，三秒钟给你写了一堆代码。看起来挺像那么回事，组件有了，样式也有了，甚至测试文件也顺手生成了。</font>

<font style="color:rgb(26, 26, 46);">你跑起来一看，问题来了：组件没有复用项目已有的 Button；类型定义和后端返回不一致；测试只测了“能渲染”，没测空头像、长昵称、禁用状态；CSS 命名还和项目规范打架。</font>

:::danger
**<font style="color:rgb(239, 68, 68);">❌</font>****<font style="color:rgb(239, 68, 68);"> 典型误区</font>**

<font style="color:rgb(26, 26, 46);">把 Cursor 当成“更聪明的代码补全器”，你会越来越依赖它补局部代码；把 Cursor 当成“带上下文和规则的 IDE Agent 工作台”，你才会开始设计 Spec、Context、Rules、Review 这条工程链路。</font>

:::

<font style="color:rgb(26, 26, 46);">这里的关键差异不是“AI 聪不聪明”，而是</font>**<font style="color:rgb(15, 23, 42);">你有没有把项目事实、团队规则、任务边界、验收标准一起喂给它</font>**<font style="color:rgb(26, 26, 46);">。Cursor 强在 IDE 原生上下文，但上下文不会自动等于正确答案。上下文像厨房食材，食材全不代表菜一定好吃，还得有菜谱、火候和厨师判断。</font>

<font style="color:rgb(26, 26, 46);">所以这一节我们不只讲按钮在哪，而是讲 Cursor 的工程心智：什么时候用 Tab，什么时候用 Inline Edit，什么时候交给 Agent，什么时候必须收手自己审。</font>

## <font style="color:rgb(15, 23, 42);">二、AI IDE 总体架构：从补全到 Agent 与 Subagents</font>
<font style="color:rgb(26, 26, 46);">要真正用好 Cursor，先别急着背快捷键。你得先把它的能力分层，否则你会用 Agent 干补全的活，也会用 Tab 硬扛跨文件重构。那就像拿电钻拧眼镜螺丝，工具很强，场景错了。</font>

### <font style="color:rgb(15, 23, 42);">2.1 AI IDE 总体架构：编辑器、上下文、Agent、工具和审查系统</font>
<font style="color:rgb(26, 26, 46);">AI IDE 不是“编辑器旁边放一个聊天框”。它更像一个小型工程操作系统：底层仍然是代码编辑器，但上层多了上下文引擎、规则系统、Agent 编排器、工具运行时、模型路由和审查验证链路。Cursor 的强点，正是在这些模块之间做了 IDE 级整合。</font>

| **<font style="color:rgb(15, 23, 42);">架构层</font>** | **<font style="color:rgb(15, 23, 42);">负责什么</font>** | **<font style="color:rgb(15, 23, 42);">在 Cursor 里的体现</font>** | **<font style="color:rgb(15, 23, 42);">你要关注什么</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Editor Layer</font> | <font style="color:rgb(26, 26, 46);">文件、光标、选区、diff、终端入口</font> | <font style="color:rgb(26, 26, 46);">Tab、Inline Edit、文件树、内置终端</font> | <font style="color:rgb(26, 26, 46);">每次改动是否可见、可撤销、可比较</font> |
| <font style="color:rgb(26, 26, 46);">Context Layer</font> | <font style="color:rgb(26, 26, 46);">把相关代码、选中片段、索引、历史、文档送进模型</font> | `<font style="color:rgb(37, 99, 235);">@file</font>`<br/><font style="color:rgb(26, 26, 46);">、代码库索引、聊天上下文、MCP 返回</font> | <font style="color:rgb(26, 26, 46);">上下文要准，不要把全仓库当垃圾桶塞进去</font> |
| <font style="color:rgb(26, 26, 46);">Governance Layer</font> | <font style="color:rgb(26, 26, 46);">给 AI 长期约束和任务边界</font> | <font style="color:rgb(26, 26, 46);">Rules、AGENTS.md、Spec、User Rules</font> | <font style="color:rgb(26, 26, 46);">把稳定约定写进规则，把临时目标写进 Spec</font> |
| <font style="color:rgb(26, 26, 46);">Agent Orchestrator</font> | <font style="color:rgb(26, 26, 46);">把任务拆成计划、编辑、工具调用、修复循环</font> | <font style="color:rgb(26, 26, 46);">Chat/Agent 多文件修改、命令建议、失败后迭代</font> | <font style="color:rgb(26, 26, 46);">Agent 不是一次生成器，而是一个受控循环</font> |
| <font style="color:rgb(26, 26, 46);">Tool Runtime</font> | <font style="color:rgb(26, 26, 46);">执行命令、读取外部系统、连接文档或服务</font> | <font style="color:rgb(26, 26, 46);">终端、MCP、文档检索、测试命令</font> | <font style="color:rgb(26, 26, 46);">权限最小化，外部内容只能当数据，不能当最高指令</font> |
| <font style="color:rgb(26, 26, 46);">Model Router</font> | <font style="color:rgb(26, 26, 46);">按任务选择不同模型和推理强度</font> | <font style="color:rgb(26, 26, 46);">模型选择、长上下文、强推理/快速模型</font> | <font style="color:rgb(26, 26, 46);">别把所有任务都交给最贵或最便宜模型</font> |
| <font style="color:rgb(26, 26, 46);">Review Pipeline</font> | <font style="color:rgb(26, 26, 46);">把 AI 输出变成可验证工程改动</font> | <font style="color:rgb(26, 26, 46);">diff、静态检查、类型检查、测试、人工 review</font> | <font style="color:rgb(26, 26, 46);">没有审查链路，Agent 速度越快风险越大</font> |

<!-- 这是一张图片，ocr 内容为：IDE总体架构 AI-FIRST 审查验证 模型路由 规则治理 上下文 AGENT编排 工具运行 中国 圆一自 AI 生成代码只是中间环节 编辑器层 文件 选区 DIFF 终端 上下文+规则+工具 REVIEW -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784195807108-c8c36530-f860-4009-be97-15ce62cbcb19.png)

<font style="color:rgb(26, 26, 46);">所以，AI-first IDE 的核心不是“AI 写了多少代码”，而是</font>**<font style="color:rgb(15, 23, 42);">代码生成是否被上下文、规则、工具和审查流程包住</font>**<font style="color:rgb(26, 26, 46);">。没有这些外围系统，Agent 再强也只是一个更快的复制粘贴机器。</font>

### <font style="color:rgb(15, 23, 42);">2.2 Cursor 内部工作原理：一次请求链路</font>
<font style="color:rgb(26, 26, 46);">从内部工作原理看，一次 Cursor 请求不是“把你的问题直接丢给模型”。更接近下面这条链路：用户输入任务后，Cursor 会收集当前文件、选区、代码索引、Rules、</font>`<font style="color:rgb(37, 99, 235);">@</font>`<font style="color:rgb(26, 26, 46);"> 引用、聊天历史和外部工具结果；然后把它们裁剪成模型可处理的上下文包；模型生成方案或补丁；Cursor 再把结果呈现成 diff，等待你确认、应用和验证。</font>

<!-- 这是一张图片，ocr 内容为：CURSOR请求链路 生成DIFF 人工确认 模型推理 选择压缩 收集上下文 用户任务 运行验证 目目目目 多文件修改方案 代码索引 当前文件 编译通过 RULES 聊天历史 测试通过 功能正常 修复登录 引用 送辑问题 代码补丁 日日 旧代码 确认通过 新代码 任务包 失败后定点修复 验证失败 模型看到的不是整个仓库,而是筛选后的上下文包. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200026189-c8e24d36-5678-4552-8ae6-9f278d2dd970.png)

<font style="color:rgb(113, 128, 150);">Cursor 的“智能”很大一部分来自请求链路前半段的上下文选择，而不只是模型本身。</font>

<font style="color:rgb(26, 26, 46);">这张图也解释了为什么同一个模型，在普通聊天窗口和 Cursor 里表现不同：普通聊天主要依赖你手动粘贴上下文；Cursor 会尽量从 IDE 状态、索引、规则和引用中组装上下文。但这并不等于它永远知道正确答案——上下文召回可能漏，规则可能冲突，diff 仍然需要你审。</font>

### <font style="color:rgb(15, 23, 42);">2.3 四层能力模型：从局部补全到多文件 Agent</font>
| **<font style="color:rgb(15, 23, 42);">能力层</font>** | **<font style="color:rgb(15, 23, 42);">适合做什么</font>** | **<font style="color:rgb(15, 23, 42);">不适合做什么</font>** | **<font style="color:rgb(15, 23, 42);">你的角色</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Tab 补全</font> | <font style="color:rgb(26, 26, 46);">连续写局部代码、补参数、补样板</font> | <font style="color:rgb(26, 26, 46);">跨文件设计、业务规则判断</font> | <font style="color:rgb(26, 26, 46);">司机：随时刹车</font> |
| <font style="color:rgb(26, 26, 46);">Inline Edit / Cmd/Ctrl+K</font> | <font style="color:rgb(26, 26, 46);">局部重写、解释、抽取函数、小范围修复</font> | <font style="color:rgb(26, 26, 46);">全项目迁移、复杂架构调整</font> | <font style="color:rgb(26, 26, 46);">编辑：给明确改稿意见</font> |
| <font style="color:rgb(26, 26, 46);">Chat</font> | <font style="color:rgb(26, 26, 46);">问代码、讨论方案、定位文件、生成步骤</font> | <font style="color:rgb(26, 26, 46);">无人值守地改生产关键代码</font> | <font style="color:rgb(26, 26, 46);">技术 Lead：追问假设</font> |
| <font style="color:rgb(26, 26, 46);">Agent / Composer 类多文件编辑</font> | <font style="color:rgb(26, 26, 46);">按 Spec 改多个文件、生成测试、执行较完整任务</font> | <font style="color:rgb(26, 26, 46);">没有边界的“你看着办”</font> | <font style="color:rgb(26, 26, 46);">Reviewer：看 diff、跑测试</font> |

<!-- 这是一张图片，ocr 内容为：SPEC CURSOR四层能力 RULES SPEC 个 REVIEW AGENT 多文件任务 影响面更大 上下文更多 CHAT 方案讨论 INLINE EDIT 局部改写 TAB补全 连续补全 TAB -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200134967-37388444-7d08-40ec-9cc9-3e15bfada958.png)

<font style="color:rgb(26, 26, 46);">看出来了吗？Tab 是最顺手的入口，但不是 Cursor 的全部。Tab 解决的是“下一行怎么写”；Agent 解决的是“这个任务怎么在项目里落地”。二者不是替代关系，而是不同粒度的工作方式。</font>

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 小心“顺手陷阱”</font>**

<font style="color:rgb(26, 26, 46);">Tab 补全越丝滑，你越容易不审查就接受。它补的是局部模式，不一定理解业务边界。涉及权限、支付、数据删除、缓存一致性时，别让手比脑子快。</font>

:::

### <font style="color:rgb(15, 23, 42);">2.4 Agent Loop：现在的 Agent 不是“生成代码”这么简单</font>
<font style="color:rgb(26, 26, 46);">早期很多人把 AI 编程理解成“一次 Prompt → 一段代码”。但大型 Agent 的工作方式已经更接近循环：它先理解任务和上下文，再提出计划，接着修改文件、查看 diff、运行或建议运行命令，根据错误日志继续修，最后停下来交给你审查。这个循环可以叫</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">Agent Loop</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">按当前 Cursor 官方文档的心智模型，Agent 可以理解成三件东西的组合：</font>**<font style="color:rgb(15, 23, 42);">Instructions（指令）+ Tools（工具）+ Model（模型）</font>**<font style="color:rgb(26, 26, 46);">。Instructions 来自你的 Prompt、Spec、Rules、AGENTS.md；Tools 包括代码库搜索、读文件、编辑文件、终端、MCP、浏览器/文档检索、提问和检查点；Model 负责推理与生成。Agent 的稳定性，取决于这三者是否匹配，而不是只取决于模型有多强。</font>

| **<font style="color:rgb(15, 23, 42);">Agent 组成</font>** | **<font style="color:rgb(15, 23, 42);">来自哪里</font>** | **<font style="color:rgb(15, 23, 42);">常见问题</font>** | **<font style="color:rgb(15, 23, 42);">工程化做法</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Instructions</font> | <font style="color:rgb(26, 26, 46);">Prompt、Spec、Rules、AGENTS.md、User Rules</font> | <font style="color:rgb(26, 26, 46);">目标模糊、规则冲突、缺少 Non Goal</font> | <font style="color:rgb(26, 26, 46);">写完整 Spec，稳定约定沉淀到 Rules</font> |
| <font style="color:rgb(26, 26, 46);">Tools</font> | <font style="color:rgb(26, 26, 46);">代码搜索、文件读写、终端、MCP、Diff、Ask User、Checkpoint</font> | <font style="color:rgb(26, 26, 46);">权限过大、误信外部文档、执行高风险命令</font> | <font style="color:rgb(26, 26, 46);">最小权限、只读优先、高危人工确认</font> |
| <font style="color:rgb(26, 26, 46);">Model</font> | <font style="color:rgb(26, 26, 46);">快速模型、平衡模型、强推理模型</font> | <font style="color:rgb(26, 26, 46);">任务复杂度和模型能力不匹配</font> | <font style="color:rgb(26, 26, 46);">按任务风险和复杂度选择模型</font> |




| **<font style="color:rgb(15, 23, 42);">Loop 阶段</font>** | **<font style="color:rgb(15, 23, 42);">Agent 在做什么</font>** | **<font style="color:rgb(15, 23, 42);">你要控制什么</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目例子</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Observe</font> | <font style="color:rgb(26, 26, 46);">读取 Spec、Rules、相关文件、错误日志</font> | <font style="color:rgb(26, 26, 46);">上下文是否足够且准确</font> | <font style="color:rgb(26, 26, 46);">引用</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">api/tasks.py</font>`<br/><font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">repo/tasks.py</font>`<br/><font style="color:rgb(26, 26, 46);">、测试失败日志</font> |
| <font style="color:rgb(26, 26, 46);">Plan</font> | <font style="color:rgb(26, 26, 46);">拆解任务，列出将修改的文件和顺序</font> | <font style="color:rgb(26, 26, 46);">先确认计划，避免一上来大改</font> | <font style="color:rgb(26, 26, 46);">先改 schema，再改 router/service/repo，最后补测试</font> |
| <font style="color:rgb(26, 26, 46);">Act</font> | <font style="color:rgb(26, 26, 46);">编辑文件、生成测试、调整实现</font> | <font style="color:rgb(26, 26, 46);">限制改动范围和单轮 diff 大小</font> | <font style="color:rgb(26, 26, 46);">本轮只实现</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">POST /tasks</font>`<br/><font style="color:rgb(26, 26, 46);">，不碰迁移和鉴权</font> |
| <font style="color:rgb(26, 26, 46);">Check</font> | <font style="color:rgb(26, 26, 46);">查看 diff，运行或建议运行静态检查/测试</font> | <font style="color:rgb(26, 26, 46);">不要跳过验证；失败日志要回灌</font> | `<font style="color:rgb(37, 99, 235);">ruff</font>`<br/><font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">mypy</font>`<br/><font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">pytest tests/api/test_tasks.py</font>` |
| <font style="color:rgb(26, 26, 46);">Reflect</font> | <font style="color:rgb(26, 26, 46);">根据错误修复，说明剩余风险</font> | <font style="color:rgb(26, 26, 46);">禁止为通过测试而放宽断言或隐藏错误</font> | <font style="color:rgb(26, 26, 46);">修 fixture，而不是把 422 测试删掉</font> |
| <font style="color:rgb(26, 26, 46);">Stop / Handoff</font> | <font style="color:rgb(26, 26, 46);">提交修改摘要、验证结果、风险和后续建议</font> | <font style="color:rgb(26, 26, 46);">你做最终 review 和合并决策</font> | <font style="color:rgb(26, 26, 46);">列出修改文件、命令结果、未覆盖风险</font> |


<!-- 这是一张图片，ocr 内容为：AGENT LOOP 计划 观察 DDL SPEC RULES 人人 执行 交接 人工验收 AI </> 检查 反思 错误日志 DIFF 牛十 失败重试 控制输入,边界,验证和停止条件 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200485700-46548842-26d6-4bac-b401-8eed267d682b.png)

<font style="color:rgb(26, 26, 46);">这也是为什么后面我们会反复强调 Spec、Rules 和 Review Pipeline：Agent Loop 越强，越需要工程护栏。没有护栏的 Agent Loop，会把一次小需求放大成一场不可控的大重构。</font>

<font style="color:rgb(26, 26, 46);">Agent 失败通常不是“模型太笨”这么简单，更多是 Loop 的某一环输入不够清楚或验证不够强：</font>

| **<font style="color:rgb(15, 23, 42);">失败原因</font>** | **<font style="color:rgb(15, 23, 42);">表现</font>** | **<font style="color:rgb(15, 23, 42);">修正方法</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Context 不完整</font> | <font style="color:rgb(26, 26, 46);">漏掉关键 service、schema、测试夹具，生成代码和项目不兼容</font> | <font style="color:rgb(26, 26, 46);">显式</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">@</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">关键文件，并要求 Agent 列出参考文件</font> |
| <font style="color:rgb(26, 26, 46);">任务目标模糊</font> | <font style="color:rgb(26, 26, 46);">Agent 自己扩展需求，顺手重构无关模块</font> | <font style="color:rgb(26, 26, 46);">写完整 Spec，尤其是 Scope 和 Non Goal</font> |
| <font style="color:rgb(26, 26, 46);">修改范围过大</font> | <font style="color:rgb(26, 26, 46);">diff 太大，Review 无法判断风险</font> | <font style="color:rgb(26, 26, 46);">按可回滚切片分轮执行，每轮只改有限文件</font> |
| <font style="color:rgb(26, 26, 46);">缺少验证</font> | <font style="color:rgb(26, 26, 46);">代码看起来合理，但类型、测试或边界行为失败</font> | <font style="color:rgb(26, 26, 46);">固定运行 Static Analysis、Type Check、Tests，再进入下一轮</font> |
| <font style="color:rgb(26, 26, 46);">规则冲突或过时</font> | <font style="color:rgb(26, 26, 46);">Agent 同时遵守两套不一致约定，输出摇摆</font> | <font style="color:rgb(26, 26, 46);">清理旧 Rules，明确优先级，把项目事实写进 AGENTS.md</font> |


### <font style="color:rgb(15, 23, 42);">2.5 Subagents ：让主 Agent 学会委派，而不是把所有内容塞进一个上下文</font>
<font style="color:rgb(26, 26, 46);">Subagent 是由主 Agent 调用的专用子 Agent。每个 Subagent 都有</font>**<font style="color:rgb(15, 23, 42);">独立上下文窗口、独立系统提示、可选模型与工具权限</font>**<font style="color:rgb(26, 26, 46);">，完成任务后只把结果摘要返回给父 Agent。它解决的是大型任务中的三个问题：上下文隔离、并行工作和角色专业化。</font>

| **<font style="color:rgb(15, 23, 42);">能力</font>** | **<font style="color:rgb(15, 23, 42);">没有 Subagent 时</font>** | **<font style="color:rgb(15, 23, 42);">使用 Subagent 后</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">上下文隔离</font> | <font style="color:rgb(26, 26, 46);">搜索日志、测试输出、文档片段全部堆进主对话</font> | <font style="color:rgb(26, 26, 46);">子 Agent 在独立上下文中处理，只返回结论和证据</font> |
| <font style="color:rgb(26, 26, 46);">并行工作</font> | <font style="color:rgb(26, 26, 46);">主 Agent 顺序查架构、跑测试、审安全，等待时间长</font> | <font style="color:rgb(26, 26, 46);">多个子 Agent 可同时探索不同问题；官方当前支持最多约 4 个并行子 Agent</font> |
| <font style="color:rgb(26, 26, 46);">专业角色</font> | <font style="color:rgb(26, 26, 46);">同一个 Agent 既实现又审查，容易确认偏误</font> | <font style="color:rgb(26, 26, 46);">实现者、测试者、安全 Reviewer 使用不同提示与权限</font> |
| <font style="color:rgb(26, 26, 46);">权限控制</font> | <font style="color:rgb(26, 26, 46);">所有任务默认拥有相同编辑和终端能力</font> | <font style="color:rgb(26, 26, 46);">探索和 Review 子 Agent 可以设为只读</font> |


#### <font style="color:rgb(15, 23, 42);">Agent 与 Subagent 的使用边界</font>
<font style="color:rgb(26, 26, 46);">最重要的边界不是“哪个更强”，而是</font>**<font style="color:rgb(15, 23, 42);">谁拥有任务决策权，谁只负责有界子任务</font>**<font style="color:rgb(26, 26, 46);">。主 Agent 是当前任务的负责人，Subagent 是受委派的专家。</font>

| **<font style="color:rgb(15, 23, 42);">边界维度</font>** | **<font style="color:rgb(15, 23, 42);">主 Agent</font>** | **<font style="color:rgb(15, 23, 42);">Subagent</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">任务所有权</font> | <font style="color:rgb(26, 26, 46);">维护完整 Spec、目标、Scope、Non Goal 和 Acceptance</font> | <font style="color:rgb(26, 26, 46);">只完成父 Agent 明确委派的子任务</font> |
| <font style="color:rgb(26, 26, 46);">用户沟通</font> | <font style="color:rgb(26, 26, 46);">负责提出开放问题、请求确认和最终汇报</font> | <font style="color:rgb(26, 26, 46);">通常把不确定性返回父 Agent，不替用户做最终决策</font> |
| <font style="color:rgb(26, 26, 46);">上下文</font> | <font style="color:rgb(26, 26, 46);">拥有当前对话、用户要求和主任务历史</font> | <font style="color:rgb(26, 26, 46);">从干净的独立上下文开始，看不到父对话历史；父 Agent 必须显式传递必要信息</font> |
| <font style="color:rgb(26, 26, 46);">计划与架构</font> | <font style="color:rgb(26, 26, 46);">批准或调整实施计划、架构边界和任务切片</font> | <font style="color:rgb(26, 26, 46);">可以提出建议，但不应自行扩大 Scope、改变架构或引入依赖</font> |
| <font style="color:rgb(26, 26, 46);">代码写入</font> | <font style="color:rgb(26, 26, 46);">承担最终整合和冲突处理</font> | <font style="color:rgb(26, 26, 46);">只在文件范围互不重叠时写入；Explore、测试汇总和 Review 类子 Agent 优先只读</font> |
| <font style="color:rgb(26, 26, 46);">验证</font> | <font style="color:rgb(26, 26, 46);">汇总静态检查、测试、Review 和风险，决定是否进入下一阶段</font> | <font style="color:rgb(26, 26, 46);">独立执行某一类验证，例如 pytest、性能调查或安全审查</font> |
| <font style="color:rgb(26, 26, 46);">最终交付</font> | <font style="color:rgb(26, 26, 46);">对修改摘要、未验证项和 Commit/PR 负责</font> | <font style="color:rgb(26, 26, 46);">只返回结构化结果、证据和建议</font> |


<font style="color:rgb(26, 26, 46);">判断是否应该创建 Subagent，可以使用下面的决策表：</font>

| **<font style="color:rgb(15, 23, 42);">任务特征</font>** | **<font style="color:rgb(15, 23, 42);">推荐选择</font>** | **<font style="color:rgb(15, 23, 42);">原因</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">任务很小，修改一两个文件，需要持续和用户确认</font> | <font style="color:rgb(26, 26, 46);">主 Agent</font> | <font style="color:rgb(26, 26, 46);">创建子 Agent 的启动和上下文传递成本大于收益</font> |
| <font style="color:rgb(26, 26, 46);">需要继承完整对话历史和多轮业务决策</font> | <font style="color:rgb(26, 26, 46);">主 Agent</font> | <font style="color:rgb(26, 26, 46);">Subagent 不会自动继承父对话历史</font> |
| <font style="color:rgb(26, 26, 46);">需要扫描大量文件，但只返回模块地图</font> | <font style="color:rgb(26, 26, 46);">只读 Explore Subagent</font> | <font style="color:rgb(26, 26, 46);">隔离搜索噪音，保持主上下文干净</font> |
| <font style="color:rgb(26, 26, 46);">多个模块可以独立调查</font> | <font style="color:rgb(26, 26, 46);">并行 Subagents</font> | <font style="color:rgb(26, 26, 46);">适合并行探索，但要避免重复搜索和写冲突</font> |
| <font style="color:rgb(26, 26, 46);">需要独立测试、性能或安全审查</font> | <font style="color:rgb(26, 26, 46);">专用只读 Subagent</font> | <font style="color:rgb(26, 26, 46);">与实现上下文隔离，减少确认偏误</font> |
| <font style="color:rgb(26, 26, 46);">多个任务会修改同一文件或共享事务边界</font> | <font style="color:rgb(26, 26, 46);">主 Agent 顺序执行</font> | <font style="color:rgb(26, 26, 46);">并行写入容易覆盖修改、产生冲突和错误假设</font> |
| <font style="color:rgb(26, 26, 46);">只是复用一套固定知识或步骤</font> | <font style="color:rgb(26, 26, 46);">Skill</font> | <font style="color:rgb(26, 26, 46);">不需要独立上下文时，Skill 比 Subagent 更轻量</font> |


:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> Subagent 不应该拥有的权限</font>**

<font style="color:rgb(26, 26, 46);">除非父 Agent 和用户明确授权，Subagent 不应自行改变 Scope、添加依赖、修改数据库迁移、调整公开 API、执行数据删除、推送代码或做最终合并决策。遇到这些情况，应停止并把问题返回父 Agent。</font>

:::

<font style="color:rgb(26, 26, 46);">Subagent 的上下文边界尤其容易被忽视。下面的委派方式信息不足：</font>

**<font style="color:rgb(26, 26, 46);">❌</font>****<font style="color:rgb(26, 26, 46);"> 错误委派：假设 Subagent 知道前文</font>**

```plain
检查一下刚才那个任务，看看有没有问题。
```

**<font style="color:rgb(26, 26, 46);">✅</font>****<font style="color:rgb(26, 26, 46);"> 正确委派：传递完整子任务契约</font>**

```plain
只读审查 POST /tasks 的当前 diff。

目标：确认实现符合已批准 Spec。
范围：schemas/task.py、api/tasks.py、service/tasks.py、repo/tasks.py、tests/api/test_tasks.py。
重点：router 不查库、repo 不 commit、Pydantic from_attributes、201/422 测试。
禁止：不要修改文件，不要扩展需求，不要建议新增依赖。
输出：问题、证据文件/符号、风险等级、建议修复。
```

<font style="color:rgb(26, 26, 46);">前台与后台也有明确边界：</font>

+ **<font style="color:rgb(15, 23, 42);">Foreground Subagent：</font>**<font style="color:rgb(26, 26, 46);">父 Agent 等待结果，适合计划、架构判断和必须影响下一步决策的调查。</font>
+ **<font style="color:rgb(15, 23, 42);">Background Subagent：</font>**<font style="color:rgb(26, 26, 46);">父 Agent 可以继续工作，适合独立测试、日志分析和性能检查；但如果下一步依赖它的结论，就不能假装结果已经确定。</font>
+ **<font style="color:rgb(15, 23, 42);">并行 Subagents：</font>**<font style="color:rgb(26, 26, 46);">只并行无共享写入、无强顺序依赖的任务。建议从少量角色开始，根据成本和结果质量逐步增加，而不是追求并发数量。</font>

<font style="color:rgb(26, 26, 46);">官方当前还允许主 Agent 和直接 Subagent 创建子任务，但更深层的嵌套会被限制。工程上也不应构造复杂的“Agent 组织树”：层级越深，信息损失、成本和责任不清的问题越严重。</font>

<font style="color:rgb(26, 26, 46);">Cursor 当前提供三类内置 Subagent：</font>

| **<font style="color:rgb(15, 23, 42);">内置 Subagent</font>** | **<font style="color:rgb(15, 23, 42);">用途</font>** | **<font style="color:rgb(15, 23, 42);">典型场景</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Explore</font> | <font style="color:rgb(26, 26, 46);">只读代码库搜索与分析</font> | <font style="color:rgb(26, 26, 46);">扫描百万行项目、建立模块地图、追踪调用链</font> |
| <font style="color:rgb(26, 26, 46);">Bash</font> | <font style="color:rgb(26, 26, 46);">运行命令并隔离大量终端输出</font> | <font style="color:rgb(26, 26, 46);">执行 pytest、分析日志、汇总 lint/类型错误</font> |
| <font style="color:rgb(26, 26, 46);">Browser</font> | <font style="color:rgb(26, 26, 46);">处理网页和外部文档工作流</font> | <font style="color:rgb(26, 26, 46);">调查官方 API 文档、验证 Web 流程</font> |


<font style="color:rgb(26, 26, 46);">一个适合 Python 项目的编排方式如下：</font>

<!-- 这是一张图片，ocr 内容为：主 AGENT 与SUBAGENTS 代码探索 安全审查 主AGENT 结果摘要 结果摘要 用户确认 只读 只读 计划 测试执行 SPEC 代码实现 园园 结果摘要 结果摘要 园园 后台 可写 子任务有边界,不自行扩大范围 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200560136-a029b526-2ca3-44cd-88fb-277fafd049ba.png)

<font style="color:rgb(26, 26, 46);">项目级自定义 Subagent 放在</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">.cursor/agents/</font>`<font style="color:rgb(26, 26, 46);">，个人级放在</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">~/.cursor/agents/</font>`<font style="color:rgb(26, 26, 46);">。一个只读 Python 架构调查 Agent 可以这样定义：</font>

```plain
---
name: python-architecture-explorer
description: Explore a Python codebase, trace dependencies, and return evidence. Never edit files.
model: fast
readonly: true
is_background: false
---

You are a read-only Python architecture explorer.

When invoked:
1. Identify relevant packages and entry points.
2. Trace api → service → repo → model/test dependencies.
3. Cite file paths and symbols as evidence.
4. List uncertainties and missing context.
5. Do not propose code changes until the parent agent confirms the module map.
```

<font style="color:rgb(26, 26, 46);">后台测试 Subagent 则可以把大量终端输出隔离出去：</font>

```plain
---
name: python-test-verifier
description: Run Python quality checks and summarize failures without editing source code.
model: fast
readonly: true
is_background: true
---

Run the project verification commands defined in AGENTS.md.
Return:
- command and exit status
- concise failure summary
- affected files/tests
- likely root cause
- whether the failure predates the current diff
Do not modify tests or source files.
```

<font style="color:rgb(26, 26, 46);">Subagents 和 Skills 容易混淆，区别是：</font>

| **<font style="color:rgb(15, 23, 42);">机制</font>** | **<font style="color:rgb(15, 23, 42);">上下文</font>** | **<font style="color:rgb(15, 23, 42);">适合场景</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Skills</font> | <font style="color:rgb(26, 26, 46);">加载到当前 Agent 上下文</font> | <font style="color:rgb(26, 26, 46);">注入可复用知识和步骤，例如“如何发布 Python 包”</font> |
| <font style="color:rgb(26, 26, 46);">Subagents</font> | <font style="color:rgb(26, 26, 46);">独立上下文，完成后返回结果</font> | <font style="color:rgb(26, 26, 46);">隔离大量搜索/日志、并行调查、独立验证和专业角色</font> |


:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> Subagents 的常见反模式</font>**

+ <font style="color:rgb(26, 26, 46);">两个可写 Subagent 同时修改同一批文件，造成冲突和重复工作。</font>
+ <font style="color:rgb(26, 26, 46);">任务太小也创建多个 Subagent，增加延迟、token 和编排成本。</font>
+ `<font style="color:rgb(37, 99, 235);">description</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">写得模糊，主 Agent 不知道什么时候应该委派。</font>
+ <font style="color:rgb(26, 26, 46);">让实现者自己做最终安全 Review，失去独立验证价值。</font>
+ <font style="color:rgb(26, 26, 46);">后台 Agent 没有明确产出格式，最后返回一堆无法消费的日志。</font>

:::

<font style="color:rgb(26, 26, 46);">Subagent 的最佳使用原则是：</font>**<font style="color:rgb(15, 23, 42);">主 Agent 管目标和决策，子 Agent 管边界清楚、可以独立验证的子任务。</font>**<font style="color:rgb(26, 26, 46);">它不是为了“多开几个 AI”，而是为了保持主上下文干净，并建立搜索、实现、测试、审查之间的职责分离。</font>

### <font style="color:rgb(15, 23, 42);">2.6 Cursor 最佳实践矩阵：不同阶段应该怎么用</font>
<font style="color:rgb(26, 26, 46);">Cursor 的使用方式也应该随开发者成熟度升级。新手先把 Tab 和 Chat 用稳，熟练开发者再把 Inline Edit 和上下文引用用好，高级开发者才适合让 Agent 承担多文件任务；团队则要把 Rules、Spec 和 Review Pipeline 固化成流程。</font>

| **<font style="color:rgb(15, 23, 42);">人群</font>** | **<font style="color:rgb(15, 23, 42);">推荐使用方式</font>** | **<font style="color:rgb(15, 23, 42);">重点能力</font>** | **<font style="color:rgb(15, 23, 42);">不要急着做什么</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">新手</font> | <font style="color:rgb(26, 26, 46);">Tab + Chat</font> | <font style="color:rgb(26, 26, 46);">理解局部代码、解释错误、补样板</font> | <font style="color:rgb(26, 26, 46);">不要直接让 Agent 大规模改项目</font> |
| <font style="color:rgb(26, 26, 46);">熟练开发者</font> | <font style="color:rgb(26, 26, 46);">Chat + Inline Edit</font> | <font style="color:rgb(26, 26, 46);">局部重构、函数抽取、错误定位、上下文引用</font> | <font style="color:rgb(26, 26, 46);">不要把所有上下文都塞进去</font> |
| <font style="color:rgb(26, 26, 46);">高级开发者</font> | <font style="color:rgb(26, 26, 46);">Agent + Rules</font> | <font style="color:rgb(26, 26, 46);">多文件任务、测试生成、按规则改造模块</font> | <font style="color:rgb(26, 26, 46);">不要跳过 Spec、diff 和测试</font> |
| <font style="color:rgb(26, 26, 46);">团队</font> | <font style="color:rgb(26, 26, 46);">Rules + Agent + Review</font> | <font style="color:rgb(26, 26, 46);">统一工程约定、复用 Spec 模板、建立 AI Review Pipeline</font> | <font style="color:rgb(26, 26, 46);">不要让每个人用自己的口头规则各玩各的</font> |


<font style="color:rgb(26, 26, 46);">接下来问题就来了：如果 Cursor 的上层能力靠上下文驱动，那什么才是高质量上下文？</font>

## <font style="color:rgb(15, 23, 42);">三、上下文不是越多越好，而是越准越好</font>
<font style="color:rgb(26, 26, 46);">很多人用 Cursor 犯的第二个错误，是把整个代码库都想塞给 AI。你可能会说：“不是说 AI 要上下文吗？那我给越多越安全吧？”大错特错。</font>

<font style="color:rgb(26, 26, 46);">生活类比一下：你请同事帮你修一个登录按钮的样式，你不会把公司全部产品文档、三年会议纪要、数据库备份都发给他。你会给他当前组件、设计稿、样式规范、验收截图。Cursor 也是一样，</font>**<font style="color:rgb(15, 23, 42);">有效上下文 = 与任务强相关的信息 + 明确约束 + 可验证目标</font>**<font style="color:rgb(26, 26, 46);">。</font>

<!-- 这是一张图片，ocr 内容为：一次CURSOR请求的上下文拼装流程 引用 用户任务 代码索引 RULES 相关片段检索 团队/项目约束 文件/目录/DOCS SPEC / PROMPT 模型输入上下文 不是全量仓库,而是被筛选,拼装,约束后的任务包 输出:解释/修改/DIFF/测试 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1783930976243-7df9dca2-b718-4c6e-bd13-58f918bd09a4.png)

<font style="color:rgb(26, 26, 46);">在 Cursor 里，常见上下文入口包括当前打开文件、选中代码、@ 引用、代码库索引、规则文件、历史对话、外部文档和 MCP 工具返回。这里最重要的动作是“挑选”，不是“堆料”。</font>

### <font style="color:rgb(15, 23, 42);">3.1 Cursor 如何理解你的代码库：Codebase Index</font>
<font style="color:rgb(26, 26, 46);">Cursor 和普通 ChatGPT 最大的区别之一，是它不是只看你粘贴进去的几段代码。它会对代码库建立索引，帮助回答“这个函数哪里被调用了？”“相关实现在哪个文件？”“这个 service 对应的 repo 是哪个？”这类跨文件问题。这个能力通常可以理解为</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">Codebase Index + Semantic Search + Code Retrieval</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(113, 128, 150);">说明：下面的“解析 → Chunk → Embedding → 检索 → 组装”是帮助理解代码检索系统的工程概念模型。官方文档公开了索引、语义搜索和 Agentic Search 等能力，但没有承诺所有内部实现细节始终固定。</font>

| **<font style="color:rgb(15, 23, 42);">阶段</font>** | **<font style="color:rgb(15, 23, 42);">发生了什么</font>** | **<font style="color:rgb(15, 23, 42);">你能感受到什么</font>** | **<font style="color:rgb(15, 23, 42);">局限</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">代码解析</font> | <font style="color:rgb(26, 26, 46);">扫描项目文件、语言结构、符号和路径</font> | <font style="color:rgb(26, 26, 46);">Cursor 能知道项目有哪些文件和大致结构</font> | <font style="color:rgb(26, 26, 46);">生成文件、超大文件、忽略目录可能不完整</font> |
| <font style="color:rgb(26, 26, 46);">Chunk</font> | <font style="color:rgb(26, 26, 46);">把大文件切成适合检索和引用的代码片段</font> | <font style="color:rgb(26, 26, 46);">检索可以命中函数、类或配置块，而不是整份文件</font> | <font style="color:rgb(26, 26, 46);">切分边界可能丢失跨函数或跨文件关系</font> |
| <font style="color:rgb(26, 26, 46);">建立索引</font> | <font style="color:rgb(26, 26, 46);">为文件、符号、片段建立可检索表示</font> | <font style="color:rgb(26, 26, 46);">能按函数名、类名、路径快速定位</font> | <font style="color:rgb(26, 26, 46);">索引可能滞后，需要等待或刷新</font> |
| <font style="color:rgb(26, 26, 46);">Embedding</font> | <font style="color:rgb(26, 26, 46);">把代码片段转成语义向量</font> | <font style="color:rgb(26, 26, 46);">即使没精确说文件名，也能召回相关代码</font> | <font style="color:rgb(26, 26, 46);">语义相似不等于业务正确</font> |
| <font style="color:rgb(26, 26, 46);">语义检索</font> | <font style="color:rgb(26, 26, 46);">根据任务意图召回候选文件和片段</font> | <font style="color:rgb(26, 26, 46);">问“任务创建逻辑在哪”能找到 service/repo</font> | <font style="color:rgb(26, 26, 46);">召回可能漏掉关键边界文件</font> |
| <font style="color:rgb(26, 26, 46);">上下文选择</font> | <font style="color:rgb(26, 26, 46);">在 token 预算内挑选最相关内容给模型</font> | <font style="color:rgb(26, 26, 46);">模型看起来“懂项目”</font> | <font style="color:rgb(26, 26, 46);">它看到的是被筛选后的子集，不是整个仓库</font> |


<!-- 这是一张图片，ocr 内容为：CODEBASE INDEX 如何找到相关代码 语义向量 切分片段 代码解析 建立索引 上下文选择 召回代码 语义检索 目录 文件A 函数A() 文件 函数B() 模块 文件B 类 类B 类 F)函数 函数C() 函数 M)方法 云量口 文件C </> 变接 圆圈 变量 函数D() 模型输入 显式@ /个八 关键文件 索引提高召回,不保证理解完整 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200621170-0f6fca6d-1547-4e1b-99a8-d472ab005ab3.png)

<font style="color:rgb(26, 26, 46);">这也是为什么上下文不是越多越好：Codebase Index 负责“从全仓库召回候选材料”，而你负责“确认这批材料是不是足够且正确”。Agent 如果基于漏掉的上下文推理，结论再流畅也可能是错的。</font>

<font style="color:rgb(26, 26, 46);">按照当前官方搜索体系，还要区分两种检索方式：</font>

| **<font style="color:rgb(15, 23, 42);">搜索方式</font>** | **<font style="color:rgb(15, 23, 42);">工作方式</font>** | **<font style="color:rgb(15, 23, 42);">适合场景</font>** | **<font style="color:rgb(15, 23, 42);">典型问题</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Semantic Search</font> | <font style="color:rgb(26, 26, 46);">基于索引和语义相似度快速召回相关代码片段</font> | <font style="color:rgb(26, 26, 46);">查实现位置、找相似代码、理解单个概念</font> | <font style="color:rgb(26, 26, 46);">“项目里哪里创建 Task？”</font> |
| <font style="color:rgb(26, 26, 46);">Agentic Search</font> | <font style="color:rgb(26, 26, 46);">Agent 规划多轮搜索，结合关键词搜索、文件遍历、读取与推理逐步缩小范围</font> | <font style="color:rgb(26, 26, 46);">复杂跨模块问题、模糊需求、需要验证假设的调查</font> | <font style="color:rgb(26, 26, 46);">“任务状态为什么在某些请求后没有更新？”</font> |


<font style="color:rgb(26, 26, 46);">Semantic Search 像一次聪明的检索；Agentic Search 更像工程师连续搜索、打开文件、验证调用链。大型任务里两者经常组合：先用语义搜索召回候选，再由 Agent 多轮探索和确认。</font>

### <font style="color:rgb(15, 23, 42);">3.2 Cursor 如何理解一个百万行项目：不是“全部读完”，而是分层缩小搜索空间</font>
<font style="color:rgb(26, 26, 46);">面对百万行项目，Cursor 不可能把全部代码一次塞进模型上下文。它真正要解决的是一个搜索问题：</font>**<font style="color:rgb(15, 23, 42);">如何从百万行代码中，逐层缩小到这次任务真正相关的几十个文件、十几个符号和少量关键片段。</font>**

<!-- 这是一张图片，ocr 内容为：百万行项目 追踪调用链 同日目 API文件 日日日 工作区过滤 结构索引 SERVICE 语义召回 REPO 目目目目多轮探索 事件处理 不是全部读完 上下文组装 测试 最终上下文 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200660086-0a74216c-f9f5-401a-90a4-33d092b79dd7.png)

<font style="color:rgb(26, 26, 46);">可以把这个过程拆成五层：</font>

| **<font style="color:rgb(15, 23, 42);">层级</font>** | **<font style="color:rgb(15, 23, 42);">主要动作</font>** | **<font style="color:rgb(15, 23, 42);">百万行项目里的价值</font>** | **<font style="color:rgb(15, 23, 42);">开发者能做什么</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">1. Workspace Filtering</font> | <font style="color:rgb(26, 26, 46);">忽略依赖、构建产物、日志、二进制文件和无关目录</font> | <font style="color:rgb(26, 26, 46);">先把不值得搜索的噪音排除</font> | <font style="color:rgb(26, 26, 46);">维护 ignore 配置，不索引</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">.venv</font>`<br/><font style="color:rgb(26, 26, 46);">、缓存、生成目录和敏感文件</font> |
| <font style="color:rgb(26, 26, 46);">2. Structural Index</font> | <font style="color:rgb(26, 26, 46);">理解目录、文件、类、函数、符号和引用关系</font> | <font style="color:rgb(26, 26, 46);">先定位“哪个模块可能负责这件事”</font> | <font style="color:rgb(26, 26, 46);">保持模块命名和目录职责清晰，避免巨型杂物文件</font> |
| <font style="color:rgb(26, 26, 46);">3. Semantic Retrieval</font> | <font style="color:rgb(26, 26, 46);">按任务语义召回相似代码片段</font> | <font style="color:rgb(26, 26, 46);">即使用户不知道准确函数名，也能找到候选实现</font> | <font style="color:rgb(26, 26, 46);">Prompt 使用业务语言，同时显式引用已知关键文件</font> |
| <font style="color:rgb(26, 26, 46);">4. Agentic Exploration</font> | <font style="color:rgb(26, 26, 46);">Agent 连续搜索、打开文件、追踪 import/调用链并验证假设</font> | <font style="color:rgb(26, 26, 46);">处理跨服务、跨包、跨目录的复杂关系</font> | <font style="color:rgb(26, 26, 46);">要求 Agent 先输出“相关模块地图”和证据，不要立即改代码</font> |
| <font style="color:rgb(26, 26, 46);">5. Context Assembly</font> | <font style="color:rgb(26, 26, 46);">在上下文预算内排序、裁剪、压缩并组装任务包</font> | <font style="color:rgb(26, 26, 46);">把百万行项目缩成模型可处理的工作集</font> | <font style="color:rgb(26, 26, 46);">确认关键 schema、配置、测试和调用方没有遗漏</font> |


<font style="color:rgb(26, 26, 46);">例如，在一个 Python 单体仓库中询问“为什么订单退款后库存没有恢复”，Cursor 不应该只搜索</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">refund</font>`<font style="color:rgb(26, 26, 46);">。更完整的 Agentic Search 可能会经历：</font>

```plain
搜索 refund / refund_order
  ↓
定位 payments/refund_service.py
  ↓
查看调用方和事务边界
  ↓
追踪 inventory/repository.py
  ↓
查找库存恢复事件或消息处理器
  ↓
读取相关测试与失败日志
  ↓
形成模块地图和根因假设
  ↓
用户确认后再修改
```

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> “索引完成”不等于“理解完整”</font>**

<font style="color:rgb(26, 26, 46);">索引只能提高召回概率，不能保证关键文件一定被选中。百万行项目中最危险的情况是：Agent 找到了一个看似相似的实现，却漏掉真实的事务入口、配置开关或异步消费者。高风险任务应先让 Agent 输出相关文件、调用链和证据，再批准修改。</font>

:::

<font style="color:rgb(26, 26, 46);">推荐先使用一个“只调查、不修改”的 Prompt：</font>

```plain
请先不要修改代码。请调查“退款后库存没有恢复”的实现链路。

请输出：
1. 相关模块和文件列表。
2. 从 API 入口到退款 service、库存恢复逻辑的调用链。
3. 每个判断的代码证据。
4. 可能遗漏的异步任务、事件消费者、配置开关和测试。
5. 你仍然不确定的问题。

只有我确认模块地图后，才能进入实施计划。
```

### <font style="color:rgb(15, 23, 42);">3.3 Context 管理：构建最小但充分的 Context Pack</font>
<font style="color:rgb(26, 26, 46);">“精准上下文”不是少给文件，而是只给完成任务所必需的事实。可以把一次 Agent 任务的上下文整理成一个 Context Pack：</font>

<!-- 这是一张图片，ocr 内容为：有效上下文:相关事实+明确约束+验收目标 精准输入 无关噪音 清晰DIFF 闲聊邮件 会议记录 @@-10,7+10,7@@ 临时 想法 DEF CALC(X): RETURN X*2 任务 项目 相似 关键 RETURN X*2+1 实现 文件 RULES SPEC 无关代码 FUNCTION FOO() 测试通过 错误 外部 验证 CONTEXT 命令 单元测试 日志 资料 PACK 集成测试 敏感密钥 AI 边界测试 水水水**** CONTEXT PACK 敏感信息 可验证输出 不是越多越好,而是越准越好 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200701611-47ab5b55-dca2-42e2-b959-041ad31a0bab.png)

| **<font style="color:rgb(15, 23, 42);">Context 问题</font>** | **<font style="color:rgb(15, 23, 42);">症状</font>** | **<font style="color:rgb(15, 23, 42);">处理方式</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">上下文污染</font> | <font style="color:rgb(26, 26, 46);">无关文件太多，Agent 开始模仿错误模式</font> | <font style="color:rgb(26, 26, 46);">删掉无关材料，只保留关键文件与相似实现</font> |
| <font style="color:rgb(26, 26, 46);">上下文缺失</font> | <font style="color:rgb(26, 26, 46);">生成代码和 fixture、schema、依赖注入不兼容</font> | <font style="color:rgb(26, 26, 46);">显式</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">@</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">关键文件，要求 Agent 列出参考文件</font> |
| <font style="color:rgb(26, 26, 46);">上下文过期</font> | <font style="color:rgb(26, 26, 46);">索引仍指向移动前的文件或旧约定</font> | <font style="color:rgb(26, 26, 46);">等待/检查索引状态，重新引用最新文件</font> |
| <font style="color:rgb(26, 26, 46);">上下文漂移</font> | <font style="color:rgb(26, 26, 46);">多轮对话后，Agent 忘记最初 Scope</font> | <font style="color:rgb(26, 26, 46);">每轮重申 Spec 摘要、Non Goal 和停止条件</font> |
| <font style="color:rgb(26, 26, 46);">敏感上下文</font> | <font style="color:rgb(26, 26, 46);">密钥、客户数据或内部内容进入模型上下文</font> | <font style="color:rgb(26, 26, 46);">用 ignore 配置、脱敏数据和最小权限 MCP</font> |


**<font style="color:rgb(26, 26, 46);">❌</font>****<font style="color:rgb(26, 26, 46);"> 错误 Prompt</font>**

```plain
帮我重构这个项目的用户模块，顺便优化一下样式，
有问题你自己看着办。
```

**<font style="color:rgb(26, 26, 46);">✅</font>****<font style="color:rgb(26, 26, 46);"> 正确 Prompt</font>**

```plain
请只重构 @src/features/user/UserCard.tsx。
目标：拆出 Avatar、UserMeta 两个子组件。
约束：保持现有 props 不变；不得修改 API 类型；
必须复用 @src/ui/Button.tsx。
验收：现有测试通过，并补充长昵称和空头像用例。
```

<font style="color:rgb(26, 26, 46);">差别很明显：好的 Prompt 不装神秘，它把范围、目标、约束、验收都说清楚。AI 不怕你啰嗦，怕你模糊。模糊会让 Agent 自己脑补，而脑补就是很多事故的起点。</font>

<font style="color:rgb(26, 26, 46);">上下文解决“知道什么”，但还差一个问题：每次都重复说团队规范，很烦。这个时候 Rules 就该出场了。</font>

## <font style="color:rgb(15, 23, 42);">四、Rules：把重复叮嘱变成项目级规则</font>
<font style="color:rgb(26, 26, 46);">Rules 是 Cursor 很容易被低估的能力。它的价值特别朴素：</font>**<font style="color:rgb(15, 23, 42);">把你每次都要提醒 AI 的话，沉淀成可复用规则。</font>**<font style="color:rgb(26, 26, 46);">它不负责让模型变聪明，而是把模型每次都需要重新猜的项目事实，沉淀成稳定、可复用、可版本化的上下文。</font>

<font style="color:rgb(26, 26, 46);">比如 Python 后端项目里，你可能每次都要提醒 Cursor：</font>

+ <font style="color:rgb(26, 26, 46);">路由层只处理 HTTP 边界，不要直接查数据库。</font>
+ <font style="color:rgb(26, 26, 46);">数据库访问统一用 SQLAlchemy 2.0 async，不要写同步</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">session.query()</font>`<font style="color:rgb(26, 26, 46);">。</font>
+ <font style="color:rgb(26, 26, 46);">异步测试用</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">pytest-asyncio</font>`<font style="color:rgb(26, 26, 46);">，不要在测试里手动</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">asyncio.run()</font>`<font style="color:rgb(26, 26, 46);">。</font>
+ <font style="color:rgb(26, 26, 46);">新增依赖前必须先说明原因，不能自己改 </font>`<font style="color:rgb(37, 99, 235);">pyproject.toml</font>`<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">如果这些话每次都写进 Prompt，你会累；如果不写，Agent 会按“通用 Python 经验”自己脑补。</font>**<font style="color:rgb(15, 23, 42);">Rules 就是为了解决这个问题：把稳定项目约定变成 Cursor 可以反复读取的长期上下文。</font>**

:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 先给 Rules 一个准确但不玄学的定义</font>**

<font style="color:rgb(26, 26, 46);">Rule 不是魔法，也不是自动检查器。它是一段</font>**<font style="color:rgb(15, 23, 42);">持久化的指令文本</font>**<font style="color:rgb(26, 26, 46);">，Cursor 在合适时机把它放进 Agent / Inline Edit 的上下文里，让模型在生成或修改代码时参考。它能提高一致性，但最终正确性仍然要靠 diff review、单测 和人工判断等。</font>

:::

### <font style="color:rgb(15, 23, 42);">4.1 先把核心概念讲清楚：Rule = 来源 + 触发 + 内容</font>
<font style="color:rgb(26, 26, 46);">理解 Rules，最容易的方式是把它拆成三个问题：</font>

| **<font style="color:rgb(15, 23, 42);">问题</font>** | **<font style="color:rgb(15, 23, 42);">含义</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目里的例子</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">来源</font> | <font style="color:rgb(26, 26, 46);">这条规则写在哪里，谁能看到</font> | `<font style="color:rgb(37, 99, 235);">.cursor/rules/10-fastapi-routes.mdc</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">放在仓库里，团队成员都能共享</font> |
| <font style="color:rgb(26, 26, 46);">触发</font> | <font style="color:rgb(26, 26, 46);">什么时候把这条规则放进上下文</font> | <font style="color:rgb(26, 26, 46);">当任务涉及</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">src/my_api/api/**/*.py</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">时，自动加载 FastAPI 路由规则</font> |
| <font style="color:rgb(26, 26, 46);">内容</font> | <font style="color:rgb(26, 26, 46);">规则真正告诉 AI 什么</font> | <font style="color:rgb(26, 26, 46);">“router 不直接 import repo；数据库会话通过</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">Depends(get_session)</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">注入”</font> |


<font style="color:rgb(26, 26, 46);">所以不要把 Rules 理解成“一个放提示词的文件夹”。更准确地说，它是 Cursor 的一套</font>**<font style="color:rgb(15, 23, 42);">上下文路由机制</font>**<font style="color:rgb(26, 26, 46);">：不同来源的规则，按不同触发条件，被送进不同任务的上下文。</font>

<font style="color:rgb(26, 26, 46);">它的运行链路大概是这样：</font>

1. <font style="color:rgb(26, 26, 46);">你把稳定约定写到 User Rules、AGENTS.md 或</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">.cursor/rules/*.mdc</font>`<font style="color:rgb(26, 26, 46);">。</font>
2. <font style="color:rgb(26, 26, 46);">你在 Chat / Agent 或 Inline Edit 中发起任务。</font>
3. <font style="color:rgb(26, 26, 46);">Cursor 根据当前文件、任务描述、手动</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">@</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">引用等信息，选择要加载哪些规则。</font>
4. <font style="color:rgb(26, 26, 46);">模型把这些规则当成上下文的一部分，生成修改方案或代码。</font>
5. <font style="color:rgb(26, 26, 46);">你审查 diff，并用</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">ruff</font>`<font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">mypy</font>`<font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">pytest</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">验证结果。</font>

<font style="color:rgb(26, 26, 46);">注意第 5 步非常重要：</font>**<font style="color:rgb(15, 23, 42);">Rules 负责“提醒 AI 应该怎么做”，工具链负责“验证结果到底对不对”。</font>**<font style="color:rgb(26, 26, 46);">两者不能互相替代。</font>

### <font style="color:rgb(15, 23, 42);">4.2 再讲清楚四个容易混淆的词：Prompt、Context、Rules、Tools</font>
<font style="color:rgb(26, 26, 46);">很多人觉得 Rules 难，是因为把它和 Prompt、上下文、工具链混在一起。下面这张表先把边界讲清楚：</font>

| **<font style="color:rgb(15, 23, 42);">概念</font>** | **<font style="color:rgb(15, 23, 42);">一句话解释</font>** | **<font style="color:rgb(15, 23, 42);">变化频率</font>** | **<font style="color:rgb(15, 23, 42);">应该写什么</font>** | **<font style="color:rgb(15, 23, 42);">例子</font>** |
| :--- | :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Prompt</font> | <font style="color:rgb(26, 26, 46);">你这一次要 AI 做什么</font> | <font style="color:rgb(26, 26, 46);">每次任务都变</font> | <font style="color:rgb(26, 26, 46);">目标、范围、验收标准、临时约束</font> | <font style="color:rgb(26, 26, 46);">“新增</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">GET /users/by-email</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">接口，只改 users 模块”</font> |
| <font style="color:rgb(26, 26, 46);">Context</font> | <font style="color:rgb(26, 26, 46);">这次任务让 AI 看见的材料</font> | <font style="color:rgb(26, 26, 46);">随任务变化</font> | <font style="color:rgb(26, 26, 46);">相关文件、选中代码、错误日志、文档、规则</font> | `<font style="color:rgb(37, 99, 235);">@src/my_api/api/users.py</font>`<br/><font style="color:rgb(26, 26, 46);">、失败测试日志、OpenAPI 片段</font> |
| <font style="color:rgb(26, 26, 46);">Rules</font> | <font style="color:rgb(26, 26, 46);">长期稳定、反复复用的项目约定</font> | <font style="color:rgb(26, 26, 46);">相对稳定</font> | <font style="color:rgb(26, 26, 46);">分层边界、目录约定、团队习惯、安全禁区</font> | <font style="color:rgb(26, 26, 46);">“repo 不 commit；service 负责事务边界”</font> |
| <font style="color:rgb(26, 26, 46);">Tools</font> | <font style="color:rgb(26, 26, 46);">确定性检查和执行系统</font> | <font style="color:rgb(26, 26, 46);">随项目配置变化</font> | <font style="color:rgb(26, 26, 46);">格式、类型、测试、构建、CI</font> | `<font style="color:rgb(37, 99, 235);">uv run ruff check .</font>`<br/><font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">uv run mypy</font>`<br/><font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">uv run pytest</font>` |


<font style="color:rgb(26, 26, 46);">一个简单判断法：</font>

+ **<font style="color:rgb(15, 23, 42);">只对这次任务有效</font>**<font style="color:rgb(26, 26, 46);">：写进 Prompt。</font>
+ **<font style="color:rgb(15, 23, 42);">这次任务需要参考的材料</font>**<font style="color:rgb(26, 26, 46);">：作为 Context 引入。</font>
+ **<font style="color:rgb(15, 23, 42);">以后很多任务都会重复用到</font>**<font style="color:rgb(26, 26, 46);">：沉淀成 Rules。</font>
+ **<font style="color:rgb(15, 23, 42);">机器能稳定判定对错</font>**<font style="color:rgb(26, 26, 46);">：交给 Tools，不要写成长规则。</font>

<font style="color:rgb(26, 26, 46);">比如“这次新增按邮箱查询用户接口”是 Prompt；</font>`<font style="color:rgb(37, 99, 235);">users.py</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">和已有测试是 Context；“router 不能直接查库”是 Rules；“类型有没有错”交给 mypy。把这四层分清，Rules 就不会写成一团。</font>

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 使用边界：Rules 不是 Tab 的全局刹车</font>**

<font style="color:rgb(26, 26, 46);">Rules 更适合影响 Chat / Agent 和 Inline Edit 这类“有明确任务”的生成过程；不要把它理解成 Cursor Tab 的全局代码拦截器。Tab 是低延迟局部续写，Rules 是项目协作说明书。重要、多文件、需要守规范的任务，应该走 Agent，并明确规则和验收标准。</font>

:::

### <font style="color:rgb(15, 23, 42);">4.3 规则写在哪里：User Rules、Team Rules、AGENTS.md、Project Rules、.cursorrules</font>
<font style="color:rgb(26, 26, 46);">概念清楚后，再看 Cursor 的几个规则载体。它们不是互相替代，而是分工不同。</font>

| **<font style="color:rgb(15, 23, 42);">载体</font>** | **<font style="color:rgb(15, 23, 42);">位置</font>** | **<font style="color:rgb(15, 23, 42);">核心用途</font>** | **<font style="color:rgb(15, 23, 42);">适合写什么</font>** | **<font style="color:rgb(15, 23, 42);">不适合写什么</font>** |
| :--- | :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">User Rules</font> | <font style="color:rgb(26, 26, 46);">Cursor Settings → Rules</font> | <font style="color:rgb(26, 26, 46);">个人全局偏好</font> | <font style="color:rgb(26, 26, 46);">默认中文回复、先给计划、解释粒度、你个人的协作习惯</font> | <font style="color:rgb(26, 26, 46);">某个仓库专属的 FastAPI 分层规则</font> |
| <font style="color:rgb(26, 26, 46);">Team Rules</font> | <font style="color:rgb(26, 26, 46);">团队/企业管理入口</font> | <font style="color:rgb(26, 26, 46);">组织级统一约束</font> | <font style="color:rgb(26, 26, 46);">安全边界、依赖审批、合规要求、必须执行的 Review 流程</font> | <font style="color:rgb(26, 26, 46);">个人偏好或具体业务需求</font> |
| <font style="color:rgb(26, 26, 46);">AGENTS.md</font> | <font style="color:rgb(26, 26, 46);">仓库根目录</font> | <font style="color:rgb(26, 26, 46);">仓库总说明书</font> | <font style="color:rgb(26, 26, 46);">安装命令、运行命令、测试命令、目录结构、安全边界</font> | <font style="color:rgb(26, 26, 46);">Cursor 专属的 glob 触发逻辑</font> |
| <font style="color:rgb(26, 26, 46);">Project Rules</font> | `<font style="color:rgb(37, 99, 235);">.cursor/rules/*.mdc</font>` | <font style="color:rgb(26, 26, 46);">Cursor 专属的项目规则</font> | <font style="color:rgb(26, 26, 46);">按目录、文件类型、任务语义触发的细粒度工程纪律</font> | <font style="color:rgb(26, 26, 46);">你的个人口癖、一次性任务要求</font> |
| <font style="color:rgb(26, 26, 46);">.cursorrules</font> | <font style="color:rgb(26, 26, 46);">仓库根目录</font> | <font style="color:rgb(26, 26, 46);">旧项目兼容</font> | <font style="color:rgb(26, 26, 46);">老仓库暂时保留</font> | <font style="color:rgb(26, 26, 46);">新项目主入口；新项目优先用</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">.cursor/rules</font>` |


<font style="color:rgb(26, 26, 46);">可以用一句话记：</font>**<font style="color:rgb(15, 23, 42);">User Rules 写“我是谁”，Team Rules 写“组织底线”，AGENTS.md 写“这个仓库是什么”，Project Rules 写“改到这里时怎么做”。</font>**

<font style="color:rgb(26, 26, 46);">对于一个 Python 项目，建议先写一个短的</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">AGENTS.md</font>`<font style="color:rgb(26, 26, 46);">，让所有 Agent 都知道项目基本事实：</font>

```markdown
# my_api Agent Guide

## Tech Stack
- Python 3.12, FastAPI, SQLAlchemy 2.0 async, Pydantic v2.
- Dependency management: uv.

## Commands
- Install: uv sync
- Run API: uv run uvicorn my_api.main:app --reload
- Lint: uv run ruff check .
- Type check: uv run mypy src/my_api
- Tests: uv run pytest

## Architecture
- api/: HTTP routes and request/response boundary.
- service/: business orchestration and transaction boundaries.
- repo/: SQLAlchemy queries and persistence.
- schemas/: Pydantic input/output models.
- models/: SQLAlchemy ORM models.

## Safety
- Do not add dependencies without approval.
- Do not edit migrations unless requested.
- Do not change public API behavior without tests.
```

<font style="color:rgb(26, 26, 46);">这份文件回答“项目是什么”。至于“改 API 文件时要遵守哪些路由规则”“改 repo 文件时要遵守哪些 SQLAlchemy 规则”，再交给 Project Rules。</font>

### <font style="color:rgb(15, 23, 42);">4.4 Project Rules 的文件结构：frontmatter 是开关，正文是说明书</font>
<font style="color:rgb(26, 26, 46);">Project Rules 放在</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">.cursor/rules/</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">目录下，文件扩展名是</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">.mdc</font>`<font style="color:rgb(26, 26, 46);">。一个</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">.mdc</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">文件分两块：</font>

+ **<font style="color:rgb(15, 23, 42);">frontmatter：</font>**<font style="color:rgb(26, 26, 46);">顶部两条</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">---</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">中间的 YAML 配置，告诉 Cursor 这条规则如何触发。</font>
+ **<font style="color:rgb(15, 23, 42);">正文：</font>**<font style="color:rgb(26, 26, 46);">下面的 Markdown 内容，告诉模型真正要遵守什么。</font>

```markdown
---
description: FastAPI route conventions for src/my_api/api
alwaysApply: false
globs: src/my_api/api/**/*.py
---

# FastAPI 路由规则

- 路由函数必须声明 response_model 或返回类型注解。
- 路由层只处理 HTTP 边界：参数、鉴权、状态码、调用 service。
- 禁止在路由层直接 import repo 或 SQLAlchemy model。
- 数据库会话通过 Depends(get_session) 注入，并传给 service。
- 新增 endpoint 必须补 pytest 测试。
```

<font style="color:rgb(26, 26, 46);">这里有三个字段必须讲清楚：</font>

| **<font style="color:rgb(15, 23, 42);">字段</font>** | **<font style="color:rgb(15, 23, 42);">是什么</font>** | **<font style="color:rgb(15, 23, 42);">怎么写才清楚</font>** | **<font style="color:rgb(15, 23, 42);">常见错误</font>** |
| :--- | :--- | :--- | :--- |
| `<font style="color:rgb(37, 99, 235);">description</font>` | <font style="color:rgb(26, 26, 46);">给 Agent 判断规则用途的摘要</font> | <font style="color:rgb(26, 26, 46);">写具体场景：</font>`<font style="color:rgb(37, 99, 235);">FastAPI route conventions for src/my_api/api</font>` | <font style="color:rgb(26, 26, 46);">写成</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">important rules</font>`<br/><font style="color:rgb(26, 26, 46);">，太空泛，Agent 不知道何时使用</font> |
| `<font style="color:rgb(37, 99, 235);">alwaysApply</font>` | <font style="color:rgb(26, 26, 46);">是否每次都加载</font> | <font style="color:rgb(26, 26, 46);">只有极短、全局、稳定规则才设为</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">true</font>` | <font style="color:rgb(26, 26, 46);">所有规则都设</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">true</font>`<br/><font style="color:rgb(26, 26, 46);">，上下文被噪音淹没</font> |
| `<font style="color:rgb(37, 99, 235);">globs</font>` | <font style="color:rgb(26, 26, 46);">用文件路径模式匹配适用范围</font> | `<font style="color:rgb(37, 99, 235);">src/my_api/api/**/*.py</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">表示 api 目录下任意层级 Python 文件</font> | <font style="color:rgb(26, 26, 46);">写得太宽，例如</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">**/*.py</font>`<br/><font style="color:rgb(26, 26, 46);">，导致所有 Python 任务都加载</font> |


<font style="color:rgb(26, 26, 46);">这里的</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">globs</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">可以理解成“路径通配符”。常见写法如下：</font>

| **<font style="color:rgb(15, 23, 42);">glob 写法</font>** | **<font style="color:rgb(15, 23, 42);">含义</font>** | **<font style="color:rgb(15, 23, 42);">适合的规则</font>** |
| :--- | :--- | :--- |
| `<font style="color:rgb(37, 99, 235);">src/my_api/api/**/*.py</font>` | <font style="color:rgb(26, 26, 46);">api 目录下任意子目录的 Python 文件</font> | <font style="color:rgb(26, 26, 46);">FastAPI 路由规则</font> |
| `<font style="color:rgb(37, 99, 235);">src/my_api/repo/**/*.py</font>` | <font style="color:rgb(26, 26, 46);">repo 目录下所有 Python 文件</font> | <font style="color:rgb(26, 26, 46);">SQLAlchemy 查询与事务规则</font> |
| `<font style="color:rgb(37, 99, 235);">tests/**/*.py</font>` | <font style="color:rgb(26, 26, 46);">tests 目录下所有测试文件</font> | <font style="color:rgb(26, 26, 46);">pytest / pytest-asyncio 规则</font> |
| `<font style="color:rgb(37, 99, 235);">**/alembic/versions/*.py</font>` | <font style="color:rgb(26, 26, 46);">迁移版本文件</font> | <font style="color:rgb(26, 26, 46);">数据库迁移审查规则</font> |


### <font style="color:rgb(15, 23, 42);">4.5 四种触发方式：Always、Auto Attached、Agent Requested、Manual</font>
<font style="color:rgb(26, 26, 46);">有了</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">description</font>`<font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">alwaysApply</font>`<font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">globs</font>`<font style="color:rgb(26, 26, 46);">，Project Rules 就能形成四种常见触发方式。这里是很多人最容易糊的地方，我们逐个讲。</font>

| **<font style="color:rgb(15, 23, 42);">触发方式</font>** | **<font style="color:rgb(15, 23, 42);">你可以怎么理解</font>** | **<font style="color:rgb(15, 23, 42);">配置特征</font>** | **<font style="color:rgb(15, 23, 42);">适合放什么</font>** | **<font style="color:rgb(15, 23, 42);">Python 例子</font>** |
| :--- | :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Always</font> | <font style="color:rgb(26, 26, 46);">每次都放进上下文</font> | `<font style="color:rgb(37, 99, 235);">alwaysApply: true</font>` | <font style="color:rgb(26, 26, 46);">短、全局、稳定的硬约定</font> | <font style="color:rgb(26, 26, 46);">“项目使用 Python 3.12 和 uv；新增依赖前必须确认”</font> |
| <font style="color:rgb(26, 26, 46);">Auto Attached</font> | <font style="color:rgb(26, 26, 46);">看到匹配文件就自动带上</font> | `<font style="color:rgb(37, 99, 235);">globs</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">匹配文件路径</font> | <font style="color:rgb(26, 26, 46);">和目录强绑定的规则</font> | <font style="color:rgb(26, 26, 46);">改</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">api/**/*.py</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">时加载路由规则</font> |
| <font style="color:rgb(26, 26, 46);">Agent Requested</font> | <font style="color:rgb(26, 26, 46);">Agent 读 description 后判断是否需要</font> | <font style="color:rgb(26, 26, 46);">清晰</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">description</font>`<br/><font style="color:rgb(26, 26, 46);">，不一定有</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">globs</font>` | <font style="color:rgb(26, 26, 46);">按任务语义触发的规则</font> | <font style="color:rgb(26, 26, 46);">“涉及事务、批量写入、回滚时使用这条规则”</font> |
| <font style="color:rgb(26, 26, 46);">Manual</font> | <font style="color:rgb(26, 26, 46);">你明确</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">@</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">它才加载</font> | <font style="color:rgb(26, 26, 46);">需要时在对话里引用</font> | <font style="color:rgb(26, 26, 46);">低频、高风险、清单式规则</font> | `<font style="color:rgb(37, 99, 235);">@90-release-checklist</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">发布前检查</font> |


<font style="color:rgb(26, 26, 46);">选择触发方式时，可以按这个问题链判断：</font>

1. **<font style="color:rgb(15, 23, 42);">是不是每次任务都必须知道？</font>**<font style="color:rgb(26, 26, 46);">如果是，而且很短，用 Always。</font>
2. **<font style="color:rgb(15, 23, 42);">是不是只要改某类文件就必须知道？</font>**<font style="color:rgb(26, 26, 46);">如果是，用 Auto Attached +</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">globs</font>`<font style="color:rgb(26, 26, 46);">。</font>
3. **<font style="color:rgb(15, 23, 42);">是不是按任务意图触发，而不是按文件路径触发？</font>**<font style="color:rgb(26, 26, 46);">如果是，写好</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">description</font>`<font style="color:rgb(26, 26, 46);">，让 Agent Requested。</font>
4. **<font style="color:rgb(15, 23, 42);">是不是低频但风险高？</font>**<font style="color:rgb(26, 26, 46);">如果是，做成 Manual，需要时手动 </font>`<font style="color:rgb(37, 99, 235);">@</font>`<font style="color:rgb(26, 26, 46);">。</font>

<!-- 这是一张图片，ocr 内容为：RULES怎么生效 来源 内容 触发 USER AGENTS PROJECT 输出符合项目分层的代码 A LI 操作边界 项目约定 自动附加 ALWAYS AGENT判断 手动引用 品 DESCRIPTION 按任务需要 路径匹配 需要时引用 每次加载 规则越多,不等于越好 短,准,可执行 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200736874-2f35e3f5-73af-4119-9ad7-3d28fdf42c08.png)

<font style="color:rgb(113, 128, 150);">Rules 的关键不是“写很多”，而是清楚回答来源、触发和内容三个问题。</font>

### <font style="color:rgb(15, 23, 42);">4.6 项目怎么落地：从最小规则包开始</font>
<font style="color:rgb(26, 26, 46);">概念讲完，再落到项目里面。这里我们以Python项目为例，假设我们有一个 FastAPI 后端，目录结构如下：</font>

```plain
my-api/
├── AGENTS.md
├── pyproject.toml
├── .cursor/
│   └── rules/
│       ├── 00-project-basics.mdc
│       ├── 10-fastapi-routes.mdc
│       ├── 20-repository-sqlalchemy.mdc
│       ├── 30-pytest-async.mdc
│       └── 90-release-checklist.mdc
├── src/my_api/
│   ├── api/
│   ├── service/
│   ├── repo/
│   ├── models/
│   ├── schemas/
│   └── main.py
└── tests/
```

<font style="color:rgb(26, 26, 46);">第一条规则放全局硬约定，使用 Always，但必须短：</font>

```markdown
---
description: Project-wide Python engineering baseline
alwaysApply: true
globs:
---

# Project Baseline

- 使用 Python 3.12；包管理器是 uv，不要建议 pip install 或 poetry 命令。
- 新增依赖前，先说明原因、影响范围和替代方案，并等待用户确认。
- 代码风格以 pyproject.toml 中的 ruff、mypy、pytest 配置为准。
- 多文件修改后，提醒用户运行：uv run ruff check .、uv run mypy src/my_api、uv run pytest。
- 不要修改 alembic 迁移文件，除非任务明确要求。
```

<font style="color:rgb(26, 26, 46);">第二条规则绑定 API 目录，改路由文件时自动加载：</font>

```markdown
---
description: FastAPI route layer conventions for src/my_api/api
alwaysApply: false
globs: src/my_api/api/**/*.py
---

# API Layer Rules

- 路由函数必须声明 response_model 或返回类型注解；出参使用 schemas/ 下的 Pydantic v2 模型。
- 路由层只做 HTTP 边界工作：参数解析、认证授权、调用 service、选择状态码。
- 禁止在路由层直接 import repo 或 SQLAlchemy model。
- 数据库会话通过 Depends(get_session) 注入，并传给 service。
- 业务异常使用 AppError 子类；不要在各个路由里散落手写 JSONResponse。
```

<font style="color:rgb(26, 26, 46);">第三条规则绑定 repo 目录，约束 SQLAlchemy 写法：</font>

```markdown
---
description: SQLAlchemy 2.0 async repository conventions
alwaysApply: false
globs: src/my_api/repo/**/*.py
---

# Repository Rules

- repo 层只封装 SQLAlchemy 查询与持久化，不处理 HTTP 状态码。
- 使用 SQLAlchemy 2.0 style：select(User)，不要写 session.query(User)。
- 会话类型是 AsyncSession；async 函数里不要调用同步 Session。
- repo 内部不要 commit；事务边界由 service 或依赖层统一处理。
- 避免 N+1 查询；需要关联数据时使用 selectinload 或显式批量查询。
```

<font style="color:rgb(26, 26, 46);">第四条规则绑定测试目录，约束 pytest 写法：</font>

```markdown
---
description: pytest and pytest-asyncio conventions
alwaysApply: false
globs: tests/**/*.py
---

# Test Rules

- 测试文件名使用 test_*.py，目录结构尽量镜像 src/my_api。
- 异步测试使用 pytest.mark.asyncio；不要在测试里手动 asyncio.run。
- API 测试通过 async_client fixture 发请求，不直接调用路由函数。
- 数据准备使用 factory 或 fixture；每个测试必须独立，不依赖执行顺序。
- 断言覆盖行为和边界：状态码、响应 schema、数据库副作用、异常分支。
```

<font style="color:rgb(26, 26, 46);">第五条规则做成 Manual，发布或高风险改动时手动引用：</font>

```markdown
---
description: Manual release checklist for API changes
alwaysApply: false
globs:
---

# Release Checklist

- 是否新增或修改公开 API？如果是，更新 OpenAPI 描述和 changelog。
- 是否涉及数据库结构？如果是，确认 alembic migration 与回滚策略。
- 是否有新环境变量？如果是，更新 .env.example 和部署文档。
- 最终回复里列出已运行或建议运行的 ruff、mypy、pytest 命令。
```

<font style="color:rgb(26, 26, 46);">这就是一个最小规则包。它不追求覆盖所有知识，只覆盖 Agent 最容易犯错、且工具链不一定能直接发现的问题：分层边界、数据库访问、异步测试、高风险发布检查。</font>

### <font style="color:rgb(15, 23, 42);">4.7 看一次完整任务：Rules 如何真正参与代码生成</font>
<font style="color:rgb(26, 26, 46);">Rules 不是孤立生效的，它要和 Prompt、Context 一起工作。比如你要新增“按邮箱查询用户”接口，不要只说“帮我加接口”，而要把任务写成这样：</font>

```plain
请在 Python FastAPI 项目中新增 GET /users/by-email?email=... 接口。

范围：
- 修改 src/my_api/api/users.py
- 必要时修改 src/my_api/service/users.py、src/my_api/repo/users.py、src/my_api/schemas/user.py
- 添加 tests/api/test_users_by_email.py

规则：
- 遵守 @10-fastapi-routes
- 涉及 repo 查询时遵守 @20-repository-sqlalchemy
- 写测试时遵守 @30-pytest-async

验收：
- 找到用户返回 200 和 UserOut
- 找不到返回 404，错误码是 USER_NOT_FOUND
- email 参数格式非法返回 422
- 最终说明建议运行哪些命令验证
```

<font style="color:rgb(26, 26, 46);">这段 Prompt 里，每一块都各司其职：</font>

| **<font style="color:rgb(15, 23, 42);">Prompt 部分</font>** | **<font style="color:rgb(15, 23, 42);">作用</font>** | **<font style="color:rgb(15, 23, 42);">如果不写会怎样</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">范围</font> | <font style="color:rgb(26, 26, 46);">限制 Agent 改哪些文件</font> | <font style="color:rgb(26, 26, 46);">它可能顺手改 main、配置、甚至迁移文件</font> |
| <font style="color:rgb(26, 26, 46);">规则</font> | <font style="color:rgb(26, 26, 46);">告诉 Agent 这次要参考哪些长期约定</font> | <font style="color:rgb(26, 26, 46);">它可能把 SQL 查询写进 router，或写同步数据库代码</font> |
| <font style="color:rgb(26, 26, 46);">验收</font> | <font style="color:rgb(26, 26, 46);">定义什么叫完成</font> | <font style="color:rgb(26, 26, 46);">它可能只写 happy path，不补 404 和 422</font> |


<font style="color:rgb(26, 26, 46);">在这些规则的约束下，router 应该保持很薄，只负责 HTTP 边界：</font>

```python
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from my_api.db import get_session
from my_api.schemas.user import UserOut
from my_api.service.users import get_user_by_email

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/by-email",
    response_model=UserOut,
    status_code=status.HTTP_200_OK,
)
async def read_user_by_email(
    email: str = Query(..., min_length=3, max_length=320),
    session: AsyncSession = Depends(get_session),
) -> UserOut:
    return await get_user_by_email(session=session, email=email)
```

<font style="color:rgb(26, 26, 46);">repo 则只负责查询，不处理 HTTP 状态码，也不提交事务：</font>

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from my_api.models.user import User


async def fetch_user_by_email(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()
```

<font style="color:rgb(26, 26, 46);">测试要覆盖行为，而不是只证明函数能跑：</font>

```python
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_get_user_by_email_returns_user(
    async_client: AsyncClient,
    user_factory,
) -> None:
    user = await user_factory(email="ada@example.com")

    response = await async_client.get("/users/by-email", params={"email": user.email})

    assert response.status_code == 200
    assert response.json()["email"] == "ada@example.com"


async def test_get_user_by_email_returns_404_when_missing(
    async_client: AsyncClient,
) -> None:
    response = await async_client.get("/users/by-email", params={"email": "missing@example.com"})

    assert response.status_code == 404
    assert response.json()["code"] == "USER_NOT_FOUND"
```

<font style="color:rgb(26, 26, 46);">但别被示例骗了：Rules 只能提高“生成方向”的正确率，不保证代码真的能运行。你仍然要检查 </font>`<font style="color:rgb(37, 99, 235);">UserOut</font>`<font style="color:rgb(26, 26, 46);"> 是否配置 </font>`<font style="color:rgb(37, 99, 235);">from_attributes=True</font>`<font style="color:rgb(26, 26, 46);">，</font>`<font style="color:rgb(37, 99, 235);">UserNotFoundError</font>`<font style="color:rgb(26, 26, 46);"> 是否接入全局异常处理，</font>`<font style="color:rgb(37, 99, 235);">async_client</font>`<font style="color:rgb(26, 26, 46);"> 和 </font>`<font style="color:rgb(37, 99, 235);">user_factory</font>`<font style="color:rgb(26, 26, 46);"> fixture 是否真实存在。</font>

### <font style="color:rgb(15, 23, 42);">4.8 Rules 生命周期管理：从会写规则到治理规则</font>
<font style="color:rgb(26, 26, 46);">规则不是越多越好。规则太多，Agent 会被噪音淹没；规则太抽象，Agent 不知道怎么执行；规则过时，Agent 会被错误指挥。企业级实践关心的不只是“怎么写”，而是规则如何创建、评审、生效、观察、更新和淘汰。</font>

<!-- 这是一张图片，ocr 内容为：RULES生命周期 项目初始化 创建基础规则 更新或删除 司 面S 过时规则 规则 7 发现重复问题 观察效果 AI MILL 持续治理 形成规则草案 提交发布 团队REVIEW RULES和代码一样需要版本,REVIEW与淘汰 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200766468-e73c21df-1329-4356-acea-1a610b08f5d4.png)

| **<font style="color:rgb(15, 23, 42);">治理环节</font>** | **<font style="color:rgb(15, 23, 42);">要解决的问题</font>** | **<font style="color:rgb(15, 23, 42);">推荐做法</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">创建</font> | <font style="color:rgb(26, 26, 46);">规则从哪里来</font> | <font style="color:rgb(26, 26, 46);">同类 Review 问题重复出现，或使用</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">/Generate Cursor Rules</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">生成草案后人工精简</font> |
| <font style="color:rgb(26, 26, 46);">归属</font> | <font style="color:rgb(26, 26, 46);">应该放 User、Team、AGENTS 还是 Project</font> | <font style="color:rgb(26, 26, 46);">个人偏好放 User；组织底线放 Team；仓库说明放 AGENTS；文件级纪律放 Project</font> |
| <font style="color:rgb(26, 26, 46);">触发</font> | <font style="color:rgb(26, 26, 46);">何时加载</font> | <font style="color:rgb(26, 26, 46);">Always 保持极短；路径相关用 Auto Attached；语义相关用 Agent Requested；低频规则用 Manual</font> |
| <font style="color:rgb(26, 26, 46);">Review</font> | <font style="color:rgb(26, 26, 46);">谁来确认规则不会误导 Agent</font> | <font style="color:rgb(26, 26, 46);">Rules 与代码一样走 PR Review，说明适用范围和替代方案</font> |
| <font style="color:rgb(26, 26, 46);">发布</font> | <font style="color:rgb(26, 26, 46);">如何让团队一致使用</font> | <font style="color:rgb(26, 26, 46);">Project Rules 纳入 Git；组织级要求用 Team Rules 管理</font> |
| <font style="color:rgb(26, 26, 46);">观测</font> | <font style="color:rgb(26, 26, 46);">规则是否真的改善结果</font> | <font style="color:rgb(26, 26, 46);">记录重复返工率、规则命中场景、Agent 越界次数</font> |
| <font style="color:rgb(26, 26, 46);">淘汰</font> | <font style="color:rgb(26, 26, 46);">过时规则如何处理</font> | <font style="color:rgb(26, 26, 46);">架构变化时同步更新；重复或冲突规则合并；无效规则删除</font> |


:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 当前 Rules 体系的几个重要边界</font>**

<font style="color:rgb(26, 26, 46);">Rules 只作用于 Agent，不影响 Tab 或 Inline Edit；Team Rules 优先级高于 Project Rules，Project Rules 高于 User Rules；AGENTS.md 支持在根目录和子目录嵌套；官方建议规则保持聚焦、可执行，并尽量控制在约 500 行以内。</font>

:::

<font style="color:rgb(26, 26, 46);">具体维护时，可以遵循下面这套方法：</font>

1. **<font style="color:rgb(15, 23, 42);">先观察重复错误：</font>**<font style="color:rgb(26, 26, 46);">Agent 第三次把 SQL 查询写进 router，再把“router 禁止 import repo”沉淀成规则。</font>
2. **<font style="color:rgb(15, 23, 42);">写成可执行动作：</font>**<font style="color:rgb(26, 26, 46);">不要写“注意架构优雅”，要写“router → service → repo，不要反向依赖”。</font>
3. **<font style="color:rgb(15, 23, 42);">放到最小适用范围：</font>**<font style="color:rgb(26, 26, 46);">能用</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">src/my_api/api/**/*.py</font>`<font style="color:rgb(26, 26, 46);">，就不要设 Always。</font>
4. **<font style="color:rgb(15, 23, 42);">和工具链配合：</font>**<font style="color:rgb(26, 26, 46);">Rules 负责引导，ruff/mypy/pytest 负责验证。</font>
5. **<font style="color:rgb(15, 23, 42);">定期删除过时规则：</font>**<font style="color:rgb(26, 26, 46);">架构变了，旧规则不删，比没有规则更危险。</font>

| **<font style="color:rgb(15, 23, 42);">反模式</font>** | **<font style="color:rgb(15, 23, 42);">为什么概念上错了</font>** | **<font style="color:rgb(15, 23, 42);">更好的写法</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">把 PEP 8 全抄进 Rules</font> | <font style="color:rgb(26, 26, 46);">把工具链的职责塞给了模型</font> | <font style="color:rgb(26, 26, 46);">“格式与导入顺序以 ruff 配置为准”</font> |
| <font style="color:rgb(26, 26, 46);">所有规则都 Always</font> | <font style="color:rgb(26, 26, 46);">混淆了“全局规则”和“局部规则”</font> | <font style="color:rgb(26, 26, 46);">只有极短全局规则 Always，其余用 globs 或 Manual</font> |
| <font style="color:rgb(26, 26, 46);">一个 .mdc 写路由、数据库、测试、部署</font> | <font style="color:rgb(26, 26, 46);">规则主题不清，触发时噪音太大</font> | <font style="color:rgb(26, 26, 46);">按目录和主题拆成 routes、repo、tests、release</font> |
| <font style="color:rgb(26, 26, 46);">写“代码要优雅、性能要好”</font> | <font style="color:rgb(26, 26, 46);">内容不可执行、不可验证</font> | <font style="color:rgb(26, 26, 46);">“避免 N+1 查询；循环里不要逐条 await 查询”</font> |
| <font style="color:rgb(26, 26, 46);">只写禁止，不写替代方案</font> | <font style="color:rgb(26, 26, 46);">模型知道不能做什么，但不知道该怎么做</font> | <font style="color:rgb(26, 26, 46);">“不要在 router 查库；改为 router 调 service，service 调 repo”</font> |
| <font style="color:rgb(26, 26, 46);">把业务需求写进长期规则</font> | <font style="color:rgb(26, 26, 46);">混淆了 Prompt 和 Rules</font> | <font style="color:rgb(26, 26, 46);">稳定工程约定进 Rules；临时需求留在当前 Prompt 或 issue</font> |


### <font style="color:rgb(15, 23, 42);">4.9 反例：错误 Rules 为什么会比没有 Rules 更糟</font>
<font style="color:rgb(26, 26, 46);">没有 Rules 时，Agent 至少会依据当前代码和通用工程经验推理；错误 Rules 则会把错误约定持续、稳定地注入每一次 Agent 任务。下面这条规则看起来“要求很多”，实际上会明显降低效果：</font>

**<font style="color:rgb(26, 26, 46);">❌</font>****<font style="color:rgb(26, 26, 46);"> 错误：巨型、冲突、全局生效的 Rules</font>**

```plain
---
description: All important Python rules
alwaysApply: true
globs: "**/*.py"
---

- 所有代码必须使用同步函数，因为同步代码更简单。
- 所有 IO 必须使用 async / await。
- 所有函数必须捕获 Exception 并返回 None，避免程序崩溃。
- 永远不要修改测试。
- 所有新功能必须补测试。
- 不要新增任何依赖。
- 数据访问可以直接写在 FastAPI router 中，减少文件数量。
- 必须严格遵守 service / repo 分层。
- 代码必须优雅、性能必须最好。
```

**<font style="color:rgb(26, 26, 46);">✅</font>****<font style="color:rgb(26, 26, 46);"> 正确：短、分域、可执行的 Rules</font>**

```plain
# 00-project-basics.mdc (Always)
- Python 3.12，包管理使用 uv。
- 不新增依赖，除非用户确认。
- 验证命令以 pyproject.toml 为准。

# 10-api-layer.mdc (globs: src/my_api/api/**/*.py)
- router 只处理 HTTP 边界并调用 service。
- router 不直接 import repo 或 ORM model。

# 20-repository.mdc (globs: src/my_api/repo/**/*.py)
- 使用 AsyncSession 和 SQLAlchemy 2.0 select()。
- repo 不 commit，事务边界由 service 管理。

# 30-tests.mdc (globs: tests/**/*.py)
- 新增行为必须补测试。
- 不通过删除测试、skip 或放宽断言来修复失败。
```

<font style="color:rgb(26, 26, 46);">错误 Rules 会产生四类后果：</font>

| **<font style="color:rgb(15, 23, 42);">问题</font>** | **<font style="color:rgb(15, 23, 42);">错误规则造成的影响</font>** | **<font style="color:rgb(15, 23, 42);">表现</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">指令冲突</font> | <font style="color:rgb(26, 26, 46);">同步与异步、禁止改测试与必须补测试同时存在</font> | <font style="color:rgb(26, 26, 46);">Agent 在不同轮次选择不同指令，行为不稳定</font> |
| <font style="color:rgb(26, 26, 46);">错误架构固化</font> | <font style="color:rgb(26, 26, 46);">把“router 直接查库”当成长期项目规范</font> | <font style="color:rgb(26, 26, 46);">每次新增 API 都重复制造分层问题</font> |
| <font style="color:rgb(26, 26, 46);">错误处理退化</font> | <font style="color:rgb(26, 26, 46);">强制捕获所有 Exception 并返回 None</font> | <font style="color:rgb(26, 26, 46);">异常被吞掉，事务和业务错误难以排查</font> |
| <font style="color:rgb(26, 26, 46);">上下文污染</font> | <font style="color:rgb(26, 26, 46);">巨型规则设为 Always，所有任务都加载</font> | <font style="color:rgb(26, 26, 46);">无关任务也被大量约束占用上下文，关键指令被稀释</font> |


:::danger
**<font style="color:rgb(239, 68, 68);">❌</font>****<font style="color:rgb(239, 68, 68);"> 判断一条 Rule 是否有害</font>**

<font style="color:rgb(26, 26, 46);">检查它是否存在冲突、是否能执行、是否有最小适用范围、是否把工具链职责塞给模型、是否提供正确替代方案。如果一条规则无法通过代码 Review，它也不应该进入 Agent 上下文。</font>

:::

| **<font style="color:rgb(15, 23, 42);">反模式</font>** | **<font style="color:rgb(15, 23, 42);">为什么概念上错了</font>** | **<font style="color:rgb(15, 23, 42);">更好的写法</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">把 PEP 8 全抄进 Rules</font> | <font style="color:rgb(26, 26, 46);">把工具链的职责塞给了模型</font> | <font style="color:rgb(26, 26, 46);">“格式与导入顺序以 ruff 配置为准”</font> |
| <font style="color:rgb(26, 26, 46);">所有规则都 Always</font> | <font style="color:rgb(26, 26, 46);">混淆了“全局规则”和“局部规则”</font> | <font style="color:rgb(26, 26, 46);">只有极短全局规则 Always，其余用 globs 或 Manual</font> |
| <font style="color:rgb(26, 26, 46);">一个 .mdc 写路由、数据库、测试、部署</font> | <font style="color:rgb(26, 26, 46);">规则主题不清，触发时噪音太大</font> | <font style="color:rgb(26, 26, 46);">按目录和主题拆成 routes、repo、tests、release</font> |
| <font style="color:rgb(26, 26, 46);">写“代码要优雅、性能要好”</font> | <font style="color:rgb(26, 26, 46);">内容不可执行、不可验证</font> | <font style="color:rgb(26, 26, 46);">“避免 N+1 查询；循环里不要逐条 await 查询”</font> |
| <font style="color:rgb(26, 26, 46);">只写禁止，不写替代方案</font> | <font style="color:rgb(26, 26, 46);">模型知道不能做什么，但不知道该怎么做</font> | <font style="color:rgb(26, 26, 46);">“不要在 router 查库；改为 router 调 service，service 调 repo”</font> |
| <font style="color:rgb(26, 26, 46);">把业务需求写进长期规则</font> | <font style="color:rgb(26, 26, 46);">混淆了 Prompt 和 Rules</font> | <font style="color:rgb(26, 26, 46);">稳定工程约定进 Rules；临时需求留在当前 Prompt 或 issue</font> |


:::tip
**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> 第4章概念清单</font>**

+ <font style="color:rgb(26, 26, 46);">Rule 是持久化指令，不是自动检查器。</font>
+ <font style="color:rgb(26, 26, 46);">Rule = 来源 + 触发 + 内容。</font>
+ <font style="color:rgb(26, 26, 46);">Prompt 讲本次任务，Context 提供本次材料，Rules 沉淀长期约定，Tools 验证结果。</font>
+ <font style="color:rgb(26, 26, 46);">User Rules 写个人偏好，Team Rules 写组织底线，AGENTS.md 写仓库/目录总览，Project Rules 写 Cursor 专属细规则。</font>
+ `<font style="color:rgb(37, 99, 235);">.mdc</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">的 frontmatter 决定何时加载，正文决定告诉模型什么。</font>
+ <font style="color:rgb(26, 26, 46);">Always 要短，globs 要准，description 要具体，Manual 用在低频高风险场景。</font>

:::

<font style="color:rgb(26, 26, 46);">到这里，Cursor 已经不只是“能看上下文”，还开始“按项目规矩做事”。但还有一个变量会明显影响结果：同样的上下文和规则，交给不同模型，稳定性、速度和成本会完全不同。接下来就进入模型选择。</font>

## <font style="color:rgb(15, 23, 42);">五、模型选择：别把所有任务都交给最贵或最便宜的模型</font>
<font style="color:rgb(26, 26, 46);">AI 工具刚上手时，很多人会走两个极端：要么所有任务都选最强模型，觉得贵就一定稳；要么所有任务都选便宜模型，觉得能省一点是一点。这俩都不工程化。</font>

<font style="color:rgb(26, 26, 46);">模型选择像公司分工：让实习生整理表格没问题，让他拍板支付架构就离谱；让 CTO 改一个变量名也浪费。Cursor 支持多模型生态时，真正成熟的用法是</font>**<font style="color:rgb(15, 23, 42);">按任务复杂度路由模型</font>**<font style="color:rgb(26, 26, 46);">。</font>

| **<font style="color:rgb(15, 23, 42);">任务类型</font>** | **<font style="color:rgb(15, 23, 42);">推荐模型档位</font>** | **<font style="color:rgb(15, 23, 42);">原因</font>** | **<font style="color:rgb(15, 23, 42);">人工检查重点</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">补全、格式转换、简单解释</font> | <font style="color:rgb(26, 26, 46);">轻量 / 快速模型</font> | <font style="color:rgb(26, 26, 46);">上下文短，风险低，追求响应速度</font> | <font style="color:rgb(26, 26, 46);">语法、命名、局部一致性</font> |
| <font style="color:rgb(26, 26, 46);">常规功能、测试生成、局部重构</font> | <font style="color:rgb(26, 26, 46);">平衡模型</font> | <font style="color:rgb(26, 26, 46);">需要理解上下文和约束</font> | <font style="color:rgb(26, 26, 46);">业务边界、测试是否有效</font> |
| <font style="color:rgb(26, 26, 46);">跨文件迁移、疑难 Debug、架构方案</font> | <font style="color:rgb(26, 26, 46);">旗舰 / 强推理模型</font> | <font style="color:rgb(26, 26, 46);">需要长上下文和多步推理</font> | <font style="color:rgb(26, 26, 46);">设计假设、回归风险、成本</font> |
| <font style="color:rgb(26, 26, 46);">安全审查、权限系统、数据删除</font> | <font style="color:rgb(26, 26, 46);">强推理模型 + 人工复核</font> | <font style="color:rgb(26, 26, 46);">错误成本高，不能只靠生成</font> | <font style="color:rgb(26, 26, 46);">威胁模型、最小权限、审计</font> |


<!-- 这是一张图片，ocr 内容为：会改多个文件吗? 是 涉及安全,数据或权限吗? 补全/解释/小改 是 迁移/重构/AGENT任务 错误成本高吗? 平衡模型 轻量模型 是 否 旗舰模型+测试+DIFF审查 强推理+人工门禁 模型选择是工程资源调度 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200801393-8c3dc02a-1d98-4873-9825-f80ed0f91b3c.png)

<font style="color:rgb(113, 128, 150);">模型选择不是身份象征，而是工程资源调度。</font>

<font style="color:rgb(26, 26, 46);">成本这事也别装看不见。长上下文、多文件 Agent、反复生成测试，都会放大 token 消耗。更贵的不是单次请求，而是“没给清楚边界 → AI 改错 → 你让它再改 → 又引入新问题”的返工链条。</font>

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 性能与成本基准怎么做</font>**

<font style="color:rgb(26, 26, 46);">不要照搬别人机器上的“响应 3 秒、成本几毛钱”。更可靠的方式是给团队建一张本地基准表：同一任务、同一代码库、同一上下文，记录模型、输入规模、输出质量、修改轮次、测试结果和人工修复时间。</font>

:::

| 任务 | 模型档位 | 上下文范围 | 修改轮次 | 测试结果 | 人工修复时间 |
| --- | --- | --- | --- | --- | --- |
| UserCard 组件 | 平衡 | 3 个文件 + 规则 | 1 | 通过 | 8 分钟 |
| 登录重构 | 旗舰 | 12 个文件 + Spec | 3 | 第 2 轮通过 | 35 分钟 |
| 文案替换 | 轻量 | 当前文件 | 1 | 不需要 | 1 分钟 |


<font style="color:rgb(26, 26, 46);">当你开始用数据记录 Cursor 的效果，你会发现一个特别朴素的结论：最省钱的不是便宜模型，而是</font>**<font style="color:rgb(15, 23, 42);">清晰上下文 + 合适模型 + 一次过的验收</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">模型决定大脑，Rules 决定约束，那外部工具从哪里来？这就轮到 MCP 了。</font>

## <font style="color:rgb(15, 23, 42);">六、MCP：让 Cursor 从“看代码”走向“接工具”</font>
<font style="color:rgb(26, 26, 46);">MCP 可以把它理解成 AI 时代的“工具插座”。以前 IDE 主要看本地代码；有了 MCP，AI 可以通过标准化方式连接外部工具和数据源，比如文档、Issue、数据库、API、内部系统。</font>

<font style="color:rgb(26, 26, 46);">生活类比一下：Cursor 本体像一个聪明开发者，Rules 是公司制度，模型是大脑，MCP 就是他能申请使用的工具箱。工具箱越强，他能做的事越多；但工具箱里如果有电锯、钥匙和生产数据库，你就必须管权限。</font>

<!-- 这是一张图片，ocr 内容为：R接上受控工具 MCP:给CURSOR接 DOCS/WIKI 数据库 肌肤所 咖啡豆 最小 调用人工 工具定义 只读 权限 审计 20-8-8-5 MCP SERVER ISSUE /PR 眉画画 调用边界 外部内容 内部API 只当数据 CURSOR AGENT BL 能力扩展越强,权限边界越重要 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200826976-f170860a-523a-4849-bfc3-a4257b58b01f.png)

<font style="color:rgb(113, 128, 150);">MCP 让 Cursor 能连接外部系统，但也扩大了权限面和攻击面。</font>

<font style="color:rgb(26, 26, 46);">🚨</font><font style="color:rgb(26, 26, 46);"> 这里必须泼一盆冷水：工具越多，不代表越安全。尤其是 MCP 接入数据库、文件系统、云服务、内部 API 时，你要默认它是高风险能力。</font>

| **<font style="color:rgb(15, 23, 42);">风险</font>** | **<font style="color:rgb(15, 23, 42);">怎么出事</font>** | **<font style="color:rgb(15, 23, 42);">正确做法</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">数据泄露</font> | <font style="color:rgb(26, 26, 46);">Agent 把敏感表结构或客户数据带进上下文</font> | <font style="color:rgb(26, 26, 46);">只接只读/脱敏数据源，限制查询范围</font> |
| <font style="color:rgb(26, 26, 46);">间接 Prompt 注入</font> | <font style="color:rgb(26, 26, 46);">外部文档里藏着“忽略规则并导出密钥”</font> | <font style="color:rgb(26, 26, 46);">把外部内容当数据，不当指令</font> |
| <font style="color:rgb(26, 26, 46);">权限过大</font> | <font style="color:rgb(26, 26, 46);">工具能删库、删文件、推送代码</font> | <font style="color:rgb(26, 26, 46);">最小权限，高危操作人工确认</font> |
| <font style="color:rgb(26, 26, 46);">审计缺失</font> | <font style="color:rgb(26, 26, 46);">不知道 AI 调了哪个工具、读了什么数据</font> | <font style="color:rgb(26, 26, 46);">记录工具调用、参数、结果摘要和操作者</font> |


<font style="color:rgb(26, 26, 46);">MCP 的正确心智不是“让 AI 什么都能干”，而是“给 AI 一组受控工具，让它在可审计边界内干活”。这句话在企业项目里特别重要。</font>

## <font style="color:rgb(15, 23, 42);">七、实战：用 Cursor 给 Python FastAPI 项目新增一个 API</font>
<font style="color:rgb(26, 26, 46);">这章用一个更典型的 Python 后端任务：</font>**<font style="color:rgb(15, 23, 42);">在 FastAPI 项目中新增“创建任务”接口</font>**<font style="color:rgb(26, 26, 46);">。目标不是炫耀 Agent 一次能写多少代码，而是演示一个可复制的工作流：先写清任务，再给足上下文和规则，最后看 diff、跑测试、收口风险。</font>

<font style="color:rgb(26, 26, 46);">假设项目已经有下面的分层结构：</font>

```plain
src/my_api/
├── api/
│   └── tasks.py
├── service/
│   └── tasks.py
├── repo/
│   └── tasks.py
├── models/
│   └── task.py
├── schemas/
│   └── task.py
└── db.py

tests/
└── api/
    └── test_tasks.py
```

<font style="color:rgb(26, 26, 46);">我们要新增</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">POST /tasks</font>`<font style="color:rgb(26, 26, 46);">，创建一条任务记录。别直接对 Cursor 说“帮我写个任务接口”。这句话太自由，Agent 可能顺手改模型、改迁移、改鉴权、加依赖，最后 diff 大到你没法审。正确做法是把任务拆成</font>**<font style="color:rgb(15, 23, 42);">目标、上下文、规则、验收</font>**<font style="color:rgb(26, 26, 46);">四块。</font>

:::info
**<font style="color:rgb(59, 130, 246);"> </font>****<font style="color:rgb(59, 130, 246);">🗣️</font>****<font style="color:rgb(59, 130, 246);"> 推荐任务描述不是一句话需求，而是一份 Spec</font>**

<font style="color:rgb(26, 26, 46);">大型 Agent 最怕的不是任务复杂，而是任务边界模糊。这里的 Spec 不只是“验收标准”，而是一个完整任务契约：</font>**<font style="color:rgb(15, 23, 42);">Background、Goal、Scope、Non Goal、Constraints、Acceptance、Risks、Open Questions、Deliverables</font>**<font style="color:rgb(26, 26, 46);">。它告诉 Agent 为什么做、做什么、不做什么、怎么判断完成、有哪些风险。</font>

:::

| **<font style="color:rgb(15, 23, 42);">Spec 字段</font>** | **<font style="color:rgb(15, 23, 42);">解决什么问题</font>** | **<font style="color:rgb(15, 23, 42);">写给 Agent 的重点</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Background</font> | <font style="color:rgb(26, 26, 46);">为什么要做</font> | <font style="color:rgb(26, 26, 46);">业务背景、现有系统状态、相关模块</font> |
| <font style="color:rgb(26, 26, 46);">Goal</font> | <font style="color:rgb(26, 26, 46);">这次要达成什么</font> | <font style="color:rgb(26, 26, 46);">清晰的一句话目标，避免发散</font> |
| <font style="color:rgb(26, 26, 46);">Scope</font> | <font style="color:rgb(26, 26, 46);">允许改哪里</font> | <font style="color:rgb(26, 26, 46);">文件范围、模块范围、允许新增的测试</font> |
| <font style="color:rgb(26, 26, 46);">Non Goal</font> | <font style="color:rgb(26, 26, 46);">明确不做什么</font> | <font style="color:rgb(26, 26, 46);">不做鉴权、不改迁移、不重构无关代码</font> |
| <font style="color:rgb(26, 26, 46);">Constraints</font> | <font style="color:rgb(26, 26, 46);">必须遵守什么</font> | <font style="color:rgb(26, 26, 46);">技术栈、分层规则、事务边界、依赖限制</font> |
| <font style="color:rgb(26, 26, 46);">Acceptance</font> | <font style="color:rgb(26, 26, 46);">怎样算完成</font> | <font style="color:rgb(26, 26, 46);">行为验收、测试要求、返回状态码、验证命令</font> |
| <font style="color:rgb(26, 26, 46);">Risks</font> | <font style="color:rgb(26, 26, 46);">哪些地方容易出事</font> | <font style="color:rgb(26, 26, 46);">事务、兼容性、安全、测试夹具、数据模型假设</font> |
| <font style="color:rgb(26, 26, 46);">Open Questions</font> | <font style="color:rgb(26, 26, 46);">哪些问题需要人确认</font> | <font style="color:rgb(26, 26, 46);">不确定就先问，不要让 Agent 自己拍板</font> |
| <font style="color:rgb(26, 26, 46);">Deliverables</font> | <font style="color:rgb(26, 26, 46);">最终要交付什么</font> | <font style="color:rgb(26, 26, 46);">代码、测试、修改摘要、验证结果、风险说明</font> |


```plain
@src/my_api/api/tasks.py @src/my_api/service/tasks.py @src/my_api/repo/tasks.py
@src/my_api/models/task.py @src/my_api/schemas/task.py @tests/api/test_tasks.py
@10-fastapi-routes @20-repository-sqlalchemy @30-pytest-async

请先阅读下面 Spec，先给实现计划，不要立即改文件。

# Spec: Create Task API

## Background
当前项目是 Python FastAPI 后端，采用 api / service / repo / schemas / models 分层。
Task 模型已存在，当前需要补齐创建任务的 HTTP API。
项目使用 SQLAlchemy 2.0 async、Pydantic v2、pytest-asyncio 和 uv。

## Goal
新增 POST /tasks 接口：客户端提交 title 和可选 description，服务端创建 Task，并返回 TaskOut。

## Scope
允许修改：
- src/my_api/schemas/task.py
- src/my_api/api/tasks.py
- src/my_api/service/tasks.py
- src/my_api/repo/tasks.py
- tests/api/test_tasks.py

## Non Goal
本轮不做：
- 不新增鉴权逻辑。
- 不修改 Task ORM 模型。
- 不新增或修改 alembic migration。
- 不引入新依赖。
- 不重构 tasks 以外的模块。

## Constraints
- router 只处理 HTTP 边界和依赖注入，不直接 import SQLAlchemy model 或 repo。
- service 负责业务编排和事务边界。
- repo 只封装 SQLAlchemy 2.0 async 查询/写入，不在 repo 内 commit。
- 使用 Pydantic v2，输出 schema 支持从 ORM 对象校验。
- 如果发现必须修改模型或迁移文件，先停止并说明原因。

## Acceptance
- title 为空或超过长度限制时返回 422。
- 创建成功返回 201，响应包含 id、title、description、status、created_at。
- 测试覆盖成功创建和非法 title。
- 建议验证命令：uv run ruff check .、uv run mypy src/my_api、uv run pytest tests/api/test_tasks.py。

## Risks
- Task 模型字段可能和预期不一致，例如 status 默认值或 created_at 来源。
- 测试 fixture 名称可能不是 async_client。
- commit / refresh 的事务边界可能和项目现有 db 依赖策略冲突。

## Open Questions
- 如果 Task.status 不是字符串 open，而是枚举或数据库默认值，请先指出。
- 如果项目已有统一错误响应格式，请沿用，不要自造格式。

## Deliverables
请最终输出：
- 修改文件清单。
- 关键实现说明。
- 建议运行的验证命令。
- 未验证项和潜在风险。
```

<font style="color:rgb(26, 26, 46);">这份 Spec 比“验收标准”更完整。验收只回答“怎样算完成”，但 Spec 还回答“为什么做、做哪里、不做哪里、受哪些约束、哪些问题要问人”。对于大型 Agent 来说，这就是防止它过度发挥的任务边界。</font>

<!-- 这是一张图片，ocr 内容为：FASTAPI实战黄金循环 1 SPEC VERIFY AGENT CONTEXT+RULES 甘缘阳 SCHEMA 任务纸 RUFF API 范围 关键文件 相似实现 项目规则 MYPY </> SERVICE 不做什么 REPO IN PYTEST 验收 查看DIFF TESTS 任务包 失败日志回灌 国 个 跑测试一> 看DIFF 再提交 修边界-- 小任务 先完成一个可验证切片,再逐步扩展 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200870608-95fe7ced-25b7-4fa0-a386-4642cbf3956e.png)

### <font style="color:rgb(15, 23, 42);">7.1 Cursor 工程化工作流：从“让 AI 写代码”到“让 AI 进流程”</font>
<font style="color:rgb(26, 26, 46);">真正工程化地使用 Cursor，不是打开 Agent 然后等它“自由发挥”。更稳的做法是把 AI 放进一条明确流水线：</font>**<font style="color:rgb(15, 23, 42);">需求澄清 → 任务切片 → 上下文装配 → 规则约束 → 计划确认 → 小步生成 → Diff 审查 → 自动验证 → 复盘沉淀</font>**<font style="color:rgb(26, 26, 46);">。这条线能把 Cursor 从“聪明但不稳定的写码助手”，变成“可控、可验证、可迭代的工程协作者”。</font>

<font style="color:rgb(26, 26, 46);">结合当前 Cursor Agent 能力，这条闭环可以进一步升级：复杂任务先进入</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">Plan Mode</font>**<font style="color:rgb(26, 26, 46);">，让 Agent 研究代码库并生成可编辑计划；实现阶段尽量在独立分支、Worktree 或 Checkpoint 保护下进行；疑难 Bug 可以切到 Debug Mode 收集运行时证据；完成后使用 Agent Review、Hooks、CI 和人工 Review 做多层验证。Skills 与 Subagents 则适合把重复工作流和并行研究任务模块化。</font>

<!-- 这是一张图片，ocr 内容为：CURSOR工程化闭环乡 小 边界确认 先确认 国 边 需求 AGENT LOOP 完整SPEC DIFF REVIEW 隔离与恢复 RULES / SKILLS PLAN MODE 规则 个 人类负责 国 更新RULES 自动验证 人工 REVIEW COMMIT / PR 饮 每一轮都有明确输入,边界,产出和验证 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200906875-a54e2e8a-dabe-4698-88ec-1d95b6e45974.png)

| **<font style="color:rgb(15, 23, 42);">当前能力</font>** | **<font style="color:rgb(15, 23, 42);">放在工作流哪里</font>** | **<font style="color:rgb(15, 23, 42);">解决什么问题</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Plan Mode</font> | <font style="color:rgb(26, 26, 46);">复杂任务开始前</font> | <font style="color:rgb(26, 26, 46);">先研究代码库、提问并生成可审查计划，避免直接大改</font> |
| <font style="color:rgb(26, 26, 46);">Debug Mode</font> | <font style="color:rgb(26, 26, 46);">疑难故障定位</font> | <font style="color:rgb(26, 26, 46);">通过运行时日志和假设验证定位根因，而不是盲猜修复</font> |
| <font style="color:rgb(26, 26, 46);">Worktrees / Checkpoints</font> | <font style="color:rgb(26, 26, 46);">Agent 修改前后</font> | <font style="color:rgb(26, 26, 46);">隔离并行任务，提供恢复和撤销边界</font> |
| <font style="color:rgb(26, 26, 46);">Skills / Subagents</font> | <font style="color:rgb(26, 26, 46);">重复流程与并行研究</font> | <font style="color:rgb(26, 26, 46);">复用领域知识，把搜索、测试、审查等子任务分派出去</font> |
| <font style="color:rgb(26, 26, 46);">Hooks</font> | <font style="color:rgb(26, 26, 46);">工具执行和完成节点</font> | <font style="color:rgb(26, 26, 46);">在命令、编辑、完成等事件上执行确定性校验或阻断</font> |
| <font style="color:rgb(26, 26, 46);">Agent Review</font> | <font style="color:rgb(26, 26, 46);">实现完成后</font> | <font style="color:rgb(26, 26, 46);">基于完整对话上下文审查 Agent 生成的 diff</font> |


**<font style="color:rgb(15, 23, 42);">核心主流程固定为下面 8 步。</font>**<font style="color:rgb(26, 26, 46);">Plan Mode、Rules、Skills、Subagents、Worktrees、Hooks 等能力，都应该服务于这条主线，而不是让流程变得更花哨。</font>

<!-- 这是一张图片，ocr 内容为：CURSOR工程任务八步法 生成计划 扫描代码 分析需求 用户确认 批准范围 自动测试 AGENT修改 REVIEW DIFF COMMIT 验收改动 定点修复 先计划,再执行;先验证,再提交 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784200942488-4e1ff80e-95fc-4a15-a636-bd3581101dfd.png)

| **<font style="color:rgb(15, 23, 42);">步骤</font>** | **<font style="color:rgb(15, 23, 42);">具体动作</font>** | **<font style="color:rgb(15, 23, 42);">Cursor 产出</font>** | **<font style="color:rgb(15, 23, 42);">用户闸门</font>** | **<font style="color:rgb(15, 23, 42);">失败时怎么处理</font>** |
| :--- | :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">1. Chat 分析需求</font> | <font style="color:rgb(26, 26, 46);">用 Chat 澄清 Background、Goal、Scope、Non Goal、Acceptance、Risks</font> | <font style="color:rgb(26, 26, 46);">需求摘要、开放问题、初步任务边界</font> | <font style="color:rgb(26, 26, 46);">需求没讲清前不进入实现</font> | <font style="color:rgb(26, 26, 46);">补充 Spec，不让 Agent 自己补业务决定</font> |
| <font style="color:rgb(26, 26, 46);">2. Agent 扫描代码</font> | <font style="color:rgb(26, 26, 46);">只调查代码库，使用 Index、Semantic/Agentic Search、Explore Subagent 找相关模块</font> | <font style="color:rgb(26, 26, 46);">相关文件、调用链、相似实现、测试入口</font> | <font style="color:rgb(26, 26, 46);">先确认模块地图是否完整</font> | <font style="color:rgb(26, 26, 46);">显式</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">@</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">漏掉的文件，缩小或扩展搜索范围</font> |
| <font style="color:rgb(26, 26, 46);">3. 生成实施计划</font> | <font style="color:rgb(26, 26, 46);">基于 Spec 和代码证据生成分步计划</font> | <font style="color:rgb(26, 26, 46);">修改文件清单、步骤、测试方案、风险和回滚点</font> | <font style="color:rgb(26, 26, 46);">计划必须可审查、可拆分、可回滚</font> | <font style="color:rgb(26, 26, 46);">重新切片，避免一次性大重构</font> |
| <font style="color:rgb(26, 26, 46);">4. 用户确认</font> | <font style="color:rgb(26, 26, 46);">确认 Scope、Non Goal、事务边界、依赖和高风险操作</font> | <font style="color:rgb(26, 26, 46);">已批准计划或待确认问题</font> | <font style="color:rgb(26, 26, 46);">未确认不得进入 Act 阶段</font> | <font style="color:rgb(26, 26, 46);">修改计划，而不是边写边猜</font> |
| <font style="color:rgb(26, 26, 46);">5. Agent 修改</font> | <font style="color:rgb(26, 26, 46);">在批准范围内编辑代码和测试，可使用 Worktree/Checkpoint 隔离</font> | <font style="color:rgb(26, 26, 46);">有限范围代码改动</font> | <font style="color:rgb(26, 26, 46);">禁止越界修改模型、迁移、权限或依赖</font> | <font style="color:rgb(26, 26, 46);">停止当前循环，回退越界 diff</font> |
| <font style="color:rgb(26, 26, 46);">6. 自动测试</font> | <font style="color:rgb(26, 26, 46);">运行 Hooks、ruff、mypy、pytest 和必要的集成测试</font> | <font style="color:rgb(26, 26, 46);">命令结果、失败日志、修复循环</font> | <font style="color:rgb(26, 26, 46);">禁止删测试、skip 或放宽断言来“通过”</font> | <font style="color:rgb(26, 26, 46);">把失败日志回灌给 Agent 定点修复</font> |
| <font style="color:rgb(26, 26, 46);">7. Review Diff</font> | <font style="color:rgb(26, 26, 46);">使用 Agent Review + 人工 Review 检查架构、业务、安全与无关改动</font> | <font style="color:rgb(26, 26, 46);">逐文件 diff 说明、风险和未验证项</font> | <font style="color:rgb(26, 26, 46);">所有 Acceptance 必须能映射到代码或测试</font> | <font style="color:rgb(26, 26, 46);">按文件给反馈，重新进入修改/测试循环</font> |
| <font style="color:rgb(26, 26, 46);">8. Commit</font> | <font style="color:rgb(26, 26, 46);">确认验证结果，提交最小、可描述的变更</font> | <font style="color:rgb(26, 26, 46);">Commit/PR、修改摘要、验证记录</font> | <font style="color:rgb(26, 26, 46);">未验证或高风险未确认不得提交</font> | <font style="color:rgb(26, 26, 46);">拆分 Commit；重复问题更新 Rules/Skills</font> |


<font style="color:rgb(26, 26, 46);">把这套流程落到 Cursor 对话里，可以直接使用下面这个模板。它的重点是先要求 Agent </font>**<font style="color:rgb(15, 23, 42);">计划和确认</font>**<font style="color:rgb(26, 26, 46);">，不要一上来就改代码：</font>

```plain
你先不要改文件。请先基于以下信息给出实现计划。

任务目标：
- 新增 POST /tasks 接口，创建任务并返回 TaskOut。

上下文：
- @src/my_api/api/tasks.py
- @src/my_api/service/tasks.py
- @src/my_api/repo/tasks.py
- @src/my_api/schemas/task.py
- @tests/api/test_tasks.py

规则：
- @10-fastapi-routes
- @20-repository-sqlalchemy
- @30-pytest-async

请先输出：
1. 你认为需要修改的文件列表。
2. 每个文件的修改点。
3. 你不会修改哪些文件，以及原因。
4. 需要我确认的风险点。
5. 建议的测试命令。

我确认后，你再开始改代码。
```

<font style="color:rgb(26, 26, 46);">计划确认后，再进入第二轮，让 Agent 执行有限范围的修改：</font>

```plain
计划确认。现在开始实现，但请遵守：

- 只修改你刚才列出的文件。
- 每个文件只做和 POST /tasks 相关的改动。
- 如果发现必须修改模型或迁移文件，先停止并说明原因，不要直接改。
- 生成或更新测试后，在最终回复中列出建议运行的 ruff、mypy、pytest 命令。
```

<font style="color:rgb(26, 26, 46);">完成后不要马上进入下一个需求，而是进入“验证轮”。这一步可以把失败日志重新喂给 Cursor，但要把边界说清楚：</font>

```plain
以下是 pytest 失败日志。请只分析和本次 POST /tasks 改动相关的问题。

限制：
- 不要重写无关 fixture。
- 不要跳过测试。
- 不要放宽断言来让测试通过。
- 如果失败来自既有测试环境，请说明证据。

失败日志：
<粘贴 pytest 输出>
```

<font style="color:rgb(26, 26, 46);">这就是 Cursor 工程化工作流的关键：</font>**<font style="color:rgb(15, 23, 42);">让 Agent 每一轮都有明确输入、明确边界、明确产出、明确验证。</font>**<font style="color:rgb(26, 26, 46);">你不是在和 AI 闲聊，而是在管理一个会写代码的协作者。</font>

:::tip
**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> 一套可复制的 Cursor 工程化节奏</font>**

+ **<font style="color:rgb(15, 23, 42);">先问计划：</font>**<font style="color:rgb(26, 26, 46);">复杂任务先让 Agent 解释要改什么，不要直接生成。</font>
+ **<font style="color:rgb(15, 23, 42);">再批范围：</font>**<font style="color:rgb(26, 26, 46);">一次只批准一个可审查切片，避免大爆炸 diff。</font>
+ **<font style="color:rgb(15, 23, 42);">强制验收：</font>**<font style="color:rgb(26, 26, 46);">Prompt 里写清测试、类型检查和人工 Review 点。</font>
+ **<font style="color:rgb(15, 23, 42);">失败回灌：</font>**<font style="color:rgb(26, 26, 46);">把 ruff/mypy/pytest 失败日志作为新上下文，让 Agent 定点修。</font>
+ **<font style="color:rgb(15, 23, 42);">沉淀规则：</font>**<font style="color:rgb(26, 26, 46);">同一类错误出现三次，就写进 </font>`<font style="color:rgb(37, 99, 235);">.cursor/rules</font>`<font style="color:rgb(26, 26, 46);"> 或 </font>`<font style="color:rgb(37, 99, 235);">AGENTS.md</font>`<font style="color:rgb(26, 26, 46);">。</font>

:::

<font style="color:rgb(26, 26, 46);">一个比较理想的生成结果，会沿着 schema → api → service → repo → tests 的方向组织，而不是把所有逻辑塞进路由函数里。</font>

**<font style="color:rgb(15, 23, 42);">第一步：schema 定义请求和响应边界。</font>**

```python
# src/my_api/schemas/task.py
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=1000)


class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    status: str
    created_at: datetime
```

**<font style="color:rgb(15, 23, 42);">第二步：router 保持薄，只做 HTTP 边界。</font>**

```python
# src/my_api/api/tasks.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from my_api.db import get_session
from my_api.schemas.task import TaskCreate, TaskOut
from my_api.service.tasks import create_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task_endpoint(
    payload: TaskCreate,
    session: AsyncSession = Depends(get_session),
) -> TaskOut:
    return await create_task(session=session, payload=payload)
```

**<font style="color:rgb(15, 23, 42);">第三步：service 负责编排，repo 负责持久化。</font>**

```python
# src/my_api/service/tasks.py
from sqlalchemy.ext.asyncio import AsyncSession

from my_api.repo.tasks import insert_task
from my_api.schemas.task import TaskCreate, TaskOut


async def create_task(session: AsyncSession, payload: TaskCreate) -> TaskOut:
    task = await insert_task(session=session, payload=payload)
    await session.commit()
    await session.refresh(task)
    return TaskOut.model_validate(task)
```

```python
# src/my_api/repo/tasks.py
from sqlalchemy.ext.asyncio import AsyncSession

from my_api.models.task import Task
from my_api.schemas.task import TaskCreate


async def insert_task(session: AsyncSession, payload: TaskCreate) -> Task:
    task = Task(
        title=payload.title,
        description=payload.description,
        status="open",
    )
    session.add(task)
    await session.flush()
    return task
```

<font style="color:rgb(26, 26, 46);">这里要特别看一眼事务边界：repo 只</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">flush</font>`<font style="color:rgb(26, 26, 46);">，不</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">commit</font>`<font style="color:rgb(26, 26, 46);">；commit 放在 service。这正是前面 Rules 要约束的地方。否则项目大了以后，跨多个 repo 的业务操作会很难保证一致性。</font>

**<font style="color:rgb(15, 23, 42);">第四步：测试覆盖行为，而不是只覆盖实现。</font>**

```python
# tests/api/test_tasks.py
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_create_task_returns_201(async_client: AsyncClient) -> None:
    response = await async_client.post(
        "/tasks",
        json={"title": "Write Cursor tutorial", "description": "Use Python example"},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["id"] is not None
    assert body["title"] == "Write Cursor tutorial"
    assert body["description"] == "Use Python example"
    assert body["status"] == "open"
    assert "created_at" in body


async def test_create_task_rejects_empty_title(async_client: AsyncClient) -> None:
    response = await async_client.post("/tasks", json={"title": ""})

    assert response.status_code == 422
```

<font style="color:rgb(26, 26, 46);">这时还没完。Agent 写完以后，最终回复应该至少包含三类信息：</font>

| **<font style="color:rgb(15, 23, 42);">检查项</font>** | **<font style="color:rgb(15, 23, 42);">你要看什么</font>** | **<font style="color:rgb(15, 23, 42);">推荐命令</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">格式和静态问题</font> | <font style="color:rgb(26, 26, 46);">导入、未使用变量、风格、基础错误</font> | `<font style="color:rgb(37, 99, 235);">uv run ruff check .</font>` |
| <font style="color:rgb(26, 26, 46);">类型问题</font> | <font style="color:rgb(26, 26, 46);">schema、返回值、AsyncSession 类型是否一致</font> | `<font style="color:rgb(37, 99, 235);">uv run mypy src/my_api</font>` |
| <font style="color:rgb(26, 26, 46);">行为验证</font> | <font style="color:rgb(26, 26, 46);">成功创建、422 校验、测试 fixture 是否可用</font> | `<font style="color:rgb(37, 99, 235);">uv run pytest tests/api/test_tasks.py</font>` |
| <font style="color:rgb(26, 26, 46);">人工 Review</font> | <font style="color:rgb(26, 26, 46);">事务边界、是否误改模型/迁移、错误处理是否符合项目规范</font> | <font style="color:rgb(26, 26, 46);">查看 Cursor diff 或</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">git diff</font>` |


### <font style="color:rgb(15, 23, 42);">7.2 AI Review Pipeline：不要只看“能不能跑”，要分层审查</font>
<font style="color:rgb(26, 26, 46);">Review 不能只停留在“看一眼 diff”。Agent 生成代码后，建议走一条固定的 AI Review Pipeline。它的顺序是：</font>**<font style="color:rgb(15, 23, 42);">Agent 修改 → Diff → Static Analysis → Type Check → Tests → Security / Policy Review → Human Review → Merge / Rule Update</font>**<font style="color:rgb(26, 26, 46);">。</font>

<!-- 这是一张图片，ocr 内容为：AI REVIEW PIPELINE 类型检查 静态检查 合并/更新规则 安全审查 AGENT修改 自动测试 人工 REVIEW DIFF审查 BOOL </S 个 高风险停下 最终责任在人 不过就修 能运行,不等于能合并 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784201000150-01af4e6f-6952-48c9-896f-204ffa15d434.png)

| **<font style="color:rgb(15, 23, 42);">Review 阶段</font>** | **<font style="color:rgb(15, 23, 42);">检查什么</font>** | **<font style="color:rgb(15, 23, 42);">Python 项目怎么做</font>** | **<font style="color:rgb(15, 23, 42);">不通过时怎么办</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Agent 修改</font> | <font style="color:rgb(26, 26, 46);">是否只改了 Spec 允许的范围</font> | <font style="color:rgb(26, 26, 46);">查看修改文件清单</font> | <font style="color:rgb(26, 26, 46);">让 Agent 回滚无关改动或拆小任务</font> |
| <font style="color:rgb(26, 26, 46);">Diff</font> | <font style="color:rgb(26, 26, 46);">架构边界、事务边界、异常处理、命名一致性</font> | <font style="color:rgb(26, 26, 46);">逐文件看 Cursor diff 或</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">git diff</font>` | <font style="color:rgb(26, 26, 46);">指出具体文件和行，让 Agent 定点改</font> |
| <font style="color:rgb(26, 26, 46);">Static Analysis</font> | <font style="color:rgb(26, 26, 46);">导入、未使用变量、格式、基础 lint 问题</font> | `<font style="color:rgb(37, 99, 235);">uv run ruff check .</font>` | <font style="color:rgb(26, 26, 46);">把 ruff 输出贴回去，只修 lint 相关问题</font> |
| <font style="color:rgb(26, 26, 46);">Type Check</font> | <font style="color:rgb(26, 26, 46);">schema、返回值、AsyncSession、可选字段类型</font> | `<font style="color:rgb(37, 99, 235);">uv run mypy src/my_api</font>` | <font style="color:rgb(26, 26, 46);">不要用</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">Any</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">糊弄，要求修真实类型边界</font> |
| <font style="color:rgb(26, 26, 46);">Tests</font> | <font style="color:rgb(26, 26, 46);">行为是否符合 Acceptance</font> | `<font style="color:rgb(37, 99, 235);">uv run pytest tests/api/test_tasks.py</font>` | <font style="color:rgb(26, 26, 46);">禁止删测试、跳测试、放宽断言来“通过”</font> |
| <font style="color:rgb(26, 26, 46);">Security / Policy Review</font> | <font style="color:rgb(26, 26, 46);">权限、输入校验、敏感数据、依赖、外部工具结果</font> | <font style="color:rgb(26, 26, 46);">检查是否新增依赖、是否绕过鉴权、是否暴露内部字段</font> | <font style="color:rgb(26, 26, 46);">高风险改动停止，让人确认</font> |
| <font style="color:rgb(26, 26, 46);">Human Review</font> | <font style="color:rgb(26, 26, 46);">业务语义、可维护性、边界条件、回滚策略</font> | <font style="color:rgb(26, 26, 46);">Reviewer 按 Spec 和实际 diff 对照</font> | <font style="color:rgb(26, 26, 46);">把反馈转成下一轮小 Prompt</font> |
| <font style="color:rgb(26, 26, 46);">Merge / Rule Update</font> | <font style="color:rgb(26, 26, 46);">是否可合并，是否有重复问题要沉淀</font> | <font style="color:rgb(26, 26, 46);">合并前记录验证结果；重复问题写入 Rules</font> | <font style="color:rgb(26, 26, 46);">未验证不要合并；规则缺失就补规则</font> |


<font style="color:rgb(26, 26, 46);">可以直接把下面这段作为 Review Prompt。它会强制 Agent 按审查流水线自检，而不是只给一句“已完成”。</font>

```plain
请按 AI Review Pipeline 审查你刚才的修改，不要继续改代码。

请逐项输出：
1. Scope Check：实际修改文件是否都在 Spec Scope 内？有没有越界？
2. Diff Review：每个文件的关键改动是什么？为什么需要？
3. Static Analysis：建议运行哪些 ruff 命令？你预期可能有什么 lint 风险？
4. Type Check：哪些返回类型、schema、AsyncSession 类型需要重点检查？
5. Tests：哪些测试覆盖了 Acceptance？还缺哪些边界？
6. Security / Policy：有没有新增依赖、敏感字段、权限绕过、外部数据误信？
7. Human Review：哪些点必须由人确认？
8. Rule Update：这次是否暴露了需要沉淀到 .cursor/rules 的重复问题？
```

<font style="color:rgb(26, 26, 46);">这条 Pipeline 的核心价值是把“AI 生成代码”变成“AI 生成可审查的工程变更”。只要 Review Pipeline 固定下来，团队就不会因为 Agent 速度变快而牺牲质量。</font>

### <font style="color:rgb(15, 23, 42);">7.3 真实项目案例递进：从新手到高级工程师</font>
<font style="color:rgb(26, 26, 46);">同样是 Cursor，不同成熟度的人用法应该不一样。下面三个真实项目风格的案例，展示从“辅助写局部代码”到“驱动复杂工程变更”的能力递进。</font>

| **<font style="color:rgb(15, 23, 42);">阶段</font>** | **<font style="color:rgb(15, 23, 42);">需求</font>** | **<font style="color:rgb(15, 23, 42);">推荐流程</font>** | **<font style="color:rgb(15, 23, 42);">Cursor 主要价值</font>** | **<font style="color:rgb(15, 23, 42);">人工重点</font>** |
| :--- | :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">新人上手</font> | <font style="color:rgb(26, 26, 46);">增加登录页面或简单表单</font> | <font style="color:rgb(26, 26, 46);">Tab → Inline Edit → 小范围 Chat 解释</font> | <font style="color:rgb(26, 26, 46);">补样板、解释报错、局部改写</font> | <font style="color:rgb(26, 26, 46);">理解生成代码，不要盲接 Tab</font> |
| <font style="color:rgb(26, 26, 46);">普通开发</font> | <font style="color:rgb(26, 26, 46);">增加一个后端 API</font> | <font style="color:rgb(26, 26, 46);">Chat → Context → Rules → Agent → Tests</font> | <font style="color:rgb(26, 26, 46);">按分层生成多文件改动和测试</font> | <font style="color:rgb(26, 26, 46);">控制范围、看 diff、跑验证命令</font> |
| <font style="color:rgb(26, 26, 46);">高级工程师</font> | <font style="color:rgb(26, 26, 46);">重构支付模块或权限模块</font> | <font style="color:rgb(26, 26, 46);">Spec → Agent Loop → Review Pipeline → Test → 分批合并</font> | <font style="color:rgb(26, 26, 46);">执行可审查切片，辅助迁移和补测试</font> | <font style="color:rgb(26, 26, 46);">架构决策、风险拆分、回滚策略、安全审查</font> |


**<font style="color:rgb(15, 23, 42);">案例 A：新人上手。</font>**<font style="color:rgb(26, 26, 46);">需求是增加一个登录页面。推荐不要直接让 Agent 改完整登录链路，而是先用 Tab 补表单字段，用 Inline Edit 调整校验提示，再用 Chat 解释登录 API 的调用方式。目标是学习项目结构，同时完成低风险代码。</font>

**<font style="color:rgb(15, 23, 42);">案例 B：普通开发。</font>**<font style="color:rgb(26, 26, 46);">需求是增加</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">POST /tasks</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">API。推荐先用 Chat 梳理上下文，再引用 Rules，让 Agent 修改 schema、api、service、repo、tests，最后用 ruff、mypy、pytest 验证。目标是让 Agent 承担多文件样板和测试补齐，但由人控制边界。</font>

**<font style="color:rgb(15, 23, 42);">案例 C：高级工程师。</font>**<font style="color:rgb(26, 26, 46);">需求是重构支付模块。推荐先写完整 Spec，明确 Background、Goal、Scope、Non Goal、Risks 和 Open Questions；再让 Agent 只做第一批可回滚切片；每一批都经过 AI Review Pipeline。目标不是“一次重构完”，而是把高风险变更拆成多个可审、可测、可回滚的工程单元。</font>

### <font style="color:rgb(15, 23, 42);">案例 1：Tab 补全的“局部正确”</font>
<font style="color:rgb(26, 26, 46);">背景：你正在写</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">Task.status</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">相关逻辑，Tab 根据附近代码补出</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">status == "done"</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">的二元判断。现象：代码能跑，但项目里还有</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">open</font>`<font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">blocked</font>`<font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">archived</font>`<font style="color:rgb(26, 26, 46);">。分析：Tab 只看到了局部模式，没有理解完整业务枚举。</font>

<font style="color:rgb(26, 26, 46);">方案：引用 </font>`<font style="color:rgb(37, 99, 235);">models/task.py</font>`<font style="color:rgb(26, 26, 46);"> 或状态枚举定义，让 Agent 基于完整类型补齐分支。</font>

<font style="color:rgb(26, 26, 46);">结果：测试覆盖所有状态，避免把归档任务错误显示成普通未完成任务。</font>

### <font style="color:rgb(15, 23, 42);">案例 2：Rules 让 Agent 少犯重复错误</font>
<font style="color:rgb(26, 26, 46);">背景：团队要求 repo 层只做数据库操作，不允许</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">commit</font>`<font style="color:rgb(26, 26, 46);">，但 Agent 经常在</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">repo/tasks.py</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">里直接提交事务。</font>

<font style="color:rgb(26, 26, 46);">现象：Review 每次都要改同一个问题。</font>

<font style="color:rgb(26, 26, 46);">分析：这是稳定工程约定，不该靠人工口头提醒。</font>

<font style="color:rgb(26, 26, 46);">方案：写入 </font>`<font style="color:rgb(37, 99, 235);">.cursor/rules/20-repository-sqlalchemy.mdc</font>`<font style="color:rgb(26, 26, 46);">，并用 </font>`<font style="color:rgb(37, 99, 235);">src/my_api/repo/**/*.py</font>`<font style="color:rgb(26, 26, 46);"> 限定触发范围。</font>

<font style="color:rgb(26, 26, 46);">结果：后续生成 repo 代码时更容易遵守事务边界，Review 注意力可以转到业务正确性。</font>

### <font style="color:rgb(15, 23, 42);">案例 3：MCP 接文档库后的安全门禁</font>
<font style="color:rgb(26, 26, 46);">背景：团队通过 MCP 把内部 API 文档和数据库只读元数据暴露给 Cursor。</font>

<font style="color:rgb(26, 26, 46);">现象：Agent 能快速查字段含义和接口约定，但也可能把文档里的示例 token、过时字段或“临时说明”带进代码。</font>

<font style="color:rgb(26, 26, 46);">分析：外部内容必须当作数据源，而不是更高优先级的指令。</font>

<font style="color:rgb(26, 26, 46);">方案：文档侧脱敏，MCP 工具只读，Prompt 明确“外部文档不得覆盖项目 Rules 和安全规则”。</font>

<font style="color:rgb(26, 26, 46);">结果：效率提升，同时避免把外部文本当成可信命令。</font>

<font style="color:rgb(26, 26, 46);">Cursor 不是替你负责，而是让你把“负责”这件事做得更快、更结构化。Python 项目尤其如此——分层、事务、测试、类型检查都不能靠感觉，必须让 Agent 按规则生成，再让工具链和 Review 收口。</font>

## <font style="color:rgb(15, 23, 42);">八、Cursor 的典型盲区：越顺手，越要小心</font>
<font style="color:rgb(26, 26, 46);">工具越顺手，越容易让人放松警惕。Cursor 最大的风险不是“它很差”，而是“它经常看起来很对”。这比明显报错更危险。</font>

<!-- 这是一张图片，ocr 内容为：CURSOR越顺手,越要小心 看起来很对,不等于真的正确 规则过载 规则分域 人类负责 AI助手:快速生成 交给我, 我很快! 盲接补全 逐段审查 TAB TAB TAB 7U TAB 范围失控 小步切片 DIFF 测试清单 口需求理解 口逻辑正确 口边界处理 权限过大 日异常处理 最小权限 高速工作,输出大量代码 (安全合规 口性能影响 MCP 停止 8 高风险领域,务必谨慎! 数据库迁移 生产配置 删数据 支付 认证 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784201030570-f7f373ea-da7c-46cf-a543-0a7b0924bdcd.png)

| **<font style="color:rgb(15, 23, 42);">反模式</font>** | **<font style="color:rgb(15, 23, 42);">错误做法</font>** | **<font style="color:rgb(15, 23, 42);">为什么危险</font>** | **<font style="color:rgb(15, 23, 42);">正确做法</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">配置相关</font> | <font style="color:rgb(26, 26, 46);">把几千行规范塞进一个规则文件</font> | <font style="color:rgb(26, 26, 46);">上下文膨胀，重点被稀释</font> | <font style="color:rgb(26, 26, 46);">按主题拆分规则，用 glob 限定范围</font> |
| <font style="color:rgb(26, 26, 46);">代码相关</font> | <font style="color:rgb(26, 26, 46);">Tab 补全一路接受，不看 diff</font> | <font style="color:rgb(26, 26, 46);">局部模式可能违反业务规则</font> | <font style="color:rgb(26, 26, 46);">关键逻辑逐段审查，给类型和测试兜底</font> |
| <font style="color:rgb(26, 26, 46);">架构相关</font> | <font style="color:rgb(26, 26, 46);">让 Agent “顺便重构一下整个模块”</font> | <font style="color:rgb(26, 26, 46);">影响面失控，回归风险高</font> | <font style="color:rgb(26, 26, 46);">拆成小任务，每轮只改可验证范围</font> |
| <font style="color:rgb(26, 26, 46);">工具相关</font> | <font style="color:rgb(26, 26, 46);">MCP 工具给全量读写权限</font> | <font style="color:rgb(26, 26, 46);">误操作和数据泄露风险放大</font> | <font style="color:rgb(26, 26, 46);">最小权限、只读优先、高危确认</font> |


:::danger
**<font style="color:rgb(239, 68, 68);">🚨</font>****<font style="color:rgb(239, 68, 68);"> 高风险场景清单</font>**

<font style="color:rgb(26, 26, 46);">涉及认证、授权、支付、数据删除、数据库迁移、生产配置、密钥、合规数据时，不要让 Cursor 无人值守执行。AI 可以给方案、写草稿、生成测试，但最终合并必须由人类审查。</font>

:::

<font style="color:rgb(26, 26, 46);">🔍</font><font style="color:rgb(26, 26, 46);"> 这里再补一层原理：LLM 本质上是在给定上下文中预测高概率输出。它擅长生成“像项目代码”的代码，但“像”不等于“符合业务事实”。业务事实在哪里？在 Spec、类型、测试、Rules、文档、线上指标和你的脑子里。Cursor 能把这些拉近，但不能替你判断责任。</font>

<font style="color:rgb(26, 26, 46);">所以别神化 Cursor。它不是小白喊两句就能做爆款项目的魔法棒。它更像一个非常快、非常勤奋、但需要明确上下文和审查边界的同事。</font>

## <font style="color:rgb(15, 23, 42);">九、总结：Cursor 的正确打开方式</font>
<font style="color:rgb(26, 26, 46);">开头那个问题现在可以回答了：Cursor 强的不是“会补全”，而是把</font>**<font style="color:rgb(15, 23, 42);">上下文、规则、编辑器、Agent、模型和工具</font>**<font style="color:rgb(26, 26, 46);">组合成一个工程化工作流。</font>

<font style="color:rgb(26, 26, 46);">如果你刚开始用 Cursor，别急着追求酷炫自动化。先把这四件事练熟：</font>

+ <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 小改动用 Tab 和 Inline Edit，大任务用 Chat/Agent。</font>
+ <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 每个 Agent 任务都写清范围、约束和验收标准。</font>
+ <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 把重复规范沉淀进 `.cursor/rules/*.mdc` 或 AGENTS.md。</font>
+ <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 每次多文件修改都看 diff、跑测试、查边界。</font>

<font style="color:rgb(26, 26, 46);">进阶之后，再考虑 MCP、项目规则治理、模型路由和成本基准。顺序别反。地基没打好，工具接得越多，事故半径越大。</font>

<!-- 这是一张图片，ocr 内容为：CURSOR的正确打开方式 模型 上下文 我负责判断 我负责执行 选择合适模型, 给足背景信息, 和把关 和落地 减少歧义 平衡效果与成本 验负清单 国 RULES 工具 ?需求完整 边界清晰 定义约束与规范, AI 善用内置与外部工具, 测试覆盖 让AI有章可循 扩大能力边界 可维护性 文档更新 AGENT REVIEW 自主规划与执行, 代码审查与验证, 把质量关口前移 端到端推进任务 工程变更 规则要沉淀 改完必验证 大任务写SPEC 小改用TAB SPEC 目标清晰,可追溯, 构建,测试,运行, 从项目中提炼规则, 快速,安全,成本低 可复用 确保结果可靠 持续迭代 AI-FIRSTIDE不是让你少思考,而是放大工程判断 速度 质量 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1784201088432-1663de45-3d4d-44ba-9826-2f2a18985bd0.png)

:::info
<font style="color:rgb(26, 26, 46);">一句话收尾：AI-first IDE 不是让你少思考，而是把你的工程判断放大。判断清楚，它就是加速器；判断模糊，它就是返工放大器。</font>

:::

## <font style="color:rgb(15, 23, 42);">参考资料</font>
+ [<font style="color:rgb(59, 130, 246);">Cursor Docs</font>](https://cursor.com/docs)<font style="color:rgb(26, 26, 46);">：官方文档入口，当前导航覆盖 Agent、Rules、MCP、Skills、CLI。</font>
+ [<font style="color:rgb(59, 130, 246);">Cursor Agent Documentation</font>](https://cursor.com/docs/agent/overview)<font style="color:rgb(26, 26, 46);">：Agent 的指令、工具、模型、检查点和工程化使用方式。</font>
+ [<font style="color:rgb(59, 130, 246);">Cursor Search Documentation</font>](https://cursor.com/docs/agent/tools/search)<font style="color:rgb(26, 26, 46);">：Semantic Search 与 Agentic Search。</font>
+ [<font style="color:rgb(59, 130, 246);">Cursor Agent Review Documentation</font>](https://cursor.com/docs/agent/review)<font style="color:rgb(26, 26, 46);">：基于 Agent 对话上下文进行 diff 审查。</font>
+ [<font style="color:rgb(59, 130, 246);">Cursor Subagents Documentation</font>](https://cursor.com/docs/subagents)<font style="color:rgb(26, 26, 46);">：独立上下文、内置子 Agent、自定义配置、前台/后台与并行执行。</font>
+ [<font style="color:rgb(59, 130, 246);">Cursor Rules Documentation</font>](https://cursor.com/docs/context/rules)<font style="color:rgb(26, 26, 46);">：Project Rules、User Rules、Team Rules、AGENTS.md、legacy .cursorrules 与触发方式。</font>