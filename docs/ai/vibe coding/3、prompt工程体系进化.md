---
title: 3、prompt工程体系进化
date: 2026-04-28
tags: ["AI", "Vibe Coding"]
description: prompt工程体系进化
---
<!-- 这是一张图片，ocr 内容为：PROMPT工程体系进化 好 从 PROMPT ENGINEERING 到 CONTEXT ENGINEERING 6大结构要素 PROMPT 2.0 四四四 从会聊天 CONSTRAINT ROLE 到会写任务单 OUTPUT CONTEXT 核心思想 规格书 VERIFICATION TASK 任务定义 输出为什么会变 3 高级提示策略 训练 上下文供给 分解 ZERO-SHOT 对齐 结构化输出 FEW-SHOT 边界约束 上下文 PLAN-FIRST 模型会猜 验证机制 T CHAINING CONTEXT ENGINEERING PROMPT  线性链 相关 可信 PROMPT不是话术, 路由链 完整 可引用 反馈链 而是任务规格书 新鲜 交接格式 工程化落地 AGENT与安全边界 生命周期模板 PLAN-THEN-EXECUTE 高风险操作 工具调用 显式授权 先问四个问题 跨工具适配 调试迭代 工程结论:高质量输出三任务清晰 (上下文正确X约束明确X 验证到位 教学类比用于帮助理解,实际落地仍需测试,审查与评估 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777375070918-dac27ffb-ccb5-4f6b-9ac1-0d8dec429d4f.png)<font style="color:rgb(26, 26, 46);">你有没有过这种经历——</font>

<font style="color:rgb(26, 26, 46);"></font><font style="color:rgb(51, 51, 51);">让 AI 帮你写一个功能，结果它输出了 500 行代码，但完全不是你要的。你补一句“不是这个意思，我要的是……”，它又输出 500 行，还是偏。来回拉扯几轮之后，你开始怀疑模型能力，模型也开始沿着错误方向越走越远。</font>

<font style="color:rgb(51, 51, 51);">也可能是另一种情况：你精心写了一段 Prompt，加上“深呼吸”“一步一步想”“你是一个资深工程师”等提示，某一次效果不错，但换个模型、换个工具、换个任务之后，这些话术又突然失效。</font>

**<font style="color:rgb(15, 23, 42);">问题出在哪？不是 AI 太笨，是你把 Prompt 工程当成了"话术"。</font>**

<font style="color:rgb(26, 26, 46);">真正的 Prompt 工程不是教 AI 怎么写代码，而是</font>**<font style="color:rgb(15, 23, 42);">定义清楚上下文、边界与成功标准</font>**<font style="color:rgb(26, 26, 46);">。它更像写一份严谨的任务规格书（Spec），而不是跟 AI 聊天。</font>

**<font style="color:rgb(15, 23, 42);">这章要讲透的一件事只有一句：</font>**<font style="color:rgb(26, 26, 46);">Prompt 的本质不是“跟 AI 说话的艺术”，而是“给一个高能力、但没上下文的新同事写任务规格书”。</font>

## <font style="color:rgb(15, 23, 42);">一、Prompt Engineering 2.0：从“会聊天”升级成“会写任务单”</font>

<!-- 这是一张图片，ocr 内容为：从"会聊天"升级成"会写任务单" 好从 一句"帮我重构" 从教AI 不要神化 PROMPT是规格书 容易翻车 到定义任务 角色扮演 规格书 任务定义 000 任务定义 别靠咒语 规格书 别靠咒语 女 评分框架办 优秀PROMPT的三个标准 梦 输入质量模型理解 输出达成 价值效果 完整 清晰 可验证 -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1777369126036-3c5abb82-5d0f-4f1c-9494-678a19b1c451.png)

<font style="color:rgb(26, 26, 46);">先说一个残酷的事实：</font>**<font style="color:rgb(15, 23, 42);">2024 年那些所谓的"Prompt 技巧"，到 2026 年大部分已经没用了。</font>**

<font style="color:rgb(26, 26, 46);">"深呼吸"、"一步一步想"、"你是一个拥有 20 年经验的专家"——这些在早期模型上确实有点用，因为那时候模型需要"被引导"才能输出高质量内容。但现在的模型已经足够聪明，不需要你哄着它干活了。</font>

<font style="color:rgb(26, 26, 46);">你可以把 Prompt 1.0 理解成“口头交代活儿”。你对着同事说：“这个页面帮我改得高级一点。”听起来像指令，实际上啥都没说清。</font><font style="color:rgb(51, 51, 51);">什么叫高级？改视觉、交互、性能、动效、信息架构，还是代码结构？哪些文件能动？哪些行为不能变？怎么判断改好了？</font>

<font style="color:rgb(26, 26, 46);">Prompt 2.0 就不一样了。它更像 Jira 任务卡、PRD 切片，或者你写给外包团队的一页执行说明。目标是什么，哪些文件能动，哪些行为不能变，验收怎么过，失败长什么样，全部要落下来。</font>

<font style="color:rgb(26, 26, 46);">为什么会变成这样？因为模型再强，本质上仍然是一个</font>**<font style="color:rgb(15, 23, 42);">没有项目隐性知识、没有团队默契、没有风险嗅觉</font>**<font style="color:rgb(26, 26, 46);">的执行者。Anthropic 在 Prompt 文档里有个比喻很准确：把模型当成一个“聪明但失忆的新员工”来看，你的 Prompt 质量会立刻上一个台阶。</font>

<!-- 这是一张图片，ocr 内容为：从话术到规格书 PROMPT 1.0 PROMPT 2.0: PROMPT2.0:工程规格 PROMPT1.0:口头交代 帮我优化一下登录流程" 目标:只修复邮箱登录超时重试 补齐上下文 "写得高级一点" 约束:不改API签名,不加新依赖 落地约束 输出:补丁+风险点+测试清单 "别太复杂,顺便把体验做好" 声明验收 X目标模糊 可执行 X约束缺失 可验证 X验收空白 可复用 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777288509951-c0712c41-5b48-4ef5-a31e-97d032bcdfe7.png)

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 最常见的误区</font>**

<font style="color:rgb(26, 26, 46);">很多人以为“让模型多想一想”就能自动补齐缺失信息。真相刚好相反：</font>**<font style="color:rgb(15, 23, 42);">缺失的业务背景、边界条件和成功标准，不会靠思考自己长出来。</font>**<font style="color:rgb(26, 26, 46);"> 你不写，模型就只能猜。</font><font style="color:rgb(51, 51, 51);">模型猜得越像真的，误导性反而越强。</font>

:::

### <font style="color:rgb(15, 23, 42);">1.1 </font><font style="color:rgb(51, 51, 51);">为什么说 Prompt 是规格书？</font>

<font style="color:rgb(51, 51, 51);">把它想成装修就很好理解。</font>

<font style="color:rgb(51, 51, 51);">如果你只跟装修队说“给我装个现代简约风”，最后得到的结果大概率是装修队心里的“现代简约”。靠谱的业主不会只说风格，他会给出平面图、预算、材质偏好、不能拆的承重墙、交付节点和验收标准。</font>

<font style="color:rgb(51, 51, 51);">写给 AI 的 Prompt 也是一样。角色设定像装修风格，真正决定工程结果的是图纸、预算、边界和验收。</font>

<font style="color:rgb(51, 51, 51);">在编程任务中，这些东西对应为：</font>

| **<font style="color:rgb(51, 51, 51);">装修工程</font>**   | **<font style="color:rgb(51, 51, 51);">AI 编程任务</font>**  |
| :--------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">平面图</font>         | <font style="color:rgb(51, 51, 51);">当前代码结构、目录树、依赖关系</font> |
| <font style="color:rgb(51, 51, 51);">预算</font>           | <font style="color:rgb(51, 51, 51);">时间、复杂度、性能、Token 成本</font> |
| <font style="color:rgb(51, 51, 51);">不能拆的承重墙</font> | <font style="color:rgb(51, 51, 51);">不能改的 API、数据表、权限逻辑</font> |
| <font style="color:rgb(51, 51, 51);">材质偏好</font>       | <font style="color:rgb(51, 51, 51);">代码风格、框架约定、团队规范</font> |
| <font style="color:rgb(51, 51, 51);">验收标准</font>       | <font style="color:rgb(51, 51, 51);">单元测试、类型检查、性能指标、人工 Review</font> |


<font style="color:rgb(51, 51, 51);">所以，一个成熟的 Prompt，不应该只回答“我要什么”，还要回答“你不能动什么”“你需要交付什么”“我怎么判断你做对了”。</font>

### <font style="color:rgb(15, 23, 42);">1.2 第一个真实案例：为什么一句“帮我重构”很容易翻车</font>

<font style="color:rgb(26, 26, 46);">来看一个典型翻车现场。任务本来只是把一个 React 表单组件拆干净，</font><font style="color:rgb(51, 51, 51);">结果它顺手改了接口调用、错误提示、提交节奏，甚至把服务端字段也换了。最后你看到的不是重构，而是一场未经授权的功能变更。</font>

<font style="color:rgb(51, 51, 51);">错误写法：</font>

```plain
帮我重构登录模块，
让代码更清晰一点，
顺便优化一下体验。
```

<font style="color:rgb(51, 51, 51);">这段 Prompt 的问题不在于它不礼貌，而在于它没有边界。“优化体验”几乎等于授权模型自由发挥。</font>

<font style="color:rgb(51, 51, 51);">更好的写法：</font>

```plain
重构 LoginForm 组件：

目标：
- 拆分表单校验逻辑，提高可维护性

范围：
- 只允许修改 src/features/auth/*
- 不修改 /api/login 的请求参数结构
- 不修改登录成功后的跳转逻辑

任务：
- 提取 useLoginFormValidation Hook
- 保持现有 UI 文案和交互行为不变

输出：
1. 修改计划
2. 受影响文件
3. 关键代码或 diff
4. 风险点
5. 测试清单

验收：
- 原有登录流程不变
- 空邮箱、非法邮箱、空密码均有测试点
- 不引入新依赖
```

<font style="color:rgb(51, 51, 51);">两者差别不在“措辞更高级”，而在</font>**<font style="color:rgb(51, 51, 51);">约束密度</font>**<font style="color:rgb(51, 51, 51);">。前者让模型自由解释任务，后者把目标、范围、禁区、交付物和验收标准都落下来了，</font><font style="color:rgb(26, 26, 46);">模型能做的空间就可控得多。</font>

:::info
<font style="color:rgb(26, 26, 46);">OpenAI 的 Prompt 指南明确建议：把应用固定到具体模型快照，并建立 evals 去持续衡量 Prompt 表现。原因很简单，Prompt 不是一次性咒语，而是持续演化的工程资产。</font>

:::

### <font style="color:rgb(15, 23, 42);">1.3 </font><font style="color:rgb(51, 51, 51);">不要神化“角色扮演”</font>

<font style="color:rgb(51, 51, 51);">角色设定不是没用，但它通常不是最关键的部分。</font>

```plain
你是一个资深全栈工程师。
请帮我优化这段代码。
```

<font style="color:rgb(51, 51, 51);">这类写法最大的问题是：它给了模型一个“身份”，却没有给模型一个“任务边界”。更可靠的写法是：</font>

```plain
重构 getUserOrders 函数：

目标：
- 将时间复杂度从 O(n²) 降到 O(n)

约束：
- 不修改函数签名
- 不引入新依赖
- 保持返回值结构不变

验收：
- 补充 Jest 测试
- 覆盖空数组、重复订单、超时场景
- 说明优化前后的复杂度差异
```

<font style="color:rgb(26, 26, 46);">看出区别了吗？一个是在"哄"AI，一个是在"定义任务"。</font>**<font style="color:rgb(15, 23, 42);">模型不需要你哄，它需要你把任务说清楚。</font>**

<font style="color:rgb(51, 51, 51);">角色设定可以帮助模型调整关注角度，比如“从安全审计视角”“从数据库性能优化视角”“从前端可访问性视角”。但它不能代替上下文、约束和验证。</font>

### <font style="color:rgb(15, 23, 42);">1.4 核心转变：从"教 AI"到"定义任务"</font>

<font style="color:rgb(51, 51, 51);">Prompt 工程的成熟化，至少包含三层转变：</font>

1. <font style="color:rgb(51, 51, 51);">从“教 AI 怎么写”转向“定义任务成功标准”；</font>
2. <font style="color:rgb(51, 51, 51);">从“模糊形容词”转向“可验证的 Acceptance Criteria”；</font>
3. <font style="color:rgb(51, 51, 51);">从“探索式闲聊”转向“工程指令 + 工作流编排”。</font>

<font style="color:rgb(51, 51, 51);">你不会跟开发团队说“帮我做一个好用的登录功能”，然后什么都不补充。你会写清楚支持哪些登录方式、密码规则是什么、失败时怎么提示、是否需要风控、是否影响已有用户。对 AI 也是一样。</font>

### <font style="color:rgb(15, 23, 42);">1.5 优秀 Prompt 的三个标准</font>

<font style="color:rgb(51, 51, 51);">一个优秀的 Prompt 至少应该满足三点：</font>

| **<font style="color:rgb(51, 51, 51);">标准</font>** | **<font style="color:rgb(51, 51, 51);">含义</font>**         | **<font style="color:rgb(51, 51, 51);">示例</font>**         |
| :--------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">可复用</font>   | <font style="color:rgb(51, 51, 51);">同类任务能复用模板</font> | <font style="color:rgb(51, 51, 51);">“重构函数模板”可用于多个函数</font> |
| <font style="color:rgb(51, 51, 51);">可验证</font>   | <font style="color:rgb(51, 51, 51);">输出能被测试或检查</font> | <font style="color:rgb(51, 51, 51);">“必须通过 npm test 和类型检查”</font> |
| <font style="color:rgb(51, 51, 51);">可迭代</font>   | <font style="color:rgb(51, 51, 51);">能基于失败样本持续改进</font> | <font style="color:rgb(51, 51, 51);">每次失败都能定位是上下文、约束还是输出格式问题</font> |


<font style="color:rgb(51, 51, 51);">如果一个 Prompt 只能靠作者本人现场解释才能用，它还不是工程资产，只是个人经验。</font>

### <font style="color:rgb(15, 23, 42);">1.6 Prompt 质量评分框架</font>

