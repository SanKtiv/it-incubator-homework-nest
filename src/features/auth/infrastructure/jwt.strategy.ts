import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { DevicesService } from '../../security/application/devices.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || '',
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(private readonly devicesService: DevicesService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;

          if (req && req.cookies) {
            token = req.cookies.refreshToken; // or req.cookies['refreshToken']
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY || '',
    });
  }

  async validate(payload: any) {
    const deviceDocument = await this.devicesService.findById(payload.deviceId);

    return payload;
  }
}
