import { Module } from '@nestjs/common';
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
import {AuthService} from "./features/auth/application/auth.service";
import {EmailAdapter} from "./features/auth/infrastructure/mail.adapter";
import {LoginIsExistConstraint} from "./infrastructure/decorators/login-is-exist.decorator";
import {EmailIsExistConstraint} from "./infrastructure/decorators/email-is-exist.decorator";

dotenv.config();

const mongoURI = process.env.MONGO_URL || ''; //'mongodb+srv://aktitorov:eNCT8uWLAFpvV11U@cluster0.fjbyymj.mongodb.net/nest-db?retryWrites=true&w=majority';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoURI),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UsersSchema },
      { name: Comment.name, schema: CommentSchema },
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
  ],
  providers: [
    LoginIsExistConstraint,
    EmailIsExistConstraint,
    AppService,
    BlogsQueryRepository,
    BlogsRepository,
    BlogsService,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    CommentsRepository,
    CommentsService,
    CommentsQueryRepository,
    EmailAdapter,
    AuthService,
  ],
})
export class AppModule {}
//
