import { Question } from "src/interfaces/question-interfaces/question";

export interface AddQuestionsDto {
    gameId: number,
    questions: Array<any>
}
