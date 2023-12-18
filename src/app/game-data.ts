import { Game } from "src/interfaces/game-interfaces/game"
import { Categories } from "./categories"
import { AddParticipantsToGame } from "../interfaces/game-interfaces/add.participants.to.game"

export interface GameData {
    participant1X2: boolean
    participant2X2: boolean 
    game: Game,
    rightOrWrong: boolean,
    whoPlays: number,
    round: number,
    categories: Categories,
    wins1: number | null | undefined,
    wins2: number | null | undefined,
    participant1: string | null | undefined,  
    participant2: string | null | undefined,
    dif: number
    x2: boolean,
    pointx1: boolean,
    fiftyFifty_P1: boolean,
    fiftyFifty_P2: boolean,
    phone_P1: boolean,
    phone_P2: boolean,
    questions: Array<any>,
    participants: AddParticipantsToGame
}
