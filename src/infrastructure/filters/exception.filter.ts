import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

class ErrorsMessages {
  constructor(public errorsMessages: Errors[]) {}
}

class Errors {
  constructor(
    public message: string,
    public field: string,
  ) {}
}

@Catch(Error)
export class ErrorsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    if (status === 400) {
      const messageArray: any = exception.getResponse();
      return response
        .status(status)
        .send(new ErrorsMessages(messageArray.message));
    }

    if (status === 401) return response.sendStatus(status);

    if (status === 404) return response.sendStatus(status);

    if (status === 429) return response.sendStatus(status);

    return response.status(status).send({ exception });
  }
}
