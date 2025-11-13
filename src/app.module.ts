import { Module } from '@nestjs/common';
import { BingoController } from './interface/controller/bingo.controller';
import { MissionCompleteUseCase } from './application/usecases/bingo/mission.complete.usecase';
import { BingoDomainService } from './domain/service/bingo.domain.service';
import { PrismaMissionRecordRepository } from './infrastructure/repositories/mission-prisma.repository';

@Module({
  controllers: [BingoController],
  providers: [MissionCompleteUseCase, BingoDomainService,
    { provide: 'MissionRecordRepository', useClass: PrismaMissionRecordRepository },
  ]
})
export class AppModule {}