import { BingoBoardPrismaRepository } from "src/infrastructure/repositories/bingo-board-prisma.repository";
import { PrismaService } from "src/infrastructure/database/prisma.service";

describe("BingoBoard CRUD", () => {
  let repository: BingoBoardPrismaRepository;
  let prisma: PrismaService;
  const userId = "user-001";

  beforeEach(async () => {
    prisma = new PrismaService();
    repository = new BingoBoardPrismaRepository(prisma);
    // 테스트 전 해당 유저의 데이터 정리
    await prisma.bingoBoard.deleteMany({ where: { userId } });
  });

  it("빙고보드를 생성할 수 있다", async () => {
    // given
    const createData = { userId, scopeType: "daily", scopeKey: "2024-01-01" };

    // when
    const result = await repository.create(createData);

    // then
    expect(result.id).toBeDefined();
    expect(result.userId).toBe(userId);
    expect(result.scopeType).toBe("daily");
    expect(result.score).toBe(0);
  });

  it("ID로 빙고보드를 조회할 수 있다", async () => {
    // given
    const created = await repository.create({
      userId,
      scopeType: "daily",
      scopeKey: "2024-01-02",
    });

    // when
    const result = await repository.findById(created.id);

    // then
    expect(result).not.toBeNull();
    expect(result?.id).toBe(created.id);
    expect(result?.userId).toBe(userId);
  });

  it("userId로 모든 빙고보드를 조회할 수 있다", async () => {
    // given
    await repository.create({
      userId,
      scopeType: "daily",
      scopeKey: "2024-01-03",
    });
    await repository.create({
      userId,
      scopeType: "weekly",
      scopeKey: "2024-W01",
    });

    // when
    const result = await repository.findAllByUserId(userId);

    // then
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.every((board) => board.userId === userId)).toBe(true);
  });

  it("빙고보드를 업데이트할 수 있다", async () => {
    // given
    const created = await repository.create({
      userId,
      scopeType: "daily",
      scopeKey: "2024-01-04",
    });

    // when
    const result = await repository.update(created.id, {
      score: 5,
      checkedMask: BigInt(7),
    });

    // then
    expect(result.score).toBe(5);
    expect(result.checkedMask).toBe(BigInt(7));
    expect(result.userId).toBe(userId);
  });

  it("빙고보드를 삭제할 수 있다", async () => {
    // given
    const created = await repository.create({
      userId,
      scopeType: "daily",
      scopeKey: "2024-01-05",
    });

    // when
    await repository.delete(created.id);

    // then
    const result = await repository.findById(created.id);
    expect(result).toBeNull();
  });
});
