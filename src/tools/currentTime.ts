import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';

const name = 'current_time';
const description = '获取当前时间（年月日时分秒）';
const parameters = z.object({});

const currentTime: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { log } = context;
    const logger = useLogger(log);

    logger.info('获取当前时间');

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      const currentTimeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      logger.info('成功获取当前时间', { currentTime: currentTimeStr });
      
      return `当前时间: ${currentTimeStr}`;
    } catch (error) {
      const errorMessage = '获取当前时间失败: ' + error;
      logger.error(errorMessage);
      return errorMessage;
    }
  },
};

export { currentTime };