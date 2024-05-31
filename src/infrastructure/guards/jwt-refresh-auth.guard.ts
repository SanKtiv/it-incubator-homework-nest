import { AuthGuard } from '@nestjs/passport';

export class JWTRefreshAuthGuard extends AuthGuard('refreshToken') {}
