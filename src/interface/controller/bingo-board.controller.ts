import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { Inject } from "@nestjs/common";
import type { BingoBoardRepository } from "src/domain/interfaces/bingo-board.interface";

@Controller("api/bingo-boards")
export class BingoBoardController {
  constructor(
    @Inject("BingoBoardRepository")
    private readonly repository: BingoBoardRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: { userId: string; scopeType: string; scopeKey: string },
  ) {
    const board = await this.repository.create(body);
    return {
      id: board.id,
      userId: board.userId,
      scopeType: board.scopeType,
      scopeKey: board.scopeKey,
      checkedMask: board.checkedMask.toString(),
      lineMask: board.lineMask.toString(),
      score: board.score,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    const board = await this.repository.findById(id);
    if (!board) {
      throw new NotFoundException(`BingoBoard with id ${id} not found`);
    }
    return {
      id: board.id,
      userId: board.userId,
      scopeType: board.scopeType,
      scopeKey: board.scopeKey,
      checkedMask: board.checkedMask.toString(),
      lineMask: board.lineMask.toString(),
      score: board.score,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }

  @Get()
  async findAllByUserId(@Query("userId") userId: string) {
    if (!userId) {
      return { error: "userId query parameter is required" };
    }
    const boards = await this.repository.findAllByUserId(userId);
    return boards.map((board) => ({
      id: board.id,
      userId: board.userId,
      scopeType: board.scopeType,
      scopeKey: board.scopeKey,
      checkedMask: board.checkedMask.toString(),
      lineMask: board.lineMask.toString(),
      score: board.score,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    }));
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: { checkedMask?: string; lineMask?: string; score?: number },
  ) {
    const updateData: any = {};
    if (body.checkedMask !== undefined) {
      updateData.checkedMask = BigInt(body.checkedMask);
    }
    if (body.lineMask !== undefined) {
      updateData.lineMask = BigInt(body.lineMask);
    }
    if (body.score !== undefined) {
      updateData.score = body.score;
    }

    const board = await this.repository.update(id, updateData);
    return {
      id: board.id,
      userId: board.userId,
      scopeType: board.scopeType,
      scopeKey: board.scopeKey,
      checkedMask: board.checkedMask.toString(),
      lineMask: board.lineMask.toString(),
      score: board.score,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.repository.delete(id);
  }
}

