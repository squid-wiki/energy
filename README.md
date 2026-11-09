# ⚡ Squid Wiki · 能源

> [energy.squid.wiki](https://energy.squid.wiki)：智能电表接入的知识站与开源 Java 平台，涵盖 IoT、HES、MDM 和预付费。

## 目录结构

```
site/                       Docusaurus 站点：概念、协议笔记、平台文档
platform/                   Maven 多模块，groupId 为 wiki.squid.grid
├── grid-protocol/          所有协议在一个模块，按包划分
│   └── wiki.squid.grid.protocol
│       ├── api/            公共接口：连接、请求/响应、帧解析
│       ├── dlms/           cosem / axdr / security / apdu / framing / session
│       ├── dlt645/
│       ├── ansi/           ANSI C12.18 / C12.19 / C12.22
│       └── sts/            预付费令牌，IEC 62055
├── grid-iot/               设备接入网关
├── grid-hes/               头端：抄读、下发、事件
├── grid-mdm/               校验、估算、存储
└── grid-prepaid/           余额、购电、令牌
```

## 设计规则

- 协议包之间互不依赖，只依赖 `api`（用 ArchUnit 强制）。
- 协议层不做 IO：字节进，字节出。网络通信放在 HES（Netty）。
- 在出现真正共用的类型之前，不建公共 `core` 模块。

## 许可证

- 代码：[Apache 2.0](LICENSE)，另见 [NOTICE](NOTICE)
- 站点内容（`site/`）：[CC BY-NC-SA 4.0](site/LICENSE)
