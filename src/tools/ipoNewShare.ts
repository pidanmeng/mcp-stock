import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { TSResponseData, tuShareClient } from '../utils/tuShareClient';

const name = 'ipo_new_share';
const description = '获取新股IPO信息';
const parameters = z.object({
  start_date: z.string().describe('上网发行开始日期(YYYYMMDD)'),
  end_date: z.string().describe('上网发行结束日期(YYYYMMDD)'),
});

// 定义具名类型别名
type TS_CODE = string; // TS股票代码
type SUB_CODE = string; // 申购代码
type NAME = string; // 名称
type IPO_DATE = string; // 上网发行日期
type ISSUE_DATE = string; // 上市日期
type AMOUNT = number; // 发行总量（万股）
type MARKET_AMOUNT = number; // 上网发行总量（万股）
type PRICE = number; // 发行价格
type PE = number; // 市盈率
type LIMIT_AMOUNT = number; // 个人申购上限（万股）
type FUNDS = number; // 募集资金（亿元）
type BALLOT = number; // 中签率

// 定义返回数据项的具名元组类型
type NewShareItem = [
  TS_CODE, // ts_code
  SUB_CODE, // sub_code
  NAME, // name
  IPO_DATE, // ipo_date
  ISSUE_DATE, // issue_date
  AMOUNT, // amount
  MARKET_AMOUNT, // market_amount
  PRICE, // price
  PE, // pe
  LIMIT_AMOUNT, // limit_amount
  FUNDS, // funds
  BALLOT // ballot
];

// 将返回的JSON数据转换为自然语言描述
function formatIpoResult(data: TSResponseData<NewShareItem[]>): string {
  if (!data || !data.items || data.items.length === 0) {
    return '未找到符合条件的新股IPO信息。';
  }

  const items = data.items as NewShareItem[];
  let result = `共找到${items.length}条新股IPO信息：\n\n`;

  items.forEach((item, index) => {
    const [
      tsCode,
      subCode,
      name,
      ipoDate,
      issueDate,
      amount,
      marketAmount,
      price,
      pe,
      limitAmount,
      funds,
      ballot,
    ] = item;

    result += `${index + 1}. ${name} (${tsCode})\n`;
    result += `   申购代码: ${subCode}\n`;
    result += `   上网发行日期: ${ipoDate}\n`;
    result += `   上市日期: ${issueDate}\n`;
    result += `   发行总量: ${amount}万股\n`;
    result += `   上网发行量: ${marketAmount}万股\n`;
    result += `   发行价格: ${price}元\n`;
    result += `   市盈率: ${pe}\n`;
    result += `   个人申购上限: ${limitAmount}万股\n`;
    result += `   募集资金: ${funds}亿元\n`;
    result += `   中签率: ${ballot}%\n\n`;
  });

  return result;
}

const ipoNewShare: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { start_date, end_date } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('获取新股IPO信息', { start_date, end_date });

    try {
      const params: { start_date?: string; end_date?: string } = {};
      if (start_date) params.start_date = start_date;
      if (end_date) params.end_date = end_date;

      const result = await tuShareClient<
        { start_date?: string; end_date?: string },
        NewShareItem[]
      >('new_share', params);

      // 将JSON结果转换为自然语言描述
      return formatIpoResult(result);
    } catch (error) {
      const errorMessage = ('获取新股IPO信息失败: ' + error) as string;
      logger.error(errorMessage);
      throw errorMessage;
    }
  },
};

export { ipoNewShare };
