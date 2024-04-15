import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument, UsersModelType} from "../domain/users.schema";
import {Types} from "mongoose";
import {UsersQuery} from "../api/models/input/users.query.dto";

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private UserModel: UsersModelType) {}

    async findById(id: string): Promise<UserDocument | null> {
        try {
            return this.UserModel.findById(new Types.ObjectId(id))
        }
        catch (e) {
            return null
        }
    }

    async findPaging(query: UsersQuery): Promise<UserDocument[]> {

        //const filter = {};
        const login = { $regex: query.searchLoginTerm, $options: 'i' }
        const email = { $regex: query.searchEmailTerm, $options: 'i' }
        const sortBy = `accountData.${query.sortBy}`
        const findArray = []
        if (login) findArray.push({'accountData.login': login})
        if (email) findArray.push({'accountData.email': email})
       // if (login && email) filter['$or'] = findArray
        //if (login && email) filter = {$or: findArray}
        if (login && email) {

            return this.UserModel
                .find({$or: findArray})
                .sort({[sortBy]: query.sortDirection})
                .skip((+query.pageNumber - 1) * +query.pageSize)
                .limit(+query.pageSize)
        }
        return this.UserModel
            .find(findArray[0])
            .sort({[query.sortBy]: query.sortDirection})
            .skip((+query.pageNumber - 1) * +query.pageSize)
            .limit(+query.pageSize)
        // return this.UserModel
        //     .find(filter)
        //     .sort({[query.sortBy]: query.sortDirection})
        //     .skip((+query.pageNumber - 1) * +query.pageSize)
        //     .limit(+query.pageSize)
    }
}