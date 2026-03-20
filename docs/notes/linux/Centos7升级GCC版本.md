---
title: Centos7升级GCC版本
date: 2026-03-20
tags: ['Linux']
description: 在 CentOS 7 上升级 GCC 版本可以通过多种方法实现, 这里使用个人认为最简单的方式升级，CentOS SCL + Centos7 + gcc4.8.5 ->gcc8.3.1 由于scl源在国外，有时候安装很慢，这里把源换成国内阿里源 + 修改CentOS-SCLo-scl.repo 内容...
---

<font style="color:rgb(31, 35, 40);">在 CentOS 7 上升级 GCC 版本可以通过多种方法实现, 这里使用个人认为最简单的方式升级，</font>`<font style="color:#F38F39;">CentOS SCL</font>`

## <font style="color:rgb(31, 35, 40);">环境信息</font>
+ <font style="color:rgb(31, 35, 40);">Centos7</font>
+ <font style="color:rgb(31, 35, 40);">gcc4.8.5 ->gcc8.3.1</font>

## <font style="color:rgb(31, 35, 40);">安装SCL仓库</font>
```shell
yum install centos-release-scl
```

## <font style="color:rgb(31, 35, 40);">配置SCL仓库源</font>
<font style="color:rgb(31, 35, 40);">由于scl源在国外，有时候安装很慢，这里把源换成国内阿里源</font>

+ <font style="color:rgb(31, 35, 40);">修改CentOS-SCLo-scl.repo</font>

```shell
# 备份
mv /etc/yum.repos.d/CentOS-SCLo-scl.repo  /etc/yum.repos.d/CentOS-SCLo-scl.repo.bak
# 写入阿里源
vim /etc/yum.repos.d/CentOS-SCLo-scl.repo
```

<font style="color:rgb(31, 35, 40);">内容如下：</font>

```shell
[centos-sclo-sclo]
name=CentOS-7 - SCLo sclo
baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/sclo/
# mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-sclo
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SC
```

+ <font style="color:rgb(31, 35, 40);">修改CentOS-SCLo-scl-rh.repo</font>

```shell
# 备份
mv /etc/yum.repos.d/CentOS-SCLo-scl-rh.repo  /etc/yum.repos.d/CentOS-SCLo-scl-rh.repo.bak
# 写入阿里源
vim /etc/yum.repos.d/CentOS-SCLo-scl-rh.repo
```

<font style="color:rgb(31, 35, 40);">内容如下：</font>

```shell
[centos-sclo-rh]
name=CentOS-7 - SCLo rh
baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/rh/
# mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-rh
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo
```

<font style="color:rgb(31, 35, 40);">清理缓存</font>

```shell
yum clean all
```

## <font style="color:rgb(31, 35, 40);">安装gcc8</font>
```shell
yum install devtoolset-8
```

## <font style="color:rgb(31, 35, 40);">临时启用devtoolset-8</font>
```shell
scl enable devtoolset-8 bash
```

<font style="color:rgb(31, 35, 40);">这将启动一个新的</font>`<font style="color:rgb(31, 35, 40);">shell</font>`<font style="color:rgb(31, 35, 40);">会话，其中</font>`<font style="color:rgb(31, 35, 40);">gcc</font>`<font style="color:rgb(31, 35, 40);">将指向</font><font style="color:rgb(31, 35, 40);"> </font>`<font style="color:rgb(31, 35, 40);">devtoolset-8 </font>`<font style="color:rgb(31, 35, 40);">提供的 GCC 版本</font>

## <font style="color:rgb(31, 35, 40);">验证gcc版本</font>
```shell
gcc --version
```

<font style="color:rgb(31, 35, 40);">输出类似于：</font>`<font style="color:#F38F39;">gcc version 8.3.1 20190311 (Red Hat 8.3.1-3) (GCC)</font>`

## <font style="color:rgb(31, 35, 40);">注意</font>
:::info
<font style="color:rgb(31, 35, 40);">使用scl是临时启用的shell，只有在当前shell中gcc版本才是8.3.1，不是全局生效的，不建议全局生效，因为不同软件的编译依赖gcc版本不同，使用scl能完美解决不同gcc版本的使用问题</font>

:::

