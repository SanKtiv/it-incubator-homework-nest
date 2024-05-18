import {Injectable} from "@nestjs/common";
import {RequestApiInputDto} from "../api/models/input.dto";
import {RequestApiRepository} from "../infrastructure/request.repository";

@Injectable()
export class RequestApiService {
    constructor(private readonly requestApiRepository: RequestApiRepository) {
    }

    async createRequestApi(dto: RequestApiInputDto) {
        return this.requestApiRepository.create(dto)
    }

    async
}