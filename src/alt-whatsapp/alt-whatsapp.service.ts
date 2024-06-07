import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class AltWhatsappService {
  private clients: { [key: string]: Client } = {};
  private readonly logger = new Logger(AltWhatsappService.name);

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

      webVersionCache: {
        type: 'remote',
        remotePath:
          'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      },
    });

    client.on('qr', (qr) => {
      this.logger.log(`QR RECEIVED for ${clientId}`);
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', async () => {
      this.logger.log(`Client ${clientId} is ready!`);
      const version = await client.getWWebVersion();
      this.logger.log(`WhatsApp Web Version: ${version}`);
    });

    client.on('authenticated', () => {
      this.logger.log(`Client ${clientId} authenticated`);
    });
    console.log(this.clients);

    client.on('message', async (message) => {
      try {
        if (message.from !== 'status@broadcast') {
          const contact = await message.getContact();
          this.logger.log(`Message from ${contact.number}: ${message.body}`);
        }
      } catch (error) {
        this.logger.error(`Error handling message: ${error.message}`);
      }
    });

    client.on('auth_failure', (msg) => {
      this.logger.error(`Authentication failure for ${clientId}: ${msg}`);
    });

    client.on('disconnected', (reason) => {
      this.logger.log(`Client ${clientId} was logged out: ${reason}`);
      delete this.clients[clientId];
    });

    this.clients[clientId] = client;
    await client.initialize();
  }

  async sendMessage(body, res): Promise<void> {
    const { clientId, number, message } = body;
    if (!clientId || !number || !message)
      throw new BadRequestException(
        'clientId, number, and message are required',
      );

    const client = this.clients[clientId];
    console.log(client);
    if (!client) {
      throw new BadRequestException(`Client ${clientId} does not exist`);
    }
    console.log(this.clients[clientId]);
    try {
      await client.sendMessage(number, message);
      return res.send({ message: 'message sent succesfully' });
    } catch (error) {
      throw new BadRequestException(`Error sending message: ${error}`);
    }
  }
}
