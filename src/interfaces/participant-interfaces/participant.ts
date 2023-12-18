export interface Participant {
    id: number
    name: string,
    type: string,
    members: number | null,
    wins: number | null,
    gamemasterId: number 
}
