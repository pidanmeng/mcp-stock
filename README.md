# mcp-stock

这是一个基于 [FastMCP](https://github.com/fastmcp/fastmcp) 框架构建的 MCP (Model Context Protocol) 工具包，用于获取中国A股市场相关的股票数据。

## 功能

当前实现了以下股票数据查询工具：

- `current_time`: 获取当前时间
- `ipo_new_share`: 获取新股IPO信息
- `stock_company`: 获取上市公司基本信息
- `daily`: 获取股票每日行情数据
- `weekly`: 获取股票每周行情数据
- `monthly`: 获取股票每月行情数据
- `rt_k`: 获取股票实时行情数据

## 安装依赖

```bash
bun install
```

## 环境变量配置

需要配置 Tushare Token 才能正常使用数据查询功能：

```bash
# 复制示例环境变量文件
cp .env.example .env

# 编辑 .env 文件，填入你的 Tushare Token
```

## 运行项目

```bash
bun run dev
```

## 调试项目

```bash
bun run inspect
```

## 构建项目

```bash
bun run build
```

## 部署 MCP

```JSON
{
  "mcpServers": {
    "mcp-stock": {
      "args": ["-y","@pidanmoe/mcp-stock"],
      "command": "npx",
      "env": {
        "TUSHARE_TOKEN": "YOUR_TUSHARE_TOKEN"
      }
    }
  }
}
```

## 项目结构

- [index.ts](file:///Volumes/SSD/_work/mcp-stock/src/index.ts): 主入口文件，初始化并启动 FastMCP 服务器
- [tools/](file:///Volumes/SSD/_work/mcp-stock/src/tools): 工具集合目录
  - [currentTime.ts](file:///Volumes/SSD/_work/mcp-stock/src/tools/currentTime.ts): 实现了获取当前时间的工具
  - [ipoNewShare.ts](file:///Volumes/SSD/_work/mcp-stock/src/tools/ipoNewShare.ts): 实现了新股IPO信息查询工具
  - [stockCompany.ts](file:///Volumes/SSD/_work/mcp-stock/src/tools/stockCompany.ts): 实现了上市公司基本信息查询工具
  - [daily.ts](file:///Volumes/SSD/_work/mcp-stock/src/tools/daily.ts): 实现了股票每日行情数据查询工具
  - [weekly.ts](file:///Volumes/SSD/_work/mcp-stock/src/tools/weekly.ts): 实现了股票每周行情数据查询工具
  - [monthly.ts](file:///Volumes/SSD/_work/mcp-stock/src/tools/monthly.ts): 实现了股票每月行情数据查询工具
  - [rtk.ts](file:///Volumes/SSD/_work/mcp-stock/src/tools/rtk.ts): 实现了股票实时行情数据查询工具
- [utils/](file:///Volumes/SSD/_work/mcp-stock/src/utils): 工具类目录
  - [logger.ts](file:///Volumes/SSD/_work/mcp-stock/src/utils/logger.ts): 日志工具模块
  - [tuShareClient.ts](file:///Volumes/SSD/_work/mcp-stock/src/utils/tuShareClient.ts): Tushare API 客户端

## 使用说明

该项目遵循 Model Context Protocol 规范，可以通过标准 I/O 或其他传输方式与支持 MCP 的客户端进行通信。

### 工具详细说明

#### current_time
获取当前系统时间
- 无参数
- 返回：当前时间字符串，格式为 "YYYY-MM-DD HH:mm:ss"

#### ipo_new_share
获取新股IPO信息
- 可选参数:
  - `start_date`: 上网发行开始日期(YYYYMMDD)
  - `end_date`: 上网发行结束日期(YYYYMMDD)
- 返回：包含以下信息的文本：
  - 股票名称和代码
  - 申购代码
  - 上网发行日期
  - 上市日期
  - 发行总量(万股)
  - 上网发行量(万股)
  - 发行价格(元)
  - 市盈率
  - 个人申购上限(万股)
  - 募集资金(亿元)
  - 中签率

#### stock_company
获取上市公司基本信息
- 可选参数:
  - `ts_code`: 股票代码
  - `exchange`: 交易所代码(SSE: 上交所, SZSE: 深交所, BSE: 北交所)
- 返回：包含以下信息的文本：
  - 公司全称和股票代码
  - 统一社会信用代码
  - 交易所
  - 法人代表
  - 总经理
  - 董秘
  - 注册资本(万元)
  - 注册日期
  - 所在省市
  - 公司主页
  - 电子邮件
  - 办公地址
  - 员工人数
  - 公司简介
  - 经营范围
  - 主要业务

#### daily
获取股票每日行情数据
- 可选参数:
  - `ts_code`: 股票代码（支持多个股票同时提取，逗号分隔）
  - `start_date`: 开始日期(YYYYMMDD)
  - `end_date`: 结束日期(YYYYMMDD)
- 返回：包含以下信息的文本（按股票代码分组）：
  - 交易日期
  - 开盘价、最高价、最低价、收盘价
  - 昨收价、涨跌额、涨跌幅
  - 成交量(手)、成交额(千元)

#### weekly
获取股票每周行情数据
- 可选参数:
  - `ts_code`: 股票代码（支持多个股票同时提取，逗号分隔）
  - `start_date`: 开始日期(YYYYMMDD)
  - `end_date`: 结束日期(YYYYMMDD)
- 返回：包含以下信息的文本（按股票代码分组）：
  - 交易日期
  - 开盘价、最高价、最低价、收盘价
  - 上周收盘价、涨跌额、涨跌幅
  - 成交量、成交额

#### monthly
获取股票每月行情数据
- 可选参数:
  - `ts_code`: 股票代码（支持多个股票同时提取，逗号分隔）
  - `start_date`: 开始日期(YYYYMMDD)
  - `end_date`: 结束日期(YYYYMMDD)
- 返回：包含以下信息的文本（按股票代码分组）：
  - 交易日期
  - 开盘价、最高价、最低价、收盘价
  - 上月收盘价、涨跌额、涨跌幅
  - 成交量、成交额

#### rt_k
获取股票实时行情数据
- 必需参数:
  - `ts_code`: 股票代码，支持通配符方式，例如 6.SH、301.SZ、600000.SH
- 返回：包含以下信息的文本：
  - 股票名称和代码
  - 昨收价
  - 开盘价、最高价、最低价、最新价
  - 成交量(股)、成交金额(元)
  - 开盘以来成交笔数

## 技术栈

- [Bun](https://bun.sh) - JavaScript/TypeScript 运行时
- [FastMCP](https://github.com/fastmcp/fastmcp) - MCP 框架
- [Zod](https://zod.dev) - TypeScript-first schema declaration and validation library
- [Tushare](https://tushare.pro) - 金融数据提供商

---

此项目使用 bun v1.2.19 创建。[Bun](https://bun.com) 是一个快速的一体化 JavaScript 运行时。