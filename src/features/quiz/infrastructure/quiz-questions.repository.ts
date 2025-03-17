import {Injectable} from "@nestjs/common";
import {QuizQuestionsRepositoryTypeOrm} from "./postgresql/quiz-questions.repository-typeorm";

@Injectable()
export class QuizQuestionsRepository {
    constructor(protected repository: QuizQuestionsRepositoryTypeOrm) {
    }
}