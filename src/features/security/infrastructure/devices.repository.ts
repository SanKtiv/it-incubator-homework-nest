import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Device, DeviceDocument, DeviceModelType} from "../domain/device.schema";
import {DeviceDto} from "../api/models/device.dto";

@Injectable()
export class DevicesRepository {
    constructor(@InjectModel(Device.name) private DeviceModel: DeviceModelType) {
    }

    async create(dto: DeviceDto): Promise<DeviceDocument> {
        const document = await this.DeviceModel.createDevice(dto, this.DeviceModel)

        await document.save()

        return document
    }

    async save(document: DeviceDocument): Promise<void> {
        await document.save()
    }

    async findById(deviceId: string) {
        return this.DeviceModel.findById(deviceId)
    }

    async removeAll(): Promise<void> {
        await this.DeviceModel.deleteMany()
    }
}
