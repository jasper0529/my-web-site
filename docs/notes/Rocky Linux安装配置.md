# 1. 简介


Rocky Linux 是一个社区驱动的企业级操作系统，旨在与 Red Hat Enterprise Linux (RHEL) 实现 100% 逐点兼容。随着 CentOS 8 生命周期的结束，Rocky Linux 已成为众多企业服务器的理想替代方案。

**主要特点**

+ **RHEL 100% 兼容**：作为 RHEL 的下游复刻版本，它能够无缝替代 CentOS 或 RHEL，支持 x86_64、aarch64 等多种硬件架构。
+ **企业级稳定性**：继承了 RHEL 严苛的稳定性、安全性和可靠性，适合承载金融、电信等行业的生产环境负载。
+ **开源且免费**：提供完全透明的开发流程和免费的安装镜像，无任何许可费用。
+ **云原生支持**：基于自研的 Peridot 构建系统，针对云端部署进行了优化。 

# 2.下载 Rocky Linux
目前最新版本是10.1，在正式安装前，需要下载系统的 ISO 镜像文件。

注意Rocky Linux对CPU有要求：

+ **CPU**：64位双核及以上（**注意：必须支持 `x86-64-v2` 微架构基线**，即 CPU 需包含 SSE4.2 和 POPCNT 等现代指令集。2010年以前的旧 CPU 如 Intel Core 2 Duo 将无法支持安装）
+ **内存**：最小 2GB（如果安装带图形界面的版本，建议 4GB+）
1. 访问 Rocky Linux 官方网站：[https://rockylinux.org/download](https://rockylinux.org/download)，官方网站下载较慢，推荐使用镜像源下载：[https://mirror.sjtu.edu.cn/rocky/10.1/isos/x86_64/](https://mirror.sjtu.edu.cn/rocky/10.1/isos/x86_64/)
2. 在下载页面选择 **Rocky Linux** 版本，我这里cpu架构比较老，选择了Rocky Linux 8版本。
3. 选择适合硬件架构的镜像（通常为 `x86_64` 或 `aarch64`）。
4. **镜像版本推荐：**
    - **Minimal (最小化镜像)**：适合服务器环境，只包含核心包，体积小（约 1.5GB - 2GB）。_（推荐选项）_
    - **DVD (完整安装盘)**：包含图形界面（GNOME）和大量软件包，适合无网络环境或工作站使用（约 9GB+）。
    - **Boot (网络安装盘)**：仅包含引导程序，安装时需联网下载软件包。

**提示：** 建议下载后校验 SHA256 值，确保 ISO 文件下载完整。

# 3.iso安装
iso可以选择制作启动U盘安装，我这里是使用的虚拟化环境安装，直接导入iso文件即可

# 4.系统安装
**选择安装项：** 出现 Rocky Linux 启动菜单时，选择 `Install Rocky Linux 8.10` 并回车。

<!-- 这是一张图片，ocr 内容为：ROCKY LINUX 8.10 INSTALL ROCKY LINUX 8.10 TEST THIS MEDIA & INSTALL ROCKY LINUX 8.10 TROUBLESHOOT ING PRESS TAB FOR FULL CONFIGURATION OPTIONS ON MENU ITEMS AUTOMATIC BOOT IN 46 SECONDS.. -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1773046760784-08cd09aa-4d7e-40f4-976a-c916ca83f992.png)

**架构支持注意：** 如果在尝试进入此图形安装界面前就遭遇了黑屏、卡死或内核崩溃（Kernel Panic），这通常是因为CPU 不满足最低的 `x86-64-v2` 微架构要求。如果使用的是较老的处理器，由于硬件层面缺少必需的指令集将无法完成引导。对于此类老旧硬件，建议降级安装生命周期较长的 Rocky Linux 8。

**选择语言：** 启动进入图形安装界面后，左侧选择 `中文`，右侧选择 `简体中文（中国）`，点击“继续”。

