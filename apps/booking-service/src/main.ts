import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './booking-service.module';
import { SERVICES_PORTS } from 'y/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }),
);

await app.listen(SERVICES_PORTS.BOOKING_SERVICE);
console.log(`Booking service is running on port ${SERVICES_PORTS.BOOKING_SERVICE}`)
}
bootstrap();
