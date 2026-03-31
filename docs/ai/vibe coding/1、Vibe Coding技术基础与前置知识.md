---
title: Vibe Coding 技术基础与前置知识全景指南
date: 2026-03-26
tags: ["Vibe Coding"]
description: 从大语言模型（LLM）的底层逻辑到 Agent 智能体的实战驾驭，一文带你摸透 Vibe Coding 时代的核心心法与硬核前置知识。

---

![image-20260327115645756](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/image-20260327115645756.png)

## <span style="color: #1E40AF;">一、大语言模型（LLM）到底是个啥？</span>

要玩转 Vibe Coding，你得先摸透你手底下这位<span style="color: #4F46E5; font-weight: bold;">“AI 赛博打工人”</span>的底细。大语言模型（Large Language Model，简称 LLM）听起来高大上，其实你可以把它当成一个<span style="color: #0369A1; font-weight: bold;">“读过全人类代码、但记性有点薛定谔、且高度依赖你发号施令的超级实习生”</span>。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774408897338-1523dd6a-dfed-4e16-9c5d-06d4bc8eb3f0.png)

很多人觉得 AI 是有了“灵魂”在思考。其实戳破窗户纸，大语言模型（LLM）的本质就是一道极其复杂的<span style="color: #BE185D;">“数学概率题”</span>。它所做的一切，用四个字就能概括：<span style="color: #BE185D;">文字接龙（Predict Next Token）</span>。

当你输入“帮我写一段”，AI 并不是在“构思”代码，而是在它庞大的数据库里计算：跟在“一段”后面，出现“代”字的概率是 80%，出现“诗”的概率是 10%。于是它输出了“代”，接着再根据“帮我写一段代”，继续预测下一个字是“码”。

### <span style="color: #0F172A;">1.0、一图看懂：LLM 吐出代码的完整流水线</span>

在深入细节之前，我们先用一张图俯瞰大模型大脑内部完整的运行流程：

![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1774524695469-c46e192f-eb6e-4183-a2f7-a46c1fd4a275.png)

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774524721019-5ed22926-73c5-492d-9436-395f06e8a012.png)

#### <span style="color: #334155;">步骤拆解一：Token（切词）与 Embedding（数学魔法）</span>

AI 不认识“Hello World”，更不认识中文。第一步，它要用 **<span style="color: #0284C7;">Tokenizer（分词器）</span>** 把你给的代码切碎。通常，**1 个 Token 大约等于 0.7 个英文单词，或者 0.5 个汉字**。这就是为什么你调 API 时是按 Token 计费的。

切成编号后，迎来了 AI 历史上最伟大的发明之一：**<span style="color: #0284C7;">Embedding（词向量映射）</span>**。
这就好比给世界上的每个词分配了一个 **“高维 GPS 坐标”**。在 AI 的数学空间里，“苹果”和“香蕉”的坐标挨得很近（都是水果），“国王”的坐标减去“男人”加上“女人”，得出的坐标刚好就落在“女王”上！**这就是 AI 能“读懂”你需求含义的根本原因：它把语文题变成了几何计算题。**

#### <span style="color: #334155;">步骤拆解二：Transformer 的“QKV 魔法”</span>

坐标建好后，数据流入 **<span style="color: #0284C7;">Transformer</span>** 层。这里的核心是 **自注意力机制 (Self-Attention)**，也就是著名的 **QKV（Query, Key, Value）矩阵运算**。听着很吓人，其实非常生活化：

* **<span style="color: #16A34A;">Query (Q / 查询)</span>**：比如此时 AI 正在处理“写”这个字，Q 就代表“我现在的需求是啥？”
* **<span style="color: #D97706;">Key (K / 标签)</span>**：之前输入的“帮”和“我”都贴上了 K 标签，意思是“我这里有什么信息”。
* **<span style="color: #2563EB;">Value (V / 实际内容)</span>**：代表这个字真实的上下文含义。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774578957209-9adda717-ae59-4be5-803c-589a07d140af.png)

**打个比喻**：就像你在图书馆（大脑）里找书。**Q 是你在搜索框输入的关键字，K 是每本书背后的条形码标签，V 是书里的正文。** Transformer 就是在拿 Q 疯狂地和所有的 K 做乘法比对（计算相关度），找到最匹配的几本书，然后把它们的 V（内容）提取出来融合。这让 AI 在写第 1000 行代码时，依然能死死盯住你在第 1 行定义的变量名！

#### <span style="color: #334155;">步骤拆解三：生成输出与“温度控制” (Temperature)</span>

算到最后，模型会给出一张概率表（比如：代85%，信10%，诗5%）。这时候轮到 **<span style="color: #0284C7;">Sampler（采样器）</span>** 上场了。我们在用各种 Vibe Coding 工具时，经常能看到一个叫 **<span style="color: #0284C7;">Temperature（温度）</span>** 的参数：

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774524872378-a02e5272-afc9-4716-9dab-b5c62c88b2db.png)

::: warning

⚠️ **<span style="color: #EA580C;">Vibe Coding 设置警告</span>**
在写代码时，**务必把模型的 Temperature 设置在 0 到 0.2 之间**（Cursor等工具默认已调好）。如果设得太高，AI 就会发挥“创造力”，给你瞎编出根本不存在的库函数！
:::

### <span style="color: #0F172A;">1.1、大模型为什么叫“大”模型？（参数的秘密）</span>

平时总听行业里吹嘘“千亿参数”、“万亿参数”，这**“参数”（Parameters）**到底是个啥，为什么越大越好？

打个比方，参数就像是大脑里的**“神经元连接”**，或者是一台超级调音台上的**“旋钮”**。模型在学习海量代码时，就在不断微调这成百上千亿个旋钮的位置。旋钮（参数）越多，模型能记住的细节和能搞懂的复杂逻辑就越深。

