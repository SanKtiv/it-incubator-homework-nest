import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UsersModelType } from '../../domain/users.schema';
import { Types } from 'mongoose';
import { UsersQuery } from '../../api/models/input/users.query.dto';
import {
  filterByLoginAndEmail,
  loginAndEmailToRegExp,
} from '../utils.repositories';
import {
  infoCurrentUserDto,
  InfoCurrentUserDto,
} from '../../../auth/api/models/output/info-current-user.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private UserModel: UsersModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findById(id);
  }

  async infoCurrentUser(id: string): Promise<InfoCurrentUserDto> {
    const userDocument = await this.findById(id);
    return infoCurrentUserDto(userDocument! as any); // as any delete
  }

  async loginIsExist(login: string): Promise<number> {
    return this.UserModel.countDocuments({ 'accountData.login': login });
  }

  async emailIsExist(email: string): Promise<number> {
    return this.UserModel.countDocuments({ 'accountData.email': email });
  }

  // async existLoginOrEmail(login, email: string): Promise<number> {
  //   const filter = filterByLoginAndEmail(login, email)
  //   return this.UserModel.countDocuments(filter);
  // }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDocument | null> {
    const filter = filterByLoginAndEmail(loginOrEmail, loginOrEmail);
    return this.UserModel.findOne(filter);
  }

  // async confirmationCodIsExist(code: string): Promise<number> {
  //   return this.UserModel.countDocuments({
  //     'emailConfirmation.confirmationCode': code,
  //   });
  // }

  async countDocument(query: UsersQuery): Promise<number> {
    const term = loginAndEmailToRegExp(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );

    const filter = filterByLoginAndEmail(term.login, term.email);

    return this.UserModel.countDocuments(filter);
  }

  async findPaging(query: UsersQuery): Promise<UserDocument[]> {
    const term = loginAndEmailToRegExp(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );

    const filter = filterByLoginAndEmail(term.login, term.email);

    const sortBy = `accountData.${query.sortBy}`;

    return (
      this.UserModel.find(filter)
        //.sort({ [sortBy]: query.sortDirection }) dont work with lower case
        .skip((+query.pageNumber - 1) * +query.pageSize)
        .limit(+query.pageSize)
    );
  }
}
