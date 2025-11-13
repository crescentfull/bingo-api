export class BingoBoard {
  private readonly LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로
    [0, 4, 8], [2, 4, 6], // 대각선
  ];

  private cells: boolean[] = Array(9).fill(false);
  private completedLines: Set<number> = new Set();

  mark(position: number): number {
    // 이미 체크된 칸이면 점수 변화 없음
    if (this.cells[position]) return 0;

    this.cells[position] = true;
    let count = 0;

    // 빙고 완성 판단
    // foreach -> return이 루프를 멈추지 않는다. 콜백만 빠져나가고 다음 루프를 계속 돔
    // break, continue 사용 불가 -> 제어흐름 표현력 떨어짐
    // async/await 사용시에 promise의 흐름이 복잡해진다. 

    for (const [i, line] of this.LINES.entries()) {
      if (this.completedLines.has(i)) continue;
      if (line.every((p) => this.cells[p])) {
        this.completedLines.add(i);
        count += 1;
      }
    }
    return count;
  }

  reset() {
    this.cells.fill(false);
    this.completedLines.clear();
  }
}
