import { EmailAdapter } from '../infrastructure/mail.adapter';
import { UsersInputDto } from '../../users/api/models/input/users.input.dto';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersService } from '../../users/application/users.service';
import {UserDocument} from "../../users/domain/users.schema";
import {Injectable} from "@nestjs/common";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

@Injectable()
export class AuthService {
  constructor(
    private readonly emailAdapter: EmailAdapter,
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) {}

  async registrationUser(dto: UsersInputDto) {
    const userDocument = await this.usersService.createUser(dto);

    const confirmationCode = userDocument.emailConfirmation.confirmationCode;

    await this.emailAdapter.sendConfirmationCode(dto.email, confirmationCode);

    await this.usersRepository.save(userDocument);
  }

  async registrationConfirmation(userDocument: UserDocument) {
    userDocument.emailConfirmation.isConfirmed = true

    await this.usersRepository.save(userDocument)
  }

  async resendingCode(email: string): Promise<void> {
    const userDocument = await this.usersRepository.findByEmail(email)

    const confirmationCode: string = uuidv4();

    const expirationDate: Date = add(new Date(), { hours: 1, minutes: 5 });

    userDocument!.emailConfirmation.confirmationCode = confirmationCode

    userDocument!.emailConfirmation.expirationDate = expirationDate

    await this.usersRepository.save(userDocument!)

    await this.emailAdapter.sendConfirmationCode(email, confirmationCode)
  }

  async emailIsConfirmed(email: string) {
    const userDocument = await this.usersRepository.findByEmail(email)

    return userDocument!.emailConfirmation.isConfirmed

  }
}
