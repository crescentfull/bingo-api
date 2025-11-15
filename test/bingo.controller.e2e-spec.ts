// import { INestApplication } from "@nestjs/common"
// import { Test, TestingModule } from "@nestjs/testing"
// import { AppModule } from "src/app.module"
// import request from 'supertest'

// describe('BingoController (e2e test)', () => {
//     let app: INestApplication

//     beforeAll(async () => {
//         const moduleFixture: TestingModule = await Test.createTestingModule({
//             imports: [AppModule],
//         }).compile();

//         app = moduleFixture.createNestApplication();
//         await app.init();
//     });

//     afterAll(async () => {
//         await app.close();
//     });

//     it('POST /api/missions/complete - 일간 빙고 라인 1개 완성=>1점 획득!', async() => {
//         const logs = [
//             { day: 1, mission: 1},
//             { day: 1, mission: 2},
//             { day: 1, mission: 3},
//         ];

//         const response = await request(app.getHttpServer())
//             .post('api/missions/complete')
//             .send({ logs })
//             .expect(201)

//             expect(response.body.score).toBe(1);
//     })
// })

import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";

describe("🎯 BingoController (E2E without supertest)", () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /api/missions", async () => {
    const res = await fetch("http://localhost:3000/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logs: [
          { day: 1, mission: 1 },
          { day: 1, mission: 2 },
          { day: 1, mission: 3 },
        ],
      }),
    });

    const json = await res.json();
    expect(json.score).toBe(1);
    expect(json.completedMissions).toBe(3);
    expect(json.lastMission).toEqual({ day: 1, mission: 3 });
  });
});
