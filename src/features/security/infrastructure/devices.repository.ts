import {Injectable} from "@nestjs/common";
import {DevicesRepositoryTypeOrm} from "./postgresqldb/devices-repository-type-orm.service";

@Injectable()
export class DevicesRepository {
    constructor(protected devicesRepository: DevicesRepositoryTypeOrm) {
    }
}