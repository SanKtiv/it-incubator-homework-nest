import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {RequestToApi, RequestToApiDocument, RequestToApiModelType} from "../domain/request.schema";
import {RequestToApiInputDto} from "../api/models/input.dto";

@Injectable()
export class RequestRepository {
    constructor(@InjectModel(RequestToApi.name) private RequestToApiModel: RequestToApiModelType) {
    }

    async create(dto: RequestToApiInputDto) {
        return this.RequestToApiModel.createRequest(
            dto,
            this.RequestToApiModel
        )
    }

    async findByIp(ip: string) {
        return this.RequestToApiModel.findOne({ip: ip})
    }

    async save(document: RequestToApiDocument) {
        return document.save();
    }

    async removeAll() {
        await this.RequestToApiModel.deleteMany()
    }
}