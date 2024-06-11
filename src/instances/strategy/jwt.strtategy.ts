import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserToken } from '../schema/token.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'public-jwt') {
  constructor(
    @InjectModel(UserToken.name) private readonly userModel: Model<UserToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { userId } = payload;
    console.log('payload', payload);
    console.log(userId);
    const user = await this.userModel.findOne({ userId });
    console.log('user', user);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}