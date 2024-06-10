import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strtategy';
import { AuthGuard } from './guards/token-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Instance, InstanceSchema } from './schema/instance.schema';
import { UserToken, UserTokenSchema } from './schema/token.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    MongooseModule.forFeature([
      { name: Instance.name, schema: InstanceSchema },
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
  ],
  controllers: [InstancesController],
  providers: [InstancesService, JwtStrategy, AuthGuard],
})
export class InstancesModule {}
