---
title: 无限域名邮箱打造
date: 2026-03-19
tags: ['邮箱']
description: 无限域名邮箱指的是一种可以生成多个别名邮箱地址的域名邮箱，这些别名都指向同一个主邮箱，用于接收邮件。这种方式的主要优点是保护隐私、方便管理邮件和减少垃圾邮件。 无限域名邮箱的核心在于“别名”的概念。你可以为你的域名邮箱设置多个别名，例如：yourname+alias1@yourdomain.com,...
---

# 什么是无限域名邮箱
无限域名邮箱指的是**一种可以生成多个别名邮箱地址的域名邮箱**，这些别名都指向同一个主邮箱，用于接收邮件。这种方式的主要优点是保护隐私、方便管理邮件和减少垃圾邮件。

## 原理
无限域名邮箱的核心在于“别名”的概念。你可以为你的域名邮箱设置多个别名，例如：`yourname+alias1@yourdomain.com`, `yourname+alias2@yourdomain.com`等等。这些别名实际上都指向同一个主邮箱，例如 `yourname@yourdomain.com`。当有邮件发送到这些别名邮箱时，都会被转发到你的主邮箱，实现“无限邮箱”的效果。

## 作用
AI工具的注册使用，懂的都懂

# 购买域名
首先要买一个域名，国内阿里和腾讯的都行，谁便宜买谁，新用户应该1块钱1年，老用户一年也不会超过10块钱，我这里买的是腾讯的，域名后缀也没有任何要求，还是哪个便宜买哪个，主打一个经济实惠。

腾讯云域名注册地址：[https://cloud.tencent.com/product/domain](https://cloud.tencent.com/product/domain)

阿里云域名注册地址：[https://wanwang.aliyun.com/domain](https://wanwang.aliyun.com/domain)

# 添加域名到<font style="color:rgb(47, 50, 56);">Cloudflare</font>
Cloudflare 是一个综合性的网络服务平台，通过其全球分布的网络和强大的安全、性能优化工具，帮助用户构建更安全、更快速、更可靠的互联网体验。

cloudflare非常强大，重点是能白嫖好多免费服务，人称“大善人”

<font style="color:rgb(47, 50, 56);">我们先登录一下Cloudflare，没有账号就去注册一个。入口：</font>[https://dash.cloudflare.com/login](https://dash.cloudflare.com/login)

进入主页，添加域名，就是我们注册的那个域名，加入进去，配置默认即可，点击继续。

<!-- 这是一张图片，ocr 内容为：桃户主页 提升站点的速度和安全性 DISCOVER 连接您的域,开始通过CLOUDFLARE发送WEB流量. 中按照学习路径完成学习 LOG EXPLORER 输入现有域或注册新域 分析和日志 9 EXAMPLE.COM 安全中心 快通扫描DNS记录 推荐 吉 CLOUDHE将扫码考见的DNS 记录并为您导入这些记录. 手动输入DNS记录 高级 上传DNS区域文件高级 控制AI爬网程序如何访问您的站点 负就平衡 阻止AL起网程序在未经您许可的情况下抓取内智运行训练. IP地址 阻止AL训练自动程序 不阻止(关) 已在所有页面上阻止 仅在带有广告的主机备上阻止 ZERO TRUST 允许A自动程序排服内客 将在是示广告的子城上阴止A训练自前是序, 向自动程序将无法抓取送站点上的任何内容 在其他位喜不明止 计算(WORKERS) 使用ROBOTS.TXT管理AL自动程序流量 存德和数据车 继续 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753068903069-8488ebfb-b27c-41c2-b811-d2d42db7813b.png)

这里选择免费计划就行

<!-- 这是一张图片，ocr 内容为：FREE 计划 抵述 全返回 AI市核 为心.CO... 选择计划 LOG EXPLORER 按年付费(最多可节省20%) 按月付费 那个计划适合您?G 分析和日志 DNS 电子邮件 SSL/TLS 安全性 ENTERPRISE BUSINESS PRO 最热门 FREE ACCESS US$240/年 US$2,400/年 US$20/月 US$O 自定义 US$200/月 速度 选择计划 选择计划 联系销售人员 选择计划 缓存 为个人或简单网站提供基本保护和性能. 为专业网站和WB应用程序提供部外的安全性和速度. 为在装业务得供高级的安全性.可靠性和支持. 针对任务关解型WAB内容的自定义方案,提供高级支持. FREE计划的所有权益+ BUSINESS计划的所有权益+ PRO计划的所有权益+ WORKERS 路由 非计量应用程序层DDOS 保护 使用WAF防范未知应用程序漏洞 使用WAF抵润常见攻击,包括 OWASP 漏洞 基于IP的速率限制 高级WAF和速率限制 规则 符合PCI和SOC2II类标准 高级DDOS保护 使用WAF防范零日威胁 使用WAF防范严重性效高目广泛存在的晶润 谱误页面 检测 WEB 应用上的悬第三方脚本并接收管报 检测和质询易于检测的自动程序 API GATEWAY 仅检测和质询常见自动程序 阿塔 自定义SSL证书 企业自动程序管理 优先加载关键站点资产 日志 检测和质询复杂的自动程序 快速,易用的DNS 流量 单一登录(SSO)支持 一键式图像优化 自定义名称服务器 全球CDN SCRAPE SHIELD CDN优化的缓存分析 客户成功支持 100%运行时间保证(SLA) 规则 *70 CLOUDFLARE 规则J 规则 规则 规则 WEB3 5WAF规则 450CLOUDFLARE规则 225 CLOUDFLARE规则 2.700 CLOUDFLARE 规则 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753069014636-637cdaef-4c22-45a4-a37f-b3859abfb003.png)

这里选择继续前往激活

<!-- 这是一张图片，ocr 内容为：FREE  计划 名称服务带无效 概述 未找到WWW子域的A AAAA或CNAME记录,将无法解 了域. 来找到指向根域的A,AAAA或CNAME记录.将无法解 A  域. LOG EXPLORER 您的流量几乎已准备好使用代理 中代理的工作方式 分析和日志 您的DNS 记录会告诉CLOUDFLARE  您的WEB内容在哪里托管,因此我们可以隐蔽源服务器并代理念的WEB流显. DNS 已代理:HTTP流显将经过CLOUDHARE网络,缓存,答能接击和WEB应用程序防火培等服务需要. 电子邮件 仅DNS:HTTP流量将领过CLOUDLARE,直接到达评服务器,但DNS 解析仍然使用开受益于我们快速的安全网络. SSL/TLS 灰色云表示代理已美闭,没有云表示记录不符合代理条件. 安全性 管理 的DNS 中关于DNS记录 ACCESS DNS设置:完全 导入DNS记录 通度 搜索 DNS 记录 缓存 添加记录 WORKERS 路由 名称R 代理状态 内容R TTL O 类型 R 操作 规则 NS 仅DNS 自动 删除 错误页面新 NS 自动 仅DNS 删除 网络 流量 继续的往激活 SCRAPE SHIELD WEB3 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753069117865-e401f434-7ab7-426d-8010-7df5b37ee6f9.png)

