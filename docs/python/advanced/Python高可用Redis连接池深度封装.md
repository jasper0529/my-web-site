---
title: Python高可用Redis连接池深度封装
date: 2026-03-12
tags: ['Python', 'redis']
description: Redis作为高性能的内存数据库，已成为现代系统的关键基础设施。然而原生Redis客户端在复杂生产环境中暴露出诸多痛点： + 连接泄漏</...
---


# 引言
Redis作为高性能的内存数据库，已成为现代系统的关键基础设施。然而原生Redis客户端在复杂生产环境中暴露出诸多痛点：

+ **连接泄漏**：开发人员容易忘记手动释放连接
+ **网络脆弱**：TCP连接意外中断导致服务不可用
+ **监控缺失**：缺乏关键指标影响故障排查
+ **多进程隐患**：fork操作导致连接状态异常
+ **重复造轮子**：每个项目都需要重复实现基础功能

为了解决这些问题，本文将介绍一个封装 Redis 客户端的实践方案，该方案支持高可用性、性能监控、重试机制和线程安全。

#  代码结构概述
代码的核心是 RedisClient 类，它封装了 Redis 的连接、重试、性能监控和线程安全功能。以下是代码的主要模块：

+ 自定义异常类：RedisClientError 及其子类（如 RedisConnectionError、RedisOperationError）用于更精确地处理 Redis 相关的错误。
+ 性能监控类：RedisMetrics 用于记录 Redis 的性能指标，包括请求数量、响应时间、重连次数等。
+ 重试策略类：RetryPolicy 定义了重试策略，包括最大重试次数、重试间隔、重试指数等。
+ 重试装饰器：retry 装饰器根据重试策略实现自动重试功能。
+ RedisClient 类：实现了单例模式、连接池、重试机制、性能监控和线程安全。

# 核心功能实现
## 单例模式与连接池
为了提高性能和避免重复创建连接，RedisClient 使用了单例模式和连接池。单例模式确保了每个配置对应的 Redis 客户端只有一个实例，而连接池则通过复用连接减少连接创建的开销。

```python
@classmethod
def get_client(cls, config: Optional[Dict] = None) -> 'RedisClient':
    """
    获取 Redis 客户端实例 ---> 单例模式
    :param config:
    :return:
    """
    raw_config = config.copy() if config else {}
    processed_config = cls._load_config(raw_config)

    def normalize(value):
        if isinstance(value, list):
            return tuple(normalize(item) for item in value)
        elif isinstance(value, dict):
            return frozenset(
                sorted((k, normalize(v)) for k, v in value.items()))
        return value

    config_key = normalize(processed_config)

    with cls._lock:
        if config_key not in cls._instances:
            cls._instances[config_key] = cls(config)
        instance = cls._instances[config_key]

        # Reconnect if connection closed
        if not instance._client or not instance.health_check():
            instance._init_connection()

    return instance
```

## 重试机制
retry 装饰器实现了重试机制，能够处理可重试的异常（如 ConnectionError、TimeoutError 等）。通过配置重试策略，可以灵活调整重试次数和间隔。

