import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import {
  BingoBoardRepository,
  CreateBingoBoardData,
  UpdateBingoBoardData,
  BingoBoardEntity,
} from "src/domain/interfaces/bingo-board.interface";

@Injectable()
export class BingoBoardPrismaRepository implements BingoBoardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBingoBoardData): Promise<BingoBoardEntity> {
    return this.prisma.bingoBoard.create({ data });
  }

  async findById(id: string): Promise<BingoBoardEntity | null> {
    return this.prisma.bingoBoard.findUnique({ where: { id } });
  }

  async findAllByUserId(userId: string): Promise<BingoBoardEntity[]> {
    return this.prisma.bingoBoard.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    id: string,
    data: UpdateBingoBoardData,
  ): Promise<BingoBoardEntity> {
    return this.prisma.bingoBoard.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.bingoBoard.delete({ where: { id } });
  }
}
