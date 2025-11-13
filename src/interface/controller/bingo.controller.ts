import { Body, Controller, Post } from "@nestjs/common";
import { MissionDto } from "src/application/dto/mission.dto";
import { MissionCompleteUseCase } from "src/application/usecases/bingo/mission.complete.usecase";

@Controller('api/missions')
export class BingoController {
    constructor( private readonly useCase: MissionCompleteUseCase ){}

    @Post('complete')
    completeMission(@Body() body: MissionDto){
        const score = this.useCase.execute(body);
        return { score };
    }
}