```python
class RetryPolicy:
    """
    重试策略类
    提供重试策略，包括最大重试次数、重试间隔、重试指数、最大重试间隔和可重试的异常类型。
    """
    def __init__(
            self,
            max_attempts: int = 3,
            delay: float = 0.1,
            backoff: float = 2.0,
            max_delay: float = 5.0,
            retriable_errors: Tuple[Exception] = (
                    ConnectionError,
                    TimeoutError,
                    ConnectionResetError
            )
    ):
        """
        初始化重试策略
        :param max_attempts: 最大重试次数
        :param delay: 重试间隔
        :param backoff: 重试指数
        :param max_delay: 最大重试间隔
        :param retriable_errors: 可重试的异常类型
        """
        self.max_attempts = max_attempts
        self.delay = delay
        self.backoff = backoff
        self.max_delay = max_delay
        self.retriable_errors = retriable_errors


def retry(policy: RetryPolicy = RetryPolicy()):
    """
    重试装饰器
    :param policy: 重试策略
    :return:
    """
    def decorator(func):
        """装饰器"""
        @wraps(func)
        def wrapper(*args, **kwargs):
            """包装函数"""
            attempts = 0
            current_delay = policy.delay
            last_exception = None

            while attempts < policy.max_attempts:
                try:
                    return func(*args, **kwargs)
                except policy.retriable_errors as e:
                    last_exception = e
                    logger.warning(f"Retryable error occurred: {str(e)}")
                    time.sleep(current_delay)
                    current_delay = min(current_delay * policy.backoff,
                                        policy.max_delay)
                    attempts += 1
                except RedisError as e:
                    raise RedisOperationError(
                        f"Non-retriable error: {str(e)}") from e

            raise RedisRetryExhaustedError(
                f"Operation failed after {policy.max_attempts} attempts"
            ) from last_exception

        return wrapper

    return decorator
```

## 性能监控
RedisMetrics 类记录了 Redis 的性能指标，包括请求数量、响应时间、重连次数等。通过这些指标，可以实时监控 Redis 的健康状态。

RedisMetrics类记录的关键指标：

| 指标 | 说明 | 采样方式 |
| --- | --- | --- |
| slow_queries | 慢查询列表(命令+耗时) | 自动记录>500ms操作 |
| avg_time | 平均响应时间 | 加权平均算法 |
| error_requests | 失败请求数 | 异常捕获计数 |
| reconnects | 重连次数 | 心跳线程触发计数 |


```python
@dataclass
class RedisMetrics:
    """
    Redis 性能监控指标
    记录 Redis 的性能指标，包括总的请求数量、成功的请求数量、失败的请求数量、平均响应时间、最后一次错误信息。
    """
    total_requests: int = 0
    success_requests: int = 0
    error_requests: int = 0
    avg_time: float = 0
    last_error: Optional[str] = None
    reconnects: int = 0  # 重连次数统计
    heartbeats: int = 0  # 心跳次数统计
    slow_queries: List[Tuple[str, float]] = None  # (command, duration)

    def __str__(self):
        """
        返回 Redis 性能监控指标的字符串表示
        :return:
        """
        return (f"total_requests: {self.total_requests}, "
                f"success_requests: {self.success_requests}, "
                f"error_requests: {self.error_requests}, "
                f"avg_time: {self.avg_time}, "
                f"last_error: {self.last_error}, "
                f"reconnects: {self.reconnects}, "
                f"heartbeats: {self.heartbeats}, "
                f"slow_queries: {self.slow_queries}")

    def __post_init__(self):
        """
        初始化
        :return:
        :return:
        """
        self.slow_queries = []

    def record_slow_query(self, command: str, duration: float = 0.5):
        """
        记录慢查询
        :param command:
        :param duration:
        :return:
        """
        if duration >= 0.5:  # 慢查询阈值 500ms
            self.slow_queries.append((command, duration))
            if len(self.slow_queries) > 100:  # 最大保留100条
                self.slow_queries.pop(0)
```

## 心跳机制与自动重连
为了检测 Redis 的连接状态，RedisClient 实现了心跳机制。心跳线程定期检查连接状态，如果发现连接中断，则尝试重连。

```python
 def heartbeat_loop(self):
        """心跳循环"""
        while self._heartbeat_active.is_set():
            try:
                self._check_connection()
                self.metrics.heartbeats += 1
            except RedisConnectionError:
                self._reconnect()
            time.sleep(self.config['heartbeat_interval'])

def _start_heartbeat(self):
    """启动心跳线程"""
    if self.config['heartbeat_interval'] <= 0:
        return

    self._heartbeat_active.set()
    self._heartbeat_thread = threading.Thread(
        target=self.heartbeat_loop,
        name="RedisHeartbeat",
        daemon=True
    )
    self._heartbeat_thread.start()

def _reconnect(self):
    """重连"""
    with self._instance_lock:
        self.metrics.reconnects += 1
        try:
            self.close()  # 关闭当前连接
            self._init_connection()  # 重新初始化连接
            logger.info("Reconnected to Redis.")
        except Exception as e:
            logger.error(f"Reconnection failed: {str(e)}")
            raise RedisConnectionError("Reconnection failed") from e
```

