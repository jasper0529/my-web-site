---
title: Git 使用技巧
date: 2024-03-15
tags: [Git, 版本控制]
description: Git 常用命令和实用技巧，提升版本控制效率。
---

# Git 使用技巧

Git 是开发者必备的版本控制工具，这里整理了一些常用技巧和最佳实践。

## 基础配置

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 设置默认分支名
git config --global init.defaultBranch main

# 设置默认编辑器
git config --global core.editor "code --wait"

# 查看配置
git config --list
```

## 常用命令速查

### 分支操作

```bash
# 查看所有分支
git branch -a

# 创建并切换分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature

# 删除本地分支
git branch -d feature/new-feature

# 删除远程分支
git push origin --delete feature/new-feature
```

### 提交历史

```bash
# 查看提交历史
git log --oneline --graph --all

# 查看特定文件的历史
git log -p filename

# 搜索提交信息
git log --grep="关键词"

# 查看某作者的提交
git log --author="作者名"
```

### 撤销操作

```bash
# 撤销工作区修改
git checkout -- filename

# 撤销暂存区
git reset HEAD filename

# 撤销最近一次提交（保留修改）
git reset --soft HEAD~1

# 撤销最近一次提交（丢弃修改）
git reset --hard HEAD~1

# 修改最近一次提交信息
git commit --amend
```

## 实用技巧

### Stash 暂存

```bash
# 暂存当前修改
git stash

# 暂存时添加备注
git stash save "备注信息"

# 查看暂存列表
git stash list

# 恢复最近的暂存
git stash pop

# 恢复指定暂存
git stash apply stash@{0}
```

### Cherry-pick 精选提交

```bash
# 将特定提交应用到当前分支
git cherry-pick commit-hash

# 多个提交
git cherry-pick hash1 hash2
```

### Rebase 变基

```bash
# 交互式变基（整理提交历史）
git rebase -i HEAD~3

# 变基到主分支
git rebase main
```

::: warning 注意
不要在公共分支上使用 rebase，会造成历史混乱。
:::

## 别名配置

```bash
# 设置常用别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.unstage "reset HEAD"
```

## 最佳实践

1. **提交粒度适中**：每个提交应该是一个独立的、完整的功能或修复
2. **写好提交信息**：简洁明了，说明"做了什么"和"为什么"
3. **分支策略**：合理使用 feature、develop、main 等分支
4. **定期同步**：及时拉取远程更新，减少冲突

## 参考资源

- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [Git 官方文档](https://git-scm.com/doc)