<font style="color:rgb(33, 37, 41);">下面需要复制页面中第三点对应的服务地址，然后切换回到腾讯云的管理页面</font>

<!-- 这是一张图片，ocr 内容为：FREE计划 :星号 名称服务曙无效 在ICANN查找C上查找您的注册机构 转到域概述 如果您是通过经销商(例如,SQUARESPACE)购买的域或使用单独的DNS提供 商,请登录该帐户. 甲 AI审核 BETA LOG EXPLORER 2.确保 DNSSEC 已关闭 G 分析和日志 找到并关闭DNS安全(DNSSEC)设置(如果打开).您以后可以通过 CLOUDFLARE重新启用. DNS 旧提供商特定说明 电子邮件 世 SSL/TLS 3.将您当前的名称服务器替换为CLOUDFLARE名称服务器 安全性 此步骤不太可能导致停机,但您可以跳过此步骤,先检查您的DNS记录. A.查找名称服务器部分 ACCESS B.同时添加您已分配的两个CLOUDFLARE名称服务器: 速度 单击以复制 缓存 WORKERS路由 以复制 规则 C.删除您的其他名称服务器: X ZOO.DNSPOD.NET 错误页面 X TWIG.DNSPOD.NET D.保存您的更改 网络 流量 旧提供商特定说明 SCRAPE SHIELD 需要帮助?请按照我们的设置文档C操作或访问我们的支持门户. WEB3 继续 折叠边栏 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753069320069-4b17264f-e63c-4f69-a90e-a546bd24906d.png)

