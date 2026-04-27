---
title: 2、LLM基础 底层机制
date: 2026-04-24
tags: ["AI", "Vibe Coding"]
description: 你身边是不是也有这样的人—— 一种人把 AI 当神仙，丢一句"帮我写个登录功能"，代码出来了直接合入主分支，出了 Bug 一脸懵逼："AI 写的啊，它怎么会错？另一种人把 AI 当骗子，试了两次发现生成的代码跑不起来，从此逢人就说："AI 编程？割韭菜的，根本不能用。
---

<!-- 这是一张图片，ocr 内容为：从本质,计算,训练到上下文与选型 令 女 完整流水线 为什么叫大 本质 个国小园 (000000 上下文与选型 模型种类 LLM 大语言模型 代码能力边界 TOKEN / EMBEDDING/ ATTENTION 训练与对齐 K/Y 自 会用LLM,不是迷信它,而是理解它,约束它,驾驭它. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1777001822257-54a8f595-b4fe-49ad-ab8b-cb03dd266bed.png)<font style="color:rgb(26, 26, 46);">你身边是不是也有这样的人——</font>

<font style="color:rgb(26, 26, 46);">一种人把 AI 当神仙，丢一句"帮我写个登录功能"，代码出来了直接合入主分支，出了 Bug 一脸懵逼："AI 写的啊，它怎么会错？"</font>

<font style="color:rgb(26, 26, 46);">另一种人把 AI 当骗子，试了两次发现生成的代码跑不起来，从此逢人就说："AI 编程？割韭菜的，根本不能用。"</font>

**<font style="color:rgb(15, 23, 42);">说实话，这两种人都没搞明白一件事：AI 写代码到底是怎么工作的。</font>**

<font style="color:rgb(26, 26, 46);">你不需要成为 AI 专家，但你得知道——当你敲下一行 Prompt 的时候，模型背后发生了什么。它为什么有时候聪明得吓人，有时候又蠢得离谱？它到底"理解"代码吗？还是只是在瞎蒙？</font>

<font style="color:rgb(26, 26, 46);">这一章，我们就把这些事掰开揉碎了说清楚。不搞玄学，不讲数学公式，说人话、看本质、能落地。</font>

## <font style="color:rgb(15, 23, 42);">一、LLM 究竟是什么？</font>
<!-- 这是一张图片，ocr 内容为：下一个TOKEN预测器 逐个预测下一个TOKEN 0000 DEF 写个登录功能 LOGIN LLM 用户输入 最终生成:文本/代码/回答.. 大语言模型 (上下文) 核心关键词:预测 生成 上下文 三个生活类比 概率版图书馆 会说不等于懂 概率版图书馆 超级自动补全 今天天气 从海量"书籍"中 听得多,学得像 不据真好 中国国际酒店业 很棒 根据上下文 并不代表真正理解 按概率找最可能的词 猜下一个词 概率 关键词:模仿 关键词: 关键词:模式 194 LLMVS传统程序 LLM /传统程序 概率性 输出 输入 输入 输出 从数据学习 确定性 按步骤执行,结果可预期,可复现 规则写死 根据概率生成,结果可能不同 LLM擅长续写模式,不等于真正理解业务. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776993776886-93795d77-b700-46d8-850c-1d555c2a0540.png)

<font style="color:rgb(26, 26, 46);">在聊 LLM 怎么写代码之前，你得先搞清楚它到底是什么。</font>

### <font style="color:rgb(15, 23, 42);">1.1 一句话定义</font>
**<font style="color:rgb(15, 23, 42);">大语言模型（Large Language Model，简称 LLM）是一种基于深度学习的人工智能系统，通过在海量文本数据上训练，学会了理解和生成人类语言——包括编程语言。</font>**

<font style="color:rgb(26, 26, 46);">但这句话太学术了。说人话就是：</font><font style="color:rgb(26, 26, 46);">它的本质是一个超大规模的"下一个词预测器"——给定前文，预测下一个最可能出现的 Token。</font>

<font style="color:rgb(26, 26, 46);">就像你手机输入法会建议”下一个词”，但 LLM 能补全整篇文章、整段代码。更稳妥地说，LLM 的训练目标确实是根据前文预测下一个 Token；但在大规模训练、表示学习和后续对齐之后，它会表现出一定的语义建模、模式归纳与任务执行能力。它不是像人类那样稳定地“理解”你的真实意图，但也不只是毫无结构地乱猜。  </font>

<font style="color:rgb(26, 26, 46);">说白了，</font>**<font style="color:rgb(15, 23, 42);">LLM 会写代码，不是因为它像人类程序员那样理解业务，而是因为它极度擅长续写模式</font>**<font style="color:rgb(26, 26, 46);">。这也是它厉害和危险的地方：模式像的时候，它写得很顺；一旦你的业务规则、内部约束、最新 SDK 文档没喂给它，它就很可能一本正经地胡说。</font>

<font style="color:rgb(26, 26, 46);">你现在每天感受到的“AI 真会写代码啊”，底层其实不是“理解”，而是“高密度模式拟合 + 上下文条件生成”。</font>

<font style="color:rgb(26, 26, 46);">讲到这儿，很多人其实已经隐约明白了：原来 AI 写代码这事儿，核心不只是模型强不强，还包括你给它什么上下文、你怎么约束它、你有没有验证它。</font>

### <font style="color:rgb(15, 23, 42);">1.2 三个生活类比，秒懂 LLM</font>
<font style="color:rgb(26, 26, 46);">如果觉得"下一个词预测器"还是太抽象，试试这三个类比：</font>

| **<font style="color:rgb(15, 23, 42);">类比</font>** | **<font style="color:rgb(15, 23, 42);">怎么理解</font>** | **<font style="color:rgb(15, 23, 42);">关键洞察</font>** |
| :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">📱</font>****<font style="color:rgb(15, 23, 42);"> 超级自动补全</font>** | <font style="color:rgb(26, 26, 46);">就像手机输入法的"下一个词建议"，但 LLM 能补全整篇文章、整段代码</font> | <font style="color:rgb(26, 26, 46);">本质是预测，不是理解</font> |
| **<font style="color:rgb(15, 23, 42);">🦜</font>****<font style="color:rgb(15, 23, 42);"> 读过万卷书的"鹦鹉"</font>** | <font style="color:rgb(26, 26, 46);">它能模仿书中的语言模式来回答问题，但并不真正"理解"含义</font> | <font style="color:rgb(26, 26, 46);">会说不等于懂</font> |
| **<font style="color:rgb(15, 23, 42);">📚</font>****<font style="color:rgb(15, 23, 42);"> 概率版的全知图书馆</font>** | <font style="color:rgb(26, 26, 46);">它记住了海量文本中的统计规律，但回答基于概率而非推理</font> | <font style="color:rgb(26, 26, 46);">概率高 ≠ 事实对</font> |


### <font style="color:rgb(15, 23, 42);">1.3 LLM 能做什么？不能做什么？</font>
<font style="color:rgb(26, 26, 46);">知道了 LLM 的本质，你就不会对它抱有不切实际的期望。来看看它的能力边界：</font>

| **<font style="color:rgb(15, 23, 42);">✅</font>****<font style="color:rgb(15, 23, 42);"> LLM 能做什么</font>** | **<font style="color:rgb(15, 23, 42);">❌</font>****<font style="color:rgb(15, 23, 42);"> LLM 不能做什么</font>** |
| :--- | :--- |
| <font style="color:rgb(26, 26, 46);">📝</font><font style="color:rgb(26, 26, 46);"> 文本生成：写文章、写邮件、写代码、写文档</font> | <font style="color:rgb(26, 26, 46);">🕐</font><font style="color:rgb(26, 26, 46);"> 访问实时信息（除非联网工具辅助）</font> |
| <font style="color:rgb(26, 26, 46);">📖</font><font style="color:rgb(26, 26, 46);"> 文本理解：摘要、翻译、问答、分类</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 保证输出的事实准确性（幻觉问题）</font> |
| <font style="color:rgb(26, 26, 46);">💻</font><font style="color:rgb(26, 26, 46);"> 代码相关：补全、解释、Bug 修复、重构、测试生成</font> | <font style="color:rgb(26, 26, 46);">⚙️</font><font style="color:rgb(26, 26, 46);"> 执行代码或操作文件（除非接入工具）</font> |
| <font style="color:rgb(26, 26, 46);">🧠</font><font style="color:rgb(26, 26, 46);"> 推理与规划：数学推理、逻辑分析、任务拆解</font> | <font style="color:rgb(26, 26, 46);">🏢</font><font style="color:rgb(26, 26, 46);"> 真正"理解"业务上下文和隐含规则</font> |
| <font style="color:rgb(26, 26, 46);">🔧</font><font style="color:rgb(26, 26, 46);"> 工具调用：搜索网页、执行代码、操作文件、调用 API</font> | <font style="color:rgb(26, 26, 46);">👤</font><font style="color:rgb(26, 26, 46);"> 替代人类的判断力和责任</font> |


### <font style="color:rgb(15, 23, 42);">1.4 LLM 与传统程序的本质区别</font>
<font style="color:rgb(26, 26, 46);">这是最需要理解的一点。LLM 和你平时写的程序，根本不是一类东西：</font>

| **<font style="color:rgb(15, 23, 42);">维度</font>** | **<font style="color:rgb(15, 23, 42);">传统程序</font>** | **<font style="color:rgb(15, 23, 42);">LLM</font>** |
| :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">确定性</font>** | <font style="color:rgb(26, 26, 46);">相同输入永远产生相同输出</font> | <font style="color:rgb(26, 26, 46);">相同输入可能产生不同输出（受 Temperature、采样策略影响）</font> |
| **<font style="color:rgb(15, 23, 42);">规则来源</font>** | <font style="color:rgb(26, 26, 46);">规则由人编写</font> | <font style="color:rgb(26, 26, 46);">规则从数据中学习，隐含在千亿参数中</font> |
| **<font style="color:rgb(15, 23, 42);">可解释性</font>** | <font style="color:rgb(26, 26, 46);">可解释、可调试</font> | <font style="color:rgb(26, 26, 46);">黑盒模型，难以精确解释为何产生某个输出</font> |
| **<font style="color:rgb(15, 23, 42);">错误类型</font>** | <font style="color:rgb(26, 26, 46);">Bug（逻辑错误）</font> | <font style="color:rgb(26, 26, 46);">幻觉（编造看似合理但实际错误的内容）</font> |
| **<font style="color:rgb(15, 23, 42);">修复方式</font>** | <font style="color:rgb(26, 26, 46);">改代码</font> | <font style="color:rgb(26, 26, 46);">改 Prompt / 换模型 / 给更多上下文</font> |


**<font style="color:rgb(15, 23, 42);">记住这个核心区别：传统程序是"确定性"的，LLM 是"概率性"的。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">这就是为什么你不能像信任一个排序函数那样信任 AI 的输出——它每次给你的答案可能不一样。</font>

### <font style="color:rgb(15, 23, 42);">1.5 关键术语速查</font>
<font style="color:rgb(26, 26, 46);">后面会反复提到这些术语，先混个脸熟：</font>

| **<font style="color:rgb(15, 23, 42);">术语</font>** | **<font style="color:rgb(15, 23, 42);">含义</font>** | **<font style="color:rgb(15, 23, 42);">类比</font>** |
| :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">Parameter（参数）</font>** | <font style="color:rgb(26, 26, 46);">模型内部的"旋钮"，训练过程自动调整</font> | <font style="color:rgb(26, 26, 46);">大脑中的突触连接</font> |
| **<font style="color:rgb(15, 23, 42);">Token</font>** | <font style="color:rgb(26, 26, 46);">模型处理文本的最小单位</font> | <font style="color:rgb(26, 26, 46);">中文约 1 字 = 1-1.5 Token</font> |
| **<font style="color:rgb(15, 23, 42);">Context Window</font>** | <font style="color:rgb(26, 26, 46);">模型单次可读写的最大 Token 数</font> | <font style="color:rgb(26, 26, 46);">一次能看多长的"白板"</font> |
| **<font style="color:rgb(15, 23, 42);">Inference（推理）</font>** | <font style="color:rgb(26, 26, 46);">模型根据输入生成输出的过程</font> | <font style="color:rgb(26, 26, 46);">学生根据题目写答案</font> |
| **<font style="color:rgb(15, 23, 42);">Fine-tuning（微调）</font>** | <font style="color:rgb(26, 26, 46);">在预训练基础上用小数据集继续训练</font> | <font style="color:rgb(26, 26, 46);">大学生选专业深造</font> |
| **<font style="color:rgb(15, 23, 42);">Hallucination（幻觉）</font>** | <font style="color:rgb(26, 26, 46);">模型编造看似合理但实际错误的内容</font> | <font style="color:rgb(26, 26, 46);">学生"一本正经地胡说八道"</font> |


### **<font style="color:rgb(15,23,42);">1.6 为什么今天的 LLM 不只是“会续写”：训练与对齐 </font>**
<font style="color:rgb(26,26,46);">如果只说“LLM 是下一个 Token 预测器”，容易让人误以为它只是一个更大的自动补全器。这个说法抓住了训练目标，但没把今天模型的真实工程形态讲完整。 </font>

