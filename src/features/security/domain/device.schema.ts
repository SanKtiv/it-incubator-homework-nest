import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

@Schema()
export class Device {
    @Prop({ required: true })
    ip: string
    @Prop({ required: true })
    title: string
    @Prop({ required: true })
    userId: string
    @Prop({ required: true })
    lastActiveDate: string
    @Prop({ required: true })
    expirationDate: string
}

export const DeviceSchema = SchemaFactory.createForClass(Device)

export type DeviceDocument = HydratedDocument<Device>
