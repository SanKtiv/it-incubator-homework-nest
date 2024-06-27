import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessJwtToken {
  constructor(private readonly jwtService: JwtService) {}

  async create(userId: string) {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10s',
    });

    return { accessToken: accessToken };
  }

  async verify(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken);
    } catch (e) {
      return undefined;
    }
  }
}
