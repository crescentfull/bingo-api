import { BingoDomainService } from 'src/domain/service/bingo.domain.service';

describe('BingoDomainService', () => {
  let service: BingoDomainService;

  beforeEach(() => {
    service = new BingoDomainService();
  });

  it('일간, 월간 빙고 1점씩 총 2점 받아야 함', () => {
    //given
    const logs = [
      [1, 1],
      [1, 2],
      [1, 3], // 일간
      [8, 19],
      [8, 20],
      [8, 21], // 월간
    ];

    //when
    const score = service.calculateScore(logs);

    //then
    expect(score).toBe(2);
  });

  it('일간 8개, 주간 0개, 월간 2개 총 10점이 되어야 함', () => {
    //given
    const logs = [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [1, 7],
      [1, 8],
      [1, 9],
      [15, 19],
      [15, 10],
      [15, 21],
      [15, 9],
      [15, 25],
      [15, 1],
      [15, 27],
      [15, 13],
      [24, 5],
      [24, 16],
      [24, 23],
    ];

    // when
    const score = service.calculateScore(logs);

    // then
    expect(score).toBe(10);
  });

  it('같은 미션을 중복으로 수행해도 추가 점수는 없어야 함', () => {
    //given
    const logs = [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 1],
    ];

    //when
    const score = service.calculateScore(logs);

    //then
    expect(score).toBe(1);
  });
});
