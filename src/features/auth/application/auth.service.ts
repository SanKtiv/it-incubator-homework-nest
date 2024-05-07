import { EmailAdapter } from '../infrastructure/mail.adapter';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersService } from '../../users/application/users.service';
import {UserDocument} from "../../users/domain/users.schema";
import {Injectable} from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(
    private readonly emailAdapter: EmailAdapter,
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) {}

  async createAuthUser(dto: UsersInputDto) {
    const userDocument = await this.usersService.createUser(dto);

    const confirmationCode = userDocument.emailConfirmation.confirmationCode;

    await this.emailAdapter.sendConfirmationCode(dto.email, confirmationCode);

    await this.usersRepository.save(userDocument);
  }

  async registrationConfirmation(userDocument: UserDocument) {
    userDocument.emailConfirmation.isConfirmed = true

    await this.usersRepository.save(userDocument)
  }
}