* ⚡ **<span style="color: #475569;">小参数模型（如 7B/8B，B代表十亿）</span>**：像个机灵的初级实习生。脑容量小，但跑得贼快，普通轻薄本甚至手机就能跑起来，适合处理简单的代码补全（自动补齐括号、写个循环）。
* 🧠 **<span style="color: #475569;">大参数模型（如百亿、万亿级）</span>**：像个行业老专家。见多识广、逻辑深邃，但极其消耗算力（吃显卡），通常只能在云端运行。对于复杂的 Vibe Coding 架构设计、跨文件改 Bug，必须请大参数模型出马。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774409734802-bd16b45f-9ef9-48fb-a062-33c165caebd3.png)

### <span style="color: #0F172A;">1.2、大模型的十八般武艺（模态分类）</span>

除了比拼“脑容量”，现在的大模型还是个“多面手”。根据处理的数据类型（专业叫“模态 Modality”），主要分为这几类：

* 📝 **文本大模型（Text LLM）**：专门跟文字打交道，比如写文章、翻译文档。
* 🖼️ **图像大模型（Image Model）**：比如 Midjourney，给他一句话，他给你画张图。
* 🎥 **视频大模型（Video Model）**：比如 Sora，一段文字直接生成影视大片。
* 🌐 **多模态大模型（Multimodal）**：啥都能看懂，既能看图、听声音，又能说话。

> 🔥 **<span style="color: #DC2626;">划重点：Vibe Coding 到底用的是什么模型？</span>**
>
> 我们在 Vibe Coding 时，绝对主力是 **“代码大模型”（Code LLM）**。这是文本大模型的一个“学霸变种”，它们在训练时疯狂吃透了 GitHub 上的全人类代码，专门针对逻辑推理和编程语言进行了强化。
>
> 此外，Vibe Coding 还会高频使用 **“视觉多模态大模型”（VLM）**。最爽的体验莫过于：你直接把设计师画好的一张 UI 设计图（图片）扔给 AI，AI “看”懂后，直接给你吐出像素级还原的 React 前端代码（代码）！

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774579008487-0708ce35-09f3-4f3d-9103-42a3bc68ad8a.png)

### <span style="color: #0F172A;">1.3、Transformer：模型封神的底层架构</span>

了解了 Vibe Coding 用的是什么模型后，你可能会好奇：这些代码大模型到底凭什么这么聪明？这就不得不提统治 AI 界的底层基石——**Transformer 架构**。

在 Transformer 出现之前，早期的 AI 读文章用的是 RNN（循环神经网络），特点是“像人类一样从左到右，一个词一个词地顺序读”，这就导致读到后面很容易把前面的设定给忘了。Transformer 彻底颠覆了这个套路，它不再按顺序读，而是“一口气把整篇文章吞下去并行处理”，这主要靠它的两大杀招：

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774487988996-4ccc9cca-7753-42d7-90ae-5bb9ed04d68b.png)

* **自注意力机制（Self-Attention）**：打个接地气的比方，当 AI 读到“小明把 Bug 丢给了小红，因为她在这个模块踩过坑”这句话时，AI 怎么知道“她”是小红而不是小明？“自注意力机制”就像是在文字之间拉起了一张无形的网，AI 读这句话时，能立刻算出“她”和“小红”的关联度最高。在写代码时，这种机制让 AI 能够在一长串代码里“瞻前顾后”，确保几百行外的变量没有被用错。
* **位置编码（Positional Encoding）**：既然 Transformer 是一口吞下所有内容（并行计算），它原本是不知道哪个词在前面、哪个在后面的。位置编码就相当于给代码里的每一个词贴上一个带有顺序信息的“座号条”，这样 AI 虽然是一眼看全，却依然能精准拿捏代码的逻辑先后顺序。

### <span style="color: #0F172A;">1.4、Token：AI 眼中的“文字原子”</span>

现在我们知道了 AI 是用 Transformer 的脑子一口吞下整篇代码的，但它吞的到底是什么？是英文字母？还是汉字？都不是。AI 吞咽的最小单位叫做 **<span style="color: #8B5CF6;">Token</span>**。

这就好比 AI 不认识完整的单词或汉字，它在读代码之前，会先用一把“剪刀”把长串文字切碎成一块一块的乐高拼图（Token）。
通常，**1 个 Token 大约等于 0.7 个英文单词，或者 0.5 个汉字**。遇到常见的词（如 `function`），它可能作为一个整体（1个 Token）；遇到生僻的词，可能会被切成两三段（占几个 Token）。我们在用各种大模型 API 时，花出去的真金白银就是按 Token 数量来计费的！

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774524243592-0eefe81b-0e56-4ba1-874f-143c046fa439.png)

#### <span style="color: #334155;">输入 Token 与 输出 Token（为什么价格差那么多？）</span>

在使用 Cursor、Windsurf 等 Vibe Coding 软件或直接调用 API 时，你会发现账单上把 Token 分成了两类，而且**输出通常比输入贵 3 到 4 倍**。核心原因在于大模型的计算机制：

* **<span style="color: #10B981;">输入 Token (Input / Prompt)</span>**：也就是你喂给 AI 的提示词和几十个代码文件。Transformer 的超能力是“并行计算”，它可以**一口气同时**看完成千上万的代码，由于硬件利用率极高、算力成本低，所以很便宜。
* **<span style="color: #EF4444;">输出 Token (Output / Completion)</span>**：也就是 AI 帮你写出的新代码。由于文字接龙的特性，它必须**串行生成**（吐出一个字后，把它拼接到上下文里，再去算下一个字），极其消耗显卡算力，所以价格昂贵。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774525172489-b7cc6fe8-6528-45ab-adce-ce88ee8e3e48.png)

