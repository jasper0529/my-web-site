---
title: Python生成并插入百万数据到MySQL
date: 2026-03-19
tags: ['Python', 'mysql']
description: 在进行API接口性能优化时，测试百万级别数据的处理能力是非常重要的环节。为了高效完成这一任务，本文将详细介绍如何生成大量数据并将其快速插入数据库中。 在插入数据之前，首先需要生成大量数据。Python提供了多种库和方法来生成数据，以下是几种常见的方法。 Mimesis 是一个用于生成假数据的 Pyt...
---

<font style="color:rgb(44, 44, 54);">在进行API接口性能优化时，测试百万级别数据的处理能力是非常重要的环节。为了高效完成这一任务，本文将详细介绍如何生成大量数据并将其快速插入数据库中。</font>

# 数据生成
在插入数据之前，首先需要生成大量数据。Python提供了多种库和方法来生成数据，以下是几种常见的方法。

## 1.使用 mimesis 生成数据
`Mimesis`<font style="color:rgb(44, 44, 54);"> 是一个用于生成假数据的 Python 库，尤其适合需要高性能生成大量数据的场景。它支持多种数据类型（如姓名、地址、公司等），并且性能优越，因此非常推荐使用。</font>可以参考我这篇文章： [Python构造数据神器-mimesis](https://www.yuque.com/rimo/python/hz9dz3kpg94vt7ns)

## 2.使用 faker 库生成真实数据
`Faker`<font style="color:rgb(44, 44, 54);"> 是另一个常用的生成假数据的库，它可以生成更贴近实际业务场景的数据，适用于需要模拟真实环境的测试。</font>

官方文档：[faker](https://faker.readthedocs.io/en/master/)

##  3.自定义数据生成
<font style="color:rgb(44, 44, 54);">如果需要更灵活的数据生成方式，可以自定义数据生成逻辑。以下是一个示例，展示了如何根据需求生成 IP 和 URL 数据。</font>

示例：

```python
def generate_random_data(num, data_type):
    """
    生成随机数据
    :param num: 数据数量
    :param data_type: 数据类型（0: IP, 1: URL）
    :return:
    """
    # 预分配内存
    data_list = [None] * num
    ip = None
    for i in range(num):
        if data_type == 0:
            ip = custom_random.random_ip_v4()
            name = ip
            fingerprints = {
                "basic_info": {
                    "company": custom_random.random_company(),
                    "hostname": custom_random.random_hostname(),
                    "mac": custom_random.random_mac(),
                    "middleware": custom_random.random_middleware(),
                    "name": custom_random.random_asset_name(),
                    "os": custom_random.random_os(),
                },
                "port": generate_ports()
            }
        else:
            url = custom_random.random_url()
            name = url
            fingerprints = {
                "basic_info": {
                    "company": custom_random.random_company(),
                    "hostname": custom_random.random_hostname(),
                    "mac": custom_random.random_mac(),
                    "title": custom_random.random_title(),
                    "middleware": [custom_random.random_middleware()
                                   for _ in range(np.random.randint(1, 4))],
                    "language": [custom_random.random_language()
                                 for _ in range(np.random.randint(1, 4))],
                    "database": [custom_random.random_database()
                                 for _ in range(np.random.randint(1, 4))],
                    "application": [custom_random.random_application()
                                    for _ in range(np.random.randint(1, 4))],
                    "framework": [custom_random.random_framework()
                                  for _ in range(np.random.randint(1, 4))],
                    "name": custom_random.random_asset_name(),
                },
                "port": generate_ports()
            }

        asset = {
            "name": name,
            "type": data_type,
            "create_time": datetime.now(),
            "is_alive": random.choice([0, 1]),
            "ip": ip if data_type == 0 else None,
            "fingerprints": json.dumps(fingerprints),
        }

        data_list[i] = asset
    return data_list
```

## 4.**<font style="color:rgb(44, 44, 54);">多进程优化数据生成</font>**
<font style="color:rgb(44, 44, 54);">单进程生成百万级别的数据会非常耗时，尤其是在数据结构复杂的情况下。因此，推荐使用多进程来加速数据生成。</font>

示例：

```python
def generate_data_parallel(num, data_type):
    """
    生成数据
    :param num: 数据数量
    :param data_type: 数据类型（0: IP, 1: URL）
    :return:
    """
    num_processes = multiprocessing.cpu_count()
    records_per_process = num // num_processes
    with multiprocessing.Pool(num_processes) as pool:
        results = pool.starmap(generate_random_data,
                               [(records_per_process, data_type) for _ in
                                range(num_processes)])

    return [item for sublist in results for item in sublist]
```

# 数据入库
插入数据也有多种方式，<font style="color:rgb(44, 44, 54);">对于 MySQL 数据库来说，百万级别的数据插入效率最高的方法是使用 </font>`LOAD DATA INFILE`<font style="color:rgb(44, 44, 54);">，它可以将数据文件直接加载到数据库中。</font>

## <font style="color:rgb(44, 44, 54);">1. 将数据保存为 CSV 文件</font>
<font style="color:rgb(44, 44, 54);">为了使用 </font>`<font style="color:#F38F39;">LOAD DATA INFILE</font>`<font style="color:rgb(44, 44, 54);">，需要先将生成的数据保存为 CSV 文件。以下是使用 </font>`<font style="color:#F38F39;">pandas</font>`<font style="color:rgb(44, 44, 54);"> 批量写入 CSV 文件的示例代码。</font>

```python
def write_csv(csv_file, data):
    """
    生成数据并写入CSV文件
    :param csv_file: CSV文件路径
    :param data: 数据生成器
    :return:
    """
    # 使用 `pandas` 批量写入 CSV 文件
    df = pd.DataFrame(data)
    df.to_csv(csv_file, index=False, encoding='utf-8')
```

## <font style="color:rgb(44, 44, 54);">2. 使用 </font>`LOAD DATA INFILE`<font style="color:rgb(44, 44, 54);"> 插入数据</font>
写入csv文件后，就可以使用<font style="color:#F38F39;">LOAD DATA INFILE</font>直接入库了

示例：

```python
def load_data_infile(csv_file, table_name):
    """
    使用`LOAD DATA INFILE`插入数据
    :param csv_file: CSV文件路径
    :param table_name: 目标表名
    :return:
    """
    try:
        db.cursor.execute(f"""
            LOAD DATA INFILE '{csv_file}' IGNORE INTO TABLE {table_name}
            FIELDS TERMINATED BY ','
            ENCLOSED BY '"'
            LINES TERMINATED BY '\n'
            IGNORE 1 ROWS
            (name,type,create_time,is_alive,ip,fingerprints);
        """)
        db.conn.commit()
        print(f"成功从文件 {csv_file} 加载数据到表 {table_name}")
    except pymysql.MySQLError as e:
        print(f"加载数据时发生错误: {e}")
        db.conn.rollback()
```

# 总结
<font style="color:rgb(44, 44, 54);">百万级别的数据生成和插入是一项复杂的任务，需要充分考虑性能和资源问题。通过以下步骤，可以显著提升效率：</font>

1. <font style="color:rgb(44, 44, 54);">使用高效的假数据生成工具（如 </font>`<font style="color:#F38F39;">mimesis</font>`<font style="color:rgb(44, 44, 54);"> 或 </font>`<font style="color:#F38F39;">faker</font>`<font style="color:rgb(44, 44, 54);">）。</font>
2. <font style="color:rgb(44, 44, 54);">利用多进程或并行计算加速数据生成。</font>
3. <font style="color:rgb(44, 44, 54);">使用 </font>`<font style="color:#F38F39;">pandas</font>`<font style="color:rgb(44, 44, 54);"> 快速将数据保存为 CSV 文件。</font>
4. <font style="color:rgb(44, 44, 54);">使用 </font>`<font style="color:#F38F39;">LOAD DATA INFILE</font>`<font style="color:rgb(44, 44, 54);"> 实现批量数据插入。</font>

# <font style="color:rgb(44, 44, 54);">性能测试结果</font>
<font style="color:rgb(44, 44, 54);">在测试中，我们生成了 200 万条数据，并将其插入 MySQL 数据库。以下是测试结果：</font>

+ <font style="color:rgb(44, 44, 54);">硬件环境：4 核 CPU</font>
+ <font style="color:rgb(44, 44, 54);">总用时：约 5 分钟以内（最快情况下）~10分钟（最慢）</font>

<font style="color:rgb(44, 44, 54);">这种方法不仅高效，而且易于实现，非常适合用于大规模数据测试场景。</font>

<font style="color:rgb(44, 44, 54);">示例完整代码：</font>

```python
import os
import multiprocessing
import time
import json
from datetime import datetime
import random

import pymysql
import pandas as pd
import numpy as np

from scripts.build_data.utils import random as custom_random
from scripts.build_data.db import db
from scripts.build_data.db import reset_and_truncate_table


def get_device_type():
    """
    获取设备类型
    :return:
    """
    sql = """
        SELECT
        p.NAME AS parent_name,
        c.NAME AS child_name 
    FROM
        AssetCategory p
        JOIN AssetCategory c ON p.classify_id = c.parent_id 
    """
    db.cursor.execute(sql)

    # 获取所有结果
    return db.cursor.fetchall()


device_type = get_device_type()


def generate_ports():
    """
    生成随机端口信息
    :return:
    """
    num_ports = np.random.randint(1, 3)  # 随机生成 1 到 2 个端口信息
    protocols = [custom_random.random_protocol() for _ in range(num_ports)]
    ports = [custom_random.random_port() for _ in range(num_ports)]
    services = [custom_random.random_service() for _ in range(num_ports)]
    softwares = [custom_random.random_software() for _ in range(num_ports)]

    # 使用 zip 将各个部分组合成一个列表
    port_info = [
        [protocols[i], ports[i], services[i], softwares[i], "", "", []]
        for i in range(num_ports)
    ]

    return port_info


def generate_random_data(num, data_type):
    """
    生成随机数据
    :param num: 数据数量
    :param data_type: 数据类型（0: IP, 1: URL）
    :return:
    """
    # 预分配内存
    data_list = [None] * num
    ip = None
    for i in range(num):
        if data_type == 0:
            ip = custom_random.random_ip_v4()
            name = ip
            fingerprints = {
                "basic_info": {
                    "company": custom_random.random_company(),
                    "hostname": custom_random.random_hostname(),
                    "mac": custom_random.random_mac(),
                    "middleware": custom_random.random_middleware(),
                    "name": custom_random.random_asset_name(),
                    "os": custom_random.random_os(),
                },
                "port": generate_ports()
            }
        else:
            url = custom_random.random_url()
            name = url
            fingerprints = {
                "basic_info": {
                    "company": custom_random.random_company(),
                    "hostname": custom_random.random_hostname(),
                    "mac": custom_random.random_mac(),
                    "title": custom_random.random_title(),
                    "middleware": [custom_random.random_middleware()
                                   for _ in range(np.random.randint(1, 4))],
                    "language": [custom_random.random_language()
                                 for _ in range(np.random.randint(1, 4))],
                    "database": [custom_random.random_database()
                                 for _ in range(np.random.randint(1, 4))],
                    "application": [custom_random.random_application()
                                    for _ in range(np.random.randint(1, 4))],
                    "framework": [custom_random.random_framework()
                                  for _ in range(np.random.randint(1, 4))],
                    "name": custom_random.random_asset_name(),
                },
                "port": generate_ports()
            }

        asset = {
            "name": name,
            "type": data_type,
            "create_time": datetime.now(),
            "is_alive": random.choice([0, 1]),
            "ip": ip if data_type == 0 else None,
            "fingerprints": json.dumps(fingerprints),
        }

        data_list[i] = asset
    return data_list


def generate_data_parallel(num, data_type):
    """
    生成数据
    :param num: 数据数量
    :param data_type: 数据类型（0: IP, 1: URL）
    :return:
    """
    num_processes = multiprocessing.cpu_count()
    records_per_process = num // num_processes
    with multiprocessing.Pool(num_processes) as pool:
        results = pool.starmap(generate_random_data,
                               [(records_per_process, data_type) for _ in
                                range(num_processes)])

    return [item for sublist in results for item in sublist]


def write_csv(csv_file, data):
    """
    生成数据并写入CSV文件
    :param csv_file: CSV文件路径
    :param data: 数据生成器
    :return:
    """
    # 使用 `pandas` 批量写入 CSV 文件
    df = pd.DataFrame(data)
    df.to_csv(csv_file, index=False, encoding='utf-8')


def load_data_infile(csv_file, table_name):
    """
    使用`LOAD DATA INFILE`插入数据
    :param csv_file: CSV文件路径
    :param table_name: 目标表名
    :return:
    """
    try:
        db.cursor.execute(f"""
            LOAD DATA INFILE '{csv_file}' IGNORE INTO TABLE {table_name}
            FIELDS TERMINATED BY ','
            ENCLOSED BY '"'
            LINES TERMINATED BY '\n'
            IGNORE 1 ROWS
            (name,type,create_time,is_alive,ip,fingerprints);
        """)
        db.conn.commit()
        print(f"成功从文件 {csv_file} 加载数据到表 {table_name}")
    except pymysql.MySQLError as e:
        print(f"加载数据时发生错误: {e}")
        db.conn.rollback()


def main():
    """

    :return:
    """
    # 生成150万条IP数据和50万条URL数据
    start_time = time.time()
    ip_data = generate_data_parallel(1500000, 0)
    url_data = generate_data_parallel(500000, 1)
    print(f"生成数据耗时: {time.time() - start_time}秒")

    # 写入CSV文件
    start_time = time.time()
    write_csv('asset.csv', ip_data)
    write_csv('asset_url.csv', url_data)
    print(f"写入CSV文件耗时: {time.time() - start_time}秒")

    # 清空表并重置ID
    reset_and_truncate_table("VulnAsset")

    # 插入数据
    start_time = time.time()
    _script_path = os.path.dirname(os.path.abspath(__file__))
    load_data_infile(os.path.join(_script_path, "asset.csv"), "Asset")
    load_data_infile(os.path.join(_script_path, "asset_url.csv"), "Asset")
    print(f"写入数据库耗时: {time.time() - start_time}秒")


if __name__ == '__main__':
    main()
```