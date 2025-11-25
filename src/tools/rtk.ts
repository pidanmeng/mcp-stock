import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { TSResponseData, tuShareClient } from '../utils/tuShareClient';

const name = 'rt_k';
const description = '获取实时日K线行情';
const parameters = z.object({
  ts_code: z.string().describe('股票代码，支持通配符方式，e.g. 6.SH、301.SZ、600000.SH'),
});

// 定义具名类型别名
type TS_CODE = string; // 股票代码
type NAME = string; // 股票名称
type PRE_CLOSE = number; // 昨收价
type HIGH = number; // 最高价
type OPEN = number; // 开盘价
type LOW = number; // 最低价
type CLOSE = number; // 收盘价（最新价）
type VOL = number; // 成交量（股）
type AMOUNT = number; // 成交金额（元）
type NUM = number; // 开盘以来成交笔数

// 定义返回数据项的具名元组类型
type RtKItem = [
  TS_CODE, // ts_code
  NAME, // name
  PRE_CLOSE, // pre_close
  HIGH, // high
  OPEN, // open
  LOW, // low
  CLOSE, // close
  VOL, // vol
  AMOUNT, // amount
  NUM // num
];

// 将返回的JSON数据转换为自然语言描述
function formatRtKResult(data: TSResponseData<RtKItem[]>): string {
  if (!data || !data.items || data.items.length === 0) {
    return '未找到符合条件的实时行情数据。';
  }

  const items = data.items as RtKItem[];
  let result = `共找到${items.length}条实时行情数据：\n\n`;

  items.forEach((item, index) => {
    const [
      tsCode,
      name,
      preClose,
      high,
      open,
      low,
      close,
      vol,
      amount,
      num
    ] = item;

    result += `${index + 1}. ${name} (${tsCode})\n`;
    result += `   昨收价: ${preClose}\n`;
    result += `   开盘价: ${open}\n`;
    result += `   最高价: ${high}\n`;
    result += `   最低价: ${low}\n`;
    result += `   最新价: ${close}\n`;
    result += `   成交量: ${vol}股\n`;
    result += `   成交金额: ${amount}元\n`;
    result += `   成交笔数: ${num}\n\n`;
  });

  return result;
}

const rtK: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { ts_code } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('获取实时日K线行情', { ts_code });

    try {
      const params: { ts_code: string } = {
        ts_code
      };

      const result = await tuShareClient<
        { ts_code: string },
        RtKItem[]
      >('rt_k', params);

      // 将JSON结果转换为自然语言描述
      return formatRtKResult(result);
    } catch (error) {
      const errorMessage = ('获取实时日K线行情失败: ' + error) as string;
      logger.error(errorMessage);
      return errorMessage;
    }
  },
};

export { rtK };