#### <span style="color: #334155;">发给 AI 之前，怎么算 Token？（Token 计算器）</span>

既然 Token 决定了花销，而且每个模型都有“上下文窗口上限”（超出了就会中间失忆或报错），我们在把几万行代码发给 AI 前，怎么知道到底有几个 Token 呢？

这就需要用到 **Token 计算器（Tokenizer 工具，如 OpenAI 的 Tiktoken）**。Vibe Coding 软件的底层其实都在默默运行这种计算器，帮你把选中的代码文件实时转换成 Token 数量并预警展示在 UI 上。

> 💡 **<span style="color: #2563EB;">避坑：不同 AI 门派的“字典”不一样！</span>**
>
> 不同模型切碎文字的规则完全不同！比如同样一句中文“帮我写一段代码”，在早期的 GPT-3 里可能被切成十几个 Token（因为它对中文不友好，按偏旁部首切，特别费钱）；但在国产的 DeepSeek 或新版 GPT-4o 里，它们专门扩充了中文词表，可能只需要 3 到 4 个 Token！**这也是为什么用对中文优化的模型，不仅回复速度极快，而且极度省钱。**

### <span style="color: #0F172A;">1.5、AI 的“三年高考，五年模拟”：模型是怎么炼成的？</span>

弄懂了 AI 的脑部结构 (Transformer) 和它的食物 (Token)，那一个满级的大模型究竟是怎么炼成的？这就要经历残酷的**模型训练与微调（Training & Fine-tuning）**。这就好比一个小孩从“牙牙学语”到“博士毕业”，基本逃不过以下三个阶段：

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774525467043-261f4360-5894-4102-96bc-d0a76012d82a.png)

**<span style="color: #0F172A;">第一阶段：海量“填鸭”吸收（预训练 Pre-training）</span>**
把全网几万亿个 Token（网页、GitHub代码等）喂给模型看，动用上万张显卡跑上几个月。这个阶段就像是让小孩死记硬背一本超级大字典。学完后，它成了个“知识渊博的傻子”——它懂什么是 Python，但如果你让它“写个爬虫”，它可能只会接着往下续写一段不相关的话，因为它还不知道什么是“回答问题”。

**<span style="color: #0F172A;">第二阶段：学规矩、听指令（指令微调 Instruction Tuning）</span>**
人类专家写出几万道极其高质量的“问答题”（Prompt: 写个爬虫 -> Response: 这是代码...），拿这些卷子专门去训练模型。这时候 AI 恍然大悟：“哦，原来别人问问题，我是要按照格式回答的！”。这就是所谓的**微调（Fine-Tuning）**。
_<span style="color: #64748B;">注：很多大厂宣传“我们对模型进行了私有化微调”，指的就是在这个阶段，把公司祖传的内部代码库、API 规范做成问答对喂给模型，硬生生把一个通用 AI 调教成懂公司黑话的专属员工。</span>_

**<span style="color: #0F172A;">第三阶段：基于人类反馈的强化学习 (RLHF) —— “学人情世故”</span>**
模型写出的答案可能好几种都对，但哪种最讨人喜欢？这阶段，几千个人类专家给 AI 的各种回答“打分”（写得啰嗦扣分，代码优雅加分）。模型根据这些分数不断修正自己的三观，最终输出的语气和代码风格会彻底变成一个“情商极高的资深工程师”。

### <span style="color: #0F172A;">1.6、推理模型（Reasoning）：从“快思考”到“慢思考”的革命</span>

前面的三步训练，造就了我们熟悉的经典大模型。但这类模型属于**“快思考”（System 1）**：它们写代码就像膝跳反射，看到问题立刻凭直觉“脱口而出”。写个简单函数还行，一遇到涉及多层架构的骨灰级 Bug，它们就容易翻车，开始“一本正经地胡说八道”。

为了攻克这个编程难题，AI 界迎来了一次大革命——**“推理大模型”（Reasoning Models，如 OpenAI o系列、DeepSeek R1等）**诞生了。它们通过更高级的强化学习（RL），终于掌握了**“慢思考”（System 2）**的能力。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774496498394-32e176a3-0614-4b8a-9aab-02dd6303fa05.png)

当你给推理模型布置一个巨复杂的编码任务时，它不会马上给你吐代码，而是会先在后台生成一大堆你看不见的**思维链（Chain of Thought, CoT）**。它会在内部“打草稿”、尝试解法 A、发现解法 A 走不通、退回起点、尝试解法 B……直到它在脑海里把整个逻辑彻底盘通了，才会把最完美、没有 Bug 的最终代码呈现给你。这极大提升了 Vibe Coding 在高难度项目中的成功率！

### <span style="color: #0F172A;">1.7、2026年主流模型“门派”大比拼</span>

搞懂了这些底层逻辑和最新进展，我们来看看真正下场的选手们。AI 圈“一天人间，一年 AI”，到了 2026 年，大语言模型已经全面进化，各家大厂都在疯狂内卷“自主智能体 (Agentic)”和“深度推理”。这里是一份 2026 年最新的终极选型指南：

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774497164422-7bc30e3a-65f6-481b-9eb6-d711c7428512.png)

