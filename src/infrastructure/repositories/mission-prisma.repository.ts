import { Injectable } from "@nestjs/common";
import { MissionRecordRepository } from "src/domain/interfaces/mission.interface";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class PrismaMissionRecordRepository implements MissionRecordRepository {

   
  constructor(private readonly prisma: PrismaService) {}

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
