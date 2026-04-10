---
title: Python 删除列表元素的 6 种方法详解
date: 2026-03-19
tags: ['Python', '列表', '数据结构']
description: 全面讲解 Python 删除列表元素的 6 种常用方法，包括 pop()、remove()、del、列表推导式、clear() 和切片赋值，附带使用场景对比和注意事项。
---

<font style="color:rgb(0, 0, 0);">在python中删除列表中元素是比较常见的操作，删除的方法也比较多，这里列一下最常见的做法</font>

![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/52345579/1736839423737-4aa25c21-7a95-4b6f-9bd4-4bdb3904fe9e.jpeg)

## <font style="color:rgb(0, 0, 0);">POP()方法</font>
  
`pop()` 方法用于删除指定位置的元素，默认删除最后一个元素，返回值为该元素。如果索引超出范围，将引发 `IndexError` 异常。

```python
l = ['zhangsan', 'lisi', 'wangwu', 'zhaoliu']

# 删除索引为1的元素
remove_element = l.pop(1)
print(remove_element)   # lisi
print(l)  # ['zhangsan', 'wangwu', 'zhaoliu']

# 删除最后一个元素
remove_element = l.pop()
print(remove_element)   # zhaoliu
print(l)  # ['zhangsan', 'wangwu']

# 删除超过索引的元素
remove_element = l.pop(10) # IndexError: pop index out of range
```

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);">注意：</font>

+ <font style="color:rgb(0, 0, 0);">需要知道要删除元素的指定索引位置。</font>
+ <font style="color:rgb(0, 0, 0);">索引超出范围，会抛出异常</font>



使用场景

:::info
 适用于需要删除特定位置元素的场景，尤其是删除最后一个元素时。  

:::

## <font style="color:rgb(31, 35, 40);">remove方法</font>
`<font style="color:#F38F39;">remove()</font>`<font style="color:rgb(31, 35, 40);">方法用于删除匹配到的第一个元素，无返回值。如果要删除的元素不存在，引发</font><font style="color:#E4495B;">ValueError</font><font style="color:rgb(31, 35, 40);">异常</font>

```python
l = ['zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'lisi']

# 删除lisi
l.remove('lisi')
print(l)  # ['zhangsan', 'wangwu', 'zhaoliu', 'lisi']

# 删除不存在的元素
l.remove('xxx')  # ValueError: list.remove(x): x not in list
```

<font style="color:rgb(31, 35, 40);">注意：</font>

+ <font style="color:#F38F39;">remove</font><font style="color:rgb(31, 35, 40);">只会删除第一个匹配到的元素，如果有多个相同的元素要删除，那么</font><font style="color:#F38F39;">remove</font><font style="color:rgb(31, 35, 40);">就不太适用</font>
+ <font style="color:rgb(31, 35, 40);">删除不存在的元素，会抛出异常</font>

<font style="color:rgb(31, 35, 40);">使用场景</font>

:::info
 适用于删除已知值的元素，且列表中该值不重复或只需删除第一个匹配项的场景。  

:::

## <font style="color:rgb(31, 35, 40);">del语句</font>
<font style="color:#F38F39;">del</font><font style="color:rgb(31, 35, 40);">和</font><font style="color:#F38F39;">pop()</font><font style="color:rgb(31, 35, 40);">方法类似，都是用于删除指定索引位置的元素，但是</font><font style="color:#F38F39;">del</font><font style="color:rgb(31, 35, 40);">更灵活一些，可以删除指定位置的切片，索引超出范围，会引发</font><font style="color:#F38F39;">IndexError</font><font style="color:rgb(31, 35, 40);">异常</font>

```python
l = ['zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'lisi']

# 删除索引为1的元素
del l[1]
print(l)  # ['zhangsan', 'wangwu', 'zhaoliu', 'lisi']

# 删除索引0-2的切片
del l[0:2]
print(l)  # ['zhaoliu', 'lisi']

# 删除不存在的索引
del l[100]
print(l)  # IndexError: list assignment index out of range
```

<font style="color:rgb(31, 35, 40);">注意：</font>

