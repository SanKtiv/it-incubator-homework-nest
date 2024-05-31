import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestToApi,
  RequestToApiDocument,
  RequestToApiModelType,
} from '../domain/request.schema';
import { RequestApiInputDto } from '../api/models/input.dto';

@Injectable()
export class RequestApiRepository {
  constructor(
    @InjectModel(RequestToApi.name)
    private RequestToApiModel: RequestToApiModelType,
  ) {}

  async create(dto: RequestApiInputDto) {
    const document = await this.RequestToApiModel.createRequest(
      dto,
      this.RequestToApiModel,
    );
    await document.save();
  }

  async findByIp(ip: string, date: Date): Promise<number> {
    return this.RequestToApiModel.countDocuments({
      ip: ip,
      date: { $gte: date },
    });
  }

  async save(document: RequestToApiDocument) {
    return document.save();
  }

  async removeAll() {
    await this.RequestToApiModel.deleteMany();
  }
}
