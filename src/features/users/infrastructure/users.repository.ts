import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UsersModelType } from '../domain/users.schema';
import { UsersInputDto } from '../api/models/input/users.input.dto';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
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

  async remove(id: string): Promise<void> {
    try {
      await this.UserModel.findByIdAndDelete(id);
    } catch (e) {
      throw new Error('Error DB');
    }
  }

  async removeAll() {
    await this.UserModel.deleteMany();
  }
}