<!-- 这是一张图片，ocr 内容为：ROCKY LINUX 8.10 安装 ROCKV LI 帮助! 欢迎使用 ROCKY LINUX 8.10. 您在安装过程中想使用哪种语言? 简体中文(中国) SLOVENIAN SLOVENSCINA 繁体中文(台湾) ALBANIAN SHQIP 繁体中文(中华人民共和国香港特别行政区) SERBIAN CPNCKN LINUX 简体中文(新加坡) SWEDISH SVENSKA TAMIL EVA TELUGU TAJIK TOYNKN THAI BU TURKISH TURKCE YKPAIHCBKA UKRAINIAN URDU TIENG VIET VIETNAMESE MANDARIN CHINESE 中文 ZULU ISIZULU 在此处输入可进行搜索. 退出(Q) 继续(C) -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1773046854979-5cb40c45-b759-4c74-b73a-e9d3d4f91387.png)
**安装摘要配置：**

- 键盘/语言支持/时间和日期： 默认即可，确保时区改为 `亚洲/上海`。
-  **软件选择：**
    - 如果是服务器，左侧选择 `最小安装`。
    - 如果是个人工作站或需要桌面环境，选择 `带 GUI 的服务器` 或 `工作站`。
- **安装目标位置：**
    - 点击进入，选中目标硬盘。
    - 存储配置：一般选择 `自动`。如果熟悉分区，可以选 `自定义`，手动创建 `/boot`、`/`、`swap` 等分区（推荐使用 LVM 格式）。
    - 点击左上角“完成”。
- **网络和主机名 ：**
    - 点击进入，打开右上角的以太网开关，确保状态变为“已连接”并获取到 IP 地址。
    - 在左下角修改**主机名**（如：`server1.example.com` 或 `rocky10`），点击“应用”。
    - 配置IPV4地址，可以选择手动或者dhcp，看自己网络选择
    - 点击左上角“完成”。
- **用户设置：**
    - **Root 密码：** 设置一个强密码。根据安全策略，可以选择是否允许 root 通过 SSH 登录。
    * **创建用户：** 创建一个日常使用的普通用户（如 `admin` ），勾选 **“将此用户设为管理员”**（即赋予 sudo 权限），并设置密码。

<!-- 这是一张图片，ocr 内容为：安装信息摘要 ROCKY LINUX 8.10安装 ROCKY LINUX 帮助! 本地化 系统 软件 安装目标位置(D) 安装源(1) 键盘(K) 汉语 本地介质 已选择自动分区 KDUMP 语言支持(L) 软件选择(S) 已启用KDUMP 简体中文(中国) 最小安装 时间和日期(T) 网络和主机名(N) 亚洲/上海时区 有线(ENS18)已连接 安全策略(S) 用户设置 没有选择配置文件 ROOT密码(R) 已经设置ROOT 密码 创建用户(U) 将创建管理员用户ADMIN 开始安装(B) 退出(Q) 在点击"开始安装" 的纽前我们并不会操作您的磁盘. -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1773047334870-1e700343-ac75-485f-bae1-68f92461d890.png)

**开始安装：** 所有带感叹号的警告都解决后，点击右下角的 `开始安装`。

**重启：** 安装完成后，点击右下角的 `重启系统`

# 5.网络测试
系统重启后，输入创建的用户名和密码登录系统（或直接使用 root 登录）。

测试网络连接

```bash
ping -c 4 www.baidu.com
```

如果能正常返回数据包，说明网络正常。如果报错，检查网络接口。

# 6.更换镜像源

## 备份系统默认源
在修改源之前，建议先备份默认的 repo 配置文件：

```bash
cp -r /etc/yum.repos.d/ /etc/yum.repos.d.bak/
```

## 更换为国内镜像源（以阿里云为例）
Rocky Linux 默认的软件源服务器在国外，国内下载速度较慢。我们将源替换为阿里云镜像。

使用 `sed` 命令一键替换配置文件中的地址：

