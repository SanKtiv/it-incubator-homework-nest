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

const mongoURI =
  'mongodb+srv://aktitorov:eNCT8uWLAFpvV11U@cluster0.fjbyymj.mongodb.net/tube?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(mongoURI),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UsersSchema },
    ]),
  ],
  controllers: [
    AppController,
    TestingController,
    BlogsController,
    UsersController,
  ],
  providers: [
    AppService,
    BlogsQueryRepository,
    BlogsRepository,
    BlogsService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
  ],
})
export class AppModule {}
