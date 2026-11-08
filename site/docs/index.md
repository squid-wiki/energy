---
slug: /
sidebar_position: 1
title: 欢迎
---

# ⚡ Squid Grid

智能电表接入的知识站与开源 Java 平台，Squid 3G 的能源板块。

## 主题

| 领域 | 内容 |
|---|---|
| IoT | 设备网关与通信接入 |
| HES | 头端系统：抄读、下发、事件 |
| MDM | 校验、估算、存储 |
| 预付费 | 余额、购电、STS 令牌（IEC 62055） |

## 协议

- **[DLMS/COSEM](./protocols/dlms-cosem/architecture-and-history.md)**：OBIS、接口类、应用连接、HLS-GMAC 安全（[入门：读一次电表时钟](./protocols/dlms-cosem/read-clock.md)）
- **DL/T 645**：中国电表通信协议
- **ANSI C12.18 / C12.19 / C12.22**：北美表格模型
- **STS**：20 位预付费令牌

## 平台

`grid/platform` 是 Maven 多模块项目（`wiki.squid.grid`），协议层不做 IO：字节进，字节出。代码采用 Apache 2.0 许可，未使用任何 Gurux 代码。

*建设中。*