| **模型名称**                                        | **核心人设 (2026版)**        | **最擅长干嘛？**                                             |
| :-------------------------------------------------- | :--------------------------- | :----------------------------------------------------------- |
| **<span style="color: #D97706;">Claude 4.6</span>** | “全自动赛博程序员” (Agentic) | 代码质量和工程化能力的天花板。你给个宏大的需求，它能自己在终端跑命令行、建项目、查报错、自己改 Bug。极其稳健，是目前 Vibe Coding 的主力旗舰。 |
| **<span style="color: #10B981;">GPT-5.4</span>**    | “神级深度推理怪”             | 把“慢思考”发挥到了极致。面对前无古人的超复杂算法题或是涉及多层架构的底层屎山代码，它能在后台打草稿盘算出最完美的逻辑，破局神器。 |
| **<span style="color: #3B82F6;">GLM-5</span>**      | “国产多模态全能王”           | 国产大模型的骄傲，综合实力直接对标全球顶尖。不仅代码推理能力强悍，而且对国内各种开源生态、中文文档理解极深，响应速度极快。 |
| **<span style="color: #8B5CF6;">Gemini 3.1</span>** | “无限上下文吞噬者”           | 不仅原生支持顶级视觉多模态，还拥有几千万级 Token 的恐怖脑容量。适合直接把整个公司几十个微服务的海量代码库一次性全丢给它分析。 |

### <span style="color: #0F172A;">1.8、别盲目崇拜，AI 也有“坑”</span>

了解完各家神仙打架后，必须泼一盆冷水。AI 哪怕进化到 2026 年，依然有两个避不开的死穴：

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774525988827-aa01f593-39a3-450e-b321-d4e02cd5bb9c.png)

**<span style="color: #0F172A;">一本正经地胡说八道（幻觉）</span>**
AI 有时候为了讨好你，会编造出根本不存在的库或者 API，看着极其合理，一跑就报错。**一定要自己看一眼代码！**

🚨 **<span style="color: #EF4444;">案发现场：典型的 AI 幻觉代码</span>**

```javascript
// 你让 AI 帮你写一个预测用户行为的函数
import { useState } from 'react';
// ❌ 幻觉爆发：根本不存在 react-mind-reader 这个库！
import { predictUserIntent } from 'react-mind-reader'; 

function SmartComponent() {
  const intent = predictUserIntent(); // 运行直接报错崩溃
  return <div>{intent}</div>;
}
```

**<span style="color: #0F172A;">记忆广度是有限的（上下文溢出）</span>**
这直接引出了我们下文要讲的核心问题：当塞给它的文件太多导致 Token 爆炸时，AI 会“顾头不顾尾”，直接把早期的设定给忘了。

**<span style="color: #0F172A;">知识截止日期</span>**
模型的训练数据有截止日期，可能不了解最新的 API 变化、新发布的库或最新的最佳实践。使用新框架时需要额外验证。

**<span style="color: #0F172A;">安全与隐私考量</span>**
将代码发送到云端模型可能存在数据泄露风险。处理敏感代码时，应考虑使用企业版工具或本地部署的模型。

***

## <span style="color: #1E40AF;">二、提示词工程（Prompt Engineering）：怎么和 AI 好好说话</span>

既然 AI 有坑，我们该怎么正确驾驭它？选好模型只是第一步，就像给你配了个绝顶聪明的实习生，如果你不会安排任务，他一样会把事情搞砸。这就是为什么我们需要掌握——**提示词工程（Prompt Engineering）**。听起来像门玄学，其实说白了就是：**如何向一个智商很高、但缺乏背景信息的同事派活儿。**

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774526093113-99512110-9fe2-47bc-8797-8c6e71e3fb2e.png)

### <span style="color: #0F172A;">2.1、搞懂“三大角色”：提示词背后的剧组模式</span>

当我们在 Cursor 等工具里输入一句话时，你以为这只是一段文本，但在 AI API 的底层逻辑中，这段对话其实是一场有明确分工的“舞台剧”。大模型把提示词严格划分成了三个核心角色（Role）：

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774526661872-8ad08507-e37d-4942-b08d-fdb77b090742.png)

* **系统提示词 (System Prompt)**：相当于给 AI 发一张“角色卡”。它的权限最高，决定了 AI 的说话口吻和底线原则。比如在 Cursor 的 `.cursorrules` 文件里写的规则（“永远使用 TypeScript，不要写任何注释”），就属于 System Prompt。
* **用户提示词 (User Prompt)**：相当于你每次敲进对话框里的具体需求。它解决的是“今天、现在、你要干什么”的问题。
* **助手提示词 (Assistant Prompt / Prefill)**：这是 Vibe Coding 中的高阶技巧。你可以在 AI 还没开口前，强行把它的第一句话写好（预填充）。比如你先写个 ````javascript\n````，AI 就会被迫顺着这个代码块往下写，而不会废话连篇地给你解释原理。

### <span style="color: #0F172A;">2.2、基础框架：一份满分“需求文档 (PRD)”提示词</span>

大部分新手抱怨 AI 写的代码不能用，是因为他们的提问就像是在让 AI “猜盲盒”。好的提示词，必须像一份严谨的产品需求文档（PRD）。下面是一个典型的灾难现场与老司机写法的对比：

#### <span style="color: #DC2626;">❌ 菜鸟的提问（大忌：太笼统）</span>

> 帮我写一个登录弹窗组件。

**<span style="color: #DC2626;">后果：</span>** AI 根本不知道你用 Vue 还是 React，直接拿个几年前的老旧框架写了一坨不符合你们项目规范的面条代码，你还得费劲去重构。

#### <span style="color: #10B981;">✅ 老司机的指令（框架化、结构化）</span>

```markdown
# 角色：你是一个极简主义的资深前端。
# 任务：写一个可复用的 LoginModal 组件。
# 需求细节：
1. 包含账号、密码输入框和登录按钮；
2. 点击外部遮罩层可关闭；
# 技术栈：React 18 + TypeScript + Tailwind CSS。
# 输出约束：只输出完整代码，禁止废话解释。
```

