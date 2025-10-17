import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsRepositoryMongo } from './features/blogs/infrastructure/mongodb/blogs.repository-mongo';
import { TestingController } from './testing/testig.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsQueryRepositoryMongo } from './features/blogs/infrastructure/mongodb/blogs.query.repository-mongo';
import { UsersService } from './features/users/application/users.service';
import { UsersRepositoryMongo } from './features/users/infrastructure/mongodb/users.repository-mongo';
import { UsersController } from './features/users/api/users.controller';
import { UsersQueryRepositoryMongo } from './features/users/infrastructure/mongodb/users.query.repository-mongo';
import { PostController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepositoryMongo } from './features/posts/infrastructure/mongodb/posts.repository-mongo';
import { PostsQueryRepositoryMongo } from './features/posts/infrastructure/mongodb/posts.query.repository-mongo';
import { CommentsRepositoryMongo } from './features/comments/infrastructure/mongodb/comments.repository-mongo';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentsQueryRepositoryMongo } from './features/comments/infrastructure/mongodb/comments.query.repository-mongo';
import dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { EmailAdapter } from './features/auth/infrastructure/mail.adapter';
import { LocalStrategy } from './features/auth/infrastructure/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TooManyRequestsMiddleware } from './infrastructure/middlewares/count-requests-api.middleware';
import { RequestApiService } from './features/requests/application/request-api.service';
import { RequestApiRepositoryMongo } from './features/requests/infrastructure/mongodb/request.repository-mongo';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from './features/auth/infrastructure/jwt.strategy';
import { BasicStrategy } from './features/auth/infrastructure/basic.strategy';
import { DevicesRepositoryMongo } from './features/security/infrastructure/mongodb/devices.repository-mongo';
import { DevicesService } from './features/security/application/devices.service';
import { AccessJwtToken } from './features/auth/application/use-cases/access-jwt-token';
import { RefreshJwtToken } from './features/auth/application/use-cases/refresh-jwt-token';
import configuration from './settings/configuration';
import { DevicesController } from './features/security/api/devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsRepositorySql } from './features/blogs/infrastructure/postgresdb/blogs.repository-sql';
import { BlogsTable } from './features/blogs/domain/blog.entity';
import { UsersTable } from './features/users/domain/users.table';
import { UsersRepositoryRawsql } from './features/users/infrastructure/postgresqldb/users.repository-rawsql';
import { DeviceTable } from './features/security/domain/device.table';
import { DevicesRepositoryRawsql } from './features/security/infrastructure/postgresqldb/devices.repository-rawsql';
import { RequestApiRepositoryTypeOrm } from './features/requests/infrastructure/postgresqldb/request.repository-tepeorm';
import { RequestTable } from './features/requests/domain/request.table';
import { UsersQueryRepositoryRawsql } from './features/users/infrastructure/postgresqldb/users.query.repository-rawsql';
import { BlogsQueryRepositoryRawSql } from './features/blogs/infrastructure/postgresdb/blogs-query-repository-raw-sql.service';
import { PostsTable } from './features/posts/domain/posts.table';
import { SaBlogsController } from './features/blogs/api/sa.blogscontroller';
import { PostsRepositoryRawSql } from './features/posts/infrastructure/postgresql/posts-repository-raw-sql.service';
import { PostsQueryRepositorySql } from './features/posts/infrastructure/postgresql/posts.query.repository-sql';
import { CommentsTable } from './features/comments/domain/comments.entity';
import { CommentsRepositorySql } from './features/comments/infrastructure/postgresql/comments.repository-sql';
import { CommentsQueryRepositorySql } from './features/comments/infrastructure/postgresql/comments.query.repository-sql';
import {
  StatusesCommentsTable,
  StatusesPostsTable,
  StatusesTable,
} from './features/statuses/domain/statuses.entity';
import { StatusesRepositorySql } from './features/statuses/infrastructure/postgresql/statuses.repository-sql';
import { AccountDataTable } from './features/users/domain/account-data.table';
import { EmailConfirmationTable } from './features/users/domain/email-сonfirmation.table';
import { PasswordRecoveryTable } from './features/users/domain/password-recovery.table';
import { UsersRepositoryTypeOrm } from './features/users/infrastructure/postgresqldb/users.repository-typeorm';
import { DevicesRepositoryTypeOrm } from './features/security/infrastructure/postgresqldb/devices-repository-type-orm.service';
import { UsersQueryRepositoryTypeOrm } from './features/users/infrastructure/postgresqldb/users.query.repository-typeorm';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsRepositoryTypeOrm } from './features/blogs/infrastructure/postgresdb/blogs.repository-typeorm';
import { PostsRepositoryTypeOrm } from './features/posts/infrastructure/postgresql/posts.repository-typeorm';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { BlogsQueryRepositoryTypeOrm } from './features/blogs/infrastructure/postgresdb/blogs.query.repository-typeorm';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query.repository';
import { PostsQueryRepositoryTypeOrm } from './features/posts/infrastructure/postgresql/posts.query.repository-typeorm';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query.repository';
import { UsersQueryRepository } from './features/users/infrastructure/users.query.repository';
import { DevicesRepository } from './features/security/infrastructure/devices.repository';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { CommentsRepositoryTypeOrm } from './features/comments/infrastructure/postgresql/comments.repository-typeorm';
import { CommentsQueryRepositoryTypeOrm } from './features/comments/infrastructure/postgresql/comments.query.repository-typeorm';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/postgresql/comments.query.repository';
import { StatusesCommentsRepository } from './features/statuses/infrastructure/statuses.comments.repository';
import { StatusesCommentsRepositoryTypeOrm } from './features/statuses/infrastructure/postgresql/statuses.comments.repository-typeorm';
import { StatusesPostsRepositoryTypeOrm } from './features/statuses/infrastructure/postgresql/statuses.posts.repository-typeorm';
import { StatusesPostsRepository } from './features/statuses/infrastructure/statuses.posts.repository';
import { QuizQuestionsController } from './features/quiz/questions/api/quiz-questions.controller';
import { QuizQuestionsServices } from './features/quiz/questions/application/quiz-questions.services';
import { QuizQuestionsRepositoryTypeOrm } from './features/quiz/questions/infrastructure/postgresql/quiz-questions.repository-typeorm';
import { QuizQuestionsQueryRepositoryTypeOrm } from './features/quiz/questions/infrastructure/postgresql/quiz-questions.query.repository-typeorm';
import { QuizQuestionsRepository } from './features/quiz/questions/infrastructure/quiz-questions.repository';
import { QuizQuestionsQueryRepository } from './features/quiz/questions/infrastructure/quiz-questions.query.repository';
import { PairGameQuizPairsController } from './features/quiz/pair-game/api/pair-game.controller';
import { GameServices } from './features/quiz/pair-game/application/pair-game.services';
import { PairGameRepository } from './features/quiz/pair-game/infrastucture/pair-game.repository';
import { PairGameRepositoryTypeOrm } from './features/quiz/pair-game/infrastucture/postgresq/pair-game.repository-typeorm';
import { PairGameQueryRepository } from './features/quiz/pair-game/infrastucture/pair-game.query.repository';
import { PairGameQueryRepositoryTypeOrm } from './features/quiz/pair-game/infrastucture/postgresq/pair-game.query.repository-typeorm';
import { PairGamesEntity } from './features/quiz/pair-game/domain/pair-games.entity';
import { PlayersEntity } from './features/quiz/pair-game/domain/players.entity';
import { PlayerAnswersEntity } from './features/quiz/pair-game/domain/player-answers.entity';
import { QuestionsGameEntity } from './features/quiz/pair-game/domain/questions-game.entity';
import {QuestionsEntity} from "./features/quiz/questions/domain/quiz-questions.entity";
import {UsersStatisticEntity} from "./features/users/domain/statistic.table";
import {GamePlayerScoresEntity} from "./features/quiz/pair-game/domain/game-player-scores";

