#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { ipoNewShare } from './tools/ipoNewShare';
import { stockCompany } from './tools/stockCompany';
import { daily } from './tools/daily';
import { rtK } from './tools/rtk';
import { weekly } from './tools/weekly';
import { monthly } from './tools/monthly';
import { currentTime } from './tools/currentTime';

const server = new FastMCP({
  name: 'mcp-stock',
  version: '1.0.2',
});

server.addTool(ipoNewShare);
server.addTool(stockCompany);
server.addTool(daily);
server.addTool(rtK);
server.addTool(weekly);
server.addTool(monthly);
server.addTool(currentTime);

server.start({
  transportType: 'stdio',
});
