import {Controller, Delete, Get, HttpCode, UseGuards} from "@nestjs/common";
import {JWTRefreshAuthGuard} from "../../../infrastructure/guards/jwt-refresh-auth.guard";

@Controller('security/devices')
@UseGuards(JWTRefreshAuthGuard)
export class DevicesController {
    constructor() {}

    @Get()
    @HttpCode(200)
    async getDevices() {
    }

    @Delete(':deviceId')
    @HttpCode(204)
    async deleteDeviceById() {}

    @Delete()
    @HttpCode(204)
    async deleteDevices() {}
}