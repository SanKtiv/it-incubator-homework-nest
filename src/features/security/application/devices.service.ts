import {Injectable} from "@nestjs/common";
import {DevicesRepository} from "../infrastructure/devices.repository";
import {DeviceDto} from "../api/models/device.dto";

@Injectable()
export class DevicesService {
    constructor(private readonly devicesRepository: DevicesRepository) {
    }

    async create(dto: DeviceDto): Promise<string> {
        const deviceDocument = await this.devicesRepository.create(dto)
        return deviceDocument._id.toString()
    }

    async save(deviceId: string): Promise<void> {
        const deviceDocument = await this.devicesRepository.findById(deviceId)
        await
    }
}