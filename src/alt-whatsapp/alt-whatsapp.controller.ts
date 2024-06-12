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

  @UseGuards(TokenAuthGuard)
  @Post('/sendMessageReply')
  async sendMessageReply(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendMessageReply(body, res);
  }

  @UseGuards(TokenAuthGuard)
  @Post('/sendSeen')
  async sendSeen(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendSeen(body, res);
  }

  @UseGuards(TokenAuthGuard)
  @Post('/sendLocation')
  async sendLocation(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendLocation(body, res);
  }

  @UseGuards(TokenAuthGuard)
  @Post('/sendContact')
  async sendContact(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendContact(body, res);
  }

  @UseGuards(TokenAuthGuard)
  @Post('/sendContactCards')
  async sendContactCards(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendContactCards(body, res);
  }

  @UseGuards(TokenAuthGuard)
  @Post('/sendPoll')
  async sendPoll(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendPoll(body, res);
  }

  // This API to Validate User Number in Whatsapp
  @UseGuards(TokenAuthGuard)
  @Post('/validateNumber')
  async validateNumber(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.validateNumber(body, res);
  }

  // This Api getContact Info
  @UseGuards(TokenAuthGuard)
  @Post('/getContactInfo')
  async getContactInfo(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.getContactInfo(body, res);
  }


  @Post('/sendButtons')
  async sendButtonsgroup(@Body() body: any, @Res() res: Response) {
    await this.altWhatsappService.sendButtonGroup(body, res);
  }
}
