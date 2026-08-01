---
title: 9、CLAUDE.md 进阶：作用域、加载机制与排障
date: 2026-08-01
tags: ["AI", "Vibe Coding"]
description: 你已经把命令、边界和验证方式写进了CLAUDE.md ，Claude 却还是没按规则行动。别急着继续加文字，问题很可能不在“写得够不够多”，而在于：规则放在哪、何时加载、当前会话到底看没看见。 上一篇解决“写什么、怎么从仓库证据生成规则”…
---

# 9、CLAUDE.md 进阶：作用域、加载机制与排障

你已经把命令、边界和验证方式写进了`CLAUDE.md` ，Claude 却还是没按规则行动。别急着继续加文字，问题很可能不在“写得够不够多”，而在于：**规则放在哪、何时加载、当前会话到底看没看见**。

上一篇解决“写什么、怎么从仓库证据生成规则”；这一篇继续处理规则系统的后半程：作用域、加载机制、`@import`、Monorepo 分层和排障。

> 💡版本说明本文基于 Claude Code 可用的官方文档整理。Claude Code 更新较快，涉及命令、加载顺序和版本门槛的内容，请以文末官方资料为准。

## ⏱ 60 秒，先记住这张加载地图

1. **谁需要：**个人习惯放用户级，团队事实放项目级，包内差异放目录级，本机差异放 `CLAUDE.local.md`。
2. **什么时候看见：**从当前工作目录向上的文件在启动时加载；子目录规则在 Claude 读取该目录文件时加入。
3. **怎么确认：**用 `/context` 看实际加载集合，用 `/memory` 管理文件，用 `/doctor` 检查配置与过长规则。
4. **怎么强制：**CLAUDE.md 只负责指导；必须阻断的动作交给 permissions、Hooks、沙箱或 CI。

> ✅ 一句话模型作用域决定规则属于哪里，加载机制决定当前会话何时看到，强制机制决定动作能不能执行。

![01-rule-system-three-questions.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/6b2ef1a3-01-rule-system-three-questions.png)

## 一、规则作用域：谁会生效，谁只是路过？

上面一篇解决了“规则从哪里来”，这篇要解决“确认后的规则放哪里”。这一步不能靠“离代码越近就一定优先”来理解，因为 Claude Code 不是 CSS 层叠：多个层级可能同时进入上下文，冲突时不应依赖某个文件稳定覆盖另一个文件。

### 1.1 作用域要同时回答三个问题

把一条规则放进文件前，先问清楚**谁需要、哪里需要、需要多久**。这三个答案共同决定位置：

#### 👥 谁需要？

整个组织、当前用户、项目团队，还是某个包的维护者？

#### 📍 哪里需要？

所有路径、一个服务目录，还是只在当前机器生效？

#### 🕒 需要多久？

长期不变量、迁移期临时规则，还是仅本次任务要求？

> 💡 一句话定义作用域不是文件层级本身，而是规则应该影响的受众与路径。文件只是承载方式。先定义影响范围，再选文件，顺序不能反过来。

![02-scope-three-questions.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/c22eee74-02-scope-three-questions.png)

### 1.2 五个常见层级，各自解决什么问题？

| **范围**  | **典型位置**                                         | **适合放什么**            | **是否共享** |
| --------- | ---------------------------------------------------- | ------------------------- | ------------ |
| 企业/托管 | 由组织策略提供的系统级位置（平台路径以官方文档为准） | 组织级指导与合规要求      | 组织级       |
| 用户级    | `~/.claude/CLAUDE.md`                                | 个人通用偏好、跨项目习惯  | 当前用户     |
| 项目级    | `./CLAUDE.md`、项目 `.claude` 目录                   | 团队约定、命令、架构规则  | 建议提交     |
| 目录级    | `src/expense_tracker/importers/CLAUDE.md`            | Python 包或子模块专属规则 | 随目录共享   |
| 项目本地  | `./CLAUDE.local.md`                                  | 个人本机差异              | 通常不提交   |

#### 企业 / 托管层

适合统一合规、审计和组织级约束。普通项目维护者通常不应复制一份到仓库“保持一致”，否则会形成两个事实来源。

#### 用户层

适合语言、输出长度、个人 Git 操作边界等跨项目习惯。任何技术栈命令都要谨慎，因为它会跟着你进入别的仓库。

#### 项目根层

适合所有贡献者和多数任务都需要的命令、生成边界、全局验收与安全请示。这里最值得短。

#### 目录 / 包层

适合局部领域不变量、包专用测试和局部生成流程。只写与上层不同或更具体的内容，不复制根文件。

#### 项目本地层

适合本机端口、容器 profile、个人调试入口等不可共享差异。通常不提交，也绝不是密钥保险柜。

#### 任务 Prompt

它不是持久层级，却经常是正确归宿：一次性需求、当天迁移步骤和本次输出格式不该永久留在项目规则里。

可以把它看成地图：上层文件画大路，越靠近当前文件的下层文件画小路。大路告诉你项目整体怎么走，小路告诉你这个包有哪些特殊路况。

![03-five-level-scope-map.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/c49d4408-03-five-level-scope-map.png)

从根目录到子目录：共享规则逐层收窄，局部规则按需参与。

### 1.3 别把作用域、加载时机和优先级混成一件事

| **概念**     | **它回答什么**                             | **常见误解**                                |
| ------------ | ------------------------------------------ | ------------------------------------------- |
| **作用域**   | 这条规则本来应该影响哪些用户、项目或路径？ | 文件放得越深，天然就更正确。                |
| **加载时机** | 这份指导什么时候进入当前会话上下文？       | 仓库里存在的所有 CLAUDE.md 启动时都会加载。 |
| **冲突处理** | 多条规则同时出现时，如何避免互相打架？     | 可以像 CSS 一样依赖“最近文件必定覆盖”。     |

作用域是你的设计意图，加载时机是工具行为，冲突处理是内容治理。三者有关，但不能互相代替。这章先把“放哪里”说清；下一章再逐路径推演“什么时候看到”。

#### 先记住加载方向的轮廓

- **向上查找**：Claude Code 会关注当前工作目录的祖先路径中的指导文件。
- **向下按需：**从仓库根目录工作时，子目录的指导通常在 Claude 访问该目录下文件时才变得相关。
- **兄弟隔离：**`importers/CLAUDE.md` 不应因为你正在修改 `reports/` 就自动变成报表规则。

> ⚠️ 版本敏感点企业级文件的精确平台路径、CLAUDE.local.md 的完整支持范围、额外目录如何加载，以当前 官方 memory 文档为准。教程里的组织模型稳定，具体路径不要硬编码到团队规范里。

### 1.4 用户级与项目级：最容易发生“跨仓库污染”

用户级文件会跨项目出现，所以只应该放**无论进入哪个仓库都成立**的个人偏好。把 `expense-tracker-lab` 的 Python 版本、uv 命令或测试路径写进用户级，等于随身带着一张过期地图。

#### ❌ 用户级里混入项目假设

```plain
## Defaults
- Always use uv and Python 3.13.
- Tests live under `tests/`.
- Run `uv run pytest -q` after every change.
```

进入 Poetry 管理的 Python 项目、Go 项目或纯文档仓库时，这些规则仍可能出现，直接误导环境和命令选择。

#### ✅ 用户级只保留跨项目习惯

```plain
## Communication
- Prefer concise Chinese unless asked otherwise.
- State checks that were not run.

## Git
- Do not commit or push unless explicitly asked.
```

项目技术栈换了，这些个人协作偏好仍然成立。

### 1.5 项目根与包级：局部文件只补差异，不复制上层

假设 `expense-tracker-lab` 根文件已经写了“Python 3.13，统一使用 uv”。导入模块不需要再写一遍；它只需补充“修改 CSV 解析后跑哪组测试、遇到坏数据如何处理”。复制看似保险，实际会让同一事实出现多个维护点。

#### ❌ 两层各写一套完整规范

```plain
# expense-tracker-lab/CLAUDE.md
- Use Python 3.13 and uv. Run `uv run pytest -q`.

# src/expense_tracker/importers/CLAUDE.md
- Use Python 3.11 and pip. Run `python -m unittest`.
```

子模块文件究竟是在声明例外，还是已经过期？Claude 无法替团队决定。

#### ✅ 上层写共享事实，下层补触发条件

```plain
# expense-tracker-lab/CLAUDE.md
- Use Python 3.13 and uv for all project commands.
- Default verification: `uv run pytest -q`.

# src/expense_tracker/importers/CLAUDE.md
- Importer changes: `uv run pytest tests/importers -q`.
- Reject malformed rows; do not silently coerce amounts.
```

