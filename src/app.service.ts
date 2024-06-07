// whatsapp-bot.service.ts

import { Injectable } from '@nestjs/common';
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

@Injectable()
export class AppService {
  private client: any;
}