**<span style="color: #10B981;">结果：</span>** AI 乖乖闭嘴，直接输出符合现代技术栈的高质量代码，复制粘贴就能跑。

### <span style="color: #0F172A;">2.3、提示词的四大核心流派：压榨 AI 的全部潜力</span>

在日常的 Vibe Coding 中，我们会根据任务的难易程度，灵活切换不同的提示词策略（流派）。下面我们用最直观的例子来对比这四种高频打法：

#### **<span style="color: #334155;">流派一：Zero-shot (零样本提示) —— 直接白嫖</span>**

顾名思义，不给任何例子，直接发问。这种方式最省事（省 Token），只适合极度简单的常识性代码补全或函数生成。

```text
用 JavaScript 写一个验证邮箱格式的正则表达式函数。
```

#### **<span style="color: #334155;">流派二：Few-shot (少样本提示) —— 别光说，打个样</span>**

当你想让 AI 输出特定格式的 JSON、特定的 API 结构，或者奇葩的内部命名规范时，文字描述永远不如直接给几个例子。**AI 最擅长的就是“找规律”**。

<span style="color: #DC2626;">❌ **讲道理（容易翻车）**</span>

> 提取字符串里的时间，输出JSON，键名叫date，值格式为YYYY-MM-DD。

<span style="color: #10B981;">✅ **打个样（稳如老狗）**</span>

```text
提取时间并转换为标准 JSON。参考以下例子：
输入："明天下午三点开会" -> 输出：{"date": "2026-03-27"}
输入："后天交报告" -> 输出：{"date": "2026-03-28"}
现在处理输入："下周一发版"
```

#### **<span style="color: #334155;">流派三：Chain of Thought (CoT / 思维链) —— 强迫它慢思考</span>**

前面章节我们讲了推理模型（Reasoning）会自动打草稿。但如果你使用的是普通模型（如 Claude 3.5 Sonnet 或 GPT-4o），你可以在提示词末尾加上一句魔咒：**“请先一步步分析逻辑，然后再写代码”**（Let's think step by step）。

这会逼迫 AI 把脑子里的推导过程先写出来，极大降低复杂算法题和连环 Bug 修复的错误率。

#### **<span style="color: #334155;">流派四：Negative Prompt (负向约束) —— 告诉它“绝对不能干什么”</span>**

AI 有个毛病，喜欢“过度热心”，比如用一些杀鸡用牛刀的巨型库，或者写一堆废话注释。有时候防守比进攻更重要。

```markdown
重构这段列表渲染逻辑。
【绝对禁止】：
1. 绝对禁止引入 lodash 或任何外部第三方库。
2. 绝对禁止使用 class 类组件，必须使用 React Hooks。
3. 绝对禁止修改我原有的 CSS 类名。
```

### <span style="color: #0F172A;">2.4、Vibe Coding 心法：结对编程与接口先行</span>

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774527062643-35e72ff5-9d89-4e9f-b4a5-6806816bca24.png)

> 💡 **<span style="color: #2563EB;">核心实操建议</span>**
>
> **1. 接口先行 (Interface Driven)**：不要一上来就让 AI 把数据库、后端接口、前端页面一口气写完，大概率会崩溃。高手的做法是：**“先帮我把 User 和 Order 的 TypeScript Interface 接口定义写出来”**。你作为架构师，审阅完这些骨架没问题后，再对 AI 说：“骨架很好，现在去实现具体的业务逻辑。”
>
> **2. 防废话预填 (Prefill)**：如果你用的是 API 或高阶工具，在提示词末尾直接加上 ````javascript```` 或 `{`，这相当于代替 AI 敲下了代码的第一个字符，能 100% 强制 AI 闭嘴，直接输出纯净的代码，方便直接解析和运行。

***

## <span style="color: #1E40AF;">三、上下文工程与内存管理</span>

如果只钻研提示词，迟早会遇到瓶颈。因为对于Vibe Coding 来说：**光把提示词写出花来没用，决定项目成败的关键在于你怎么管理“上下文”（Context）。**

为什么？巧妇难为无米之炊。AI 懂世界上所有的代码语法，但它**不懂你公司的业务逻辑和你祖传代码库里的骚操作**。你必须把现有的代码和文档“喂”给它看。

### <span style="color: #0F172A;">3.1、核心痛点：什么是“上下文窗口”？</span>

上文我们讲了 Token（文字原子）。大模型没有一块永久保存记忆的“硬盘”，它每次回答你时，全靠一张临时的“办公桌”。这个办公桌的大小，就是**上下文窗口（Context Window）**，也可以理解为大模型的**“内存条（RAM）”**。

比如一个模型标注着“支持 200K 上下文”，意思就是它的办公桌最多只能同时摊开大约 20 万个 Token 的文件（相当于十几本厚厚的小说，或者几百个中等大小的代码文件）。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774527282249-63d03f80-9fc6-4d8d-82cc-71fe9f62b6b4.png)

#### **<span style="color: #334155;">滑动窗口（Sliding Window）与“金鱼记忆”</span>**

在 Vibe Coding 时，你和 AI 的对话会越来越长。当多轮对话积累的代码和聊天记录超过了模型的上下文上限时，会发生什么？系统并不会报错崩溃，而是会触发**“滑动窗口”**机制：**它会悄悄把你们最开始聊的内容（旧文件、老设定）从办公桌的边缘推下去扔掉，来给新输入的代码腾出空间。**

这就导致了典型的“金鱼记忆”：你在对话开头千叮咛万嘱咐的“必须使用 Tailwind 写样式”，聊到第 50 回合时，AI 突然开始给你写传统的 CSS 了——因为它已经把旧设定“滑”出了记忆窗口。