子模块规则没有推翻根约定，只把当前路径的测试范围和数据边界说得更具体。

> ⚠️ 不要设计“隐式覆盖”如果某个 Python 子目录确实是例外，要写成明确句子，例如“仅 scripts/legacy/** 使用系统 Python 3.10；不要在该目录运行项目的 uv 命令”。让例外可见、可解释，而不是赌模型会按文件距离选择正确版本。

### 1.6 各层级到底放什么：一张决策表

| **内容类型**                    | **用户级**                                                   | **项目级** | **包/目录级** | **CLAUDE.local.md** |
| ------------------------------- | ------------------------------------------------------------ | ---------- | ------------- | ------------------- |
| 个人输出风格（简洁 / 中文优先） | ✅                                                            | ❌          | ❌             | 可选                |
| 团队包管理器与测试命令          | ❌                                                            | ✅          | 包特有时      | ❌                   |
| 单个服务 / 包的局部约定         | ❌                                                            | 只写总原则 | ✅             | ❌                   |
| 本机调试端口 / 个人脚本路径     | 可选                                                         | ❌          | ❌             | ✅                   |
| 生成代码目录边界                | ❌                                                            | 总述       | ✅ 精确路径    | ❌                   |
| 密钥 / Token                    | ❌ 任何 CLAUDE.md、rules、Auto memory、Agent memory 相关文件都不放 |            |               |                     |

### 1.7 用一个目录树做完整归类

继续沿用上一篇的 `expense-tracker-lab`。上一篇为了让第一次练习容易跑通，只有一个月度汇总模块，金额与日期规则暂时写在根 CLAUDE.md。假设项目后来增加 CSV 导入功能，就可以把两个模块都需要的领域规则下沉到 `src/expense_tracker/CLAUDE.md`，再把只有导入器需要的校验放进 `importers/CLAUDE.md`：

```plain
~/.claude/CLAUDE.md                         # 个人跨项目偏好

expense-tracker-lab/
├─ CLAUDE.md                                # Python、uv、全量 pytest
├─ CLAUDE.local.md                          # 当前机器差异，通常不提交
└─ src/expense_tracker/
   ├─ CLAUDE.md                             # 金额与日期领域规则
   └─ importers/CLAUDE.md                   # CSV 导入模块专属规则
```

| **候选规则**                              | **应该放哪里**                            | **为什么**                                       |
| ----------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| 回答默认使用简洁中文                      | 用户级                                    | 这是个人协作偏好，与某个仓库无关。               |
| 项目统一使用 Python 3.13、uv 与 pytest    | 项目根                                    | 所有 Python 模块和团队成员都需要遵守。           |
| 修改 CSV 解析器后运行导入测试             | `src/expense_tracker/importers/CLAUDE.md` | 只处理导入模块时需要。                           |
| 金额始终使用整数分，日期使用 ISO 格式     | `src/expense_tracker/CLAUDE.md`           | 它们是记账领域不变量，报告与导入模块都需要遵守。 |
| 本机测试账单目录是 `D:/fixtures/expenses` | `CLAUDE.local.md`                         | 只对当前设备成立，团队不能依赖。                 |
| 本次迁移输出兼容旧字段                    | 当前任务 Prompt / 临时迁移文档            | 一次性目标不应永久进入项目规则。                 |
| 数据库密码                                | **任何层级都不放**                        | local 代表不共享，不代表加密。                   |

![04-rule-placement-directory-map.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/ed8481b8-04-rule-placement-directory-map.png)

### 1.8 四问放置法：一分钟决定规则归属

1. **这是个人偏好还是团队事实？**个人且跨项目稳定 → 用户级；团队共同约定 → 项目内。
2. **它是否只对某条路径成立？**是 → 下沉到目录级或 path-scoped rule；否 → 保留在项目根。
3. **它是否只对当前机器或当前任务成立？**机器差异 → local；一次性需求 → Prompt，不做持久规则。
4. **它需要提醒还是强制拒绝？**操作方法写 CLAUDE.md；真正的工具禁令交给 Settings、Hooks 或沙箱。

![05-four-question-placement-flow.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/5eafccf7-05-four-question-placement-flow.png)

> ✅ 放置完成的判断标准把任意一条规则拿出来，你都能一句话回答“谁会需要它、在哪些路径需要、什么时候过期”。答不出来，说明作用域还没设计好。

### 1.9 常见的作用域泄漏，症状是什么？

| **症状**                                    | **常见原因**                             | **修复**                                                     |
| ------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| 进入别的项目仍要求使用 uv 或 Python 3.13    | 当前项目技术栈被写进用户级文件           | 移回 `expense-tracker-lab` 项目根，只在用户级保留跨项目偏好。 |
| 只改月度汇总，却被要求运行 CSV 导入专项测试 | importers 局部规则写在项目根             | 下沉到 `src/expense_tracker/importers/` 或改为路径匹配规则。 |
| 同一命令在多个文件里版本不同                | 根与包复制了同一事实                     | 保留一个权威来源，包级只补差异。                             |
| 只有某位成员能按规则跑通                    | 本机前提被当成团队规则，或共享前提没记录 | 本机值移到 local；团队必需依赖写进安装说明。                 |
| local 文件里出现 Token                      | 把“不提交”误认为“安全存储”               | 立即移到正式密钥管理，并检查历史与日志是否泄露。             |
| 规则位置正确却仍未生效                      | 可能是加载时机、排除配置或会话目录问题   | 进入第二章，按祖先、后裔和兄弟路径逐步排查。                 |

到这里解决的是**规则应该属于哪里**。但“放对位置”不等于“当前会话已经看到”：同一份文件，从根目录启动和从子目录启动，加载结果可能不同。下一章专门拆解这条时间线。

## 二、加载机制：启动扫描、按需注入与可观测排错

你明明在 `src/expense_tracker/importers/CLAUDE.md` 里写了 CSV 导入测试命令，Claude 却还是只跑了根目录的 `uv run pytest -q`；换到 `importers/` 目录重新启动，它又突然懂了。问题通常不在规则内容，而在一个更靠前的环节：**这份文件究竟有没有进入当前会话。**

### 2.1 先建立正确模型：它不是“扫全仓”，而是两段式加载

把仓库想成一栋办公楼。启动 Claude Code 时，它先收走你从大门走到工位沿路经过的规章；其他楼层的细则不会一次塞给你，等你真正走进那个区域、读取其中的文件时再补发。

#### ⬆️ 启动扫描：向上找

以**启动时的当前工作目录**为起点，沿父目录向文件系统根方向查找指导文件。命中的祖先文件在会话启动时进入上下文。

#### ⬇️ 动态发现：向下按需

当前工作目录下的嵌套指导文件不会全部预载。Claude 读取某个子目录中的文件时，对应的嵌套规则才加入上下文。

![06-two-stage-loading-office-metaphor.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/a6bc699c-06-two-stage-loading-office-metaphor.png)

> 💡 一句话记忆向上是启动扫描，向下是读取触发。所以“文件存在”不等于“当前会话已经看见”，而“启动在仓库根”也不等于“所有包规则都已加载”。

### 2.2 启动时到底扫描什么？

假设你在 `expense-tracker-lab/src/expense_tracker/importers/` 运行 `claude`。Claude Code 会从这个目录一路向上检查目录层级，并结合托管级、用户级指导组成启动上下文。项目主规则可以放在 `./CLAUDE.md` 或 `./.claude/CLAUDE.md`；团队最好选定一种主位置，避免重复维护。

```plain
expense-tracker-lab/
├─ CLAUDE.md                               # Python、uv、全量 pytest
├─ CLAUDE.local.md                         # 本机测试数据路径
└─ src/expense_tracker/
   ├─ CLAUDE.md                            # 金额与日期领域规则
   ├─ report.py                            # 上一篇的月度汇总实现
   ├─ reports/                             # 报表输出模块
   │  └─ CLAUDE.md                         # 报表格式专属规则
   └─ importers/                           # 在这里运行 claude
      ├─ CLAUDE.md                         # CSV 导入专属规则
      ├─ CLAUDE.local.md                   # 本机样例 CSV 路径
      └─ csv_importer.py
```

| **启动时的来源**                                   | **是否进入上下文** | **说明**                                                     |
| -------------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| 托管策略 CLAUDE.md / 托管 `claudeMd`               | ✅                  | 组织级来源，最先进入；不能被个人排除。                       |
| `~/.claude/CLAUDE.md` 与用户 rules                 | ✅                  | 当前用户跨项目指导，先于项目规则。                           |
| `expense-tracker-lab/CLAUDE.md`                    | ✅                  | 当前目录的祖先。                                             |
| `expense-tracker-lab/CLAUDE.local.md`              | ✅                  | 与根规则同层，排在该层普通 CLAUDE.md 后。                    |
| `src/expense_tracker/CLAUDE.md`                    | ✅                  | 更靠近启动目录的领域包规则。                                 |
| `src/expense_tracker/importers/CLAUDE.md` 与 local | ✅                  | 当前工作目录中的导入模块规则。                               |
| `src/expense_tracker/reports/CLAUDE.md`            | ❌                  | 它是同级报表模块，不在从文件系统根到当前工作目录的祖先链上。 |

![07-startup-ancestor-scan-chain.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/f412386c-07-startup-ancestor-scan-chain.png)

> ⚠️ 当前工作目录不是“Claude 猜出来的项目根”cwd 是你启动命令时所在的目录。终端里先 cd expense-tracker-lab/src/expense_tracker/importers 再运行 Claude，与在 expense-tracker-lab 直接启动，初始加载集合就是不同的。macOS / Linux 可用 pwd，PowerShell 可用 Get-Location 确认。

### 2.3 多份文件不是覆盖，而是按顺序拼接

Claude Code 会把发现的指导内容**拼接进上下文**，不会像 CSS 那样只保留“优先级最高”的一份。官方给出的目录顺序是从宽到窄：文件系统根方向的内容在前，越靠近启动目录的内容越靠后；同一目录内，`CLAUDE.local.md` 接在 `CLAUDE.md` 后面。

![08-session-loading-timeline.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/d124f0ae-08-session-loading-timeline.png)

启动阶段按层级拼接，工作阶段由真实文件读取触发局部指导。

> 🚨 “后读到”不等于“必然覆盖”更具体的文件排在后面，方便补充局部要求，但官方也明确提醒：规则冲突时 Claude 可能任意选择一条。正确做法是让下层文件只补差异；确有例外时写成“仅对 scripts/legacy/** 使用系统 Python 3.10，不运行项目 uv 命令”这样的显式边界，而不是依赖顺序赌覆盖结果。

### 2.4 后裔懒加载究竟由什么触发？

官方当前表述很具体：Claude **读取子目录中的文件**时，位于该路径上的嵌套 `CLAUDE.md` 与 `CLAUDE.local.md` 才会被纳入。只是启动会话、在 Prompt 里提到目录名，或只看到一棵目录树，都不能当作已加载的证据。

#### ❌ 把“知道路径”当成“读过规则”

```plain
用户：修改 CSV 导入的金额校验逻辑。

# Claude 直接按猜测创建新文件，
# 没有先读 importers 下的现有文件。
```

不能据此断言 `src/expense_tracker/importers/CLAUDE.md` 已经触发。

#### ✅ 先建立局部上下文

```plain
请先读取：
- src/expense_tracker/importers/CLAUDE.md
- src/expense_tracker/importers/csv_importer.py
- tests/importers/test_csv_importer.py

确认局部规则后再修改。
```

读取真实文件会让局部指导进入上下文，也能补齐代码事实。

![09-lazy-loading-trigger.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/92f07984-09-lazy-loading-trigger.png)

> 🤔 规则加载后只对那一个文件生效吗？嵌套 CLAUDE.md 是按目录作用域设计的。它被触发后会进入当前会话上下文，用来指导该区域的工作；但不要把它理解成客户端级权限隔离。是否“允许”某个动作仍由 Settings、Hooks 与沙箱控制，前文已经区分了“行为指导”和“强制限制”。

### 2.5 三个启动场景，一次看懂根、后裔和兄弟目录

```plain
expense-tracker-lab/
├─ CLAUDE.md
└─ src/expense_tracker/
   ├─ CLAUDE.md
   ├─ reports/CLAUDE.md
   └─ importers/CLAUDE.md
```

| **场景**                                 | **启动时已加载**        | **后来读取** `src/expense_tracker/importers/csv_importer.py` | **关键结论**                                            |
| ---------------------------------------- | ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| 在 `expense-tracker-lab/` 启动           | 根 CLAUDE.md            | 领域包与 importers 规则按需加入                              | `reports` 与 `importers` 都是后裔，各自在被读取时触发。 |
| 在 `src/expense_tracker/reports/` 启动   | 根 + 领域包 + reports   | importers 是启动目录的兄弟分支，不会因启动而自动加入         | 只做月度报表时上下文更聚焦。                            |
| 在 `src/expense_tracker/importers/` 启动 | 根 + 领域包 + importers | 已经在启动集合                                               | CSV 导入局部规则从第一轮对话就可见。                    |

![10-three-startup-scenarios.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/2d26509c-10-three-startup-scenarios.png)

所以把兄弟目录描述成“永久不会加载”并不严谨。**从项目根启动时，**`reports` **与** `importers` **都是根的后裔，读取哪个就触发哪个；从** `reports` **启动时，**`importers` **才是当前启动子树之外的兄弟分支。**描述加载行为时必须同时说清启动目录和实际访问路径。

> ✅ 如何选择启动位置只改 CSV 导入：进入 src/expense_tracker/importers 启动，立即获得根规则 + 领域规则 + 导入规则，噪声最少。同时改汇总与导入：从 expense-tracker-lab 启动，再让 Claude 逐个读取 report.py 与 importers/csv_importer.py。不确定作用域：从项目根启动，先用 /context 看初始集合，再触发目标目录。

### 2.6 `--add-dir` 只授予访问，不默认带入规则

`--add-dir ../finance-rules` 会把额外目录加入 Claude 可访问范围，比如你把多个 Python 记账项目共用的金额规则放在外部目录。但官方当前默认行为是：**不会自动加载这个额外目录里的指导文件。**“能读文件”和“已加载规则”是两件事。

#### ❌ 只有访问权限

```plain
claude --add-dir ../finance-rules
```

Claude 能访问目录，但不要假设其中的 CLAUDE.md 已进入上下文。

#### ✅ 同时启用额外目录指导

```plain
# macOS / Linux
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 \
  claude --add-dir ../finance-rules

# PowerShell
$env:CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD='1'
claude --add-dir ..\finance-rules
```

会加载额外目录中的 CLAUDE.md、`.claude/CLAUDE.md`、rules 与 local 指导。

> ⚠️ local 还有一道门如果命令通过 --setting-sources 排除了 local，额外目录中的 CLAUDE.local.md 仍会跳过。排错时必须同时看环境变量和 setting sources，不能只检查文件是否存在。

### 2.7 用 `claudeMdExcludes` 控制大型仓库的噪声

大型 Python 仓库里可能存在旧实验目录、生成目录或其他团队留下的祖先规则。可以在任意 Settings 层配置 `claudeMdExcludes`，按绝对文件路径匹配 glob 并跳过指定指导文件：

```plain
{
  "claudeMdExcludes": [
    "**/expense-tracker-lab/experiments/**/CLAUDE.md",
    "/home/user/expense-tracker-lab/generated/.claude/rules/**"
  ]
}
```

| **细节** | **当前官方行为**                              | **排错含义**                               |
| -------- | --------------------------------------------- | ------------------------------------------ |
| 匹配对象 | 绝对文件路径，使用 glob 语法                  | 相对路径看起来正确，也可能一个都匹配不到。 |
| 设置层   | user、project、local、managed policy 都可配置 | 不要只检查当前项目的 settings。            |
| 数组合并 | 各设置层的数组会合并                          | 上层残留排除项不会被下层空数组简单覆盖。   |
| 托管指导 | Managed policy CLAUDE.md 不能被排除           | 组织级合规指导始终保留。                   |

> ⚠️ 排除是治理工具，不是冲突修复按钮团队共享规则发生冲突，应修正权威来源；个人为了当前任务屏蔽别的团队规则，才适合放进 .claude/settings.local.json。把公共排除项随意提交，可能让其他成员缺失必要指导。

### 2.8 `/compact` 后为什么局部规则像“失忆”了？

上下文压缩不是简单删聊天。官方当前行为是：项目根 CLAUDE.md 会在 `/compact` 后从磁盘重新读取并注入；嵌套在子目录里的 CLAUDE.md 不会自动全部重新注入，要等 Claude 再次读取对应子目录文件。

| **信息来源**             | `/compact` **后**              | **恢复方式**                                                 |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------ |
| 项目根 CLAUDE.md         | 自动从磁盘重新注入                 | 通常无需操作，用 `/context` 核对。                           |
| 嵌套 CLAUDE.md           | 不会自动全部恢复                   | 重新读取该目录中的文件，触发懒加载。                         |
| 只在对话里说过的临时要求 | 可能在压缩中丢失细节               | 长期规则写入 CLAUDE.md；本次关键约束在压缩后重申。           |
| `@import` 内容           | 取决于引用它的指导文件是否重新加载 | 压缩后用 `/context` 核对；import 只改善组织，不会节省上下文。 |

> 🤔 要不要把所有局部规则都搬到根目录，防止压缩后丢失？不要。那会让每次会话都承担无关上下文，并降低规则遵从度。正确做法是保持局部规则局部化，在跨包工作或压缩后主动重新读取相关文件。

![11-cd-add-dir-excludes.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/b992a718-11-cd-add-dir-excludes.png)

### 2.9 一套可复现的加载排错流程

不要用“Claude 好像没听话”来猜。把排错拆成可观察的证据链：

1. **确认版本与启动位置。**运行 `claude --version`；在启动前用 `pwd` 或 `Get-Location` 记录 cwd。
2. **看初始加载集合。**进入会话后运行 `/context`，在 **Memory files** 下确认真正进入当前上下文的文件。
3. **区分“可编辑”与“已加载”。**`/memory` 会列出可管理的位置，甚至包括尚不存在或当前未加载的文件；它不能替代 `/context`。
4. **触发目标目录。**让 Claude 读取目标包的一份真实源码，再运行 `/context`，观察嵌套指导是否出现。
5. **检查隐藏开关。**核对 `claudeMdExcludes`、`--setting-sources`、`--add-dir` 与 `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD`。
6. **定位“加载了但没遵守”。**如果文件已出现，问题就从加载层转向内容层：检查模糊表达、重复与冲突；强制动作改用 Hooks 或 permissions。

> 🔍 最新的精确观测手段官方推荐使用 InstructionsLoadedHook 记录哪份指导文件、在什么时候、因为什么原因被加载。普通用户先用 /context 足够；维护大型 Python 仓库或调试 path-scoped rules 时，再用这个 Hook 建立加载日志。

| **症状**                  | **最可能原因**       | **验证动作**                                   |
| ------------------------- | -------------------- | ---------------------------------------------- |
| 从根启动时包规则没出现    | 后裔尚未触发         | 读取包内源码，再看 `/context`。                |
| 切到包目录重启后规则出现  | 包从后裔变成当前目录 | 对比两次 cwd 与 Memory files。                 |
| `--add-dir` 后仍无规则    | 只增加了访问范围     | 检查额外目录环境变量是否为 `1`。               |
| `/compact` 后局部要求消失 | 嵌套规则未重新注入   | 重新读取局部文件。                             |
| 文件已加载但行为仍摇摆    | 规则模糊或互相冲突   | 搜索同主题规则，改成唯一、具体、可验证的表达。 |

![12-compact-rule-recovery.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/0d4afe03-12-compact-rule-recovery.png)

到这里，你已经能回答“指导文件何时进入上下文”。下一步的问题是：如果根 `CLAUDE.md` 已经太长，哪些内容该拆成导入文件，哪些又该改用路径规则按需出现？先看 `@import`。

## 三、@import：把长规则拆开，又不丢掉上下文

第 二章解决了“Claude 到底加载了哪份指导文件”，接下来会遇到一个更现实的问题：项目根 `CLAUDE.md` 越写越长，金额规则、测试流程、协作约定全挤在一起，改一条规则都要翻半天。

`@import` 就像给一本操作手册加“活页附件”：根文件保留入口和总原则，专题细节放进独立 Markdown 文件；当引用它的 `CLAUDE.md` 被加载时，Claude Code 会把附件一起展开。对项目根文件来说，这通常发生在会话启动阶段。

### 3.1 @import 解决什么问题？

它解决的是**无条件规则的模块化维护**。凡是每次处理这个项目都需要知道、但展开后又比较长的内容，都适合拆出去。例如支出追踪项目里的金额数据契约和统一测试流程。

| **内容**                            | **是否适合导入** | **原因**                                                     |
| ----------------------------------- | ---------------- | ------------------------------------------------------------ |
| Python 3.13、使用 uv                | 留在根文件       | 短、关键、每个任务都要看见                                   |
| 金额字段、日期格式、舍入规则        | ✅ 导入           | 全项目通用，细节多，值得独立维护                             |
| pytest 命令和测试数据规范           | ✅ 导入           | 实现与测试任务都会用到                                       |
| 只约束 `csv_importer.py` 的异常处理 | 不从根导入       | 属于局部规则，交给 `.claude/rules/*.md` 中带 `paths` 的 path-scoped rule |
| 真实银行卡账单、API Token           | ❌ 禁止导入       | 导入会把内容送入模型上下文，存在敏感信息风险                 |

> ⚠️ 模块化不等于省上下文被导入文件会随父级 CLAUDE.md 一起加载。把 300 行拆成 3 个 100 行文件，维护体验变好了，但进入上下文的内容并没有变少。只在特定文件任务中需要的规则，应放到 path-scoped rules，而不是继续导入；具体做法是在 .claude/rules/*.md 的 YAML frontmatter 中用 paths 限定匹配范围。

![13-import-vs-path-loading.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/a402b875-13-import-vs-path-loading.png)

### 3.2 语法很短，但加载时机要理解

导入语法就是 `@路径`。它可以出现在 `CLAUDE.md` 的正文或列表中；为了让人也能一眼看出依赖关系，推荐每个导入单独占一行，并集中放在文件前部。

```plain
# expense-tracker-lab/CLAUDE.md
# Expense Tracker Lab

- Python 3.13
- 使用 uv 管理依赖
- 默认测试命令：uv run pytest

@docs/expense-data-contract.md
@docs/testing-workflow.md
@AGENTS.md
```

启动会话时，Claude Code 读取根 `CLAUDE.md`，识别这三条路径，再把对应文件展开。换句话说，**导入文件不是等到模型“觉得有必要”才读取**，而是随引用文件一起进入指导上下文。

> ✅ 修改后怎样生效根文件的导入会在启动加载阶段展开；嵌套指导文件的导入随那份文件被发现时加载。新建导入或调整导入链后，最稳妥的验证方式是结束旧会话，从项目根目录重新运行 claude，再用 /context 检查 Memory files。不要只在旧对话里问“你看到了吗”来猜测。

### 3.3 相对路径不是相对 cwd

这是最常见的坑。相对路径始终从**写下这条** `@` **的文件所在目录**开始计算，不是从你运行 `claude` 的当前目录计算。

```plain
expense-tracker-lab/
├─ CLAUDE.md
├─ docs/
│  ├─ expense-data-contract.md
│  ├─ testing-workflow.md
│  └─ python/
│     └─ pytest-conventions.md
├─ src/expense_tracker/
│  ├─ report.py
│  └─ importers/csv_importer.py
└─ tests/
```

假设根文件导入 `docs/testing-workflow.md`，而后者还要继续导入 `docs/python/pytest-conventions.md`：

#### ❌ 容易写错

```plain
# docs/testing-workflow.md
@docs/python/pytest-conventions.md
```

解析结果会变成 `docs/docs/python/...`，因为当前导入文件已经在 `docs/` 里。

#### ✅ 正确写法

```plain
# docs/testing-workflow.md
@python/pytest-conventions.md
```

![14-relative-import-path-trap.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/721414ff-14-relative-import-path-trap.png)

从 `testing-workflow.md` 所在的 `docs/` 开始，正好找到目标文件。

绝对路径也受支持，官方示例还允许从用户目录导入，例如 `@~/.claude/python-personal.md`。不过，项目内能用相对路径时优先用相对路径：仓库换电脑、换用户名、放进 CI 后仍然有效。

### 3.4 4 hops 到底怎么算？

![15-four-hops.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/fa2163cd-15-four-hops.png)

**hop 就是沿着一个** `@import` **走出去的一次跳转**。它不是“目录层级”，也不是“总共只能导入 4 个文件”。计数从当前被加载的记忆文件开始：`CLAUDE.md` 自己是入口，不算 hop；它里面的第一条 `@docs/project-guide.md` 才是 hop 1。

同一层的多个导入不会互相累加。比如根 `CLAUDE.md` 同时导入 10 个专题文件，这 10 个文件各自都是 hop 1；真正受限制的是某一条连续链路：A 导入 B，B 又导入 C，C 再导入 D。

| **链路位置** | **文件**                | **发生了什么**                                               |
| ------------ | ----------------------- | ------------------------------------------------------------ |
| 入口，0 hop  | `CLAUDE.md`             | 写着 `@docs/project-guide.md`                                |
| hop 1        | `docs/project-guide.md` | 被入口导入；里面继续写 `@data/contract.md`                   |
| hop 2        | `docs/data/contract.md` | 被 hop 1 文件导入；里面继续写 `@money.md`                    |
| hop 3        | `docs/data/money.md`    | 被 hop 2 文件导入；里面继续写 `@rounding.md`                 |
| hop 4        | `docs/data/rounding.md` | 仍可进入上下文；如果它再写 `@edge-case.md`，那就是 hop 5，会超过递归导入边界 |

一句话记法：**数箭头，不数盒子**。`CLAUDE.md → A → B → C → D` 是 4 hops；`CLAUDE.md → A`、`CLAUDE.md → B`、`CLAUDE.md → C` 这种并排导入只是三条各自 1 hop 的链。

> 为什么偏偏是 4 hops？这是 Claude Code 对 @import 递归展开设置的产品边界，不是 Markdown 或文件系统的天然限制。这个上限主要解决三件事：第一，避免 A.md 导入 B.md、B.md 又导回 A.md 这类循环链；第二，控制上下文体积，防止一条深链把大量说明、README 和历史规则一起塞进模型；第三，让规则来源还能被人追踪。换句话说，4 hops 是“允许适度模块化”和“避免隐形配置网”之间的工程取舍。

> ⚠️ 不要把上限当设计目标能走到 4 层，不代表应该走到 4 层。实战中尽量保持“根文件 → 专题文件”一层结构；确实需要复用时再加第二层。深链条会让规则来源难追踪，也更容易因移动文件而断裂。

### 3.5 什么时候 @path 只是普通文字？

Claude Code 不会解析 Markdown 的行内代码和 fenced code block 中的导入文本。这个规则很实用：教程可以展示导入语法，规范也可以点名某个 `@path`，而不用真的把它加载进来。

````plain
# 这行会执行导入
@docs/expense-data-contract.md

# 反引号包裹后，只是普通文字
排错时检查 `@docs/expense-data-contract.md` 是否存在。

# fenced code block 里的内容也不会导入
```text
@examples/not-a-real-import.md
```

````
如果文件明明存在却没有出现在 `/context`，先看导入语句是不是被反引号包住，或者误放进了代码围栏。对写教程的人是保护机制，对粗心复制配置的人则是高频故障点。

### 3.6 导入项目外文件时，会发生什么？

项目内导入和项目外导入的信任级别不同。项目级 `CLAUDE.md` 如果解析到工作目录之外的文件，Claude Code 会在首次遇到时弹出审批对话框，避免一个刚下载的仓库悄悄读取你电脑上的其他说明文件。

| **场景** | **当前行为** | **应该怎么做** |
| --- | --- | --- |
| 项目内相对路径 | 随父文件正常加载 | 把规则纳入代码审查 |
| 项目级文件导入工作目录外内容 | 首次使用弹出审批 | 核对解析后的真实路径和文件内容，再决定是否允许 |
| 在审批中拒绝 | 外部导入保持禁用，之后不再重复弹窗 | 不要靠反复重启碰运气；先修正路径或在当前权限设置中重新审查 |
| `~/.claude/CLAUDE.md` 等用户级文件发起导入 | 视为用户自己的可信配置，不走项目级弹窗 | 只放个人通用规则，不存密钥和真实财务数据 |

> 🚨 导入不是读取秘密的捷径不要导入 .env、云凭据、访问令牌、真实账单或包含个人身份信息的日志。即使文件只在本机，导入后内容也会进入模型上下文。规则文件只应描述结构和约束，测试数据继续使用合成样本。

### 3.7 CLAUDE.local.md 与 Git worktree 怎么配合？

同一个 Python 仓库开多个 worktree 时，团队规则应该一致，但每个工作区的临时任务可能不同。可以把共享内容放进版本控制，把当前 worktree 的临时说明写进被 Git 忽略的 `CLAUDE.local.md`。

```plain
# expense-tracker-lab/CLAUDE.local.md
# 仅当前 worktree 使用，不提交

- 当前只处理 CSV 重复记录问题，不修改报表模块。
- 本地回归命令：uv run pytest tests/test_csv_importer.py -q
- 测试数据只能使用 tests/fixtures/ 下的合成账单。
```

创建后用下面的命令确认它确实被忽略；如果没有任何输出，再把 `CLAUDE.local.md` 加入项目或个人的 Git ignore 配置：

```plain
git check-ignore -v CLAUDE.local.md
```

真正需要跨 worktree 共享的个人偏好，不要复制多份。放到用户目录更合适：

```plain
# ~/.claude/CLAUDE.md
@~/.claude/python-personal.md

# ~/.claude/python-personal.md
- Python 示例优先写完整类型标注。
- 修改后报告执行过的 pytest 命令及结果。
```

> ✅ 三层职责记法仓库里的 CLAUDE.md 管团队共识，CLAUDE.local.md 管当前 worktree 的临时约束，~/.claude/CLAUDE.md 管你跨项目、跨 worktree 的个人习惯。三者不要互相复制。

### 3.8 哪些文件不应该导入？

| **不建议导入**                 | **风险**                      | **替代方案**                              |
| ------------------------------ | ----------------------------- | ----------------------------------------- |
| `.env`、密钥、真实账单         | 敏感内容进入上下文            | 只写变量名、数据结构和脱敏要求            |
| 构建日志、测试报告、覆盖率明细 | 体积大且每次变化，挤占上下文  | 需要排错时让 Claude 按任务读取            |
| 自动生成的 API 文档            | 噪声多，容易与源码版本不一致  | 导入短小、人工维护的接口契约              |
| 只对一个目录有效的规范         | 所有任务都被迫加载            | 使用嵌套 `CLAUDE.md` 或带 `paths` 的 rule |
| 仍会继续深层导入的“总目录”     | 容易撞上 4 hops，也难追踪来源 | 压平为一到两层，并在根文件列出入口        |

判断方法很简单：**每次会话都需要、内容稳定、没有敏感信息**，才进入导入链。三个条件少一个，就重新选择存放位置。

### 3.9 实战：把 expense-tracker-lab 的长文件拆成可验证的模块

下面不是“看懂就算”的示例，而是一套可以照着做的迁移。目标是让 Claude 在实现 CSV 导入器时始终知道金额、日期和测试约束，同时让根文件保持短小。

#### 第 1 步：确认最终目录

```plain
expense-tracker-lab/
├─ CLAUDE.md
├─ pyproject.toml
├─ docs/
│  ├─ expense-data-contract.md
│  └─ testing-workflow.md
├─ src/expense_tracker/
│  ├─ report.py
│  └─ importers/csv_importer.py
└─ tests/
   ├─ fixtures/sample_expenses.csv
   └─ test_csv_importer.py
```

#### 第 2 步：写金额与日期契约

新建 `docs/expense-data-contract.md`，只写稳定且可验证的数据约束：

```plain
# Expense data contract

- 金额在领域模型中使用整数分，例如 12.34 元存为 1234。
- 禁止使用 float 表示金额；解析十进制文本时使用 Decimal。
- 日期输入采用 ISO 8601 的 YYYY-MM-DD 格式。
- CSV 必填列：date、category、amount、description。
- 缺列、非法日期、非法金额必须抛出明确异常，不能静默跳过。
- 示例和测试只能使用合成财务数据。
```

这里故意写“结果约束”，不塞具体实现代码。未来从 CSV 换成数据库，这份契约仍然能用。

#### 第 3 步：写统一测试流程

新建 `docs/testing-workflow.md`：

```plain
# Testing workflow

- 安装依赖：uv sync
- 完整测试：uv run pytest
- 单文件测试：uv run pytest tests/test_csv_importer.py -q
- 修复缺陷时，先增加一个能复现问题的失败测试。
- CSV 测试至少覆盖：正常记录、缺列、非法日期、非法金额。
- 报告测试结果时，不得把“未运行”写成“通过”。
```

#### 第 4 步：把根文件改成入口页

```plain
# Expense Tracker Lab

## Runtime
- Python 3.13
- 使用 uv 管理依赖，禁止混用 pip 直接改环境。

## Imported project guidance
@docs/expense-data-contract.md
@docs/testing-workflow.md

## Default verification
- 修改 Python 代码后运行：uv run pytest
```

现在根文件只保留运行时、导入入口和默认验收命令；数据契约与测试流程各自只有一个事实来源。

#### 第 5 步：从项目根启动并验证加载

```plain
cd expense-tracker-lab
claude
```

进入 Claude Code 后执行 `/context`，在 Memory files 中确认根 `CLAUDE.md` 和两个 `docs/` 文件都已出现。若只看到根文件，先新开会话，再按下面的排错表检查。

#### 第 6 步：用真实任务验收，而不是只问“加载了吗”

把下面的任务交给 Claude。先要求它复述约束和计划，暂时不要改代码：

```plain
请读取 src/expense_tracker/importers/csv_importer.py 和
tests/test_csv_importer.py。先不要修改文件。

请列出本次任务必须遵守的金额、日期、异常处理和测试规则，
注明每组规则来自哪个指导文件；然后给出实现与验证计划。
目标：导入 CSV 支出记录，遇到非法金额时给出包含行号的明确错误。
```

合格回答至少应包含：金额使用整数分、文本用 `Decimal` 解析、日期使用 ISO 格式、错误不可静默吞掉、测试使用合成数据、执行指定 pytest 命令。确认计划无误后，再让它实施并检查测试输出。

> ✅ 这一步为什么有实际意义/context 只能证明文件进入了上下文；让 Claude 在真实任务前逐项引用规则，才能验证这些规则是否清晰、是否冲突、能否转化为可验收行为。两种验证缺一不可。

#### 第 7 步：按症状排错

| **症状**                   | **可能原因**                   | **检查动作**                                   |
| -------------------------- | ------------------------------ | ---------------------------------------------- |
| `/context` 只有根文件      | 仍在旧会话，或导入写进了代码块 | 新开会话；检查反引号和三反引号边界             |
| 提示找不到文件             | 把路径误写成相对 cwd           | 从“包含该 @ 的文件”所在目录重新计算            |
| 前两层能加载，深层缺失     | 链条超过 4 hops                | 压平目录，让根文件直接导入专题文件             |
| 外部个人规则没出现         | 项目级外部导入被拒绝           | 检查当前权限状态；需要共享时改由用户级文件组织 |
| 规则已加载但 Claude 仍摇摆 | 表述模糊或与其他文件冲突       | 搜索同主题规则，保留唯一、具体、可测试的版本   |

![16-modularize-long-claude-md.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/8725a8e0-16-modularize-long-claude-md.png)

到这里，根文件已经能拆得清楚，也知道导入文件仍会随父文件无条件进入上下文。至于 `.claude/rules` 和 `AGENTS.md`，它们会在后续独立章节详细展开。本篇先把问题推进到更常见的大型仓库场景：一个仓库里有多个应用、多个包、多个测试入口时，`CLAUDE.md` 应该怎样分层，Claude Code 又应该从哪里启动？

## 四、Monorepo：根规则管交通，包规则管路况

Monorepo 最容易写坏 `CLAUDE.md`，因为它天然有多个应用、多个包、多个测试入口和多套局部约束。正确做法不是把所有知识塞进根文件，而是建立一套可追踪的分层：根文件说明全仓库共识，包级文件说明局部事实，任务提示说明本次目标，运行时权限和 Hook 负责强制边界。

### 4.1 先抓住大仓的三个边界

| **边界** | **它决定什么**                                              | **常见错误**                                          | **正确做法**                                                 |
| -------- | ----------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| 启动目录 | 哪些祖先 `CLAUDE.md` 会立即进入上下文，默认工作目录在哪里。 | 永远从仓库根启动，然后抱怨包级规则没出现。            | 只改一个包就从包目录启动；跨包任务再从根启动并明确读取相关包文件。 |
| 访问范围 | Claude Code 能不能读取或修改某个目录。                      | 以为 `--add-dir` 会自动加载额外目录里的 `CLAUDE.md`。 | `--add-dir` 只是扩展可访问目录；需要规则时仍要显式导入或在正确目录启动。 |
| 规则来源 | 同一条约束应该写在哪里，是否会被重复加载。                  | 根、包、README 各写一份测试命令，几年后互相冲突。     | 共享事实写根，包级例外写包，长背景写文档并按需导入；每条规则保留一个事实来源。 |

把这三件事分清，Monorepo 才不会变成“所有规则都写一点、哪里都不可信”的配置泥潭。

### 4.2 推荐目录：根短、包准、流程另放

```plain
repo/
├── CLAUDE.md                    # 全仓库：包管理器、默认验证、安全边界、跨包触发
├── .claude/
│   ├── settings.json            # permissions / hooks / env / additionalDirectories
│   ├── commands/                # 低频但可复用的 slash commands
│   └── skills/                  # 发布、迁移、审计等长流程
├── apps/
│   ├── api/
│   │   └── CLAUDE.md            # FastAPI、迁移、OpenAPI、集成测试
│   └── worker/
│       └── CLAUDE.md            # 队列语义、重试策略、禁止 live network 单测
├── packages/
│   ├── domain/
│   │   └── CLAUDE.md            # 共享领域模型、不变量、契约测试
│   └── billing/
│       └── CLAUDE.md            # 金额、舍入、账单 fixture、支付沙箱
└── pyproject.toml / pnpm-workspace.yaml / turbo.json
```

根 `CLAUDE.md` 是地图，不是百科。它应该让 Claude 进仓库后知道“怎么安装、默认怎么测、哪些动作危险、跨包改动要看哪里”；包级 `CLAUDE.md` 才写“这个包为什么特殊”。长流程不要常驻根文件，低频流程更适合做成 slash command 或 Skill，根文件只保留入口命令。

![17-monorepo-rule-map.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/0b305326-17-monorepo-rule-map.png)

### 4.3 根 CLAUDE.md 写什么，不写什么

| **根文件应该写**     | **原因**                                    | **示例**                                                 |
| -------------------- | ------------------------------------------- | -------------------------------------------------------- |
| 统一工具链与安装命令 | 所有包都绕不开，写错会直接失败。            | `uv sync --all-extras`、`pnpm install --frozen-lockfile` |
| 默认验证入口         | 没有更具体命令时，Claude 至少知道最小验收。 | `uv run pytest -q`、`pnpm turbo test --filter=...`       |
| 全仓库安全边界       | 任何包都不应越过。                          | 不得使用真实客户数据；生产操作必须请示；生成文件先改源。 |
| 跨包触发条件         | 这是大仓最容易漏的知识。                    | 改 schema 要生成客户端；改 domain 要跑 API 类型检查。    |
| 包目录索引           | 帮助 Claude 快速定位责任边界。              | `apps/api` 管 HTTP；`packages/billing` 管金额和发票。    |

| **根文件不应该写**            | **为什么**                            | **应该放哪里**                                  |
| ----------------------------- | ------------------------------------- | ----------------------------------------------- |
| 某个包的长篇实现细则          | 让所有任务都背无关上下文。            | 对应包的 `CLAUDE.md`。                          |
| 完整 README、架构史、会议决议 | 体积大，信号弱，容易过期。            | `docs/` 文档；必要时用 `@import` 导入短契约。   |
| 个人调试端口和本地脚本        | 污染团队规则。                        | `CLAUDE.local.md` 或用户级配置。                |
| 权限禁令的唯一实现            | Markdown 是行为引导，不是工具级拒绝。 | Settings `permissions.deny`、Hooks、沙箱或 CI。 |

### 4.4 一个可直接改造的根文件骨架

```plain
# CLAUDE.md

## Workspace
- This is a monorepo. Start broad, then narrow to the touched package.
- Package manager: uv workspace. Do not mix pip installs into the repo env.
- Default verification after Python changes: `uv run pytest -q`.

## Package map
- `apps/api`: FastAPI service, OpenAPI schema, DB migrations.
- `apps/worker`: async jobs, retry policy, no live network in unit tests.
- `packages/domain`: shared entities and invariants.
- `packages/billing`: money, invoices, payment adapter contracts.

## Cross-package triggers
- Changing OpenAPI or schema sources:
  1. Regenerate clients with the documented generator.
  2. Run API tests and dependent type checks.
- Changing `packages/domain/**`:
  1. Run domain tests.
  2. Run API and billing tests that import domain models.
- Never edit generated files without updating the source of truth first.

## Safety
- Never use real customer, payment, or production data in tests.
- Ask before running migrations, destructive scripts, or networked integration tests.
```

这个根文件故意不写“API 每个路由怎么测”“billing 金额怎么舍入”。这些是局部事实，应该下沉到包级文件。

### 4.5 包级 CLAUDE.md 写“局部契约”

#### ❌ 根文件复制每个包的细节

```plain
# root CLAUDE.md
- API routes use FastAPI dependencies...
- Worker retries use exponential backoff...
- Billing stores cents and rounds half up...
- Domain IDs are ULIDs...
- Frontend uses React Query...
```

看起来全面，实际会让所有任务都加载所有包细节。包越多，冲突和过期越快。

#### ✅ 包里只写包内不可推导事实

```plain
# packages/billing/CLAUDE.md

## Billing invariants
- Store money as integer cents.
- Use Decimal only at parsing boundaries.
- Contract tests live in `packages/billing/tests/contract`.
- After billing changes, run:
  `uv run pytest packages/billing/tests -q`
```

当任务进入 billing 包时，这些规则离代码最近，也更容易由包维护者负责。

> ✅ 单一事实来源根文件只说“billing 负责金额与发票，改它要跑包级测试”；金额舍入细则只在 packages/billing/CLAUDE.md 写。根可以指向包，但不要复制包。

![18-root-vs-package-rules.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/3bdb2f39-18-root-vs-package-rules.png)

### 4.6 从哪里启动 Claude Code？

| **任务类型**         | **推荐启动方式**                       | **为什么**                                     | **启动后第一步**                                             |
| -------------------- | -------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| 只改一个包           | `cd packages/billing && claude`        | 根到当前目录的指导会立即可见，默认路径也更窄。 | 运行 `/context`，确认根和 billing 指导都在。                 |
| 从根做小型跨包改动   | `cd repo && claude`                    | 根文件给出包地图和跨包触发条件。               | 先要求读取目标包的关键文件，再确认相关包级指导是否进入上下文。 |
| 需要访问仓库外共享包 | `claude --add-dir ../shared-contracts` | 官方推荐用额外目录扩展可访问范围。             | 明确要求读取共享目录里的目标文件；不要以为它的 `CLAUDE.md` 会自动加载。 |
| 长期需要多个外部目录 | 在 settings 配 `additionalDirectories` | 减少每次手写参数，适合稳定工作区。             | 用 `/context` 和实际 Read 验证访问范围。                     |
| 大范围重构           | 根启动，先做计划，再分包执行           | 避免一次性把所有包细节塞进上下文。             | 按包列验收命令，逐批修改、逐批测试。                         |

官方 large-codebases 文档强调：先从正确目录启动，并用 `/context` 检查当前上下文。还要记住一个容易被忽略的差异：`CLAUDE.md` 会沿祖先目录加载，但 project settings 不按同样方式继承父目录。根目录的 `.claude/settings.json` 主要在你从根启动时生效；经常从包目录启动的团队，要确认设置文件放在实际启动目录能读到的位置。

### 4.7 外部目录、settings 与工作树

Monorepo 经常不是一个孤立目录：协议定义可能在相邻仓库，SDK 可能通过 worktree 打开，生成物可能在另一个路径。Claude Code 支持通过 `--add-dir` 或 settings 中的 `additionalDirectories` 扩展可访问目录；在 worktree 场景，还可以用稀疏检出和目录链接减少磁盘与上下文噪声。

| **机制**                | **能做什么**                                         | **不能假设什么**                                        | **建议**                                                     |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| `--add-dir ../shared`   | 让 Claude Code 可以读取额外目录。                    | 不会自动把额外目录的 `CLAUDE.md` 当成当前项目规则加载。 | 根文件写清“共享契约在 ../shared”，任务里明确要求读取目标文件。 |
| `additionalDirectories` | 把稳定外部目录写进项目设置。                         | 不代表外部仓库的 settings、Hooks、权限策略自动继承。    | 把当前仓库的权限边界写在当前仓库 settings 中。               |
| `worktree.sparsePaths`  | Claude 创建 worktree 时只检出指定目录和根级文件。    | 不是运行时搜索过滤器，也不会自动代表所有包都可见。      | 给并行任务列出实际需要的包，例如 `.claude`、`packages/api`、`packages/shared`。 |
| `symlinkDirectories`    | 让 worktree 里的大目录链接回主工作区，避免重复拷贝。 | 不适合链接会被任务独立修改的目录。                      | 常见对象是 `node_modules` 一类体积大、可复用的依赖目录。     |
| Git worktree            | 并行处理多个分支或包迁移。                           | 不要把临时任务说明提交到共享根文件。                    | 每个 worktree 用 `CLAUDE.local.md` 记录本地任务状态，并加入 ignore。 |

> ⚠️ 访问范围不是信任范围给 Claude Code 增加可访问目录，只表示“能读到”，不表示“应该默认信任”。第三方仓库、下载的示例、外部协议目录都可能包含提示注入内容。先审查，再导入；规则文件里不要放密钥、令牌或真实数据。

### 4.8 降低噪声：排除、限制、延迟

大仓里最贵的不是目录多，而是无关信息多。官方建议用 `claudeMdExcludes` 排除不该进入上下文的记忆文件，用 `permissions.deny` 阻止读取生成物和 vendor，用代码智能插件减少全仓库扫描，并通过提示让 Claude 先缩小调查面。

| **噪声来源**                   | **风险**                                  | **处理方式**                                                 |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| 过期包级 `CLAUDE.md`           | 规则与真实命令冲突。                      | 删除或修正；必要时用 `claudeMdExcludes` 临时排除。           |
| 已提交的生成目录、vendor、快照 | Claude 浪费时间读不可手改内容，甚至误改。 | 根文件写明禁止手改；对高风险路径加 `Read(...)` deny，并用 Hook 或 CI 检查。 |
| 大型日志、覆盖率、构建产物     | 挤占上下文且经常过期。                    | 不要导入；让 Claude 在排错任务中按需读取具体片段。           |
| 找定义、调用方时全仓库搜索过宽 | 工具调用多，结论慢，容易读进无关文件。    | 优先使用语言服务或代码智能插件；没有插件时先限定包和符号范围。 |
| worktree 检出整个大仓          | 并行任务启动慢，磁盘占用高。              | 用 `worktree.sparsePaths` 只检出任务需要的目录。             |

### 4.9 跨包变更要写成触发清单

Monorepo 的核心不是“每个包都自治”，而是把跨包影响显式写出来。触发清单要写在根文件，因为它描述的是包之间的关系。

```plain
## Cross-package triggers

- If `apps/api/openapi.yaml` or schema source changes:
  1. Regenerate API client from the schema source.
  2. Run `uv run pytest apps/api/tests -q`.
  3. Run dependent client type checks.

- If `packages/domain/**` changes:
  1. Run `uv run pytest packages/domain/tests -q`.
  2. Run billing and API tests that import domain models.

- If generated files under `packages/client/generated/**` differ:
  1. Do not edit generated files directly.
  2. Update the schema/source and rerun the generator.
  3. Report the generator command and diff summary.
```

触发清单不要写成泛泛的“注意同步其他包”。它必须包含路径、动作和验收命令。Claude 最擅长执行明确清单，最容易漏掉含糊的组织口头约定。

![19-cross-package-trigger-checklist.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/ba6588dc-19-cross-package-trigger-checklist.png)

### 4.10 用 /context 验收大仓规则

1. **从根启动。**运行 `/context`，确认根 `CLAUDE.md`、用户级规则和当前设置来源符合预期。
2. **读取一个包文件。**例如 `packages/billing/src/invoice.py`，再运行 `/context`，确认 billing 包级指导出现。
3. **读取兄弟包文件。**例如 API schema 或 domain model，观察对应包规则是否进入上下文；没有进入就检查启动目录和读取路径。
4. **跑一个真实小任务。**让 Claude 先列出本次适用的根级和包级规则，再给计划；不要只看文件是否被列出。
5. **记录结果。**统计漏跑测试、误改生成文件、跨包遗漏次数；这些指标比“感觉更聪明”更可靠。

Monorepo 的好规则体系不是“大而全”，而是**根文件可导航、包文件可执行、跨包触发可验证、访问范围可观察**。先把这套骨架搭稳，再把更细的路径差异下沉到`.claude/rules`、`AGENTS.md` 和真实任务验证是否按预期加载。

## 五、排障三件套：/context · /memory · /doctor

规则“没生效”时，先别改一堆 Markdown，也别直接断言“Claude 不听话”。最新官方排障思路是：先看**实际加载了什么**，再判断问题属于记忆文件、配置、权限、Hook、MCP、性能，还是指令本身写得太模糊。`/context`、`/memory`、`/doctor` 是入口，但完整排障通常还会用到 `/status`、`/permissions`、`/hooks`、`/mcp`、`/debug` 和 `claude --safe-mode`。

### 5.1 三件套各自看什么

#### 1. /context

看当前会话上下文组成：system prompt、工具、MCP、subagents、memory files、skills、conversation messages。排查“规则没进来”先跑它。

#### 2. /memory

列出用户级、项目级、local、Auto memory 等可管理位置；可打开文件、创建缺失文件、进入 auto memory 文件夹，并切换 auto memory。

#### 3. /doctor

做安装和配置体检：无效 settings、重复安装、未使用扩展、重复 subagent 名称、可裁剪的已提交 CLAUDE.md，并在确认后应用修复。

> ⚠️ /memory 不是 /context 的替代品/memory 会列出“可以管理的文件位置”，甚至包括尚不存在或当前未加载的文件；它不能证明某份规则已经进入本会话。要确认 Claude 当前看到了什么，必须用 /context。

### 5.2 最短诊断闭环

1. **先问“看见了吗”**。运行 `/context`，在 Memory files 下确认目标 `CLAUDE.md`、`CLAUDE.local.md`、导入文件或相关说明是否真的加载。
2. **再问“从哪来的”**。核对文件路径、启动目录、祖先/后裔加载关系、`claudeMdExcludes`、`--add-dir` 与 `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD`。
3. **然后问“写清了吗”**。如果文件已加载但行为仍不稳定，检查指令是否具体、短、可验证，是否与另一份文件冲突。冲突时 Claude 可能任意选择，不要赌优先级。
4. **再分“指导还是强制”**。`CLAUDE.md` 是 system prompt 之后的 user message，引导行为但不保证硬拒绝。需要禁止工具、生产操作、密钥读取时，看 `/permissions`、Hooks、沙箱和 CI。
5. **最后做隔离实验**。用 `/doctor`、`/status`、`/hooks`、`/mcp` 定位配置面；必要时用 `claude --safe-mode` 或干净 `CLAUDE_CONFIG_DIR` 复现。

![20-troubleshooting-toolkit-loop.png](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/425f235c-20-troubleshooting-toolkit-loop.png)

### 5.3 按症状查，不要混在一起查

| **症状**                               | **先看什么**             | **常见原因**                                                 | **下一步**                                                   |
| -------------------------------------- | ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 规则完全没生效                         | `/context`               | 文件没加载、启动目录错、后裔目录未触发、被 `claudeMdExcludes` 排除。 | 从正确目录重开；读取目标包文件；检查排除配置。               |
| `/memory` 里有文件，但 Claude 仍看不到 | `/context`               | `/memory` 只说明可管理，不说明已进入当前上下文。             | 按加载规则重新验证，必要时新开会话。                         |
| 已加载但执行摇摆                       | 指令文本本身             | 规则太长、太泛、互相冲突，或把建议写成了硬要求。             | 压缩到具体动作、路径、命令、验收；保留单一事实来源。         |
| 改完 settings 没生效                   | `/status`、`/doctor`     | scope 覆盖顺序误判；`settings.local.json` 覆盖了项目或用户设置；环境变量/命令行参数又覆盖一层。 | 查看 active settings sources；按 managed、local、project、user 与 env/flag 逐层排除。 |
| 权限或 Hook 没拦住                     | `/permissions`、`/hooks` | deny pattern 不匹配真实命令；Hook matcher 写错；Hook 放错文件；大小写不对。 | 用 `/hooks` 确认是否注册；必要时用 `claude --debug hooks` 看匹配过程。 |
| MCP 工具没出现                         | `/mcp`                   | 项目 MCP 未审批；服务器启动失败；相对路径从启动目录解析错；连接成功但返回 0 个工具。 | 在 `/mcp` 中审批或 reconnect；本地脚本用绝对路径。           |
| 卡顿、上下文反复爆掉                   | `/context`、`/doctor`    | 读了大文件、大表、构建产物；auto-compact thrashing；插件/MCP/Hook 造成额外负载。 | `/compact` 指定保留重点；分块读取；必要时 `/clear` 或 `claude --safe-mode`。 |
| Claude Code 启不起来                   | 终端命令 `claude doctor` | 安装、PATH、设置文件或登录状态问题。                         | 先拿只读诊断；启动后再用 `/doctor` 做会话内检查。            |

### 5.4 /doctor、claude doctor 和 safe mode 的区别

| **工具**                 | **什么时候用**                                               | **会看到什么**                                               | **注意点**                                                   |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `/doctor`                | Claude Code 已经在会话里运行，但配置、上下文或规则表现异常。 | 安装健康、无效 settings、重复安装、未使用扩展、重复 subagent 名称、可裁剪的已提交 `CLAUDE.md`。 | 它会提出修复，通常需要你确认后才应用。CLAUDE.md trim 检查需要 v2.1.206 或更新版本。 |
| `claude doctor`          | `claude` 启不起来，或你想在 shell 里拿只读诊断。             | 安装与 settings 诊断。                                       | 不需要进入交互会话；适合排查启动前问题。                     |
| `claude --safe-mode`     | 怀疑插件、MCP、Hook、skills、commands、agents 或项目 memory 影响了行为。 | 一个禁用自定义项的临时会话。                                 | 如果 safe mode 正常，问题就在自定义配置面；managed policy 通常仍可能生效。 |
| 干净 `CLAUDE_CONFIG_DIR` | safe mode 仍无法解释，或怀疑用户级配置目录污染。             | 近似首次启动的干净配置环境。                                 | Linux/Windows 可能需要重新登录；不要在真实项目里做破坏性验证。 |

### 5.5 /compact 后规则“丢了”怎么判断？

`/compact` 之后，项目根 `CLAUDE.md` 会从磁盘重新读取并重新注入；子目录里的嵌套 `CLAUDE.md` 不一定自动回来，通常要等 Claude 再次读取该子目录下文件才重新加载。会话里临时说过、但没有写入文件的约束，则可能随着压缩摘要被弱化或丢失。

> ✅ 压缩后的恢复顺序先跑 /context 看根文件是否仍在；再读取目标包源码，触发嵌套指导；最后让 Claude 复述“本任务适用规则及来源”。如果这一步说不清，不要继续改代码。

### 5.6 一段可直接复制的排障提示

```plain
请先不要修改代码。请按下面顺序排查：

1. 运行 /context，列出当前加载的 CLAUDE.md、CLAUDE.local.md、
   import 文件、Auto memory 和相关配置来源。
2. 判断本任务应适用哪些规则，逐条注明来源文件。
3. 如果缺少规则，说明是启动目录、后裔未触发、排除配置、
   --add-dir 误解，还是文件路径错误。
4. 如果规则已加载但冲突，列出冲突行并建议保留哪个事实来源。
5. 如果需要硬拒绝，说明应该改 permissions、Hook、沙箱还是 CI，
   不要只建议再写一句 Markdown。
```

这段提示的价值在于把“感觉没生效”拆成可观察证据：文件是否加载、来源是否正确、规则是否冲突、是否需要强制机制。排障不是让 Claude 猜原因，而是让它拿当前会话里的实际上下文说话。

## 结语：规则写对了，还要在正确时机出现

规则“没生效”时，最容易犯的错是继续往根`CLAUDE.md` 里加字。可真正的问题，可能是规则属于另一个作用域、子目录尚未触发、额外目录只获得了访问权限，或者上下文压缩后局部文件还没重新加载。

把这一篇收成五条：

- **作用域**：回答谁需要、哪里需要、需要多久；局部规则不要复制到根目录。
- **加载**：祖先启动加载，后裔读取触发；文件存在不等于当前会话已经看见。
- **模块化**：@import 负责组织无条件规则，不负责节省上下文；连续导入最多 4 hops。
- **Monorepo**：根文件负责导航和跨包交通，包级文件负责不可推导的局部契约。
- **排障**：`/context` 看实际加载，`/memory`  管理文件，`/doctor`  做配置体检；需要时再用 safe mode 与 InstructionsLoaded Hook 做隔离和观测。

说白了，好的规则系统不是把所有知识塞进一个文件，而是让正确的信息在正确的目录、正确的任务和正确的时间出现。做到这一步，Claude 才不是“偶尔碰巧遵守规则”，而是能在复杂仓库里稳定找到该走的路。

