---
title: 代码组与阅读统计功能演示
date: 2024-01-15
tags:
  - VitePress
  - 教程
  - 前端
head:
  - - meta
    - name: robots
      content: noindex, nofollow
---

# 代码组与阅读统计功能演示

本文将演示 VitePress 博客的新功能：代码组（带图标）、Mac 风格代码块以及阅读字数和时间统计。

## Mac 风格代码块

现在所有的代码块都会显示 Mac 风格的三个小圆点（红、黄、绿），让代码块更加美观。

### 单个代码块示例

```javascript
// JavaScript 代码示例
function greet(name) {
  console.log(`Hello, ${name}!`)
  return {
    message: `Welcome to VitePress`,
    timestamp: new Date()
  }
}

greet('World')
```

```python
# Python 代码示例
def calculate_sum(numbers: list) -> int:
    """计算列表中所有数字的和"""
    return sum(numbers)

result = calculate_sum([1, 2, 3, 4, 5])
print(f"结果是: {result}")
```

```typescript
// TypeScript 接口定义
interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}

function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  return {
    id: Math.random(),
    createdAt: new Date(),
    ...data
  }
}
```

## 代码组功能（带图标）

代码组功能允许你在多个代码块之间切换，并且会自动显示对应语言的图标。这对于展示同一功能在不同编程语言中的实现非常有用。

### 安装命令示例

::: code-group
```sh [npm]
npm install vitepress-plugin-group-icons
```

```sh [yarn]
yarn add vitepress-plugin-group-icons
```

```sh [pnpm]
pnpm add vitepress-plugin-group-icons
```

```sh [bun]
bun add vitepress-plugin-group-icons
```
:::

### 多语言示例

以下展示了如何在不同编程语言中实现一个简单的 HTTP 请求：

::: code-group
```javascript  [JavaScript]
// JavaScript - 使用 fetch API
async function fetchData(url) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

// 使用示例
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
```

```python [Python]
# Python - 使用 requests 库
import requests

def fetch_data(url):
    """发送 GET 请求并返回 JSON 数据"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        print(f'请求失败: {error}')
        raise

# 使用示例
data = fetch_data('https://api.example.com/data')
print(data)
```

```go [Go]
// Go - 使用 net/http 包
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

func fetchData(url string) (map[string]interface{}, error) {
    resp, err := http.Get(url)
    if err != nil {
        return nil, fmt.Errorf("请求失败: %w", err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    var data map[string]interface{}
    json.Unmarshal(body, &data)
    return data, nil
}
```

```rust [shell]
// Rust - 使用 reqwest 库
use reqwest::Error;
use serde_json::Value;

async fn fetch_data(url: &str) -> Result<Value, Error> {
    let response = reqwest::get(url).await?;
    let json = response.json().await?;
    Ok(json)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let data = fetch_data("https://api.example.com/data").await?;
    println!("{:?}", data);
    Ok(())
}
```
:::

### 配置文件示例

不同格式的配置文件展示：

::: code-group
```json [package.json]
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.6.3",
    "vitepress-plugin-group-icons": "^1.7.1"
  }
}
```

```yaml [vitepress.config.yaml]
# YAML 配置示例
name: my-project
version: 1.0.0

scripts:
  dev: vitepress dev docs
  build: vitepress build docs
  preview: vitepress preview docs

devDependencies:
  vitepress: ^1.6.3
  vitepress-plugin-group-icons: ^1.7.1
```

```toml [pyproject.toml]
# TOML 配置示例
name = "my-project"
version = "1.0.0"

[scripts]
dev = "vitepress dev docs"
build = "vitepress build docs"
preview = "vitepress preview docs"

[devDependencies]
vitepress = "^1.6.3"
"vitepress-plugin-group-icons" = "^1.7.1"
```
:::

## 阅读统计功能

在文章标题下方，你现在可以看到：

- **字数统计**：显示文章的总字数
- **阅读时间**：根据字数估算的阅读时间

这些统计会自动计算中文和英文内容，并根据不同的阅读速度进行估算。

## 样式特点

### Mac 风格代码块特点

1. **三个彩色圆点**：红色、黄色、绿色，模拟 macOS 窗口控制按钮
2. **圆角边框**：现代、美观的外观
3. **语言标签**：显示代码所用的编程语言
4. **行号显示**：方便代码定位

### 代码组特点

1. **标签切换**：点击标签即可切换不同的代码块
2. **语言图标**：自动显示对应编程语言的图标
3. **统一外观**：所有代码块保持一致的视觉风格

## 配置说明

要启用这些功能，需要进行以下配置：

### 1. 安装插件

::: code-group
```sh [npm]
npm install vitepress-plugin-group-icons -D
```

```sh [yarn]
yarn add vitepress-plugin-group-icons -D
```

```sh [pnpm]
pnpm add vitepress-plugin-group-icons -D
```
:::

### 2. 配置 VitePress

在 `docs/.vitepress/config.mts` 中添加：

```typescript
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export default defineConfig({
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin()
    ]
  }
})
```

### 3. 导入样式

在 `docs/.vitepress/theme/index.ts` 中添加：

```typescript
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  // ...其他配置
}
```

## 总结

这些新功能让你的技术博客更加专业和美观：

- **代码组**：方便展示多语言实现，自动显示语言图标
- **Mac 风格**：现代化的代码块外观，三个彩色圆点
- **阅读统计**：帮助读者了解文章长度和阅读时间

希望这些功能能够提升你的阅读和写作体验！如果你有任何问题或建议，欢迎在评论区留言。
