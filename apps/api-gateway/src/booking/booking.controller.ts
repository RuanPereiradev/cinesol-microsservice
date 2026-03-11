import { Body, Controller, Post } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "y/common/dto/booking/createBooking.dto";

@Controller('booking')
export class BookingController{
    constructor(private readonly bookingService: BookingService){}

    @Post('register')
    create(@Body() createBookingDto: CreateBookingDto){
        return this.bookingService.register(createBookingDto,)
    }

}