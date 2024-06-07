import { BadRequestException, Injectable } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class AltWhatsappService {
  private clients: { [key: string]: Client } = {};

  // register client id with whatsapp and generate qr code 
  async registerClient(body, res): Promise<void> {
    const { clientId } = body;
    console.log(clientId);
    if (!clientId) {
      throw new BadRequestException('clientId is required');
    }
    if (this.clients[clientId]) {
      throw new BadRequestException(`Client ${clientId} already exists`);
    }

    const client = new Client({
      puppeteer: {
        headless: true,
      },
      authStrategy: new LocalAuth({
        clientId: clientId,
      }),

      // to update env
      webVersionCache: {
        type: 'remote',
        remotePath:
          'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      },
    });

    client.on('qr', (qr) => {
      console.log(`QR RECEIVED for ${clientId}`);
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', async () => {
      console.log(`Client ${clientId} is ready!`);
      const version = await client.getWWebVersion();
      console.log(`WhatsApp Web Version: ${version}`);
    });

    client.on('authenticated', () => {
      console.log(`Client ${clientId} authenticated`);
    });


    // will do it later for make whatsapp bot 
    client.on('message', async (message) => {
      try {
        if (message.from !== 'status@broadcast') {
          const contact = await message.getContact();
          console.log(`Message from ${contact.number}: ${message.body}`);
        }
      } catch (error) {
        console.error(`Error handling message: ${error.message}`);
      }
    });

    client.on('auth_failure', (msg) => {
      console.error(`Authentication failure for ${clientId}: ${msg}`);
    });

    client.on('disconnected', (reason) => {
      console.log(`Client ${clientId} was logged out: ${reason}`);
      delete this.clients[clientId];
    });

    this.clients[clientId] = client;
    await client.initialize();
  }


  // send meesage to whatspp number
  async sendMessage(body, res) {
    const { clientId, number, message } = body;
    if (!clientId || !number || !message)
      throw new BadRequestException(
        'clientId, number, and message are required',
      );

    const client = this.clients[clientId];
    if (!client) {
      throw new BadRequestException(`Client ${clientId} does not exist`);
    }
    try {
      await client.sendMessage(number, message);
      return res.send({ message: 'message sent succesfully' });
    } catch (error) {
      throw new BadRequestException(`Error sending message: ${error}`);
    }
  }
}
