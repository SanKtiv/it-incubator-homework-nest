import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {RequestToApi, RequestToApiDocument, RequestToApiModelType} from "../domain/request.schema";
import {RequestApiInputDto} from "../api/models/input.dto";

@Injectable()
export class RequestApiRepository {
    constructor(@InjectModel(RequestToApi.name) private RequestToApiModel: RequestToApiModelType) {
    }

    async create(dto: RequestApiInputDto) {
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