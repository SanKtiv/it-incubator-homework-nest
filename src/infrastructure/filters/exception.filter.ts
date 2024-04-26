import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

class ErrorsMessages {
    constructor(public errorsMessages: Errors[]) {}
}

class Errors {
    constructor(
        public message: string,
        public field: string
    ) {
    }
}

@Catch(Error)
export class ErrorsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus()
        if (status === 400) {
            const messageArray: any = exception.getResponse()
            const errorsArray: Errors[] = []
            messageArray.message.forEach(e => errorsArray.push({message: e, field: ''}))
            response
                .status(status)
                .send(new ErrorsMessages(errorsArray))
        }
    }
}