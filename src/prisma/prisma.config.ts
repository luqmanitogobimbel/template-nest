import { PrismaClientOptions } from '@prisma/client/runtime/library';

type LogLevel = 'query' | 'info' | 'warn' | 'error';
type Emit = 'stdout' | 'event';
type LogDefinition = {
  level: LogLevel;
  emit: Emit;
};

export const PRISMA_LOG_CONFIG: LogDefinition[] = [
  { level: 'query', emit: 'stdout' },
  { level: 'info', emit: 'stdout' },
  { level: 'warn', emit: 'stdout' },
  { level: 'error', emit: 'stdout' },
];

export const PRISMA_CLIENT_OPTIONS: PrismaClientOptions = {
  datasourceUrl: process.env.DATABASE_URL,
  log: PRISMA_LOG_CONFIG,
};
