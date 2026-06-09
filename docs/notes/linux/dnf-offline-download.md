---
title: 离线部署必备：如何使用 DNF 下载 RPM 包及其全部依赖
date: 2026-06-09
tags: ['技术笔记', 'Linux']
description: 在实际运维开发中，经常会遇到这样的场景： 生产环境处于内网，无法连接外网； 多台机器需要安装同一个软件，不想每台机器都重复占用带宽下载； 需要提前准备完整的软件安装包，统一拷贝到离线环境； 安全合规要求安装介质必须先经过审核，再进入生产环境。 这时候，我们就需要在一台可以联网的机器上，把 RPM…
---

在实际运维开发中，经常会遇到这样的场景：

- 生产环境处于内网，无法连接外网；
- 多台机器需要安装同一个软件，不想每台机器都重复占用带宽下载；
- 需要提前准备完整的软件安装包，统一拷贝到离线环境；
- 安全合规要求安装介质必须先经过审核，再进入生产环境。

这时候，我们就需要在一台可以联网的机器上，把 RPM 包及其所有依赖提前下载好，然后打包拷贝到离线环境中安装。

如果你使用的是 Fedora、RHEL 8+、CentOS Stream、Rocky Linux、AlmaLinux 等系统，`dnf` 就是完成这项工作的最佳工具之一。

本文将详细介绍如何使用 `dnf` 及相关工具，精准、完整地下载离线安装所需的 RPM 包和依赖包。



## 一、核心方案：使用 `dnf download` 插件

`dnf` 本身不一定默认提供“只下载不安装”的能力，这个功能通常由 `dnf-plugins-core` 插件包提供。

如果系统中还没有安装，可以先执行：

```bash
sudo dnf install dnf-plugins-core
```

安装完成后，就可以使用 `dnf download` 命令下载 RPM 包。



## 二、只下载指定包，不包含依赖

如果你明确知道目标机器已经具备所有依赖，只需要下载指定软件包本身，可以使用：

```bash
sudo dnf download <包名>
```

例如下载 `nginx`：

```bash
sudo dnf download nginx
```

默认情况下，RPM 包会下载到当前工作目录。

这种方式适合以下场景：

- 目标机器已经安装了所有依赖；
- 只需要补充某一个缺失的软件包；
- 你已经明确确认不需要下载额外依赖。

不过在离线部署中，仅下载软件包本身通常是不够的。



## 三、下载软件包及其依赖

离线部署最常用的参数是 `--resolve`。

```bash
sudo dnf download --resolve <包名>
```

例如：

```bash
sudo dnf download --resolve nginx
```

`--resolve` 会自动解析软件包所需依赖，并将依赖包一起下载下来。

但这里有一个非常重要的注意点：

> `--resolve` 默认只会下载当前系统中尚未安装的依赖。

也就是说，如果你在一台已经安装过很多软件的联网机器上执行该命令，有些依赖可能因为当前系统已经存在，所以不会被下载。

如果目标离线机器和当前联网机器环境完全一致，这通常没有问题。

但如果目标机器是纯净的 minimal 安装系统，或者目标环境与当前环境不一致，就可能出现依赖遗漏。



## 四、下载软件包及所有依赖：最稳妥方案

为了尽可能避免依赖遗漏，推荐加上 `--alldeps` 参数。

```bash
sudo dnf download --resolve --alldeps <包名>
```

例如下载 `nginx` 及其全部依赖：

```bash
sudo dnf download --resolve --alldeps nginx
```

这个命令会强制下载所有相关依赖，即使某些依赖已经安装在当前系统中，也会被下载下来。

因此，在制作完整离线安装包时，最推荐使用：

```bash
sudo dnf download --resolve --alldeps <包名>
```

这是离线部署 RPM 包时最稳妥的方式。



## 五、指定下载目录

默认下载到当前目录不太便于管理，建议使用 `--destdir` 指定下载路径。

需要注意：目标目录需要提前存在。

```bash
mkdir -p /tmp/nginx-offline
sudo dnf download --resolve --alldeps --destdir=/tmp/nginx-offline nginx
```

执行完成后，`/tmp/nginx-offline` 目录下就会包含 `nginx` 及其相关依赖的 RPM 文件。

后续可以直接打包：

