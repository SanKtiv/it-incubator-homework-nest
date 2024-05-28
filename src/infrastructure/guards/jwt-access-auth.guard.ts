import {AuthGuard} from "@nestjs/passport";

export class JWTAccessAuthGuard extends AuthGuard('accessToken') {}