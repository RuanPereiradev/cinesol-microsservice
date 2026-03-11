import { Module } from '@nestjs/common';
import { BookingServiceService } from './booking-service.service';
import { CreateBookingUseCase } from './useCases/createBookingUseCase';
import { PrismaBookingRepository } from './repositories/prisma/prismaBooking.repository';
import { BookingServiceController } from './web/controllers/booking-service.controller';
import { KafkaModule } from 'y/kafka';
import { DatabaseModule } from 'y/database';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'y/common/guards/jwtAuthGuards';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'apps/auth-service/src/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    KafkaModule.register('booking-service-group'),
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
  }),
  ],
  controllers: [BookingServiceController],
  providers: [
    CreateBookingUseCase,
    {
      provide: 'IBookingRepository',
      useClass: PrismaBookingRepository
    },
    JwtStrategy
  ],
})
export class BookingServiceModule {}
