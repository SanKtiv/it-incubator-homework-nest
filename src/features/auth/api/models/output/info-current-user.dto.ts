import { UserDocument } from '../../../../users/domain/users.schema';

export class InfoCurrentUserDto {
  constructor(
    public email: string,
    public login: string,
    public userId: string,
  ) {}
}

export const infoCurrentUserDto = (document: UserDocument) =>
  new InfoCurrentUserDto(
    document.accountData.email,
    document.accountData.login,
    document._id.toString(),
  );
