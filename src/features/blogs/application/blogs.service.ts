import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogDocument } from '../domain/blogs.schema';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(dto: BlogsInputDto): Promise<BlogDocument> {
    const blogDocument = await this.blogsRepository.create(dto);
    return this.blogsRepository.save(blogDocument);
  }

  async updateBlog(blog: BlogDocument, inputUpdate: BlogsInputDto) {
    Object.assign(blog, inputUpdate);
    await this.blogsRepository.save(blog);
  }

  async existBlog(id: string) {
    const blogDocument = await this.blogsRepository.findById(id);
    if (!blogDocument) throw new NotFoundException();
  }

  async deleteBlog(id: string): Promise<void> {
    await this.blogsRepository.remove(id);
  }
}
