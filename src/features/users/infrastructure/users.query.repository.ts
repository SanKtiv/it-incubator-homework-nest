import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UsersModelType } from '../domain/users.schema';
import { Types } from 'mongoose';
import { UsersQuery } from '../api/models/input/users.query.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UsersModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    try {
      return this.UserModel.findById(new Types.ObjectId(id));
    } catch (e) {
      return null;
    }
  }

  async countDocument(query: UsersQuery): Promise<number> {
    const filter = this.filterForSearchTerm(query)
    return this.UserModel.countDocuments(filter);
  }

  async findPaging(query: UsersQuery): Promise<UserDocument[]> {
    const filter = this.filterForSearchTerm(query);
    const sortBy = `accountData.${query.sortBy}`;
    return this.UserModel.find(filter)
      .sort({ [sortBy]: query.sortDirection })
      .skip((+query.pageNumber - 1) * +query.pageSize)
      .limit(+query.pageSize);
  }

  private filterForSearchTerm(query: UsersQuery): {} {
    let filter = {};
    const findArray: {}[] = [];

    if (query.searchLoginTerm) {
      const login = new RegExp(query.searchLoginTerm, 'i')
      findArray.push({ 'accountData.login': login })
      filter = { $or: findArray }
    }
    if (query.searchEmailTerm) {
      const email = new RegExp(query.searchEmailTerm, 'i')
      findArray.push({ 'accountData.email': email })
      filter = { $or: findArray }
    }
    return filter
  }
}
