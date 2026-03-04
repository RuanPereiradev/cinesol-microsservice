import { Module } from '@nestjs/common';
import { BookingServiceService } from './booking-service.service';
import { CreateBookingUseCase } from './useCases/createBookingUseCase';
import { PrismaBookingRepository } from './repositories/prisma/prismaBooking.repository';
import { BookingServiceController } from './web/controllers/booking-service.controller';
import { KafkaModule } from 'y/kafka';
import { DatabaseModule } from 'y/database';

@Module({
  imports: [
    KafkaModule.register('booking-service-group'),
    DatabaseModule
  ],
  controllers: [BookingServiceController],
  providers: [CreateBookingUseCase,
    {
      provide: 'IBookingRepository',
      useClass: PrismaBookingRepository
    }
  ],
})
export class BookingServiceModule {}