<font style="color:rgb(26,26,46);">更完整的理解是：</font>**<font style="color:rgb(26,26,46);">预训练</font>**<font style="color:rgb(26,26,46);">让模型学会语言和代码中的统计规律；</font>**<font style="color:rgb(26,26,46);">指令微调（SFT） </font>**<font style="color:rgb(26,26,46);">让它更会按要求回答；</font>**<font style="color:rgb(26,26,46);">偏好对齐（如 RLHF、DPO）</font>**<font style="color:rgb(26,26,46);">让它更符合人类偏好与安全要 求；而工具使用训练、代码专项训练、多轮任务数据，又进一步强化了它在真实产品中的表现。 </font>

<font style="color:rgb(26,26,46);">所以今天你看到的聊天模型、编码模型、推理模型，不只是“会续写”这么简单， 而是“预训练 + 对齐 + 工具链 + 产品约束”共同作用的结果。把这一层补上，后面再看代码生成、上下文窗口、模型选型，你就不会把“模型能力”和“系统能力”混成一回事。</font>

## <font style="color:rgb(15, 23, 42);">二、一图看懂：LLM 吐出代码的完整流水线</font>
<font style="color:rgb(26, 26, 46);">知道了 LLM 是什么，接下来我们看一个最关键的问题：</font>**<font style="color:rgb(15, 23, 42);">当你敲下一行 Prompt，到 AI 吐出代码，中间到底发生了什么？</font>**

<font style="color:rgb(26, 26, 46);">理解这条流水线，你就能精准定位问题出在哪个环节——是输入不够好？还是模型没理解？还是输出有幻觉？</font>

<!-- 这是一张图片，ocr 内容为：输入阶段 给得越清楚, 我要一个 输出越稳 用户登录接口 需求/PROMPT 项目上下文 规则约束 模型内部 ATTENTION找重点 逐 TOKEN  生成 TOKEN 化 000000.. 00000 预测 上下文 关联 输出与闭环 读文件 读文件 跑测试 跑测试 看报错 继续修正 继续修正 工具调用 代码/JSON/文本 看报错 很多问题不在模型笨,而在输入和上下文不完整.! -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776993823910-387218ae-793b-4093-a247-d4eb2cfc084e.png)

<font style="color:rgb(26, 26, 46);">这个流程里最容易被忽略的，不是模型本身，而是最前面的两件事：</font>**<font style="color:rgb(15, 23, 42);">你到底给了什么目标</font>**<font style="color:rgb(26, 26, 46);">，以及</font>**<font style="color:rgb(15, 23, 42);">你到底给了多少靠谱上下文</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">你给一句“帮我加个登录功能”，和你给一句“用 Next.js App Router + NextAuth 实现邮箱密码登录，禁止改 API 签名，补 3 个边界测试”，后面整个生成链条已经不是一个难度了。</font>

<font style="color:rgb(26, 26, 46);">你也别小看“规则文件”和“上下文供给”。很多时候模型不是不会，而是你没把它放到“能做对”的位置上。比如你只给它一段报错，不给调用链；只给它局部组件，不给状态来源；只给它旧文档，不给新版 SDK。那它不瞎猜才怪。</font>

:::danger
**<font style="color:rgb(26, 26, 46);">❌</font>****<font style="color:rgb(26, 26, 46);"> 一个经典误区</font>**

<font style="color:rgb(26, 26, 46);">很多人把“模型效果差”直接归因到“模型笨”。真相往往是：你给了一个半瞎的任务定义，再让它在半瞎的上下文里硬猜。</font>

:::

<font style="color:rgb(26, 26, 46);">走到流水线中间，模型会先把输入切成 Token，再通过注意力机制在整段上下文里找重点，然后一小步一小步预测下一个 Token。到了这儿，它生成的已经不只是文本了，也可能是 JSON、代码、SQL，甚至是一个工具调用请求。</font>

<font style="color:rgb(26, 26, 46);">如果它接的是带工具的 Agent 系统，这事儿还会继续：它会去读文件、跑测试、看报错，再把这些新结果重新塞回上下文里，继续下一轮生成。所以你现在看到很多 IDE Agent 很像“会自己干活”，本质上就是这条循环被接长了。</font>

<font style="color:rgb(26, 26, 46);">聊到这里，下一步就该拆最容易让人误会的一个词了：</font>**<font style="color:rgb(15, 23, 42);">大模型为什么叫“大”？</font>**<font style="color:rgb(26, 26, 46);">很多人第一反应就是“参数多”。这当然没错，但只说这一层，远远不够。</font>

## <font style="color:rgb(15, 23, 42);">三、大模型凭什么叫"大"？</font>
<font style="color:rgb(26, 26, 46);">你可能好奇：为什么叫"大"语言模型？小模型不行吗？</font>

<font style="color:rgb(26, 26, 46);">答案是：</font>**<font style="color:rgb(15, 23, 42);">"大"不只是形容词，而是质变的起点。</font>**<font style="color:rgb(26, 26, 46);"> 大模型之所以叫"大"，是因为它在四个维度上都大到了让人震撼的程度。</font><font style="color:rgb(26, 26, 46);">你如果只把“大模型”理解成“模型文件更大”“参数更多”，那其实只看到了表层。参数量确实是最直观的一层，但它不是全部。</font>

<!-- 这是一张图片，ocr 内容为：4个"大 OO 令 000 参数规模大 上下文窗口大 训练数据大 工程系统也大 大带来的质变 大土无敌 指令遵循 代码生成 推理增强 少样本学习 大模型 小/中/大模型对比 中模型 小模型 强/贵/复杂任务 快/便宜/本地 平衡/日常开发 女 贵,不一定最适合. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776993864669-d02363cf-5d48-4a59-9157-15a346a40e97.png)

### <font style="color:rgb(26, 26, 46);">3.1、大模型的4个“大”</font>
### <!-- 这是一张图片，ocr 内容为："大模型"的4个"大" 参数规模大 训练数据大 上下文窗口大 见过更多语言和代码 能表示更复杂模式 一次能读更长输入 工程系统也大 训练集清洗,分布式训练,推理服务,缓存,对齐,审计,全都重 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776417505801-b86cd667-e244-4a24-888c-ae30d34aa22c.png)
<font style="color:rgb(26, 26, 46);">这 4 个“大”里，最容易被外行忽略的是最后那个：</font>**<font style="color:rgb(15, 23, 42);">工程系统也大</font>**<font style="color:rgb(26, 26, 46);">。因为一个能稳定服务几百万用户的大模型，不只是一个 checkpoint 文件那么简单，它背后还站着数据清洗、分布式训练、推理调度、缓存、对齐、安全策略、工具链集成这些极其重的工程体系。</font>

<font style="color:rgb(26, 26, 46);">参数越多，模型理论上能表示的模式越复杂；数据越多，它见过的语言、代码、框架和错误修复样本就越丰富；上下文窗口越大，它单次请求里能读进去的材料就越多；工程系统越重，它越可能在真实产品里稳定跑起来。</font>

<font style="color:rgb(26, 26, 46);">但别高兴太早，</font>**<font style="color:rgb(15, 23, 42);">大不等于无敌</font>**<font style="color:rgb(26, 26, 46);">。这句话你一定得记住。模型大了，边际收益会递减；上下文大了，不代表它就真的理解得更稳；最贵的模型，也一样可能在错误上下文里非常自信地说错话。</font>

:::warning
**<font style="color:rgb(26, 26, 46);">⚠️</font>****<font style="color:rgb(26, 26, 46);"> 别把“贵”误当“对”</font>**

<font style="color:rgb(26, 26, 46);">很多团队一上来就默认“最强模型全包”，结果是简单任务也烧大模型，复杂任务仍然翻车。问题不在预算不够，而在没有任务分层意识。</font>

:::

### <font style="color:rgb(15, 23, 42);">3.2 "大"带来了什么质变？</font>
<font style="color:rgb(26, 26, 46);">模型不是"大"了就一定好，但"大"到一定程度，会出现一种神奇的现象——</font>**<font style="color:rgb(15, 23, 42);">涌现能力（Emergent Abilities）</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">什么是涌现？简单说就是：</font><font style="color:rgb(26, 26, 46);">小模型做不到、大模型突然能做到的能力。</font><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">就像水温到 100°C 突然沸腾——不是线性变热，而是质变。</font>

<font style="color:rgb(26, 26, 46);">典型的涌现能力包括：</font>

+ <font style="color:rgb(26, 26, 46);">🧠</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">少样本学习</font>**<font style="color:rgb(26, 26, 46);">：给 2-3 个例子就能学会新任务</font>
+ <font style="color:rgb(26, 26, 46);">🔗</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">思维链推理</font>**<font style="color:rgb(26, 26, 46);">：能一步步推理复杂问题</font>
+ <font style="color:rgb(26, 26, 46);">💻</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">代码生成</font>**<font style="color:rgb(26, 26, 46);">：能写出完整的功能代码</font>
+ <font style="color:rgb(26, 26, 46);">📋</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">指令遵循</font>**<font style="color:rgb(26, 26, 46);">：能精确遵守复杂的格式要求</font>

<font style="color:rgb(26,26,46);">关键洞察：这些能力不是被”编程”进去的，而是随着模型规模、数据质量、训练方法和对齐方式提升，逐步表现出更强的综合能力。工程上，人们常把这种非线性增强概括为“涌现”，但它并没有一个适用于所有模型的固定参数门槛。</font>

<font style="color:rgb(26, 26, 46);">另一个质变是</font>**<font style="color:rgb(15, 23, 42);">上下文学习（In-Context Learning）</font>**<font style="color:rgb(26, 26, 46);">——不需要重新训练模型，只需在 Prompt 中给出示例，模型就能学会新任务。这就是 Vibe Coding 的技术基础：</font>**<font style="color:rgb(15, 23, 42);">用自然语言"教"模型写代码。</font>**

### <font style="color:rgb(15, 23, 42);">3.3 小模型 vs 大模型：实用对比</font>
| **维度** | **小模型（<10B）** | **中模型（10B-100B）** | **大模型（>100B）** |
| :--- | :--- | :--- | :--- |
| **部署方式** | 通常可本地运行 | 一般需要中端服务器 | 常见部署方式是云端 API 或高端集群 |
| **响应速度** | 通常较快（常见为亚秒级） | 一般较快（常见为百毫秒到数秒） | 通常更慢（常见为秒级） |
| **代码能力** | 通常更适合简单补全 | 一般可胜任功能开发、重构 | 通常更适合架构设计、复杂 Debug |
| **成本** | 通常成本一般成本可控 | 一般成本可控 | 通常成本更高 |
| **代表模型** | Phi-3, Qwen2-7B | Llama 3 70B, Mixtral | GPT-5.4, Claude 4.6 |


<font style="color:rgb(26, 26, 46);">这个时候再往前走一步，你会发现另一个高频误解：很多人把所有模型都当成同一种东西。其实不是。聊天模型、推理模型、代码模型、Embedding 模型、工具型模型，干的活根本不是一回事。</font>

## <font style="color:rgb(15, 23, 42);">四、大模型的种类：别把所有模型都当成一个桶</font>
<font style="color:rgb(26, 26, 46);">很多人以为"大模型"就是一个东西——其实不然。不同架构、不同训练方式、不同模态的模型，行为差异巨大。选错模型，就像用自行车跑高速——不是车不好，是用错了地方。</font>  
 <!-- 这是一张图片，ocr 内容为：模型全景图 按架构分类 2 按任务定位 按训练方式 大模型 SSM MOE DENSE 基座模型 会续写 000000: O 指令模型 更会听话 O, 通用对话 推理模型,编码模型 推理模型 更会分析 更懂 微调模型 EMBEDDING 垂直领域 多模态模型 全部激活部分专家 长序列友好 模型 食 食任务不同,模型不同. 别用错工具. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776993903325-8424f66b-ec60-4889-97da-43df233c9e31.png)

<font style="color:rgb(26, 26, 46);">最常见的分类误伤，发生在下面两个地方。</font>

<font style="color:rgb(26, 26, 46);">一个是把 </font>**<font style="color:rgb(15, 23, 42);">Embedding 模型</font>**<font style="color:rgb(26, 26, 46);"> 当成聊天模型。Embedding 模型本质上不是拿来“回答问题”的，而是拿来把文本变成向量，方便做检索、聚类和相似度匹配。OpenAI 的 Embeddings 文档就很明确：它的作用是把文本编码成向量，用于搜索、聚类、推荐、分类这些场景。</font>

<font style="color:rgb(26, 26, 46);">另一个，是把</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">推理模型</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">和</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">编码模型</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">混为一谈。推理模型更擅长方案分析、约束权衡、长链路定位；编码模型更擅长把模式写出来、补全出来、重构出来。你让推理模型干所有脏活累活，成本会炸；你让偏编码的模型去做复杂架构权衡，它也容易一本正经地拍脑袋。</font>

