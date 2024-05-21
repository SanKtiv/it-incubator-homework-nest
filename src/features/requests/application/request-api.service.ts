import {Injectable} from "@nestjs/common";
import {RequestApiInputDto} from "../api/models/input.dto";
import {RequestApiRepository} from "../infrastructure/request.repository";

@Injectable()
export class RequestApiService {
    constructor(private readonly requestApiRepository: RequestApiRepository) {
    }

    async createReq(dto: RequestApiInputDto) {
        return this.requestApiRepository.create(dto)
    }

    async tooManyAttempts(ip: string) {
        const date = new Date() - 10000

        const documents = await this.requestApiRepository.findByIp(ip, date as Date)

        return documents > 5
    }
}