dotenv.config();

const cases = [AccessJwtToken, RefreshJwtToken];

const services = [
  BlogsService,
  PostsService,
  CommentsService,
  UsersService,
  AuthService,
  DevicesService,
  RequestApiService,
  QuizQuestionsServices,
  GameServices,
];

const mongoRepositories = [
  BlogsRepositoryMongo,
  BlogsQueryRepositoryMongo,
  PostsRepositoryMongo,
  PostsQueryRepositoryMongo,
  CommentsRepositoryMongo,
  CommentsQueryRepositoryMongo,
  UsersRepositoryMongo,
  UsersQueryRepositoryMongo,
  DevicesRepositoryMongo,
  RequestApiRepositoryMongo,
];

const sqlRepositories = [
  BlogsRepository,
  BlogsQueryRepository,
  BlogsRepositoryTypeOrm,
  BlogsQueryRepositoryTypeOrm,
  BlogsRepositorySql,
  BlogsQueryRepositoryRawSql,
  PostsRepository,
  PostsRepositoryRawSql,
  PostsQueryRepository,
  PostsRepositoryTypeOrm,
  PostsQueryRepositoryTypeOrm,
  PostsQueryRepositorySql,
  CommentsRepositorySql,
  CommentsQueryRepositorySql,
  CommentsRepositoryTypeOrm,
  CommentsQueryRepositoryTypeOrm,
  CommentsRepository,
  CommentsQueryRepository,
  UsersRepository,
  UsersRepositoryRawsql,
  UsersQueryRepository,
  UsersQueryRepositoryRawsql,
  DevicesRepository,
  DevicesRepositoryRawsql,
  RequestApiRepositoryTypeOrm,
  StatusesRepositorySql,
  StatusesCommentsRepository,
  StatusesCommentsRepositoryTypeOrm,
  StatusesPostsRepository,
  StatusesPostsRepositoryTypeOrm,
  UsersRepositoryTypeOrm,
  DevicesRepositoryTypeOrm,
  UsersQueryRepositoryTypeOrm,
  QuizQuestionsRepositoryTypeOrm,
  QuizQuestionsQueryRepositoryTypeOrm,
  QuizQuestionsRepository,
  QuizQuestionsQueryRepository,
  PairGameRepository,
  PairGameRepositoryTypeOrm,
  PairGameQueryRepository,
  PairGameQueryRepositoryTypeOrm,
];

