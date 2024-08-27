import { UserDocument } from '../../../../users/domain/users.schema';
import {UsersTable} from "../../../../users/domain/users.table";

export class InfoCurrentUserDto {
  constructor(
    public email: string,
    public login: string,
    public userId: string,
  ) {}
}

// export const infoCurrentUserDto = (document: UserDocument) =>
//   new InfoCurrentUserDto(
//     document.accountData.email,
//     document.accountData.login,
//     document._id.toString(),
//   ); for mongo

export const infoCurrentUserDto = (document: UsersTable) =>
    new InfoCurrentUserDto(
        document.email,
        document.login,
        document.id,
    );