```bash
 聊天记录切片 (Chat History Log)
[Round 1] 你： 整个项目必须严格遵守 BEM 命名规范写传统的纯 CSS 文件，绝对禁止使用 Tailwind。
[Round 1] AI： 收到！我将严格遵循 BEM 规范，绝不使用 Tailwind。
... (经历了几十轮高强度的疯狂写代码，塞入了几万行新文件) ...
[Round 50] 你： 帮我给这个 Header 的返回按钮加个 Hover 状态。
[Round 50] AI： 没问题，代码已更新：
<button className="hover:bg-blue-500 text-white transition-all">返回</button>
(❌ 彻底失忆：开始疯狂输出 Tailwind 样式，把你第一轮的死命令全忘了)
```

#### **<span style="color: #334155;">为什么不把窗口做到无限大？（算力爆炸）</span>**

我们可能会问：既然容易忘，为什么 OpenAI /Claude不直接给模型配个无限大的上下文窗口？
这就得怪前面讲过的 Transformer“自注意力机制”了。它的计算量是**平方级增长（$O(n^2)$）**的！打个比方：参加派单，10 个人互相握手需要握 45 次；如果增加到 100 个人，握手次数不是增加 10 倍，而是飙升到 4950 次！

在 AI 脑子里，每多塞进去一个 Token，它都要和前面所有的 Token 互相“握手（计算关联度）”。所以 百万、千万级别上下文的模型，其背后的算力消耗是天文数字，极其昂贵。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774579076682-1f398331-8d7d-48ee-babf-e9050e068ecf.png)

#### **<span style="color: #334155;">Vibe Coding 的黑科技 —— 上下文缓存（Prompt Caching）</span>**

每次你在 Cursor 里提问，软件都要把你几十万行的代码库重新发给模型读一遍，这岂不是又慢又贵？
别担心，到了 2026 年，顶级大模型都支持了一项神级技术：**上下文缓存（KV Cache / Prompt Caching）**。

当你第一次把整个项目的代码发给 AI 时，AI 读完后会在云端存一份“超级书签（缓存）”。当你追问第二个问题时，AI 不需要重读几十万行代码，而是直接读取“书签”，瞬间作答！**这不仅让回答速度提升了 5 到 10 倍，还把 API 调用的成本直接砍掉了 80% 到 90%！**

#### **<span style="color: #334155;">“中间失忆症”（Lost in the Middle）</span>**

就算有了缓存，你也不能把全公司的垃圾代码全丢给 AI。研究表明，当你一次性给 AI 塞入巨量文件时，它对文件开头和结尾的记忆力极好，但会**完全忽略夹在中间的文件逻辑（呈现一个 U 型记忆曲线）**。并且，喂的无关代码越多，干扰项就越多，AI 产生幻觉的几率就越大。因此，**精准投喂，永远比胡乱塞满更重要。**

#### **<span style="color: #334155;">上下文压缩（Context Compression）—— 把“长篇大论”浓缩成精华</span>**

既然不能把全公司的代码一股脑塞给 AI，那遇到真正需要跨十几个文件的大型重构怎么办？这就需要用到上下文压缩技术。

打个比方：你想让新来的实习生修一个支付模块的 Bug，你是把全公司 10 万行代码全打印出来砸他脸上？还是只把支付相关的“接口文档”和“核心流程图”梳理成一页纸交给他？显然是后者。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774528230010-e9026247-2271-4a35-8ae3-39ea5fa81f81.png)

在 Vibe Coding 中，很多高级工具（如 Cursor 的 Codebase 索引机制、或者是 RAG 检索增强技术）会在底层悄悄帮你做这件事：它们在扫描你的项目时，不会把每个函数的大括号 `{}` 里面的具体实现细节都发给大模型，而是只提取函数名、参数类型、返回值（即 Interface Signatures），或者让一个小模型先对长文档进行“摘要提炼”。

这样一来，原本 10 万 Token 的代码山，被活生生压缩成了 5 千 Token 的“骨架目录”。大模型看了目录，如果觉得还需要某块的具体逻辑，再单独去调取那个完整文件。这完美解决了“中间失忆”问题，不仅逻辑更清晰，还能帮你省下一大笔 API 费用！

<span style="color: #94A3B8;">❌ 压缩前：臃肿的完整实现 (极其耗费 Token)</span>

```typescript
export class PaymentProcessor {
  private apiKey: string;
  
  constructor(key: string) {
    this.apiKey = key;
    // ... 100行初始化逻辑 ...
  }

  public async processCharge(amount: number, currency: string): Promise<boolean> {
    try {
      // ... 500行极其复杂的加密、网络请求、
      // ... 重试机制、日志埋点等具体实现逻辑 ...
      const response = await axios.post(...);
      return response.status === 200;
    } catch (e) {
      // ... 200行异常处理 ...
    }
  }
}
```

<span style="color: #10B981;">✅ 压缩后：提炼的接口签名 (极度省 Token)</span>

```typescript
// AI 只看这份骨架，就能完美推断如何调用支付功能
export interface IPaymentProcessor {
  /**
   * 处理扣款请求
   * @param amount 扣款金额
   * @param currency 货币类型 (如 'USD', 'CNY')
   * @returns 返回是否扣款成功
   */
  processCharge(amount: number, currency: string): Promise<boolean>;
}
```

### <span style="color: #0F172A;">3.2、上下文“投喂”的四个层级</span>

在 Cursor 这类 Vibe Coding 软件中，合理利用 `@` 功能精准引用文件，是区分新手和高手的标志：

**<span style="color: #0F172A;">1. 核心上下文（必须给）</span>**
当前你要改的 `app.js` 文件、终端里报的那一大段红色错误日志。不给这个，AI 就是瞎子。

