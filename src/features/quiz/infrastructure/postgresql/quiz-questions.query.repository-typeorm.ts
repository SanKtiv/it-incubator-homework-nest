import { Injectable } from '@nestjs/common';
import {QuizQuestionsQueryInputDto} from "../../api/models/quiz-questions.input.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {QuizQuestionsEntity} from "../../domain/quiz-questions.entity";
import {Repository} from "typeorm";
import {QuizQuestionsPaging, quizQuestionsPagingViewModel} from "../../api/models/quiz-questions.output.dto";

@Injectable()
export class QuizQuestionsQueryRepositoryTypeOrm {
  constructor(@InjectRepository(QuizQuestionsEntity) protected repository: Repository<QuizQuestionsEntity>) {}

  async get() {}

  async getPaging(queryDto: QuizQuestionsQueryInputDto): Promise<QuizQuestionsPaging> {
    const bodySearchTerm = queryDto.bodySearchTerm ?? null;

    const QuizQuestions = this.repository
        .createQueryBuilder('qq')
        .where('qq."body" ~* :bodySearchTerm OR :bodySearchTerm IS NULL', {bodySearchTerm})

    const totalQuizQuestions = await QuizQuestions.getCount();

    const QuizQuestionsPaging = await QuizQuestions.getMany()

    return quizQuestionsPagingViewModel(QuizQuestionsPaging, queryDto, totalQuizQuestions)
  }
}