+ <font style="color:rgb(31, 35, 40);">要知道要删除元素的指定索引位置</font>
+ <font style="color:rgb(31, 35, 40);">索引超出范围，会抛出异常</font>

<font style="color:rgb(31, 35, 40);">使用场景</font>

:::info
适用于删除特定位置或范围内的元素。

:::

## <font style="color:rgb(31, 35, 40);">列表推导式</font>
<font style="color:rgb(31, 35, 40);">可以创建一个新列表，用于删除想删除的元素，比较灵活</font>

```python
l = ['zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'lisi']

# 删除lisi
new_l = [element for element in l if element != 'lisi']
print(new_l)  # ['zhangsan', 'wangwu', 'zhaoliu']
```

<font style="color:rgb(31, 35, 40);">注意：</font>

+ <font style="color:rgb(31, 35, 40);">这种方式不能原地删除，需要创建新列表，开辟新的内存空间</font>
+ <font style="color:rgb(31, 35, 40);">列表非常大的情况，效率比较低，内存占用比较大</font>

<font style="color:rgb(31, 35, 40);">使用场景</font>

:::info
适用于需要删除多个相同元素或复杂条件删除的场景。

:::

## <font style="color:rgb(31, 35, 40);">filter函数</font>
<font style="color:#F38F39;">filter</font><font style="color:rgb(31, 35, 40);">函数和列表推导式方式很像，但是</font><font style="color:#F38F39;">filter</font><font style="color:rgb(31, 35, 40);">函数是一个迭代器，内存效率高，处理大数据集时更高效</font>

```python
l = ['zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'lisi']

# 删除lisi
new_l = list(filter(lambda x: x != 'lisi', l))
print(new_l)  # ['zhangsan', 'wangwu', 'zhaoliu']
```

<font style="color:rgb(31, 35, 40);">注意：</font>

+ <font style="color:rgb(31, 35, 40);">这种方式不能原地删除，需要创建新列表，开辟新的内存空间</font>

<font style="color:rgb(31, 35, 40);">使用场景</font>

:::info
适用于需要删除多个相同元素或复杂条件删除的场景，尤其是处理大数据集时。

:::

## <font style="color:rgb(31, 35, 40);">总结</font>
| <font style="color:rgb(31, 35, 40);">方法</font> | <font style="color:rgb(31, 35, 40);">使用场景</font> | <font style="color:rgb(31, 35, 40);">优点</font> | <font style="color:rgb(31, 35, 40);">缺点</font> |
| --- | --- | --- | --- |
| <font style="color:#F38F39;">pop</font> | <font style="color:rgb(31, 35, 40);">删除特定位置元素，尤其是最后一个元素</font> | <font style="color:rgb(31, 35, 40);">操作简单，返回被删除的元素</font> | <font style="color:rgb(31, 35, 40);">需要知道索引，索引超出范围会抛出异常</font> |
| <font style="color:#F38F39;">remove</font> | <font style="color:rgb(31, 35, 40);">删除已知值的元素</font> | <font style="color:rgb(31, 35, 40);">不需要知道索引</font> | <font style="color:rgb(31, 35, 40);">只能删除第一个匹配项，删除不存在的元素会抛出异常</font> |
| <font style="color:#F38F39;">del</font> | <font style="color:rgb(31, 35, 40);">删除特定位置或范围内的元素</font> | <font style="color:rgb(31, 35, 40);">可以删除切片，灵活性高</font> | <font style="color:rgb(31, 35, 40);">需要知道索引，索引超出范围会抛出异常</font> |
| <font style="color:rgb(31, 35, 40);">列表推导式</font> | <font style="color:rgb(31, 35, 40);">删除多个相同元素或复杂条件删除</font> | <font style="color:rgb(31, 35, 40);">灵活性高</font> | <font style="color:rgb(31, 35, 40);">需要创建新列表，内存占用较大，处理大数据集时效率较低</font> |
| <font style="color:#F38F39;">filter</font> | <font style="color:rgb(31, 35, 40);">删除多个相同元素或复杂条件删除，处理大数据集</font> | <font style="color:rgb(31, 35, 40);">内存效率高，适合处理大数据集</font> | <font style="color:rgb(31, 35, 40);">需要创建新列表，不能原地删除</font> |
