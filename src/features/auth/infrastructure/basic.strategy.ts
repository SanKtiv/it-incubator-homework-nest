import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({});
  }

  async validate(username: string, password: string) {
    if (
      process.env.SUPER_USER_NAME === username &&
      process.env.SUPER_USER_PASS === password
    ) {
      return { sub: username };
      //return true;
    }
    throw new UnauthorizedException();
  }
}
