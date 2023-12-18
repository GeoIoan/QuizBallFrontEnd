
export interface Game {
    type: string | null,
    winner: string | null,
    score: string | null,
    startdate: Date | null,
    endDate: Date | null,
    duration: Date | null,
    gamemasterId: number | null,
    custom: number | null
}
