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
async findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({'accountData.email': email})
}

  async countDocument(query: UsersQuery): Promise<number> {
    const filter = this.filterForSearchTerm(query.searchLoginTerm, query.searchEmailTerm);
    return this.UserModel.countDocuments(filter);
  }

  async findPaging(query: UsersQuery): Promise<UserDocument[]> {
    const filter = this.filterForSearchTerm(query.searchLoginTerm, query.searchEmailTerm);
    const sortBy = `accountData.${query.sortBy}`;
    return this.UserModel.find(filter)
      .sort({ [sortBy]: query.sortDirection })
      .skip((+query.pageNumber - 1) * +query.pageSize)
      .limit(+query.pageSize);
  }

  private filterForSearchTerm(searchLogin, searchEmail: string | null): {} {
    let filter = {};
    const findArray: {}[] = [];

    if (searchLogin) {
      const login = new RegExp(searchLogin, 'i');
      findArray.push({ 'accountData.login': login });
      filter = { $or: findArray };
    }
    if (searchEmail) {
      const email = new RegExp(searchEmail, 'i');
      findArray.push({ 'accountData.email': email });
      filter = { $or: findArray };
    }
    return filter;
  }
}
