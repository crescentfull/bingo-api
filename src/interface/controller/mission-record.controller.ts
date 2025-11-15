import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { Inject } from "@nestjs/common";
import type { MissionRecordRepository } from "src/domain/interfaces/mission.interface";

@Controller("api/mission-records")
export class MissionRecordController {
  constructor(
    @Inject("MissionRecordRepository")
    private readonly repository: MissionRecordRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: { day: number; mission: number; score: number }) {
    await this.repository.save(body);
    return { message: "Mission record created successfully", data: body };
  }

  @Get()
  async findAll() {
    const records = await this.repository.findAll();
    return records;
  }
}

