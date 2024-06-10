import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/auth.shcema';
import { AdminAuthGuard } from './gaurds/adminAuth.gaurd';

@Module({
  imports : [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configservice: ConfigService) => {
        return {
          secret: configservice.get<string>('ADMIN_SECRET'),
          signOptions: {
            expiresIn: configservice.get<string | number>('ADMIN_EXPIRE'),
          },
          name: 'admin-jwt',
        };
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[AdminAuthGuard]
})
export class AuthModule {}
