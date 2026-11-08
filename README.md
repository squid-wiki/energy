# ⚡ Squid Grid

> [grid.squid.wiki](https://grid.squid.wiki) — notes and an open Java platform for smart-meter integration: IoT, HES, MDM and prepaid.
>
> 中文：能源设备接入的知识站与 Java 平台。

## Layout

```
site/                       Docusaurus site — concepts, protocol notes, platform docs
platform/                   Maven multi-module, groupId wiki.squid.grid
├── grid-protocol/          all protocols in one module, split by package
│   └── wiki.squid.grid.protocol
│       ├── api/            common interfaces: connection, request/response, frame parsing
│       ├── dlms/           cosem / axdr / security / apdu / framing / session
│       ├── dlt645/
│       ├── ansi/           ANSI C12.18 / C12.19 / C12.22
│       └── sts/            prepaid tokens, IEC 62055
├── grid-iot/               device gateway
├── grid-hes/               head-end: reads, commands, events
├── grid-mdm/               validation, estimation, storage
└── grid-prepaid/           balance, vending, tokens
```

## Design rules

- Protocol packages never depend on each other — only on `api` (enforced with ArchUnit).
- The protocol layer does no IO: bytes in, bytes out. Networking lives in HES (Netty).
- No shared `core` module until real shared types appear.

## License

- Code: [Apache 2.0](LICENSE) — see [NOTICE](NOTICE)
- Site content (`site/`): [CC BY-NC-SA 4.0](site/LICENSE)
