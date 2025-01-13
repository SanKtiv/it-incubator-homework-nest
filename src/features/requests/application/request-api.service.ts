import { Injectable } from '@nestjs/common';
import { RequestApiInputDto } from '../api/models/input.dto';
import { RequestApiRepositoryMongo } from '../infrastructure/mongodb/request.repository-mongo';

@Injectable()
export class RequestApiService {
  constructor(
      //private readonly requestApiRepository: RequestApiRepositoryMongo
  ) {}

  // async createReq(dto: RequestApiInputDto) {
  //   return this.requestApiRepository.create(dto);
  // }
  //
  // async tooManyAttempts(dto: RequestApiInputDto) {
  //   const date = new Date(Number(new Date()) - 10000);
  //
  //   const documents = await this.requestApiRepository.findByIp(dto, date);
  //
  //   return documents > 5;
  // }
}
