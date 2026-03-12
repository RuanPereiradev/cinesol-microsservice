import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { HttpModule } from '@nestjs/axios'; 
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "apps/auth-service/src/jwt.strategy";

@Module({
  imports: [HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret'
    })
  ],
  providers: [BookingService,
    JwtStrategy
  ],
  controllers: [BookingController]
})
export class BookingModule {}
