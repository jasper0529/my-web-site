---
title: Python构造数据神器 Mimesis
date: 2026-03-17
tags: ['Python', 'Mimesis', '数据生成', '测试', '工具']
author: Jasper
description: Mimesis 是一个用于生成假数据的 Python 库，支持多种语言和数据类型。它的设计目标是提供一个简单而灵活的 API，以便用户能够快速生成所需的假数据。官方文档：mimesis 主要特点 + 多语言：支持47种不同国家语言 + 可扩展性：支持自定义数据生成和自定义数据处理 + 性能：比fa...
---

# 介绍
<font style="color:#F38F39;">Mimesis</font> 是一个用于生成假数据的 Python 库，支持多种语言和数据类型。它的设计目标是提供一个简单而灵活的 API，以便用户能够快速生成所需的假数据。官方文档：[mimesis](https://mimesis.name/)

主要特点:

+ 多语言：支持47种不同国家语言
+ 可扩展性：支持自定义数据生成和自定义数据处理
+ 性能：比faker快很多，尤其是大数据生成场景
+ 数据类型：数据类型比较丰富

# 安装
```shell
pip install mimesis
```

# 基本用法
## 创建Generic 实例
Mimesis 的核心是 <font style="color:#F38F39;">Generic </font>类，可以通过它来生成各种类型的数据。可以指定语言（如中文、英文等）来生成相应语言的数据。

```python
from mimesis import Generic

# 创建 Generic 实例，指定语言
generic = Generic('zh')  # 中文
```

## 生成基本数据
Mimesis 提供了多种数据生成器，可以通过 <font style="color:#F38F39;">Generic</font> 实例访问它们

```python
from mimesis import Generic


# 创建 Generic 实例，指定中文
generic = Generic('zh')

# 生成随机中文名称
print("随机生成的中文名称:", generic.person.full_name())

# 生成随机电子邮件
print("随机生成的电子邮件:", generic.person.email())
```

# 语言
<font style="color:rgb(62, 67, 73);">Mimesis 支持多种语言环境，可以在创建</font><font style="color:#F38F39;">Generic</font><font style="color:rgb(62, 67, 73);"> 实例时指定语言代码</font>

<font style="color:rgb(62, 67, 73);">支持的语言都在</font><font style="color:#F38F39;">Locale</font><font style="color:rgb(62, 67, 73);">中，需要导入</font>

```python
from mimesis.locales import Locale
```

示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例 指定语言为中文
generic = Generic(Locale.ZH)

print("随机生成的电话号码:", generic.person.telephone())
# 随机生成的电话号码: +86 684-02846965
```

<font style="color:rgb(62, 67, 73);">有时只需要来自其他语言环境的一些数据，而为这种情况创建多个</font><font style="color:#F38F39;">Generic</font><font style="color:rgb(62, 67, 73);"> 实例并不是很好，因此最好暂时覆盖提供程序实例的当前语言环境。这对于需要在特定情况下生成不同语言的数据非常有用。</font>

<font style="color:rgb(62, 67, 73);">使用</font><font style="color:#F38F39;">override_local</font><font style="color:rgb(62, 67, 73);">方法可以覆盖掉语言设置</font>

<font style="color:rgb(62, 67, 73);">示例：</font>

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例 指定语言为中文
generic = Generic(Locale.ZH)

print("随机生成的电话号码:", generic.person.telephone())
# 随机生成的电话号码: +86 684-02846965

# 使用override_locale修改语言指定为英语
with generic.person.override_locale(Locale.EN):
    print("Randomly generated phone numbers:", generic.person.telephone())
    # Randomly generated phone numbers: +19753687584
    
print("随机生成的电话号码:", generic.person.telephone())
# 随机生成的电话号码: +86 919-00002054
```

注意：

:::info
override_locale覆盖语言时，只在with里生效，在此上下文中生成的所有数据都将使用该设定的语言，离开上下文时失效

:::

# 数据类型
<font style="color:rgb(62, 67, 73);">Mimesis 提供了多种数据类型</font>

## <font style="color:rgb(62, 67, 73);">地址</font>
| 描述 | <font style="color:#2F8EF4;">方法</font> |
| --- | --- |
| 生成完整地址 | <font style="color:#2F8EF4;">generic.address.address()</font> |
| 生成国际电话区号 | <font style="color:#2F8EF4;">generic.address.calling_code()</font> |
| 生成城市名称 | <font style="color:#2F8EF4;">generic.address.city()</font> |
| 生成大陆名称 | <font style="color:#2F8EF4;">generic.address.continent()</font> |
| 生成经纬度信息 | <font style="color:#2F8EF4;">generic.address.coordinates()</font> |
| 生成国家名称 | <font style="color:#2F8EF4;">generic.address.country()</font> |
| 生成国家代码 | <font style="color:#2F8EF4;">generic.address.country_code()</font> |
| 生成国家的 emoji 标志 | <font style="color:#2F8EF4;">generic.address.country_emoji_flag()</font> |
| 获取默认国家名称 | <font style="color:#2F8EF4;">generic.address.default_country()</font> |
| 生成联邦主体（如州或省）的名称 | <font style="color:#2F8EF4;">generic.address.federal_subject()</font> |
| 生成国际航空运输协会（IATA）机场代码 | <font style="color:#2F8EF4;">generic.address.iata_code()</font> |
| 生成国际民用航空组织（ICAO）机场代码 | <font style="color:#2F8EF4;">generic.address.icao_code()</font> |
| 生成国际直接拨号区号（ISD）代码 | <font style="color:#2F8EF4;">generic.address.isd_code()</font> |
| 生成随机纬度 | <font style="color:#2F8EF4;">generic.address.latitude()</font> |
| 生成随机经度 | <font style="color:#2F8EF4;">generic.address.longitude()</font> |
| 生成随机邮政编码 | <font style="color:#2F8EF4;">generic.address.postal_code()</font> |
| 生成随机的行政区划（如县或市） | <font style="color:#2F8EF4;">generic.address.prefecture()</font> |
| 生成随机的省份名称 | <font style="color:#2F8EF4;">generic.address.province()</font> |
| 生成随机的地区名称 | <font style="color:#2F8EF4;">generic.address.region()</font> |
| 生成随机的州名称 | <font style="color:#2F8EF4;">generic.address.state()</font> |
| 生成随机的街道名称 | <font style="color:#2F8EF4;">generic.address.street_name()</font> |
| 生成随机的街道号码 | <font style="color:#2F8EF4;">generic.address.street_number()</font> |
| 生成随机的街道后缀（如街、路、巷等） | <font style="color:#2F8EF4;">generic.address.street_suffix()</font> |
| 生成随机的邮政编码 | <font style="color:#2F8EF4;">generic.address.zip_code()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例 指定语言为中文
generic = Generic(Locale.ZH)

print("完整地址:", generic.address.address())  # 完整地址: 朝阳门南九条1007号
print("国际电话区号:", generic.address.calling_code())  # 国际电话区号: +86
print("城市:", generic.address.city())  # 城市: 岳阳市
print("大陆名称:", generic.address.continent())  # 大陆名称: 非洲
# 经纬度: 'longitude': 34.973839, 'latitude': 53.728978}
print("经纬度:", generic.address.coordinates())
print("国家:", generic.address.country())  # 国家: 阿鲁巴
print("国家代码:", generic.address.country_code())  # 国家代码: ST
print("国家 emoji:", generic.address.country_emoji_flag())  # 国家 emoji: 🇪🇸
print("默认国家:", generic.address.default_country())  # 默认国家: 中国
print("联邦主体", generic.address.federal_subject())  # 联邦主体 河北省
print("IATA 代码:", generic.address.iata_code())  # IATA 代码: LKG
print("ICAO 代码:", generic.address.icao_code())  # ICAO 代码: KPEQ
print("ISD 代码:", generic.address.isd_code())  # ISD 代码: +222
print("纬度:", generic.address.latitude())  # 纬度: 8.179587
print("经度:", generic.address.longitude())  # 经度: 83.916151
print("邮政编码:", generic.address.postal_code())  # 邮政编码: 562583
print("行政区划:", generic.address.prefecture())  # 行政区划: 四川省
print("省份:", generic.address.province())  # 省份: 吉林省
print("地区:", generic.address.region())  # 地区: 海南省
print("州:", generic.address.state())  # 州: 西藏自治区
print("街道名称:", generic.address.street_name())  # 街道名称: 葛化
print("街道号码:", generic.address.street_number())  # 街道号码: 802
print("街道后缀:", generic.address.street_suffix())  # 街道后缀: 街
print("美国邮政编码:", generic.address.zip_code())  # 美国邮政编码: 974654

```

### 中国地址生成
<font style="color:#F38F39;">generic.address.address() </font>提供的地址不是全地址，没有省市信息，我们可以自定义一个数据生成器，生成完整的地址，正好<font style="color:rgb(62, 67, 73);">Mimesis提供了方法：</font><font style="color:#F38F39;">BaseProvider</font>

示例：

```python
from mimesis import Generic
from mimesis.locales import Locale
from mimesis.providers import BaseProvider

import random


class ChineseAddressProvider(BaseProvider):
    class Meta:
        name = "zh_address"

    def __init__(self, seed=None):
        super().__init__(seed=seed)
        self.street_suffixes = ["号", "街", "巷", "道", "路"]

    def address(self):
        province = generic.address.province()  # 使用 Mimesis 生成省份
        city = generic.address.city()  # 使用 Mimesis 生成城市
        street_name = generic.address.street_name()  # 使用 Mimesis 生成街道名称
        street_number = random.randint(1, 999)  # 随机生成街道号码

        address = (
            f"{province}{city}{street_name}{street_number}{random.choice(self.street_suffixes)}")

        return address


# 创建 Generic 实例并添加自定义提供者
generic = Generic(Locale.ZH)
generic.add_provider(ChineseAddressProvider)

# 使用自定义生成器
for _ in range(5):  # 生成5个随机地址
    print(generic.zh_address.address())
    # 安徽省晋城市涨渡湖29道
    # 江苏省嘉峪关市新沟桥66路
    # 湖北省娄底市 江堤164巷
    # 陕西省茂名市北城480路
    # 山西省保定市将军路927巷
```

注意：

:::info
这里随机生成的地址省市关系不是一一对应的，不过对于数据测试完全够用了，有强迫症的同学可以使用Mimesis 里提供的BaseDataProvider基类实现自定义数据，来实现省市对应关系

:::

## 金融
| 描述 | <font style="color:#2F8EF4;">方法</font> |
| --- | --- |
| 返回随机的银行名称。 | <font style="color:#2F8EF4;">generic.finance.bank()</font> |
| 返回随机的公司名称。 | <font style="color:#2F8EF4;">generic.finance.company()</font> |
| 返回随机的公司类型，例如 "私营公司"、"上市公司" 等。 | <font style="color:#2F8EF4;">generic.finance.company_type()</font> |
| 返回随机的加密货币 ISO 代码，例如 "BTC", "ETH" 等。 | <font style="color:#2F8EF4;">generic.finance.cryptocurrency_iso_code()</font> |
| 返回随机的加密货币符号，例如 "₿"（比特币符号）。 | <font style="color:#2F8EF4;">generic.finance.cryptocurrency_symbol()</font> |
| 返回随机的货币 ISO 代码，例如 "USD", "EUR" 等。 | <font style="color:#2F8EF4;">generic.finance.currency_iso_code()</font> |
| 返回随机的货币符号，例如 "$", "€" 等。 | <font style="color:#2F8EF4;">generic.finance.currency_symbol()</font> |
| 返回随机的价格，通常在指定的范围内。 | <font style="color:#2F8EF4;">generic.finance.price()</font> |
| 返回以比特币为单位的随机价格。 | <font style="color:#2F8EF4;">generic.finance.price_in_btc()</font> |
| 返回随机的股票交易所名称，例如 "NASDAQ", "NYSE" 等。 | <font style="color:#2F8EF4;">generic.finance.stock_exchange()</font> |
| 返回随机的股票名称。 | <font style="color:#2F8EF4;">generic.finance.stock_name()</font> |
| 返回随机的股票代码，例如 "AAPL", "GOOGL" 等。 | <font style="color:#2F8EF4;">generic.finance.stock_ticker()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale

generic = Generic(Locale.ZH)

# 获取 Finance 类型
finance = generic.finance

# 生成随机金融数据
print("随机银行名称:", finance.bank())
print("随机公司名称:", finance.company())
print("随机公司类型:", finance.company_type())
print("随机加密货币 ISO 代码:", finance.cryptocurrency_iso_code())
print("随机加密货币符号:", finance.cryptocurrency_symbol())
print("随机货币 ISO 代码:", finance.currency_iso_code())
print("随机货币符号:", finance.currency_symbol())
print("随机价格:", finance.price())
print("随机价格（以比特币为单位）:", finance.price_in_btc())
print("随机股票交易所:", finance.stock_exchange())
print("随机股票名称:", finance.stock_name())
print("随机股票代码:", finance.stock_ticker())
# 随机银行名称: China Merchants Rural Commercial Bank Co., Ltd.
# 随机公司名称: 中国网络通信
# 随机公司类型: 有限公司
# 随机加密货币 ISO 代码: IOT
# 随机加密货币符号: ₿
# 随机货币 ISO 代码: CNY
# 随机货币符号: ¥
# 随机价格: 1272.26
# 随机价格（以比特币为单位）: 1.7873199
# 随机股票交易所: AMEX
# 随机股票名称: Eaton Vance Tax-Managed Buy-Write Strategy Fund
# 随机股票代码: ICH
```

## 日期
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 批量生成随机的日期时间。 | <font style="color:#2F8EF4;">generic.datetime.bulk_create_datetimes()</font> |
| 返回随机的世纪（罗马数字）。 | <font style="color:#2F8EF4;">generic.datetime.century()</font> |
| 返回随机的日期。 | <font style="color:#2F8EF4;">generic.datetime.date()</font> |
| 返回随机的日期时间。 | <font style="color:#2F8EF4;">generic.datetime.datetime()</font> |
| 返回随机的月份中的某一天（1-31）。 | <font style="color:#2F8EF4;">generic.datetime.day_of_month()</font> |
| 返回随机的一周中的某一天（0-6，0表示星期一(2025年01月13日)）。 | <font style="color:#2F8EF4;">generic.datetime.day_of_week()</font> |
| 返回随机的持续时间。 | <font style="color:#2F8EF4;">generic.datetime.duration()</font> |
| 返回格式化的日期字符串。 | <font style="color:#2F8EF4;">generic.datetime.formatted_date()</font> |
| 返回格式化的时间字符串。 | <font style="color:#2F8EF4;">generic.datetime.formatted_time()</font> |
| 返回随机的 GMT 偏移量，例如 "+08:00"。 | <font style="color:#2F8EF4;">generic.datetime.gmt_offset()</font> |
| 返回随机的月份（1-12）。 | <font style="color:#2F8EF4;">generic.datetime.month()</font> |
| 返回随机的周期性描述，例如 "每周"、"每月"。 | <font style="color:#2F8EF4;">generic.datetime.periodicity()</font> |
| 返回随机的时间。 | <font style="color:#2F8EF4;">generic.datetime.time()</font> |
| 返回随机的时间戳（自1970年1月1日以来的秒数）。 | <font style="color:#2F8EF4;">generic.datetime.timestamp()</font> |
| 返回随机的时区名称，例如 "Asia/Shanghai"。 | <font style="color:#2F8EF4;">generic.datetime.timezone()</font> |
| 返回随机的周日(2025年01月19日)期字符串。 | <font style="color:#2F8EF4;">generic.datetime.week_date()</font> |
| 返回随机的年份。 | <font style="color:#2F8EF4;">generic.datetime.year()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale
from datetime import datetime

generic = Generic(Locale.ZH)

# 获取 Finance 类型
finance = generic.finance

date_start = datetime(2020, 1, 1)
date_end = datetime(2025, 1, 1)


# 生成随机日期和时间数据
print("批量生成随机日期时间:", generic.datetime.bulk_create_datetimes(date_start=date_start, date_end=date_end, days=1))
print("随机世纪:", generic.datetime.century())
print("随机日期:", generic.datetime.date())
print("随机日期时间:", generic.datetime.datetime())
print("随机月份中的某一天:", generic.datetime.day_of_month())
print("随机的一周中的某一天:", generic.datetime.day_of_week())
print("随机持续时间:", generic.datetime.duration())
print("格式化的日期:", generic.datetime.formatted_date())
print("格式化的时间:", generic.datetime.formatted_time())
print("随机 GMT 偏移量:", generic.datetime.gmt_offset())
print("随机月份:", generic.datetime.month())
print("随机周期性描述:", generic.datetime.periodicity())
print("随机时间:", generic.datetime.time())
print("随机时间戳:", generic.datetime.timestamp())
print("随机时区名称:", generic.datetime.timezone())
print("随机周日期:", generic.datetime.week_date())
print("随机年份:", generic.datetime.year())
# 批量生成随机日期时间: [datetime.datetime(2020, 1, 2, 0, 0), datetime.datetime(2020, 1, 3, 0, 0)...]
# 随机世纪: X
# 随机日期: 2014-10-21
# 随机日期时间: 2025-03-30 12:50:19.646445
# 随机月份中的某一天: 6
# 随机的一周中的某一天: 星期二
# 随机持续时间: 0:01:00
# 格式化的日期: 2025-08-09
# 格式化的时间: 18:11:27
# 随机 GMT 偏移量: UTC +03:00
# 随机月份: 十二月
# 随机周期性描述: 有时
# 随机时间: 23:52:15.989878
# 随机时间戳: 1760093730
# 随机时区名称: Australia/Currie
# 随机周日期: 2024-W7
# 随机年份: 2020
```

## 食物
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的菜肴名称。 | <font style="color:#2F8EF4;">generic.food.dish()</font> |
| 返回随机的饮料名称。 | <font style="color:#2F8EF4;">generic.food.drink()</font> |
| 返回随机的水果名称。 | <font style="color:#2F8EF4;">generic.food.fruit()</font> |
| 返回随机的香料名称。 | <font style="color:#2F8EF4;">generic.food.spices()</font> |
| 返回随机的蔬菜名称。 | <font style="color:#2F8EF4;">generic.food.vegetable()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale

# 创建 Generic 实例
generic = Generic(Locale.ZH)

# 生成随机食物相关数据
print("随机菜肴:", generic.food.dish())
print("随机饮料:", generic.food.drink())
print("随机水果:", generic.food.fruit())
print("随机香料:", generic.food.spices())
print("随机蔬菜:", generic.food.vegetable())
# 随机菜肴: 均安煎鱼饼
# 随机饮料: 凉茶
# 随机水果: 西柚
# 随机香料: 酱油
# 随机蔬菜: 瓠瓜

```

## 个人数据
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的学位。 | <font style="color:#2F8EF4;">generic.person.academic_degree()</font> |
| 返回随机的出生日期。 | <font style="color:#2F8EF4;">generic.person.birthdate()</font> |
| 返回随机的血型。 | <font style="color:#2F8EF4;">generic.person.blood_type()</font> |
| 返回随机的电子邮件地址。 | <font style="color:#2F8EF4;">generic.person.email()</font> |
| 返回随机的名字。 | <font style="color:#2F8EF4;">generic.person.first_name()</font> |
| 返回随机的全名。 | <font style="color:#2F8EF4;">generic.person.full_name()</font> |
| 返回随机的性别。 | <font style="color:#2F8EF4;">generic.person.gender()</font> |
| 返回随机的性别代码。 | <font style="color:#2F8EF4;">generic.person.gender_code()</font> |
| 返回随机的性别符号。 | <font style="color:#2F8EF4;">generic.person.gender_symbol()</font> |
| 返回随机的身高（以厘米为单位）。 | <font style="color:#2F8EF4;">generic.person.height()</font> |
| 返回随机的身份证明。 | <font style="color:#2F8EF4;">generic.person.identifier()</font> |
| 返回随机的语言。 | <font style="color:#2F8EF4;">generic.person.language()</font> |
| 返回随机的姓氏。 | <font style="color:#2F8EF4;">generic.person.last_name()</font> |
| 返回随机的名字（可以是全名或姓）。 | <font style="color:#2F8EF4;">generic.person.name()</font> |
| 返回随机的国籍。 | <font style="color:#2F8EF4;">generic.person.nationality()</font> |
| 返回随机的职业。 | <font style="color:#2F8EF4;">generic.person.occupation()</font> |
| 返回随机的密码。 | <font style="color:#2F8EF4;">generic.person.password()</font> |
| 返回随机的电话号码。 | <font style="color:#2F8EF4;">generic.person.phone_number()</font> |
| 返回随机的政治观点。 | <font style="color:#2F8EF4;">generic.person.political_views()</font> |
| 返回随机的性别（与 gender 相同）。 | <font style="color:#2F8EF4;">generic.person.sex()</font> |
| 返回随机的姓氏（与 last_name 相同）。 | <font style="color:#2F8EF4;">generic.person.surname()</font> |
| 返回随机的电话。 | <font style="color:#2F8EF4;">generic.person.telephone()</font> |
| 返回随机的称谓。 | <font style="color:#2F8EF4;">generic.person.title()</font> |
| 返回随机的大学名称。 | <font style="color:#2F8EF4;">generic.person.university()</font> |
| 返回随机的用户名。 | <font style="color:#2F8EF4;">generic.person.username()</font> |
| 返回随机的观点。 | <font style="color:#2F8EF4;">generic.person.views_on()</font> |
| 返回随机的体重（以千克为单位）。 | <font style="color:#2F8EF4;">generic.person.weight()</font> |
| 返回随机的世界观。 | <font style="color:#2F8EF4;">generic.person.worldview()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale

# 创建 Generic 实例
generic = Generic(Locale.ZH)

# 生成随机个人相关数据
print("学位:", generic.person.academic_degree())
print("出生日期:", generic.person.birthdate())
print("血型:", generic.person.blood_type())
print("电子邮件:", generic.person.email())
print("名字:", generic.person.first_name())
print("全名:", generic.person.full_name())
print("性别:", generic.person.gender())
print("性别代码:", generic.person.gender_code())
print("性别符号:", generic.person.gender_symbol())
print("身高 (m):", generic.person.height())
print("身份证明:", generic.person.identifier())
print("语言:", generic.person.language())
print("姓氏:", generic.person.last_name())
print("国籍:", generic.person.nationality())
print("职业:", generic.person.occupation())
print("密码:", generic.person.password())
print("电话号码:", generic.person.phone_number())
print("政治观点:", generic.person.political_views())
print("性别 (sex):", generic.person.sex())
print("姓 (surname):", generic.person.surname())
print("电话:", generic.person.telephone())
print("称谓:", generic.person.title())
print("大学:", generic.person.university())
print("用户名:", generic.person.username())
print("观点:", generic.person.views_on())
print("体重 (kg):", generic.person.weight())
print("世界观:", generic.person.worldview())
# 学位: 研究生
# 出生日期: 2012-09-18
# 血型: B+
# 电子邮件: benefit1800@example.org
# 名字: 炜
# 全名: 善仁 余
# 性别: 男性
# 性别代码: 2
# 性别符号: ♂
# 身高 (cm): 1.94
# 身份证明: 62-05/56
# 语言: 毛利语
# 姓氏: 蒙
# 国籍: 马其顿
# 职业: 电机修护工
# 密码: +JRR01vN
# 电话号码: +86 305-16886564
# 政治观点: 社会主義
# 性别 (sex): 女性
# 姓 (surname): 闵
# 电话: +86 128-56394396
# 称谓: 名誉博士
# 大学: 上海济光职业技术学院
# 用户名: level_1960
# 观点: 中立
# 体重 (kg): 42
# 世界观: 不可知論
```

### 中国人名生成
默认情况下，Mimesis  <font style="color:#F38F39;">full_name</font> 方法生成的名字不符合中国人的命名习惯，虽然<font style="color:#F38F39;">full_name</font>方法提供了<font style="color:#F38F39;">reverse</font>参数，但是名字中间有空格，因此我们需要自定义生成逻辑。

示例：

```python
from mimesis import Generic
from mimesis.locales import Locale
from mimesis import BaseProvider


class ChinesePersonNameProvider(BaseProvider):
    class Meta:
        name = "zh_person_name"

    def name(self):
        name = generic.person.name()
        surname = generic.person.surname()
        return f"{surname}{name}"


# 创建 Generic 实例并添加自定义提供者
generic = Generic(Locale.ZH)
generic.add_provider(ChinesePersonNameProvider)


for _ in range(5):
    print(generic.zh_person_name.name())
    # 薄梣
    # 秦俊熙
    # 文坤灵
    # 慕小琴
    # 弘迎琦
```

### 中国电话号码生成
Mimesis 默认的电话号码生成可能不符合中国的格式。中国的手机号码通常是以 1 开头，后面跟随 10 位数字，且第二位数字通常是 3、4、5、6、7、8 或 9。

示例：

```python
from mimesis import Generic
from mimesis.locales import Locale
from mimesis import BaseProvider

import random


class ChinesePhoneProvider(BaseProvider):
    class Meta:
        name = "zh_phone"

    def phone(self):
        first_digit = '1'
        second_digit = random.choice(['3', '4', '5', '6', '7', '8', '9'])
        # 生成后面的8位数字
        remaining_digits = ''.join(random.choices('0123456789', k=9))
        return f"{first_digit}{second_digit}{remaining_digits}"


# 创建 Generic 实例并添加自定义提供者
generic = Generic(Locale.ZH)
generic.add_provider(ChinesePhoneProvider)


for _ in range(5):
    print(generic.zh_phone.phone())
    # 14371713842
    # 16065379231
    # 14812021273
    # 19748191338
    # 17284200423

```

## 文本
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的字母表。 | <font style="color:#2F8EF4;">generic.text.alphabet()</font> |
| 返回随机的答案。 | <font style="color:#2F8EF4;">generic.text.answer()</font> |
| 返回随机的颜色名称。 | <font style="color:#2F8EF4;">generic.text.color()</font> |
| 返回随机的表情符号。 | <font style="color:#2F8EF4;">generic.text.emoji()</font> |
| 返回随机的十六进制颜色值。 | <font style="color:#2F8EF4;">generic.text.hex_color()</font> |
| 返回随机的级别。 | <font style="color:#2F8EF4;">generic.text.level()</font> |
| 返回随机的引用。 | <font style="color:#2F8EF4;">generic.text.quote()</font> |
| 返回随机的RGB颜色值。 | <font style="color:#2F8EF4;">generic.text.rgb_color()</font> |
| 返回随机的句子。 | <font style="color:#2F8EF4;">generic.text.sentence()</font> |
| 返回随机的文本。 | <font style="color:#2F8EF4;">generic.text.text()</font> |
| 返回随机的标题。 | <font style="color:#2F8EF4;">generic.text.title()</font> |
| 返回随机的单词。 | <font style="color:#2F8EF4;">generic.text.word()</font> |
| 返回随机的单词列表。 | <font style="color:#2F8EF4;">generic.text.words()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)

# 生成随机文本相关数据
print("字母表:", generic.text.alphabet())
print("答案:", generic.text.answer())
print("颜色:", generic.text.color())
print("表情符号:", generic.text.emoji())
print("十六进制颜色:", generic.text.hex_color())
print("级别:", generic.text.level())
print("引用:", generic.text.quote())
print("RGB颜色:", generic.text.rgb_color())
print("句子:", generic.text.sentence())
print("文本:", generic.text.text())
print("标题:", generic.text.title())
print("单词:", generic.text.word())
print("单词列表:", generic.text.words())
# 字母表: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
# 答案: 否
# 颜色: 深灰
# 表情符号: 🩷
# 十六进制颜色: #6a3c03
# 级别: 略微
# 引用: 人是可以快乐地生活的，只是我们自己选择了复杂，选择了叹息！
# RGB颜色: (20, 124, 216)
# 句子: 为了专门经营西北，次年，他让位于其子惠文王何，自号主父
# 文本: 于是，下令筑长城，自代并阴山（今内蒙古大青山、乌拉特山）而西，直抵大河（今内蒙古乌加河...
# 标题: 因此，一到成年，尽为甲骑
# 单词: 重点
# 单词列表: ['汇集', '活力', '武装', '难点', '重点']
```

## 二进制文件
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的音频文件名。 | <font style="color:#2F8EF4;">generic.binaryfile.audio()</font> |
| 返回随机的压缩文件名。 | <font style="color:#2F8EF4;">generic.binaryfile.compressed()</font> |
| 返回随机的文档文件名。 | <font style="color:#2F8EF4;">generic.binaryfile.document()</font> |
| 返回随机的图像文件名。 | <font style="color:#2F8EF4;">generic.binaryfile.image()</font> |
| 返回随机的视频文件名。 | <font style="color:#2F8EF4;">generic.binaryfile.video()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机二进制文件相关数据
print("音频文件:", generic.binaryfile.audio())
print("压缩文件:", generic.binaryfile.compressed())
print("文档文件:", generic.binaryfile.document())
print("图像文件:", generic.binaryfile.image())
print("视频文件:", generic.binaryfile.video())
```

## code编码
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的 EAN 码。 | <font style="color:#2F8EF4;">generic.code.ean()</font> |
| 返回随机的 IMEI 码。 | <font style="color:#2F8EF4;">generic.code.imei()</font> |
| 返回随机的 ISBN 码。 | <font style="color:#2F8EF4;">generic.code.isbn()</font> |
| 返回随机的 ISSN 码。 | <font style="color:#2F8EF4;">generic.code.issn()</font> |
| 返回随机的 locale 代码。 | <font style="color:#2F8EF4;">generic.code.locale_code()</font> |
| 返回随机的 PIN 码。 | <font style="color:#2F8EF4;">generic.code.pin()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机code相关数据
print("EAN 码:", generic.code.ean())
print("IMEI 码:", generic.code.imei())
print("ISBN 码:", generic.code.isbn())
print("ISSN 码:", generic.code.issn())
print("Locale 代码:", generic.code.locale_code())
print("PIN 码:", generic.code.pin())
# EAN 码: 8928510699258
# IMEI 码: 012336009979174
# ISBN 码: 265-1-22746-480-4
# ISSN 码: 1179-2805
# Locale 代码: pl
# PIN 码: 6173

```

## 随机选择
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 从给定的选项中随机选择一个值。 | <font style="color:#2F8EF4;">generic.choice.choice()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 定义一个选项列表
options = ['苹果', '香蕉', '橙子', '葡萄', '西瓜']

# 从选项中随机选择一个
random_choice = generic.choice.choice(options)

# 输出随机选择的结果
print("随机选择的水果:", random_choice)
# 随机选择的水果: 西瓜

# 随机选择多个
random_choice = generic.choice.choice(options, length=3)

# 输出随机选择的结果
print("随机选择的水果:", random_choice)
# 随机选择的水果: ['香蕉', '橙子', '葡萄']
```

## 加密
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的哈希值。 | <font style="color:#2F8EF4;">generic.cryptographic.hash()</font> |
| 返回随机的助记词短语。 | <font style="color:#2F8EF4;">generic.cryptographic.mnemonic_phrase()</font> |
| 返回随机的令牌字节。 | <font style="color:#2F8EF4;">generic.cryptographic.token_bytes()</font> |
| 返回随机的十六进制令牌。 | <font style="color:#2F8EF4;">generic.cryptographic.token_hex()</font> |
| 返回随机的 URL 安全令牌。 | <font style="color:#2F8EF4;">generic.cryptographic.token_urlsafe()</font> |
| 返回随机的 UUID。 | <font style="color:#2F8EF4;">generic.cryptographic.uuid()</font> |
| 返回随机的 UUID 对象。 | <font style="color:#2F8EF4;">generic.cryptographic.uuid_object()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机加密相关数据
print("哈希值:", generic.cryptographic.hash())
print("助记词短语:", generic.cryptographic.mnemonic_phrase())
print("令牌字节:", generic.cryptographic.token_bytes(16))  # 生成16字节的令牌
print("十六进制令牌:", generic.cryptographic.token_hex(16))  # 生成16字节的十六进制令牌
print("URL 安全令牌:", generic.cryptographic.token_urlsafe(16))  # 生成16字节的 URL 安全令牌
print("UUID:", generic.cryptographic.uuid())
print("UUID 对象:", generic.cryptographic.uuid_object())
# 哈希值: d87f7004072217c428bd3bc2dde4a6d2b21494e3
# 助记词短语: average glow final elegant episode 
# 令牌字节: b":\x97'-Y\xf7\x89f\xa8\xe5g?\x8f;@\x9b"
# 十六进制令牌: ed9a2531ad811264bcc5b41bd3a35061
# URL 安全令牌: nqidCt_I8kkmQkpNM7iHQg
# UUID: 19e061da-75e9-4623-9c1e-f2a74082b77a
# UUID 对象: b3867deb-5df6-4e10-b9ad-76c090b067e2
```

## 软件开发
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的布尔值。 | <font style="color:#2F8EF4;">generic.development.boolean()</font> |
| 返回随机的日历版本号。 | <font style="color:#2F8EF4;">generic.development.calver()</font> |
| 返回随机的可用性（ility）属性。 | <font style="color:#2F8EF4;">generic.development.ility()</font> |
| 返回随机的操作系统名称。 | <font style="color:#2F8EF4;">generic.development.os()</font> |
| 返回随机的编程语言。 | <font style="color:#2F8EF4;">generic.development.programming_language()</font> |
| 返回随机的软件许可证。 | <font style="color:#2F8EF4;">generic.development.software_license()</font> |
| 返回随机的开发阶段。 | <font style="color:#2F8EF4;">generic.development.stage()</font> |
| 返回随机的系统质量属性。 | <font style="color:#2F8EF4;">generic.development.system_quality_attribute()</font> |
| 返回随机的版本号。 | <font style="color:#2F8EF4;">generic.development.version()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机开发相关数据
print("布尔值:", generic.development.boolean())
print("日历版本:", generic.development.calver())
print("可用性:", generic.development.ility())
print("操作系统:", generic.development.os())
print("编程语言:", generic.development.programming_language())
print("软件许可证:", generic.development.software_license())
print("开发阶段:", generic.development.stage())
print("系统质量属性:", generic.development.system_quality_attribute())
print("版本号:", generic.development.version())
# 布尔值: False
# 日历版本: 2025.12.24
# 可用性: affordability
# 操作系统: Lubuntu
# 编程语言: Lisp
# 软件许可证: GNU General Public License (GPL)
# 开发阶段: Alpha
# 系统质量属性: evolvability
# 版本号: 41.41.34
```

## 文件
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的文件扩展名。 | <font style="color:#2F8EF4;">generic.file.extension()</font> |
| 返回随机的文件名。 | <font style="color:#2F8EF4;">generic.file.file_name()</font> |
| 返回随机的 MIME 类型。 | <font style="color:#2F8EF4;">generic.file.mime_type()</font> |
| 返回随机的文件大小（字节）。 | <font style="color:#2F8EF4;">generic.file.size()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机文件相关数据
print("文件扩展名:", generic.file.extension())
print("文件名:", generic.file.file_name())
print("MIME 类型:", generic.file.mime_type())
print("文件大小 (字节):", generic.file.size())
# 文件扩展名: .bmp
# 文件名: general.m3u
# MIME 类型: image/vnd.radiance
# 文件大小 (字节): 73 GB
```

## 硬件
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的 CPU 名称。 | <font style="color:#2F8EF4;">generic.hardware.cpu()</font> |
| 返回随机的 CPU 代号。 | <font style="color:#2F8EF4;">generic.hardware.cpu_codename()</font> |
| 返回随机的 CPU 频率。 | <font style="color:#2F8EF4;">generic.hardware.cpu_frequency()</font> |
| 返回随机的代数。 | <font style="color:#2F8EF4;">generic.hardware.generation()</font> |
| 返回随机的图形卡名称。 | <font style="color:#2F8EF4;">generic.hardware.graphics()</font> |
| 返回随机的制造商名称。 | <font style="color:#2F8EF4;">generic.hardware.manufacturer()</font> |
| 返回随机的手机型号。 | <font style="color:#2F8EF4;">generic.hardware.phone_model()</font> |
| 返回随机的 RAM 大小。 | <font style="color:#2F8EF4;">generic.hardware.ram_size()</font> |
| 返回随机的 RAM 类型。 | <font style="color:#2F8EF4;">generic.hardware.ram_type()</font> |
| 返回随机的分辨率。 | <font style="color:#2F8EF4;">generic.hardware.resolution()</font> |
| 返回随机的屏幕大小。 | <font style="color:#2F8EF4;">generic.hardware.screen_size()</font> |
| 返回随机的存储类型（SSD 或 HDD）。 | <font style="color:#2F8EF4;">generic.hardware.ssd_or_hdd()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机硬件相关数据
print("CPU:", generic.hardware.cpu())
print("CPU 代号:", generic.hardware.cpu_codename())
print("CPU 频率:", generic.hardware.cpu_frequency())
print("代数:", generic.hardware.generation())
print("图形卡:", generic.hardware.graphics())
print("制造商:", generic.hardware.manufacturer())
print("手机型号:", generic.hardware.phone_model())
print("RAM 大小:", generic.hardware.ram_size())
print("RAM 类型:", generic.hardware.ram_type())
print("分辨率:", generic.hardware.resolution())
print("屏幕大小:", generic.hardware.screen_size())
print("存储类型:", generic.hardware.ssd_or_hdd())
# CPU: Apple M1
# CPU 代号: Orchid Island
# CPU 频率: 2.2GHz
# 代数: 8th Generation
# 图形卡: AMD Radeon RX Vega 64
# 制造商: Lenovo
# 手机型号: iPhone 14
# RAM 大小: 64GB
# RAM 类型: DDR3
# 分辨率: 2048x1536
# 屏幕大小: 13.3″
# 存储类型: Intel 512GB HDD
```

## 网络
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的自治系统编号（ASN）。 | <font style="color:#2F8EF4;">generic.internet.asn()</font> |
| 返回随机的内容类型。 | <font style="color:#2F8EF4;">generic.internet.content_type()</font> |
| 返回随机的域名系统名称（DSN）。 | <font style="color:#2F8EF4;">generic.internet.dsn()</font> |
| 返回随机的主机名。 | <font style="color:#2F8EF4;">generic.internet.hostname()</font> |
| 返回随机的 HTTP 方法。 | <font style="color:#2F8EF4;">generic.internet.http_method()</font> |
| 返回随机的 HTTP 请求头。 | <font style="color:#2F8EF4;">generic.internet.http_request_headers()</font> |
| 返回随机的 HTTP 响应头。 | <font style="color:#2F8EF4;">generic.internet.http_response_headers()</font> |
| 返回随机的 HTTP 状态码。 | <font style="color:#2F8EF4;">generic.internet.http_status_code()</font> |
| 返回随机的 HTTP 状态消息。 | <font style="color:#2F8EF4;">generic.internet.http_status_message()</font> |
| 返回随机的 IPv4 地址。 | <font style="color:#2F8EF4;">generic.internet.ip_v4()</font> |
| 返回随机的 IPv4 地址对象。 | <font style="color:#2F8EF4;">generic.internet.ip_v4_object()</font> |
| 返回随机的 IPv4 地址和端口。 | <font style="color:#2F8EF4;">generic.internet.ip_v4_with_port()</font> |
| 返回随机的 IPv6 地址。 | <font style="color:#2F8EF4;">generic.internet.ip_v6()</font> |
| 返回随机的 IPv6 地址对象。 | <font style="color:#2F8EF4;">generic.internet.ip_v6_object()</font> |
| 返回随机的 MAC 地址。 | <font style="color:#2F8EF4;">generic.internet.mac_address()</font> |
| 返回随机的路径。 | <font style="color:#2F8EF4;">generic.internet.path()</font> |
| 返回随机的端口号。 | <font style="color:#2F8EF4;">generic.internet.port()</font> |
| 返回随机的公共 DNS。 | <font style="color:#2F8EF4;">generic.internet.public_dns()</font> |
| 返回随机的查询参数。 | <font style="color:#2F8EF4;">generic.internet.query_parameters()</font> |
| 返回随机的查询字符串。 | <font style="color:#2F8EF4;">generic.internet.query_string()</font> |
| 返回随机的 slug。 | <font style="color:#2F8EF4;">generic.internet.slug()</font> |
| 返回随机的特殊 IPv4 地址。 | <font style="color:#2F8EF4;">generic.internet.special_ip_v4()</font> |
| 返回随机的特殊 IPv4 地址对象。 | <font style="color:#2F8EF4;">generic.internet.special_ip_v4_object()</font> |
| 返回随机的股票图片 URL。 | <font style="color:#2F8EF4;">generic.internet.stock_image_url()</font> |
| 返回随机的顶级域名。 | <font style="color:#2F8EF4;">generic.internet.tld()</font> |
| 返回随机的顶级域名。 | <font style="color:#2F8EF4;">generic.internet.top_level_domain()</font> |
| 返回随机的 URI。 | <font style="color:#2F8EF4;">generic.internet.uri()</font> |
| 返回随机的 URL。 | <font style="color:#2F8EF4;">generic.internet.url()</font> |
| 返回随机的用户代理字符串。 | <font style="color:#2F8EF4;">generic.internet.user_agent()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机网络相关数据
print("自治系统编号 (ASN):", generic.internet.asn())
print("内容类型:", generic.internet.content_type())
print("域名系统名称 (DSN):", generic.internet.dsn())
print("主机名:", generic.internet.hostname())
print("HTTP 方法:", generic.internet.http_method())
print("HTTP 请求头:", generic.internet.http_request_headers())
print("HTTP 响应头:", generic.internet.http_response_headers())
print("HTTP 状态码:", generic.internet.http_status_code())
print("HTTP 状态消息:", generic.internet.http_status_message())
print("IPv4 地址:", generic.internet.ip_v4())
print("IPv4 地址对象:", generic.internet.ip_v4_object())
print("IPv4 地址和端口:", generic.internet.ip_v4_with_port())
print("IPv6 地址:", generic.internet.ip_v6())
print("IPv6 地址对象:", generic.internet.ip_v6_object())
print("MAC 地址:", generic.internet.mac_address())
print("路径:", generic.internet.path())
print("端口号:", generic.internet.port())
print("公共 DNS:", generic.internet.public_dns())
print("查询参数:", generic.internet.query_parameters())
print("查询字符串:", generic.internet.query_string())
print("Slug:", generic.internet.slug())
print("特殊 IPv4 地址:", generic.internet.special_ip_v4())
print("特殊 IPv4 地址对象:", generic.internet.special_ip_v4_object())
print("股票图片 URL:", generic.internet.stock_image_url())
print("顶级域名:", generic.internet.tld())
print("顶级域名:", generic.internet.top_level_domain())
print("URI:", generic.internet.uri())
print("URL:", generic.internet.url())
print("用户代理:", generic.internet.user_agent())
# 自治系统编号 (ASN): AS3046628279
# 内容类型: image/tiff-fx
# 域名系统名称 (DSN): redis://junior.info:6379
# 主机名: john.jobs
# HTTP 方法: HEAD
# HTTP 请求头: {'Referer': 'https://motorcycle.mq/2023/11/19/http-resolve-awareness-heritage-chairman-greek', 'Authorization': 'Bearer 4a6270573847706869513251364469646d38467036545a546e356151384173474c53366877304e58634654354b535a776a6c6858536f5753664c33456a5631646254544a4e496b7477534e7a4f69666b37587a324e773d3d', 'Cookie': 'csrftoken=CSmSjauoJzbQeTB9db1fotcmJuxMOOxoRwjKu+GSVPg=; hits=cartoons', 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; MANM; MANM; rv:11.0) like Gecko', 'X-CSRF-Token': '4a73784b465a3645514d4c2b44556f634a67527a4670304168596e315535695a41354278414767616948553d', 'Content-Type': 'text/vnd.ms-mediapackage', 'Content-Length': 2845, 'Connection': 'close', 'Cache-Control': 'no-cache', 'Accept': 'image/ief', 'Host': 'array.gm', 'Accept-Language': 'no'}
# HTTP 响应头: {'Allow': '*', 'Age': 45313, 'Server': 'cloudflare', 'Content-Type': 'application/atomicmail', 'X-Request-ID': '7e0d97ad25ab73a5c1499c053a7f577f', 'Content-Language': 'en', 'Content-Location': 'understanding/glory/memory/paint', 'Set-Cookie': 'csrftoken=ovQzwMXh7U74lG8ikL/iPvWOyRboM/IBgBhqdQeZ3SY=; carriers=pending; HttpOnly', 'Upgrade-Insecure-Requests': 1, 'X-Content-Type-Options': 'nosniff', 'X-XSS-Protection': 1, 'Connection': 'close', 'X-Frame-Options': 'SAMEORIGIN', 'Content-Encoding': 'identity', 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-site', 'Strict-Transport-Security': 'max-age=45313'}
# HTTP 状态码: 428
# HTTP 状态消息: 507 Insufficient Storage
# IPv4 地址: 34.154.204.140
# IPv4 地址对象: 235.118.56.86
# IPv4 地址和端口: 229.12.154.129:61804
# IPv6 地址: af24:4345:6e04:cc52:423d:644b:f948:ccc4
# IPv6 地址对象: c787:182a:426b:4c5a:e08d:6111:691b:3239
# MAC 地址: 00:16:3e:29:4d:d1
# 路径: recommended/extent/effective/tony/destruction
# 端口号: 38483
# 公共 DNS: 94.140.15.15
# 查询参数: {'northwest': 'syntax'}
# 查询字符串: pen=alice&decline=hp&hb=killed&explains=resistant&mention=amendments
# Slug: alive-lookup-lane-hockey-will-suppose-cl-hollywood-sam
# 特殊 IPv4 地址: 192.0.0.181
# 特殊 IPv4 地址对象: 192.0.0.9
# 股票图片 URL: https://source.unsplash.com/1920x1080?
# 顶级域名: .np
# 顶级域名: .dz
# URI: https://system.name/2017/11/04/responsibility-events-plants-buy-rom-processor-kit
# URL: https://hughes.zr/
# 用户代理: Mozilla/5.0 (iPad; CPU OS 8_0 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A365 Safari/600.1.4
```

## 数字
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的复数。 | <font style="color:#2F8EF4;">generic.numeric.complex_number()</font> |
| 返回随机的复数列表。 | <font style="color:#2F8EF4;">generic.numeric.complexes()</font> |
| 返回随机的十进制数。 | <font style="color:#2F8EF4;">generic.numeric.decimal_number()</font> |
| 返回随机的十进制数列表。 | <font style="color:#2F8EF4;">generic.numeric.decimals()</font> |
| 返回随机的浮点数。 | <font style="color:#2F8EF4;">generic.numeric.float_number()</font> |
| 返回随机的浮点数列表。 | <font style="color:#2F8EF4;">generic.numeric.floats()</font> |
| 返回随机的增量值。 | <font style="color:#2F8EF4;">generic.numeric.increment()</font> |
| 返回随机的整数。 | <font style="color:#2F8EF4;">generic.numeric.integer_number()</font> |
| 返回随机的整数列表。 | <font style="color:#2F8EF4;">generic.numeric.integers()</font> |
| 返回随机的矩阵（二维列表）。 | <font style="color:#2F8EF4;">generic.numeric.matrix()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成随机数字相关数据
print("复数:", generic.numeric.complex_number())
print("复数列表:", generic.numeric.complexes())
print("十进制数:", generic.numeric.decimal_number())
print("十进制数列表:", generic.numeric.decimals())
print("浮点数:", generic.numeric.float_number())
print("浮点数列表:", generic.numeric.floats())
print("增量值:", generic.numeric.increment())
print("整数:", generic.numeric.integer_number())
print("整数列表:", generic.numeric.integers())
print("矩阵:", generic.numeric.matrix())
# 复数: (0.316365187155725+0.592702250638067j)
# 复数列表: [(0.484767924695028+0.863923097514897j), (0.3257533126486+0.406461205947471j)]
# 十进制数: -472.94806549501072368002496659755706787109375
# 十进制数列表: [Decimal('313.8311606790438190728309564292430877685546875')]
# 浮点数: -47.7286319588552
# 浮点数列表: [0.110549243328176, 0.777353752447723, 0.54090023658191, 0.60759909181232]
# 增量值: 1
# 整数: -81
# 整数列表: [5, 3, 7, 1, 3, 5, 0, 9, 5, 7]
# 矩阵: [[0.330638874658681, 0.105569620760485]]
```

## 开发路径
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的开发目录路径。 | <font style="color:#2F8EF4;">generic.path.dev_dir()</font> |
| 返回随机的主目录路径。 | <font style="color:#2F8EF4;">generic.path.home()</font> |
| 返回随机的项目目录路径。 | <font style="color:#2F8EF4;">generic.path.project_dir()</font> |
| 返回随机的根目录路径。 | <font style="color:#2F8EF4;">generic.path.root()</font> |
| 返回随机的用户目录路径。 | <font style="color:#2F8EF4;">generic.path.user()</font> |
| 返回随机的用户文件夹路径。 | <font style="color:#2F8EF4;">generic.path.users_folder()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)

# 生成随机路径相关数据
print("开发目录:", generic.path.dev_dir())
print("主目录:", generic.path.home())
print("项目目录:", generic.path.project_dir())
print("根目录:", generic.path.root())
print("用户目录:", generic.path.user())
print("用户文件夹:", generic.path.users_folder())
# 开发目录: /home/cornell/Dev/Kotlin
# 主目录: /home
# 项目目录: /home/playstation/Dev/PL-SQL/othnielia
# 根目录: /
# 用户目录: /home/dry
# 用户文件夹: /home/beings/Study
```

## 支付
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的比特币地址。 | <font style="color:#2F8EF4;">generic.payment.bitcoin_address()</font> |
| 返回随机的内容标识符（CID）。 | <font style="color:#2F8EF4;">generic.payment.cid()</font> |
| 返回随机的信用卡过期日期。 | <font style="color:#2F8EF4;">generic.payment.credit_card_expiration_date()</font> |
| 返回随机的信用卡网络名称。 | <font style="color:#2F8EF4;">generic.payment.credit_card_network()</font> |
| 返回随机的信用卡号码。 | <font style="color:#2F8EF4;">generic.payment.credit_card_number()</font> |
| 返回随机的信用卡持卡人姓名。 | <font style="color:#2F8EF4;">generic.payment.credit_card_owner()</font> |
| 返回随机的 CVV 码。 | <font style="color:#2F8EF4;">generic.payment.cvv()</font> |
| 返回随机的以太坊地址。 | <font style="color:#2F8EF4;">generic.payment.ethereum_address()</font> |
| 返回随机的 PayPal 账户信息。 | <font style="color:#2F8EF4;">generic.payment.paypal()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)