异常处理流程：

1. 检测到连接断开
2. 关闭旧连接（释放资源）
3. 重新初始化连接池
4. 更新重连计数器（metrics.reconnects）

## 哨兵模式集成
配置示例：

```python
config = {
    'use_sentinel': True,
    'sentinel_service_name': 'mymaster',
    'sentinel_nodes': [('sentinel1', 26379), ('sentinel2', 26379)],
    'sentinel_password': 'xxxx'
}
```

初始化过程：

1. 创建Sentinel对象连接哨兵集群
2. 通过master_for获取主节点连接
3. 自动处理主从切换事件

# 使用示例
## 最简单使用方式
```python
with RedisClient.context(config_) as rc:
    rc.set('simple_key', 'value')
    print(rc.get('simple_key'))  # 输出: value
```

## 使用客户端
```python
configure_default(**config_)
client = get_default_client()
client.set('global_key', 42)
print(client.get('global_key'))  # 输出: 42
```

## 流水线操作
```python
with client.pipeline() as pipe:
    pipe.incr('counter')
    pipe.expire('counter', 60)
```

## 事务操作
```python
def update_counter(pipe: Pipeline):
    current = pipe.get('counter')
    pipe.multi()
    pipe.set('counter', int(current or 0) + 1)

client.transaction(update_counter, 'counter')
```

## 查看性能指标
可以使用自定义回调

```python
def monitor_handler(command: str, args: Tuple, kwargs: Dict,
                        duration: float, success: bool, error: Optional[str] = None):
    if success:
        logger.info(f"{command} executed in {duration:.2f}ms")
    else:
        logger.error(f"{command} failed after {duration:.2f}ms: {error}")
```

直接查看

```python
print(client.metrics)
```

# 完整代码
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2025/02/18
# @Author  : rimo
# @File    : redis.py
import logging
import os
import threading
import time
from contextlib import contextmanager
from dataclasses import dataclass
from functools import wraps
from typing import Optional
from typing import Dict
from typing import Any
from typing import List
from typing import Tuple
from typing import Callable

from redis import Redis
from redis import Connection
from redis import SSLConnection
from redis import ConnectionPool
from redis.client import Pipeline
from redis.sentinel import Sentinel
from redis.exceptions import RedisError
from redis.exceptions import AuthenticationError
from redis.exceptions import ConnectionError

logger = logging.getLogger(__name__)


class RedisClientError(Exception):
    """自定义 Redis 异常类"""
    pass


class RedisConnectionError(RedisClientError):
    """Redis 连接异常"""
    pass


class RedisOperationError(RedisClientError):
    """Redis 操作异常"""
    pass


class RedisConfigError(RedisClientError):
    """Redis 配置异常"""
    pass


class RedisRetryExhaustedError(RedisClientError):
    """Redis 重试异常"""
    pass


class RedisTimeoutError(RedisClientError):
    """Redis 超时异常"""
    pass


