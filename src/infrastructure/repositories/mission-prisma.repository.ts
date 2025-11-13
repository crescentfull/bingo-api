import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { MissionRecordRepository } from "src/domain/interfaces/mission.interface";

@Injectable()
export class PrismaMissionRecordRepository implements MissionRecordRepository {
  private prisma = new PrismaClient();

  async save(record: {
    day: number;
    mission: number;
    score: number;
  }): Promise<void> {
    await this.prisma.missionRecord.create({ data: record });
  }

  async findAll(): Promise<{ day: number; mission: number; score: number }[]> {
    return this.prisma.missionRecord.findMany({ orderBy: { id: "asc" } });
  }
}
