import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsInputDto } from '../api/models/input/blogs.input.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogDocument } from '../domain/blogs.schema';
import {
  BlogsViewDto,
  blogsViewDto,
} from '../api/models/output/blogs.view.dto';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async createBlog(dto: BlogsInputDto): Promise<BlogsViewDto> {
    const blogDocument = await this.blogsRepository.create(dto);

    return blogsViewDto(blogDocument);
  }

  async updateBlog(id: string, inputUpdate: BlogsInputDto) {
    const blogDocument = await this.existBlog(id);

    Object.assign(blogDocument, inputUpdate);

    await this.blogsRepository.save(blogDocument);
  }

  async existBlog(id: string): Promise<BlogDocument> {
    const blogDocument = await this.blogsRepository.findById(id);

    if (!blogDocument) throw new NotFoundException();

    return blogDocument;
  }

  async deleteBlog(id: string): Promise<void> {
    const blogDocument = await this.blogsRepository.remove(id);
    if (!blogDocument) throw new NotFoundException();
  }
}
