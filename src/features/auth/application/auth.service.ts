import { EmailAdapter } from '../infrastructure/mail.adapter';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersRepositoryMongo } from '../../users/infrastructure/mongodb/users.repository-mongo';
import { UsersService } from '../../users/application/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { NewPasswordInputDto } from '../api/models/input/new-password.input.dto';
import { UserDocument } from '../../users/domain/users.schema';
import { UsersRepositorySql } from '../../users/infrastructure/postgresqldb/users.repository-sql';
import { UsersTable } from '../../users/domain/users.table';
import {UsersRepositoryORM} from "../../users/infrastructure/postgresqldb/users.repository-TypeORM";
import {AccessJwtToken} from "./use-cases/access-jwt-token";
import {RefreshJwtToken} from "./use-cases/refresh-jwt-token";

@Injectable()
export class AuthService {
  constructor(
    private readonly emailAdapter: EmailAdapter,
    //private readonly usersRepository: UsersRepositoryMongo,
    private readonly usersRepository: UsersRepositoryORM,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly accessTokenService: AccessJwtToken,
    private readonly refreshTokenService: RefreshJwtToken
  ) {}

  async registrationUser(dto: UsersInputDto) {
    await this.usersService.createUser(dto);
  }

  async registrationConfirmation(code: string) {
    const user = await this.usersRepository.findByConfirmationCode(code);

    if (
      !user ||
      user.emailConfirmation.expirationDate < new Date() ||
      user.emailConfirmation.isConfirmed
    )
      throw new BadRequestException({
        message: [{ message: 'code is wrong', field: 'code' }],
      });

    user.emailConfirmation.isConfirmed = true;

    await this.usersRepository.save(user);
  }

  async resendConfirmCode(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user || user.emailConfirmation.isConfirmed) {
      throw new BadRequestException({
        message: [{ message: 'email already confirmed', field: 'email' }],
      });
    }

    const emailConfirmation = this.usersService.createCodeWithExpireDate();

    await this.emailAdapter.sendConfirmationCode(
      email,
      emailConfirmation.confirmationCode,
    );

    user.emailConfirmation.confirmationCode =
      emailConfirmation.confirmationCode;

    user.emailConfirmation.expirationDate =
      emailConfirmation.expirationDate;

    await this.usersRepository.save(user);
  }

  // async emailIsConfirmed(email: string) {
  //   const userDocument = await this.usersRepository.findByEmail(email);
  //
  //   return userDocument!.emailConfirmation.isConfirmed;
  // }

  async confirmationCodeIsValid(code: string): Promise<boolean> {
    const user =
      await this.usersRepository.findByConfirmationCode(code);

    return !(
      !user ||
      user.emailConfirmation.expirationDate < new Date() ||
      user.emailConfirmation.isConfirmed
    );
  }

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<UsersTable | null> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const compareHash = await bcrypt.compare(
      password,
      //userDocument.accountData.passwordHash, for mongo
      user.accountData.passwordHash,
    );

    if (!compareHash) return null;

    return user;
  }

  async createAccessToken(userId: string) {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
    });

    return { accessToken: accessToken };
  }

  async getPayloadAccessToken(accessToken: string) {
    try {
      return this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      return null;
    }
  }

  async createRefreshToken(userId: string, deviceId: string) {
    const payload = { sub: userId, deviceId: deviceId };

    return this.jwtService.signAsync(payload, { expiresIn: '20m' });
  }

  async passwordRecovery(email: string) {
    const code = this.usersService.createCodeWithExpireDate();

    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      user.passwordRecovery.recoveryCode = code.confirmationCode;

      user.passwordRecovery.expirationDateRecovery = code.expirationDate;

      await this.usersRepository.save(user);
    }

    await this.emailAdapter.sendRecoveryConfirmationCode(
      email,
      code.confirmationCode,
    );
  }

  async saveNewPassword(dto: NewPasswordInputDto) {
    const recoveryInfo = await this.usersRepository.findByRecoveryCode(
      dto.recoveryCode,
    );
console.log('recoveryInfo =', recoveryInfo)
    // const userDocument = await this.usersSqlRepository.findById(recoveryInfo!.id)

    // userDocument!.accountData.passwordHash = await this.usersService.genHash(
    //   dto.newPassword,
    // );for mongo

    // userDocument!.passwordHash = await this.usersService.genHash(
    //   dto.newPassword,
    // );

    // await this.usersSqlRepository.save(userDocument!);
  }
}
