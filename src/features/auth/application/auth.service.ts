import { EmailAdapter } from '../infrastructure/mail.adapter';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersService } from '../../users/application/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { NewPasswordInputDto } from '../api/models/input/new-password.input.dto';
import { UserDocument } from '../../users/domain/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailAdapter: EmailAdapter,
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registrationUser(dto: UsersInputDto) {
    const userDocument = await this.usersService.createUser(dto);

    const confirmationCode = userDocument.emailConfirmation.confirmationCode;

    await this.emailAdapter.sendConfirmationCode(dto.email, confirmationCode);

    await this.usersService.saveUser(userDocument);
  }

  async registrationConfirmation(code: string) {
    const userDocument =
      await this.usersRepository.findByConfirmationCode(code);

    userDocument!.emailConfirmation.isConfirmed = true;

    await this.usersRepository.save(userDocument!);
  }

  async resendConfirmCode(email: string): Promise<void> {
    const userDocument = await this.usersRepository.findByEmail(email);

    if (!userDocument || userDocument.emailConfirmation.isConfirmed) {
      throw new BadRequestException({
        message: [{ message: 'email already confirmed', field: 'email' }],
      });
    }

    const emailConfirmation = this.usersService.createCodeWithExpireDate();

    await this.emailAdapter.sendConfirmationCode(
      email,
      emailConfirmation.confirmationCode,
    );

    userDocument.emailConfirmation.confirmationCode =
      emailConfirmation.confirmationCode;

    userDocument.emailConfirmation.expirationDate =
      emailConfirmation.expirationDate;

    await this.usersService.saveUser(userDocument);
  }

  async emailIsConfirmed(email: string) {
    const userDocument = await this.usersRepository.findByEmail(email);

    return userDocument!.emailConfirmation.isConfirmed;
  }

  async confirmationCodeIsValid(code: string): Promise<boolean> {
    const userDocument =
      await this.usersRepository.findByConfirmationCode(code);

    return !(
      !userDocument ||
      userDocument.emailConfirmation.expirationDate < new Date() ||
      userDocument.emailConfirmation.isConfirmed
    );
  }

  async validateUser(loginOrEmail: string, password: string)
      : Promise<UserDocument | null> {
    const userDocument =
      await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!userDocument) return null;

    const compareHash = await bcrypt.compare(
      password,
      userDocument.accountData.passwordHash,
    );

    if (!compareHash) return null;

    return userDocument;
  }

  async createAccessToken(userId: string) {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10s',
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

    return this.jwtService.signAsync(payload, { expiresIn: '20s' });
  }

  async passwordRecovery(email: string) {
    const code = this.usersService.createCodeWithExpireDate();

    const userDocument = await this.usersRepository.findByEmail(email);

    if (userDocument) {
      userDocument.passwordRecovery!.recoveryCode = code.confirmationCode;

      userDocument.passwordRecovery!.expirationDate = code.expirationDate;

      await this.usersService.saveUser(userDocument);
    }

    await this.emailAdapter.sendRecoveryConfirmationCode(
      email,
      code.confirmationCode,
    );
  }

  async saveNewPassword(dto: NewPasswordInputDto) {
    const userDocument = await this.usersRepository.findByRecoveryCode(
      dto.recoveryCode,
    );

    userDocument!.accountData.passwordHash = await this.usersService.genHash(
      dto.newPassword,
    );

    await this.usersService.saveUser(userDocument!);
  }
}
