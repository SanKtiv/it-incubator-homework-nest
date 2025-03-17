import {QuizQuestionsEntity} from "../../domain/quiz-questions.entity";

export class QuizQuestionsOutputDto {
    id: string;
    body: string;
    correctAnswers: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export const quizQuestionsViewModel = (dto: QuizQuestionsEntity) => ({
    id: dto.id,
    body: dto.body,
    correctAnswers: dto.correctAnswers,
    published: dto.published,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString() ?? dto.updatedAt
})