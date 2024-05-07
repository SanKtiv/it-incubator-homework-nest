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

  async existLoginOrEmail(login, email: string): Promise<UserDocument | null> {
    const filter = this.filterForSearchTerm(login, email)
    return this.UserModel.countDocuments(filter);
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    const filter = this.filterForSearchTerm(loginOrEmail, loginOrEmail)
    return this.UserModel.findOne(filter);
  }

  async findByCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async countDocument(query: UsersQuery): Promise<number> {
    const term = this.loginAndEmailToRegExp(query.searchLoginTerm, query.searchEmailTerm)

    const filter = this.filterForSearchTerm(term.login, term.email);

    return this.UserModel.countDocuments(filter);
  }

  async findPaging(query: UsersQuery): Promise<UserDocument[]> {
    const term = this.loginAndEmailToRegExp(query.searchLoginTerm, query.searchEmailTerm)

    const filter = this.filterForSearchTerm(term.login, term.email);

    const sortBy = `accountData.${query.sortBy}`;

    return this.UserModel.find(filter)
      .sort({ [sortBy]: query.sortDirection })
      .skip((+query.pageNumber - 1) * +query.pageSize)
      .limit(+query.pageSize);
  }

  private filterForSearchTerm(login, email: string | RegExp | null): {} {
    let filter = {};
    const findArray: {}[] = [];

    if (login) {
      findArray.push({ 'accountData.login': login });
      filter = { $or: findArray };
    }
    if (email) {
      findArray.push({ 'accountData.email': email });
      filter = { $or: findArray };
    }
    return filter;
  }

  private loginAndEmailToRegExp(login, email: string | null) {
    return {
      login: login ? new RegExp(login, 'i') : null,
      email: email ? new RegExp(email, 'i') : null,
    }
  }
}
