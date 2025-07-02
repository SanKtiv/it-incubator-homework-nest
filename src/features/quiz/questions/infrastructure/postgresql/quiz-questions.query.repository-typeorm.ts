import { Injectable } from '@nestjs/common';
import { QuizQuestionsQueryInputDto } from '../../api/models/quiz-questions.input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {NewQuizQuestionsEntity, QuizQuestionsEntity} from '../../domain/quiz-questions.entity';
import { Repository } from 'typeorm';
import {
  QuizQuestionsPaging,
  quizQuestionsPagingViewModel,
} from '../../api/models/quiz-questions.output.dto';

@Injectable()
export class QuizQuestionsQueryRepositoryTypeOrm {
  constructor(
    @InjectRepository(QuizQuestionsEntity)
    protected repository_OLD: Repository<QuizQuestionsEntity>,
    protected repository: Repository<NewQuizQuestionsEntity>,
  ) {}

  async get() {}

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
        .createQueryBuilder('qq')
        .where('qq."body" ~* :bodySearchTerm OR :bodySearchTerm IS NULL')
        .andWhere('qq."published" = :publishedStatus OR :publishedStatus IS NULL')
        .setParameters({ bodySearchTerm, publishedStatus });

    const totalQuizQuestions = await quizQuestions.getCount();

    const quizQuestionsPaging = await quizQuestions.select('qq.*')
        .orderBy(`"${queryDto.sortBy}"`, queryDto.sortDirection)
        .offset((queryDto.pageNumber - 1) * queryDto.pageSize)
        .limit(queryDto.pageSize)
        .getRawMany();

    return quizQuestionsPagingViewModel(
        quizQuestionsPaging,
        queryDto,
        totalQuizQuestions,
    );
  }

  async getPaging_OLD(
    queryDto: QuizQuestionsQueryInputDto,
  ): Promise<QuizQuestionsPaging> {
    const bodySearchTerm = queryDto.bodySearchTerm ?? null;
    const publishedStatus =
      queryDto.publishedStatus == 'published'
        ? true
        : queryDto.publishedStatus == 'notPublished'
          ? false
          : null;

    const QuizQuestions = this.repository_OLD
      .createQueryBuilder('qq')
      .where('qq."body" ~* :bodySearchTerm OR :bodySearchTerm IS NULL', {
        bodySearchTerm,
      })
      .andWhere(
        'qq."published" = :publishedStatus OR :publishedStatus IS NULL',
        { publishedStatus },
      );

    const totalQuizQuestions = await QuizQuestions.getCount();

    const QuizQuestionsPaging = await QuizQuestions.select('qq.*')
      .orderBy(`"${queryDto.sortBy}"`, queryDto.sortDirection)
      .offset((queryDto.pageNumber - 1) * queryDto.pageSize)
      .limit(queryDto.pageSize)
      .getRawMany();

    //const QuizQuestionsPaging = await QuizQuestions.getMany()

    return quizQuestionsPagingViewModel(
      QuizQuestionsPaging,
      queryDto,
      totalQuizQuestions,
    );
  }
}
