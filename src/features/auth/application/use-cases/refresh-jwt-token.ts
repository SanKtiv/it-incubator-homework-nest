import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshJwtToken {
  constructor(private readonly jwtService: JwtService) {}

  async create(userId: string, deviceId: string) {
    const payload = { sub: userId, deviceId: deviceId };

    return this.jwtService.signAsync(payload, { expiresIn: '20s' });
  }

  async verify(refreshToken: string) {
    try {
      return this.jwtService.verifyAsync(refreshToken);
    } catch (e) {
      return null;
    }
  }
}
