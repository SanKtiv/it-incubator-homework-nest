import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

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

// const cookieExtractor = function(req: Request) {
//     let token = null;
//     if (req && req.cookies) {
//         token = req.cookies['jwt'];
//     }
//     return token;
// }

@Injectable()
export class JwtStrategyRefresh extends PassportStrategy(Strategy, 'refreshToken') {
    constructor() {
        super({
            //jwtFromRequest: cookieExtractor(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY || '',
        });
    }

    async validate(payload: { sub: string }) {
        return { userId: payload.sub };
    }
}