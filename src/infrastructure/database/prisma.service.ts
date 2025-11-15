import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // nest 모듈 초기화 시 데이터베이스 연결
    await this.$connect();
  }

  async onModuleDestroy() {
    // 애플리케이션 종료 시 연결 해제
    await this.$disconnect();
  }
}
