import { PartialType } from '@nestjs/mapped-types';
import { CreateAltWhatsappDto } from './create-alt-whatsapp.dto';

export class UpdateAltWhatsappDto extends PartialType(CreateAltWhatsappDto) {}