<font style="color:rgb(26, 26, 46);">怎么判断你的 Prompt 写得好不好？不要凭感觉，用五维评分框架打分：</font>

| **<font style="color:rgb(15, 23, 42);">维度</font>**     | **<font style="color:rgb(15, 23, 42);">1 分（模糊）</font>** | **<font style="color:rgb(15, 23, 42);">3 分（合格）</font>** | **<font style="color:rgb(15, 23, 42);">5 分（优秀）</font>** |
| :------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **<font style="color:rgb(15, 23, 42);">明确性</font>**   | <font style="color:rgb(26, 26, 46);">"优化代码"</font>       | <font style="color:rgb(26, 26, 46);">"重构函数降低复杂度"</font> | <font style="color:rgb(26, 26, 46);">"将 O(n²) 降到 O(n)，不修改签名"</font> |
| **<font style="color:rgb(15, 23, 42);">上下文</font>**   | <font style="color:rgb(26, 26, 46);">无背景信息</font>       | <font style="color:rgb(26, 26, 46);">提到技术栈</font>       | <font style="color:rgb(26, 26, 46);">技术栈+业务规则+代码风格+性能要求</font> |
| **<font style="color:rgb(15, 23, 42);">约束</font>**     | <font style="color:rgb(26, 26, 46);">无约束</font>           | <font style="color:rgb(26, 26, 46);">"不要用 lodash"</font>  | <font style="color:rgb(26, 26, 46);">白名单+黑名单+兼容性+性能边界</font> |
| **<font style="color:rgb(15, 23, 42);">可验证性</font>** | <font style="color:rgb(26, 26, 46);">"实现就好"</font>       | <font style="color:rgb(26, 26, 46);">"写单元测试"</font>     | <font style="color:rgb(26, 26, 46);">测试+lint+类型检查+性能基准</font> |
| **<font style="color:rgb(15, 23, 42);">可复用性</font>** | <font style="color:rgb(26, 26, 46);">一次性 Prompt</font>    | <font style="color:rgb(26, 26, 46);">模板化，有占位符</font> | <font style="color:rgb(26, 26, 46);">参数化模板+版本号+变更日志</font> |


**<font style="color:rgb(15, 23, 42);">如果你的 Prompt 平均分低于 3 分，它大概率会产生不可控的输出。</font>**<font style="color:rgb(26, 26, 46);">先补齐最短的板——通常是最缺的上下文和验收标准。</font>

<font style="color:rgb(26, 26, 46);">认知搭起来之后，下一步就该看骨架了。光知道“别玄学”还不够，你得知道一个能跑起来的编程 Prompt 到底该由哪些零件组成。</font>

## <font style="color:rgb(15, 23, 42);">二、高效编程 Prompt 的 6 大结构要素：别再写成一坨大白话</font>

<font style="color:rgb(26, 26, 46);">如果你经常把需求一股脑丢给模型，输出就会像拆盲盒。真正稳定的 Prompt，通常都能拆成六块：</font>

1. **<font style="color:rgb(15, 23, 42);">Role</font>**<font style="color:rgb(26, 26, 46);">：你希望模型以什么视角解决问题</font>
2. **<font style="color:rgb(15, 23, 42);">Context</font>**<font style="color:rgb(26, 26, 46);">：项目背景、技术栈、已有约束</font>
3. **<font style="color:rgb(15, 23, 42);">Task</font>**<font style="color:rgb(26, 26, 46);">：这次到底要干什么</font>
4. **<font style="color:rgb(15, 23, 42);">Constraint</font>**<font style="color:rgb(26, 26, 46);">：哪些不能动、哪些必须满足</font>
5. **<font style="color:rgb(15, 23, 42);">Output Format</font>**<font style="color:rgb(26, 26, 46);">：输出长什么样</font>
6. **<font style="color:rgb(15, 23, 42);">Verification</font>**<font style="color:rgb(26, 26, 46);">：怎么证明它做对了</font>

<font style="color:rgb(26, 26, 46);">类比一下：写一份功能开发合同，你得写清楚</font>**<font style="color:rgb(15, 23, 42);">谁来做（Role）、背景是什么（Context）、做什么（Task）、不能做什么（Constraint）、交付什么格式（Output）、怎么验收（Verification）</font>**<font style="color:rgb(26, 26, 46);">。给 AI 写 Prompt 也一样。</font>

<!-- 这是一张图片，ocr 内容为：2 CONTEXT ROLE 角色 上下文 个 PROMPT TASK CONSTRAINT 小I小 约束条件 任务 六要素 今 9 OUTPUT VERIFICATION 输出格式 稳定输出 验证标准 CONTEXT 最值钱: CONSTRAINT VERIFICATION 十 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369188961-10c2a840-61d8-4810-893f-090664aed956.png)

### <font style="color:rgb(15, 23, 42);">2.1 Role（角色与专长）</font>

<font style="color:rgb(26, 26, 46);">角色设定影响模型的"思考角度"和输出风格。但注意——</font>**<font style="color:rgb(15, 23, 42);">角色要具体，不要泛泛而谈</font>**<font style="color:rgb(26, 26, 46);">。</font>

**<font style="color:rgb(239, 68, 68);">❌</font>****<font style="color:rgb(239, 68, 68);"> 泛泛的角色</font>**

```plain
你是一个资深工程师
```

**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> 具体的角色</font>**

```plain
你是负责前端可维护性与无障碍体验的 React 工程师，
熟悉 TypeScript strict mode、WCAG 2.1 和 ARIA 实践。
```

<font style="color:rgb(51, 51, 51);">具体角色的价值，不是让模型“变成专家”，而是告诉模型优先关注什么：性能、安全、可访问性、稳定性、可维护性，还是上线风险。</font>

### <font style="color:rgb(15, 23, 42);">2.2 Context（业务背景）</font>

<font style="color:rgb(26, 26, 46);">这是最容易被忽略、但影响最大的要素。模型不知道你的技术栈、代码风格、业务规则——</font>**<font style="color:rgb(15, 23, 42);">你不说，它就按训练数据中最常见的模式来猜</font>**<font style="color:rgb(26, 26, 46);">，猜错了就是你的问题。</font>

```plain
背景：
- 技术栈：Next.js 14 App Router + TypeScript + Prisma
- 项目：高并发售票平台，QPS 峰值 5000+
- 现有代码风格：函数式组件、自定义 Hook 提取逻辑
- 业务规则：同一用户 5 分钟内只能购买 2 张票
```

<font style="color:rgb(51, 51, 51);">Context 不是越多越好，而是越相关越好。无关上下文会增加噪音，过期上下文会制造错误。</font>

### <font style="color:rgb(15, 23, 42);">2.3 Task（核心指令）</font>

<font style="color:rgb(26, 26, 46);">用动词开头、目标明确、范围清晰。</font>

**<font style="color:rgb(239, 68, 68);">❌</font>****<font style="color:rgb(239, 68, 68);"> 模糊的指令</font>**

```plain
帮我优化一下这个组件
```

**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> 精确的指令</font>**

```plain
重构 TicketPurchase 组件，
提取购买逻辑为自定义 Hook
useTicketPurchase，
保持组件 UI 不变
```

<font style="color:rgb(51, 51, 51);">一个好的 Task 应该让模型知道：做什么、不做什么、做到什么程度。</font>

### <font style="color:rgb(15, 23, 42);">2.4 Constraint（强约束）</font>

<font style="color:rgb(26, 26, 46);">约束越具体，输出越可控。</font>**<font style="color:rgb(15, 23, 42);">约束的本质是消除歧义</font>**<font style="color:rgb(26, 26, 46);">——告诉模型"不要做什么"比"做什么"更重要。</font>

```plain
约束：
- 禁止修改 API 签名（已有前端依赖）
- 禁止引入第三方 lodash（项目规范）
- 禁止使用 any 类型（TypeScript strict mode）
- 必须保持向后兼容
```

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 消除自相矛盾的约束</font>**

<font style="color:rgb(26, 26, 46);">检查你的约束是否自相矛盾。比如"用最简单方式实现"和"用上所有设计模式"就是矛盾的。模型遇到矛盾约束时，会随机选择一个方向——结果不可预测。</font>

:::

### <font style="color:rgb(15, 23, 42);">2.5 Output Format（输出规范）</font>

<font style="color:rgb(26, 26, 46);">结构化输出便于解析、审查和复用。不要让模型自由发挥格式。</font>

```plain
输出格式：
1. 只返回修改的代码块，不解释
2. 每个修改用 // CHANGED: 原因 标注
3. 末尾列出修改的文件清单
```

<font style="color:rgb(51, 51, 51);">自动化链路里，建议使用 JSON Schema、固定字段或 unified diff。人类阅读场景下，可以使用 Markdown 分段。</font>

### <font style="color:rgb(15, 23, 42);">2.6 Verification（验证/验收）</font>

**<font style="color:rgb(15, 23, 42);">这是 Prompt 中最重要的部分之一</font>**<font style="color:rgb(26, 26, 46);">，也是最容易被忽略的。没有验收标准的 Prompt，就像没有测试的代码——你不知道它对不对。</font>

```plain
验收标准：
- 输出需要补充的边界测试用例清单
- 所有测试必须通过 npm test
- 无 TypeScript 编译错误
- 列出可能的性能风险
```

<font style="color:rgb(51, 51, 51);">Verification 的价值不仅是检查结果，还能反过来约束模型的执行路线。模型知道最终要过什么检查，就更不容易写出“看起来完整但无法落地”的答案。</font>

### <font style="color:rgb(15, 23, 42);">2.7 六要素不是平均重要，最值钱的是 Context + Constraint + Verification</font>

<font style="color:rgb(26, 26, 46);">很多新人会把时间花在 Role 上，像“请你扮演资深全栈架构师，具有 20 年经验”。这块不是没用，但它通常排不到前三。</font>

<font style="color:rgb(26, 26, 46);">真正决定产出质量的，往往是这三块：</font>

+ **<font style="color:rgb(15, 23, 42);">Context</font>**<font style="color:rgb(26, 26, 46);">：告诉模型你面对的是遗留系统、单体仓库、严格 TypeScript、还是性能敏感链路</font>
+ **<font style="color:rgb(15, 23, 42);">Constraint</font>**<font style="color:rgb(26, 26, 46);">：明说哪些文件可改，哪些接口不能动，是否允许新依赖</font>
+ **<font style="color:rgb(15, 23, 42);">Verification</font>**<font style="color:rgb(26, 26, 46);">：要求它给出测试计划、边界条件、失败场景</font>

**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> 一个可直接复用的编程 Prompt 骨架</font>**

