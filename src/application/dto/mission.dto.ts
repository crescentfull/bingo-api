export interface MissionLog {
    day: number;
    mission: number;
}

export class MissionDto {
    constructor(public readonly logs: MissionLog[]) {}
}