import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Res() res: Response,
    @Req() req: Request,
    @Body(ValidationPipe) registerDto: RegisterDto,
  ) {
    return this.authService.register(res, registerDto);
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body(ValidationPipe) loginDto: LoginDto,
  ) {
    return this.authService.login(res, loginDto);
  }

  @Post('/getAllUser')
  async getAllUser(@Res() res:Response){
    return this.authService.getAllUsers(res)
  }
}