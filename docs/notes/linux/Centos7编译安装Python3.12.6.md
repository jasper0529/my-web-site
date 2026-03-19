---
title: Centos7编译安装Python3.12.6
date: 2026-03-19
tags: ['linux']
description: + Centos7 + Python3.12.6 访问Python的官方网站，下载最新的源码包,这里下载的是Python3.12.6 + --enable-optimizations 选项用于启用额外的优化，使 Python 运行更快。 + --prefix 指定python安装目录 + make ...
---

## <font style="color:rgb(31, 35, 40);">环境</font>
+ <font style="color:rgb(31, 35, 40);">Centos7</font>
+ <font style="color:rgb(31, 35, 40);">Python3.12.6</font>

## <font style="color:rgb(31, 35, 40);">下载Python源码</font>
<font style="color:rgb(31, 35, 40);">访问Python的</font>[<font style="color:rgb(31, 35, 40);">官方网站</font>](https://www.python.org/ftp/python/)<font style="color:rgb(31, 35, 40);">，下载最新的源码包,这里下载的是Python3.12.6</font>

```shell
wget https://www.python.org/ftp/python/3.12.6/Python-3.12.6.tgz
```

## <font style="color:rgb(31, 35, 40);">解压源码包</font>
```shell
tar xzf Python-3.12.6.tgz
cd Python-3.12.6
```

## <font style="color:rgb(31, 35, 40);">编译安装</font>
```shell
./configure --enable-optimizations --prefix=/opt/python3.12.6
```

+ `<font style="color:#F38F39;">--enable-optimizations</font>`<font style="color:rgb(31, 35, 40);"> 选项用于启用额外的优化，使 Python 运行更快。</font>
+ `<font style="color:#F38F39;">--prefix</font>`<font style="color:rgb(31, 35, 40);"> 指定python安装目录</font>

```shell
make altinstall
```

+ `<font style="color:#F38F39;">make altinstall</font>`<font style="color:rgb(31, 35, 40);">用于避免覆盖系统默认的 Python 版本。</font>

### <font style="color:rgb(31, 35, 40);">可能遇到的问题</font>
<!-- 这是一张图片，ocr 内容为： -->
![](https://camo.githubusercontent.com/d4824ebf6a4b3387c33dc36a2cf8f2df8170bdf4bb4043afba7bff99ad27428f/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6368656e6a6230342f696d67406d61696e2f626c6f672f32303234303931393230323735312e706e67)

<font style="color:rgb(31, 35, 40);">这是因为使用了</font>`<font style="color:#F38F39;">--enable-optimizations</font>`<font style="color:rgb(31, 35, 40);">,而gcc版本4.x比较低导致的，这里可以去掉这个参数编译，也可以升级gcc版本到8.x以上，建议升级gcc版本，参考升级gcc文章，</font>[Centos7升级GCC版本](https://www.yuque.com/rimo/egotqg/wn3idb6dmaic2h5g)

## <font style="color:rgb(31, 35, 40);">验证安装</font>
```shell
/opt/python3.12.6/bin/python3.12
```

<font style="color:rgb(31, 35, 40);">能够直接进入python shell</font>

## <font style="color:rgb(31, 35, 40);">设置软链接</font>
```shell
ln -s /opt/python3.12.6/bin/python3.12 /usr/bin/python3.12
```

<font style="color:rgb(31, 35, 40);">设置软链接后，终端可以直接</font>`<font style="color:#F38F39;">python3.12</font>`<font style="color:rgb(31, 35, 40);">执行</font>

## <font style="color:rgb(31, 35, 40);">设置pip</font>
<font style="color:rgb(31, 35, 40);">pip默认安装了，只需要设置下软链接即可</font>

```shell
ln -s /opt/python3.12.6/bin/pip3.12 /usr/bin/pip3.12
```

<font style="color:rgb(31, 35, 40);"></font>