| <font style="color:rgb(26, 26, 46);">任务</font> | <font style="color:rgb(26, 26, 46);">更适合的模型类型</font> | <font style="color:rgb(26, 26, 46);">原因</font> |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">批量格式转换</font> | <font style="color:rgb(26, 26, 46);">小模型 / 编码模型</font> | <font style="color:rgb(26, 26, 46);">模式稳定，没必要烧大模型</font> |
| <font style="color:rgb(26, 26, 46);">跨文件重构</font> | <font style="color:rgb(26, 26, 46);">强编码 + 强上下文模型</font> | <font style="color:rgb(26, 26, 46);">需要更稳的代码理解和执行</font> |
| <font style="color:rgb(26, 26, 46);">复杂根因分析</font> | <font style="color:rgb(26, 26, 46);">推理模型</font> | <font style="color:rgb(26, 26, 46);">需要多步分析和排除假设</font> |
| <font style="color:rgb(26, 26, 46);">RAG 检索</font> | <font style="color:rgb(26, 26, 46);">Embedding + 主模型</font> | <font style="color:rgb(26, 26, 46);">检索和生成是两件事</font> |
| <font style="color:rgb(26, 26, 46);">看设计稿 / 截图</font> | <font style="color:rgb(26, 26, 46);">多模态模型</font> | <font style="color:rgb(26, 26, 46);">要先看懂图，再谈生成代码</font> |


### <font style="color:rgb(15, 23, 42);">4.1 按架构分类：Dense vs MoE vs SSM</font>
| **<font style="color:rgb(15, 23, 42);">架构</font>** | **<font style="color:rgb(15, 23, 42);">工作方式</font>** | **<font style="color:rgb(15, 23, 42);">代表模型</font>** | **<font style="color:rgb(15, 23, 42);">优缺点</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">Dense Transformer</font>** | <font style="color:rgb(26, 26, 46);">所有参数在每次推理时都被激活</font> | <font style="color:rgb(26, 26, 46);">Claude 3.5 Sonnet, Llama 3 405B</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 推理质量高 </font><font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 计算成本大</font> |
| **<font style="color:rgb(15, 23, 42);">MoE（混合专家）</font>** | <font style="color:rgb(26, 26, 46);">每次推理只激活部分"专家"参数（通常 2/8）</font> | <font style="color:rgb(26, 26, 46);">GPT-4, Mixtral 8x7B, DeepSeek-V3</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 性价比高 </font><font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 总参数量大</font> |
| **<font style="color:rgb(15, 23, 42);">SSM（状态空间模型）</font>** | <font style="color:rgb(26, 26, 46);">线性复杂度，适合超长序列</font> | <font style="color:rgb(26, 26, 46);">Mamba, Jamba</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 推理快 </font><font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 代码能力仍在验证</font> |


<font style="color:rgb(26, 26, 46);">直觉类比：MoE 就像一个公司有 8 个部门，每次任务只派 2 个部门参与——总人手多，但每次只动用一部分，省钱又高效。</font>

### <font style="color:rgb(15, 23, 42);">4.2 按训练方式分类：基座 vs 指令 vs 推理 vs 微调</font>
<font style="color:rgb(26, 26, 46);">这是对你最有影响的分类维度——因为</font>**<font style="color:rgb(15, 23, 42);">你日常用的都是指令模型或推理模型</font>**<font style="color:rgb(26, 26, 46);">，基座模型不适合直接对话。</font>

| **<font style="color:rgb(15, 23, 42);">类型</font>** | **<font style="color:rgb(15, 23, 42);">行为特点</font>** | **<font style="color:rgb(15, 23, 42);">代表</font>** | **<font style="color:rgb(15, 23, 42);">用途</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">基座模型</font>** | <font style="color:rgb(26, 26, 46);">续写文本，不一定会"听指令"</font> | <font style="color:rgb(26, 26, 46);">Llama 3 Base, Qwen2 Base</font> | <font style="color:rgb(26, 26, 46);">微调的起点，不适合直接用</font> |
| **<font style="color:rgb(15, 23, 42);">指令模型</font>** | <font style="color:rgb(26, 26, 46);">能听懂指令、以对话形式交互</font> | <font style="color:rgb(26, 26, 46);">GPT-5.4, Claude 4.6</font> | <font style="color:rgb(26, 26, 46);">日常对话、代码生成</font> |
| **<font style="color:rgb(15, 23, 42);">推理模型</font>** | <font style="color:rgb(26, 26, 46);">输出前进行内部推理，慢但准</font> | <font style="color:rgb(26, 26, 46);">o1/o3, Claude 4.6 Extended Thinking</font> | <font style="color:rgb(26, 26, 46);">复杂逻辑、架构设计</font> |
| **<font style="color:rgb(15, 23, 42);">微调模型</font>** | <font style="color:rgb(26, 26, 46);">在特定领域表现更好</font> | <font style="color:rgb(26, 26, 46);">CodeLlama, MedPaLM</font> | <font style="color:rgb(26, 26, 46);">垂直领域专业化</font> |


:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 推理模型的代价</font>**

<font style="color:rgb(26, 26, 46);">推理模型（o1/o3/Claude 4.6 Extended Thinking）在输出前会进行内部"思考"，准确率大幅提升，但代价是</font>**<font style="color:rgb(15, 23, 42);">更慢（思考时间 10-60 秒）、更贵（Token 消耗 3-10 倍）</font>**<font style="color:rgb(26, 26, 46);">。传统模型像"脱口而出"，推理模型像"打草稿再回答"。</font>

:::

<font style="color:rgb(26, 26, 46);">模型分类一旦想清楚，后面很多选型争论会立刻降温。但分类再清楚，也还没触到底。真正的底层，是它到底在“算”什么。Attention、Embedding、Token、Next Token Prediction 这些词如果一直是糊的，你后面所有判断都会悬空。</font>

## <font style="color:rgb(26, 26, 46);">五、</font><font style="color:rgb(15, 23, 42);">LLM 究竟在计算什么？</font>
<font style="color:rgb(26, 26, 46);">先来一个生活类比。你可以把模型想成一个非常非常厉害的“填空高手”。它手上不是一本标准答案，而是看过海量语料后形成的一种直觉：</font>**<font style="color:rgb(15, 23, 42);">在当前上下文里，什么东西最可能接在后面。</font>**

<font style="color:rgb(26, 26, 46);">这个“最可能接在后面”，就是所谓的 </font>**<font style="color:rgb(15, 23, 42);">Next Token Prediction</font>**<font style="color:rgb(26, 26, 46);">。注意，它预测的不是“下一个单词”这么简单，而是“下一个 Token”。</font>

<!-- 这是一张图片，ocr 内容为：2 EMBEDDING TOKENIZATION 天气 登录 向量空间 认证 切词 写一个 AUTHENTICATE 写一个 排序函数 排序 函数 <EOS> 足球 苹果 5346 8921 2 1012 276 将文本切词为离散的TOKEN单 将每个TOKEN映射为向量,在语义空间中表示 N单位 ATTENTION NEXT-TOKEN PREDICTION 下一个TOKEN 逐步生成 建立关联 关注重点 D 上下文 DEF I SORT 预测 日 GD 上下文 DEF SORT 预测 写一个 排序 升序 进行 函数 数组 对 DOD DEF 上下文 SORT 预测 DEF 上下文 根据上下文,关注与当前相关的关键 TOKEN, SORT 预测 建立全局关联 基于已生成的内容,逐步预测并生成下一个TOKEN 本质:基于上下文,预测最可能的下一个' TOKEN -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776994135805-56eb1793-8918-40a8-9f05-a89ab3826354.png)

<font style="color:rgb(26, 26, 46);">我们从更底层看一下第二章中的流水线，这样能更容易理解LLM的运行机制</font>

<!-- 这是一张图片，ocr 内容为：用户输入 3 EMBEDDING TOKENIZATION TRANSFORMER 编码 [写,一个,排序,面数] 写一个排序函数 [0.12-0.34,0.56,-] SELF-ATTENTION 计算关联 把人类活言切成碎片 TOKAN  高维向量 模型"理解一你的意图 PRCMPT 就是"订单" I 逐TOKEN 生成 流水线中的关键瓶颈 DEFBUBBLE-SORT-( 输入质量差输出信离预期 一个字一个字地叶出来 TOKEN限制一信息被战断 注意力稀释-中间信息丢失 ?采样随机性不可复现 解码输出 幻觉-绩造不存在的API TOKEN 文本 DEF BUBBLESORT(ARM): 圆跳过市查-BUG上线 后处理 格式化,语法检查,工具调用解析 用户审查:人类是最终守门员 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776842126734-fbfc7286-f6f7-4e27-832c-88147512b959.png)

**<font style="color:rgb(15, 23, 42);">① 用户输入：你的 Prompt 就是"订单"</font>**

+ <font style="color:rgb(26, 26, 46);">输入质量决定输出质量（Garbage In, Garbage Out）</font>
+ <font style="color:rgb(26, 26, 46);">结构化 Prompt vs 随意聊天，效果差异巨大</font>
+ <font style="color:rgb(26, 26, 46);">上下文供给：你附带的文件、规则、历史对话都算输入</font>

**<font style="color:rgb(15, 23, 42);">② Tokenization：把人类语言切成模型能消化的碎片</font>**

+ <font style="color:rgb(26, 26, 46);">中文：1 个汉字 ≈ 1-2 个 Token</font>
+ <font style="color:rgb(26, 26, 46);">英文：1 个单词 ≈ 1-1.5 个 Token</font>
+ <font style="color:rgb(26, 26, 46);">代码：缩进、特殊符号（</font>`<font style="color:rgb(37, 99, 235);">=></font>`<font style="color:rgb(26, 26, 46);">,</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">::</font>`<font style="color:rgb(26, 26, 46);">,</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">===</font>`<font style="color:rgb(26, 26, 46);">）可能消耗多个 Token</font>

**<font style="color:rgb(15, 23, 42);">③ Embedding：把 Token 映射到"语义空间"</font>**

+ <font style="color:rgb(26, 26, 46);">每个 Token 被映射为一个高维向量（如 4096 维或 12288 维）</font>
+ <font style="color:rgb(26, 26, 46);">语义相近的词在向量空间中距离更近</font>
+ <font style="color:rgb(26, 26, 46);">这是 RAG（检索增强生成）的技术基础</font>

**<font style="color:rgb(15, 23, 42);">④ Transformer 编码：模型"理解"你的意图</font>**

+ <font style="color:rgb(26, 26, 46);">Self-Attention 机制：每个 Token 都可以"看到"所有其他 Token</font>
+ <font style="color:rgb(26, 26, 46);">多层堆叠：底层捕捉语法，高层捕捉语义</font>
+ <font style="color:rgb(26, 26, 46);">"Lost in the Middle"：中间位置的信息容易被忽略</font>

**<font style="color:rgb(15, 23, 42);">⑤ 逐 Token 生成：模型一个字一个字地"吐"出来</font>**

+ <font style="color:rgb(26, 26, 46);">本质：每步预测下一个最可能的 Token</font>
+ <font style="color:rgb(26, 26, 46);">Temperature：控制随机性（0 = 确定性，1 = 创造性）</font>
+ <font style="color:rgb(26, 26, 46);">为什么看起来"思考"了？因为统计模式足够强大</font>

**<font style="color:rgb(15, 23, 42);">⑥ 解码输出：从概率分布到可读文本</font>**

+ <font style="color:rgb(26, 26, 46);">选择策略：贪心（选最高概率）vs 采样（按概率随机选）</font>
+ <font style="color:rgb(26, 26, 46);">流式输出：逐 Token 返回，用户看到"打字机效果"</font>

**<font style="color:rgb(15, 23, 42);">⑦ 后处理：工具链的"最后一公里"</font>**

+ <font style="color:rgb(26, 26, 46);">语法高亮、格式化</font>
+ <font style="color:rgb(26, 26, 46);">工具调用解析（Function Calling 的结构化输出）</font>

**<font style="color:rgb(15, 23, 42);">⑧ 用户审查：人类是最终的质量守门员</font>**

+ <font style="color:rgb(26, 26, 46);">AI 输出默认是"草稿"，不是"成品"</font>
+ <font style="color:rgb(26, 26, 46);">必须经过：阅读理解 → 运行测试 → 安全审查 → 决定采纳</font>

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 流水线中的关键瓶颈</font>**

<font style="color:rgb(26, 26, 46);">每个环节都可能出问题。最常见的瓶颈是：</font>**<font style="color:rgb(15, 23, 42);">① 输入质量差</font>**<font style="color:rgb(26, 26, 46);">（模糊的 Prompt）、</font>**<font style="color:rgb(15, 23, 42);">④ 上下文不足</font>**<font style="color:rgb(26, 26, 46);">（缺少关键文件）、</font>**<font style="color:rgb(15, 23, 42);">⑤ 幻觉</font>**<font style="color:rgb(26, 26, 46);">（编造不存在的 API）。理解流水线，你就能精准定位问题出在哪。</font>

:::

### <font style="color:rgb(26, 26, 46);">5.1 模型眼中的世界：token</font>
<font style="color:rgb(26, 26, 46);">在模型眼里，你写的不是"代码"，而是一串 Token。Token 不是单词，也不是单个字符，而是"子词级别"的片段。</font>

```plain
英文："Hello world" → 约 2-3 个 Token
中文："你好世界" → 4 个 Token（一个字一个 Token）
代码："function getUser()" → 约 5-6 个 Token
```

<font style="color:rgb(26, 26, 46);">代码的 Token 切分有个特点：</font>**<font style="color:rgb(15, 23, 42);">缩进、特定语法符号（比如</font>****<font style="color:rgb(15, 23, 42);"> </font>**`**<font style="color:rgb(37, 99, 235);">=></font>**`**<font style="color:rgb(15, 23, 42);">、</font>**`**<font style="color:rgb(37, 99, 235);">::</font>**`**<font style="color:rgb(15, 23, 42);">）都容易被单独算成 Token</font>**<font style="color:rgb(26, 26, 46);">。这就是为什么 AI 有时候会把缩进搞错——因为在它的视角里，缩进符号和其他 Token 是平级的，没有"层级"的概念。</font>

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> Token 和你的钱包直接相关</font>**

<font style="color:rgb(26, 26, 46);">API 计费是按 Token 算的。一次典型的代码补全约 700 Token，一次 Agent 多文件修改约 8,000 Token，一次长上下文对话（50 轮）可能消耗 100,000+ Token。理解 Token 不只是技术好奇，而是省钱技能。</font>

:::

<font style="color:rgb(26, 26, 46);">再往里走，Token 会先被映射成向量。这一步你可以理解成：模型把人类看得懂的符号，翻译成自己能计算的数字坐标。语义相近的内容，通常会在这个高维空间里更靠近。Embedding 文档里也是这么定义的：嵌入向量会尽量保留内容和意义，相近内容在向量空间中也更近。</font>[<font style="color:rgb(37, 99, 235);">来源</font>](https://platform.openai.com/docs/guides/embeddings)

### 5.2 <font style="color:rgb(15, 23, 42);">把文字变成坐标：Embedding</font>
<font style="color:rgb(26, 26, 46);">如果说 Token 是模型的"字母表"，那 Embedding 就是它的"字典"。</font>

<font style="color:rgb(26, 26, 46);">Embedding 做的事情很简单：</font>**<font style="color:rgb(15, 23, 42);">把一段文字映射到一个高维向量空间</font>**<font style="color:rgb(26, 26, 46);">。说人话就是，给每段文字分配一个"坐标"，语义相近的文字坐标也相近。</font>

<font style="color:rgb(26, 26, 46);">这有什么用？比如你想在 10 万行代码里找到和当前需求最相关的函数——靠关键词匹配是做不到的（你搜"用户登录"，代码里可能写的是</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">authenticate()</font>`<font style="color:rgb(26, 26, 46);">）。但用 Embedding，模型能理解这两个词的语义是相近的，从而找到正确的函数。</font>