const repositories = [
  //...mongoRepositories,
  ...sqlRepositories,
];

const strategies = [
  LocalStrategy,
  BasicStrategy,
  JwtAccessStrategy,
  JwtRefreshStrategy,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      //signOptions: {expiresIn: '10m'}
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://neondb_owner:gnyfzHjQ0T9J@ep-damp-morning-a2vbq6mf.eu-central-1.aws.neon.tech/neondb?sslmode=require',
      ssl: true,
      entities: [
        BlogsTable,
        PostsTable,
        DeviceTable,
        RequestTable,
        UsersTable,
        AccountDataTable,
        EmailConfirmationTable,
        PasswordRecoveryTable,
        CommentsTable,
        StatusesTable,
        StatusesCommentsTable,
        StatusesPostsTable,
        PairGamesEntity,
        PlayersEntity,
        PlayerAnswersEntity,
        QuestionsGameEntity,
        QuestionsEntity,
        UsersStatisticEntity,
        GamePlayerScoresEntity
      ],
      synchronize: true,
      //logging: ['query'],
    }),
    TypeOrmModule.forFeature([
      BlogsTable,
      PostsTable,
      DeviceTable,
      RequestTable,
      UsersTable,
      AccountDataTable,
      EmailConfirmationTable,
      PasswordRecoveryTable,
      CommentsTable,
      StatusesTable,
      StatusesCommentsTable,
      StatusesPostsTable,
      PairGamesEntity,
      PlayersEntity,
      PlayerAnswersEntity,
      QuestionsGameEntity,
      QuestionsEntity,
      UsersStatisticEntity,
      GamePlayerScoresEntity
    ]),
    // MongooseModule.forRoot(
    //   appSettings.env.isTesting()
    //     ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
    //     : appSettings.api.MONGO_CONNECTION_URI,
    // ),
    // MongooseModule.forFeature([
    //   { name: Blog.name, schema: BlogSchema },
    //   { name: Post.name, schema: PostSchema },
    //   { name: User.name, schema: UsersSchema },
    //   { name: Comment.name, schema: CommentSchema },
    //   { name: RequestToApi.name, schema: RequestToApiSchema },
    //   { name: Device.name, schema: DeviceSchema },
    // ]),
  ],
  controllers: [
    AppController,
    TestingController,
    BlogsController,
    SaBlogsController,
    PostController,
    UsersController,
    CommentsController,
    AuthController,
    DevicesController,
    QuizQuestionsController,
    PairGameQuizPairsController,
  ],
  providers: [
    ...services,
    ...repositories,
    ...strategies,
    ...cases,
    //BlogIdIsExistConstraint,
    TooManyRequestsMiddleware,
    //LoginIsExistConstraint,
    //EmailIsExistConstraint,
    //EmailIsConfirmedConstraint,
    //ConfirmationCodeIsValidConstraint,
    AppService,
    EmailAdapter,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(/*TooManyRequestsMiddleware*/)
      .forRoutes
      // '/auth/registration',
      // '/auth/login',
      // '/auth/password-recovery',
      // '/auth/new-password',
      // '/auth/registration-confirmation',
      // '/auth/registration-email-resending',
      ();
  }
}
