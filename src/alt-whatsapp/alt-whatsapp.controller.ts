import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { AltWhatsappService } from './alt-whatsapp.service';
import { TokenAuthGuard } from 'src/instances/guards/token-auth.guard';

@Controller('alt-whatsapp')
export class AltWhatsappController {
  constructor(private readonly altWhatsappService: AltWhatsappService) {}

  @Post('/registerClient')
  async registerClient(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.registerClient(body, res);
  }

  @UseGuards(TokenAuthGuard)
  @Post('/sendMesssage')
  async sendMessage(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendMessage(body, res);
  }

  @UseGuards(TokenAuthGuard)
  @Post('/sendMedia')
  async sendMedia(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendMedia(body, res);
  }

  @Post('/sendButtons')
  async sendButtonsgroup(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendButtonGroup(body, res);
  }
}