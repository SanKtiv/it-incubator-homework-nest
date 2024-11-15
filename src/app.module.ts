import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.schema';
import { BlogsRepositoryMongo } from './features/blogs/infrastructure/mongodb/blogs.repository-mongo';
import { TestingController } from './testing/testig.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsQueryRepositoryMongo } from './features/blogs/infrastructure/mongodb/blogs.query.repository-mongo';
import { UsersService } from './features/users/application/users.service';
import { UsersRepositoryMongo } from './features/users/infrastructure/mongodb/users.repository-mongo';
import { UsersController } from './features/users/api/users.controller';
import { User, UsersSchema } from './features/users/domain/users.schema';
import { UsersQueryRepositoryMongo } from './features/users/infrastructure/mongodb/users.query.repository-mongo';
import { PostController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepositoryMongo } from './features/posts/infrastructure/mongodb/posts.repository-mongo';
import { Post, PostSchema } from './features/posts/domain/posts.schema';
import { PostsQueryRepositoryMongo } from './features/posts/infrastructure/mongodb/posts.query.repository-mongo';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comment.schema';
import { CommentsRepositoryMongo } from './features/comments/infrastructure/mongodb/comments.repository-mongo';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentsQueryRepositoryMongo } from './features/comments/infrastructure/mongodb/comments.query.repository-mongo';
import dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { EmailAdapter } from './features/auth/infrastructure/mail.adapter';
import { LoginIsExistConstraint } from './infrastructure/decorators/login-is-exist.decorator';
import { EmailIsExistConstraint } from './infrastructure/decorators/email-is-exist.decorator';
import { EmailIsConfirmedConstraint } from './infrastructure/decorators/email-is-confimed.decorator';
import { ConfirmationCodeIsValidConstraint } from './infrastructure/decorators/confirmation-code-is-valid.decorator';
import { LocalStrategy } from './features/auth/infrastructure/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TooManyRequestsMiddleware } from './infrastructure/middlewares/count-requests-api.middleware';
import { RequestApiService } from './features/requests/application/request-api.service';
import {
  RequestToApi,
  RequestToApiSchema,
} from './features/requests/domain/request.schema';
import { RequestApiRepository } from './features/requests/infrastructure/mongodb/request.repository-mongo';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from './features/auth/infrastructure/jwt.strategy';
import { BasicStrategy } from './features/auth/infrastructure/basic.strategy';
import { DevicesRepositoryMongo } from './features/security/infrastructure/mongodb/devices.repository-mongo';
import { Device, DeviceSchema } from './features/security/domain/device.schema';
import { DevicesService } from './features/security/application/devices.service';
import { appSettings } from './settings/app-settings';
import { AccessJwtToken } from './features/auth/application/use-cases/access-jwt-token';
import { RefreshJwtToken } from './features/auth/application/use-cases/refresh-jwt-token';
import { BlogIdIsExistConstraint } from './infrastructure/decorators/validation/blogId-is-exist.decorator';
import configuration from './settings/configuration';
import { DevicesController } from './features/security/api/devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsRepositorySql } from './features/blogs/infrastructure/postgresdb/blogs.repository-sql';
import { BlogsTable, ForBlogsTable } from './features/blogs/domain/blog.entity';
import { UsersTable } from './features/users/domain/users.table';
import { UsersRepositorySql } from './features/users/infrastructure/postgresqldb/users.repository-sql';
import { DeviceTable } from './features/security/domain/device.table';
import { DevicesRepositorySql } from './features/security/infrastructure/postgresqldb/devices.repository-sql';
import { RequestApiSqlRepository } from './features/requests/infrastructure/postgresqldb/request.repository-sql';
import { RequestTable } from './features/requests/domain/request.table';
import { UsersQueryRepositorySql } from './features/users/infrastructure/postgresqldb/users.query.repository-sql';
import { BlogsQueryRepositorySql } from './features/blogs/infrastructure/postgresdb/blogs.query.repository-sql';
import { PostsTable } from './features/posts/domain/posts.table';
import { SaBlogsController } from './features/blogs/api/sa.blogscontroller';
import { PostsRepositorySql } from './features/posts/infrastructure/postgresql/posts.repository-sql';
import { PostsQueryRepositorySql } from './features/posts/infrastructure/postgresql/posts.query.repository-sql';
import { CommentsTable } from './features/comments/domain/comments.entity';
import { CommentsSqlRepository } from './features/comments/infrastructure/postgresql/comments.repository-sql';
import { CommentsSqlQueryRepository } from './features/comments/infrastructure/postgresql/comments.query.repository-sql';
import { StatusesTable } from './features/statuses/domain/statuses.entity';
import { StatusesRepositorySql } from './features/statuses/infrastructure/statuses.repository-sql';
import { AccountDataTable } from './features/users/domain/account-data.table';
import { EmailConfirmationTable } from './features/users/domain/email-сonfirmation.table';
import { PasswordRecoveryTable } from './features/users/domain/password-recovery.table';

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
];

const repositories = [
  BlogsRepositoryMongo,
  BlogsQueryRepositoryMongo,
  BlogsRepositorySql,
  BlogsQueryRepositorySql,
  PostsRepositoryMongo,
  PostsRepositorySql,
  PostsQueryRepositoryMongo,
  PostsQueryRepositorySql,
  CommentsRepositoryMongo,
  CommentsQueryRepositoryMongo,
  CommentsSqlRepository,
  CommentsSqlQueryRepository,
  UsersRepositoryMongo,
  UsersQueryRepositoryMongo,
  DevicesRepositoryMongo,
  RequestApiRepository,
  UsersRepositorySql,
  UsersQueryRepositorySql,
  DevicesRepositorySql,
  RequestApiSqlRepository,
  StatusesRepositorySql,
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
      // host: 'ep-damp-morning-a2vbq6mf.eu-central-1.aws.neon.tech',
      // port: 5432,
      // username: 'neondb_owner',
      // password: 'gnyfzHjQ0T9J',
      // database: 'neondb',
      entities: [
        BlogsTable,
        PostsTable,
        DeviceTable,
        RequestTable,
        UsersTable,
        AccountDataTable,
        EmailConfirmationTable,
        PasswordRecoveryTable,
        ForBlogsTable,
        CommentsTable,
        StatusesTable,
      ],
      ssl: true,
      //autoLoadEntities: false,
      synchronize: true,
      logging: ['query', 'error', 'warn'],
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
      ForBlogsTable,
      CommentsTable,
      StatusesTable,
    ]),
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI,
    ),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UsersSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: RequestToApi.name, schema: RequestToApiSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
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
  ],
  providers: [
    ...services,
    ...repositories,
    ...strategies,
    ...cases,
    BlogIdIsExistConstraint,
    TooManyRequestsMiddleware,
    LoginIsExistConstraint,
    EmailIsExistConstraint,
    EmailIsConfirmedConstraint,
    ConfirmationCodeIsValidConstraint,
    AppService,
    EmailAdapter,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TooManyRequestsMiddleware)
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
