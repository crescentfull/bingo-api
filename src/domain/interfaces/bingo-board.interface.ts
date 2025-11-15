export interface BingoBoardRepository {
  create(data: CreateBingoBoardData): Promise<BingoBoardEntity>;
  findById(id: string): Promise<BingoBoardEntity | null>;
  findAllByUserId(userId: string): Promise<BingoBoardEntity[]>;
  update(id: string, data: UpdateBingoBoardData): Promise<BingoBoardEntity>;
  delete(id: string): Promise<void>;
}

export interface CreateBingoBoardData {
  userId: string;
  scopeType: string;
  scopeKey: string;
}

export interface UpdateBingoBoardData {
  checkedMask?: bigint;
  lineMask?: bigint;
  score?: number;
}

export interface BingoBoardEntity {
  id: string;
  userId: string;
  scopeType: string;
  scopeKey: string;
  checkedMask: bigint;
  lineMask: bigint;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

