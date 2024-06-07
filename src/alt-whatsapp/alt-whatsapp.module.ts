import { Module } from '@nestjs/common';
import { AltWhatsappService } from './alt-whatsapp.service';
import { AltWhatsappController } from './alt-whatsapp.controller';

@Module({
  controllers: [AltWhatsappController],
  providers: [AltWhatsappService],
})
export class AltWhatsappModule {}
