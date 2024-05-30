import {Injectable} from "@nestjs/common";
import {DevicesRepository} from "../infrastructure/devices.repository";

@Injectable()
export class DevicesService {
    constructor(private readonly devicesRepository: DevicesRepository) {
    }

    async create() {

    }
}