<font style="color:rgb(26, 26, 46);">这就是 </font>**<font style="color:rgb(15, 23, 42);">RAG（检索增强生成）</font>**<font style="color:rgb(26, 26, 46);"> 的基础。后面的章节会详细讲。</font>

<font style="color:rgb(26, 26, 46);">但这里有个很容易被忽略的事实：</font>**<font style="color:rgb(15, 23, 42);">Embedding 模型和聊天模型不是同一类模型。</font>**<font style="color:rgb(26, 26, 46);"> 你把一句话发给聊天模型，它会继续往下写；你把一句话发给 Embedding 模型，它通常只会回你一串数字，比如 </font>`<font style="color:rgb(37, 99, 235);">[0.018, -0.224, 0.731, ...]</font>`<font style="color:rgb(26, 26, 46);">。这串数字不能直接给人读，但特别适合让机器拿来做"相似度计算"。</font>

**<font style="color:rgb(15, 23, 42);background-color:rgb(236, 253, 245);">LLM 负责"说"，Embedding 模型负责"找"。</font>**<font style="color:rgb(26, 26, 46);background-color:rgb(236, 253, 245);"> 一个擅长生成答案，一个擅长先把最相关的上下文捞出来。</font>

#### <font style="color:rgb(26, 26, 46);">5.2.1 </font><font style="color:rgb(15, 23, 42);">Embedding 模型到底在输出什么？</font>
<font style="color:rgb(26, 26, 46);">它输出的是一个固定长度的向量。你可以把它理解成：模型把一段文本、代码、日志或者文档片段，压缩成了一组高维特征。这个特征不是人手工定义的，而是模型在训练时自己学出来的。</font>

<font style="color:rgb(26, 26, 46);">当两段内容语义接近时，它们在向量空间里的位置通常也更近。所以检索系统会用</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">余弦相似度</font>**<font style="color:rgb(26, 26, 46);">、点积或者欧氏距离，去比较"查询"和"候选内容"谁更像。不是逐字匹配，而是在比"意思像不像"。</font>

| **<font style="color:rgb(15, 23, 42);">维度</font>** | **<font style="color:rgb(15, 23, 42);">生成模型（LLM）</font>** | **<font style="color:rgb(15, 23, 42);">Embedding 模型</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">核心输出</font> | <font style="color:rgb(26, 26, 46);">自然语言、代码、结构化结果</font> | <font style="color:rgb(26, 26, 46);">向量表示</font> |
| <font style="color:rgb(26, 26, 46);">最擅长</font> | <font style="color:rgb(26, 26, 46);">回答、补全、解释、规划</font> | <font style="color:rgb(26, 26, 46);">检索、召回、聚类、相似度匹配</font> |
| <font style="color:rgb(26, 26, 46);">单独使用体验</font> | <font style="color:rgb(26, 26, 46);">可以直接对话</font> | <font style="color:rgb(26, 26, 46);">通常不能直接聊天，要配合向量库和 LLM</font> |
| <font style="color:rgb(26, 26, 46);">在 Vibe Coding 里的角色</font> | <font style="color:rgb(26, 26, 46);">写代码、改代码、解释代码</font> | <font style="color:rgb(26, 26, 46);">把相关代码、文档、报错经验先找出来</font> |


#### 5.2.2 <font style="color:rgb(15, 23, 42);">它在代码场景里是怎么工作的？</font>
<font style="color:rgb(26, 26, 46);">如果你做的是代码助手、团队知识库、仓库问答、自动上下文补全，典型链路一般是这样的：</font>

1. <font style="color:rgb(26, 26, 46);">先把仓库里的代码、文档、报错记录、设计说明切成一段段合理片段</font>
2. <font style="color:rgb(26, 26, 46);">用 Embedding 模型把这些片段都编码成向量</font>
3. <font style="color:rgb(26, 26, 46);">把向量和原文、文件路径、符号名等元数据一起存进向量数据库</font>
4. <font style="color:rgb(26, 26, 46);">用户提问时，再把问题也编码成向量</font>
5. <font style="color:rgb(26, 26, 46);">系统在向量库里找出最相近的 Top-K 片段</font>
6. <font style="color:rgb(26, 26, 46);">最后把这些片段塞回 LLM，让它在带上下文的前提下生成答案</font>

```plain
用户问题
  ↓
Embedding(问题)
  ↓
向量检索 Top-K
  ↓
相关代码 / 文档 / 日志片段
  ↓
LLM 结合上下文生成答案
```

<font style="color:rgb(26, 26, 46);">这也是为什么很多 AI 编程工具看起来像是"它知道整个项目"。很多时候不是它真的把整个仓库都记住了，而是系统在背后先用 Embedding 找相关内容，再把这些内容喂给 LLM。</font>

#### <font style="color:rgb(15, 23, 42);">5.2.3 为什么 Embedding 对代码检索特别重要？</font>
<font style="color:rgb(26, 26, 46);">因为代码世界里，同一个意思经常会有完全不同的写法。你搜"支付回调验签失败"，仓库里可能对应的是</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">verifySignature</font>`<font style="color:rgb(26, 26, 46);">、</font>`<font style="color:rgb(37, 99, 235);">webhookGuard</font>`<font style="color:rgb(26, 26, 46);">，甚至是一段写在测试和注释里的说明。纯关键词检索很容易漏，Embedding 更容易把这些"意思相近、写法不同"的东西连起来。</font>

<font style="color:rgb(26, 26, 46);">而且代码不是孤立的。高质量检索不只是找一个函数本身，还要把它的调用方、测试、README、错误日志、Issue 记录一起召回。</font>**<font style="color:rgb(15, 23, 42);">Embedding 真正的价值，不是帮你找到一行代码，而是帮你找到一组足够让 LLM 开始可靠推理的上下文。</font>**

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 三个常见误区</font>**

+ **<font style="color:rgb(15, 23, 42);">误区 1：Embedding 模型越强，回答就一定越准。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">不对。它只负责召回相关内容，最终答案还要看召回质量、上下文组织和 LLM 本身。</font>
+ **<font style="color:rgb(15, 23, 42);">误区 2：有了 Embedding，就不需要切分文档。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">不对。切分太大，噪声多；切分太碎，上下文断裂。函数级、类级、章节级通常比按字符硬切更稳。</font>
+ **<font style="color:rgb(15, 23, 42);">误区 3：向量相似就等于事实正确。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">也不对。相似度高只说明"像"，不说明"真"。过期文档、旧版本 API、错误示例一样可能被召回。</font>

:::

#### <font style="color:rgb(15, 23, 42);">5.2.4 真正在工程里要注意什么？</font>
<font style="color:rgb(26, 26, 46);">你如果后面要做自己的代码库问答系统，至少记住这四件事：</font>

+ **<font style="color:rgb(15, 23, 42);">切分要按语义结构来。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">优先按函数、类、模块、文档章节切，不要粗暴地每 1000 个字符硬切一次。</font>
+ **<font style="color:rgb(15, 23, 42);">元数据要保留全。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">文件路径、语言类型、仓库版本、符号名、更新时间，经常比正文还重要。</font>
+ **<font style="color:rgb(15, 23, 42);">检索后最好再重排。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">Embedding 擅长大范围召回，精排可以再交给 reranker 或 LLM 做二次筛选。</font>
+ **<font style="color:rgb(15, 23, 42);">Embedding 模型版本要稳定。</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">同一批数据混用不同向量空间，检索结果会漂，索引往往需要重建。</font>

:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> Embedding 的常见应用</font>**

+ <font style="color:rgb(26, 26, 46);">🔍</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">语义搜索</font>**<font style="color:rgb(26, 26, 46);">：用自然语言搜代码，而不是精确匹配</font>
+ <font style="color:rgb(26, 26, 46);">📋</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">文档去重</font>**<font style="color:rgb(26, 26, 46);">：找到语义重复的文档</font>
+ <font style="color:rgb(26, 26, 46);">📚</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">知识库检索</font>**<font style="color:rgb(26, 26, 46);">：RAG 的核心组件</font>
+ <font style="color:rgb(26, 26, 46);">🔗</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">代码相似性查找</font>**<font style="color:rgb(26, 26, 46);">：发现重复实现</font>

<font style="color:rgb(26, 26, 46);">常用模型：OpenAI text-embedding、Cohere Embed、Sentence Transformers</font>

:::

### <font style="color:rgb(26, 26, 46);">5.3 </font><font style="color:rgb(15, 23, 42);">模型的"关注力"：Attention</font>
<font style="color:rgb(26, 26, 46);">但光有向量还不够。因为“苹果 手机”里的“苹果”和“苹果 水果”里的“苹果”不是一回事。模型还得知道这些 Token 是按什么顺序出现的、它们彼此之间谁和谁更相关。这个时候，</font>**<font style="color:rgb(15, 23, 42);">Attention</font>**<font style="color:rgb(26, 26, 46);"> 上场了。</font>

<font style="color:rgb(26, 26, 46);">这是 Transformer 架构的核心。简单说：</font>**<font style="color:rgb(15, 23, 42);">模型在处理每个 Token 的时候，会"关注"输入中其他所有 Token，并计算它们之间的关联度。</font>**

<font style="color:rgb(26, 26, 46);">直觉理解就是——模型在读到某个词的时候，会回头看看前面哪些词跟它最有关。就像你在读代码的时候，看到一个变量名，会自动去找它在哪里定义的——Attention 机制就是在模拟这个过程。</font>

<!-- 这是一张图片，ocr 内容为：当前输出 输入上下文 ATTENTION 变量名 继续写代码 不是每句都平均看 函数定义 而是动态挑重点看 解释报错 谁和当前任务最相关 日志,注释,规则 调用工具 所以别再把ATTENTION理解成"模型真的懂了",它更像"当前这一刻最该看哪儿" -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776842345967-336c226e-3f1d-4e06-8a95-70afc6f998dd.png)