@dataclass
class RedisMetrics:
    """
    Redis 性能监控指标
    记录 Redis 的性能指标，包括总的请求数量、成功的请求数量、失败的请求数量、平均响应时间、最后一次错误信息。
    """
    total_requests: int = 0
    success_requests: int = 0
    error_requests: int = 0
    avg_time: float = 0
    last_error: Optional[str] = None
    reconnects: int = 0  # 重连次数统计
    heartbeats: int = 0  # 心跳次数统计
    slow_queries: List[Tuple[str, float]] = None  # (command, duration)

    def __str__(self):
        """
        返回 Redis 性能监控指标的字符串表示
        :return:
        """
        return (f"total_requests: {self.total_requests}, "
                f"success_requests: {self.success_requests}, "
                f"error_requests: {self.error_requests}, "
                f"avg_time: {self.avg_time}, "
                f"last_error: {self.last_error}, "
                f"reconnects: {self.reconnects}, "
                f"heartbeats: {self.heartbeats}, "
                f"slow_queries: {self.slow_queries}")

    def __post_init__(self):
        """
        初始化
        :return:
        :return:
        """
        self.slow_queries = []

    def record_slow_query(self, command: str, duration: float = 0.5):
        """
        记录慢查询
        :param command:
        :param duration:
        :return:
        """
        if duration >= 0.5:  # 慢查询阈值 500ms
            self.slow_queries.append((command, duration))
            if len(self.slow_queries) > 100:  # 最大保留100条
                self.slow_queries.pop(0)


class RetryPolicy:
    """
    重试策略类
    提供重试策略，包括最大重试次数、重试间隔、重试指数、最大重试间隔和可重试的异常类型。
    """
    def __init__(
            self,
            max_attempts: int = 3,
            delay: float = 0.1,
            backoff: float = 2.0,
            max_delay: float = 5.0,
            retriable_errors: Tuple[Exception] = (
                    ConnectionError,
                    TimeoutError,
                    ConnectionResetError
            )
    ):
        """
        初始化重试策略
        :param max_attempts: 最大重试次数
        :param delay: 重试间隔
        :param backoff: 重试指数
        :param max_delay: 最大重试间隔
        :param retriable_errors: 可重试的异常类型
        """
        self.max_attempts = max_attempts
        self.delay = delay
        self.backoff = backoff
        self.max_delay = max_delay
        self.retriable_errors = retriable_errors


def retry(policy: RetryPolicy = RetryPolicy()):
    """
    重试装饰器
    :param policy: 重试策略
    :return:
    """
    def decorator(func):
        """装饰器"""
        @wraps(func)
        def wrapper(*args, **kwargs):
            """包装函数"""
            attempts = 0
            current_delay = policy.delay
            last_exception = None

            while attempts < policy.max_attempts:
                try:
                    return func(*args, **kwargs)
                except policy.retriable_errors as e:
                    last_exception = e
                    logger.warning(f"Retryable error occurred: {str(e)}")
                    time.sleep(current_delay)
                    current_delay = min(current_delay * policy.backoff,
                                        policy.max_delay)
                    attempts += 1
                except RedisError as e:
                    raise RedisOperationError(
                        f"Non-retriable error: {str(e)}") from e

            raise RedisRetryExhaustedError(
                f"Operation failed after {policy.max_attempts} attempts"
            ) from last_exception

        return wrapper

    return decorator


