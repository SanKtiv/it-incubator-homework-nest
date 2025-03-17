import {Injectable} from "@nestjs/common";
import {QuizQuestionsRepositoryTypeOrm} from "./postgresql/quiz-questions.repository-typeorm";
import {QuizQuestionsEntity} from "../domain/quiz-questions.entity";
import {QuizQuestionsOutputDto, quizQuestionsViewModel} from "../api/models/quiz-questions.output.dto";

@Injectable()
export class QuizQuestionsRepository {
    constructor(protected repository: QuizQuestionsRepositoryTypeOrm) {
    }

    async insert(dto: QuizQuestionsEntity): Promise<QuizQuestionsOutputDto> {
        const createdQuestions = await this.repository.insert(dto);

        return quizQuestionsViewModel(createdQuestions);
    }
}