回到腾讯云管理页面：[https://console.cloud.tencent.com/domain/all-domain/all](https://console.cloud.tencent.com/domain/all-domain/all)

<!-- 这是一张图片，ocr 内容为：NONE +68 6腾讯云 工具 主账号 域名注册 开发小程序无从下手?CODEBUDDY内造税信启方开发文在,无能对接开发,5分许接转预行查吉详情> 全新开发 我的域名 管理DNS解价 体验调研 获得年助 鑫清小程序 技术交通部 急需快费 全部域名 急需融间 未实名认证 我的域名 如果最无法后终备系来提供到的部落部队通过放高过放高线国际导,直过型斯际号(新G(系G(系统各,请控制同行到进行到进行到进行驶行. 请者纳曼,意后指月! 日 因接省过产,将将等导致植物有者份有效生态理的,请及时交要最在的形象:易确以不同张热或转回的两名资源,通及斯注输省数,了解连体 提示 展开 使用工后部组织质定,原和自由后两元组织部以下测名局整MMA.09,HA,上,双网,509.509项目,转入步后号,三位生动时至行后. 中国移动 批是规作 搜索域名 转入域名 更多规作 批星操作 点击快速等出减名列表X 口 操作日表 注册时间 自动候景 注册商: 域名* 送作 到期时间* 安全领 服务状态 DNS状态了 亲思曾 2024-08-22  20:11:48 其他 西 正常 DNSPOD 2025-07-21 0551 陈家宝 开房自动续典 添加成名伊雅 下姚域名证书 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753069413472-1e02f77e-e94d-4b62-b180-3657bc89cb8c.png)

点击修改dns服务器，刚才复制的填进去

<!-- 这是一张图片，ocr 内容为：请及时变 修改DNS服务器 后缓.NAN DNS服务器,可指定为当前域名提供ONS 解折的服务商,如更改有误可能影响当前解析服务,请谨值操作 量操作 推荐使用DNSPOD解折服务,选择后将自动匹配当前最佳DNS服务器(如无法识别将使用默认DNS) 由于各地网络运普商存在缓存,修改后一股24小时内刷新生效,最长需要48小时,请您耐心等待 到期时间 域名 2025-08-23 07:59 使用DNSPOD DNS服务器 自定义DNS 推荐 2026-07-2111:05 COM +添加DNS 提交 取消 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753070007631-cd45536e-9ab1-4626-a3fb-e44254dc307a.png)

再回到<font style="color:rgb(47, 50, 56);">Cloudflare，点击继续</font>

<!-- 这是一张图片，ocr 内容为：名称服务器无效 众星号 FREE 计划 单击以复制 2C30B17D2426B157BECB32125 概述 单击以复制 单击以复制 RE.COM 曲 AI审核 BETA 获取您的API令牌 C.删除您的其他名称服务器: LOG EXPLORER API文档口 X ZOO.DNSPOD.NET 分析和日志 X TWIG.DNSPOD.NET D.保存您的更改 高级操作 DNS 品 提供商特定说明 从CLOUDFLARE删除 区电子邮件 SSL/TLS 需要帮助?请按照我们的设置文档心操作或访问我们的支持门户. 安全性 注册机构最多需要24小时处理名称服务器更改(大多数情况下会更快).当 ACCESS CLOUDFLARE上激活时,我们会向您发送电子邮件. 速度 处于挂起状态已时,CLOUDFLARE会响应您的已分配名称服务器上的 DNS查询. 缓存 激活后,SSL/TLS.DDOS 保护,缓存和其他自动优化,将在代理的DNS记录以及终预先配置的任何自 定义设置中生效. WORKERS路由 念 规则 立即检查名称服务器 CLOUDFLARE会定期检查是香有名称服务器更新. 错误页面 网络 流量 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753070147774-3f5b0185-35d9-45e4-b63f-865906bf66fd.png)

然后现在还是无效的，点击立即检查名称服务器，等待10几分钟，有点慢,变成“活动“即为正常

<!-- 这是一张图片，ocr 内容为：FREO  计划 食星号 活动 您为什么选择FREE计划?分享您的反馈 概述 AI 市核 BATA 概述 LOG EXPLORER DNS 分析和日志 的安全性和性能,通过菜单配置产品和服务. 监视 DNS 设置:完全 DNS 中间顾 CLOUDFLARE 基础知识 DNS 记录 电子邮件 好消息!CLOUDFLARE正在保护您的站点 控制AI爬网程序 SSL/TLS 有关您站点的使用情况的数据可用后将位于此处. 安全性 阻止AI训练自动程序 部导CLOUDFLARE规则来阻止我们归类为AL起网程度的自动 ACCESS 程序访问您的网站. 建议 陷藏 速度 已在所有页面上阻止 查看自动程序列表,了解更多信息口 缓存 加快您的网站或应用程序的速度 WORKERS路由 使用ROBOTS.TXT管理AI 自动程序流是 品BETA 打开建议的图像,内容和协议设置. 创建首更新卷的ROBOTS.BXT文件,以表明容的内容不应用于 规则 AL训练,这不会影响SEO. 转到速度优化 了解更多 错误页面 R 网络 快速操作 流量 UNDER ATTACK 模式 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753078325625-c0230f50-6ab1-4c7a-8d72-5710ff999695.png)

