import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
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
import {commentOutputDto, CommentOutputDto} from "../../api/models/output/comment.output.dto";

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

  async findById(id: string, userId?: string | null) {
    userId = userId ? userId : null

    const rawQuery = `
    SELECT c."id", c."content", c."createdAt", c."userId",
    
      (SELECT u."login" FROM "users" AS u WHERE c."userId" = u."id") AS "userLogin",
      
      (SELECT COUNT(*) FROM "statuses" AS s
       WHERE p."id" = s."postId" AND s."userStatus" = 'Like') AS "likesCount",
        
      (SELECT COUNT(*) FROM "statuses" AS s
       WHERE p."id" = s."postId" AND s."userStatus" = 'Dislike') AS "dislikesCount",
        
      (SELECT s."userStatus" FROM "statuses" AS s
       WHERE p."id" = s."postId" AND s."userId" = $2) AS "myStatus"
    FROM "comments" AS c
    WHERE c."id" = $1`

    const parameters = [id, userId]

    try {
      return (await this.dataSource.query(rawQuery, parameters))[0];
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async updateStatusesCount(commentId: string, likesCount, dislikesCount: number) {
    const rawQuery = `
        UPDATE "comments" AS p
        SET p."likesCount" = $1, p."dislikesCount" = $2
        WHERE p."id" = $3`

    const parameters = [likesCount, dislikesCount, commentId]

    try {
      await this.dataSource.query(rawQuery, parameters)
    }
    catch (e) {
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
