import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AltWhatsappService } from './alt-whatsapp.service';

@Controller('alt-whatsapp')
export class AltWhatsappController {
  constructor(private readonly altWhatsappService: AltWhatsappService) {}


  @Post('/registerClient')
  async registerClient(@Body() body: any,@Res() res:Response) {
    await this.altWhatsappService.registerClient(body,res);
  }
  

  @Post("/sendMesssage")
  async sendMessage(@Body() body: any,@Res() res:Response) {
    await this.altWhatsappService.sendMessage(body,res);
  }


}
