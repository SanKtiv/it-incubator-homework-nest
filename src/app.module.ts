import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blogs.schema';
import { BlogsRepository } from './blogs/blogs.repositories/blogs.repository';
import { TestingController } from './testing/testig.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsHandler } from './blogs/blogs.hendler';
import { BlogsQueryRepository } from './blogs/blogs.repositories/blogs.query.repository';

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
