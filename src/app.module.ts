import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MissionController } from "./interface/controller/bingo.controller";
import { BingoBoardController } from "./interface/controller/bingo-board.controller";
import { MissionRecordController } from "./interface/controller/mission-record.controller";
import { MissionCompleteUseCase } from "./application/usecases/bingo/mission.complete.usecase";
import { BingoDomainService } from "./domain/service/bingo.domain.service";
import { PrismaMissionRecordRepository } from "./infrastructure/repositories/mission-prisma.repository";
import { BingoBoardPrismaRepository } from "./infrastructure/repositories/bingo-board-prisma.repository";
import { PrismaService } from "./infrastructure/database/prisma.service";

@Module({
  controllers: [
    AppController,
    MissionController,
    BingoBoardController,
    MissionRecordController,
  ],
  providers: [
    AppService,
    PrismaService,
    MissionCompleteUseCase,
    BingoDomainService,
    {
      provide: "MissionRecordRepository",
      useClass: PrismaMissionRecordRepository,
    },
    { provide: "BingoBoardRepository", useClass: BingoBoardPrismaRepository },
  ],
})
export class AppModule {}
