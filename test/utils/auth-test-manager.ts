import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersInputDto } from '../../src/features/users/api/models/input/users.input.dto';

export class AuthTestManager {
    constructor(protected readonly app: INestApplication) {}

    async registration(userDto: UsersInputDto) {
        return request(this.app.getHttpServer())
            .post('/auth/registration')
            .send(userDto)
    }
}