```plain
# Role
你是负责前端可维护性与 a11y 的 React 工程师。

# Context
项目使用 Next.js App Router + TypeScript strict mode。
当前问题：`CheckoutForm` 文件超过 400 行，校验逻辑散落在组件内部。

# Task
重构表单逻辑，提取可复用 Hook，保持现有提交流程不变。

# Constraints
- 不修改 `/api/checkout` 的请求结构
- 不引入新依赖
- 只允许修改 `src/features/checkout/*`

# Output
按以下顺序输出：
1. 修改计划
2. 受影响文件
3. 补丁或关键代码
4. 风险与回归点

# Verification
- 列出至少 5 个测试点
- 明确哪些边界条件仍需人工确认
```

### <font style="color:rgb(15, 23, 42);">2.8 第二个案例：同一个需求，Prompt 不同，返工成本会差很多</font>

<font style="color:rgb(26, 26, 46);">来看一个更具体的例子。需求是：把慢查询修掉，但业务行为不能变。</font>

**<font style="color:rgb(239, 68, 68);">❌</font>****<font style="color:rgb(239, 68, 68);"> 常见写法</font>**

```plain
帮我优化订单页查询性能，
代码有点慢。
```

**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> 工程写法</font>**

```plain
优化订单详情页接口 `/orders/:id`：
1. 目标：把订单详情接口 P95 从 800ms 降到 300ms 以内
2. 技术栈：Node.js + Prisma + PostgreSQL
3. 约束：不改返回 JSON 字段，不改权限逻辑
4. 输出：慢点定位、SQL/索引建议、补丁、回归测试点
5. 验收：说明优化前后瓶颈差异
```

<font style="color:rgb(26, 26, 46);">你会发现，后者已经不是一句“提示词”了，它更像半张工单。也正因为这样，它才配被版本管理、被团队复用、被评估优劣。</font>

## <font style="color:rgb(26, 26, 46);">三、</font><font style="color:rgb(51, 51, 51);">为什么 Prompt 会影响模型输出：从训练、对齐到上下文</font>

<font style="color:rgb(51, 51, 51);">前两章讲的是“应该怎么写”。但如果只停留在技巧层，读者会很容易继续追问：为什么这些结构真的有用？</font>

<font style="color:rgb(51, 51, 51);">要理解这一点，需要先看模型输出受哪些因素影响。</font>

<!-- 这是一张图片，ocr 内容为：从训练,对齐到上下文 对齐/ALIGNMENT 训练/PRETRAINING 0 模型 数据一知识 价值观一行为 大语言模型 上下文 输出边界 规则一限制 信息一理解 模型输出 上下文质量 PROMPT 解决不了一切 长度 不是凭空产生的 核心关键词:训练/对齐/上下文/质量优先/ 有边界 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369232830-97d96d19-6c61-4f66-ac8f-788afcb04149.png)

### <font style="color:rgb(51, 51, 51);">3.1 模型输出不是凭空产生的</font>

<font style="color:rgb(51, 51, 51);">可以粗略理解为：</font>

<font style="color:rgb(51, 51, 51);">模型输出 = 模型能力 × 上下文质量 × 任务约束 × 验证机制</font>

<font style="color:rgb(51, 51, 51);">其中：</font>

1. **<font style="color:rgb(51, 51, 51);">预训练</font>**<font style="color:rgb(51, 51, 51);">带来通用知识</font><font style="color:rgb(51, 51, 51);">模型从大量文本和代码中学到语言模式、代码结构、常见 API、工程惯例。</font>
2. **<font style="color:rgb(51, 51, 51);">对齐训练</font>**<font style="color:rgb(51, 51, 51);">带来行为偏好</font><font style="color:rgb(51, 51, 51);">模型会倾向于给出有帮助、安全、符合指令的回答，但这不等于它知道你的业务事实。</font>
3. **<font style="color:rgb(51, 51, 51);">当前上下文</font>**<font style="color:rgb(51, 51, 51);">带来临时任务信息</font><font style="color:rgb(51, 51, 51);">你提供的需求、代码、日志、测试结果、约束，会成为模型当前生成的主要依据。</font>

<font style="color:rgb(51, 51, 51);">所以，Prompt 工程的核心不是“控制模型思想”，而是把当前任务所需的信息、边界和验收标准组织进上下文窗口。</font>

### <font style="color:rgb(51, 51, 51);">3.2 模型为什么会“猜”？</font>

<font style="color:rgb(51, 51, 51);">当 Prompt 缺少信息时，模型不会停在那里等你补充。它往往会基于常见模式生成一个“看起来合理”的答案。</font>

<font style="color:rgb(51, 51, 51);">在普通写作任务里，这种能力是优点；在工程任务里，它可能变成风险。</font>

<font style="color:rgb(51, 51, 51);">例如你让模型：</font>

<font style="color:rgb(51, 51, 51);">帮我优化订单查询。</font>

<font style="color:rgb(51, 51, 51);">如果没有上下文，模型可能默认：</font>

+ <font style="color:rgb(51, 51, 51);">数据库是 PostgreSQL；</font>
+ <font style="color:rgb(51, 51, 51);">ORM 是 Prisma；</font>
+ <font style="color:rgb(51, 51, 51);">可以加索引；</font>
+ <font style="color:rgb(51, 51, 51);">可以改返回字段；</font>
+ <font style="color:rgb(51, 51, 51);">可以改变查询结构；</font>
+ <font style="color:rgb(51, 51, 51);">可以引入缓存。</font>

<font style="color:rgb(51, 51, 51);">但你的真实系统可能是 MySQL + SQLAlchemy，返回字段有前端强依赖，权限过滤不能动，缓存还会引入一致性问题。</font>

<font style="color:rgb(51, 51, 51);">这就是为什么工程 Prompt 必须写清楚“事实、约束、假设和禁区”。</font>

### <font style="color:rgb(51, 51, 51);">3.3 上下文质量比上下文长度更重要</font>

<font style="color:rgb(51, 51, 51);">很多人以为把所有文件都塞给模型就能提高质量。实际上，上下文也会污染模型。</font>

<font style="color:rgb(51, 51, 51);">高质量上下文有五个标准：</font>

| **<font style="color:rgb(51, 51, 51);">标准</font>** | **<font style="color:rgb(51, 51, 51);">说明</font>**         |
| :--------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">相关</font>     | <font style="color:rgb(51, 51, 51);">只给与任务相关的信息</font> |
| <font style="color:rgb(51, 51, 51);">完整</font>     | <font style="color:rgb(51, 51, 51);">关键业务规则不能缺</font> |
| <font style="color:rgb(51, 51, 51);">新鲜</font>     | <font style="color:rgb(51, 51, 51);">不给过期接口、旧规范、废弃代码</font> |
| <font style="color:rgb(51, 51, 51);">可信</font>     | <font style="color:rgb(51, 51, 51);">区分事实、假设、推测</font> |
| <font style="color:rgb(51, 51, 51);">可引用</font>   | <font style="color:rgb(51, 51, 51);">能指出来源文件、日志、测试结果或负责人</font> |


<font style="color:rgb(51, 51, 51);">上下文缺失会让模型乱猜；上下文过载会让模型抓不住重点；上下文过期会让模型朝错误方向优化。</font>

### <font style="color:rgb(51, 51, 51);">3.4 Prompt 解决不了什么？</font>

<font style="color:rgb(51, 51, 51);">Prompt 工程能提升输出可控性，但不能让模型变成万能执行器。</font>

<font style="color:rgb(51, 51, 51);">Prompt 不能替代：</font>

+ <font style="color:rgb(51, 51, 51);">真实测试；</font>
+ <font style="color:rgb(51, 51, 51);">代码审查；</font>
+ <font style="color:rgb(51, 51, 51);">业务验收；</font>
+ <font style="color:rgb(51, 51, 51);">权限隔离；</font>
+ <font style="color:rgb(51, 51, 51);">数据治理；</font>
+ <font style="color:rgb(51, 51, 51);">生产监控；</font>
+ <font style="color:rgb(51, 51, 51);">模型评估；</font>
+ <font style="color:rgb(51, 51, 51);">对外部事实的实时查询；</font>
+ <font style="color:rgb(51, 51, 51);">对线上环境的真实运行验证。</font>

<font style="color:rgb(51, 51, 51);">因此，专业的 Prompt 工程不是“让模型一次答对”，而是建立一套能发现错误、限制错误、修复错误的工作流。</font>

## <font style="color:rgb(15, 23, 42);">四、高级提示策略：什么时候用什么招</font>

<font style="color:rgb(51, 51, 51);">前面解决的是结构和机制问题。接下来解决策略问题：不同任务应该采用哪种提示方式。</font>

<font style="color:rgb(26, 26, 46);">结构要素是"骨架"，提示策略是"招式"。不同的任务需要不同的策略——就像打篮球，快攻和阵地战是两套完全不同的打法。</font>

<font style="color:rgb(26, 26, 46);">很多 Prompt 技巧都能提升效果，但它们不是默认全开。用多了，成本更高，链路更长，还可能把简单问题硬生生做复杂。</font>

<!-- 这是一张图片，ocr 内容为：合合 什么时候用什么招 怎么问更有效? 5 分解 COT ZERO-SHOT PLAN-FIRST FEW-SHOT 一十十十 自自目 1923 一网网网 自8 直接问 给例子再问 先规划再执行 拆解子任务 一步步推理 问题代码 修复代码 一四十八 FOR I IN RANGE(N): FOR I IN RANGE(N-1): SUM +三 ARR[I+1] ARR SUM+三 分析问题定位原因 修复思路 结构是骨架,策略是招式 -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1777369443655-9fca7986-2092-4613-93a3-bcd2ea48f416.png)

### <font style="color:rgb(15, 23, 42);">4.1 Zero-shot vs Few-shot</font>

**<font style="color:rgb(15, 23, 42);">Zero-shot</font>**<font style="color:rgb(26, 26, 46);">：不给示例，直接让模型干活。适合简单直接的任务。</font>

```plain
// Zero-shot：简单任务直接上
把这个函数改为异步版本
```

**<font style="color:rgb(15, 23, 42);">Few-shot</font>**<font style="color:rgb(26, 26, 46);">：给 2-3 个示例，让模型"照猫画虎"。适合企业内部特定的工具类调用。</font>

```plain
// Few-shot：给示例校准输出风格
示例1：
输入：获取用户信息
输出：await apiClient.get('/users/{id}')

示例2：
输入：创建订单
输出：await apiClient.post('/orders', payload)

现在请按同样风格，为"更新商品"生成 API 调用
```

:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 什么时候用 Few-shot？</font>**

<font style="color:rgb(26, 26, 46);">当你的项目有</font>**<font style="color:rgb(15, 23, 42);">内部约定</font>**<font style="color:rgb(26, 26, 46);">（比如特定的 API 调用风格、特定的错误处理方式）时，必须给 Few-shot。因为模型不知道你们公司的内部约定，示例是最直接的"校准"方式。</font>

<font style="color:rgb(26, 26, 46);">代价：占用更多 Token。所以简单任务用 Zero-shot，复杂或特定风格的任务用 Few-shot。</font>

:::

### 4.2 <font style="color:rgb(51, 51, 51);">Plan-first：先计划，再执行</font>

<font style="color:rgb(51, 51, 51);">复杂任务不要一上来就让模型改代码，而是先让它交计划。</font>

```plain
先不要写代码。
请先输出：
1. 你理解的目标
2. 需要修改的文件
3. 每个文件的修改理由
4. 风险点
5. 测试计划

等我确认后，再开始执行。
```

<font style="color:rgb(51, 51, 51);">这类策略的价值不是“让模型多想”，而是把理解偏差暴露在最便宜的阶段。</font>

### <font style="color:rgb(15, 23, 42);">4.3 思维链（Chain of Thought, CoT）</font>

<font style="color:rgb(26, 26, 46);">思维链的核心思想：</font>**<font style="color:rgb(15, 23, 42);">强制 AI 在输出代码之前，先输出思考过程</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">类比一下：你让一个初级工程师改 Bug，他是直接上手改还是先分析原因？当然是先分析。CoT 就是让 AI "先想再做"。</font>

```plain
请使用 <thinking> 标签输出你的分析过程：

1. 先分析这段代码的问题
2. 列出可能的修复方案
3. 选择最优方案并说明理由
4. 然后再输出修复代码
```

<font style="color:rgb(26, 26, 46);">CoT 特别适合这些场景：</font>

+ <font style="color:rgb(26, 26, 46);">🏗️</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">复杂重构</font>**<font style="color:rgb(26, 26, 46);">：需要理解多个模块的依赖关系</font>
+ <font style="color:rgb(26, 26, 46);">🐛</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">Bug 分析</font>**<font style="color:rgb(26, 26, 46);">：需要排查多个可能的原因</font>
+ <font style="color:rgb(26, 26, 46);">📐</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">架构设计</font>**<font style="color:rgb(26, 26, 46);">：需要权衡多个方案的利弊</font>

<font style="color:rgb(51, 51, 51);">在工程实践中，不建议把 CoT 简单理解为“强制模型输出完整思考过程”。更稳妥的做法是要求模型先输出可审查的分析摘要、修改计划、关键假设、风险清单和验证方案。</font>

<font style="color:rgb(51, 51, 51);">我们真正需要的不是模型的内部思维细节，而是可以被人类复核的中间产物。</font>

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> CoT 的注意事项</font>**

<font style="color:rgb(26, 26, 46);">2026 年的推理模型（gpt、Claude 4.6）已经内置了 CoT 能力，不需要你手动要求"一步一步想"。但如果你用的是非推理模型（Sonnet、GPT-4o），手动要求 CoT 仍然有效。</font>

:::

<font style="color:rgb(26, 26, 46);">这类 Prompt 的价值，不是显得严谨，而是把“理解任务”和“执行变更”拆开。你先看计划，再授权执行，风险一下就降下来了。</font>

### <font style="color:rgb(15, 23, 42);">4.4 分解策略（Decomposition）</font>

<font style="color:rgb(26, 26, 46);">把一个大任务拆成多个小任务，逐个完成。</font>

```plain
不要一次让我写完整个功能，按以下步骤来：

步骤1：设计数据库表结构，等我确认
步骤2：写 API 接口，等我确认
步骤3：写前端组件，等我确认
步骤4：写集成测试

每完成一步，等我确认后再进入下一步。
```

<font style="color:rgb(26, 26, 46);">分解策略的好处是</font>**<font style="color:rgb(15, 23, 42);">可控性高</font>**<font style="color:rgb(26, 26, 46);">——每一步都可以验证，发现偏差及时纠正。代价是需要更多轮交互，但总比一次性输出 500 行错误代码再返工强。</font>

### <font style="color:rgb(15, 23, 42);">4.5 结构化输出约束</font>

<font style="color:rgb(26, 26, 46);">如果你做的是自动化链路、CI 审查、批量改写、知识抽取，</font>**<font style="color:rgb(15, 23, 42);">让模型输出散文</font>**<font style="color:rgb(26, 26, 46);">本身就是设计错误。你真正需要的是程序能消费的结果。</font>

<font style="color:rgb(26, 26, 46);">这时候 XML、JSON Schema、固定字段列表就很关键。Anthropic 建议用 XML 标签隔离上下文、说明、样例；OpenAI 则在 Structured Outputs 里把 JSON Schema 约束做成了第一等能力。</font>

<font style="color:rgb(26, 26, 46);">强制模型以特定格式输出，便于程序解析。</font>

```plain
请以以下 JSON 格式输出：
{
  "files": [
    {
      "path": "修改的文件路径",
      "changes": ["修改点1", "修改点2"]
    }
  ],
  "risks": ["风险1", "风险2"],
  "tests_needed": ["测试1", "测试2"]
}
```

<font style="color:rgb(26, 26, 46);">如果你的模型支持这个功能，</font>**<font style="color:rgb(15, 23, 42);">一定要用</font>**<font style="color:rgb(26, 26, 46);">——它比"请输出 JSON 格式"这种自然语言约束可靠 100 倍。</font>

| **<font style="color:rgb(15, 23, 42);">策略</font>**         | **<font style="color:rgb(15, 23, 42);">适合场景</font>**     | **<font style="color:rgb(15, 23, 42);">核心收益</font>**     | **<font style="color:rgb(15, 23, 42);">副作用</font>**       |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(26, 26, 46);">Zero-shot</font>        | <font style="color:rgb(26, 26, 46);">简单改写、标准生成</font> | <font style="color:rgb(26, 26, 46);">快、便宜、交互短</font> | <font style="color:rgb(26, 26, 46);">风格不稳</font>         |
| <font style="color:rgb(26, 26, 46);">Few-shot</font>         | <font style="color:rgb(26, 26, 46);">团队私有规范、内部 DSL</font> | <font style="color:rgb(26, 26, 46);">快速校准风格</font>     | <font style="color:rgb(26, 26, 46);">更耗 Token</font>       |
| <font style="color:rgb(26, 26, 46);">Plan/Decomposition</font> | <font style="color:rgb(26, 26, 46);">跨文件改造、复杂调试</font> | <font style="color:rgb(26, 26, 46);">降低误改概率</font>     | <font style="color:rgb(26, 26, 46);">轮次变多</font>         |
| <font style="color:rgb(26, 26, 46);">XML / JSON Schema</font> | <font style="color:rgb(26, 26, 46);">自动化流程、工具链解析</font> | <font style="color:rgb(26, 26, 46);">输出可验证、可解析</font> | <font style="color:rgb(26, 26, 46);">模板设计成本更高</font> |


### <font style="color:rgb(15, 23, 42);">4.6 一个“问题代码 → 修复代码”式的 Prompt 叙事</font>

<font style="color:rgb(26, 26, 46);">下面这个例子特别适合团队知识库和自动代码审查。</font>

<font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 你如果这么写：</font>

```plain
帮我审一下这个 PR，有问题就说。
```

<font style="color:rgb(26, 26, 46);">模型很可能给你一段温柔但空泛的点评，像“代码整体清晰，建议关注边界情况”。这类输出很礼貌，也几乎没法进流水线。</font>

<font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 更靠谱的做法是：</font>

```plain
<task>
审查这个 PR，重点关注安全、性能、边界条件。
</task>

<output_schema>
{
  "findings": [
    {
      "severity": "high|medium|low",
      "category": "security|performance|correctness|maintainability",
      "file": "string",
      "summary": "string",
      "suggestion": "string"
    }
  ]
}
</output_schema>

只输出符合 schema 的 JSON。
```

<font style="color:rgb(26, 26, 46);">这段 Prompt 做了三件关键事：</font>

1. <font style="color:rgb(26, 26, 46);">把注意力集中到你真在意的风险类型</font>
2. <font style="color:rgb(26, 26, 46);">把输出限制成结构化对象，程序能直接消费</font>
3. <font style="color:rgb(26, 26, 46);">把“说得漂亮”变成“字段填得对”</font>

<font style="color:rgb(26, 26, 46);">如果说前两节还是在搭骨架，这里你已经能感觉到了：高级 Prompt 技术的终点，不是更像人聊天，而是更像系统设计。</font>

## <font style="color:rgb(15, 23, 42);">五、Prompt Chaining：从单次调用到链式工作流</font>

<font style="color:rgb(26, 26, 46);">单个 Prompt 再好，也只能解决一个点的问题。真正的生产力爆发，来自</font>**<font style="color:rgb(15, 23, 42);">把多个 Prompt 串联成工作流</font>**<font style="color:rgb(26, 26, 46);">——这就是 Prompt Chaining。</font>

<font style="color:rgb(26, 26, 46);">类比一下：单个 Prompt 就像一个工人只干一道工序；Prompt Chain 是一条流水线，每道工序的输出是下一道的输入。</font>

<font style="color:rgb(26, 26, 46);">很多人会把</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">Chain of Thought</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">和</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">Prompt Chaining</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">混在一起。它们不是一回事。</font>

+ **<font style="color:rgb(15, 23, 42);">Chain of Thought</font>**<font style="color:rgb(26, 26, 46);">：一次请求里，让模型把一个复杂步骤想清楚</font>
+ **<font style="color:rgb(15, 23, 42);">Prompt Chaining</font>**<font style="color:rgb(26, 26, 46);">：多次请求之间，把复杂任务拆成多个有明确输入输出的小阶段</font>

<font style="color:rgb(26, 26, 46);">说人话就是：CoT 更像“同一个人坐下来多想一会儿”；Prompt Chaining 更像“把流水线拆成多个工位，每个工位只干一件事”。CoT 关注单次推理质量；Prompt Chaining 关注多阶段任务的交接质量。</font>

:::info
<font style="color:rgb(26, 26, 46);">Anthropic 在官方文档《Chain complex prompts for stronger performance》里给的核心判断很直接：当任务包含多个彼此独立、都需要认真处理的步骤时，应该拆成 prompt chain，让每个子任务单独拿到模型的完整注意力。</font>

:::

<!-- 这是一张图片，ocr 内容为：从单次调用到链式工作流 一国个区 单次调用一>链式工作流 0个圆个团 线性链 路由链 一一回 中个中个中个中 园一旦 (OOOO 圆一回 需求分析-架构设计一编码执行一>审查测试 四国 品 审查链 并行链 REVIEW IOOP 一日一日 园一画一旦一画 牛肉有限公司 任务目标 交接格式 (关键!) 输入上下文 输出要点与下一步建议 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369548820-4dca8d54-3b0d-4243-b5c5-3568b86d79f4.png)

### <font style="color:rgb(15, 23, 42);">5.1 四种链式模式</font>

| **<font style="color:rgb(15, 23, 42);">模式</font>**   | **<font style="color:rgb(15, 23, 42);">结构</font>**         | **<font style="color:rgb(15, 23, 42);">适用场景</font>**     | **<font style="color:rgb(15, 23, 42);">典型示例</font>**     |
| :----------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **<font style="color:rgb(15, 23, 42);">线性链</font>** | <font style="color:rgb(26, 26, 46);">A → B → C → D</font>    | <font style="color:rgb(26, 26, 46);">有明确先后顺序的任务</font> | <font style="color:rgb(26, 26, 46);">需求分析 → 架构设计 → 编码 → 测试</font> |
| **<font style="color:rgb(15, 23, 42);">扇出链</font>** | <font style="color:rgb(26, 26, 46);">A → [B, C, D] → E</font> | <font style="color:rgb(26, 26, 46);">并行处理多个子任务</font> | <font style="color:rgb(26, 26, 46);">需求拆解 → [前端/后端/测试] → 集成</font> |
| **<font style="color:rgb(15, 23, 42);">反馈链</font>** | <font style="color:rgb(26, 26, 46);">A → B → 审查 → (修正)B</font> | <font style="color:rgb(26, 26, 46);">需要质量把关的迭代</font> | <font style="color:rgb(26, 26, 46);">生成代码 → 审查 → 修复 → 再审查</font> |
| **<font style="color:rgb(15, 23, 42);">路由链</font>** | <font style="color:rgb(26, 26, 46);">A → 分类 → [B1 / B2 / B3]</font>                                                   |


### <font style="color:rgb(51, 51, 51);">5.2 链式工作流的关键不是“拆”，而是“交接格式”</font>

<font style="color:rgb(51, 51, 51);">很多链式 Prompt 失败，不是因为没有拆，而是每一步输出都是散文，下一步又要重新猜上一阶段的含义。</font>

<font style="color:rgb(51, 51, 51);">一个稳定的 Coding Prompt Chain 应该像这样：</font>

```plain
Step 1 - Spec Extractor
输入：PRD + 约束
输出：JSON { goals, non_goals, contracts, risks }

Step 2 - Planner
输入：Spec JSON + 目录树
输出：JSON { steps, files, assumptions, test_plan }

Step 3 - Implementer
输入：Plan JSON + 目标文件
输出：补丁 + 变更说明

Step 4 - Tester
输入：补丁 + 契约
输出：测试用例 + 回归点

Step 5 - Reviewer
输入：diff + test_plan
输出：findings + blockers + confidence
```

<font style="color:rgb(51, 51, 51);">每一步都要有明确输入、明确输出和验证点。否则，错误会沿链条放大。</font>

### <font style="color:rgb(15, 23, 42);">5.3 线性链示例：从需求到代码</font>

```plain
# Step 1: 需求分析
角色：技术项目经理
任务：将以下 PRD 拆解为开发任务
输出：页面清单 + 接口清单 + 数据表设计

# Step 2: 架构设计（基于 Step 1 的输出）
角色：资深架构师
任务：为上述任务清单设计技术方案
输出：方案对比矩阵 + 推荐方案 + 风险评估

# Step 3: 编码执行（基于 Step 2 的方案）
角色：高级开发
任务：按方案实现 Step 1 中的第一个模块
约束：只修改方案中指定的文件

# Step 4: 审查测试（基于 Step 3 的代码）
角色：安全审计 + QA
任务：审查代码并生成测试用例
输出：Finding 列表 + 测试用例 + 修复建议
```

### <font style="color:rgb(15, 23, 42);">5.4 路由链示例：智能 Issue 处理</font>

```plain
# Router: 分类 Issue
分析这个 GitHub Issue，判断类型并输出 JSON：
{
  "type": "bug" | "feature" | "docs" | "question",
  "priority": "P0" | "P1" | "P2",
  "confidence": 0.0-1.0
}

# Branch A (bug): Bug 修复流程
1. 复现步骤分析
2. 根因定位
3. 修复方案 + 测试

# Branch B (feature): 功能开发流程
1. 需求拆解
2. 技术方案
3. 分步实现

# Branch C (docs): 文档更新流程
1. 确认影响范围
2. 更新相关文档
3. 交叉引用检查
```

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> Chaining 的关键原则</font>**

+ **<font style="color:rgb(15, 23, 42);">每一步的输出必须是结构化的</font>**<font style="color:rgb(26, 26, 46);">——否则下一步无法可靠解析</font>
+ **<font style="color:rgb(15, 23, 42);">每一步都要有验证</font>**<font style="color:rgb(26, 26, 46);">——错误会沿链条放大（Garbage In, Garbage Out）</font>
+ **<font style="color:rgb(15, 23, 42);">不要链太长</font>**<font style="color:rgb(26, 26, 46);">——3-5 步为宜，超过 5 步考虑用 Agent 替代</font>
+ **<font style="color:rgb(15, 23, 42);">记录中间结果</font>**<font style="color:rgb(26, 26, 46);">——方便回溯和调试</font>

:::

### 5.5 <font style="color:rgb(26, 26, 46);">Prompt Chaining 什么时候最值？</font>

1. <font style="color:rgb(26, 26, 46);">任务里有多个不同类型的转换：读 PRD、抽契约、出计划、写代码、补测试</font>
2. <font style="color:rgb(26, 26, 46);">你希望某一步失败时能精确定位是哪个环节掉链子</font>
3. <font style="color:rgb(26, 26, 46);">你要把结果喂给工具、下游程序或人工审批</font>
4. <font style="color:rgb(26, 26, 46);">每一步所需上下文不一样，不适合全塞在一条 Prompt 里</font>

<font style="color:rgb(26, 26, 46);">🤔</font><font style="color:rgb(26, 26, 46);"> 你可能会问：那我是不是所有任务都该链式拆开？</font>

<font style="color:rgb(26, 26, 46);">不是。简单改名、补注释、改一处同步转异步，这种任务链起来反而浪费延迟和 token。Prompt Chaining 最适合的是</font>**<font style="color:rgb(15, 23, 42);">多阶段、多产物、多风险点</font>**<font style="color:rgb(26, 26, 46);">的任务，不是所有任务。</font>

| **<font style="color:rgb(15, 23, 42);">阶段</font>** | **<font style="color:rgb(15, 23, 42);">输入</font>**         | **<font style="color:rgb(15, 23, 42);">输出</font>**         | **<font style="color:rgb(15, 23, 42);">这一阶段最重要的问题</font>** |
| :--------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(26, 26, 46);">需求抽取</font> | <font style="color:rgb(26, 26, 46);">PRD、需求描述、业务边界</font> | <font style="color:rgb(26, 26, 46);">结构化约束 JSON</font>  | <font style="color:rgb(26, 26, 46);">到底要做什么，不能做什么？</font> |
| <font style="color:rgb(26, 26, 46);">计划生成</font> | <font style="color:rgb(26, 26, 46);">约束 JSON、目录树、相关模块</font> | <font style="color:rgb(26, 26, 46);">步骤计划、文件清单、风险</font> | <font style="color:rgb(26, 26, 46);">先动哪里，后动哪里？</font> |
| <font style="color:rgb(26, 26, 46);">执行补丁</font> | <font style="color:rgb(26, 26, 46);">计划、文件清单、已有代码</font> | <font style="color:rgb(26, 26, 46);">代码修改</font>         | <font style="color:rgb(26, 26, 46);">如何按边界落地？</font> |
| <font style="color:rgb(26, 26, 46);">测试生成</font> | <font style="color:rgb(26, 26, 46);">补丁、契约、边界条件</font> | <font style="color:rgb(26, 26, 46);">测试用例、回归清单</font> | <font style="color:rgb(26, 26, 46);">改完怎么证明没炸？</font> |
| <font style="color:rgb(26, 26, 46);">审查复核</font> | <font style="color:rgb(26, 26, 46);">diff、测试结果、风险说明</font> | <font style="color:rgb(26, 26, 46);">findings、阻断项、放行建议</font> | <font style="color:rgb(26, 26, 46);">还有什么没被发现？</font> |


## <font style="color:rgb(51, 51, 51);">六、从 Prompt Engineering 到 Context Engineering</font>

<font style="color:rgb(51, 51, 51);">到了这里，Prompt 已经不只是“怎么问模型”。更关键的问题变成：应该把什么信息交给模型？信息从哪里来？怎么保证它相关、最新、可信？</font>

<font style="color:rgb(51, 51, 51);">这就是 Context Engineering。</font>

<!-- 这是一张图片，ocr 内容为：关键不只是怎么问,而是提供什么信息, 如何组织 上下文模板 PROMPT VS CONTEXT 好上下文怎么组织 上下文污染与过载 污染 CONTEXT PROMPT 当前任务 自己国 主 已确认事实 具目目 业务规则 X组织 过载 V组织 信冒 血尚 信目 V可信 X可信 禁区 最新 X最新 组织 90000 V相关 X相关 信新关区 可最相禁 验证 X禁区 禁区 目目百 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369603694-a92902d0-652c-4724-b5a3-0631c82b031d.png)

### <font style="color:rgb(51, 51, 51);">6.1 Prompt 和 Context 的区别</font>

| **<font style="color:rgb(51, 51, 51);">概念</font>**         | **<font style="color:rgb(51, 51, 51);">解决的问题</font>**   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">Prompt Engineering</font> | <font style="color:rgb(51, 51, 51);">怎么把任务说清楚</font> |
| <font style="color:rgb(51, 51, 51);">Context Engineering</font> | <font style="color:rgb(51, 51, 51);">给模型什么信息</font>   |
| <font style="color:rgb(51, 51, 51);">RAG</font>              | <font style="color:rgb(51, 51, 51);">从外部知识库检索相关上下文</font> |
| <font style="color:rgb(51, 51, 51);">Tool Calling</font>     | <font style="color:rgb(51, 51, 51);">让模型调用工具获取事实、执行检查</font> |
| <font style="color:rgb(51, 51, 51);">Eval</font>             | <font style="color:rgb(51, 51, 51);">证明模型输出是否可靠</font> |
| <font style="color:rgb(51, 51, 51);">Agent Workflow</font>   | <font style="color:rgb(51, 51, 51);">让模型在多步任务里计划、行动、观察、修正</font> |


<font style="color:rgb(51, 51, 51);">Prompt 是任务接口，Context 是任务材料。接口写得再好，材料错了，结果也会错。</font>

### <font style="color:rgb(51, 51, 51);">6.2 好上下文应该怎么组织？</font>

<font style="color:rgb(51, 51, 51);">建议把上下文分成四层：</font>

```plain
1. 任务目标
   本次要解决什么，不解决什么。

2. 当前事实
   相关代码、接口契约、日志、错误信息、测试结果。

3. 业务规则
   权限、金额、订单、数据一致性、兼容性要求。

4. 操作边界
   能改什么，不能改什么，哪些需要人工确认。
```

<font style="color:rgb(51, 51, 51);">不要把所有文件一股脑塞进去。更好的做法是先让模型或工具帮你筛选影响范围，再把相关文件提供给执行阶段。</font>

### <font style="color:rgb(51, 51, 51);">6.3 上下文污染与过载</font>

<font style="color:rgb(51, 51, 51);">上下文越多不一定越好。常见问题包括：</font>

| **<font style="color:rgb(51, 51, 51);">问题</font>**   | **<font style="color:rgb(51, 51, 51);">表现</font>**       | **<font style="color:rgb(51, 51, 51);">修复</font>**         |
| :----------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">无关上下文</font> | <font style="color:rgb(51, 51, 51);">模型抓不住重点</font> | <font style="color:rgb(51, 51, 51);">删除与任务无关的信息</font> |
| <font style="color:rgb(51, 51, 51);">过期上下文</font> | <font style="color:rgb(51, 51, 51);">按旧接口写代码</font> | <font style="color:rgb(51, 51, 51);">标注最新规范和废弃内容</font> |
| <font style="color:rgb(51, 51, 51);">冲突上下文</font> | <font style="color:rgb(51, 51, 51);">输出摇摆不定</font>   | <font style="color:rgb(51, 51, 51);">明确优先级</font>       |
| <font style="color:rgb(51, 51, 51);">缺少来源</font>   | <font style="color:rgb(51, 51, 51);">难以人工复核</font>   | <font style="color:rgb(51, 51, 51);">加文件名、日志来源、测试编号</font> |
| <font style="color:rgb(51, 51, 51);">过长上下文</font> | <font style="color:rgb(51, 51, 51);">重点被淹没</font>     | <font style="color:rgb(51, 51, 51);">摘要、分层、分阶段输入</font> |


<font style="color:rgb(51, 51, 51);">Context Engineering 的目标不是“塞更多”，而是“给对、给准、给可验证”。</font>

### <font style="color:rgb(51, 51, 51);">6.4 一个上下文模板</font>

```plain
# 当前任务
修复订单优惠券叠加错误。

# 已确认事实
- 问题发生在会员折扣 + 新人券同时存在时
- 线上日志显示 discount_total 被重复扣减
- 相关文件：pricing.ts, coupon.ts, checkout.ts

# 业务规则
- 会员折扣和新人券可以同时存在
- 但新人券只能作用于原价，不得作用于会员折扣后的价格
- 返回 JSON 字段不能变

# 禁区
- 不修改支付网关参数
- 不修改订单表 schema
- 不改前端展示字段

# 验证
- 补充 3 个金额计算测试
- 金额精度必须以分为单位计算
```

## <font style="color:rgb(51, 51, 51);">七、Agent、工具调用与安全边界</font>

<font style="color:rgb(51, 51, 51);">Prompt Chain 仍然偏“显式流程”：你知道每一步是什么。Agent 则更进一步：模型可以根据目标选择工具、观察结果、调整下一步行动。</font>

<font style="color:rgb(51, 51, 51);">这听起来更强，但风险也更大。</font>

<!-- 这是一张图片，ocr 内容为：AGENT CHAIN 工具调用 VS AGENT CHAIN VS 一是一周一白 选择工具 调用工具 观察结果 自主选择,动态决策 按顺序执行,固定流程 决定下一步 显式授权 安全边界 工具调用 有一目 在边界内行动 高风险操作 传统提示词 显式授权 工具调用提示词 安全第一 高风险操作需显式授权 定义边界,坚守底线 工具调用改变提示词写法 四个 2 会影响谁? 有哪些风险? 目标是什么? 可以回退吗? 问题 -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1777369634404-ca673b94-3bed-4734-928a-00ebd5ef077f.png)

### <font style="color:rgb(51, 51, 51);">7.1 Prompt Chain 和 Agent 的区别</font>

| **<font style="color:rgb(51, 51, 51);">维度</font>** | **<font style="color:rgb(51, 51, 51);">Prompt Chain</font>** | **<font style="color:rgb(51, 51, 51);">Agent Workflow</font>** |
| :--------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">流程</font>     | <font style="color:rgb(51, 51, 51);">人类预先设计</font>     | <font style="color:rgb(51, 51, 51);">模型可动态选择步骤</font> |
| <font style="color:rgb(51, 51, 51);">控制感</font>   | <font style="color:rgb(51, 51, 51);">强</font>               | <font style="color:rgb(51, 51, 51);">相对弱</font>           |
| <font style="color:rgb(51, 51, 51);">适合任务</font> | <font style="color:rgb(51, 51, 51);">固定流程、多阶段产物</font> | <font style="color:rgb(51, 51, 51);">探索性、工具密集型任务</font> |
| <font style="color:rgb(51, 51, 51);">风险</font>     | <font style="color:rgb(51, 51, 51);">错误沿链路放大</font>   | <font style="color:rgb(51, 51, 51);">错误可能变成错误行动</font> |
| <font style="color:rgb(51, 51, 51);">关键控制</font> | <font style="color:rgb(51, 51, 51);">结构化交接</font>       | <font style="color:rgb(51, 51, 51);">权限、沙箱、人工确认</font> |


<font style="color:rgb(51, 51, 51);">如果任务流程固定，优先用 Prompt Chain。如果任务需要大量检索、尝试、运行工具和动态决策，再考虑 Agent。</font>

### <font style="color:rgb(51, 51, 51);">7.2 工具调用如何改变 Prompt 写法</font>

<font style="color:rgb(51, 51, 51);">当模型能读文件、跑测试、查数据库、调用 API 时，Prompt 不能只写“请分析”，还要写清：</font>

+ <font style="color:rgb(51, 51, 51);">允许使用哪些工具；</font>
+ <font style="color:rgb(51, 51, 51);">工具调用的顺序；</font>
+ <font style="color:rgb(51, 51, 51);">哪些操作必须先确认；</font>
+ <font style="color:rgb(51, 51, 51);">失败时如何停止；</font>
+ <font style="color:rgb(51, 51, 51);">结果如何回传；</font>
+ <font style="color:rgb(51, 51, 51);">哪些输出必须引用工具结果。</font>

<font style="color:rgb(51, 51, 51);">例如：</font>

```plain
你可以读取项目文件和运行测试，但必须遵守：
1. 修改代码前先输出计划
2. 不允许删除文件
3. 不允许修改数据库 migration
4. 每次运行测试后总结失败原因
5. 如果需要执行破坏性命令，必须先请求人工确认
```

### <font style="color:rgb(51, 51, 51);">7.3 高风险操作必须显式授权</font>

<font style="color:rgb(51, 51, 51);">在 AI 编程中，下列操作不应该默认开放：</font>

| **<font style="color:rgb(51, 51, 51);">高风险动作</font>**   | **<font style="color:rgb(51, 51, 51);">风险</font>**         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">删除文件</font>         | <font style="color:rgb(51, 51, 51);">数据丢失、误删配置</font> |
| <font style="color:rgb(51, 51, 51);">修改数据库 schema</font> | <font style="color:rgb(51, 51, 51);">线上迁移风险</font>     |
| <font style="color:rgb(51, 51, 51);">修改鉴权逻辑</font>     | <font style="color:rgb(51, 51, 51);">安全漏洞</font>         |
| <font style="color:rgb(51, 51, 51);">修改支付、订单、金额计算</font> | <font style="color:rgb(51, 51, 51);">资金风险</font>         |
| <font style="color:rgb(51, 51, 51);">修改 CI/CD 或部署脚本</font> | <font style="color:rgb(51, 51, 51);">发布事故</font>         |
| <font style="color:rgb(51, 51, 51);">引入新依赖</font>       | <font style="color:rgb(51, 51, 51);">供应链风险、体积膨胀</font> |
| <font style="color:rgb(51, 51, 51);">执行生产命令</font>     | <font style="color:rgb(51, 51, 51);">真实环境破坏</font>     |
| <font style="color:rgb(51, 51, 51);">读取密钥和用户隐私数据</font> | <font style="color:rgb(51, 51, 51);">合规风险</font>         |


<font style="color:rgb(51, 51, 51);">成熟的 Agent 工作流一定要有权限分级、沙箱、审计日志和人工确认节点。</font>

### <font style="color:rgb(51, 51, 51);">7.4 “让 AI 自动做”之前，先问四个问题</font>

1. <font style="color:rgb(51, 51, 51);">错了会不会造成不可逆损失？</font>
2. <font style="color:rgb(51, 51, 51);">有没有测试能及时发现错误？</font>
3. <font style="color:rgb(51, 51, 51);">模型是否有足够上下文判断风险？</font>
4. <font style="color:rgb(51, 51, 51);">人类是否保留最终确认权？</font>

<font style="color:rgb(51, 51, 51);">如果答案不清楚，就不要把执行权全部交给模型。</font>

## <font style="color:rgb(15, 23, 42);">八、面向开发生命周期的 Prompt 套件</font>

<font style="color:rgb(26, 26, 46);">一支成熟团队，不会每次都从零写 Prompt。你不可能每开发一个功能、每修一个 Bug、每审一个 PR，都重新发明任务描述方式。</font>

<font style="color:rgb(26, 26, 46);">更准确地说，团队真正需要的不是“几句写得很妙的话”，而是一套覆盖</font>**<font style="color:rgb(15, 23, 42);">需求分析、方案设计、执行落地、测试验证、复盘迭代</font>**<font style="color:rgb(26, 26, 46);">的 Prompt 工作流。单条神句解决的是一次对话；Prompt 套件解决的是整条流水线。</font>

<font style="color:rgb(26, 26, 46);">这件事跟写代码很像。你不会因为某个函数写得漂亮，就说整个系统设计好了；同理，你也不能因为某条 Prompt 偶尔很灵，就以为 Prompt 体系成熟了。</font>

<!-- 这是一张图片，ocr 内容为：模板沉淀 架构 拆解 测试 生命周期 执行 冷 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369667114-05c363b9-af13-42ab-91c7-9a12bc0e8363.png)

### <font style="color:rgb(15, 23, 42);">8.1 四类最值得沉淀的模板</font>

<font style="color:rgb(26, 26, 46);">最值得沉淀的 Prompt，不是那种“展示技巧”的，而是高频、可复用、影响面大的。一般来说，至少有四类：</font>

+ **<font style="color:rgb(15, 23, 42);">架构设计模板</font>**<font style="color:rgb(26, 26, 46);">：用来做方案对比、扩展性权衡、风险盘点</font>
+ **<font style="color:rgb(15, 23, 42);">需求拆解模板</font>**<font style="color:rgb(26, 26, 46);">：把 PRD 切成页面、接口、表结构、验收点</font>
+ **<font style="color:rgb(15, 23, 42);">编码执行模板</font>**<font style="color:rgb(26, 26, 46);">：明确改哪些文件、保留哪些行为、输出哪些检查项</font>
+ **<font style="color:rgb(15, 23, 42);">审查测试模板</font>**<font style="color:rgb(26, 26, 46);">：让模型按严重级别输出 findings，并补充测试清单</font>

| **<font style="color:rgb(15, 23, 42);">模板类型</font>** | **<font style="color:rgb(15, 23, 42);">输入重点</font>**     | **<font style="color:rgb(15, 23, 42);">期望输出</font>**     | **<font style="color:rgb(15, 23, 42);">最怕缺什么</font>** |
| :------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :--------------------------------------------------------- |
| <font style="color:rgb(26, 26, 46);">需求拆解</font>     | <font style="color:rgb(26, 26, 46);">PRD、业务目标、现有边界</font> | <font style="color:rgb(26, 26, 46);">页面/API/数据结构/验收点</font> | <font style="color:rgb(26, 26, 46);">业务约束</font>       |
| <font style="color:rgb(26, 26, 46);">架构设计</font>     | <font style="color:rgb(26, 26, 46);">吞吐量、团队技术栈、演进目标</font> | <font style="color:rgb(26, 26, 46);">方案矩阵、成本、迁移路线</font> | <font style="color:rgb(26, 26, 46);">非功能性要求</font>   |
| <font style="color:rgb(26, 26, 46);">编码执行</font>     | <font style="color:rgb(26, 26, 46);">文件范围、契约、禁改项</font> | <font style="color:rgb(26, 26, 46);">计划、补丁、测试点、风险</font> | <font style="color:rgb(26, 26, 46);">修改边界</font>       |
| <font style="color:rgb(26, 26, 46);">审查测试</font>     | <font style="color:rgb(26, 26, 46);">diff、日志、风险偏好</font> | <font style="color:rgb(26, 26, 46);">结构化 findings、测试建议</font> | <font style="color:rgb(26, 26, 46);">优先级标准</font>     |

<!-- 这是一张图片，ocr 内容为：面向开发生命周期的PROMPT套件 编码执行 审查测试 架构设计 需求拆解 页面清单/APL/表结构 严重级别/类别/证据 方案矩阵/成本/演进 文件范围/约束/补丁 测试点/回归点 验收标准/风险前置 GIVEN-WHEN-THEN 为什么选A不选B 统一收口到:可复用PROMPT资产库 版本号/适用场景/风险说明/示例输入输出/绑定EVAL -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777290290847-1cf3bb24-a775-4741-894b-3f863aa6bda6.png)

<font style="color:rgb(26, 26, 46);">🤔</font><font style="color:rgb(26, 26, 46);"> 你可能会想：有必要搞这么重吗？不就是问模型几个问题？</font>

<font style="color:rgb(26, 26, 46);">真有必要。因为一旦任务开始高频复用、跨人协作、接自动化流程，Prompt 就不再是聊天文本，而是工程接口。接口不稳定，整个链路都会抖。</font>

### <font style="color:rgb(15, 23, 42);">8.2 架构设计模板</font>

<font style="color:rgb(26, 26, 46);">架构设计阶段的 Prompt，核心是</font>**<font style="color:rgb(15, 23, 42);">让模型输出方案对比和权衡分析</font>**<font style="color:rgb(26, 26, 46);">，而不是直接给一个方案。</font>

```plain
角色：资深架构师
背景：[项目描述、技术栈、团队规模、性能要求]
任务：为 [功能描述] 设计架构方案

要求：
1. 输出至少 2 个方案的对比矩阵
2. 每个方案列出：优势、劣势、冷启动成本、扩展性
3. 给出推荐方案和理由
4. 列出技术选型的利弊分析
5. 说明可能的风险和未确认假设
```

### <font style="color:rgb(15, 23, 42);">8.3 需求拆解模板</font>

<font style="color:rgb(26, 26, 46);">从 PRD 倒推，输出可执行的开发计划。</font>

```plain
角色：技术项目经理
背景：[PRD 内容或需求描述]
任务：将需求拆解为可执行的开发任务

输出格式：
1. 页面清单（路由、组件、交互）
2. 接口清单（方法、路径、请求/响应体）
3. 数据表设计（表名、字段、索引、关系）
4. 验收标准（每个功能的 AC）
5. 测试清单（关键测试场景）
```

### <font style="color:rgb(15, 23, 42);">8.4 编码执行模板</font>

<font style="color:rgb(26, 26, 46);">编码阶段的 Prompt，核心是</font>**<font style="color:rgb(15, 23, 42);">明确边界</font>**<font style="color:rgb(26, 26, 46);">——只允许改什么、必须保留什么。</font>

```plain
角色：[技术栈] 高级开发
背景：[项目上下文、相关代码]
任务：[具体编码任务]

约束：
- 必须使用 TypeScript strict mode
- 只允许修改以下文件：[文件列表]
- 必须保留的既有行为：[行为列表]
- 禁止引入新依赖

验收：
- 代码通过 ESLint 检查
- 输出需要补充的边界测试用例
```

### <font style="color:rgb(15, 23, 42);">8.5 审查与测试模板</font>

```plain
角色：安全审计专家 + QA 工程师
背景：[代码变更内容]
任务：审查代码并生成测试用例

审查重点：
- 安全漏洞：XSS、CSRF、SQL 注入
- 性能问题：N+1 查询、内存泄漏
- 边界条件：空值、超长输入、并发

输出格式：
1. 按 severity 分级的 finding 列表
2. 基于 given-when-then 的测试用例
3. 每个 finding 附修复建议
```

## <font style="color:rgb(15, 23, 42);">九、Plan-then-Execute：防止 AI 蒙眼狂奔</font>

<font style="color:rgb(26, 26, 46);">你有没有遇到过这种情况——让 AI 改一个功能，它一口气改了 8 个文件，结果项目跑不起来了？</font>

<font style="color:rgb(26, 26, 46);">这就是</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">"蒙眼狂奔"</font>**<font style="color:rgb(26, 26, 46);">——AI 没有计划就开始改代码，改着改着方向就偏了。Plan-then-Execute 就是防止这种情况的工作流。</font>

<font style="color:rgb(26, 26, 46);">你装修房子，是直接让工人开砸，还是先出设计图、确认后再施工？当然是后者。对 AI 也一样。</font>

<!-- 这是一张图片，ocr 内容为：先计划 再执行 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369694671-8144625f-2752-471d-9892-899cc67c2439.png)

### <font style="color:rgb(15, 23, 42);">9.1 标准执行范式</font>

:::color2
**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> Plan-then-Execute 六步法</font>**

1. **<font style="color:rgb(15, 23, 42);">要求先提供分步计划</font>**<font style="color:rgb(26, 26, 46);">（Plan）与核心依赖假设</font>
2. **<font style="color:rgb(15, 23, 42);">要求列出修改的文件</font>**<font style="color:rgb(26, 26, 46);">和每文件的改动要点</font>
3. **<font style="color:rgb(15, 23, 42);">要求说明风险</font>**<font style="color:rgb(26, 26, 46);">与未确认假设</font>
4. **<font style="color:rgb(15, 23, 42);">你执行 Human Review</font>**<font style="color:rgb(26, 26, 46);">，修正包版本或方向</font>
5. **<font style="color:rgb(15, 23, 42);">授权指令</font>**<font style="color:rgb(26, 26, 46);">："计划核对完毕，请严格按步骤执行"</font>
6. **<font style="color:rgb(15, 23, 42);">每完成一步，运行测试验证</font>**<font style="color:rgb(26, 26, 46);">，再进入下一步</font>

:::

<font style="color:rgb(26, 26, 46);">关键在第 4 步——</font>**<font style="color:rgb(15, 23, 42);">你必须审查计划</font>**<font style="color:rgb(26, 26, 46);">。不要跳过这一步直接让 AI 执行。审查的时候重点看：</font>

+ <font style="color:rgb(26, 26, 46);">🔍</font><font style="color:rgb(26, 26, 46);"> 修改的文件列表是否合理？有没有遗漏？</font>
+ <font style="color:rgb(26, 26, 46);">🔍</font><font style="color:rgb(26, 26, 46);"> 依赖的包版本是否正确？</font>
+ <font style="color:rgb(26, 26, 46);">🔍</font><font style="color:rgb(26, 26, 46);"> 风险评估是否到位？</font>
+ <font style="color:rgb(26, 26, 46);">🔍</font><font style="color:rgb(26, 26, 46);"> 有没有更好的方案？</font>

<font style="color:rgb(26, 26, 46);">这类 Prompt 真正值钱的地方，不只是“先想后做”这么简单，而是把任务拆成了三个可审查产物：</font>

1. **<font style="color:rgb(15, 23, 42);">计划产物</font>**<font style="color:rgb(26, 26, 46);">：步骤、文件清单、依赖假设、风险排序</font>
2. **<font style="color:rgb(15, 23, 42);">执行产物</font>**<font style="color:rgb(26, 26, 46);">：补丁、受影响行为、测试结果</font>
3. **<font style="color:rgb(15, 23, 42);">复盘产物</font>**<font style="color:rgb(26, 26, 46);">：还有哪些假设没验证、哪些地方需要人工兜底</font>

<font style="color:rgb(26, 26, 46);">🚨</font><font style="color:rgb(26, 26, 46);"> 看一个更接地气的案例。假设你要改“优惠券叠加规则”：</font>

**<font style="color:rgb(15, 23, 42);">背景</font>**<font style="color:rgb(26, 26, 46);">：涉及 6 个后端文件、2 个前端页面、1 套结算测试夹具。</font>
**<font style="color:rgb(15, 23, 42);">现象</font>**<font style="color:rgb(26, 26, 46);">：新活动上线后，部分订单把会员折扣和新人券叠加了两次。</font>
**<font style="color:rgb(15, 23, 42);">风险</font>**<font style="color:rgb(26, 26, 46);">：金额计算一旦改炸，不是页面错个文案，是直接少收钱。</font>

<font style="color:rgb(26, 26, 46);">这种任务如果你一句“修一下叠加逻辑”扔过去，模型很容易先改 if/else，再顺手把接口字段、测试快照、前端展示一起调整。看起来很主动，实际是在扩大爆炸半径。</font>

<font style="color:rgb(26, 26, 46);">Plan-then-Execute 的正确打开方式应该是：</font>

1. <font style="color:rgb(26, 26, 46);">第一轮只让模型确认“叠加规则在哪几层生效”</font>
2. <font style="color:rgb(26, 26, 46);">第二轮只让它交文件影响清单和修改顺序</font>
3. <font style="color:rgb(26, 26, 46);">第三轮才授权按步骤改，并要求每一步附验证结果</font>

<font style="color:rgb(26, 26, 46);">这类 Prompt 做了两层保护：一层是把“理解偏差”暴露在最便宜的阶段；另一层是让人类保留方向盘，只把执行权交给模型。</font>

### <font style="color:rgb(15, 23, 42);">9.2 什么时候必须用？</font>

<font style="color:rgb(26, 26, 46);">不是所有任务都需要 Plan-then-Execute。简单任务（改个变量名、加个字段）直接做就行。以下场景</font>**<font style="color:rgb(15, 23, 42);">必须用</font>**<font style="color:rgb(26, 26, 46);">：</font>

| **<font style="color:rgb(15, 23, 42);">场景</font>**         | **<font style="color:rgb(15, 23, 42);">风险等级</font>**     | **<font style="color:rgb(15, 23, 42);">不用 Plan 的后果</font>** |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(26, 26, 46);">多文件功能开发（3+ 文件）</font> | <font style="color:rgb(26, 26, 46);">🔴</font><font style="color:rgb(26, 26, 46);"> 高</font> | <font style="color:rgb(26, 26, 46);">改漏文件，功能不完整</font> |
| <font style="color:rgb(26, 26, 46);">跨模块重构</font>       | <font style="color:rgb(26, 26, 46);">🔴</font><font style="color:rgb(26, 26, 46);"> 高</font> | <font style="color:rgb(26, 26, 46);">破坏其他模块的依赖</font> |
| <font style="color:rgb(26, 26, 46);">数据库迁移</font>       | <font style="color:rgb(26, 26, 46);">🔴</font><font style="color:rgb(26, 26, 46);"> 高</font> | <font style="color:rgb(26, 26, 46);">数据丢失或服务中断</font> |
| <font style="color:rgb(26, 26, 46);">单文件小修改</font>     | <font style="color:rgb(26, 26, 46);">🟢</font><font style="color:rgb(26, 26, 46);"> 低</font> | <font style="color:rgb(26, 26, 46);">影响可控，直接做</font> |
| <font style="color:rgb(26, 26, 46);">样式调整</font>         | <font style="color:rgb(26, 26, 46);">🟢</font><font style="color:rgb(26, 26, 46);"> 低</font> | <font style="color:rgb(26, 26, 46);">视觉问题，容易回滚</font> |


## <font style="color:rgb(15, 23, 42);">十、结构化输出约束：让 AI 的输出可解析</font>

<font style="color:rgb(26, 26, 46);">你让 AI 输出一段代码，它给你输出了 3 段代码 + 2 段解释 + 1 段废话——你还得手动从里面把代码抠出来。这就是没有结构化输出约束的后果。</font>

<!-- 这是一张图片，ocr 内容为：可解析 XML标签 SCHEMA 自我核查/PATCH-DIFF JSON 000 自检/DIFF TYPE:OBJECT, OUTPUT PROPERTIES TITLE -错误内容 TITLE:TYPE:STRING CONTENT ITEMS +修正内容 TYPE ARRAY META 保留内容 REQUIRED:TITLE,ITEMS /OUTPUT -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369729903-1e3e9a9f-a921-4743-bc56-0ee6dc34b1a2.png)

### <font style="color:rgb(15, 23, 42);">10.1 三种结构化输出机制对比</font>

| **<font style="color:rgb(15, 23, 42);">机制</font>**         | **<font style="color:rgb(15, 23, 42);">可靠性</font>**       | **<font style="color:rgb(15, 23, 42);">Token 开销</font>** | **<font style="color:rgb(15, 23, 42);">适用场景</font>**     | **<font style="color:rgb(15, 23, 42);">模型支持</font>**     |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **<font style="color:rgb(15, 23, 42);">XML 标签</font>**     | <font style="color:rgb(26, 26, 46);">🟡</font><font style="color:rgb(26, 26, 46);"> 中</font> | <font style="color:rgb(26, 26, 46);">低</font>             | <font style="color:rgb(26, 26, 46);">分块输出（思考/代码/测试）</font> | <font style="color:rgb(26, 26, 46);">所有模型</font>         |
| **<font style="color:rgb(15, 23, 42);">JSON Schema</font>**  | <font style="color:rgb(26, 26, 46);">🟢</font><font style="color:rgb(26, 26, 46);"> 高</font> | <font style="color:rgb(26, 26, 46);">中</font>             | <font style="color:rgb(26, 26, 46);">程序化解析、自动化工作流</font> | <font style="color:rgb(26, 26, 46);">OpenAI 原生，其他需提示</font> |
| **<font style="color:rgb(15, 23, 42);">Markdown 结构</font>** | <font style="color:rgb(26, 26, 46);">🟡</font><font style="color:rgb(26, 26, 46);"> 中</font> | <font style="color:rgb(26, 26, 46);">低</font>             | <font style="color:rgb(26, 26, 46);">人类阅读 + 简单解析</font> | <font style="color:rgb(26, 26, 46);">所有模型</font>         |


### <font style="color:rgb(15, 23, 42);">10.2 XML 标签隔离逻辑</font>

<font style="color:rgb(26, 26, 46);">用 XML 标签把不同类型的内容分块输出，便于程序解析：</font>

```plain
请使用以下标签分块输出：


你的分析过程



只输出修改的代码，用 // CHANGED 标注



需要补充的测试用例
```

<font style="color:rgb(26, 26, 46);">这样你可以用程序自动提取</font><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">里的内容，而不用手动从一堆废话里找代码。</font>

### <font style="color:rgb(15, 23, 42);">10.3 JSON Schema 绑定</font>

<font style="color:rgb(26, 26, 46);">如果你需要把 AI 的输出喂给下一个程序处理，JSON Schema 是最可靠的方式：</font>

```plain
请严格按以下 JSON Schema 输出：
{
  "files": [
    { "path": "string", "changes": ["string"] }
  ],
  "risks": ["string"],
  "tests_needed": ["string"]
}

不要输出任何 JSON 之外的内容。
```

<font style="color:rgb(26, 26, 46);">OpenAI 的 Structured Outputs 功能可以</font>**<font style="color:rgb(15, 23, 42);">在 API 层面强制输出合法 JSON</font>**<font style="color:rgb(26, 26, 46);">，比自然语言约束可靠得多。如果你的工作流涉及自动化解析，一定要用这个功能。</font>

### <font style="color:rgb(15, 23, 42);">10.4 自我核查指令</font>

<font style="color:rgb(26, 26, 46);">很多时候模型不是不会，而是太爱赶进度。它给你一个貌似完整的答案，里面藏着没确认的假设、没跑过的测试、没验证的依赖。</font>

<font style="color:rgb(26, 26, 46);">这时候可以在 Prompt 末尾补一个自检段：</font>

<font style="color:rgb(26, 26, 46);">让 AI 在输出完毕后自己检查一遍——这听起来像玄学，但确实有效：</font>

```plain
输出完毕后，请扮演严苛的审核员：
1. 按上述 3 条约束检查你自己的代码
2. 打印核对清单，列出每个约束的满足情况
3. 如果有未满足的约束，给出修复方案
```

<font style="color:rgb(26, 26, 46);">注意，这不是万能药。它不能把错误答案变成正确答案，但它很擅长把</font>**<font style="color:rgb(15, 23, 42);">没说出来的风险显性化</font>**<font style="color:rgb(26, 26, 46);">。这在团队协作里非常值钱。</font>

### <font style="color:rgb(15, 23, 42);">10.5 Patch/Diff 风格输出</font>

<font style="color:rgb(26, 26, 46);">让 AI 以 unified diff 格式展示变更，清晰展示改了什么：</font>

```plain
请以 unified diff 格式输出变更：
- 用 - 前缀标记删除的行
- 用 + 前缀标记新增的行
- 每个变更块前标注文件路径
```

## <font style="color:rgb(15, 23, 42);">十一、跨工具 Prompt 适配：同一套思路，不同的写法</font>

<font style="color:rgb(26, 26, 46);">你在 Cursor 里写得好好的 Prompt，复制到 Claude Code 里效果就差了。为什么？因为</font>**<font style="color:rgb(15, 23, 42);">不同工具对 Prompt 的处理方式不同</font>**<font style="color:rgb(26, 26, 46);">。</font>

<!-- 这是一张图片，ocr 内容为：COPILOT CURSOR CLAUDE CODE WEB 00 00 同一个思考,需要适配不同工具;方法一致,表达各异. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777369752680-8c0af4c6-884d-4432-9eef-58cd99b55e20.png)

### <font style="color:rgb(15, 23, 42);">11.1 四大工具的 Prompt 差异</font>

| **<font style="color:rgb(15, 23, 42);">维度</font>**         | **<font style="color:rgb(15, 23, 42);">Cursor</font>**       | **<font style="color:rgb(15, 23, 42);">Claude Code</font>**  | **<font style="color:rgb(15, 23, 42);">ChatGPT/Claude Web</font>** | **<font style="color:rgb(15, 23, 42);">GitHub Copilot</font>** |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **<font style="color:rgb(15, 23, 42);">上下文来源</font>**   | <font style="color:rgb(26, 26, 46);">自动收集打开文件</font> | <font style="color:rgb(26, 26, 46);">读取 CLAUDE.md + 项目文件</font> | <font style="color:rgb(26, 26, 46);">仅对话历史</font>       | <font style="color:rgb(26, 26, 46);">当前文件 + 邻近文件</font> |
| **<font style="color:rgb(15, 23, 42);">规则文件</font>**     | <font style="color:rgb(26, 26, 46);">.cursorrules</font>     | <font style="color:rgb(26, 26, 46);">CLAUDE.md</font>        | <font style="color:rgb(26, 26, 46);">Custom Instructions</font> | <font style="color:rgb(26, 26, 46);">.github/copilot</font>  |
| **<font style="color:rgb(15, 23, 42);">最佳 Prompt 长度</font>** | <font style="color:rgb(26, 26, 46);">中（50-200 字）</font>  | <font style="color:rgb(26, 26, 46);">长（200-1000 字）</font> | <font style="color:rgb(26, 26, 46);">中长（100-500 字）</font> | <font style="color:rgb(26, 26, 46);">短（注释式，10-50 字）</font> |
| **<font style="color:rgb(15, 23, 42);">多文件操作</font>**   | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 原生支持</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 原生支持</font> | <font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 需手动粘贴</font> | <font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 单文件为主</font> |
| **<font style="color:rgb(15, 23, 42);">结构化输出</font>**   | <font style="color:rgb(26, 26, 46);">直接编辑文件</font>     | <font style="color:rgb(26, 26, 46);">直接编辑文件</font>     | <font style="color:rgb(26, 26, 46);">需手动复制</font>       | <font style="color:rgb(26, 26, 46);">内联补全</font>         |


<font style="color:rgb(51, 51, 51);">所以，不存在一条 Prompt 适配所有工具。真正稳定的是底层原则：上下文、边界、输出、验证。</font>

### <font style="color:rgb(15, 23, 42);">11.2 同一任务的不同写法</font>

<font style="color:rgb(26, 26, 46);">以"重构一个函数"为例，看看不同工具的最优写法：</font>

**<font style="color:rgb(16, 185, 129);">🔧</font>****<font style="color:rgb(16, 185, 129);"> Cursor 写法</font>**

```plain
@getUserOrders.ts 重构这个函数：
- 提取过滤逻辑为独立函数
- 添加缓存层
- 保持函数签名不变
- 输出 Jest 测试
```

**<font style="color:rgb(16, 185, 129);">💻</font>****<font style="color:rgb(16, 185, 129);"> Claude Code 写法</font>**

```plain
重构 src/services/order.ts 中的
getUserOrders 函数：

背景：高并发售票平台，QPS 5000+
目标：提取过滤逻辑 + 添加缓存
约束：不修改函数签名，不引入新依赖
验收：Jest 测试覆盖空数组和超时

请先输出修改计划，等我确认后执行。
```

**<font style="color:rgb(16, 185, 129);">🌐</font>****<font style="color:rgb(16, 185, 129);"> ChatGPT 写法</font>**

```plain
重构以下函数（附完整代码）：
[粘贴代码]

要求：
1. 提取过滤逻辑为独立函数
2. 添加缓存层（用 Map）
3. 保持函数签名不变
4. 输出 Jest 测试用例

请以 unified diff 格式输出变更。
```

**<font style="color:rgb(16, 185, 129);">📝</font>****<font style="color:rgb(16, 185, 129);"> Copilot 写法</font>**

```plain
// 在函数上方写注释：
// TODO: 重构 - 提取过滤逻辑，
// 添加缓存，保持签名不变
// 等待 Copilot 内联补全
```

:::color2
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 跨工具适配的核心原则</font>**

**<font style="color:rgb(15, 23, 42);">思路不变，写法适配。</font>**<font style="color:rgb(26, 26, 46);">RCTCOV 模型的六个要素不变，但表达方式根据工具特点调整：</font>

+ <font style="color:rgb(26, 26, 46);">能自动获取上下文的工具（Cursor/Claude Code）→ Context 可以精简</font>
+ <font style="color:rgb(26, 26, 46);">不能自动获取上下文的工具→ Context 必须完整</font>
+ <font style="color:rgb(26, 26, 46);">支持文件操作的工具 → 直接说"改哪个文件"</font>
+ <font style="color:rgb(26, 26, 46);">只支持对话的工具 → 必须粘贴代码 + 要求 diff 输出</font>

:::



## <font style="color:rgb(15, 23, 42);">十二、Prompt 在 Vibe Coding 里的真实地位：重要，但绝不是唯一关键</font>

<font style="color:rgb(26, 26, 46);">如果你只看互联网上那些“神 Prompt”帖子，会产生一种错觉：好像 AI 编程的胜负，主要就赢在措辞。</font>

<font style="color:rgb(26, 26, 46);">这话太片面了。Prompt 很重要，但它在实际系统里只是一层，而且不是最孤立的一层。你真正该盯住的是：</font>**<font style="color:rgb(15, 23, 42);">任务定义、上下文供给、工具能力、验证机制、资产治理</font>**<font style="color:rgb(26, 26, 46);">这五件事是怎么一起工作的。</font>

| **<font style="color:rgb(15, 23, 42);">层</font>**           | **<font style="color:rgb(15, 23, 42);">它决定什么</font>**   | **<font style="color:rgb(15, 23, 42);">典型失效模式</font>** |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(26, 26, 46);">任务定义（Prompt）</font> | <font style="color:rgb(26, 26, 46);">模型理解你到底要它做什么</font> | <font style="color:rgb(26, 26, 46);">目标模糊、边界不清、输出格式飘</font> |
| <font style="color:rgb(26, 26, 46);">上下文供给</font>       | <font style="color:rgb(26, 26, 46);">模型有没有真实事实可用</font> | <font style="color:rgb(26, 26, 46);">缺日志、缺契约、缺规则，只能瞎猜</font> |
| <font style="color:rgb(26, 26, 46);">工具接入</font>         | <font style="color:rgb(26, 26, 46);">模型能不能查文件、跑测试、调 API</font> | <font style="color:rgb(26, 26, 46);">只会“说”，不会“证实”</font> |
| <font style="color:rgb(26, 26, 46);">验证机制</font>         | <font style="color:rgb(26, 26, 46);">错误会不会在上线前暴露</font> | <font style="color:rgb(26, 26, 46);">看回答顺眼就当成功</font> |
| <font style="color:rgb(26, 26, 46);">资产治理</font>         | <font style="color:rgb(26, 26, 46);">Prompt 能不能稳定复用和迭代</font> | <font style="color:rgb(26, 26, 46);">每次重写、没人知道旧版本为何有效</font> |


<font style="color:rgb(26, 26, 46);">这也是为什么很多团队一边疯狂研究 Prompt 话术，一边交付效果还是不稳定。因为他们优化的是最显眼的一层，却没处理真正的短板：上下文不准、规则不清、工具没接、测试没跑。</font>

:::info
<font style="color:rgb(26, 26, 46);">Anthropic 的长上下文建议里提到，把长文档放在前面、把 query 放在后面，在复杂多文档任务里可让回答质量提升最多 30%。这说明很多“Prompt 问题”，其实本质上是上下文组织问题。</font>

:::

### <font style="color:rgb(15, 23, 42);">12.1 一个更真实的认知：Prompt 更像“任务接口”，不是“魔法咒语”</font>

<font style="color:rgb(26, 26, 46);">Prompt 在系统里的真实位置，更像 API 契约。它定义输入、输出、边界、调用方式，但它并不替代数据源、执行器和测试框架。</font>

<font style="color:rgb(26, 26, 46);">这件事特别像后端接口设计。你可以把 OpenAPI 写得很完美，但数据库错了、鉴权没接、服务没监控，系统照样会炸。Prompt 也一样。</font>

:::info
<font style="color:rgb(26, 26, 46);">OpenAI 的 Prompting 与 Prompt Engineering 文档都反复强调两件事：一是把生产应用 pin 到具体模型快照；二是给 Prompt 配 eval。翻译成工程话，就是别把行为稳定性寄托在“感觉这次写得更好”。</font>

:::

<font style="color:rgb(26, 26, 46);">🤔</font><font style="color:rgb(26, 26, 46);"> 你可能会问：那 Prompt 还有必要钻这么深吗？</font>

<font style="color:rgb(26, 26, 46);">当然有。因为它仍然是</font>**<font style="color:rgb(15, 23, 42);">系统入口</font>**<font style="color:rgb(26, 26, 46);">。入口烂，后面的上下文、工具和测试全都要替你擦屁股。只是别把入口误以为是全部。</font>

### <font style="color:rgb(15, 23, 42);">12.2 高阶玩家的优势来源</font>

<font style="color:rgb(26, 26, 46);">高阶 Vibe Coder 和新手之间的差距，不在于 Prompt 写得多花哨，而在于</font>**<font style="color:rgb(15, 23, 42);">系统设计能力</font>**<font style="color:rgb(26, 26, 46);">：</font>

+ <font style="color:rgb(26, 26, 46);">📐</font><font style="color:rgb(26, 26, 46);"> 设计好的上下文供给策略——什么时候给什么信息</font>
+ <font style="color:rgb(26, 26, 46);">📋</font><font style="color:rgb(26, 26, 46);"> 设计规则文件结构——让 AI 自动遵守团队规范</font>
+ <font style="color:rgb(26, 26, 46);">🔄</font><font style="color:rgb(26, 26, 46);"> 设计验证流程——让错误在早期被发现</font>
+ <font style="color:rgb(26, 26, 46);">🔗</font><font style="color:rgb(26, 26, 46);"> 设计链式工作流——让多个 Prompt 协同完成复杂任务</font>
+ <font style="color:rgb(26, 26, 46);">🔧</font><font style="color:rgb(26, 26, 46);"> 设计工具链——让 AI 能调用正确的工具</font>

**<font style="color:rgb(15, 23, 42);">"系统设计"才是高阶玩家的护城河，"话术技巧"不是。</font>**

## <font style="color:rgb(15, 23, 42);">十三、常见错误写法与修复</font>

<font style="color:rgb(26, 26, 46);">看了这么多正确做法，再来看看最常见的错误。对号入座，看看你踩了几个：</font>

| **<font style="color:rgb(15, 23, 42);">错误类型</font>**   | **<font style="color:rgb(15, 23, 42);">❌</font>****<font style="color:rgb(15, 23, 42);"> 错误示例</font>** | **<font style="color:rgb(15, 23, 42);">✅</font>****<font style="color:rgb(15, 23, 42);"> 正确写法</font>** |
| :--------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **<font style="color:rgb(15, 23, 42);">目标不明确</font>** | <font style="color:rgb(26, 26, 46);">"帮我优化一下代码"</font> | <font style="color:rgb(26, 26, 46);">"把这个函数的时间复杂度从 O(n²) 降到 O(n log n)"</font> |
| **<font style="color:rgb(15, 23, 42);">背景不足</font>**   | <font style="color:rgb(26, 26, 46);">"写一个登录功能"</font> | <font style="color:rgb(26, 26, 46);">"用 Next.js App Router + NextAuth 写邮箱+密码登录"</font> |
| **<font style="color:rgb(15, 23, 42);">约束冲突</font>**   | <font style="color:rgb(26, 26, 46);">"用最简单方式，但用上所有设计模式"</font> | <font style="color:rgb(26, 26, 46);">消除自相矛盾的要求</font> |
| **<font style="color:rgb(15, 23, 42);">输出模糊</font>**   | <font style="color:rgb(26, 26, 46);">"给我一些建议"</font>   | <font style="color:rgb(26, 26, 46);">"列出 3 个主要问题，每个附修复方案和代码示例"</font> |
| **<font style="color:rgb(15, 23, 42);">要求过大</font>**   | <font style="color:rgb(26, 26, 46);">"帮我写一个完整的电商后台"</font> | <font style="color:rgb(26, 26, 46);">"先列出模块清单，确认后再逐一实现"</font> |
| **<font style="color:rgb(15, 23, 42);">缺少验证</font>**   | <font style="color:rgb(26, 26, 46);">"实现就好"</font>       | <font style="color:rgb(26, 26, 46);">"实现后写测试，并列出可能的边界条件和安全风险"</font> |
| **<font style="color:rgb(15, 23, 42);">链式无验证</font>** | <font style="color:rgb(26, 26, 46);">Chain 每步直接传给下一步</font> | <font style="color:rgb(26, 26, 46);">每步输出先验证再传递</font> |
| **<font style="color:rgb(15, 23, 42);">工具不适配</font>** | <font style="color:rgb(26, 26, 46);">在 ChatGPT 里写"@file"</font> | <font style="color:rgb(26, 26, 46);">根据工具能力调整 Prompt 写法</font> |


## <font style="color:rgb(15, 23, 42);">十四、Prompt 调试与迭代：像调代码一样调 Prompt</font>

<font style="color:rgb(26, 26, 46);">Prompt 不是一次写完就完事的——它需要像代码一样调试和迭代。</font>

### <font style="color:rgb(15, 23, 42);">14.1 一个更成熟的 Prompt 迭代闭环</font>

<font style="color:rgb(26, 26, 46);">Prompt 调试和调性能很像。不要凭感觉改，要看失败模式改。</font>

1. **<font style="color:rgb(15, 23, 42);">写初版</font>**<font style="color:rgb(26, 26, 46);">：基于 RCTCOV 模型写第一版</font>
2. **<font style="color:rgb(15, 23, 42);">测试</font>**<font style="color:rgb(26, 26, 46);">：用真实任务测试输出</font>
3. **<font style="color:rgb(15, 23, 42);">分析偏差</font>**<font style="color:rgb(26, 26, 46);">：输出哪里不对？缺了什么？多了什么？</font>
4. **<font style="color:rgb(15, 23, 42);">调整约束</font>**<font style="color:rgb(26, 26, 46);">：补充 Context、细化 Constraint、明确 Verification</font>
5. **<font style="color:rgb(15, 23, 42);">再测试</font>**<font style="color:rgb(26, 26, 46);">：用相同任务验证改进效果</font>

<!-- 这是一张图片，ocr 内容为：PROMPT 调试闭环:像调程序一样调PROMPT 跑样例 真实任务验证 A/B测试维度: 1.成功率 看偷差 写初版 2.返工轮次 错在哪一层 定义目标与格式 3.TOKEN成本 4.漏报/误报 改约束 补上下文/样例 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777292137700-692b415e-2d5c-4038-b042-92bb24d310ae.png)

<font style="color:rgb(26, 26, 46);">一条成熟的调试闭环，至少要回答四个问题：</font>

1. <font style="color:rgb(26, 26, 46);">失败是出在任务理解、上下文供给、工具使用，还是输出格式？</font>
2. <font style="color:rgb(26, 26, 46);">这个问题是个别样例，还是系统性样例？</font>
3. <font style="color:rgb(26, 26, 46);">修复后，成功率有没有涨，还是只是碰巧这次过了？</font>
4. <font style="color:rgb(26, 26, 46);">成本、延迟、返工轮次有没有恶化？</font>

:::info
<font style="color:rgb(26, 26, 46);">OpenAI 现在把 Prompt Optimizer 和 datasets 放到官方工作流里，本质也是在鼓励你把 Prompt 改进从“凭感觉”升级到“看样本、看评测、看反馈”。这跟我们写单测、做 benchmark 没本质区别。</font>

:::

### <font style="color:rgb(15, 23, 42);">14.2 怎么判断是 Prompt 问题，还是模型能力问题</font>

<font style="color:rgb(26, 26, 46);">一个很实用的诊断方法是：</font>**<font style="color:rgb(15, 23, 42);">拿同一任务换一个更强模型试一次。</font>**

+ <font style="color:rgb(26, 26, 46);">如果强模型明显变好，说明问题更多出在模型能力边界</font>
+ <font style="color:rgb(26, 26, 46);">如果所有模型都错在同一个地方，说明多半是 Prompt、上下文或约束写得不够清</font>

<font style="color:rgb(26, 26, 46);">不过更细一点，你其实应该做四分诊断，而不是二分诊断：</font>

| **<font style="color:rgb(15, 23, 42);">观察到的现象</font>** | **<font style="color:rgb(15, 23, 42);">更可能的问题层</font>** | **<font style="color:rgb(15, 23, 42);">优先怎么验证</font>** |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(26, 26, 46);">模型一直改错范围</font> | <font style="color:rgb(26, 26, 46);">Prompt / 约束问题</font> | <font style="color:rgb(26, 26, 46);">补可改文件清单与禁区</font> |
| <font style="color:rgb(26, 26, 46);">回答听起来合理但事实错</font> | <font style="color:rgb(26, 26, 46);">上下文问题</font>       | <font style="color:rgb(26, 26, 46);">补日志、契约、最新文档</font> |
| <font style="color:rgb(26, 26, 46);">知道该做什么，但不会执行验证</font> | <font style="color:rgb(26, 26, 46);">工具问题</font>         | <font style="color:rgb(26, 26, 46);">开放测试、文件、检索工具</font> |
| <font style="color:rgb(26, 26, 46);">复杂任务始终半途掉球</font> | <font style="color:rgb(26, 26, 46);">工作流问题</font>       | <font style="color:rgb(26, 26, 46);">改成 Plan 或 Prompt Chaining</font> |
| <font style="color:rgb(26, 26, 46);">强模型明显更稳，弱模型普遍翻车</font> | <font style="color:rgb(26, 26, 46);">模型能力问题</font>     | <font style="color:rgb(26, 26, 46);">换模型或收缩任务范围</font> |


<font style="color:rgb(26, 26, 46);">这一步很像性能排查时先换数据集、换执行计划、换缓存层。别一上来就迷信“再润色一下措辞”。真正专业的团队，会把 Prompt 失败归因做成 checklist，而不是做成玄学笔记。</font>

### 14.3 <font style="color:rgb(15, 23, 42);">给 Prompt 做版本管理，真的不是小题大做</font>

<font style="color:rgb(26, 26, 46);">如果一个 Prompt 关系到代码生成、审查、工单拆解、线上值班辅助，它就已经是生产资产了。生产资产就该有版本、变量、说明和回滚。</font>

```plain
Prompt 名称：review_checkout_pr
版本：v7
适用场景：支付域 PR 审查
输入变量：diff, changed_files, risk_notes
输出格式：JSON schema
最近改动：新增 “payment amount precision” 检查项
绑定 eval：checkout-review-regression-set
```

<font style="color:rgb(26, 26, 46);">这套做法带来的好处特别直接：</font>

1. <font style="color:rgb(26, 26, 46);">新成员接手时知道 Prompt 为什么这样写</font>
2. <font style="color:rgb(26, 26, 46);">模型升级后可以做回归对比</font>
3. <font style="color:rgb(26, 26, 46);">Prompt 崩了能回滚，不用靠记忆手搓旧版本</font>

<font style="color:rgb(26, 26, 46);">再往前走一步，成熟团队还会做两件事：</font>

1. **<font style="color:rgb(15, 23, 42);">分阶段版本化</font>**<font style="color:rgb(26, 26, 46);">：链式工作流里的每个阶段都有独立版本号</font>
2. **<font style="color:rgb(15, 23, 42);">灰度发布</font>**<font style="color:rgb(26, 26, 46);">：先让一小部分任务吃新 Prompt，看 eval 和人工反馈，再全面替换</font>

<font style="color:rgb(26, 26, 46);">Prompt 到这里，已经完全不是“聊天技巧”了。它更像一种可测试、可发布、可回滚的工程配置。</font>

### <font style="color:rgb(26, 26, 46);">14.4 Eval 应该评估什么？</font>

| **<font style="color:rgb(51, 51, 51);">评估目标</font>** | **<font style="color:rgb(51, 51, 51);">指标</font>**         | **<font style="color:rgb(51, 51, 51);">示例</font>**         |
| :------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| <font style="color:rgb(51, 51, 51);">输出格式稳定</font> | <font style="color:rgb(51, 51, 51);">JSON parse success rate</font> | <font style="color:rgb(51, 51, 51);">100 个样本中 98 个可解析</font> |
| <font style="color:rgb(51, 51, 51);">工程正确性</font>   | <font style="color:rgb(51, 51, 51);">test pass rate</font>   | <font style="color:rgb(51, 51, 51);">生成补丁后测试通过率</font> |
| <font style="color:rgb(51, 51, 51);">安全边界</font>     | <font style="color:rgb(51, 51, 51);">unauthorized change rate</font> | <font style="color:rgb(51, 51, 51);">是否修改禁改文件</font> |
| <font style="color:rgb(51, 51, 51);">业务一致性</font>   | <font style="color:rgb(51, 51, 51);">contract preservation rate</font> | <font style="color:rgb(51, 51, 51);">API 字段是否保持兼容</font> |
| <font style="color:rgb(51, 51, 51);">可维护性</font>     | <font style="color:rgb(51, 51, 51);">review score</font>     | <font style="color:rgb(51, 51, 51);">人工 Review 1-5 分</font> |
| <font style="color:rgb(51, 51, 51);">成本效率</font>     | <font style="color:rgb(51, 51, 51);">token / latency / retry count</font> | <font style="color:rgb(51, 51, 51);">平均成本、平均返工轮次</font> |


<font style="color:rgb(51, 51, 51);">Eval 的重点不是找一个“完美分数”，而是让 Prompt 的改进可比较、可回归、可复盘。</font>

## <font style="color:rgb(51, 51, 51);">十五、完整案例：一次复杂 Bug 修复如何设计 Prompt 工作流</font>

<font style="color:rgb(51, 51, 51);">下面把前面的内容串起来，看一次完整的工程流程。</font>

### <font style="color:rgb(51, 51, 51);">场景</font>

<font style="color:rgb(51, 51, 51);">订单系统出现优惠券叠加错误：会员折扣和新人券同时存在时，部分订单金额被重复扣减。</font>

### <font style="color:rgb(51, 51, 51);">错误 Prompt</font>

<font style="color:rgb(51, 51, 51);">帮我修一下订单优惠券叠加 bug。</font>

<font style="color:rgb(51, 51, 51);">问题：</font>

+ <font style="color:rgb(51, 51, 51);">没说明业务规则；</font>
+ <font style="color:rgb(51, 51, 51);">没说明影响范围；</font>
+ <font style="color:rgb(51, 51, 51);">没说明禁改项；</font>
+ <font style="color:rgb(51, 51, 51);">没说明金额精度；</font>
+ <font style="color:rgb(51, 51, 51);">没说明测试方式。</font>

### <font style="color:rgb(51, 51, 51);">改进后的 Prompt Chain</font>

#### <font style="color:rgb(51, 51, 51);">Step 1：需求抽取</font>

```plain
请只做需求抽取，不写代码。

输入：
- 问题描述：[线上优惠券重复扣减]
- 日志片段：[粘贴日志]
- 相关业务规则：[粘贴规则]

输出 JSON：
{
  "goals": [],
  "non_goals": [],
  "business_rules": [],
  "contracts": [],
  "risks": [],
  "unknowns": []
}
```

#### <font style="color:rgb(51, 51, 51);">Step 2：影响范围分析</font>

```plain
基于 Step 1 的 JSON 和目录树，输出：
{
  "candidate_files": [],
  "reasoning_summary": [],
  "must_not_change": [],
  "test_targets": []
}

只分析，不修改。
```

#### <font style="color:rgb(51, 51, 51);">Step 3：执行计划</font>

```plain
基于影响范围，输出修改计划：
1. 修改顺序
2. 每个文件改什么
3. 每一步如何验证
4. 可能影响的接口契约
5. 需要人工确认的问题
```

#### <font style="color:rgb(51, 51, 51);">Step 4：授权执行</font>

```plain
计划已确认。
请严格按计划修改，不允许扩大范围。
输出 unified diff，并在末尾列出测试结果和未验证项。
```

#### <font style="color:rgb(51, 51, 51);">Step 5：审查复核</font>

```plain
请审查以下 diff：
重点关注金额精度、优惠券叠加规则、返回字段兼容性、并发风险。

输出 JSON：
{
  "blockers": [],
  "non_blocking_findings": [],
  "missing_tests": [],
  "release_risk": "low|medium|high",
  "confidence": 0.0
}
```

### <font style="color:rgb(51, 51, 51);">这个案例真正解决了什么？</font>

<font style="color:rgb(51, 51, 51);">它不是让 Prompt 更长，而是把复杂任务拆成可验证阶段：</font>

+ <font style="color:rgb(51, 51, 51);">先明确规则；</font>
+ <font style="color:rgb(51, 51, 51);">再确定影响范围；</font>
+ <font style="color:rgb(51, 51, 51);">再计划修改；</font>
+ <font style="color:rgb(51, 51, 51);">再执行补丁；</font>
+ <font style="color:rgb(51, 51, 51);">最后审查复核。</font>

<font style="color:rgb(51, 51, 51);">这就是 Prompt 工程从“写一句好提示”升级为“设计一条可靠工作流”的关键。</font>

## <font style="color:rgb(26, 26, 46);">十六、总结</font>

<font style="color:rgb(51, 51, 51);">Prompt 不是咒语，是规格书。更准确地说，在工程场景里，Prompt 是任务接口；Context 是任务材料；工具是执行能力；Eval 是质量证明；权限和审查是安全边界。</font>

<font style="color:rgb(51, 51, 51);">真正拉开差距的，不是会不会写“请认真思考”，而是能不能做到：</font>

1. <font style="color:rgb(51, 51, 51);">把任务目标定义清楚；</font>
2. <font style="color:rgb(51, 51, 51);">把上下文组织准确；</font>
3. <font style="color:rgb(51, 51, 51);">把约束和禁区钉死；</font>
4. <font style="color:rgb(51, 51, 51);">把输出格式结构化；</font>
5. <font style="color:rgb(51, 51, 51);">把验证标准写实；</font>
6. <font style="color:rgb(51, 51, 51);">把复杂任务拆成工作流；</font>
7. <font style="color:rgb(51, 51, 51);">把高风险执行权管起来；</font>
8. <font style="color:rgb(51, 51, 51);">把失败样本沉淀为 eval；</font>
9. <font style="color:rgb(51, 51, 51);">把 Prompt 当作工程资产管理。</font>

<font style="color:rgb(51, 51, 51);">如果只记住一句话，记住这句：</font>

**<font style="color:rgb(119, 119, 119);">Prompt 工程的尽头不是文案技巧，而是软件工程。</font>**

<font style="color:rgb(51, 51, 51);">但还要再补一句：</font>

**<font style="color:rgb(119, 119, 119);">软件工程的核心不是“让系统永远不犯错”，而是让错误可发现、可定位、可修复、可回滚。成熟的 Prompt 工程也是如此。</font>**