<font style="color:rgb(26, 26, 46);">Transformer 论文里讲得很直接：它提出了一种</font>**<font style="color:rgb(15, 23, 42);">完全基于注意力机制</font>**<font style="color:rgb(26, 26, 46);">的架构，不再依赖 RNN 那种强串行结构；而且自注意力层在长距离依赖上路径更短、并行性更强。论文表 1 还专门对比了不同层类型的复杂度和最大路径长度。</font>[<font style="color:rgb(37, 99, 235);">来源</font>](https://arxiv.org/abs/1706.03762)

<font style="color:rgb(26, 26, 46);">如果你愿意看一眼公式，缩放点积注意力长这样：</font>

```plain
Attention(Q, K, V) = softmax(QK^T / sqrt(dk)) V
```

<font style="color:rgb(26, 26, 46);">别被公式吓到。可以把它拆成人话：</font>

+ `<font style="color:rgb(26, 26, 46);">Q</font>`<font style="color:rgb(26, 26, 46);">：我现在想找什么</font>
+ `<font style="color:rgb(26, 26, 46);">K</font>`<font style="color:rgb(26, 26, 46);">：每个位置各自代表什么标签</font>
+ `<font style="color:rgb(26, 26, 46);">V</font>`<font style="color:rgb(26, 26, 46);">：每个位置真正带着什么内容</font>
+ `<font style="color:rgb(26, 26, 46);">softmax</font>`<font style="color:rgb(26, 26, 46);">：给所有候选相关性打分，最后变成权重</font>

<font style="color:rgb(26, 26, 46);">但这里有个巨坑，叫做</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">"Lost in the Middle"（中间迷失）</font>**<font style="color:rgb(26, 26, 46);">现象：</font>

:::danger
**<font style="color:rgb(239, 68, 68);">❌</font>****<font style="color:rgb(239, 68, 68);"> 长上下文的错觉</font>**

<font style="color:rgb(26, 26, 46);">模型号称支持 200K Token 的上下文，但你把 10 万行代码全塞进去，它反而会漏掉关键信息。因为</font>**<font style="color:rgb(15, 23, 42);">中间位置的信息最容易被忽略</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">就像你给一个人看一份 500 页的文档，他能记住开头和结尾，但中间的内容……大概率是模糊的。</font>

:::

<font style="color:rgb(26, 26, 46);">所以最佳实践是：</font>**<font style="color:rgb(15, 23, 42);">重要信息前置，关键约束重复强调。</font>**<font style="color:rgb(26, 26, 46);"> 别把最重要的业务规则藏在上下文的第 80% 位置，模型会"看不见"的。</font>

### <font style="color:rgb(15, 23, 42);">5.4 Next-Token Prediction：它不是在思考，是在猜</font>
<font style="color:rgb(26, 26, 46);">这是最需要理解的一点。</font>

<font style="color:rgb(26, 26, 46);">LLM 生成代码的本质是：</font>**<font style="color:rgb(15, 23, 42);">基于已经生成的内容，预测下一个最合适的 Token。</font>**

<font style="color:rgb(26, 26, 46);">它不是"思考完了整段代码再输出"，而是"猜一个 Token，输出，再猜下一个"。这就是为什么它是"概率生成器"而不是"确定性编译器"。</font>

<font style="color:rgb(26, 26, 46);">有两个参数控制它的"创造力"：</font>

| **<font style="color:rgb(15, 23, 42);">参数</font>** | **<font style="color:rgb(15, 23, 42);">作用</font>** | **<font style="color:rgb(15, 23, 42);">调低</font>** | **<font style="color:rgb(15, 23, 42);">调高</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">Temperature</font>** | <font style="color:rgb(26, 26, 46);">控制输出的确定性</font> | <font style="color:rgb(26, 26, 46);">更保守、更可预测</font> | <font style="color:rgb(26, 26, 46);">更有创意、更不稳定</font> |
| **<font style="color:rgb(15, 23, 42);">Top-p</font>** | <font style="color:rgb(26, 26, 46);">限制候选词范围</font> | <font style="color:rgb(26, 26, 46);">只选最高概率的词</font> | <font style="color:rgb(26, 26, 46);">允许更多候选词参与</font> |
| **<font style="color:rgb(15, 23, 42);">Top-k</font>** | <font style="color:rgb(26, 26, 46);">限制候选词数量</font> | <font style="color:rgb(26, 26, 46);">只从 top-k 个词中选</font> | <font style="color:rgb(26, 26, 46);">更多词参与竞争</font> |


<font style="color:rgb(26, 26, 46);">写代码的时候，Temperature 通常要调低（0.1-0.3），因为代码需要精确，不需要"创意"。写诗的时候才需要高 Temperature。</font>

<!-- 这是一张图片，ocr 内容为：工作原理:NEXT-TOKEN PREDICTION TRANSFORMER 编码 预测 下一个 TOKEN 输入上下文 ATTENTION+FFN 'USER "FUNCTION LOGIN( 循环:输出变成输入,继续预测下一个 不是思考完再写",而是猜一个,写一个,再猜下一个" 办关键参数 LOST IN THE MIDDLE TEMPERATURE:保守,高三创意 开头记得清楚 中间容易遗忘 TOP-P:限制候选词范围 写代码时 TEMPERATURE建议0.1-03 结层-记得清楚 -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776845007839-5c1c76a1-e86d-4f43-a356-383758474d24.png)

:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 核心洞察</font>**

<font style="color:rgb(26, 26, 46);">LLM 不是"理解"了代码再写，而是一个 Token 一个 Token 地猜。它之所以看起来"理解"了，是因为训练数据量够大，让它学会了代码中的统计模式。</font>

**<font style="color:rgb(15, 23, 42);">这意味着：它不会"反思"自己的输出是否正确。</font>**<font style="color:rgb(26, 26, 46);"> 它生成了一段有 Bug 的代码，不是因为它是笨蛋，而是因为在它看来，这段代码的 Token 序列在训练数据中出现过类似的模式。</font>

:::

<font style="color:rgb(26, 26, 46);">到这里，原理层的地基算是打下来了。下一步就该回答一个更现实的问题：这些能力不是天生就有的，那模型到底怎么被训练成今天这个样子的？这一步如果不讲清，很多人会把“预训练”“微调”“对齐”“工具调用”全混在一起。</font>

## <font style="color:rgb(26, 26, 46);">六、</font><font style="color:rgb(15, 23, 42);">大模型是怎么训练出来的？从海量数据到可对话、可编程</font>
<font style="color:rgb(26, 26, 46);">你可以把 LLM 的训练过程想成一个人从“读海量资料”到“学会按要求答题”，再到“学会别乱说话”，最后再到“学会用工具”的过程。顺序大致是这样的：</font>

<!-- 这是一张图片，ocr 内容为：1 预训练 2 指令微调SFT 中文 # 请回答这个问题 问答 学语言模式 海量文本 学会按要求回答 3 4 能力强化 偏好对齐RLHF/DPO 领域知识 回答A 代码 回答B 工具调用 //Y 夏 选专业深造 更符合人类偏好 更安全 会续写,只是起点;会对话,会编程,会配合工具,来自多阶段训练.. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776994176849-490f84ad-fdfb-425b-b4fc-5a83d270b60f.png)

### 6.1 <font style="color:rgb(15, 23, 42);"></font><font style="color:rgb(15, 23, 42);">阶段一：预训练 —— "读万卷书"</font>
<font style="color:rgb(26, 26, 46);">预训练阶段，模型做的事情只有一个：</font>**<font style="color:rgb(15, 23, 42);">预测下一个 Token。</font>**

<font style="color:rgb(26, 26, 46);">它"读"了什么？公开网页（Common Crawl，占比 60-70%）、书籍、学术论文——以及最重要的，</font>**<font style="color:rgb(15, 23, 42);">数十亿行 GitHub 公开代码</font>**<font style="color:rgb(26, 26, 46);">。规模是数百亿到数万亿 Token。</font>

<font style="color:rgb(26, 26, 46);">在这个阶段，模型学会了：</font>

+ <font style="color:rgb(26, 26, 46);">📐</font><font style="color:rgb(26, 26, 46);"> 语法规则（</font>`<font style="color:rgb(37, 99, 235);">if</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">后面要跟条件，</font>`<font style="color:rgb(37, 99, 235);">for</font>`<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">后面要循环）</font>
+ <font style="color:rgb(26, 26, 46);">🏗️</font><font style="color:rgb(26, 26, 46);"> 流行框架惯例（React 的组件写法、Express 的路由写法）</font>
+ <font style="color:rgb(26, 26, 46);">🧩</font><font style="color:rgb(26, 26, 46);"> 常见设计模式（Factory、Observer、Middleware 等）</font>

<font style="color:rgb(26, 26, 46);">对于代码能力来说，公开代码仓库特别关键。Codex 那篇经典论文就写得很直接：他们引入了一个在公开代码上微调的 GPT 模型，HumanEval 上 Codex 解出了</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">28.8%</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">的题，而 GPT-3 是</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">0%</font>**<font style="color:rgb(26, 26, 46);">，GPT-J 是</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">11.4%</font>**<font style="color:rgb(26, 26, 46);">。这说明高质量代码数据和代码定向训练，对“写代码”这件事影响非常大。</font>[<font style="color:rgb(37, 99, 235);">来源</font>](https://arxiv.org/abs/2107.03374)

| <font style="color:rgb(26, 26, 46);">指标</font> | <font style="color:rgb(26, 26, 46);">结果</font> | <font style="color:rgb(26, 26, 46);">说明</font> |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">Codex on HumanEval</font> | <font style="color:rgb(26, 26, 46);">28.8%</font> | <font style="color:rgb(26, 26, 46);">代码定向训练后，代码生成能力明显提升</font> |
| <font style="color:rgb(26, 26, 46);">GPT-3 on HumanEval</font> | <font style="color:rgb(26, 26, 46);">0%</font> | <font style="color:rgb(26, 26, 46);">同论文摘要给出的对照值</font> |
| <font style="color:rgb(26, 26, 46);">GPT-J on HumanEval</font> | <font style="color:rgb(26, 26, 46);">11.4%</font> | <font style="color:rgb(26, 26, 46);">说明不是“只要会语言就会写代码”</font> |


<font style="color:rgb(26, 26, 46);">这张表不是在说“某个模型永远更强”，而是在提醒你：</font>**<font style="color:rgb(15, 23, 42);">代码能力不是白送的，它和训练数据、任务形式、评测方式强相关</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">但这时候的模型是个"自由人"——你问它问题，它可能答非所问；你让它写代码，它可能给你写一首诗。因为它只学会了"语言的统计模式"，还没学会"听人说话"。</font>

<font style="color:rgb(26, 26, 46);">类比：一个读过万卷书但不会社交的"书呆子"。</font>

### <font style="color:rgb(26, 26, 46);">6.2 </font><font style="color:rgb(15, 23, 42);">阶段二：指令微调（SFT）—— "学会答题"</font>
<font style="color:rgb(26, 26, 46);">所以有了第二步：</font>**<font style="color:rgb(15, 23, 42);">指令微调（SFT - Supervised Fine-Tuning）</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">这一步用的是人工编写的高质量"指令-响应对"数据集。比如：</font>

```plain
指令："把这个 Python 函数改成异步版本"
响应：[正确的异步代码]

指令："解释这段代码的作用"
响应：[清晰的中文解释]
```

<font style="color:rgb(26, 26, 46);">这一步的目标很明确：</font>**<font style="color:rgb(15, 23, 42);">让模型学会"听指令"，而不是自由发挥。</font>**<font style="color:rgb(26, 26, 46);"> 你说"输出 JSON"，它就输出 JSON；你说"解释代码"，它就解释代码——而不是自作主张给你写首诗。</font><font style="color:rgb(26, 26, 46);"></font>

<font style="color:rgb(26, 26, 46);">但 SFT 有局限：数据质量和多样性决定上限，过度 SFT 会导致模型"死板"，丧失灵活性。</font>

<font style="color:rgb(26, 26, 46);">这也是 InstructGPT 论文最重要的洞察之一：</font>**<font style="color:rgb(15, 23, 42);">把模型做大，不会自动让它更擅长遵循用户指令</font>**<font style="color:rgb(26, 26, 46);">。论文里有一个非常炸裂的结果：在人工偏好评测里，</font>**<font style="color:rgb(15, 23, 42);">1.3B 的 InstructGPT 输出，居然比 175B 的 GPT-3 更受标注者偏好</font>**<font style="color:rgb(26, 26, 46);">，虽然参数量差了 100 倍。</font>[<font style="color:rgb(37, 99, 235);">来源</font>](https://arxiv.org/abs/2203.02155)

<font style="color:rgb(26, 26, 46);">这件事的含义特别大：</font>**<font style="color:rgb(15, 23, 42);">“更大”不自动等于“更好用”</font>**<font style="color:rgb(26, 26, 46);">。如果一个模型没有经过足够好的指令微调和对齐，它可能很有知识，但不一定很配合。</font>

### <font style="color:rgb(26, 26, 46);">6.3、</font><font style="color:rgb(15, 23, 42);">阶段三：偏好对齐（RLHF/DPO）—— "学会做人"</font>
<font style="color:rgb(26, 26, 46);">SFT 后的模型可能输出有害、不诚实、无用的内容。所以需要</font>**<font style="color:rgb(15, 23, 42);">偏好对齐</font>**<font style="color:rgb(26, 26, 46);">——让模型学习"什么样的回答人类更喜欢"。</font>

<font style="color:rgb(26, 26, 46);">对齐的目标三个 H：</font>**<font style="color:rgb(15, 23, 42);">Helpful（有用）、Honest（诚实）、Harmless（无害）</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">主要方法有三种：</font>

| **<font style="color:rgb(15, 23, 42);">方法</font>** | **<font style="color:rgb(15, 23, 42);">怎么做</font>** | **<font style="color:rgb(15, 23, 42);">优缺点</font>** |
| :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">RLHF</font>** | <font style="color:rgb(26, 26, 46);">人类排序 → 训练奖励模型 → 强化学习优化</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 效果好 </font><font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 流程复杂</font> |
| **<font style="color:rgb(15, 23, 42);">DPO</font>** | <font style="color:rgb(26, 26, 46);">跳过奖励模型，直接用偏好数据优化</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 更简单稳定 </font><font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 数据要求高</font> |
| **<font style="color:rgb(15, 23, 42);">RLAIF</font>** | <font style="color:rgb(26, 26, 46);">用另一个强模型代替人类标注员</font> | <font style="color:rgb(26, 26, 46);">✅</font><font style="color:rgb(26, 26, 46);"> 大规模低成本 </font><font style="color:rgb(26, 26, 46);">❌</font><font style="color:rgb(26, 26, 46);"> 可能引入偏见</font> |


<font style="color:rgb(26, 26, 46);">不同厂商的对齐策略不同，这直接影响了模型的行为风格。比如有的模型更"保守"（宁可不说也不能说错），有的更"积极"（先给了再说，对不对另说）。这种差异在代码场景中特别明显——</font>**<font style="color:rgb(15, 23, 42);">保守的模型遇到不确定的 API 会说"我不确定"，积极的模型会直接编一个看起来很像的。</font>**

<font style="color:rgb(26, 26, 46);">这一步对编程尤其重要，因为编程场景里最烦人的不是它不会，而是它“像会”。你让它输出 JSON，它少一个括号；你让它修 bug，它顺手改了无关模块；你让它查 SDK，它把别的版本的方法签名搬过来。对齐做得更好，模型通常会更保守、更愿意承认不确定、更愿意遵守约束。</font>

### <font style="color:rgb(26, 26, 46);">6.4 </font><font style="color:rgb(15, 23, 42);">阶段四：能力强化训练 —— "选专业深造"</font>
<font style="color:rgb(26, 26, 46);">这是 2025-2026 年最大的突破点。模型在基础能力之上，进行专项强化：</font>

+ **<font style="color:rgb(15, 23, 42);">代码能力强化</font>**<font style="color:rgb(26, 26, 46);">：用高质量代码数据继续训练，学习代码风格、调试技巧、测试编写</font>
+ **<font style="color:rgb(15, 23, 42);">推理能力强化</font>**<font style="color:rgb(26, 26, 46);">：思维链（CoT）强化，o1/o3/Claude 4.6 系列的特点——生成代码前进行复杂 Debug 分析和架构推演</font>
+ **<font style="color:rgb(15, 23, 42);">工具调用训练</font>**<font style="color:rgb(26, 26, 46);">：Function Calling / Tool Use——模型学会输出结构化的工具调用请求，而不是硬答。2025-2026 年，工具调用能力已经成为模型的核心竞争点。</font><font style="color:rgb(26, 26, 46);">这一步是 Vibe Coding 时代非常关键的分水岭。因为一个只能空想的模型，和一个会读文件、会跑测试、会调 API 的模型，完全不是一个物种。</font>
    - <font style="color:rgb(26, 26, 46);">工具调用训练的目标，就是让模型学会：</font>
        * <font style="color:rgb(26, 26, 46);">什么时候该去读文件，而不是瞎猜</font>
        * <font style="color:rgb(26, 26, 46);">什么时候该调用搜索或文档工具</font>
        * <font style="color:rgb(26, 26, 46);">什么时候应该返回结构化的工具调用请求</font>
        * <font style="color:rgb(26, 26, 46);">什么时候根据工具结果继续下一步</font>

<font style="color:rgb(26, 26, 46);">你今天在 IDE Agent 里看到的很多“像是在自己干活”的表现，本质上都来自这条链被训练得越来越顺了。</font>

:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 别什么都用推理模型</font>**

<font style="color:rgb(26, 26, 46);">如果你只是让 AI 补全一个 for 循环，用推理模型就像请一个诺贝尔奖得主帮你写购物清单——杀鸡用牛刀，又慢又贵。</font>

<font style="color:rgb(26, 26, 46);">推理模型的工作方式：传统模型"脱口而出"，推理模型"打草稿再回答"。代价是更慢（思考时间 10-60 秒）、更贵（Token 消耗 3-10 倍）。</font>

:::

<font style="color:rgb(26, 26, 46);">训练讲完，我们终于可以回到最关心的问题了：既然模型见了这么多代码、又会注意力、又做了对齐、还会调工具，那它为什么还是会翻车？这个地方，才是你真正该有边界感的地方。</font>

## <font style="color:rgb(15, 23, 42);">七、为什么 LLM 会写代码，但又经常写得像那么回事地翻车？</font>
<font style="color:rgb(26, 26, 46);">先说结论：</font>**<font style="color:rgb(15, 23, 42);">LLM 最擅长的是高重复、强模式、低歧义的代码任务；最容易翻车的是隐藏规则多、状态链长、边界复杂、风险高的任务。</font>**

<!-- 这是一张图片，ocr 内容为：舒适区 2 容易翻车区 西园 样板代码 文档整理 业务规则复杂 跨文件依赖 测试样例 隐藏约束 旧文档/新SDK 常见CRUD 绝对红线 幻觉识别 3 园88 API.CREATEMAGIC() USERSERVICE.DOMAGIC()X SUPERULTRACLIENT.SEND() X 支付 安全 权限 并发一致性 COM.FAKE.UNICORN.UTILS 食AI输出默认是草稿, 不存在的API 一本正经地瞎编 人类才是最终守门员. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776994206969-e5f56f30-cb34-48d3-b051-5e6557279a3f.png)

### <font style="color:rgb(15, 23, 42);">7.1 绝对舒适区：这些地方它可以信任</font>
**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> AI 的强项清单</font>**

+ **<font style="color:rgb(15, 23, 42);">样板代码</font>**<font style="color:rgb(26, 26, 46);">：for 循环、class 定义、API 路由、CRUD 操作——训练数据中重复出现了亿万次</font>
+ **<font style="color:rgb(15, 23, 42);">高频设计模式</font>**<font style="color:rgb(26, 26, 46);">：Factory、Observer、Middleware——GitHub 上被反复实现的模式</font>
+ **<font style="color:rgb(15, 23, 42);">语言转译</font>**<font style="color:rgb(26, 26, 46);">：Python </font><font style="color:rgb(26, 26, 46);">↔</font><font style="color:rgb(26, 26, 46);"> JavaScript </font><font style="color:rgb(26, 26, 46);">↔</font><font style="color:rgb(26, 26, 46);"> Go——模型"读"过大量多语言实现</font>
+ **<font style="color:rgb(15, 23, 42);">基础单测生成</font>**<font style="color:rgb(26, 26, 46);">：Happy path + 常见边界条件</font>
+ **<font style="color:rgb(15, 23, 42);">文档整理</font>**<font style="color:rgb(26, 26, 46);">：函数文档字符串、README、API 文档——结构化文本生成是看家本领</font>

### <font style="color:rgb(15, 23, 42);">7.2 容易翻车区：这些地方你必须盯紧</font>
**<font style="color:rgb(239, 68, 68);">❌</font>****<font style="color:rgb(239, 68, 68);"> AI 的弱项清单</font>**

+ **<font style="color:rgb(15, 23, 42);">隐式业务规则</font>**<font style="color:rgb(26, 26, 46);">：模型不知道你公司的特殊规则。比如"订单金额超过 1 万需要主管审批"</font>
+ **<font style="color:rgb(15, 23, 42);">长链路状态依赖</font>**<font style="color:rgb(26, 26, 46);">：跨多个模块的修改容易遗漏。比如改了 API 忘了改前端类型定义</font>
+ **<font style="color:rgb(15, 23, 42);">新发布的冷门 API</font>**<font style="color:rgb(26, 26, 46);">：训练数据截止后的新知识，模型要么不知道，要么瞎编</font>
+ **<font style="color:rgb(15, 23, 42);">复杂边界条件</font>**<font style="color:rgb(26, 26, 46);">：并发竞争、资源泄漏、极端输入——训练数据中样本很少</font>

**<font style="color:rgb(220, 38, 38);">❌</font>****<font style="color:rgb(220, 38, 38);"> 问题代码：只相信模型写出来的“看起来对”</font>**

```javascript
export async function updateRole(userId: string, role: string) {
  await db.user.update({ where: { id: userId }, data: { role } });
  return { ok: true };
}
```

**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 修复代码：把权限、审计、边界一起补上</font>**

```javascript
export async function updateRole(
  operatorId: string,
  userId: string,
  role: Role
) {
  const operator = await requireAdmin(operatorId);
  if (operator.id === userId) throw new Error("禁止修改自己的角色");

  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { role } });
    await tx.auditLog.create({
      data: {
        actorId: operatorId,
        action: "user.role.update",
        targetId: userId,
        payload: { role }
      }
    });
  });

  return { ok: true };
}
```

<font style="color:rgb(26, 26, 46);">上面这个对比很典型。模型在第一版里不是不会写更新逻辑，而是它没法自动知道你系统里还有“只有管理员能改角色”“不能改自己”“必须记审计日志”这些隐含规则。这就是 </font>**<font style="color:rgb(15, 23, 42);">AI 会写代码，但不天然知道你业务的真相</font>**<font style="color:rgb(26, 26, 46);">。</font>

### <font style="color:rgb(15, 23, 42);">7.3 幻觉的代码体现：怎么识别 AI 在"瞎编"</font>
<font style="color:rgb(26, 26, 46);">幻觉（Hallucination）在代码场景的表现特别隐蔽——因为</font>**<font style="color:rgb(15, 23, 42);">看起来工整的代码不一定能跑</font>**<font style="color:rgb(26, 26, 46);">。常见的幻觉体现有：</font>

| **<font style="color:rgb(15, 23, 42);">幻觉类型</font>** | **<font style="color:rgb(15, 23, 42);">具体表现</font>** | **<font style="color:rgb(15, 23, 42);">怎么发现</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">🔴</font><font style="color:rgb(26, 26, 46);"> 捏造 API</font> | <font style="color:rgb(26, 26, 46);">调用不存在的属性或方法</font> | <font style="color:rgb(26, 26, 46);">运行时报</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">undefined is not a function</font>` |
| <font style="color:rgb(26, 26, 46);">🔴</font><font style="color:rgb(26, 26, 46);"> 捏造依赖</font> | <font style="color:rgb(26, 26, 46);">推荐不存在的 NPM 包名</font> | `<font style="color:rgb(37, 99, 235);">npm install</font>`<br/><font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">报错 404</font> |
| <font style="color:rgb(26, 26, 46);">🔴</font><font style="color:rgb(26, 26, 46);"> 生搬硬套</font> | <font style="color:rgb(26, 26, 46);">用错误的异常处理方式处理所有错误</font> | <font style="color:rgb(26, 26, 46);">代码审查时发现</font> |
| <font style="color:rgb(26, 26, 46);">🔴</font><font style="color:rgb(26, 26, 46);"> 供应链风险</font> | <font style="color:rgb(26, 26, 46);">推荐恶意同名篡改包</font> | <font style="color:rgb(26, 26, 46);">依赖扫描工具检测</font> |


:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> 供应链投毒风险</font>**

<font style="color:rgb(26, 26, 46);">模型推荐不存在的包已经够糟糕了，更可怕的是它可能推荐一个</font>**<font style="color:rgb(15, 23, 42);">名字很像但恶意的包</font>**<font style="color:rgb(26, 26, 46);">。比如你想要</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">lodash</font>`<font style="color:rgb(26, 26, 46);">，它可能推荐</font><font style="color:rgb(26, 26, 46);"> </font>`<font style="color:rgb(37, 99, 235);">lodsh</font>`<font style="color:rgb(26, 26, 46);">——这个包里可能藏着挖矿脚本。所以</font>**<font style="color:rgb(15, 23, 42);">任何 AI 推荐的依赖包，安装前必须去 npmjs.com 确认存在且可信。</font>**

:::

#### 真实翻车场景
:::danger
**<font style="color:rgb(26, 26, 46);">🚨</font>****<font style="color:rgb(26, 26, 46);"> 案例一：新 SDK 刚发，你让 AI 直接接入</font>**

<font style="color:rgb(26, 26, 46);">结果它把上一版本的方法签名写上去了，代码补得飞快，运行时报一屏参数错误。根因很简单：</font>**<font style="color:rgb(15, 23, 42);">训练知识是旧的，你又没喂官方文档</font>**<font style="color:rgb(26, 26, 46);">。这不是模型“蠢”，是工作流有洞。</font>

