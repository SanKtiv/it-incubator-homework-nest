import {CommentDocument} from "../../domain/comment.schema";
import {BlogsViewDto} from "../../../blogs/api/models/output/blogs.view.dto";
import {QueryDto} from "../../../../infrastructure/models/query.dto";

export class CommentOutputDto {
    constructor(
        public id: string,
        public content: string,
        public createdAt: string,
        public commentatorInfo: CommentatorInfo,
        public likesInfo: LikesInfo
    ) {}
}

class CommentatorInfo {
    constructor(
        public userId: string,
        public userLogin: string
    ) {}
}

class LikesInfo {
    constructor(
        public likesCount: number,
        public dislikesCount: number,
        public myStatus: string
    ) {}
}

export const commentOutputDto = (commentDocument: CommentDocument, userStatus: string = 'None') => new CommentOutputDto(
    commentDocument._id.toString(),
    commentDocument.content,
    commentDocument.createdAt,
    new CommentatorInfo(
        commentDocument.userId,
        commentDocument.userLogin
    ),
    new LikesInfo(
        commentDocument.likesCount,
        commentDocument.dislikesCount,
        userStatus
    )
)

export class CommentsPagingDto {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: CommentOutputDto[],
    ) {}
}

export const commentsPagingDto = (query: QueryDto, totalComments: number, userStatus: string = 'None', commentsDocument: CommentDocument[]) => new CommentsPagingDto(
    Math.ceil(totalComments / query.pageSize),
    query.pageNumber,
    query.pageSize,
    totalComments,
    commentsDocument.map(document => new commentOutputDto(document, userStatus))
)