```bash
# 替换默认源地址为阿里云镜像
sed -e 's|^mirrorlist=|#mirrorlist=|g' \
    -e 's|^#baseurl=http://dl.rockylinux.org/$contentdir|baseurl=https://mirrors.aliyun.com/rockylinux|g' \
    -i.bak \
    /etc/yum.repos.d/[Rr]ocky*.repo

# 生成新缓存 (Rocky 10 推荐使用 dnf5，命令向下兼容)
dnf clean all
dnf makecache
```

<!-- 这是一张图片，ocr 内容为：MIRRORLIST |#MIRRORLISTLG' [ROOT@LOCALHOST ~]# SED - -E 'SLASEURL-HTTP://DL.ROCKSLINUX. ORALSCONTENTANTDIRLBASAURL-HTTPS://AITRORS.ALIVUN.CON/ROCKY UN.COM/ROCKY TINUX -I.BAK /ETC/YUM.REPOS.D/LRRLOCKY*.REPO [ROOT@LOCALHOST ~]# DNF CLEAN ALL 1个文件已删除 [ROOT@LOCALHOST ~]# DNF MAKECACHE ROCKY LINUX 8 - APE APPSTREAM ROCKY LINUX 8 - BASEOS ROCKY LINUX 8 - EXTRAS 上次元数据过期检查:0:00:01前,执行于2026年03月09日星期一17时41分51秒. 元数据缓存已建立. -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1773049361740-5bfbba31-032c-4fac-9192-3c2979b3fbcd.png)

# 7. 安装EPEL与系统更新
## 7.1 更新系统
第一次配置好镜像源后，强烈建议先将系统软件包更新到最新状态：

```bash
dnf upgrade -y
```

## 7.2 安装 EPEL 扩展源
EPEL (Extra Packages for Enterprise Linux) 提供了许多官方源中没有的优质软件包，是服务器必备。

```bash
dnf install epel-release -y
```

同样建议将 EPEL 替换为国内镜像（以阿里云为例）

```bash
sed -e 's!^metalink=!#metalink=!g' \
    -e 's!^#baseurl=!baseurl=!g' \
    -e 's!https\?://download\.fedoraproject\.org/pub/epel!https://mirrors.aliyun.com/epel!g' \
    -e 's!https\?://download\.example/pub/epel!https://mirrors.aliyun.com/epel!g' \
    -i /etc/yum.repos.d/epel{,-testing}.repo
    
# 更新仓库缓存
dnf clean all 
dnf makecache
```

## 7.3 安装常用工具软件
安装一些常用的系统管理、网络调试和开发工具：

```bash
dnf install -y vim wget curl tar unzip zip net-tools htop iotop sysstat bash-completion tree gcc make
```

# 8.防火墙配置
Rocky Linux 默认开启了 `firewalld`。

+ **查看防火墙状态：**

```bash
firewall-cmd --state
```

+ **如果是在安全的内网测试环境，可以选择关闭防火墙（生产环境不建议）：**

```bash
systemctl stop firewalld
systemctl disable firewalld
```

## 配置 SELinux
SELinux 提供强制访问控制。对于新手，SELinux 可能会导致一些权限问题。如果您在部署应用时遇到莫名其妙的权限拒绝，可以检查 SELinux。

```bash
sestatus
# 或
getenforce
```

+ **临时关闭 SELinux（无需重启）：**

```bash
setenforce 0
```

+ **永久关闭 SELinux（需重启生效，生产环境建议配置规则而不是直接关闭）：** 编辑配置文件：

```bash
vim /etc/selinux/config
```

将 `SELINUX=enforcing` 修改为 `SELINUX=disabled`，保存退出，然后重启系统（`reboot`）。

# 9.Node.js 安装
有时我们因为开发需求，需要指定版本的 Node.js 或希望通过源码编译进行底层优化。

