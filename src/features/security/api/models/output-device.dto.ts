import { DeviceDocument } from '../../domain/device.schema';
import { map } from 'rxjs/operators';
import { DeviceTable } from '../../domain/device.table';

export class OutputDeviceDto {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public deviceId: string,
  ) {}
}

// export const devicesViewModel = (deviceDocuments: DeviceDocument[]) =>
//   deviceDocuments.map(
//     (e) =>
//       new OutputDeviceDto(e.ip, e.title, e.lastActiveDate, e._id.toString()),
//   ); for mongo

export const devicesViewModel = (deviceDocuments: DeviceTable[]) =>
  deviceDocuments.map(
    (e) => new OutputDeviceDto(e.ip, e.title, e.lastActiveDate, e.id),
  );