# 生成随机支付相关数据
print("比特币地址:", generic.payment.bitcoin_address())
print("CID:", generic.payment.cid())
print("信用卡过期日期:", generic.payment.credit_card_expiration_date())
print("信用卡网络:", generic.payment.credit_card_network())
print("信用卡号码:", generic.payment.credit_card_number())
print("信用卡持卡人:", generic.payment.credit_card_owner())
print("CVV:", generic.payment.cvv())
print("以太坊地址:", generic.payment.ethereum_address())
print("PayPal 账户:", generic.payment.paypal())
# 比特币地址: 3vZVg276VaTc76WbIB5n2JHOGb0Gj0mGHg
# CID: 1741
# 信用卡过期日期: 05/16
# 信用卡网络: American Express
# 信用卡号码: 5204 5998 7730 6617
# 信用卡持卡人: {'credit_card': '4304 3908 1433 1617', 'expiration_date': '09/18', 'owner': 'JINNY RANDOLPH'}
# CVV: 005
# 以太坊地址: 0x9155ece518a12da0904b9309b7a44f8e7f3275d5
# PayPal 账户: regarded1838@example.com
```

## 交通
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的飞机名称。 | <font style="color:#2F8EF4;">generic.transport.airplane()</font> |
| 返回随机的汽车名称。 | <font style="color:#2F8EF4;">generic.transport.car()</font> |
| 返回随机的制造商名称。 | <font style="color:#2F8EF4;">generic.transport.manufacturer()</font> |
| 返回随机的车辆注册代码。 | <font style="color:#2F8EF4;">generic.transport.vehicle_registration_code()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)

# 生成随机交通工具相关数据
print("飞机名称:", generic.transport.airplane())
print("汽车名称:", generic.transport.car())
print("制造商:", generic.transport.manufacturer())
print("车辆注册代码:", generic.transport.vehicle_registration_code())
# 飞机名称: Piper PA-31 Navajo
# 汽车名称: Daewoo Racer
# 制造商: Rolls-Royce
# 车辆注册代码: BDS
```

