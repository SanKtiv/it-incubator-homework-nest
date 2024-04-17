import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Post, PostDocument, PostModelType} from "../domain/posts.schema";
import {Types} from "mongoose";

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {
    }

    async findById(id: string): Promise<PostDocument | null> {
        try {
            return this.PostModel.findById( new Types.ObjectId(id))
        }
        catch (e) {
            return null
        }
    }
}