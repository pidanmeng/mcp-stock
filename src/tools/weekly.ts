import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { TSResponseData, tuShareClient } from '../utils/tuShareClient';

const name = 'weekly';
const description = '获取股票每周行情数据';
const parameters = z.object({
  ts_code: z
    .string()
    .optional()
    .describe('股票代码（支持多个股票同时提取，逗号分隔）eg. 000001.SZ'),
  start_date: z.string().optional().describe('开始日期(YYYYMMDD)'),
  end_date: z.string().optional().describe('结束日期(YYYYMMDD)'),
});

// 定义具名类型别名
type TS_CODE = string; // 股票代码
type TRADE_DATE = string; // 交易日期
type OPEN = number; // 周开盘价
type HIGH = number; // 周最高价
type LOW = number; // 周最低价
type CLOSE = number; // 周收盘价
type PRE_CLOSE = number; // 上一周收盘价
type CHANGE = number; // 周涨跌额
type PCT_CHG = number; // 周涨跌
type VOL = number; // 周成交量
type AMOUNT = number; // 周成交额

// 定义返回数据项的具名元组类型
type WeeklyItem = [
  TS_CODE, // ts_code
  TRADE_DATE, // trade_date
  CLOSE, // close
  OPEN, // open
  HIGH, // high
  LOW, // low
  PRE_CLOSE, // pre_close
  CHANGE, // change
  PCT_CHG, // pct_chg
  VOL, // vol
  AMOUNT // amount
];

// 将返回的JSON数据转换为自然语言描述
function formatWeeklyResult(data: TSResponseData<WeeklyItem[]>): string {
  if (!data || !data.items || data.items.length === 0) {
    return '未找到符合条件的股票周行情数据。';
  }

  const items = data.items as WeeklyItem[];

  // 按股票代码分组数据
  const groupedData: Record<string, WeeklyItem[]> = {};
  items.forEach((item) => {
    const tsCode = item[0];
    if (!groupedData[tsCode]) {
      groupedData[tsCode] = [];
    }
    groupedData[tsCode].push(item);
  });

  let result = `共找到${items.length}条股票周行情数据：\n\n`;

  // 按股票代码分别展示数据
  Object.keys(groupedData).forEach((tsCode) => {
    result += `${tsCode} 周行情数据:\n`;
    groupedData[tsCode].forEach((item, index) => {
      const [
        _tsCode,
        tradeDate,
        close,
        open,
        high,
        low,
        preClose,
        change,
        pctChg,
        vol,
        amount,
      ] = item;

      result += `  ${index + 1}. 交易日期: ${tradeDate}\n`;
      result += `     开盘价: ${open}, 最高价: ${high}, 最低价: ${low}, 收盘价: ${close}\n`;
      result += `     上周收盘价: ${preClose}, 涨跌额: ${change}, 涨跌幅: ${pctChg}%\n`;
      result += `     成交量: ${vol}, 成交额: ${amount}\n`;
    });
    result += '\n';
  });

  return result;
}

const weekly: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { ts_code, start_date, end_date } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('获取股票每周行情数据', { ts_code, start_date, end_date });

    try {
      const params: {
        ts_code?: string;
        start_date?: string;
        end_date?: string;
      } = {};
      if (ts_code) params.ts_code = ts_code;
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;

      const result = await tuShareClient<
        { ts_code?: string; start_date?: string; end_date?: string },
        WeeklyItem[]
      >('weekly', params);

      // 将JSON结果转换为自然语言描述
      return formatWeeklyResult(result);
    } catch (error) {
      const errorMessage = ('获取股票每周行情数据失败: ' + error) as string;
      logger.error(errorMessage);
      return errorMessage;
    }
  },
};

export { weekly };