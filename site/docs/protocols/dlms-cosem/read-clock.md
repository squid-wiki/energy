---
sidebar_position: 2
title: 入门：读一次电表时钟
description: 用两组请求和响应、一个无依赖的 Java 文件，走通 DLMS/COSEM 的最小闭环。
---

# 入门：读一次电表时钟

理解 DLMS 最快的办法，是亲手读一个值。本文只做一件事：**连上电表，读出它的时钟**。

全过程只有两问两答：

```text
客户端                                 电表
  | ---------- AARQ（我想建立连接）------> |
  | <--------- AARE（同意）--------------- |
  | ---------- GET（读时钟）-------------> |
  | <--------- 响应（当前时间）----------- |
```

为了最短路径，本文做了三个简化：

| 选择 | 省掉了什么 |
|---|---|
| 走 TCP（Wrapper） | HDLC 的帧、地址和 CRC |
| 公共客户端，无认证 | 密钥和加密 |
| 读时钟 | 负荷曲线的分块传输和筛选 |

如果还不了解整体分层，可以先看[架构、分层与历史](./architecture-and-history.md)。

## 第一步：要读什么

DLMS 里读任何数据，都需要三个信息：

| 信息 | 值 | 含义 |
|---|---|---|
| 类 ID | `8` | Clock 接口类 |
| OBIS | `0-0:1.0.0.255` | 这块表上的"时钟"对象 |
| 属性 | `2` | Clock 的 `time` 属性（属性 1 是对象名） |

**这三个数就是 DLMS 的核心。** 读电量、读电压，也只是把这三个数换掉。

## 第二步：建立连接

电表不接受陌生请求，要先建立*应用连接*。TCP 连到电表（默认端口 4059）后，每条报文都加一个 8 字节的 Wrapper 头：

```text
00 01   版本，固定为 1
00 10   源地址：16，公共客户端
00 01   目的地址：1，管理逻辑设备
00 1F   后面的 APDU 长度：31 字节
```

后面跟着 AARQ：

```text
60 1D                                 AARQ，内容 29 字节
   A1 09 06 07 60 85 74 05 08 01 01   应用上下文：LN 引用，不加密
   BE 10 04 0E                        用户信息，内含 14 字节
      01                              InitiateRequest
      00 00 00                        三个可选字段：都不带
      06                              DLMS 版本 6
      5F 1F 04 00 00 00 10            一致性块：本例只要 GET
      FF FF                           客户端能接收的最大 PDU
```

电表回 AARE，这里只需要看一个字段：

```text
61 29                                 AARE，内容 41 字节
   A1 09 06 07 60 85 74 05 08 01 01   应用上下文
   A2 03 02 01 00                     结果：00 = 接受   ← 看这里
   A3 05 A1 03 02 01 00               诊断：无
   BE 10 04 0E                        用户信息
      08 00 06                        InitiateResponse，DLMS 版本 6
      5F 1F 04 00 00 00 10            双方协商后的一致性块
      04 00                           电表的最大 PDU：1024
      00 07                           VAA 名称：LN 引用固定为 0007
```

## 第三步：发 GET

连接建立后，把第一步的三个数填进请求。Wrapper 头同上，长度改为 `00 0D`：

```text
C0 01           Get-Request-Normal
C1              调用 ID 1，高优先级，需要确认
00 08           类 ID：8
00 00 01 00 00 FF   OBIS：0-0:1.0.0.255
02              属性：2
00              不使用选择性访问
```

## 第四步：读懂响应

```text
C4 01           Get-Response-Normal
C1              调用 ID，与请求一致
00              结果：数据
09 0C           octet-string，12 字节
07 EA 0B 08 07 10 1E 00 FF 80 00 00
```

最后 12 字节就是时间：

| 字节 | 值 | 含义 |
|---|---|---|
| `07 EA` | 2026 | 年 |
| `0B` | 11 | 月 |
| `08` | 8 | 日 |
| `07` | 7 | 星期日（1 是星期一） |
| `10` | 16 | 时 |
| `1E` | 30 | 分 |
| `00` | 0 | 秒 |
| `FF` | 未指定 | 百分之一秒 |
| `80 00` | 未指定 | 与 UTC 的偏差（分钟） |
| `00` | 正常 | 时钟状态 |

结果：**2026-11-08 16:30:00**。

本文的 AARE 和响应是按规范构造的示例，真实电表协商出的参数和时间会不同。

## 完整代码

单文件，只用 JDK，Java 8 即可编译：