```bash
tar -czvf nginx-offline.tar.gz -C /tmp nginx-offline
```

然后将压缩包拷贝到离线服务器中安装。



## 六、下载源码包 SRPM

有时候我们需要下载源码包，例如：

- 查看软件源代码；
- 重新编译 RPM；
- 修改 spec 文件；
- 分析补丁；
- 做安全审计。

在 DNF 4 中，可以使用：

```bash
sudo dnf download --source <包名>
```

例如：

```bash
sudo dnf download --source nginx
```

在 DNF 5 中，命令有所变化：

```bash
sudo dnf5 download --srpm <包名>
```

例如：

```bash
sudo dnf5 download --srpm nginx
```

如果不确定当前系统使用的是哪个版本，可以查看帮助：

```bash
dnf download --help
```

或：

```bash
dnf5 download --help
```



## 七、下载 Debuginfo 调试包

在排查 Core Dump、程序崩溃或性能问题时，可能需要 Debuginfo 包。

可以使用：

```bash
sudo dnf download --debuginfo <包名>
```

例如：

```bash
sudo dnf download --debuginfo nginx
```

Debuginfo 包通常来自专门的调试仓库。如果下载失败，需要检查 debuginfo 仓库是否启用。

查看当前仓库：

```bash
dnf repolist all
```

如果对应仓库没有启用，需要根据发行版文档开启 debuginfo 源。



## 八、备选方案：使用 `yumdownloader`

如果你习惯 RHEL 7 / CentOS 7 时代的工具，也可以使用 `yumdownloader`。

在新系统上可以通过 `yum-utils` 安装：

```bash
sudo dnf install yum-utils
```

下载软件包及依赖：

```bash
yumdownloader --resolve <包名>
```

指定下载目录：

```bash
yumdownloader --resolve --destdir=/tmp/pkgs <包名>
```

例如：

```bash
mkdir -p /tmp/nginx-offline
yumdownloader --resolve --destdir=/tmp/nginx-offline nginx
```

不过需要注意：

> `yumdownloader --resolve` 同样通常只下载当前系统中未安装的依赖，并不等价于 `dnf download --resolve --alldeps`。

如果需要完整下载所有依赖，更推荐使用：

```bash
sudo dnf download --resolve --alldeps <包名>
```

如果必须使用 `yumdownloader`，建议在一台纯净的容器或最小化系统中执行，尽量避免因当前系统已安装依赖而导致遗漏。



## 九、另一种方式：`install --downloadonly`

还有一种思路是让 DNF 模拟安装事务，但只下载不安装。

```bash
sudo dnf install --downloadonly --downloaddir=/tmp/pkgs <包名>
```

例如：

```bash
mkdir -p /tmp/nginx-offline
sudo dnf install --downloadonly --downloaddir=/tmp/nginx-offline nginx
```

这种方式的优点是：

- 会按照当前系统环境解析完整安装事务；
- 如果依赖无法满足，会直接报错；
- 适合验证依赖是否完整。

它的缺点是：

- 如果当前系统已经安装了该软件包；
- 或者当前系统已经是最新版本；
- DNF 可能会提示“无需安装”，从而不会下载 RPM 包。

因此，`install --downloadonly` 更适合用于模拟安装和依赖验证，不一定适合作为完整离线包制作方案。



## 十、拿到 RPM 后如何离线安装

将下载好的所有 `.rpm` 文件拷贝到离线机器的同一个目录中。

假设目录为：

```bash
/opt/offline-pkgs
```

推荐使用 `dnf` 安装目录下所有 RPM：

```bash
sudo dnf install /opt/offline-pkgs/*.rpm
```

这种方式比直接使用 `rpm` 更推荐，因为 `dnf` 会自动处理这些 RPM 包之间的依赖关系和安装顺序。

不推荐直接使用：

```bash
sudo rpm -ivh /opt/offline-pkgs/*.rpm
```

原因是 `rpm` 本身不会自动解决依赖顺序，容易出现依赖报错。



## 十一、进阶实践：制作本地 YUM/DNF 仓库

如果你需要在多台离线机器上批量安装软件，可以将 RPM 包目录制作成本地仓库。

首先安装 `createrepo_c`：

```bash
sudo dnf install createrepo_c
```

