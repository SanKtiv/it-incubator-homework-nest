import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { blogCreateModel } from './blogs-options';

export class BlogsTestManager {
  constructor(protected readonly app: INestApplication) {}

  expectViewModel(createModel: any, responseModel: any) {
    expect(responseModel).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
      ...createModel,
    });
  }

  async createBlog(createModel: any, auth: any) {
    return request(this.app.getHttpServer())
      .post('/blogs')
      .set(auth.type, auth.pass)
      .send(createModel);
    //.expect(201)
  }

  async getBlogs() {}

  async getBlogById() {}

  async updateBlogById() {}

  async deleteBlogById() {}
}
