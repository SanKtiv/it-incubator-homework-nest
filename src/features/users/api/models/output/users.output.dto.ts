import { Injectable } from '@nestjs/common';
import { UserDocument } from '../../../domain/users.schema';

export class UsersOutputDto {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public createdAt: string,
  ) {}
}

export const usersOutputDto = (userDocument: UserDocument) =>
  new UsersOutputDto(
    userDocument._id.toString(),
    userDocument.accountData.login,
    userDocument.accountData.email,
    userDocument.accountData.createdAt,
  );
