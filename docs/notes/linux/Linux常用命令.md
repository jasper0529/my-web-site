---
title: Linux常用命令
date: 2026-03-20
tags: ['Linux']
description: Linux常用命令...
---

# 常用命令
### 清理缓存内存
```bash
sync; echo 3 > /proc/sys/vm/drop_caches
```

### 查找指定目录下包含指定字符串的文件
```bash
grep -r -l "字符串" 指定目录
```

+ r 表示递归搜索，即在指定的目录及其所有子目录中查找。
+ l 表示示只输出包含匹配字符串的文件名，而不是具体的匹配内容。

示例：

```bash
grep -r -l "python-requests" /usr/bin/python3.7.4/lib/python3.7/site-packages/requests/
```

### 查看指定目录下前10大的文件
```bash
du -ah /data | sort -rh | head -n 10
```

### curl 发送POST json请求
```bash
curl -X POST -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}' http://example.com/api
```

+ `-X POST`：指定请求方法为 POST。
+ `-H "Content-Type: application/json"`：设置请求头，告诉服务器发送的数据是 JSON 格式。
+ `-d '{"key1":"value1", "key2":"value2"}'`：指定要发送的 JSON 数据。
+ `[http://example.com/api](http://example.com/api)`：目标 API 的 URL。

### zip打包
```bash
zip -r myproject.zip myproject/
```

+ `-r`：表示递归打包，即包含目录中的所有子目录和文件。
+ `myproject.zip`：这是输出的压缩包名称，你可以根据需要自定义。
+ `myproject/`：这是你要打包的目录路径。

### 查看Page size大小
```bash
getconf PAGESIZE
```

### netstat安装
```bash
yum install net-tools
```

### 查看磁盘型号、厂商
```bash
lshw -class disk
```

```bash
-disk:0
       description: Disk
       product: ST500DM002-1BD142
       vendor: Seagate
       physical id: 0.0.0
       bus info: scsi@0:0.0.0
       logical name: /dev/sda
       version: 0004
       serial: S1D2GJBP608789
       size: 465GiB (500GB)
       capabilities: partitioned partitioned:dos
       configuration: ansiversion=5 sectorsize=512
```

<font style="color:rgb(44, 44, 54);">关键字段解释：</font>

+ **<font style="color:rgb(44, 44, 54);">description</font>**<font style="color:rgb(44, 44, 54);">：设备类型（如 "Disk"）。</font>
+ **<font style="color:rgb(44, 44, 54);">product</font>**<font style="color:rgb(44, 44, 54);">：磁盘型号（如</font><font style="color:rgb(44, 44, 54);"> </font>`<font style="color:rgb(44, 44, 54);background-color:rgba(175, 184, 193, 0.2);">ST500DM002-1BD142</font>`<font style="color:rgb(44, 44, 54);">）。</font>
+ **<font style="color:rgb(44, 44, 54);">vendor</font>**<font style="color:rgb(44, 44, 54);">：制造商（如</font><font style="color:rgb(44, 44, 54);"> </font>`<font style="color:rgb(44, 44, 54);background-color:rgba(175, 184, 193, 0.2);">Seagate</font>`<font style="color:rgb(44, 44, 54);">）。</font>
+ **<font style="color:rgb(44, 44, 54);">physical id</font>**<font style="color:rgb(44, 44, 54);">：物理标识符（用于硬件拓扑）。</font>
+ **<font style="color:rgb(44, 44, 54);">bus info</font>**<font style="color:rgb(44, 44, 54);">：总线信息（如</font><font style="color:rgb(44, 44, 54);"> </font>`<font style="color:rgb(44, 44, 54);background-color:rgba(175, 184, 193, 0.2);">scsi@0:0.0.0</font>`<font style="color:rgb(44, 44, 54);">）。</font>
+ **<font style="color:rgb(44, 44, 54);">logical name</font>**<font style="color:rgb(44, 44, 54);">：设备文件路径（如</font><font style="color:rgb(44, 44, 54);"> </font>`<font style="color:rgb(44, 44, 54);background-color:rgba(175, 184, 193, 0.2);">/dev/sda</font>`<font style="color:rgb(44, 44, 54);">）。</font>
+ **<font style="color:rgb(44, 44, 54);">version</font>**<font style="color:rgb(44, 44, 54);">：固件版本。</font>
+ **<font style="color:rgb(44, 44, 54);">serial</font>**<font style="color:rgb(44, 44, 54);">：磁盘序列号（唯一标识符）。</font>
+ **<font style="color:rgb(44, 44, 54);">size</font>**<font style="color:rgb(44, 44, 54);">：磁盘容量（如</font><font style="color:rgb(44, 44, 54);"> </font>`<font style="color:rgb(44, 44, 54);background-color:rgba(175, 184, 193, 0.2);">465GiB (500GB)</font>`<font style="color:rgb(44, 44, 54);">）。</font>
+ **<font style="color:rgb(44, 44, 54);">capabilities</font>**<font style="color:rgb(44, 44, 54);">：设备能力（如</font><font style="color:rgb(44, 44, 54);"> </font>`<font style="color:rgb(44, 44, 54);background-color:rgba(175, 184, 193, 0.2);">partitioned</font>`<font style="color:rgb(44, 44, 54);"> </font><font style="color:rgb(44, 44, 54);">表示已分区）。</font>
+ **<font style="color:rgb(44, 44, 54);">configuration</font>**<font style="color:rgb(44, 44, 54);">：配置信息（如扇区大小 </font>`<font style="color:rgb(44, 44, 54);background-color:rgba(175, 184, 193, 0.2);">sectorsize=512</font>`<font style="color:rgb(44, 44, 54);">）。</font>

### 删除某个目录下的文件
```bash
find /tmp -name "name*" -exec rm -rf {} +
```

