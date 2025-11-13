export interface MissionRecordRepository{
    save( record: { day:number, mission: number, score: number }): Promise<void>;
    
    findAll(): Promise<{ day: number; mission: number; score: number}[]>;
}