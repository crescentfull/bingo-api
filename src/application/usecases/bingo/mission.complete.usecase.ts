import { Inject, Injectable } from "@nestjs/common";
import { MissionDto } from "src/application/dto/mission.dto";
import type { MissionRecordRepository } from "src/domain/interfaces/mission.interface";
import { BingoDomainService } from "src/domain/service/bingo.domain.service";

@Injectable()
export class MissionCompleteUseCase {
    constructor(
        private readonly bingoService: BingoDomainService,
        @Inject('MissionRecordRepository')
        private readonly missionRepo: MissionRecordRepository,
    ){}

    async execute(dto: MissionDto): Promise<number> {
        const logs = dto.logs.map(({ day, mission }) => [day, mission]);
        const score = this.bingoService.calculateScore(logs);

        const last = dto.logs[dto.logs.length -1];
        await this.missionRepo.save({ ...last, score });
        
        return score;
    }
}