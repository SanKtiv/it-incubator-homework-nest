import {DeviceDocument} from "../../domain/device.schema";

export class DeviceDto {
  ip: string;
  title: string;
  userId: string;
  lastActiveDate?: string;
  expirationDate?: string;
}

export const devicesViewModel = (deviceDocuments: DeviceDocument[]) => ({

})
