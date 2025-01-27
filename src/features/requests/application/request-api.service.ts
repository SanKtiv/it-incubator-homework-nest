import { Injectable } from '@nestjs/common';
import { RequestApiInputDto } from '../api/models/input.dto';
import { RequestApiRepositoryMongo } from '../infrastructure/mongodb/request.repository-mongo';
import {RequestApiRepositoryTypeOrm} from "../infrastructure/postgresqldb/request.repository-tepeorm";
import {RequestTable} from "../domain/request.table";

@Injectable()
export class RequestApiService {
  constructor() {} private readonly requestApiRepository: RequestApiRepositoryTypeOrm


  async createReq(dto: RequestApiInputDto) {
    const date = new Date();
    const requestInfo = {...dto, date} as  RequestTable;

    return this.requestApiRepository.create(requestInfo);
  }

  async tooManyAttempts(dto: RequestApiInputDto) {
    const date = new Date(Number(new Date()) - 10000);

    const documents = await this.requestApiRepository.findByIp(dto, date);

    return documents > 5;
  }
}
