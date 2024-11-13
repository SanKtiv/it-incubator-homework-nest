import { UsersRepositoryMongo } from '../../src/features/users/infrastructure/mongodb/users.repository-mongo';
import { UsersService } from '../../src/features/users/application/users.service';

export const UserServiceMockObject = {
  sendMessageOnEmail(email: string) {
    console.log('Call mock method sendMessageOnEmail / MailService');
    return Promise.resolve(true);
  },
  create() {
    return Promise.resolve('123');
  },
};

export class UserServiceMock extends UsersService {
  constructor(usersRepository: UsersRepositoryMongo) {
    super(usersRepository);
  }

  sendMessageOnEmail() {
    console.log(
      'Call mock method sendMessageOnEmail / MailService, for specific test',
    );
    return Promise.resolve(true);
  }
}
