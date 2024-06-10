import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('public-jwt') implements CanActivate {
  constructor(private jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      await this.jwtService.verifyAsync(token, { secret: process.env.public_secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = (request.headers.authorization ?? '').split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
