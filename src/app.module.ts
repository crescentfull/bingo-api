import { Module } from '@nestjs/common';
import { BingoController } from './interface/controller/bingo.controller';
import { MissionCompleteUseCase } from './application/usecases/bingo/mission.complete.usecase';
import { BingoDomainService } from './domain/service/bingo.domain.service';

@Module({
  controllers: [BingoController],
  providers: [MissionCompleteUseCase, BingoDomainService]
})
export class AppModule {}