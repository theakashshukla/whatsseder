import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AltWhatsappService } from './alt-whatsapp.service';
import { AltWhatsappController } from './alt-whatsapp.controller';

@Module({
  imports: [
    MongooseModule.forFeature([])
  ],
  controllers: [AltWhatsappController],
  providers: [AltWhatsappService],
})
export class AltWhatsappModule {}
