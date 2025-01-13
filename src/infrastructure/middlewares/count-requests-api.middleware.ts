import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestApiInputDto } from '../../features/requests/api/models/input.dto';
import { RequestApiService } from '../../features/requests/application/request-api.service';

@Injectable()
export class TooManyRequestsMiddleware implements NestMiddleware {
  constructor(private readonly requestApiService: RequestApiService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // const dto: RequestApiInputDto = {
    //   ip: req.header('x-forwarded-for') || req.ip || '',
    //   url: req.originalUrl || req.baseUrl,
    // };
    //
    // await this.requestApiService.createReq(dto);
    //
    // const countAttempts = await this.requestApiService.tooManyAttempts(dto);
    //
    // if (countAttempts)
    //   throw new HttpException(
    //     'Too Many Requests',
    //     HttpStatus.TOO_MANY_REQUESTS,
    //   );

    next();
  }
}
