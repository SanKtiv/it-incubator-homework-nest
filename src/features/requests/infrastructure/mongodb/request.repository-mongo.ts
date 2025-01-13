import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestToApi,
  RequestToApiDocument,
  RequestToApiModelType,
} from '../../domain/request.schema';
import { RequestApiInputDto } from '../../api/models/input.dto';

@Injectable()
export class RequestApiRepositoryMongo {
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

  async findByIp(dto: RequestApiInputDto, date: Date): Promise<number> {
    return this.RequestToApiModel.countDocuments({
      ip: dto.ip,
      url: dto.url,
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
