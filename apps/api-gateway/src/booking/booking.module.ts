import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { HttpModule } from '@nestjs/axios'; // <--- Importe aqui

@Module({
  imports: [HttpModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
