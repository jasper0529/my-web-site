---
title: Python 函数
description: Python 函数的定义、参数、返回值和高级用法。
---

# Python 函数

函数是组织代码的基本单元，掌握函数的使用是编写可维护代码的关键。

## 函数定义

```python
# 基本函数
def greet(name):
    """问候函数"""
    return f"Hello, {name}!"

# 调用
message = greet("World")
print(message)  # Hello, World!
```

## 参数类型

### 位置参数和关键字参数

```python
def describe_pet(name, animal, age):
    print(f"{name} is a {age}-year-old {animal}")

# 位置参数
describe_pet("Buddy", "dog", 3)

# 关键字参数
describe_pet(animal="cat", age=2, name="Whiskers")
```

### 默认参数

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))           # Hello, Alice!
print(greet("Bob", "Hi"))       # Hi, Bob!
```

### 可变参数

```python
# *args - 任意数量的位置参数
def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs - 任意数量的关键字参数
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="Beijing")
```

### 仅限位置参数和仅限关键字参数

```python
# / 之前是仅限位置参数
# * 之后是仅限关键字参数
def func(a, b, /, c, *, d):
    pass

func(1, 2, c=3, d=4)  # 正确
# func(a=1, b=2, c=3, d=4)  # 错误
```

## 返回值

```python
# 单个返回值
def square(x):
    return x ** 2

# 多个返回值（元组）
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

min_val, max_val, total = get_stats([1, 2, 3, 4, 5])

# 无返回值（返回 None）
def do_something():
    pass
```

## Lambda 函数

```python
# 匿名函数
square = lambda x: x ** 2
add = lambda a, b: a + b

# 配合高阶函数使用
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
evens = list(filter(lambda x: x % 2 == 0, numbers))

# 排序时使用
students = [('Alice', 85), ('Bob', 90), ('Charlie', 78)]
students.sort(key=lambda x: x[1], reverse=True)
```

## 函数式编程

```python
numbers = [1, 2, 3, 4, 5]

# map - 映射
squared = list(map(lambda x: x ** 2, numbers))

# filter - 过滤
evens = list(filter(lambda x: x % 2 == 0, numbers))

# reduce - 归约
from functools import reduce
total = reduce(lambda a, b: a + b, numbers)

# 列表推导式（更 Pythonic）
squared = [x ** 2 for x in numbers]
evens = [x for x in numbers if x % 2 == 0]
```

## 闭包和装饰器

### 闭包

```python
def outer(x):
    def inner(y):
        return x + y
    return inner

add_five = outer(5)
print(add_five(3))  # 8
```

### 装饰器基础

```python
def log_function(func):
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        result = func(*args, **kwargs)
        print(f"返回 {result}")
        return result
    return wrapper

@log_function
def add(a, b):
    return a + b

add(2, 3)
# 调用 add
# 返回 5
```

## 类型提示

```python
from typing import List, Dict, Optional, Union

def greet(name: str) -> str:
    return f"Hello, {name}!"

def process(items: List[int]) -> int:
    return sum(items)

def get_user(id: int) -> Optional[Dict]:
    # 可能返回 None
    pass

def handle(value: Union[int, str]) -> None:
    pass
```

::: tip 最佳实践
1. 函数应该只做一件事
2. 函数名应该清晰表达其功能
3. 保持函数简短，一般不超过 20 行
4. 使用文档字符串说明函数用途
:::

## 下一步

继续学习 [装饰器](/python/advanced/decorators)。