**<font style="color:rgb(26, 26, 46);">🚨</font>****<font style="color:rgb(26, 26, 46);"> 案例二：你把关键约束埋在超长上下文中间</font>**

<font style="color:rgb(26, 26, 46);">模型前面读了 8 万 Token，后面也读了 8 万 Token，中间那句“支付金额必须以分为单位存储”被它看漏了。最后页面是好的，账务是错的。典型的</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">Lost in the Middle</font>**<font style="color:rgb(26, 26, 46);"> </font><font style="color:rgb(26, 26, 46);">式翻车。</font>

**<font style="color:rgb(26, 26, 46);">🚨</font>****<font style="color:rgb(26, 26, 46);"> 案例三：为了让测试变绿，模型偷偷改了测试</font>**

<font style="color:rgb(26, 26, 46);">这事儿在 Agent 工具里太常见了。模型如果没被明确约束“不要改变测试语义”，它很可能会用最快的方式把 CI 变绿，而不是把问题修对。</font>

:::

### <font style="color:rgb(15, 23, 42);">7.4 高风险区域：绝对不能放手的红线</font>
**<font style="color:rgb(239, 68, 68);">🚨</font>****<font style="color:rgb(239, 68, 68);"> 这些区域必须人工审查，100% 不能交给 AI 独立完成</font>**

+ <font style="color:rgb(26, 26, 46);">🔒</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">安全逻辑</font>**<font style="color:rgb(26, 26, 46);">：认证、授权、加密实现</font>
+ <font style="color:rgb(26, 26, 46);">💰</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">支付流程</font>**<font style="color:rgb(26, 26, 46);">：金额计算、事务一致性</font>
+ <font style="color:rgb(26, 26, 46);">🔑</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">权限判断</font>**<font style="color:rgb(26, 26, 46);">：RBAC、ABAC 实现</font>
+ <font style="color:rgb(26, 26, 46);">⚡</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">并发一致性</font>**<font style="color:rgb(26, 26, 46);">：锁、竞态条件处理</font>
+ <font style="color:rgb(26, 26, 46);">🐌</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">性能瓶颈</font>**<font style="color:rgb(26, 26, 46);">：N+1 查询、内存泄漏</font>

<font style="color:rgb(26, 26, 46);">建议直接在规则文件（CLAUDE.md、.cursorrules）里标注"禁区"，让 AI 知道哪些地方不能碰。</font>

:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 一句话总结</font>**

**<font style="color:rgb(15, 23, 42);">样板代码放心交，业务逻辑盯着搞，安全权限亲手搞。</font>**

<font style="color:rgb(26, 26, 46);">记住这个原则，你就已经超越了 80% 的 Vibe Coder。</font>

:::

## 八、<font style="color:rgb(15, 23, 42);">上下文窗口与记忆：长 ≠ 好</font>
<font style="color:rgb(26, 26, 46);">到这里你可能会有一个问题：既然模型有这么多弱项，那我把整个项目的代码都喂给它，让它全面了解上下文，不就行了吗？</font>

<font style="color:rgb(26, 26, 46);">想法很好，但现实骨感。</font>

<font style="color:rgb(26, 26, 46);">这是现在 AI 编程里最容易被误会的一块。大家都听说过上下文窗口越来越长，动不动几十万 Token，甚至更多。然后很多人就自然得出一个错误结论：窗口大了，模型就更“记得住”。</font>

<font style="color:rgb(26, 26, 46);">真相不是这样。</font>

<font style="color:rgb(26, 26, 46);">OpenAI 关于 conversation state 的文档里写得很明确：</font>**<font style="color:rgb(15, 23, 42);">上下文窗口是单次请求里可用的 Token 总量</font>**<font style="color:rgb(26, 26, 46);">，里面包含输入 Token、输出 Token，某些模型还包含 reasoning tokens。</font>[<font style="color:rgb(37, 99, 235);">来源</font>](https://developers.openai.com/api/docs/guides/conversation-state)

<!-- 这是一张图片，ocr 内容为：最佳实践 三大错觉 目标清晰 塞得越多 窗口越大 长上下文 二 给关键片段 越好 越聪明 长期记忆 放规则文件 X 少给噪声 4 实际限制 记忆的三种形态 当前上下文 会话记忆 外部记忆/RAG 中间容易被忽略 结尾 开头 (LOST IN THE MIDDLE) 更易被关注 更易被关注 本轮可见内容 外部知识检索 对话中可回忆 即时生效 跨轮保留 持续可扩展 注意力稀释 成本上升 长,只是容量;组织得好,才是真正有效. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776994236229-8702b634-b2e9-4deb-b930-bca8b77665cc.png)

### <font style="color:rgb(15, 23, 42);">8.1 长上下文的三大错觉</font>
**<font style="color:rgb(15, 23, 42);">错觉一：窗口越大，理解越深。</font>**

<font style="color:rgb(26, 26, 46);">错。模型号称支持 200K Token 的上下文，但这不意味着它真的能"理解"200K Token 的内容。</font><font style="color:rgb(26, 26, 46);">信息密度和理解质量通常成反比</font><font style="color:rgb(26, 26, 46);">——塞进去的东西越多，模型越容易"看花眼"。</font>

**<font style="color:rgb(15, 23, 42);">错觉二：模型"记住"了上次告诉它的信息。</font>**

<font style="color:rgb(26, 26, 46);">错。模型没有长期记忆。每次对话对它来说都是"从零开始"，除非你使用了记忆功能或规则文件。它不会自动记住你上一次告诉它的业务规则。</font>

**<font style="color:rgb(15, 23, 42);">错觉三：塞入整个仓库，AI 就能全面理解。</font>**

<font style="color:rgb(26, 26, 46);">大错特错。把整个 </font>`<font style="color:rgb(37, 99, 235);">src/</font>`<font style="color:rgb(26, 26, 46);"> 目录丢给模型，反而会导致它</font>**<font style="color:rgb(15, 23, 42);">找错修改位置、混淆类名、遗漏关键依赖</font>**<font style="color:rgb(26, 26, 46);">。因为上下文中的噪声会稀释信号——100K Token 的上下文 ≠ 100K Token 的理解力。</font>

<font style="color:rgb(26, 26, 46);">所以你今天在项目里遇到的很多奇葩现象，其实都能解释：</font>

+ <font style="color:rgb(26, 26, 46);">为什么你明明贴了规范，它还是没照做</font>
+ <font style="color:rgb(26, 26, 46);">为什么你把整个仓库都喂进去，它反而开始改错文件</font>
+ <font style="color:rgb(26, 26, 46);">为什么长会话一到后半程，模型越来越散</font>

<font style="color:rgb(26, 26, 46);">因为问题从来都不是“喂少了”这么简单，很多时候反而是“喂太多、但组织得太差”。</font>

**<font style="color:rgb(220, 38, 38);">❌</font>****<font style="color:rgb(220, 38, 38);"> 错误喂法：把整个仓库一股脑塞进去</font>**

```plain
请阅读整个项目，修复订单页面的金额显示问题，并顺便优化性能。
```

**<font style="color:rgb(5, 150, 105);">✅</font>****<font style="color:rgb(5, 150, 105);"> 更稳的喂法：目标 + 约束 + 入口 + 直接依赖</font>**

```plain
目标：修复订单详情页金额显示错误。
约束：金额必须以“分”为存储单位，不允许改 API 签名。
入口文件：app/orders/[id]/page.tsx
直接依赖：lib/money.ts, api/order.ts
验证：订单 123 的 1099 分应显示为 ¥10.99
```

<font style="color:rgb(26, 26, 46);">你会发现，好的上下文工程本质上就是一句话：</font>**<font style="color:rgb(15, 23, 42);">不是给得越多越好，而是给得越准越好</font>**<font style="color:rgb(26, 26, 46);">。</font>

### <font style="color:rgb(15, 23, 42);">8.2 最佳实践：怎么给上下文最有效</font>
:::tip
**<font style="color:rgb(16, 185, 129);">✅</font>****<font style="color:rgb(16, 185, 129);"> 上下文供给三原则</font>**

1. **<font style="color:rgb(15, 23, 42);">重要信息前置</font>**<font style="color:rgb(26, 26, 46);">：把最关键的目标和约束放在最前面</font>
2. **<font style="color:rgb(15, 23, 42);">结构化呈现</font>**<font style="color:rgb(26, 26, 46);">：用列表、表格、代码块，不要大段自然语言</font>
3. **<font style="color:rgb(15, 23, 42);">模块化供给</font>**<font style="color:rgb(26, 26, 46);">：按模块/任务给上下文，不要一次性给整个仓库</font>

:::

<font style="color:rgb(26, 26, 46);">类比一下：你给新员工 onboarding，会直接把 10 万行代码丢给他让他自己看吗？不会。你会先给他讲项目概览、模块划分、关键入口——</font>**<font style="color:rgb(15, 23, 42);">给 AI 也一样。</font>**

### <font style="color:rgb(15, 23, 42);">8.3 记忆机制的三种形态</font>
| **<font style="color:rgb(15, 23, 42);">类型</font>** | **<font style="color:rgb(15, 23, 42);">生命周期</font>** | **<font style="color:rgb(15, 23, 42);">典型应用</font>** | **<font style="color:rgb(15, 23, 42);">适合存什么</font>** |
| :--- | :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">当前会话</font>** | <font style="color:rgb(26, 26, 46);">会话结束即消失</font> | <font style="color:rgb(26, 26, 46);">对话上下文</font> | <font style="color:rgb(26, 26, 46);">当前任务的中间信息</font> |
| **<font style="color:rgb(15, 23, 42);">结构化 RAG</font>** | <font style="color:rgb(26, 26, 46);">持久化</font> | <font style="color:rgb(26, 26, 46);">向量数据库</font> | <font style="color:rgb(26, 26, 46);">大型文档库、历史 Issue</font> |
| **<font style="color:rgb(15, 23, 42);">规则文件</font>** | <font style="color:rgb(26, 26, 46);">持久化</font> | <font style="color:rgb(26, 26, 46);">CLAUDE.md, .cursorrules</font> | <font style="color:rgb(26, 26, 46);">项目约束、编码规范</font> |


### <font style="color:rgb(15, 23, 42);">8.4 上下文窗口的实际限制</font>
<font style="color:rgb(26, 26, 46);">不同模型的上下文窗口差异很大——从 8K 到 200K+ Token。但有几个关键点你需要知道：</font>

+ <font style="color:rgb(26, 26, 46);">📊</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">实际可用窗口通常略小于标称值</font>**<font style="color:rgb(26, 26, 46);">——需要保留空间给输出</font>
+ <font style="color:rgb(26, 26, 46);">🧠</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">大窗口 ≠ 好理解</font>**<font style="color:rgb(26, 26, 46);">——窗口越大，信息组织越重要</font>
+ <font style="color:rgb(26, 26, 46);">⚡</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">窗口越大，推理越慢</font>**<font style="color:rgb(26, 26, 46);">——Attention 计算量随上下文长度二次增长</font>

<font style="color:rgb(26, 26, 46);">实际建议：即使有大窗口，也要精简上下文，只给必要信息。小窗口（8K-32K）只能处理单文件，中窗口（32K-128K）可以处理中型项目，大窗口（128K-200K+）可以处理大型项目——但信息组织更重要。</font>

<font style="color:rgb(26, 26, 46);">聊到这里，理论、训练、边界、上下文，我们都铺完了。最后就差最现实的一块：回到你每天工作的地方，模型到底该怎么选？什么时候该上大模型，什么时候用小模型更香？</font>

## <font style="color:rgb(26, 26, 46);">九、</font><font style="color:rgb(15, 23, 42);">编码模型到底该怎么选？别再只看排行榜了</font>
<font style="color:rgb(26, 26, 46);">很多团队刚开始接 AI 编程，选型方式特别像买显卡：哪个更强、哪个更贵、哪个榜单高，就上哪个。这个思路在今天已经不够用了。</font>

<!-- 这是一张图片，ocr 内容为：分层使用策略 四个维度 小模型:格式转换/耗材任务 女 上下文能力 代码能力 中模型:日常开发 中南 强模型:重构/难题 食肉肉 成本/延迟 工具调用 产品界面 决策框架 API VS 否 产品界面(聊天) API(集成) 任务复杂吗? 小是 POST/V1/CHAT/COMPLETIONS 否 要长上下文吗? "MODEL":"XXX", VS "MESSAGES":[...], .是 选择合适的 "STREAM":TRUE 否 编码模型 预算敏感吗? 自动化集成 聊天提效 小是 选型看工作流适配,不只看榜单. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776994268021-37006e06-2a7f-47bb-a1be-779e40e8cc01.png)

<font style="color:rgb(26, 26, 46);">因为模型选型真正要匹配的，不是抽象的“强弱”，而是具体任务。</font>