# 配置电子邮件路由
在主页面找到电子邮件路由，点击开始使用

<!-- 这是一张图片，ocr 内容为：活动 金星号 FREE 计划 目 概述 电子邮件 电子邮件路由 甲 AI审核 创建自定义电子邮件地址,在您不希望共享主要电子邮件地址时使用. LOG EXPLORER 电子邮件路由文档 分析和日志 DNS 品 开始使用 电子邮件 区 电子邮件路由 DMARC管理 电子邮件安全 SSL/TLS 安全性 私密设计.我们不会存储或浏览您的电子邮件. ACCESS 简单,免费.任何人都可以为他们的域创建地址. 速度 发送到您的首选邮箱.路由到您最常使用的邮箱,如GMAIL或 OUTLOOK. 缓存 WORKERS 路由 规则 错误页面 新 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753078487430-38817870-c6bc-4063-b1d6-f7e15d2ec151.png)

然后配置自定义地址和目标地址，目标地址这里使用常用的邮箱即可。qq、163等都行，然后点击创建并继续



<!-- 这是一张图片，ocr 内容为：众星号 活动 FREE计划 概述 电子邮件路由入门指南 甲 AI市核 此过程将指导您创建自定义地址,并配置您的DNS来为此域启用电子邮件路由. LOG EXPLORER 创建自定义地址 分析和日志 添加您想要用来接收电子邮件的自定义地址以及要执行的操作,在路由传入电子部件之前,将向新目标地址发送确认. DNS 电子邮件 区 电子邮件路由 自定义地址 DMARC管理 SIA RIMO 电子邮件安全 操作O 母 SSL/TLS 发送到电子邮件 安全性 目标 ACCESS 1.COM 速度 缓存 WORKERS 路由 规则 出口 跳过入门指南 创建并继续 错误页面新 网络 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753078943169-119f76ab-d751-4b71-ac55-5c379e764a2f.png)

然后会发送一个验证邮件，我们登录到自己配置的邮箱上验证一下就行

<!-- 这是一张图片，ocr 内容为：星号 FREE 计划 概述 电子邮件路由入门指南 AI审核 此过程将指导您创建自定义地址,并配置您的DNS来为此域启用电子邮件路由. LOG EXPLORER 验证目标地址 分析和日志 为了保护也的安全,我们运安全任新的目标也址,我们已向提供的目标地址发送了确认电子每件,请给真目标地也子的件并按照是示程保示程作, DNS 区电子邮件 目标地址 状态 ?    得验证 车新发送电子邮件 GG.COM 电子邮件路由 DMARC 管理 电子邮件安全 上一个 继续 跳过入门指南 SSL/TLS 安全性 ACCESS 速度 缓存 WORKERS 路由 错误页面新 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753079094050-ad5a00ca-e608-4d40-addc-1092bfaabe89.png)

验证完成后，选择继续，添加记录并且启用

