import { EmailAdapter } from '../infrastructure/mail.adapter';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersService } from '../../users/application/users.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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

    await this.usersRepository.save(userDocument);
  }

  async registrationConfirmation(code: string) {
    const userDocument =
      await this.usersRepository.findByConfirmationCode(code);

    userDocument!.emailConfirmation.isConfirmed = true;

    await this.usersRepository.save(userDocument!);
  }

  async resendingCode(email: string): Promise<void> {
    const userDocument = await this.usersRepository.findByEmail(email);

    const confirmationCode: string = uuidv4();

    const expirationDate: Date = add(new Date(), { hours: 1, minutes: 5 });

    userDocument!.emailConfirmation.confirmationCode = confirmationCode;

    userDocument!.emailConfirmation.expirationDate = expirationDate;

    await this.usersRepository.save(userDocument!);

    await this.emailAdapter.sendConfirmationCode(email, confirmationCode);
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

  async validateUser(loginOrEmail: string, password: string) {
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

  async createAccessToken(loginOrEmail: string) {
    const userDocument =
      await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    const payload = { userId: userDocument!._id.toString() };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7m',
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

  async createRefreshToken(loginOrEmail: string) {
    const userDocument =
      await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    const payload = { userId: userDocument!._id.toString() };

    return this.jwtService.signAsync(payload, { expiresIn: '1h' });
  }

  async passwordRecovery(email: string) {
    const code = this.usersService.createCodeWithExpireDate()

    const userDocument = await this.usersRepository.findByEmail(email)

    if (userDocument) {
      userDocument.emailConfirmation.confirmationCode = code.confirmationCode

      userDocument.emailConfirmation.expirationDate = code.expirationDate
    }

    await this.emailAdapter.sendRecoveryConfirmationCode(email, code.confirmationCode)
  }
}
