// whatsapp-bot.service.ts

import { Injectable } from '@nestjs/common';
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
import { EventEmitter } from 'events';
import { LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class AppService {
  private client: any;
  

  constructor() {
    this.client = new Client({
      puppeteer: {
        headless: true,
      },
      authStrategy: new LocalAuth({
        clientId: "my-client",
      }),
    
      webVersionCache: {
        type: "remote",
        remotePath:
          "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
      },
    });

    this.client.on('qr',  (qrData) => {
         qrcode.generate(qrData, { small: true });
   
    });

    this.client.on('ready', () => {
      console.log('Client is ready!');
    });

    this.client.on('message', async (msg) => {
      if (msg.body == 'gjgj') {
        await msg.reply('pong');
      }
    });

    this.client.initialize();
  }
}
