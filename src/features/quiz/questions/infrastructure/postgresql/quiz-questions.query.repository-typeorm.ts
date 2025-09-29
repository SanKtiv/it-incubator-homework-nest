import { Injectable } from '@nestjs/common';
import { QuizQuestionsQueryInputDto } from '../../api/models/quiz-questions.input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {QuestionsEntity} from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';
import {
  QuizQuestionsPaging,
  quizQuestionsPagingViewModel,
} from '../../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsQueryRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuestionsEntity)
    protected repository: Repository<QuestionsEntity>,
  ) {}

  async getPaging(
      queryDto: QuizQuestionsQueryInputDto,
  ): Promise<QuizQuestionsPaging> {
    const bodySearchTerm = queryDto.bodySearchTerm ?? null;

    const publishedStatus =
        queryDto.publishedStatus == 'published'
            ? true
            : queryDto.publishedStatus == 'notPublished'
            ? false
            : null;

    const quizQuestions = this.repository
        .createQueryBuilder('q')
        .where('q."body" ~* :bodySearchTerm OR :bodySearchTerm IS NULL')
        .andWhere('q."published" = :publishedStatus OR :publishedStatus IS NULL')
        .setParameters({ bodySearchTerm, publishedStatus });

    const totalQuizQuestions = await quizQuestions.getCount();

    const quizQuestionsPaging = await quizQuestions
        .select(['q'])
        .orderBy(`"${queryDto.sortBy}"`, queryDto.sortDirection)
        .skip((queryDto.pageNumber - 1) * queryDto.pageSize)
        .take(queryDto.pageSize)
        .getMany();

    return quizQuestionsPagingViewModel(
        quizQuestionsPaging,
        queryDto,
        totalQuizQuestions,
    );
  }
}
