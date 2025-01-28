import { Injectable } from '@nestjs/common';
import { RequestApiInputDto } from '../api/models/input.dto';
import {RequestApiRepositoryTypeOrm} from "../infrastructure/postgresqldb/request.repository-tepeorm";
import {RequestTable} from "../domain/request.table";

@Injectable()
export class RequestApiService {
  constructor(private readonly requestApiRepository: RequestApiRepositoryTypeOrm) {}


  async createReq(dto: RequestApiInputDto) {
    const requestInfo = new RequestTable();

    requestInfo.ip = dto.ip;
    requestInfo.url = dto.url;
    requestInfo.date = new Date();

    await this.requestApiRepository.createReqApi(requestInfo)
  }

  async tooManyAttempts(dto: RequestApiInputDto) {
    const date = new Date(Number(new Date()) - 10000);

    const documents = await this.requestApiRepository.findByIp(dto, date);
console.log('request adn time:', documents, new Date())
    return documents.length > 5;
  }
}