## 科学
| 描述 | <font style="color:#2F8EF4;">方法名</font> |
| --- | --- |
| 返回随机的 DNA 序列。 | <font style="color:#2F8EF4;">generic.science.dna_sequence()</font> |
| 返回随机的测量单位。 | <font style="color:#2F8EF4;">generic.science.measure_unit()</font> |
| 返回随机的度量前缀。 | <font style="color:#2F8EF4;">generic.science.metric_prefix()</font> |
| 返回随机的 RNA 序列。 | <font style="color:#2F8EF4;">generic.science.rna_sequence()</font> |


示例：

```python
from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)

# 生成随机科学相关数据
print("DNA 序列:", generic.science.dna_sequence())
print("测量单位:", generic.science.measure_unit())
print("度量前缀:", generic.science.metric_prefix())
print("RNA 序列:", generic.science.rna_sequence())
# DNA 序列: CATTTCACTG
# 测量单位: newton
# 度量前缀: giga
# RNA 序列: ACUGCAACAC
```



# 大数据生成
Mimesis 以生成大数据性能高、速度快为名，实际测试下来，确实够快，尤其配合多线程或者多进程情况下，百万数据达到1分钟以内



示例：

+ 多线程实现

```python
import time
import threading

from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成用户数据的函数
def generate_user_data(num_users):
    users = []
    for _ in range(num_users):
        user = {
            "full_name": generic.person.full_name(),
            "email": generic.person.email(),
            "address": {
                "street": generic.address.address(),
                "city": generic.address.city(),
                "state": generic.address.state(),
                "postal_code": generic.address.postal_code(),
                "country": generic.address.country()
            },
            "gender": generic.person.gender()
        }
        users.append(user)

    return users


def main():
    total_users = 1000000  # 总用户数
    num_threads = 8  # 线程数量
    records_per_thread = total_users // num_threads  # 计算每个线程需要生成的数量

    # 开始计时
    start_time = time.time()

    threads = []

    # 启动线程
    for _ in range(num_threads):
        thread = threading.Thread(target=generate_user_data, args=(records_per_thread, ))
        threads.append(thread)
        thread.start()

    # 等待所有线程完成
    for thread in threads:
        thread.join()

    # 结束计时
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"生成一百万条数据耗时：{elapsed_time}秒")



if __name__ == "__main__":
    main()

# 生成一百万条数据耗时：35.266605377197266秒
```

