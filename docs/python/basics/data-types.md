---
title: Python 数据类型
description: 全面介绍 Python 的基本数据类型，包括数字、字符串、列表、元组、字典、集合等。
---

# Python 数据类型

Python 提供了丰富的内置数据类型，掌握它们是编写高效代码的基础。

## 数字类型

### 整数 (int)

```python
# 整数
x = 10
y = -5
big_number = 1_000_000  # 使用下划线分隔，提高可读性

# 进制表示
binary = 0b1010      # 二进制，值为 10
octal = 0o12         # 八进制，值为 10
hexadecimal = 0xA    # 十六进制，值为 10
```

### 浮点数 (float)

```python
# 浮点数
pi = 3.14159
scientific = 1.5e10  # 科学计数法，15000000000.0

# 高精度计算
from decimal import Decimal
precise = Decimal('0.1') + Decimal('0.2')  # 精确的 0.3
```

### 复数 (complex)

```python
# 复数
c = 3 + 4j
print(c.real)   # 实部: 3.0
print(c.imag)   # 虚部: 4.0
print(abs(c))   # 模: 5.0
```

## 字符串 (str)

```python
# 字符串创建
s1 = 'Hello'
s2 = "World"
s3 = '''多行
字符串'''

# f-string 格式化（推荐）
name = "Python"
version = 3.11
print(f"{name} {version}")  # Python 3.11

# 常用方法
text = "  Hello, Python!  "
print(text.strip())      # 去除首尾空格
print(text.lower())      # 转小写
print(text.split(','))   # 分割
print(text.replace('Python', 'World'))  # 替换

# 字符串切片
s = "Python"
print(s[0])      # P
print(s[-1])     # n
print(s[0:3])    # Pyt
print(s[::-1])   # nohtyP（反转）
```

## 列表 (list)

列表是可变的有序序列。

```python
# 创建列表
fruits = ['apple', 'banana', 'cherry']
numbers = [1, 2, 3, 4, 5]
mixed = [1, 'hello', 3.14, True]

# 列表操作
fruits.append('orange')        # 末尾添加
fruits.insert(1, 'grape')      # 指定位置插入
fruits.remove('banana')        # 删除元素
popped = fruits.pop()          # 弹出最后一个元素
fruits.extend(['kiwi', 'mango'])  # 扩展列表

# 列表推导式
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# 常用方法
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
print(len(numbers))      # 长度: 8
print(sorted(numbers))   # 排序
print(sum(numbers))      # 求和: 31
print(max(numbers))      # 最大值: 9
print(min(numbers))      # 最小值: 1
```

## 元组 (tuple)

元组是不可变的有序序列。

```python
# 创建元组
point = (3, 4)
single = (1,)            # 单元素元组需要逗号
coordinates = 10, 20, 30  # 括号可选

# 解包
x, y = point
print(x, y)  # 3 4

# 命名元组
from collections import namedtuple
Person = namedtuple('Person', ['name', 'age'])
p = Person('Alice', 25)
print(p.name)  # Alice
```

## 字典 (dict)

字典是键值对的集合。

```python
# 创建字典
person = {
    'name': 'Alice',
    'age': 25,
    'city': 'Beijing'
}

# 访问和修改
print(person['name'])           # Alice
print(person.get('job', 'N/A')) # N/A（默认值）
person['email'] = 'alice@example.com'
person.update({'age': 26, 'job': 'Engineer'})

# 遍历
for key, value in person.items():
    print(f"{key}: {value}")

# 字典推导式
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

## 集合 (set)

集合是无序的不重复元素集合。

```python
# 创建集合
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# 集合运算
print(a | b)   # 并集: {1, 2, 3, 4, 5, 6}
print(a & b)   # 交集: {3, 4}
print(a - b)   # 差集: {1, 2}
print(a ^ b)   # 对称差: {1, 2, 5, 6}

# 常用操作
numbers = [1, 2, 2, 3, 3, 3, 4]
unique = set(numbers)  # 去重: {1, 2, 3, 4}
unique.add(5)
unique.discard(1)
```

## 类型转换

```python
# 数值转换
int('123')       # 123
float('3.14')    # 3.14
str(100)         # '100'

# 序列转换
list('hello')    # ['h', 'e', 'l', 'l', 'o']
tuple([1, 2, 3]) # (1, 2, 3)
set([1, 1, 2])   # {1, 2}

# 类型检查
x = 10
print(type(x))        # <class 'int'>
print(isinstance(x, int))  # True
```

::: warning 注意
在 Python 中，变量没有类型，值才有类型。同一个变量可以被赋值为不同类型的值。
:::

## 下一步

继续学习 [控制流](/python/basics/control-flow)。
