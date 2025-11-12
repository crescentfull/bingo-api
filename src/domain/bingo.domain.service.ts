export class BingoDomainService {
  private readonly LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
    [0, 4, 8], [2, 4, 6],            // 대각선
  ];

  calculateScore(logs: number[][]): number {
    let score = 0;
    let currentDay: number | null = null;

    const newBoard = () => ({ cells: Array(9).fill(false), lines: new Set<number>() });

    let daily = newBoard();
    let weekly = newBoard();
    let monthly = newBoard();

    const isThursday = (day: number) => (day - 1) % 7 === 0;

    const bingoType = (mission: number) => {
      if (1 <= mission && mission <= 9) return ['daily', mission - 1] as const;
      if (10 <= mission && mission <= 18) return ['weekly', mission - 10] as const;
      if (19 <= mission && mission <= 27) return ['monthly', mission - 19] as const;
      throw new Error(`invalid mission ${mission}`);
    };

    // 로그 순서대로 처리
    for (const [day, mission] of logs.sort((a, b) => a[0] - b[0])) {
      // 리셋 규칙 적용
      if (day === 1) monthly = newBoard();
      if (isThursday(day)) weekly = newBoard();
      if (day !== currentDay) {
        daily = newBoard();
        currentDay = day;
      }

      const [type, pos] = bingoType(mission);
      const board = type === 'daily' ? daily : type === 'weekly' ? weekly : monthly;

      // 이미 체크된 칸이면 스킵
      if (board.cells[pos]) continue;

      // 체크 표시
      board.cells[pos] = true;

      // 빙고 판단
      this.LINES.forEach((line, i) => {
        if (board.lines.has(i)) return; // 이미 완성된 라인 제외
        if (line.every((p) => board.cells[p])) {
          score += 1;
          board.lines.add(i);
        }
      });
    }

    return score;
  }
}