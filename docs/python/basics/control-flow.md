---
title: Python 控制流
description: Python 条件判断、循环语句和异常处理的详细用法。
---

# Python 控制流

控制流语句决定了程序的执行路径，是编程的基础。

## 条件判断

### if 语句

```python
age = 18

if age < 18:
    print("未成年")
elif age < 60:
    print("成年")
else:
    print("老年")
```

### 三元表达式

```python
# 条件为真时的值 if 条件 else 条件为假时的值
status = "成年" if age >= 18 else "未成年"
```

### 模式匹配（Python 3.10+）

```python
def http_status(status):
    match status:
        case 200:
            return "OK"
        case 400:
            return "Bad Request"
        case 404:
            return "Not Found"
        case 500:
            return "Internal Server Error"
        case _:  # 默认情况
            return "Unknown"
```

## 循环

### for 循环

```python
# 遍历列表
fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(fruit)

# 使用 range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# 带索引遍历
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# 遍历字典
person = {'name': 'Alice', 'age': 25}
for key, value in person.items():
    print(f"{key}: {value}")
```

### while 循环

```python
count = 0
while count < 5:
    print(count)
    count += 1
```

### 循环控制

```python
# break - 终止循环
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue - 跳过当前迭代
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4

# else 子句（循环正常结束时执行）
for i in range(5):
    print(i)
else:
    print("循环结束")
```

## 异常处理

### try-except

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("除数不能为零")
except Exception as e:
    print(f"发生错误: {e}")
else:
    print(f"结果: {result}")  # 无异常时执行
finally:
    print("无论如何都会执行")
```

### 主动抛出异常

```python
def set_age(age):
    if age < 0:
        raise ValueError("年龄不能为负数")
    return age

# 自定义异常
class CustomError(Exception):
    pass
```

### 上下文管理器

```python
# 使用 with 语句自动管理资源
with open('file.txt', 'r') as f:
    content = f.read()
# 文件会自动关闭
```

## 练习

1. 编写一个猜数字游戏
2. 实现九九乘法表打印
3. 处理用户输入的异常情况

::: tip 提示
在实际开发中，要合理使用异常处理，避免过度捕获异常导致问题难以排查。
:::

## 下一步

继续学习 [函数](/python/basics/functions)。
