import { Module } from '@nestjs/common';
import { PaymentServiceController } from './payment-service.controller';
import { PaymentServiceService } from './payment-service.service';
import { KafkaModule } from 'y/kafka';
import { DatabaseModule } from 'y/database';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'apps/auth-service/src/jwt.strategy';

@Module({
  imports: [
    KafkaModule.register('payment-service-group'),
    PassportModule,
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
  ],
  controllers: [PaymentServiceController],
  providers: [PaymentServiceService, JwtStrategy],
})
export class PaymentServiceModule {}
