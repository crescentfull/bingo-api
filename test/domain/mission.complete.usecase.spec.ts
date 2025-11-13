import { MissionDto } from "src/application/dto/mission.dto";
import { MissionCompleteUseCase } from "src/application/usecases/bingo/mission.complete.usecase";
import { MissionRecordRepository } from "src/domain/interfaces/mission.interface";
import { BingoDomainService } from "src/domain/service/bingo.domain.service";

describe("MissionCompleteUseCase", () => {
  it("일간 빙고를 완성하면 점수가 1 증가해야 한다.", async () => {
    const service = new BingoDomainService();
    // Mock Repository 생성
    const mockRepo: MissionRecordRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn().mockResolvedValue([]),
    };
    const useCase = new MissionCompleteUseCase(service, mockRepo);

    const dto = new MissionDto([
      { day: 1, mission: 1 },
      { day: 1, mission: 2 },
      { day: 1, mission: 3 },
    ]);

    const result = await useCase.execute(dto);
    expect(result).toBe(1);

    expect(mockRepo.save).toHaveBeenCalledWith({
      day: 1,
      mission: 3,
      score: 1,
    });
  });
});