在 RPM 包目录中生成仓库元数据：

```bash
createrepo_c /opt/offline-pkgs
```

然后创建本地 repo 文件：

```bash
sudo vi /etc/yum.repos.d/offline.repo
```

写入以下内容：

```ini
[offline-repo]
name=Offline Repository
baseurl=file:///opt/offline-pkgs
enabled=1
gpgcheck=0
```

刷新缓存：

```bash
sudo dnf clean all
sudo dnf makecache
```

之后就可以像使用在线仓库一样安装软件：

```bash
sudo dnf install nginx
```

这种方式适合：

- 多台服务器批量部署；
- 内网统一软件源管理；
- 长期维护离线环境；
- 标准化运维安装流程。



## 十二、常用命令总结

| 需求 | 命令 | 适用场景 |
|  --- | ---  | ---   |
| 只下载包本身 | `dnf download <包名>` | 已确认目标环境不缺依赖 |
| 下载包和未安装依赖 | `dnf download --resolve <包名>` | 目标环境与当前环境基本一致 |
| 下载包和全部依赖 | `dnf download --resolve --alldeps <包名>` | 离线部署推荐方案 |
| 指定下载目录 | `dnf download --destdir=/path <包名>` | 规范管理离线包 |
| 模拟安装并下载 | `dnf install --downloadonly --downloaddir=/path <包名>` | 验证安装事务 |
| 下载源码包 | `dnf download --source <包名>` | 获取 SRPM 源码包 |
| 下载调试包 | `dnf download --debuginfo <包名>` | Core Dump 或调试分析 |
| 使用 yumdownloader | `yumdownloader --resolve <包名>` | 传统工具兼容场景 |



## 十三、推荐离线部署流程

以离线安装 `nginx` 为例，可以按以下步骤操作。

### 1. 在联网机器上安装插件

```bash
sudo dnf install dnf-plugins-core
```

### 2. 创建下载目录

```bash
mkdir -p /tmp/nginx-offline
```

### 3. 下载 nginx 及全部依赖

```bash
sudo dnf download --resolve --alldeps --destdir=/tmp/nginx-offline nginx
```

### 4. 打包离线安装目录

```bash
tar -czvf nginx-offline.tar.gz -C /tmp nginx-offline
```

### 5. 拷贝到离线服务器

可以通过 U 盘、内网跳板机、SCP、堡垒机或其他安全传输方式，将压缩包拷贝到离线服务器。

### 6. 在离线服务器上解压

```bash
tar -xzvf nginx-offline.tar.gz -C /opt
```

### 7. 安装 RPM 包

```bash
sudo dnf install /opt/nginx-offline/*.rpm
```

至此，离线安装完成。



## 十四、实践建议

为了减少离线安装失败的概率，建议注意以下几点：

1. **下载机器和目标机器系统版本尽量一致**

   例如目标机器是 Rocky Linux 9，就尽量在 Rocky Linux 9 的联网机器上下载。

2. **架构需要一致**

   例如 `x86_64`、`aarch64` 不要混用。

3. **仓库配置需要一致**

   如果目标环境使用的是特定版本仓库，下载机器也应该启用相同仓库。

4. **优先使用 `--resolve --alldeps`**

   这是离线部署时最稳妥的依赖下载方式。

5. **批量部署建议制作本地仓库**

   多台机器安装时，使用 `createrepo_c` 创建本地源会更稳定、更易维护。



## 结语

在内网环境、生产环境或批量部署场景中，提前下载 RPM 包及其全部依赖是一项非常实用的运维能力。

对于 Fedora、RHEL 8+、Rocky Linux、AlmaLinux 等系统，推荐优先使用：

```bash
sudo dnf download --resolve --alldeps --destdir=/tmp/offline-pkgs <包名>
```

这条命令可以最大程度避免依赖遗漏，是制作 RPM 离线安装包的核心方法。

如果只是临时下载，可以使用 `dnf download --resolve`；如果需要模拟安装事务，可以使用 `dnf install --downloadonly`；如果需要长期维护离线环境，则建议结合 `createrepo_c` 搭建本地仓库。

掌握这些方法后，再遇到内网服务器无法联网安装软件的问题，就不需要手动一个个查找依赖包了。
