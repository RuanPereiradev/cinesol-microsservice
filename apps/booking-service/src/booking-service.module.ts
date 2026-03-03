import { Module } from '@nestjs/common';
import { BookingServiceController } from './booking-service.controller';
import { BookingServiceService } from './booking-service.service';
import { CreateBookingUseCase } from './useCases/createBookingUseCase';
import { PrismaBookingRepository } from './repositories/prisma/prismaBooking.repository';

@Module({
  imports: [],
  controllers: [BookingServiceController],
  providers: [CreateBookingUseCase,
    {
      provide: 'IBookingRepository',
      useClass: PrismaBookingRepository
    }
  ],
})
export class BookingServiceModule {}
