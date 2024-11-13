import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UsersModelType } from '../../domain/users.schema';
import { UsersInputDto } from '../../api/models/input/users.input.dto';
import { filterByLoginAndEmail } from '../utils.repositories';

@Injectable()
export class UsersRepositoryMongo {
  constructor(@InjectModel(User.name) private UserModel: UsersModelType) {}

  async create(
    dto: UsersInputDto,
    passwordHash: string,
    confirmationCode: string,
    expirationDate: Date,
  ): Promise<UserDocument> {
    return this.UserModel.createUser(
      dto,
      passwordHash,
      confirmationCode,
      expirationDate,
      this.UserModel,
    );
  }

  async save(userDocument: UserDocument): Promise<UserDocument> {
    return userDocument.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      return this.UserModel.findById(id);
    } catch (e) {
      return null;
    }
  }

  async findByConfirmationCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async findByRecoveryCode(code: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'passwordRecovery.recoveryCode': code,
    });
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ 'accountData.login': login });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ 'accountData.email': email });
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    const filter = filterByLoginAndEmail(loginOrEmail, loginOrEmail);
    return this.UserModel.findOne(filter);
  }

  async remove(id: string): Promise<UserDocument | null> {
    try {
      return this.UserModel.findByIdAndDelete(id);
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async removeAll() {
    await this.UserModel.deleteMany();
  }
}