class RedisClient:
    """
    Redis 客户端类
    提供对 Redis 的封装，支持连接池、重试机制、性能监控和线程安全
    """
    _instances: Dict[Any, 'RedisClient'] = {}
    _lock = threading.Lock()

    def __init__(self, config: Dict[str, Any]):
        # Validate config
        self._validate_config(config)
        self.config = self._load_config(config or {})
        self._pool: Optional[ConnectionPool] = None
        self._client: Optional[Redis] = None
        self._sentinel: Optional[Sentinel] = None
        self.metrics = RedisMetrics()
        # 锁
        self._instance_lock = threading.RLock()
        # 心跳线程
        self._heartbeat_thread: Optional[threading.Thread] = None
        # 心跳事件
        self._heartbeat_active = threading.Event()

        # 初始化连接
        self._init_connection()
        # 启动心跳
        self._start_heartbeat()

    @staticmethod
    def _load_config(config: Dict) -> Dict:
        """
        加载配置
        :param config:
        :return:
        """
        return {
            'host': config.get('host') or os.getenv('REDIS_HOST', 'localhost'),
            'port': int(config.get('port') or os.getenv('REDIS_PORT', 6379)),
            'db': int(config.get('db') or os.getenv('REDIS_DB', 0)),
            'password': config.get('password') or os.getenv('REDIS_PASSWORD'),
            'socket_timeout': int(config.get('socket_timeout') or os.getenv(
                'REDIS_SOCKET_TIMEOUT', 5)),
            'max_connections': int(config.get('max_connections') or os.getenv(
                'REDIS_MAX_CONNECTIONS', 100)),
            'decode_responses': config.get('decode_responses', True),
            'use_sentinel': config.get('use_sentinel', False),
            'sentinel_service_name': config.get('sentinel_service_name'),
            'sentinel_nodes': config.get('sentinel_nodes', []),
            'ssl': config.get('ssl', False),
            'heartbeat_interval': int(config.get('heartbeat_interval', 60)),
        }

    @classmethod
    def _validate_config(cls, config: Dict[str, Any]):
        """
        验证配置
        :param config:
        :return:
        """
        if config.get('use_sentinel'):
            if not config.get('sentinel_service_name'):
                raise RedisConfigError(
                    "Missing sentinel_service_name in sentinel mode")
            if not isinstance(config.get('sentinel_nodes'), list):
                raise RedisConfigError(
                    "sentinel_nodes must be a list of (host, port) tuples")

        if config.get('ssl') and not config.get('password'):
            logger.warning(
                "Using SSL without password may cause authentication issues")

    def _check_connection(self):
        """检查连接状态"""
        try:
            if not self._client or not self._client.ping():
                raise RedisConnectionError("Connection not alive")
        except (ConnectionError, TimeoutError) as e:
            raise RedisConnectionError(f"Connection check failed: {str(e)}")

    def heartbeat_loop(self):
        """心跳循环"""
        while self._heartbeat_active.is_set():
            try:
                self._check_connection()
                self.metrics.heartbeats += 1
            except RedisConnectionError:
                self._reconnect()
            time.sleep(self.config['heartbeat_interval'])

    def _start_heartbeat(self):
        """启动心跳线程"""
        if self.config['heartbeat_interval'] <= 0:
            return

        self._heartbeat_active.set()
        self._heartbeat_thread = threading.Thread(
            target=self.heartbeat_loop,
            name="RedisHeartbeat",
            daemon=True
        )
        self._heartbeat_thread.start()

    def _reconnect(self):
        """重连"""
        with self._instance_lock:
            self.metrics.reconnects += 1
            try:
                self.close()  # 关闭当前连接
                self._init_connection()  # 重新初始化连接
                logger.info("Reconnected to Redis.")
            except Exception as e:
                logger.error(f"Reconnection failed: {str(e)}")
                raise RedisConnectionError("Reconnection failed") from e

    def _init_connection(self):
        """
        初始化 Redis 连接
        :return:
        """
        with self._instance_lock:
            try:
                if self.config['use_sentinel']:
                    self._init_sentinel()
                else:
                    self._init_standalone()
                # Test connection
                if not self.health_check():
                    raise RedisConnectionError(
                        "Initial connection test failed")

            except AuthenticationError as e:
                raise RedisConnectionError(
                        f"Authentication failed: {str(e)}") from e
            except ConnectionError as e:
                raise RedisConnectionError(
                    f"Connection failed: {str(e)}") from e
            except RedisError as e:
                raise RedisConnectionError(f"Redis error: {str(e)}") from e

    def _init_standalone(self):
        """
        初始化单机模式
        :return:
        """
        connection_kwargs = {
            'host': self.config['host'],
            'port': self.config['port'],
            'db': self.config['db'],
            'password': self.config['password'],
            'socket_timeout': self.config['socket_timeout'],
            'max_connections': self.config['max_connections'],
            'decode_responses': self.config['decode_responses'],
        }
        connection_class = SSLConnection if self.config['ssl'] else Connection
        self._pool = ConnectionPool(connection_class=connection_class,
                                    **connection_kwargs)
        self._client = Redis(connection_pool=self._pool)

    def _init_sentinel(self):
        """
        初始化哨兵模式
        :return:
        """
        self._sentinel = Sentinel(
            self.config['sentinel_nodes'],
            sentinel_kwargs={'password': self.config.get('sentinel_password')},
            socket_timeout=self.config['socket_timeout'],
            socket_connect_timeout=self.config['socket_timeout'],
            password=self.config['password'],
            decode_responses=self.config['decode_responses']
        )
        self._client = self._sentinel.master_for(
            self.config['sentinel_service_name'],
            socket_timeout=self.config['socket_timeout']
        )

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def close(self):
        """
        关闭 Redis 连接
        :return:
        """
        self._heartbeat_active.clear()

        with self._instance_lock:
            if self._pool:
                self._pool.disconnect()
                self._pool = None
            if self._client:
                self._client.close()
                self._client = None

    @contextmanager
    def _get_connection(self) -> Redis:
        """获取连接上下文管理"""
        try:
            yield self._client
        except ConnectionError as e:
            self._handle_connection_error(e)
            raise
        except TimeoutError as e:
            self._handle_timeout_error(e)
            raise

    def _handle_connection_error(self, error: ConnectionError):
        """连接错误处理"""
        logger.error("Connection error occurred, attempting to reconnect...")
        self._reconnect()

    def _handle_timeout_error(self, error: TimeoutError):
        """超时错误处理"""
        logger.warning(f"Operation timed out: {str(error)}")
        self.metrics.error_requests += 1

    @retry()
    def execute(self, command: str, *args, **kwargs) -> Any:
        """
        执行 Redis 命令
        :param command:
        :param args:
        :param kwargs:
        :return:
        """
        start_time = time.perf_counter()
        self.metrics.total_requests += 1

        try:
            with self._get_connection() as conn:
                result = getattr(conn, command)(*args, **kwargs)
                duration = time.perf_counter() - start_time

                # 记录性能指标
                self.metrics.success_requests += 1
                self.metrics.avg_time = (
                        (self.metrics.avg_time * (
                                    self.metrics.total_requests - 1) + duration)
                        / self.metrics.total_requests
                )
                self.metrics.record_slow_query(command, duration)

                # 自定义监控回调
                if self.config.get('monitor_callback'):
                    self.config['monitor_callback'](
                        command=command,
                        args=args,
                        kwargs=kwargs,
                        duration=duration,
                        success=True
                    )

                return result
        except Exception as e:
            duration = time.perf_counter() - start_time
            self.metrics.error_requests += 1
            self.metrics.last_error = str(e)

            if self.config.get('monitor_callback'):
                self.config['monitor_callback'](
                    command=command,
                    args=args,
                    kwargs=kwargs,
                    duration=duration,
                    success=False,
                    error=str(e)
                )

            if isinstance(e, TimeoutError):
                raise RedisTimeoutError(
                    f"Operation timed out after {duration:.2f}s") from e
            if isinstance(e, ConnectionError):
                raise RedisConnectionError(
                    "Connection lost during operation") from e

            raise RedisOperationError(f"Operation failed: {str(e)}") from e

    def __getattr__(self, name: str) -> Any:
        """
        代理 Redis 命令
        :param name:
        :return:
        """
        if hasattr(self._client, name):
            def method(*args, **kwargs):
                """操作"""
                return self.execute(name, *args, **kwargs)

            return method

        raise AttributeError(f"'RedisClient' has no attribute '{name}'")

    @classmethod
    def get_client(cls, config: Optional[Dict] = None) -> 'RedisClient':
        """
        获取 Redis 客户端实例 ---> 单例模式
        :param config:
        :return:
        """
        raw_config = config.copy() if config else {}
        processed_config = cls._load_config(raw_config)

        def normalize(value):
            if isinstance(value, list):
                return tuple(normalize(item) for item in value)
            elif isinstance(value, dict):
                return frozenset(
                    sorted((k, normalize(v)) for k, v in value.items()))
            return value

        config_key = normalize(processed_config)

        with cls._lock:
            if config_key not in cls._instances:
                cls._instances[config_key] = cls(config)
            instance = cls._instances[config_key]

            # Reconnect if connection closed
            if not instance._client or not instance.health_check():
                instance._init_connection()

        return instance

    def health_check(self) -> bool:
        """
        检测redis连接是否正常
        :return:
        """
        try:
            return self._client.ping()
        except RedisError as e:
            logger.error(f"Health check failed: {str(e)}")
            return False

    @staticmethod
    def context(config: Optional[Dict] = None) -> 'RedisClient':
        """
        获取 Redis 客户端实例 ---> 上下文管理器
        :param config:
        :return:
        """
        return RedisClient.get_client(config)

    @contextmanager
    def pipeline(self) -> Pipeline:
        """流水线上下文管理器"""
        try:
            with self._get_connection() as conn:
                pipeline = conn.pipeline()
                yield pipeline
                pipeline.execute()
        except Exception as e:
            logger.error(f"Pipeline execution failed: {str(e)}")
            raise RedisOperationError("Pipeline operation failed") from e

    def transaction(self, func: Callable[[Pipeline], None], *args, **kwargs):
        """事务执行方法"""
        with self._get_connection() as conn:
            try:
                return conn.transaction(func, *args, **kwargs)
            except RedisError as e:
                raise RedisOperationError(
                    f"Transaction failed: {str(e)}") from e

    def get_pool_metrics(self) -> Dict[str, Any]:
        """获取连接池指标"""
        if not self._pool:
            return {}
        return {
            'connections_created': self._pool._created_connections,
            'connections_available': len(self._pool._available_connections),
            'connections_in_use': len(self._pool._in_use_connections),
            'max_connections': self._pool.max_connections
        }

