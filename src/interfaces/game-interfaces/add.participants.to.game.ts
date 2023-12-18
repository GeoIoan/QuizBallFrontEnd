import { Participant } from "src/interfaces/participant-interfaces/participant";

export interface AddParticipantsToGame {
    id : number | null,
    participant1: Participant | null, 
    participant2: Participant | null
}
