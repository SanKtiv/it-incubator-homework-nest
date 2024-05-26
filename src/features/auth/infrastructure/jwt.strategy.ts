import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategyAccess extends PassportStrategy(Strategy, 'accessToken') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY || '',
        });
    }

    async validate(payload: { sub: string }) {
        return { userId: payload.sub };
    }
}

@Injectable()
export class JwtStrategyRefresh extends PassportStrategy(Strategy, 'refreshToken') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.,
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY || '',
        });
    }

    async validate(payload: { sub: string }) {
        return { userId: payload.sub };
    }
}