---
title: ARM架构下编译安装Nmap7.95
date: 2026-03-20
tags: ['Linux']
description: 从 nmap 官方网站下载源代码并在 ARM 平台编译安装 nmap-7.95 的全过程，含常见依赖问题处理
---

## 下载源代码
从 nmap 官方网站下载源代码：[nmap](https://nmap.org/dist/)，这里以 `nmap-7.95.tar.bz2`（bzip2 压缩）为例。

```shell
# 使用 wget 或 curl 下载源代码（示例命令）
wget https://nmap.org/dist/nmap-7.95.tar.bz2
# 解压
bzip2 -cd nmap-7.95.tar.bz2 | tar xvf -
cd nmap-7.95 # 进入创建的目录
```

## 配置编译环境
在编译之前运行 `./configure` 脚本来配置编译环境：

```shell
./configure
```

`./configure` 常用参数说明：

+ `--prefix=<directoryname>` 决定 Nmap 及其组件的安装位置
+ `--without-zenmap` 不安装 Zenmap GUI（Zenmap 依赖 Python）
+ `--with-openssl=<directoryname>` 指定 OpenSSL 库位置
+ `--with-libpcap=<directoryname>` 指定 Libpcap 库位置，用于捕获网络数据包
+ `--with-libpcre=<directoryname>` 指定 PCRE 库位置
+ `--with-libdnet=<directoryname>` 指定 Libdnet 网络库位置，用于数据包操作

如果无需 GUI，可用：

```shell
./configure --prefix=/usr/local/nmap7.95 --without-zenmap
```

无报错即为成功。

<!-- 这是一张图片，ocr 内容为： -->
![](https://camo.githubusercontent.com/6e54708133d7304308880b197881ce073502690502a9a708c32f5222f383d329/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6368656e6a6230342f696d67406d61696e2f626c6f672f32303234303931333137323731392e706e67)

### 可能遇到的问题
1. 缺失 gcc

<!-- 这是一张图片，ocr 内容为： -->
![](https://camo.githubusercontent.com/f11e58fd1fede3dba070dab363eff43099bcc00e5396f911c8325969c857cd32/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6368656e6a6230342f696d67406d61696e2f626c6f672f32303234303931333137323233352e706e67)

安装：

```shell
dnf install gcc
```

## 编译
```shell
make
```

如果没有 `make` 命令，需要先安装：

```shell
dnf install make
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://camo.githubusercontent.com/348d249696190863228f3fc5f3976556d3f48927b87916b7fe54232330b92f8d/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6368656e6a6230342f696d67406d61696e2f626c6f672f32303234303931333137323930322e706e67)

### 可能遇到的问题
1. 缺失 gcc-c++

<!-- 这是一张图片，ocr 内容为： -->
![](https://camo.githubusercontent.com/d3ef7d52dbb730484f7eca9fb1715bf8e1975370ed7039b66968bf44af7bd17e/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6368656e6a6230342f696d67406d61696e2f626c6f672f32303234303931333137323831372e706e67)

安装：

```shell
dnf install gcc-c++
```

注意：

::: info
make 编译失败时，处理完错误后，需要 `make clean` 清理，再重新执行 `make`
:::

## 安装
```shell
make install
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://camo.githubusercontent.com/6c0897a6f0c1c0e449b4e87ec3df6f2bb9a085ccd4a58f01d799fc43c801fb98/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6368656e6a6230342f696d67406d61696e2f626c6f672f32303234303931333137323933342e706e67)

## 验证
```shell
/usr/local/nmap7.95/bin/nmap --version
```

看到以下结果即为成功：

<!-- 这是一张图片，ocr 内容为： -->
![](https://camo.githubusercontent.com/43c2a8cb7645ea3ffe76c8b3223dc43db22f6e85d31d4381e918ac8752314ad5/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6368656e6a6230342f696d67406d61696e2f626c6f672f32303234303931333137333030342e706e67)

如果希望在任意位置直接通过 `nmap` 命令访问 Nmap，可以添加软链接：

```shell
ln -s /usr/local/nmap7.95/bin/nmap /usr/sbin/nmap
```

加入软链接后，可在任意位置检查版本：

```shell
nmap --version
```
