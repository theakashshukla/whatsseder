import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { PlansModule } from './plan/plan.module';
import { PaymentsModule } from './payment/payment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AltWhatsappModule } from './alt-whatsapp/alt-whatsapp.module';
import { InstancesModule } from './instances/instances.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.ENV === 'Local'
        ? 'mongodb://0.0.0.0:27017/DevWhatsTest'
        : process.env.DB_Prod_URL,
    ),
    AuthModule,
    ProductsModule,
    PlansModule,
    PaymentsModule,
    AltWhatsappModule,
    InstancesModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
