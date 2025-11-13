
import { Injectable } from '@nestjs/common';
import { BingoBoard } from '../entities/bingo-board';

@Injectable()
export class BingoDomainService {
  private daily = new BingoBoard();
  private weekly = new BingoBoard();
  private monthly = new BingoBoard();

  private currentDay: number | null = null;
  private score = 0;

  private isThursday(day: number) {
    return (day - 1) % 7 === 0;
  }

  private getBoardByMission(mission: number): [BingoBoard, number] {
    if (1 <= mission && mission <= 9) return [this.daily, mission - 1];
    if (10 <= mission && mission <= 18) return [this.weekly, mission - 10];
    if (19 <= mission && mission <= 27) return [this.monthly, mission - 19];
    throw new Error(`Invalid mission ${mission}`);
  }

  calculateScore(logs: number[][]): number {
    for (const [day, mission] of logs.sort((a, b) => a[0] - b[0])) {
      // 리셋 규칙
      if (day === 1) this.monthly.reset();
      if (this.isThursday(day)) this.weekly.reset();
      if (day !== this.currentDay) {
        this.daily.reset();
        this.currentDay = day;
      }

      const [board, pos] = this.getBoardByMission(mission);
      this.score += board.mark(pos);
    }
    return this.score;
  }
}
