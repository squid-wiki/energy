---
slug: /
sidebar_position: 1
title: Welcome
---

# ⚡ Squid Grid

Notes and an open Java platform for smart-meter integration — the energy section of Squid 3G.

> 中文：能源设备接入的知识站与 Java 平台。英文为主，中文为辅。

## Topics

| Area | What's covered |
|---|---|
| IoT | Device gateways and connectivity |
| HES | Head-end: reads, commands, events |
| MDM | Validation, estimation, storage |
| Prepaid | Balance, vending, STS tokens (IEC 62055) |

## Protocols

- **DLMS/COSEM** — OBIS, interface classes, associations, HLS-GMAC security
- **DL/T 645** — China's meter protocol
- **ANSI C12.18 / C12.19 / C12.22** — North American table model
- **STS** — 20-digit prepaid tokens

## Platform

`grid/platform` is a Maven multi-module project (`wiki.squid.grid`) with a protocol layer that does no IO: bytes in, bytes out. Licensed under Apache 2.0. It does not use any Gurux code.

*Under construction.*
