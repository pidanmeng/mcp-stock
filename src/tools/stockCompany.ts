import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { TSResponseData, tuShareClient } from '../utils/tuShareClient';

const name = 'stock_company';
const description = '获取上市公司基本信息';
const parameters = z.object({
  ts_code: z.string().optional().describe('股票代码'),
  exchange: z
    .string()
    .optional()
    .describe('交易所代码，SSE上交所 SZSE深交所 BSE北交所'),
});

// 定义具名类型别名
type TS_CODE = string; // 股票代码
type COM_NAME = string; // 公司全称
type COM_ID = string; // 统一社会信用代码
type CHAIRMAN = string; // 法人代表
type MANAGER = string; // 总经理
type SECRETARY = string; // 董秘
type REG_CAPITAL = number; // 注册资本(万元)
type SETUP_DATE = string; // 注册日期
type PROVINCE = string; // 所在省份
type CITY = string; // 所在城市
type INTRODUCTION = string; // 公司简介
type WEBSITE = string; // 公司主页
type EMAIL = string; // 电子邮件
type OFFICE = string; // 办公地址
type BUSINESS_SCOPE = string; // 经营范围
type EMPLOYEES = number; // 员工人数
type MAIN_BUSINESS = string; // 主要业务
type EXCHANGE = string; // 交易所代码

// 定义返回数据项的具名元组类型
type StockCompanyItem = [
  TS_CODE, // ts_code
  COM_NAME, // com_name
  COM_ID, // com_id
  CHAIRMAN, // chairman
  MANAGER, // manager
  SECRETARY, // secretary
  REG_CAPITAL, // reg_capital
  SETUP_DATE, // setup_date
  PROVINCE, // province
  CITY, // city
  INTRODUCTION, // introduction
  WEBSITE, // website
  EMAIL, // email
  OFFICE, // office
  BUSINESS_SCOPE, // business_scope
  EMPLOYEES, // employees
  MAIN_BUSINESS, // main_business
  EXCHANGE // exchange
];

// 将返回的JSON数据转换为自然语言描述
function formatStockCompanyResult(
  data: TSResponseData<StockCompanyItem[]>
): string {
  if (!data || !data.items || data.items.length === 0) {
    return '未找到符合条件的上市公司信息。';
  }

  const items = data.items as StockCompanyItem[];
  let result = `共找到${items.length}家上市公司信息：\n\n`;

  items.forEach((item, index) => {
    const [
      tsCode,
      comName,
      comId,
      chairman,
      manager,
      secretary,
      regCapital,
      setupDate,
      province,
      city,
      introduction,
      website,
      email,
      office,
      businessScope,
      employees,
      mainBusiness,
      exchange,
    ] = item;

    result += `${index + 1}. ${comName} (${tsCode})\n`;
    result += `   统一社会信用代码: ${comId}\n`;
    result += `   交易所: ${exchange}\n`;
    result += `   法人代表: ${chairman}\n`;
    result += `   总经理: ${manager}\n`;
    result += `   董秘: ${secretary}\n`;
    result += `   注册资本: ${regCapital}万元\n`;
    result += `   注册日期: ${setupDate}\n`;
    result += `   所在省市: ${province}${city}\n`;
    result += `   公司主页: ${website}\n`;
    result += `   电子邮件: ${email}\n`;
    result += `   办公地址: ${office}\n`;
    result += `   员工人数: ${employees}人\n`;
    result += `   公司简介: ${introduction}\n`;
    result += `   经营范围: ${businessScope}\n`;
    result += `   主要业务: ${mainBusiness}\n\n`;
  });

  return result;
}

const stockCompany: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { ts_code, exchange } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('获取上市公司基本信息', { ts_code, exchange });

    try {
      const params: { ts_code?: string; exchange?: string } = {};
      if (ts_code) params.ts_code = ts_code;
      if (exchange) params.exchange = exchange;

      const result = await tuShareClient<
        { ts_code?: string; exchange?: string },
        StockCompanyItem[]
      >('stock_company', params);

      // 将JSON结果转换为自然语言描述
      return formatStockCompanyResult(result);
    } catch (error) {
      const errorMessage = ('获取上市公司基本信息失败: ' + error) as string;
      logger.error(errorMessage);
      return errorMessage;
    }
  },
};

export { stockCompany };
