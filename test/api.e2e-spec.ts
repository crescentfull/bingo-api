import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/infrastructure/database/prisma.service";

describe(" RESTful API E2E Tests", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const testUserId = "test-user-001";
  let createdBoardId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    // 테스트 데이터 정리
    await prisma.bingoBoard.deleteMany({ where: { userId: testUserId } });
    await prisma.missionRecord.deleteMany({});
  });

  afterAll(async () => {
    // 테스트 후 정리
    await prisma.bingoBoard.deleteMany({ where: { userId: testUserId } });
    await app.close();
  });

  describe("BingoBoard API (/api/bingo-boards)", () => {
    it("POST /api/bingo-boards - 빙고 보드를 생성할 수 있다", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/bingo-boards")
        .send({
          userId: testUserId,
          scopeType: "daily",
          scopeKey: "2025-11-13",
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.userId).toBe(testUserId);
      expect(response.body.scopeType).toBe("daily");
      expect(response.body.scopeKey).toBe("2025-11-13");
      expect(response.body.checkedMask).toBe("0");
      expect(response.body.lineMask).toBe("0");
      expect(response.body.score).toBe(0);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();

      // 나중에 사용하기 위해 ID 저장
      createdBoardId = response.body.id;
    });

    it("GET /api/bingo-boards/:id - 특정 빙고 보드를 조회할 수 있다", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/bingo-boards/${createdBoardId}`)
        .expect(200);

      expect(response.body.id).toBe(createdBoardId);
      expect(response.body.userId).toBe(testUserId);
      expect(response.body.scopeType).toBe("daily");
      expect(response.body.scopeKey).toBe("2025-11-13");
    });

    it("GET /api/bingo-boards/:id - 존재하지 않는 보드는 404를 반환한다", async () => {
      await request(app.getHttpServer())
        .get("/api/bingo-boards/non-existent-id")
        .expect(404);
    });

    it("GET /api/bingo-boards?userId=xxx - 사용자별 빙고 보드 목록을 조회할 수 있다", async () => {
      // 추가 보드 생성
      await request(app.getHttpServer())
        .post("/api/bingo-boards")
        .send({
          userId: testUserId,
          scopeType: "weekly",
          scopeKey: "2025-W46",
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/api/bingo-boards?userId=${testUserId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(
        response.body.every((board: any) => board.userId === testUserId),
      ).toBe(true);
    });

    it("PUT /api/bingo-boards/:id - 빙고 보드를 업데이트할 수 있다", async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/bingo-boards/${createdBoardId}`)
        .send({
          checkedMask: "7",
          lineMask: "1",
          score: 10,
        })
        .expect(200);

      expect(response.body.id).toBe(createdBoardId);
      expect(response.body.checkedMask).toBe("7");
      expect(response.body.lineMask).toBe("1");
      expect(response.body.score).toBe(10);
    });

    it("PUT /api/bingo-boards/:id - 부분 업데이트가 가능하다", async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/bingo-boards/${createdBoardId}`)
        .send({
          score: 20,
        })
        .expect(200);

      expect(response.body.score).toBe(20);
      expect(response.body.checkedMask).toBe("7"); // 기존 값 유지
    });

    it("DELETE /api/bingo-boards/:id - 빙고 보드를 삭제할 수 있다", async () => {
      // 삭제할 새 보드 생성
      const createResponse = await request(app.getHttpServer())
        .post("/api/bingo-boards")
        .send({
          userId: testUserId,
          scopeType: "monthly",
          scopeKey: "2025-11",
        })
        .expect(201);

      const boardToDelete = createResponse.body.id;

      // 삭제
      await request(app.getHttpServer())
        .delete(`/api/bingo-boards/${boardToDelete}`)
        .expect(204);

      // 삭제 확인
      await request(app.getHttpServer())
        .get(`/api/bingo-boards/${boardToDelete}`)
        .expect(404);
    });
  });

  describe("MissionRecord API (/api/mission-records)", () => {
    it("POST /api/mission-records - 미션 기록을 생성할 수 있다", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/mission-records")
        .send({
          day: 13,
          mission: 5,
          score: 10,
        })
        .expect(201);

      expect(response.body.message).toBe("Mission record created successfully");
      expect(response.body.data.day).toBe(13);
      expect(response.body.data.mission).toBe(5);
      expect(response.body.data.score).toBe(10);
    });

    it("GET /api/mission-records - 미션 기록 목록을 조회할 수 있다", async () => {
      // 추가 기록 생성
      await request(app.getHttpServer())
        .post("/api/mission-records")
        .send({
          day: 14,
          mission: 8,
          score: 20,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get("/api/mission-records")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("day");
      expect(response.body[0]).toHaveProperty("mission");
      expect(response.body[0]).toHaveProperty("score");
      expect(response.body[0]).toHaveProperty("createdAt");
    });
  });

  describe("Mission API (/api/missions)", () => {
    it("POST /api/missions - 미션 완료 처리를 할 수 있다 (일간 빙고 1줄)", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/missions")
        .send({
          logs: [
            { day: 1, mission: 1 },
            { day: 1, mission: 2 },
            { day: 1, mission: 3 },
          ],
        })
        .expect(201);

      expect(response.body.score).toBe(1); // 1줄 완성 = 1점
      expect(response.body.completedMissions).toBe(3);
      expect(response.body.lastMission).toEqual({ day: 1, mission: 3 });
    });

    it("POST /api/missions - 여러 미션을 완료할 수 있다", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/missions")
        .send({
          logs: [
            { day: 2, mission: 1 },
            { day: 2, mission: 2 },
            { day: 2, mission: 3 },
            { day: 2, mission: 4 },
            { day: 2, mission: 5 },
          ],
        })
        .expect(201);

      expect(response.body.score).toBeDefined();
      expect(response.body.completedMissions).toBe(5);
      expect(response.body.lastMission.day).toBe(2);
      expect(response.body.lastMission.mission).toBe(5);
    });

    it("POST /api/missions - 빈 미션 로그는 처리할 수 있다", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/missions")
        .send({
          logs: [{ day: 3, mission: 1 }],
        })
        .expect(201);

      expect(response.body.completedMissions).toBe(1);
    });
  });

  describe("Integration Test - 전체 플로우", () => {
    it("빙고 보드 생성 → 업데이트 → 미션 완료 → 조회 플로우", async () => {
      // 1. 새 빙고 보드 생성
      const createResponse = await request(app.getHttpServer())
        .post("/api/bingo-boards")
        .send({
          userId: "integration-user",
          scopeType: "daily",
          scopeKey: "2025-11-14",
        })
        .expect(201);

      const boardId = createResponse.body.id;

      // 2. 미션 완료 처리
      await request(app.getHttpServer())
        .post("/api/missions")
        .send({
          logs: [
            { day: 14, mission: 1 },
            { day: 14, mission: 2 },
            { day: 14, mission: 3 },
          ],
        })
        .expect(201);

      // 3. 미션 기록 조회
      const recordsResponse = await request(app.getHttpServer())
        .get("/api/mission-records")
        .expect(200);

      expect(
        recordsResponse.body.some(
          (record: any) => record.day === 14 && record.mission === 3,
        ),
      ).toBe(true);

      // 4. 빙고 보드 업데이트
      const updateResponse = await request(app.getHttpServer())
        .put(`/api/bingo-boards/${boardId}`)
        .send({
          checkedMask: "7",
          score: 1,
        })
        .expect(200);

      expect(updateResponse.body.score).toBe(1);

      // 5. 업데이트된 보드 조회
      const getResponse = await request(app.getHttpServer())
        .get(`/api/bingo-boards/${boardId}`)
        .expect(200);

      expect(getResponse.body.checkedMask).toBe("7");
      expect(getResponse.body.score).toBe(1);

      // 정리
      await prisma.bingoBoard.deleteMany({
        where: { userId: "integration-user" },
      });
    });
  });
});
