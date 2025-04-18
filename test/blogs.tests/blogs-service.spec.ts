import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import { BlogsService } from '../../src/features/blogs/application/blogs.service';
import { BlogsRepositoryMongo } from '../../src/features/blogs/infrastructure/mongodb/blogs.repository-mongo';
import {
  Blog,
  BlogDocument,
  BlogsModelType,
  BlogsStaticMethodsType,
} from '../../src/features/blogs/domain/blogs.schema';

describe('integration tests for BlogsService', () => {
  let mongoMemoryServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    console.log('mongoUri =', mongoUri);
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoMemoryServer.stop();
  });

  describe('create blog test', () => {
    const dto = {
      name: 'Qwerty1',
      description: 'Qwerty1',
      websiteUrl: 'qwerty@qwerty.com',
    };

    const blogModel = new Blog(); //as BlogsModelType
    const blogsRepository = new BlogsRepositoryMongo(blogModel);
    const blogsService = new BlogsService(blogsRepository);

    it('should return created blog', async () => {
      const result = await blogsService.createBlog(dto);

      expect(result.name).toBe('Qwerty1');
    });
  });
});
