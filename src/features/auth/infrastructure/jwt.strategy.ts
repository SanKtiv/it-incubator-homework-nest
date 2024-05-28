import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
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
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refreshToken') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies.refreshToken;// or req.cookies['refreshToken']
    }
        return token;
    }]),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY || '',
        });
    }

    async validate(payload: { sub: string }) {
        return { userId: payload.sub };
    }
}