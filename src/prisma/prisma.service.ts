import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';
import { PRISMA_LOG_CONFIG } from './prisma.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasourceUrl: process.env.DATABASE_URL,
      log: PRISMA_LOG_CONFIG,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on(<never>'beforeExit', async () => {
      await app.close();
    });
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.$queryRaw`SELECT 1`;
      return Promise.resolve({
        database: {
          status: 'up',
        },
      });
    } catch (error) {
      return Promise.resolve({
        database: {
          status: 'down',
          info: error,
        },
      });
    }
  }
}
