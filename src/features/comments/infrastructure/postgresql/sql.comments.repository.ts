import {Injectable, InternalServerErrorException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
} from '../../domain/comment.schema';
import { CommentServiceDto } from '../../api/models/input/comment-service.dto';
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {CommentsTable} from "../../domain/comments.entity";

@Injectable()
export class CommentsSqlRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource
  ) {}

  async create(dto: CommentServiceDto): Promise<CommentsTable> {
    const rawQuery = `
        INSERT INTO "comments" ("content", "userId", "userLogin", "createdAt", "postId")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;

    const parameters = [dto.content, dto.userId, dto.userLogin, new Date(), dto.postId]

    try {
      const commentsArray = await this.dataSource.query(rawQuery, parameters)

      return commentsArray[0]
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  // async findById(id: string): Promise<CommentDocument | null> {
  //   return this.CommentModel.findById(id);
  // }
  //
  // async save(commentDocument: CommentDocument): Promise<CommentDocument> {
  //   return commentDocument.save();
  // }
  //
  // async deleteById(id: string) {
  //   return this.CommentModel.findByIdAndDelete(id);
  // }
  //
  // async deleteAll() {
  //   await this.CommentModel.deleteMany();
  // }
}