**<span style="color: #0F172A;">2. 项目关联上下文（强烈建议）</span>**
你用到的自定义工具类（Utils）、相关的类型定义（Types）文件、UI 组件库文档。精准 `@` 这些文件，AI 才不会自己去瞎编不存在的函数。

**<span style="color: #0F172A;">3. 业务逻辑上下文（做大功能时给）</span>**
产品的需求文档（PRD）、后端的 API 接口文档（Swagger/Postman json）。让 AI 知道写这坨前端代码到底是为了从后端拿什么数据、解决什么实际问题。

**<span style="color: #0F172A;">4. 规范约束上下文（保持代码味道）</span>**
项目根目录里的 `.cursorrules` 或者团队代码规范指南（比如“本团队严禁使用 Any，必须写明 TypeScript 类型”）。这能让 AI 写的代码和你们团队的祖传风格“无缝融合”。

***

## <span style="color: #1E40AF;">四、Agent（智能体）：从“光说不练”到“全自动赛博打工人”</span>

如果你只掌握了提示词和上下文，你最多只能把 AI 当成一个“会写代码的打字机”——你发指令，它给代码，然后**你自己去把代码复制粘贴到文件里、自己去运行、自己看报错再粘贴给它**。这种体验在 2026 年早就落伍了。

现在Vibe Coding 的核心引擎叫做 **Agent（智能体）**。它可以自己创建文件、自己跑终端命令、报错了自己看日志然后自己改 Bug，全程不需要你插手！

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774575239460-f6455cef-045b-4276-8b6b-4001776a9756.png)

### <span style="color: #0F172A;">4.1、Agent的核心</span>

一个能帮你全自动撸代码的 Agent，内部其实由四个极其精密的模块组成：

🧠 **<span style="color: #0F172A;">大脑 (Brain / LLM)</span>**
Agent 的中央处理器（通常是 Claude 4.6 或 GPT-5.4 这种顶级推理模型）。负责理解你的宏大需求，并将其拆解成一步步可执行的小任务。

🗂️ **<span style="color: #0F172A;">记忆 (Memory)</span>**
分为**短期记忆**（当前聊天的上下文窗口）和**长期记忆**（通常用向量数据库 RAG 存储，它能记住你上个月跟它说的业务逻辑，随调随用）。

🗺️ **<span style="color: #0F172A;">规划 (Planning)</span>**
AI 不会像无头苍蝇一样乱撞。它会在后台生成一个 Task List（任务清单），先干啥、后干啥，如果某一步走不通，它还能动态调整接下来的计划。

🛠️ **<span style="color: #0F172A;">工具/手脚 (Tools)</span>**
这是 Agent 最牛的地方（底层技术叫 **Function Calling**）。它能在你的电脑上执行各种动作：查本地文件、写代码、跑终端 `npm start`、甚至自己打开浏览器搜索技术文档。

### <span style="color: #0F172A;">4.2、智能体的灵魂引擎：ReAct 循环 (Reason + Act)</span>

Agent 为什么能自己修 Bug？因为它在底层跑着一个叫做 **ReAct（思考与行动协同）** 的无限循环。普通的 AI 看到报错只会说“抱歉我错了，试试这个”，而 Agent 会像真正的人类程序员一样经历以下心路历程：

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774575440472-2783c5aa-a064-447f-854d-62850adb4014.png)

当你给 Agent 下达“帮我搭一个带登录界面的 React 项目”时，它会在后台飞速转动这个 ReAct 循环几十次：建文件夹 -> 思考 -> 写代码 -> 思考 -> 运行测试 -> 观察报错 -> 修改代码 -> 最终大功告成，交到你手上。

下面是一段真实的 **Agent 终端执行日志切片**。你可以清晰地看到它在遇到代码报错时，是如何像一个老手程序员一样：捕捉报错 -> 排查目录 -> 修改引用路径 -> 重新验证的闭环过程：

```bash
> Terminal Session - Agent Workspace Execution Log
[Agent] 执行命令： npm run build...
[Agent] 捕获报错： Failed to compile.
Module not found: Error: Can't resolve 'utils/helper' in '/src/components'
[Agent] 思考与分析 (Thought)： 找不到依赖模块。正在调用系统命令 `ls -la src/utils` 检查目录结构...
[Agent] 发现原因： 路径层级错误。当前文件在 /src/components 下，应该使用相对路径 '../utils/helper'。
[Agent] 采取行动 (Action)： 正在编辑文件 /src/components/Login.tsx...
-> 已将 `import { validate } from 'utils/helper'` 修正为 `'../utils/helper'`
[Agent] 重新验证： 重新执行构建命令...
[Agent] 观察结果 (Observation)： Compiled successfully! 🎉
[Agent] 任务闭环： Bug 已修复，项目构建成功，等待用户下一步指令。
```

_<span style="color: #64748B;">这种原生态的自主排错能力，正是 2026 年 Agentic Coding 彻底拉开与传统代码补全插件差距的硬核所在！</span>_

### <span style="color: #0F172A;">4.3、终极形态：多智能体协作 (Multi-Agent) —— 一个人就是一家公司</span>

如果你觉得一个全能 Agent 容易在复杂项目中出错（因为又当爹又当妈），那 2026 年的高阶玩法就是 **Multi-Agent（多智能体协作）**。你可以召唤一整个赛博开发团队来为你打工：

👔 **<span style="color: #334155;">产品经理 Agent</span>**
负责听你口述需求，上网查竞品，帮你整理出一份极其严谨的 Markdown 需求文档和系统架构图。

🧑‍💻 **<span style="color: #1D4ED8;">码农 Agent</span>**
接到产品经理的文档后，开始疯狂建文件、写业务逻辑、搭 UI 界面。

