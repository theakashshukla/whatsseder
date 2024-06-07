import {
  Body,
  Controller,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthGuard } from './gaurds/adminAuth.gaurd';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(AdminAuthGuard)
  register(
    @Res() res: Response,
    @Req() req: Request,
    @Body(ValidationPipe) registerDto: RegisterDto,
  ) {
    return this.authService.register(res, req, registerDto);
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Req() req: Request,
    @Body(ValidationPipe) loginDto: LoginDto,
  ) {
    return this.authService.login(res, req, loginDto);
  }
}
