import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Device,
    DeviceDocument,
    DeviceModelType,
} from '../domain/device.schema';
import { DeviceDto } from '../api/models/device.dto';
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource, Not} from "typeorm";
import {DeviceTable} from "../domain/device.table";

@Injectable()
export class DevicesSqlRepository {
    constructor(@InjectDataSource() protected dataSource: DataSource,) {}

    async create(dto: DeviceDto): Promise<DeviceTable> {
        return this.dataSource
            .getRepository(DeviceTable)
            .save(dto);
    }

    async save(document: DeviceDocument): Promise<void> {
        await document.save();
    }

    async findById(id: string): Promise<DeviceTable | null> {
        return this.dataSource
            .getRepository(DeviceTable)
            .findOneBy({id: id})
    }

    async findByUserId(userId: string): Promise<DeviceTable[]> {
        return this.dataSource
            .getRepository(DeviceTable)
            .findBy({userId: userId});
    }

    async deleteDeviceById(id: string) {
        const device = await this.findById(id)
        if (!device) return
        return this.dataSource
            .getRepository(DeviceTable)
            .remove(device);
    }

    async deleteDevices(userId: string, deviceId: string) {
        const devices = await this.dataSource
            .getRepository(DeviceTable)
            .findBy({
                userId: userId,
                id: Not(deviceId)
            });
        if (!devices) return
        return this.dataSource
            .getRepository(DeviceTable)
            .remove(devices);
    }

    async removeAll(): Promise<void> {
        await this.dataSource
            .getRepository(DeviceTable)
            .clear();
    }
}
