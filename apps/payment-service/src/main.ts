import { NestFactory } from '@nestjs/core';
import { PaymentServiceModule } from './payment-service.module';
import { ValidationPipe } from '@nestjs/common';
import { SERVICES_PORTS } from 'y/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(SERVICES_PORTS.PAYMENT_SERVICE);
  console.log(`Catalog Service is running on port ${SERVICES_PORTS.PAYMENT_SERVICE}`)
}
bootstrap();