🕵️‍♂️ **<span style="color: #B91C1C;">质检员 (QA) Agent</span>**
躲在暗处，专门盯着码农写出的代码。它会自己编写单元测试用例，一发现 Bug 就把代码打回去让码农重写。

> 💡 **<span style="color: #2563EB;">Vibe Coding 提示</span>**
>
> 目前市面上的主流工具（如 Cursor 的 Composer、Windsurf 的 Cascade 功能、或是独立端工具 Devin），其实底层都是封装好的单体 Agent 或轻量级多智能体框架。你只要按快捷键呼出它们，输入**最高维度的指令（High-level Intent）**，剩下的脏活累活，它们自己会用 ReAct 循环帮你搞定。

***

## <span style="color: #1E40AF;">五、你的硬实力：就算开了挂，也得认识路</span>

看到这里，你可能觉得：有了这么强大的 Agent 和推理模型，我是不是就可以彻底躺平，不用懂编程了？
大错特错！**在 Vibe Coding 时代，你不再是搬砖的码农，而是项目经理和架构师。** 如果你不懂基本原理，Agent 即使写出一堆屎山代码或陷入死循环，你连哪里出了问题都看不出来。

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774575914736-9710c548-e7c6-44d4-a27e-3dff47d5fb8e.png)

#### <span style="color: #0F172A;">底线编程素养（不可或缺）</span>

🏗️ **<span style="color: #0F172A;">基础数据结构 & 逻辑</span>**
数组、对象、循环、条件判断。你必须能肉眼看懂 AI 写的这段逻辑对不对，时间复杂度是不是 $O(n^2)$，会不会卡死浏览器。

🏛️ **<span style="color: #0F172A;">宏观架构感</span>**
明白前后端怎么通信（API/HTTP），知道数据库怎么存东西。当需求复杂时，你需要指挥 AI：“先建数据库表，再写后端接口，最后弄前端页面”。

🔀 **<span style="color: #0F172A;">版本控制 (Git)</span>**
这是你的“后悔药”。让 Agent 大改代码前，**必须提交一次 Commit**！一旦 Agent 陷入死循环把代码改崩了，你能迅速一键回滚。

> 💡 **<span style="color: #2563EB;">心得</span>**
>
> 不用强迫自己记住所有的 API 和语法细节（这些是 Agent 擅长的），但你必须拥有**“审美能力”**——你能评判出什么样的代码是好代码，什么样的架构是稳健的。把脑力留给设计，把体力活交给 Agent！

#### <span style="color: #0F172A;">你能驾驭 AI 吗？</span>

想要知道自己是否已经具备了驾驭 AI 的底线硬实力？请对照下方清单打个勾。如果有超过 3 项还不清楚，建议先去补补编程基础，否则 AI 挖的坑会把你埋了：

* [   ] **肉眼辨识复杂度：** 你能一眼看出 AI 写的双层 `for` 循环是可怕的 $O(n^2)$ 复杂度，并在十万条数据时会卡死浏览器吗？
* [   ] **Git 回滚抢救：** 当 Agent 发疯把你原本完美运行的 5 个文件全改崩时，你知道如何用 `git reset --hard` 或 `git checkout` 瞬间恢复吗？
* [   ] **宏观架构直觉：** 当你想做一个“在线聊天室”时，你知道该指挥 AI 用 WebSocket 而不是让它写一堆 HTTP 轮询代码吗？
* [   ] **辨别幻觉包：** 当 AI 给你写了 `npm install auto-auth-magic` 时，你知道先去 npm 官网上搜一下这个包到底存不存在吗？
* [   ] **调试报错溯源：** 当终端报了一大串红色的 error错误时，你能大致猜出是依赖冲突或者语法错误等，而不是盲目地把整个报错抛给 AI 让它重写业务逻辑吗？

***

## <span style="color: #1E40AF;">六、总结</span>

![](https://raw.githubusercontent.com/jasper0529/picx-images-hosting/master/1774576268306-05817c7f-a408-4cda-8a4a-bb4a7592fe19.png)

**<span style="color: #0F172A;">支柱一：摸透模型 (懂它是怎么算出来的)</span>**
大模型本质上是基于 Transformer 架构的概率计算器，依靠 Token 吞吐信息。你知道了普通模型是“快思考”（容易幻觉），而 顶级推理模型（如 gpt、claude）能在后台“打草稿慢思考”。**懂了这些，你就知道什么时候该信它，什么时候该防着它的“一本正经胡说八道”。**

**<span style="color: #0F172A;">支柱二：结构沟通 (Prompt 不再是玄学)</span>**
放弃模糊的提问，把提示词当成 PRD（需求文档）来写。善用 **Few-shot（打个样）**、**思维链（强迫慢思考）** 和 **负向约束（告诉它绝不能干啥）**，并且掌握“接口先行”和“预填充”的节奏控制大法。

**<span style="color: #0F172A;">支柱三：投喂记忆 (打赢上下文保卫战)</span>**
上下文窗口极其昂贵且容易“中间失忆”。不要把屎山代码一股脑砸给 AI，而是学会 **上下文压缩** 和 **精准引用（@）**。把 10 万行的细节浓缩成 5 千行的骨架目录喂给它，这才是高手修复杂 Bug 的秘诀。

**<span style="color: #0F172A;">支柱四：驾驭 Agent (守住人类的底线)</span>**
AI 已经进化出了具备“手脚”和“ReAct 闭环”的自主智能体（Agent）。它可以全自动干活，但这并不意味着你能躺平。相反，**基础数据结构、宏观架构设计、Git 版本控制**，这三样硬实力是你驾驭这匹超跑的“方向盘”与“刹车”。