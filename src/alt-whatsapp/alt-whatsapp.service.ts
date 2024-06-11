import { BadRequestException, Injectable } from '@nestjs/common';
import { Client, MessageMedia, RemoteAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';

@Injectable()
export class AltWhatsappService {
  private clients: { [key: string]: Client } = {};

  constructor() {
    this.initializeMongoConnection();
  }

  private async initializeMongoConnection() {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB connection already established');
    } else {
      mongoose.connection.once('open', () => {
        console.log('MongoDB connection established');
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(
          process.env.ENV === 'Local'
            ? 'mongodb://0.0.0.0:27017/DevWhatsTest'
            : process.env.DB_Prod_URL,
        );
      }
    }
  }

  async registerClient(body, res): Promise<void> {
    const { clientId } = body;
    console.log(clientId);
    if (!clientId) {
      return res.status(400).send('clientId is required');
    }
    if (this.clients[clientId]) {
      return res.status(400).send(`Client ${clientId} already exists`);
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).send('MongoDB connection is not established');
    }

    const store = new MongoStore({ mongoose: mongoose, collectionName: 'wwebjs_sessions'});
    console.log(store)
    const sessionExists = await store.sessionExists({ session: clientId });

    try {
      if (!sessionExists) {
        console.log(`Session for ${clientId} does not exist. Initializing new session...`);

        const client = new Client({
          puppeteer: {
            headless: true,
          },
          authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 60 * 1000,
          }),
          webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
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
        res.status(200).send(`Client ${clientId} is ready and a new session has been initialized.`);
      } else {
        console.log(`Session for ${clientId} already exists. Reinitializing client...`);
        await this.initializeClient(store, clientId); // Assuming initializeClient is implemented elsewhere
        res.status(200).send(`Client ${clientId} session was reinitialized.`);
      }
    } catch (error) {
      console.error(`Error during client initialization: ${error.message}`);
      res.status(500).send('An error occurred during client initialization.');
    }
  }


  private async initializeClient(store: typeof MongoStore, clientId: string): Promise<void> {
    const client = new Client({
      puppeteer: {
        headless: true,
      },
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 60 * 1000,
      }),
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      },
    });
  
    client.on('ready', async () => {
      console.log(`Client ${clientId} is ready!`);
      const version = await client.getWWebVersion();
      console.log(`WhatsApp Web Version: ${version}`);
    });
  
    client.on('authenticated', () => {
      console.log(`Client ${clientId} authenticated`);
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

  // create api for sending mediaifile to whatsapp number
  async sendMedia(body, res) {
    const { clientId, number, mediaUrl, caption } = body;
    if (!clientId || !number || !mediaUrl)
      throw new BadRequestException(
        'clientId, number, and mediaUrl are required',
      );

    const client = this.clients[clientId];
    if (!client) {
      throw new BadRequestException(`Client ${clientId} does not exist`);
    }
    try {
      const media = await MessageMedia.fromUrl(mediaUrl);
      await client.sendMessage(number, media, { caption: caption });
      return res.send({ message: 'media sent successfully' });
    } catch (error) {
      throw new BadRequestException(`Error sending media: ${error}`);
    }
  }
}
