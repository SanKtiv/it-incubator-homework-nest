import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.schema';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { TestingController } from './testing/testig.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersController } from './features/users/api/users.controller';
import { User, UsersSchema } from './features/users/domain/users.schema';
import { UsersQueryRepository } from './features/users/infrastructure/users.query.repository';
import { PostController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { Post, PostSchema } from './features/posts/domain/posts.schema';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query.repository';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comment.schema';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query.repository';
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
import { RequestApiRepository } from './features/requests/infrastructure/request.repository';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from './features/auth/infrastructure/jwt.strategy';
import { BasicStrategy } from './features/auth/infrastructure/basic.strategy';
import { DevicesRepository } from './features/security/infrastructure/devices.repository';
import { Device, DeviceSchema } from './features/security/domain/device.schema';
import { DevicesService } from './features/security/application/devices.service';
import { appSettings } from './settings/app-settings';
import { AccessJwtToken } from './features/auth/application/use-cases/access-jwt-token';
import { RefreshJwtToken } from './features/auth/application/use-cases/refresh-jwt-token';
import { BlogIdIsExistConstraint } from './infrastructure/decorators/validation/blogId-is-exist.decorator';
import configuration from './settings/configuration';
import { DevicesController } from './features/security/api/devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsSqlRepository } from './features/blogs/infrastructure/blogs.sql.repository';
import { BlogsTable } from './features/blogs/domain/blog.entity';
import { AccountData, UsersTable } from './features/users/domain/users.table';
import { UsersSqlRepository } from './features/users/infrastructure/users.sql.repository';
import {DeviceTable} from "./features/security/domain/device.table";
import {DevicesSqlRepository} from "./features/security/infrastructure/devices.sql.repository";
import {RequestApiSqlRepository} from "./features/requests/infrastructure/request.sql.repository";
import {RequestTable} from "./features/requests/domain/request.table";

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
  BlogsRepository,
  BlogsQueryRepository,
  PostsRepository,
  PostsQueryRepository,
  CommentsRepository,
  CommentsQueryRepository,
  UsersRepository,
  UsersQueryRepository,
  DevicesRepository,
  RequestApiRepository,
  BlogsSqlRepository,
  UsersSqlRepository,
  DevicesSqlRepository,
  RequestApiSqlRepository,
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
      entities: [BlogsTable, DeviceTable, RequestTable],
      ssl: true,
      //autoLoadEntities: false,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([BlogsTable, DeviceTable, RequestTable]),
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
      .forRoutes(
        '/auth/registration',
        '/auth/login',
        '/auth/password-recovery',
        '/auth/new-password',
        '/auth/registration-confirmation',
        '/auth/registration-email-resending',
      );
  }
}
//
