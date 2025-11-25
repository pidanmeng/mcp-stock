import { useLogger } from './logger';

const TUSHARE_API_URL = 'https://api.tushare.pro';

interface TuShareRequest<T> {
  api_name: string;
  token: string;
  params: T;
  fields: string;
}

interface TuShareResponse<T> {
  request_id: string;
  code: number;
  msg: string;
  data: {
    fields: string[];
    items: T[];
    has_more: boolean;
    count: number;
  };
}

/**
 * 发送请求到 Tushare API
 * @param apiName API 名称
 * @param params 请求参数，通过泛型定义具体类型
 * @returns Promise<any> 返回 API 响应的数据部分
 */
export async function tuShareClient<T extends Record<string, any>, R>(
  apiName: string,
  params: T
): Promise<TuShareResponse<R>['data']> {
  const logger = useLogger();

  // 从环境变量获取 token
  const token = process.env.TUSHARE_TOKEN;
  if (!token) {
    throw new Error('TUSHARE_TOKEN 环境变量未设置');
  }

  const requestBody: TuShareRequest<T> = {
    api_name: apiName,
    token,
    params,
    fields: '',
  };

  try {
    logger.info(`正在调用 Tushare API: ${apiName}`, { params });

    const response = await fetch(TUSHARE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as TuShareResponse<R>;

    if (result.code !== 0) {
      throw new Error(`Tushare API 错误: ${result.msg}`);
    }

    logger.info(`成功调用 Tushare API: ${apiName}`);
    return result.data;
  } catch (error) {
    logger.error(`调用 Tushare API 失败: ${apiName}`, error as string);
    throw error;
  }
}
