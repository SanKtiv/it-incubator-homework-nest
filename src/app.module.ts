import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.schema';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { TestingController } from './testing/testig.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsHandler } from './features/blogs/api/blogs.hendler';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query.repository';

const mongoURI =
  'mongodb+srv://aktitorov:eNCT8uWLAFpvV11U@cluster0.fjbyymj.mongodb.net/tube?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(mongoURI),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [AppController, TestingController, BlogsController],
  providers: [
    AppService,
    BlogsQueryRepository,
    BlogsRepository,
    BlogsService,
    BlogsHandler,
  ],
})
export class AppModule {}
