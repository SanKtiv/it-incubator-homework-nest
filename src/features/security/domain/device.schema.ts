import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { DeviceDto } from '../api/models/device.dto';

@Schema()
export class Device {
  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  lastActiveDate: string;

  @Prop({ required: true })
  expirationDate: string;

  static createDevice(dto: DeviceDto, DeviceModel: Model<Device>) {
    return new DeviceModel(dto);
  }
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

export type DeviceDocument = HydratedDocument<Device>;

export type DeviceModelType = Model<DeviceDocument> & DeviceStaticMethodsType;

export type DeviceStaticMethodsType = {
  createDevice: (
    dto: DeviceDto,
    DeviceModel: Model<DeviceDocument>,
  ) => DeviceDocument;
};

DeviceSchema.statics = {
  createDevice: Device.createDevice,
};
