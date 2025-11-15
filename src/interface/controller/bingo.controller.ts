import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { MissionDto } from "src/application/dto/mission.dto";
import { MissionCompleteUseCase } from "src/application/usecases/bingo/mission.complete.usecase";

@Controller('api/missions')
export class MissionController {
    constructor( private readonly useCase: MissionCompleteUseCase ){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async completeMissions(@Body() body: MissionDto){
        const score = await this.useCase.execute(body);
        return { 
            score,
            completedMissions: body.logs.length,
            lastMission: body.logs[body.logs.length - 1]
        };
    }
}