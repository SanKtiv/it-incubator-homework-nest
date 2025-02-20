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

  async getUserIdFromHeaders(header: string | undefined): Promise<string | null> {
    if (!header) return null;

    const token = header.split(' ')[1];

    try {
      const payload = await this.jwtService.verify(token);

      return payload.sub;
    } catch (e) {
      return null;
    }
  }
}
