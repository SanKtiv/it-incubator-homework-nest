import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class RequestToApi {
  @Prop({ required: true })
  ip: string;
  @Prop({ required: true })
  url: string;
  @Prop({ required: true })
  date: Date;

  static createRequest(
    dto: {},
    RequestToApiModel: RequestToApiModelType,
  ): RequestToApiDocument {
    const requestToApiDocument = new RequestToApiModel(dto);
    requestToApiDocument.date = new Date();
    return requestToApiDocument;
  }
}

export const RequestToApiSchema = SchemaFactory.createForClass(RequestToApi);

export type RequestToApiDocument = HydratedDocument<RequestToApi>;

export type RequestToApiModelType = Model<RequestToApiDocument> &
  RequestToApiStaticMethodsType;

type RequestToApiStaticMethodsType = {
  createRequest: (
    dto: {},
    RequestToApiModel: RequestToApiModelType,
  ) => RequestToApiDocument;
};

RequestToApiSchema.statics = {
  createRequest: RequestToApi.createRequest,
};