# 全局默认客户端（简化单例访问）
_default_client = None


def get_default_client() -> RedisClient:
    """
    获取默认 Redis 客户端实例
    :return:
    """
    global _default_client
    if not _default_client:
        _default_client = RedisClient.get_client()
    return _default_client


def configure_default(**kwargs):
    """Configure global default client"""
    global _default_client
    _default_client = RedisClient.get_client(kwargs)


if __name__ == '__main__':
    config_ = {
        'host': 'localhost',
        'port': 6379,
        'db': 0,
        'password': "xxxx",
    }

    # 最简使用方式
    with RedisClient.context(config_) as rc:
        rc.set('simple_key', 'value')
        print(rc.get('simple_key'))  # 输出: value

    # 使用全局客户端
    configure_default(**config_)
    client = get_default_client()
    client.set('global_key', 42)
    print(client.get('global_key'))  # 输出: 42

    # 流水线操作
    with client.pipeline() as pipe:
        pipe.incr('counter')
        pipe.expire('counter', 60)

    # 事务操作
    def update_counter(pipe: Pipeline):
        current = pipe.get('counter')
        pipe.multi()
        pipe.set('counter', int(current or 0) + 1)


    client.transaction(update_counter, 'counter')

    # 查看性能指标
    print(client.metrics)
  
```

# 总结
本文介绍了一个封装 Redis 客户端的 Python 类，该类支持高可用性、性能监控、重试机制和线程安全。通过单例模式和连接池，减少了连接创建的开销；通过重试装饰器和心跳机制，提高了系统的容错能力；通过性能监控类，实时记录了 Redis 的健康状态。

在实际应用中，可以灵活配置重试策略和性能监控指标，以满足不同的业务需求。此外，该封装还支持事务和流水线操作，进一步提高了 Redis 的操作效率。



