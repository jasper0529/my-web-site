---
title: Python 环境搭建
description: 详细介绍 Python 的安装方法、虚拟环境配置以及开发工具推荐。
---

# Python 环境搭建

本章节将帮助你完成 Python 开发环境的搭建，包括 Python 解释器安装、包管理工具配置以及开发环境设置。

## 安装 Python

### Windows 系统

1. 访问 [Python 官网](https://www.python.org/downloads/) 下载最新版本
2. 运行安装程序，**务必勾选 "Add Python to PATH"**
3. 验证安装：

```bash
python --version
pip --version
```

### macOS 系统

推荐使用 Homebrew 安装：

```bash
# 安装 Homebrew（如果尚未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Python
brew install python3
```

### Linux 系统

大多数 Linux 发行版已预装 Python。如需安装：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

## 虚拟环境管理

::: tip 为什么需要虚拟环境？
虚拟环境可以为不同项目创建独立的 Python 环境，避免依赖冲突，是 Python 开发的最佳实践。
:::

### venv（内置工具）

```bash
# 创建虚拟环境
python -m venv myproject

# 激活虚拟环境
# Windows
myproject\Scripts\activate
# macOS/Linux
source myproject/bin/activate

# 退出虚拟环境
deactivate
```

### Conda（推荐）

```bash
# 创建环境
conda create -n myproject python=3.11

# 激活环境
conda activate myproject

# 退出环境
conda deactivate
```

## 包管理工具

### pip 基本使用

```bash
# 安装包
pip install requests

# 安装指定版本
pip install requests==2.28.0

# 从 requirements.txt 安装
pip install -r requirements.txt

# 导出依赖
pip freeze > requirements.txt

# 升级包
pip install --upgrade requests

# 卸载包
pip uninstall requests
```

## 开发工具推荐

| 工具 | 类型 | 特点 |
|------|------|------|
| VS Code | 编辑器 | 轻量、插件丰富、免费 |
| PyCharm | IDE | 功能强大、专业版收费 |
| Jupyter Notebook | 交互式 | 适合数据分析和教学 |
| Thonny | IDE | 适合初学者 |

## 下一步

环境搭建完成后，可以继续学习 [数据类型](/python/basics/data-types)。