<!-- 这是一张图片，ocr 内容为：女星号 活动 FREE 计划 目 概述 电子邮件路由入门指南 AI市核 BETA 此过程将指导您创建自定义地址,并配置您的DNS来为此域启用电子邮件路由. LOG EXPLORER 配置DNS 分析和日志 新要将MX和议T记录的组合添加到您的DNS中,电子的件路由才能正常工作,MX记录允许您的战绩收电子部件,TXT记录配置为完许您的 DNS 域向您的首选电子邮件提供商发送传入电子邮件. 电子邮件 区 电子邮件踏由 必需记录 DMARC 管理 LOVECX330.ASIA上需要下面列出的记录来启用电子部件路由.MX记录分许您的域接收电子邮件,TXT记录 电子邮件安全 配置为允许您的域向您的首选电子邮件提供高发送传入电子邮件. SSL/TLS 状态 优先级 主机名 值 记录类型 安全性 2003CIA ROLMX.CLOUDFLAR... 99 MX 丢失 ACCESS -LOUDFLAR.... 26 ROUTE. MX 云失 速度 CLOUDFLAR... MX 12 ROUTE 丢失 缓存 CF2024-1.DOMSINLROULOUACW950 -IA "VDKIMA1HSHA25.... TXT 云失 WORKERS路由 'V-SPF1 TXT 丢失 规则 措误页面 网络 添加记录并启用 上一个 流量 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753079583297-08b9f542-0d6c-4781-a771-463a0cb43062.png)

查看状态 都正常

<!-- 这是一张图片，ocr 内容为：活动 星号 FREE 计划 概述 电子邮件 电子邮件路由 甲 AI审核 创建自定义电子邮件地址,在您不希望共享主要电子邮件地址时使用. LOG EXPLORER 电子邮件路由文档 分析和日志 路由规则 电子邮件WORKERS设置 概述 目标地址 DNS 电子邮件 配置摘要 电子邮件踏由 DMARC 管理 电子邮件安全 目标地址 DOMAIN DNS记录 路由状态 自定史地址 1 1 母 已启用 SSL/TLS 电子邮件 DNS 记录已邮置 安全性 ACCESS 电子邮件路由摘要 过去7天 速度 缓存 发送失败 已被除 其他 已拒绝 已转发 接收总数 WORKERS 路由 0 0 0 0 0 规则 选定时间间隔内未收到电子邮件. 错误页面法 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753079862487-62770dbe-24c5-48a9-bf48-53522d3adc7d.png)

然后点击路由规则，查看<font style="color:rgb(49, 49, 49);">Catch-All是否启用，没有启用的点启用一下。</font>

<!-- 这是一张图片，ocr 内容为：活动 大星号 FREE 计划 1 概迷 电子邮件 电子邮件路由 面 AI市核 创建自定义电子邮件地址,在您不希望共享主要电子邮件地址时使用. LOG EXPLORER 电子邮件路由文档 分析和日志 概述 设置 电子邮件WORKERS 目标地址 路由规则 DNS 电子邮件 CATCH-ALL 地址 电子邮件踏由 启用CATCH-ALL地址可以为USER.COM中的所有其他电子邮件地址设置操作. DMARC 管理 CATCH-ALL规则仅适用于区域级域,您无法为每个子域创建CATCH-ALL规则. 电子邮件安全 状态 目标 操作 自定义地址 SSL/TLS 安全性 活动 编辑 CATCH-AI 甜除 ACCESS 速度 自定义地址 创建自定义电子邮件地址并设置要对收到的电子邮件执行的操作. 缓存 DOMAIN SEARCH ACTION WORKERS 路由 ALL ACTIONS 创建地址 ALL DOMAINS 规则 操作 自定义地址 状态 目标 铝误页面断 发送到电子邮件 活动 @QQ.COM 牌鞋 网络 流量 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753079957903-93187bbd-7c4e-47a0-a581-e9bb09296e1a.png)

然后点击编辑，修改一下它的行为，目前看是“删除“，改成“发送邮件”

<!-- 这是一张图片，ocr 内容为：金星号 活动 FREE 计划 概述 一返回 西 AI审核 编辑 CATCH-ALL 地址 LOG EXPLORER 信用CATCH.AL地址可以为USERCON 中的所有其他电子部件施壮设置保作,CATCH.AL规则区适用于区域级域,但无法为每个子战力建CATCH.ALL 规则 分析和日志 DNS 操作R 发送到电子邮件 区 电子邮件 电子邮件路由 目标 DMARC 管理 WAQ.COM 电子邮件安全 SSL/TLS 安全性 ACCESS 取消 保存 速度 缓存 WORKERS路由 规则 -->
![](https://cdn.nlark.com/yuque/0/2025/png/52345579/1753081521145-598db8bf-900a-4f68-b00f-b871a146dcac.png)

到此就配置完了，测试一下。

# 测试
使用我们的正常邮箱发送邮件到你的域名，域名这里任意字符都行，例如：`yourname+alias1@yourdomain.com`, `yourname+alias2@yourdomain.com`等等



