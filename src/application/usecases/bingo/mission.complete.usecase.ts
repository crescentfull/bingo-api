import { Injectable } from "@nestjs/common";
import { MissionDto } from "src/application/dto/mission.dto";
import { BingoDomainService } from "src/domain/service/bingo.domain.service";

@Injectable()
export class MissionCompleteUseCase {
    constructor(private readonly bingoService: BingoDomainService){}

    execute(dto: MissionDto): number {
        const logs = dto.logs.map(({ day, mission }) => [day, mission]);
        return this.bingoService.calculateScore(logs)
    }
}