## 9.1下载编译好的包
我们以 Node.js 的一个 LTS（长期支持）版本为例进行下载（[https://nodejs.org/zh-cn/download](https://nodejs.org/zh-cn/download)）。建议去 `/usr/local/src` 目录下进行编译工作：

<!-- 这是一张图片，ocr 内容为：下载NODE.JSR 的 NODE.JSR 获得适用于 和 且使用 V24.14.0(LTS) DOCKER LINUX NPM 提示 WANT NEW FEATURES SOONER? GET THE LATEST NODEJS VERSLON INSTEAD AND TRY THE LATEST IMPROVEMENTS! 1 非DOCKER 对每个操作系统都有特定的安装指导. 2 非 请参考HTTPS://DOCKER.COM/GET-STARTED/给出的官方文档 4 非 拉取 NODE.JS DOCKER 镜像: DOCKER PULL NODE:24-ALPINE 非创建 NODE.JS 容器并启动一个 SHELL 会话: 8 DOCKER RUN -IT --IM --ENTRYPOINT SH NODE:24-ALPINE 10 非 验证 NODE.IS 版本: 11 NODE -V # SHOULD PRINT "V24.14.0". 12 13非验证NPM版本 14 NPM -V # SHOULD PRINT "11.9.0". 复制到剪贴板 BASH DOCKER是一个容器化平台.如果遇到任何问题,请访问DOCKER的网站7 或者获得适用于 平台的NODE.JSR构建. X64 LINUX 独立文件(X) 阅读此版本的变更日志7或博客文章. 了解有关NODE.IS发布的更多信息,包括发布时间表和长期支持版本的状态. -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1773055636116-17f0d322-99f2-4124-baa3-62af375e730e.png)

```bash
cd /usr/local/src

# 下载好

# 解压源码包
tar xf node-v24.14.0-linux-x64.tar.xz

# 进入解压后的源码目录
cd node-v24.14.0-linux-x64
```

## 9.2 验证安装
```bash
./bin/node -v                                  // 执行node命令 查看版本
```

若能正常打印出相应的版本号，说明 Node.js 已成功安装到系统中。

## 9.3 配置软链接
<font style="color:rgb(51, 51, 51);background-color:rgb(250, 252, 253);">解压文件的 bin 目录底下包含了 node、npm 等命令，我们可以使用 ln 命令来设置软连接：</font>

```bash
ln -s /usr/local/src/node-v24.14.0-linux-x64/bin/npm   /usr/local/bin/ 
ln -s /usr/local/src/node-v24.14.0-linux-x64/bin/node   /usr/local/bin/
```

<!-- 这是一张图片，ocr 内容为：O [ROOT@LOCALHOST NODE-VE NODE 1NUX-X64 V24.14.0 LROOT@LOCALHOST NODE-V24.14.0-(INUX-X64]# NPM 11.9.0 -->
![](https://cdn.nlark.com/yuque/0/2026/png/52345579/1773055859365-670429f6-0843-4e40-8b87-a8d37234049c.png)

## 9.4 npm配置镜像源
npm官方源下载很慢，我们也需要修改成国内源，这里**<font style="color:rgb(0, 0, 0);">修改成淘宝镜像源</font>**

```bash
npm config set registry https://registry.npmmirror.com
```

<font style="color:rgb(51, 51, 51);">验证命令</font>

```bash
npm config get registry
```

<font style="color:rgb(51, 51, 51);">如果返回https://registry.npmmirror.com，说明镜像配置成功。</font>

# <font style="color:rgb(51, 51, 51);">10.git安装</font>
Git 是现代软件开发中最不可或缺的分布式版本控制系统。针对开发和运维工作，我们同样需要确保它正确安装和配置。

## 10.1 安装 Git
在 Rocky Linux 中，官方仓库提供的 Git 版本已经非常现代，足以满足绝大多数开发需求。我们可以直接通过包管理器快速安装：

```bash
dnf install git-all -y
```

_(注：如果由于特殊项目需求，必须要安装处于最新 Beta 阶段或特定版本的 Git，可以参考 Node.js 的流程，前往 _[_Git 官方代码仓库_](https://github.com/git/git/releases)_ 下载源码进行编译安装。)_

## 10.2 验证与基础配置
安装完成后，首先检查 Git 版本确认其已正确安装：

```bash
git --version
```

