import { MissionDto } from "src/application/dto/mission.dto";
import { MissionCompleteUseCase } from "src/application/usecases/bingo/mission.complete.usecase";
import { BingoDomainService } from "src/domain/service/bingo.domain.service"

describe('MissionCompleteUseCase', () => {
    it('일간 빙고를 완성하면 점수가 1 증가해야 한다.', () => {
        const service = new BingoDomainService;
        const useCase = new MissionCompleteUseCase(service);

        const dto = new MissionDto([
            { day: 1, mission: 1},
            { day: 1, mission: 2},
            { day: 1, mission: 3},
        ]);

        const result = useCase.execute(dto);
        expect(result).toBe(1);
    });
});