import { EmailAdapter } from '../infrastructure/mail.adapter';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersService } from '../../users/application/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import b_crypt from 'bcrypt';
import { NewPasswordInputDto } from '../api/models/input/new-password.input.dto';
import { UsersTable } from '../../users/domain/users.table';
import { UsersRepositoryOrm } from '../../users/infrastructure/postgresqldb/users.repository-typeorm';
import { PasswordRecoveryTable } from '../../users/domain/password-recovery.table';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailAdapter: EmailAdapter,
    private readonly usersRepository: UsersRepositoryOrm,
    private readonly usersService: UsersService,
  ) {}

  async registrationUser(dto: UsersInputDto) {
    const user = await this.usersService.createUser(dto);
    const confirmationCode = user.emailConfirmation.confirmationCode;
    await this.emailAdapter.sendConfirmationCode(dto.email, confirmationCode);
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

    user.emailConfirmation.expirationDate = emailConfirmation.expirationDate;

    await this.usersRepository.save(user);
  }

  // async emailIsConfirmed(email: string) {
  //   const userDocument = await this.usersRepository.findByEmail(email);
  //
  //   return userDocument!.emailConfirmation.isConfirmed;
  // }

  async confirmationCodeIsValid(code: string): Promise<boolean> {
    const user = await this.usersRepository.findByConfirmationCode(code);

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

    const compareHash = await b_crypt.compare(
      password,
      user.accountData.passwordHash,
    );

    if (!compareHash) return null;

    return user;
  }

  async passwordRecovery(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return;

    const code = this.usersService.createCodeWithExpireDate();
    const passwordRecovery = new PasswordRecoveryTable();

    passwordRecovery.recoveryCode = code.confirmationCode;
    passwordRecovery.expirationDateRecovery = code.expirationDate;
    user.passwordRecovery = passwordRecovery;

    await this.usersRepository.save(user);

    await this.emailAdapter.sendRecoveryConfirmationCode(
      email,
      code.confirmationCode,
    );
  }

  async saveNewPassword(dto: NewPasswordInputDto) {
    const user = await this.usersRepository.findByRecoveryCode(
      dto.recoveryCode,
    );

    if (!user) throw new BadRequestException();

    user.accountData.passwordHash = await this.usersService.genHash(
      dto.newPassword,
    );

    await this.usersRepository.save(user);
  }
}