```java title="ReadClock.java"
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

public class ReadClock {
    static final int CLIENT_SAP = 16; // 公共客户端
    static final int SERVER_SAP = 1;  // 管理逻辑设备

    static final byte[] AARQ = hex("60 1D"
        + "A1 09 06 07 60 85 74 05 08 01 01"
        + "BE 10 04 0E 01 00 00 00 06 5F 1F 04 00 00 00 10 FF FF");

    static final byte[] GET_CLOCK = hex("C0 01 C1 00 08 00 00 01 00 00 FF 02 00");

    public static void main(String[] args) throws IOException {
        String host = args[0];
        int port = args.length > 1 ? Integer.parseInt(args[1]) : 4059;

        try (Socket socket = new Socket(host, port)) {
            socket.setSoTimeout(5000);
            DataOutputStream out = new DataOutputStream(socket.getOutputStream());
            DataInputStream in = new DataInputStream(socket.getInputStream());

            byte[] aare = exchange(in, out, AARQ);
            int result = associationResult(aare);
            if (result != 0) {
                throw new IOException("电表拒绝连接，association-result = " + result);
            }

            byte[] response = exchange(in, out, GET_CLOCK);
            System.out.println("电表时间：" + parseClock(response));
        }
    }

    static byte[] exchange(DataInputStream in, DataOutputStream out, byte[] apdu)
            throws IOException {
        out.writeShort(1);          // Wrapper 版本
        out.writeShort(CLIENT_SAP); // 源
        out.writeShort(SERVER_SAP); // 目的
        out.writeShort(apdu.length);
        out.write(apdu);
        out.flush();
        System.out.println("-> " + toHex(apdu));

        in.readUnsignedShort(); // 版本
        in.readUnsignedShort(); // 源
        in.readUnsignedShort(); // 目的
        byte[] reply = new byte[in.readUnsignedShort()];
        in.readFully(reply);
        System.out.println("<- " + toHex(reply));
        return reply;
    }

    /** 遍历 AARE 的顶层 TLV，取出 A2 里的结果。本例中的长度都小于 128。 */
    static int associationResult(byte[] aare) throws IOException {
        if ((aare[0] & 0xFF) != 0x61) {
            throw new IOException("不是 AARE");
        }
        for (int i = 2; i < aare.length; i += 2 + (aare[i + 1] & 0xFF)) {
            if ((aare[i] & 0xFF) == 0xA2) {
                return aare[i + 4] & 0xFF;
            }
        }
        throw new IOException("AARE 中没有 association-result");
    }

    static String parseClock(byte[] r) throws IOException {
        if ((r[0] & 0xFF) != 0xC4 || r[1] != 0x01) {
            throw new IOException("不是 Get-Response-Normal");
        }
        if (r[3] != 0x00) {
            throw new IOException("读取失败，data-access-result = " + (r[4] & 0xFF));
        }
        if (r[4] != 0x09 || r[5] != 0x0C) {
            throw new IOException("不是 12 字节的 octet-string");
        }
        int year = (r[6] & 0xFF) << 8 | (r[7] & 0xFF);
        return String.format("%04d-%02d-%02d %02d:%02d:%02d",
            year, r[8] & 0xFF, r[9] & 0xFF, r[11] & 0xFF, r[12] & 0xFF, r[13] & 0xFF);
    }

    static byte[] hex(String s) {
        String h = s.replace(" ", "");
        byte[] b = new byte[h.length() / 2];
        for (int i = 0; i < b.length; i++) {
            b[i] = (byte) Integer.parseInt(h.substring(i * 2, i * 2 + 2), 16);
        }
        return b;
    }

    static String toHex(byte[] b) {
        StringBuilder sb = new StringBuilder();
        for (byte x : b) {
            sb.append(String.format("%02X ", x));
        }
        return sb.toString().trim();
    }
}
```

运行：

```bash
javac -encoding UTF-8 ReadClock.java
java ReadClock 192.168.1.100 4059
```

把地址换成支持 TCP 的电表或 DLMS 模拟器。

## 实测结果

下面是这段代码读 [Gurux DLMS 模拟器](https://github.com/Gurux/gurux.dlms.java/tree/master/gurux.dlms.simulator.java)（用自带的 `crystal.xml` 模板，`-w` 启用 Wrapper）的真实输出。模拟器只作为外部测试对象，上面的代码没有使用它的任何代码：

```text
-> 60 1D A1 09 06 07 60 85 74 05 08 01 01 BE 10 04 0E 01 00 00 00 06 5F 1F 04 00 00 00 10 FF FF
<- 61 29 A1 09 06 07 60 85 74 05 08 01 01 A2 03 02 01 00 A3 05 A1 03 02 01 00 BE 10 04 0E 08 00 06 5F 1F 04 00 00 00 10 03 40 00 07
-> C0 01 C1 00 08 00 00 01 00 00 FF 02 00
<- C4 01 C1 00 09 0C 07 E4 06 18 FF 0C 03 33 FF FE B6 00
电表时间：2020-06-24 12:03:51
```

和前文的示例对比，有三处值得注意：

- 最大 PDU 是 `03 40`（832），这是协商的结果，每块表都可能不同。
- 星期是 `FF`（未指定）。解析时不能假定每个字段都有值，年、月、日、时、分、秒同样可能是"未指定"，上面的简化代码没有处理这种情况。
- 偏差是 `FE B6`，即 -330 分钟，而模板里的时间是 UTC+5:30。也就是说，这个模拟器的符号是"UTC 减本地时间"，正是下一节提到的坑。

模板里的时间是静态的，所以读出来是 2020 年。

## 读不出来时

| 现象 | 常见原因 |
|---|---|
| TCP 连不上或超时 | 地址、端口不对，或电表只开了串口 / HDLC |
| 发出 AARQ 后没有回应 | Wrapper 地址不对，或电表要求 HDLC 成帧 |
| association-result 不是 0 | 电表不开放公共客户端，或要求认证 |
| 读取结果是 `01`，后面带错误码 | 该连接无权读取，或对象不存在 |

读到的时间看起来差了几小时，先检查偏差字段：不同电表对正负号的处理并不一致，所以解析时不要想当然。

## 接下来

现在你已经走通了 DLMS 的主干。这条链路上，每处复杂度都能找到自己的位置：

- **换对象：** 把类 ID、OBIS、属性换成 `3`、`1-0:1.8.0.255`、`2`，读的就是总正向有功电量。注意它的值要配合属性 3 的 `scaler_unit` 换算。
- **加认证：** 在 AARQ 里加 LLS 或 HLS 字段。
- **加加密：** 把 GET 包进加密 APDU。
- **换链路：** 把 8 字节 Wrapper 换成 HDLC 帧，APDU 不用改。
- **读长数据：** 负荷曲线需要选择性访问和分块传输。