:::tip
**<font style="color:rgb(26, 26, 46);">✅</font>****<font style="color:rgb(26, 26, 46);"> 一个实用判断法</font>**

<font style="color:rgb(26, 26, 46);">你别问“哪个模型最强”，你要问：</font>**<font style="color:rgb(15, 23, 42);">我这件事是补全、重构、调试、架构、检索、还是多模态理解？</font>**

:::

<font style="color:rgb(26, 26, 46);">如果是日常补全、简单格式转换、批量改写，优先小模型，快而且便宜；如果是跨文件重构、复杂 bug、架构权衡，优先推理更稳的强模型；如果要看截图和界面稿，那就是多模态模型的活；如果你在做 RAG，别忘了主模型之外，你还需要 Embedding 模型配合。</font>

<font style="color:rgb(26, 26, 46);">至于排行榜，它不是没用，但只能当参考。像 SWE-bench 这种基准很好，因为它把真实 GitHub issue 和修复 patch 拉进来评估，SWE-bench Verified 还专门做了</font><font style="color:rgb(26, 26, 46);"> </font>**<font style="color:rgb(15, 23, 42);">500 个工程师确认可解的问题</font>**<font style="color:rgb(26, 26, 46);">。这类基准能帮助你理解模型的代码能力边界。</font>[<font style="color:rgb(37, 99, 235);">来源</font>](https://www.swebench.com/SWE-bench/)

<font style="color:rgb(26, 26, 46);">但你千万别迷信它。</font>**<font style="color:rgb(15, 23, 42);">榜单高，不等于适合你当前的工程流</font>**<font style="color:rgb(26, 26, 46);">。同一个模型，放进不同 IDE、规则系统、上下文供给方式里，效果可能差一大截。</font>

很多榜单上的头部模型，彼此分差往往并不大；但一旦放进不同 IDE、规则系统、检索策略和 Agent 工作流里，体感差异可能会被明显放大。

<font style="color:rgb(26, 26, 46);">所以选型的核心不是"哪个模型最强"，而是"哪个模型 + 哪个工作流最适合我的任务"。</font>

### <font style="color:rgb(15, 23, 42);">9.1 选型矩阵：关注四个维度</font>
| **<font style="color:rgb(15, 23, 42);">维度</font>** | **<font style="color:rgb(15, 23, 42);">看什么</font>** | **<font style="color:rgb(15, 23, 42);">为什么重要</font>** |
| :--- | :--- | :--- |
| **<font style="color:rgb(15, 23, 42);">编码能力</font>** | <font style="color:rgb(26, 26, 46);">HumanEval、SWE-bench</font> | <font style="color:rgb(26, 26, 46);">决定代码输出的正确率</font> |
| **<font style="color:rgb(15, 23, 42);">上下文能力</font>** | <font style="color:rgb(26, 26, 46);">支持 Token 数、长文本理解质量</font> | <font style="color:rgb(26, 26, 46);">决定能不能处理大项目</font> |
| **<font style="color:rgb(15, 23, 42);">工具调用能力</font>** | <font style="color:rgb(26, 26, 46);">Function Calling 准确性</font> | <font style="color:rgb(26, 26, 46);">决定能不能接入外部工具</font> |
| **<font style="color:rgb(15, 23, 42);">成本/延迟</font>** | <font style="color:rgb(26, 26, 46);">每百万 Token 价格、响应时间</font> | <font style="color:rgb(26, 26, 46);">决定日常使用的经济性</font> |


### <font style="color:rgb(15, 23, 42);">9.2 分层使用策略</font>
<font style="color:rgb(26, 26, 46);">聪明的团队不会"万事皆用最强模型"，而是分层使用：</font>

| **<font style="color:rgb(15, 23, 42);">层级</font>** | **<font style="color:rgb(15, 23, 42);">模型</font>** | **<font style="color:rgb(15, 23, 42);">场景</font>** | **<font style="color:rgb(15, 23, 42);">成本</font>** |
| :--- | :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">L1 快模</font> | <font style="color:rgb(26, 26, 46);">Haiku / GPT-4o-mini</font> | <font style="color:rgb(26, 26, 46);">补全、格式转换、分类</font> | <font style="color:rgb(26, 26, 46);">$</font> |
| <font style="color:rgb(26, 26, 46);">L2 中模</font> | <font style="color:rgb(26, 26, 46);">Sonnet / GPT-5</font> | <font style="color:rgb(26, 26, 46);">功能开发、重构</font> | <font style="color:rgb(26, 26, 46);">$$</font> |
| <font style="color:rgb(26, 26, 46);">L3 大模</font> | <font style="color:rgb(26, 26, 46);">Opus 4.6 </font> | <font style="color:rgb(26, 26, 46);">架构设计、复杂 Debug</font> | <font style="color:rgb(26, 26, 46);">$$$</font> |
| <font style="color:rgb(26, 26, 46);">L4 多模态</font> | <font style="color:rgb(26, 26, 46);">Gemini</font> | <font style="color:rgb(26, 26, 46);">设计稿转代码</font> | <font style="color:rgb(26, 26, 46);">$$</font> |


:::info
**<font style="color:rgb(59, 130, 246);">💡</font>****<font style="color:rgb(59, 130, 246);"> 省钱技巧</font>**

<font style="color:rgb(26, 26, 46);">用 Opus 做 JSON 格式转换，每次等 30 秒、花 $0.5——这是在烧钱。这种任务交给 Haiku，0.5 秒搞定，花 $0.001。</font>

**<font style="color:rgb(15, 23, 42);">模型选对的省钱效果，远比单纯换便宜模型显著。</font>**<font style="color:rgb(26, 26, 46);"> 更进一步，可以通过 Router/Dispatcher 自动根据任务复杂度选择合适的模型。</font>

:::

**<font style="color:rgb(15, 23, 42);">总结就是：大模型负责难题，小模型负责耗材，规则系统负责兜底，测试负责验真。</font>**

### <font style="color:rgb(15, 23, 42);">9.4 选型决策框架</font>
<font style="color:rgb(26, 26, 46);">给你一个实操框架，别再看排行榜选模型了：</font>

1. **<font style="color:rgb(15, 23, 42);">列任务清单</font>**<font style="color:rgb(26, 26, 46);">：你日常开发中哪些任务想让 AI 帮忙？</font>
2. **<font style="color:rgb(15, 23, 42);">测试 2-3 个模型</font>**<font style="color:rgb(26, 26, 46);">：用真实任务测，不要用排行榜</font>
3. **<font style="color:rgb(15, 23, 42);">对比输出质量</font>**<font style="color:rgb(26, 26, 46);">：准确率、可读性、可维护性</font>
4. **<font style="color:rgb(15, 23, 42);">评估成本</font>**<font style="color:rgb(26, 26, 46);">：每次会话的 Token 消耗 × 单价</font>
5. **<font style="color:rgb(15, 23, 42);">考虑合规</font>**<font style="color:rgb(26, 26, 46);">：团队的技术栈偏好、数据安全要求</font>

### <font style="color:rgb(15, 23, 42);">9.5 API vs 产品界面：用对工具事半功倍</font>
<font style="color:rgb(26, 26, 46);">同一个模型，你在 ChatGPT 网页上用和在 Cursor 里用，体验完全不一样。这不是错觉，而是因为</font>**<font style="color:rgb(15, 23, 42);">产品界面和 API 是两个完全不同的东西</font>**<font style="color:rgb(26, 26, 46);">。</font>

<font style="color:rgb(26, 26, 46);">打个比方：API 就像买食材自己做饭，产品界面就像去餐厅点菜。同样的食材（模型），体验天差地别。</font>

| **<font style="color:rgb(15, 23, 42);">场景</font>** | **<font style="color:rgb(15, 23, 42);">推荐方式</font>** | **<font style="color:rgb(15, 23, 42);">原因</font>** |
| :--- | :--- | :--- |
| <font style="color:rgb(26, 26, 46);">日常编码、调试</font> | <font style="color:rgb(26, 26, 46);">产品界面（Cursor、Claude Code）</font> | <font style="color:rgb(26, 26, 46);">开箱即用，上下文自动管理</font> |
| <font style="color:rgb(26, 26, 46);">CI/CD 代码审查</font> | <font style="color:rgb(26, 26, 46);">API</font> | <font style="color:rgb(26, 26, 46);">需要嵌入自动化流程</font> |
| <font style="color:rgb(26, 26, 46);">批量文档生成</font> | <font style="color:rgb(26, 26, 46);">API</font> | <font style="color:rgb(26, 26, 46);">并发处理，成本可控</font> |
| <font style="color:rgb(26, 26, 46);">快速原型验证</font> | <font style="color:rgb(26, 26, 46);">产品界面（Bolt.new、Lovable）</font> | <font style="color:rgb(26, 26, 46);">最快速度看到效果</font> |
| <font style="color:rgb(26, 26, 46);">团队知识库集成</font> | <font style="color:rgb(26, 26, 46);">API + RAG</font> | <font style="color:rgb(26, 26, 46);">需要自定义检索逻辑</font> |


:::warning
**<font style="color:rgb(245, 158, 11);">⚠️</font>****<font style="color:rgb(245, 158, 11);"> API 的隐性成本</font>**

<font style="color:rgb(26, 26, 46);">API 看起来更便宜（没有产品溢价），但你需要自己实现：上下文管理、错误处理、流式输出、工具调用解析。这些开发成本加起来，可能比产品界面的订阅费还高。</font>

:::

**<font style="color:rgb(15, 23, 42);">最聪明的做法是混合使用</font>**<font style="color:rgb(26, 26, 46);">：产品界面做日常开发 + API 做自动化流程。</font>

<font style="color:rgb(26, 26, 46);">走到这里，我们就大致明白了AI 写代码这件事，不是魔法，不是搜索，不是编译，也不是“它突然理解了你的世界”。它是一个在海量模式上训练出来的生成系统，会在上下文里找重点、一步步往后猜；它能非常像一个程序员，但它并不天然知道你的业务真相。</font>

## <font style="color:rgb(26, 26, 46);">十、</font><font style="color:rgb(15, 23, 42);">总结：从"盲盒玩家"到"精准操控"</font>
<!-- 这是一张图片，ocr 内容为：角色变化 最终原则 知识地图 之后 之前 给清晰目标 本质 盲盒玩家 "精准操控者" 明确你要什么, 流水线 选型 越清晰,越可靠. H 给真实上下文 世珍南点! 提供足够信息, LLM 模型种类 上下文 四四四 越真实,越贴近. 点! 底层机制 给明确约束 目标清晰 目标模糊 设定范围与规则, 边界 TOKEN / 提问随意 提问有设计 越明确,越可控. EMBEDDING 过程可控 结果靠运气 训练 效果不可控 结果可复现 做人类验证 保持判断与复核, 碰运气 可控生产 越谨慎,越安全. 会用LLM,不是迷信它,而是驾驭它. -->
![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1776994302330-01a3f009-1820-4e8d-b0df-34d0e47657d5.png)

<font style="color:rgb(26, 26, 46);">如果这篇你只记住一句话，我希望是这句：</font>

:::info
**<font style="color:rgb(15, 23, 42);">LLM 会写代码，是因为它极度擅长续写模式；LLM 会翻车，是因为模式再像，也替代不了真实上下文、业务边界和验证机制。</font>**

:::

<font style="color:rgb(26, 26, 46);">这也是为什么我一直觉得，Vibe Coding 最怕的不是“模型不够强”，而是人类太快把判断权全交出去了。你不需要真的去训练一个大模型，但你一定得知道它是怎么工作的。因为只有这样，你才知道什么时候该信它，什么时候该拦它，什么时候该补文档，什么时候该上测试，什么时候该把任务拆小。</font>

<font style="color:rgb(26, 26, 46);">说到底，未来高水平开发者的分水岭，不是“会不会用 AI”，而是：</font>

+ <font style="color:rgb(26, 26, 46);">会不会定义清楚问题</font>
+ <font style="color:rgb(26, 26, 46);">会不会组织清楚上下文</font>
+ <font style="color:rgb(26, 26, 46);">会不会给模型设边界</font>
+ <font style="color:rgb(26, 26, 46);">会不会用验证把“看起来对”变成“真的对”</font>

:::tip
**<font style="color:rgb(26, 26, 46);">✅</font>****<font style="color:rgb(26, 26, 46);"> 本章真正的升级点</font>**

<font style="color:rgb(26, 26, 46);">从今天开始，你再看到 AI 写代码，不会只说“这模型真牛”。你会开始问：它现在依赖了什么上下文？它是在模式续写，还是在用工具补真相？这个任务到底适不适合交给它？</font>

:::

<font style="color:rgb(26, 26, 46);">这才叫真正理解 LLM。不是会背 Transformer、RLHF、Token 这些词，而是你终于知道：</font>**<font style="color:rgb(15, 23, 42);">AI 编程这件事，为什么能成，为什么会翻车，又为什么工程方法比“咒语”更重要。</font>**

**<font style="color:rgb(15, 23, 42);"></font>**