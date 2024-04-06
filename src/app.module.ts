import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsController } from './blogs/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/blogs.schema';
import { BlogsService } from './blogs/blogs.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://aktitorov:eNCT8uWLAFpvV11U@cluster0.fjbyymj.mongodb.net/tube?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [AppController, BlogsController],
  providers: [AppService, BlogsService],
})
export class AppModule {}