+ 多进程实现

```python
import time
from multiprocessing import Process
from multiprocessing import Pool

from mimesis import Generic
from mimesis.locales import Locale


# 创建 Generic 实例
generic = Generic(Locale.ZH)


# 生成用户数据的函数
def generate_user_data(num_users):
    users = []
    for _ in range(num_users):
        user = {
            "full_name": generic.person.full_name(),
            "email": generic.person.email(),
            "address": {
                "street": generic.address.address(),
                "city": generic.address.city(),
                "state": generic.address.state(),
                "postal_code": generic.address.postal_code(),
                "country": generic.address.country()
            },
            "gender": generic.person.gender()
        }
        users.append(user)

    return users


def main():
    total_users = 1000000  # 总用户数
    num_processes  = 4  # 进程数量
    records_per_process  = total_users // num_processes  # 计算每个进程需要生成的数量

    # 开始计时
    start_time = time.time()

    # 创建进程池
    pool = Pool(num_processes)

    # 启动进程
    results = []
    for _ in range(num_processes):
        result = pool.apply_async(generate_user_data, args=(records_per_process,))
        results.append(result)

    # 等待所有进程完成
    pool.close()
    pool.join()

    # 合并数据
    data = []
    for result in results:
        data.extend(result.get())

    # 结束计时
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"生成一百万条数据耗时：{elapsed_time}秒")



if __name__ == "__main__":
    main()

# 生成一百万条数据耗时：11.349707841873169秒
```

# 总结
<font style="color:#F38F39;">Mimesis</font> 提供了丰富的字段和方法，能够生成多种类型的随机数据，适用于各种开发和测试场景。通过简单的 API，可以快速生成所需的数据。
