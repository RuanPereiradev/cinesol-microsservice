import { Module } from '@nestjs/common';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';
import { KafkaModule } from 'y/kafka';
import { DatabaseModule } from 'y/database';

@Module({
  imports: [
    KafkaModule.register('catalog-service-group'),
    DatabaseModule
  ],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService],
})
export class PaymentServiceModule {}
